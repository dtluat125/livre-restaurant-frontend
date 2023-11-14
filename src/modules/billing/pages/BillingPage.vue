<template>
    <div class="content-wrapper filter-wrapper">
        <FilterForm />
    </div>

    <div class="content-wrapper">
        <BillingTable />
    </div>
    <BillingPopup />
</template>

<script lang="ts">
import { UtilMixins } from '@/mixins/utilMixins';
import { mixins } from 'vue-property-decorator';
import { Options } from 'vue-class-component';
import BillingTable from '../components/BillingTable.vue';
import BillingPopup from '../components/BillingFormPopup.vue';
import FilterForm from '../components/FilterForm.vue';
import { billingModule } from '../store';
import { DEFAULT_FIRST_PAGE, LIMIT_PER_PAGE } from '@/common/constants';
import { ElLoading } from 'element-plus';
import { PermissionActions, PermissionResources } from '@/modules/role/constants';
import { checkUserHasPermission } from '@/utils/helper';

@Options({
    components: { FilterForm, BillingTable, BillingPopup },
})
export default class BillingPage extends mixins(UtilMixins) {
    isShowSearchBox = true;
    isToggleFilterForm = true;

    // check permission
    get isCanCreate(): boolean {
        return checkUserHasPermission(billingModule.userPermissions, [
            `${PermissionResources.BILLING}_${PermissionActions.CREATE}`,
        ]);
    }

    get selectedPage(): number {
        return billingModule.billingQueryString?.page || DEFAULT_FIRST_PAGE;
    }

    set selectedPage(value: number) {
        billingModule.billingQueryString.page = value;
    }

    get keyword(): string {
        return billingModule.billingQueryString?.keyword || '';
    }

    set keyword(value: string) {
        billingModule.billingQueryString.keyword = value;
    }

    created(): void {
        billingModule.clearBillingQueryString();
        this.fetchData();
    }

    async fetchData(): Promise<void> {
        const loading = ElLoading.service({});
        await billingModule.getBillingList();
        loading.close();
    }

    toggleFilterForm(): void {
        this.isToggleFilterForm = !this.isToggleFilterForm;
    }

    async getBillingList(): Promise<void> {
        const loading = ElLoading.service({
            target: '.content',
        });
        await billingModule.getBillingList();
        loading.close();
    }

    async handleFilter(): Promise<void> {
        billingModule.setBillingQueryString({
            page: DEFAULT_FIRST_PAGE,
            limit: LIMIT_PER_PAGE,
            keyword: this.keyword?.trim(),
        });
        await this.getBillingList();
    }

    async handlePaginate(): Promise<void> {
        billingModule.setBillingQueryString({
            page: this.selectedPage,
        });
        this.getBillingList();
    }
}
</script>

<style lang="scss" scoped>
.content-wrapper {
    margin: 20px 25px;
    padding: 30px 25px;
    background-color: white;
    border-radius: 15px;
}

.filter-wrapper {
    margin-top: 0;
}
</style>
