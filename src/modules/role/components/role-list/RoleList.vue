<template>
    <div class="card">
        <div class="card-header d-flex">
            <h4 class="my-0 align-self-center">
                {{ roleTitle }}
            </h4>
            <el-tooltip
                effect="dark"
                :content="$t('common.app.tooltip.addRole')"
                placement="top"
                :hide-after="0"
                v-if="canCreate"
                :visible-arrow="false"
            >
                <el-button
                    type="primary"
                    plain
                    size="mini"
                    class="btn-add-role align-self-center"
                    @click="addRole"
                >
                    <el-icon>
                        <CirclePlusFilled />
                    </el-icon>
                </el-button>
            </el-tooltip>
        </div>
        <div class="card-body">
            <FilterForm v-model:value="keyword" />
            <el-scrollbar class="sidebar-content">
                <div
                    :class="{ 'role-name-wrapper': true, 'is-active': isActive(role) }"
                    v-for="(role, index) in filteredRoles"
                    :key="index"
                >
                    <RoleItem @onClickRole="onClickRole(role)" :role="role" />
                </div>
                <el-empty v-if="!filteredRoles.length"></el-empty>
            </el-scrollbar>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { roleModule } from '../../store';
import { IRole } from '../../types';
import RoleItem from '../role-form/RoleItem.vue';
import FilterForm from './FilterForm.vue';
import { ElLoading } from 'element-plus';
import { CirclePlusFilled } from '@element-plus/icons-vue';
import { vietnameseStringInclude } from '@/utils/commonFunction';
import { PermissionActions, PermissionResources } from '@/modules/role/constants';
import { checkUserHasPermission } from '@/utils/helper';

@Options({
    components: {
        RoleItem,
        FilterForm,
        CirclePlusFilled,
    },
})
export default class RoleList extends Vue {
    keyword = '';

    get roleTitle(): string {
        return this.$t('role.list.pageName.roleList');
    }

    get filteredRoles(): IRole[] {
        // TODO add debounce to filter
        return roleModule.roles.filter((role) =>
            vietnameseStringInclude(role.name, this.keyword),
        );
    }

    get canCreate(): boolean {
        return checkUserHasPermission(roleModule.userPermissions, [
            `${PermissionResources.ROLE}_${PermissionActions.CREATE}`,
        ]);
    }

    async onClickRole(role: IRole): Promise<void> {
        const loading = ElLoading.service({ target: '.page-content' });
        await roleModule.getRole(role.id as number);
        loading.close();
    }

    addRole(): void {
        roleModule.setRole({ ...roleModule.initRole });
    }

    isActive(role: IRole): boolean {
        return role.id === roleModule.role.id;
    }
}
</script>

<style lang="scss" scoped>
.heading {
    padding: 0px 16px;
}
.card-body {
    padding: 16px 0px 0px !important;
}
.card {
    height: 100%;
    border-radius: 8px;
}
.sidebar-content {
    overflow-x: auto;
    max-height: calc(100vh - 304px);
    margin: 0px 16px 0px 16px;
}
.is-active {
    background-color: #eceffc !important;
}
.role-name-wrapper {
    min-height: 34px;
    display: flex;
    align-items: center;
    height: auto;
    margin-bottom: 5px;
    border: 1px solid #f1f5fa;
    background: #fff;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
        background: #f5f7fa;
    }
}
.role-name {
    padding-left: 20px;
}
.btn-add-role {
    margin-left: 2px;
    margin-top: 4px !important;
    padding: 0 !important;
    width: 18px !important;
    height: 22px !important;
    background: transparent;
    border: 0px;
    color: #2396d9 !important;
    .el-icon {
        font-size: 18px !important;
    }
    &:hover {
        background: transparent !important;
        color: #3c61e0 !important;
    }
    &:focus {
        background: transparent !important;
        color: #2396d9 !important;
    }
}
.card-header {
    background: transparent;
    min-height: 55px;
    h4 {
        font-size: 16px;
        margin-right: auto !important;
    }
}
</style>
