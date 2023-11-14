<template>
    <div class="content-wrapper filter-wrapper">
        <FilterForm />
    </div>

    <div class="content-wrapper">
        <ReportRevenueTable />
    </div>
    <ReportRevenuePopup />
</template>

<script lang="ts">
import { UtilMixins } from '@/mixins/utilMixins';
import { mixins } from 'vue-property-decorator';
import { Options } from 'vue-class-component';
import ReportRevenueTable from '../components/ReportRevenueTable.vue';
import ReportRevenuePopup from '../components/ReportRevenueFormPopup.vue';
import FilterForm from '../components/FilterForm.vue';
import { DEFAULT_FIRST_PAGE, LIMIT_PER_PAGE } from '@/common/constants';
import { ElLoading } from 'element-plus';
import { PermissionActions, PermissionResources } from '@/modules/role/constants';
import { checkUserHasPermission } from '@/utils/helper';
import { reportRevenueModule } from '../store';

@Options({
    components: {
        FilterForm,
        ReportRevenueTable,
        ReportRevenuePopup,
    },
})
export default class ReportRevenuesPage extends mixins(UtilMixins) {
    isShowSearchBox = true;
    isToggleFilterForm = true;

    // check permission
    get isCanCreate(): boolean {
        return checkUserHasPermission(reportRevenueModule.userPermissions, [
            `${PermissionResources.REPORT_REVENUE}_${PermissionActions.CREATE}`,
        ]);
    }

    get keyword(): string {
        return reportRevenueModule.reportRevenueQueryString?.keyword || '';
    }

    set keyword(value: string) {
        reportRevenueModule.reportRevenueQueryString.keyword = value;
    }

    created(): void {
        reportRevenueModule.clearQueryString();
        this.fetchData();
    }

    async fetchData(): Promise<void> {
        const loading = ElLoading.service({});
        Promise.all([reportRevenueModule.getReportRevenueList()]);
        loading.close();
    }

    toggleFilterForm(): void {
        this.isToggleFilterForm = !this.isToggleFilterForm;
    }

    async getReportRevenueList(): Promise<void> {
        const loading = ElLoading.service({
            target: '.content',
        });
        await reportRevenueModule.getReportRevenueList();
        loading.close();
    }

    async handleFilter(): Promise<void> {
        reportRevenueModule.setReportRevenueQueryString({
            page: DEFAULT_FIRST_PAGE,
            limit: LIMIT_PER_PAGE,
            keyword: this.keyword?.trim(),
        });
        await this.getReportRevenueList();
    }

    onClickButtonCreate(): void {
        reportRevenueModule.setIsShowReportRevenueFormPopUp(true);
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
