<template>
    <div class="edit-page">
        <div class="card-header d-flex">
            <h4 v-if="!isCreate" class="my-0 align-self-center">
                {{ $t('role.list.pageName.roleInfo') }}
            </h4>
            <h4 v-else class="my-0 align-self-center">
                {{ $t('role.list.createPage.title') }}
            </h4>
            <div class="align-self-center" v-if="canCreate">
                <el-button size="mini" type="primary" @click="onClickCreateButton">
                    {{ $t('common.app.buttons.save') }}
                </el-button>
            </div>
        </div>
        <div class="card">
            <div class="card-body row pb-0">
                <div class="row form-group d-flex">
                    <BaseInputText
                        :label="$t('role.list.createPage.inputLabelName')"
                        :isRequired="true"
                        v-model:value="form.name"
                        :placeholder="$t('role.list.createPage.placeholder.name')"
                        :error="translateYupError(form.errors.name)"
                        :isHorizontal="true"
                        :class="{ 'is-focus': isFocus }"
                    />
                </div>
                <div class="row form-group d-flex">
                    <BaseInputTextarea
                        :label="$t('role.list.createPage.description')"
                        v-model:value="form.description"
                        :isHorizontal="true"
                        :placeholder="$t('role.list.createPage.placeholder.description')"
                        :error="translateYupError(form.errors.description)"
                        :class="{ 'is-focus': isFocus }"
                    />
                </div>
            </div>
        </div>
    </div>
    <div class="card content">
        <div class="card-body row pb-0 pt-0">
            <Permission
                v-model:value="selectedPermissionIds"
                :error="form.errors.permissionIds"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { mixins, Watch } from 'vue-property-decorator';
import { UtilMixins } from '@/mixins/utilMixins';
import { Options, setup } from 'vue-class-component';
import Permission from '../role-form/Permission.vue';

import RoleHeader from '../role-form/RoleHeader.vue';
import { roleModule } from '../../store';
import { permisionForm } from '../../composition/form';
import { IRole } from '../../types';
import { PermissionActions, PermissionResources } from '../../constants';
import { checkUserHasPermission } from '@/utils/helper';

@Options({
    components: {
        RoleHeader,
        Permission,
    },
})
export default class RoleForm extends mixins(UtilMixins) {
    // list all of node ids in tree ui, this property is immutable
    permissionIds: number[] = [];

    form = setup(() => permisionForm());

    get selectedPermissionIds(): number[] {
        return this.form.permissionIds as number[];
    }

    set selectedPermissionIds(value: number[]) {
        if (value.length === 0) {
            this.form.resetPermissionIds();
        } else {
            this.form.setPermissionIds(value);
        }
    }

    get canCreate(): boolean {
        return checkUserHasPermission(roleModule.userPermissions, [
            `${PermissionResources.ROLE}_${PermissionActions.CREATE}`,
        ]);
    }

    get role(): IRole {
        return roleModule.role;
    }

    get isCreate(): boolean {
        return !roleModule.role.id;
    }

    async onClickCreateButton(): Promise<void> {
        const result = await this.form.onSubmit();
        if (!result) {
            (document.getElementById('permission-form') as Element).scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
    }

    @Watch('role')
    onChangeRole(): void {
        // set data
        this.form.setForm({
            ...this.form.initValue,
            name: this.role.name,
            description: this.role.description,
        });
        if (!this.isCreate) {
            const listIds: number[] = [];
            this.role.permissions.forEach((item) => {
                listIds.push(item.id);
            });
            this.selectedPermissionIds = listIds;
        }
        (document.getElementById('permission-form') as Element).scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }
}
</script>

<style lang="scss" scoped>
.card {
    border-radius: 8px;
    border: none;
}
.card-header {
    background: transparent;
    min-height: 55px;
    h4 {
        font-size: 16px;
        margin-right: auto !important;
    }
}
.content {
    background: transparent;
}
:deep(.col-lg-3) {
    padding-top: 10px;
    text-align: right !important;
    @media (max-width: 992px) {
        text-align: left !important;
    }
}
.mark-required {
    color: red;
}
:deep(.form-group) {
    label {
        text-align: right !important;
        padding-right: 50px;
    }
    .w-70 {
        max-width: 45vw !important;
    }
}
:deep(.el-checkbox) {
    .is-checked {
        .el-checkbox__inner {
            background-color: #2396d9;
        }
    }
}
</style>
