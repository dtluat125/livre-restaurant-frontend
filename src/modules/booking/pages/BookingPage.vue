<template>
    <div class="content-wrapper filter-wrapper">
        <FilterForm />
    </div>

    <div class="content-wrapper">
        <BookingTable />
    </div>
    <BookingFormPopup />
    <SetupTableOfBookingPopup />
</template>

<script lang="ts">
import { DEFAULT_FIRST_PAGE } from '@/common/constants';
import { PermissionResources, PermissionActions } from '@/modules/role/constants';
import { checkUserHasPermission } from '@/utils/helper';
import { ElLoading } from 'element-plus';
import { Options, Vue } from 'vue-class-component';
import BookingTable from '../components/BookingTable.vue';
import { bookingModule } from '../store';
import FilterForm from '../components/FilterForm.vue';
import BookingFormPopup from '../components/BookingFormPopup.vue';
import SetupTableOfBookingPopup from '../components/SetupTableOfBookingPopup.vue';

@Options({
    components: {
        BookingTable,
        FilterForm,
        BookingFormPopup,
        SetupTableOfBookingPopup,
    },
})
export default class BookingPage extends Vue {
    isToggleFilterForm = true;

    get totalBookings(): number {
        return bookingModule.totalBookings;
    }

    // check permission
    get isCanCreate(): boolean {
        return checkUserHasPermission(bookingModule.userPermissions, [
            `${PermissionResources.BOOKING}_${PermissionActions.CREATE}`,
        ]);
    }

    get selectedPage(): number {
        return bookingModule.bookingQueryString?.page || DEFAULT_FIRST_PAGE;
    }

    set selectedPage(value: number) {
        bookingModule.bookingQueryString.page = value;
    }

    get isShowSetupTableOfBookingPopup(): boolean {
        return bookingModule.isShowSetupTableOfBookingPopup;
    }

    created(): void {
        bookingModule.clearBookingQueryString();
        this.getBookingList();
    }

    async getBookingList(): Promise<void> {
        const loading = ElLoading.service({
            target: '.content',
        });
        await bookingModule.getBookings();
        loading.close();
    }

    async handlePaginate(): Promise<void> {
        bookingModule.setBookingQueryString({ page: this.selectedPage });
        this.getBookingList();
    }

    toggleFilterForm(): void {
        this.isToggleFilterForm = !this.isToggleFilterForm;
    }

    onClickButtonCreate(): void {
        bookingModule.setIsShowBookingFormPopUp(true);
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
