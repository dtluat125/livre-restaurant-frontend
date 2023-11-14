<template>
    <div class="form-group d-flex">
        <label class="text-end fw-bold mb-2 w-30 label-input">
            {{ $t('role.list.form.permission.label') }}
            <span style="color: red">*</span>
        </label>
        <div class="w-70 permission-container" id="permission-form">
            <div class="check-all-button position-relative">
                <el-checkbox
                    v-model="checkAll"
                    @change="onCheckAll"
                    class="check-all"
                    :label="$t('role.list.common.headerTable.all')"
                ></el-checkbox>
                <div class="invalid-feedback text-start d-block" v-show="error">
                    {{ error ? $t(error) : '' }} &nbsp;
                </div>
            </div>
            <div class="p-0">
                <div class="block">
                    <el-tree
                        :data="permissionTree"
                        show-checkbox
                        node-key="id"
                        default-expand-all
                        :props="defaultProps"
                        :expand-on-click-node="false"
                        @check="onCheckNode"
                        ref="refPermissionTree"
                    >
                        <template #default="{ data }">
                            <div v-if="!data.children">
                                {{ data.name ? $t(roleName(data.name)) : '' }}
                            </div>
                            <div v-else>
                                {{ data.name ? $t(data.name) : '' }}
                            </div>
                        </template>
                    </el-tree>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import camelCase from 'lodash/camelCase';
import compact from 'lodash/compact';
import remove from 'lodash/remove';
import { Vue } from 'vue-class-component';
import { Model, Prop, Watch } from 'vue-property-decorator';
import { PermissionActions, personalPermissionSuffix } from '../../constants';
import { roleModule } from '../../store';
import {
    IPermission,
    IPermissionTree,
    IRole,
    ITreeStatus,
    PermissionTree,
} from '../../types';

export default class Permission extends Vue {
    defaultProps = {
        label: 'name',
        children: 'children',
    };

    @Prop({ type: String, default: '' })
    readonly error!: string;

    @Model('value')
    selectedPermissionIds!: number[];

    checkAll = false;

    roleName(name: string): string {
        return `role.list.common.headerTable.${camelCase(name)}`;
    }

    get permissionList(): IPermission[] {
        return roleModule.permissionList;
    }

    get permissionIds(): number[] {
        const results: number[] = [];
        this.permissionList.forEach((permission) => {
            permission.actions.forEach((action) => {
                results.push(action.permissionId);
            });
        });

        return results;
    }

    get permissionTree(): IPermissionTree[] {
        if (this.permissionList.length === 0) {
            return [];
        }

        const permissions: IPermissionTree[] = [];
        this.permissionList.forEach((permission) => {
            const temp: IPermissionTree = {
                resource: permission.resource,
                children: [],
                name: `role.list.common.headerTable.module.${camelCase(
                    permission.resource,
                )}`,
            };
            permission.actions.forEach((action) => {
                (temp.children as IPermissionTree[]).push({
                    name: action.action,
                    id: action.permissionId,
                    resource: permission.resource,
                });
            });
            permissions.push(temp);
        });
        return permissions;
    }

    get treeRef(): PermissionTree {
        return this.$refs.refPermissionTree as PermissionTree;
    }

    get role(): IRole {
        return roleModule.role;
    }

    // user click check all button
    onCheckAll(): void {
        // checked all
        if (this.checkAll) {
            this.selectedPermissionIds = [];
            this.permissionIds.forEach((item) => {
                this.treeRef.setChecked(item, true, false);
            });
            this.selectedPermissionIds = this.permissionIds;
        } else {
            // unchecked all
            this.permissionIds.forEach((id) => {
                this.treeRef.setChecked(id, false, false);
            });
            this.selectedPermissionIds = [];
        }
    }

    // update status of check all button
    updateCheckAllStatus(): void {
        if (this.selectedPermissionIds.length !== this.permissionIds.length) {
            this.checkAll = false;
        } else {
            this.checkAll = true;
        }
    }

    onCheckNode(node: IPermissionTree, status: ITreeStatus): void {
        const selectedPermissionIds = compact(status.checkedNodes.map((item) => item.id));
        // check if this node isn't node having read action then check the node with read action in the same resource (parent)
        if (node.id) {
            // find permissionId of read & other actions
            const selectedResource = this.permissionList.find(
                (permission) => node.resource === permission.resource,
            );
            let isPersonalPermission = false;
            if (node.name.includes(personalPermissionSuffix)) {
                isPersonalPermission = true;
            }

            const readPermissionId =
                (selectedResource?.actions || []).find(
                    (action) => action.action === PermissionActions.READ,
                )?.permissionId || NaN;

            const remainPermissionIds = (selectedResource?.actions || [])
                .filter((action) => action.action !== PermissionActions.READ)
                .map((action) => action.permissionId);

            if (!isNaN(readPermissionId)) {
                if (
                    node.id !== readPermissionId &&
                    !selectedPermissionIds.includes(readPermissionId) &&
                    // if check
                    selectedPermissionIds.includes(node.id)
                ) {
                    selectedPermissionIds.push(readPermissionId);
                }
                // if uncheck node with read action, then uncheck all remain nodes in same resource (parent)
                if (
                    node.id === readPermissionId &&
                    // if uncheck
                    !selectedPermissionIds.includes(readPermissionId)
                ) {
                    remove(selectedPermissionIds, (id: number) => {
                        const permission = status.checkedNodes.find(
                            (item) => item.id === id,
                        );
                        if (
                            (isPersonalPermission &&
                                permission?.name.includes(personalPermissionSuffix)) ||
                            (!isPersonalPermission &&
                                !permission?.name.includes(personalPermissionSuffix))
                        ) {
                            return remainPermissionIds?.includes(id);
                        }
                        return false;
                    });
                }
            }
        }
        this.selectedPermissionIds = selectedPermissionIds;
    }

    @Watch('selectedPermissionIds')
    onChangeSelectedPermissionIds(): void {
        // unchecked all
        this.permissionIds.forEach((id) => {
            this.treeRef.setChecked(id, false, false);
        });
        // check nodes that indicate the permission of role
        this.selectedPermissionIds.forEach((id) => {
            this.treeRef.setChecked(id as number, true, false);
        });
        this.$nextTick(() => {
            this.updateCheckAllStatus();
        });
    }
}
</script>

<style lang="scss" scoped>
.error-text {
    color: #f5325c;
    font-size: 13px;
}
.block {
    background: transparent !important;
}
.permission-container {
    padding-left: 10px;
    overflow: auto;
    max-height: calc(100vh - 455px);
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    margin: 0px;
    padding: 0px 16px 0px 16px;
    .el-tree {
        background: transparent;
        margin-right: 24px;
    }

    &::-webkit-scrollbar {
        width: 10px;
    }

    /* Track */
    &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px rgba(222, 223, 255, 0.5);
        border-radius: 10px;
    }

    /* Handle */
    &::-webkit-scrollbar-thumb {
        background: rgba(222, 223, 255, 0.9);
        border-radius: 10px;
    }
}
.check-all-button {
    margin-bottom: 20px;
    text-align: left;
    :deep(.el-checkbox) {
        padding-left: 0;
    }
}
.w-30 {
    word-break: break-word;
    width: calc(30% - 7px);
}
.w-70 {
    width: calc(70% - 15px);
}
.label-input {
    padding-right: 48px;
}
.el-checkbox {
    padding-left: 6px;
}
</style>
