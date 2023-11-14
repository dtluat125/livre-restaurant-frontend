<template>
    <div class="content-wrapper">
        <div class="row row-content">
            <!-- Sub right side bar -->
            <div class="col-3">
                <RoleList />
            </div>
            <!-- Main-content -->
            <div class="col-9">
                <div class="layout-information-role">
                    <RoleForm />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { UtilMixins } from '@/mixins/utilMixins';
import { mixins } from 'vue-property-decorator';
import { Options } from 'vue-class-component';
import RoleList from '../components/role-list/RoleList.vue';
import { roleModule } from '../store';
import { ElLoading } from 'element-plus';
import RoleForm from '../components/role-list/RoleForm.vue';

@Options({
    components: {
        RoleList,
        RoleForm,
    },
})
export default class RoleListPage extends mixins(UtilMixins) {
    async created(): Promise<void> {
        const loading = ElLoading.service({
            target: '.content',
        });
        await Promise.all([roleModule.getRoles(), roleModule.getPermissionList()]);
        if (roleModule.roles.length > 0) {
            await roleModule.getRole(roleModule.roles[0]?.id as number);
        }
        loading.close();
    }
}
</script>
<style lang="scss" scoped>
.row-content {
    padding: 10px;
}
.col-3 {
    width: 25%;
    padding: 5px 20px 0px 20px;
}
.col-9 {
    padding: 5px 20px 0px 0px;
    .layout-information-role {
        border: 1px #e0e0e0 solid;
        border-radius: 8px;
        background: white;
    }
}
</style>
