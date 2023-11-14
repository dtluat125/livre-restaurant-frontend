<template>
    <el-dialog
        width="50%"
        v-model="isShowBookingsOfTablePopup"
        destroy-on-close
        @closed="closePopup"
        custom-class="booking-list-of-table-popup"
    >
        <template #title>
            <h3 class="text-left">
                {{ $t('tableDiagram.table.bookingsOfTablePopup.title') }}
            </h3>
        </template>
        <BaseTableLayout
            :data="bookingTableDetailList"
            :totalItems="bookingTableDetailList.length"
            class="table-detail-booking-table-data"
        >
            <template #table-columns>
                <el-table-column align="center" label="#" type="index" width="50">
                </el-table-column>
                <el-table-column
                    prop="name"
                    :label="$t('tableDiagram.table.bookingsOfTablePopup.customerName')"
                    class="test"
                >
                    <template #default="scope">
                        {{ scope.row.nameCustomer }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    :label="$t('tableDiagram.table.bookingsOfTablePopup.customerPhone')"
                    class="test"
                >
                    <template #default="scope">
                        {{ scope.row.phone }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="arrivalTime"
                    :label="$t('tableDiagram.table.bookingsOfTablePopup.arrivalTime')"
                >
                    <template #default="scope">
                        {{
                            scope.row.arrivalTime
                                ? parseDateTime(
                                      scope.row.arrivalTime,
                                      YYYY_MM_DD_HYPHEN_HH_MM_COLON,
                                  )
                                : ''
                        }}
                    </template>
                </el-table-column>
            </template>
        </BaseTableLayout>
    </el-dialog>
</template>

<script lang="ts">
import { UtilMixins } from '@/mixins/utilMixins';
import { bookingModule } from '@/modules/booking/store';
import { IBooking } from '@/modules/booking/types';
import { mixins, Options } from 'vue-property-decorator';
import TableDiagram from '../../table-diagram/components/TableDiagram.vue';
import { tableDiagramModule } from '../store';
@Options({
    name: 'booking-list-of-table-popup',
    components: {
        TableDiagram,
    },
})
export default class BookingListOfTablePopup extends mixins(UtilMixins) {
    get bookingTableDetailList(): IBooking[] {
        return bookingModule.bookingTableDetailList;
    }

    get isShowBookingsOfTablePopup(): boolean {
        return tableDiagramModule.isShowBookingsOfTablePopup || false;
    }

    async closePopup(): Promise<void> {
        tableDiagramModule.setIsShowBookingsOfTablePopup(false);
        tableDiagramModule.setTableSelected(null);
    }
}
</script>
<style lang="scss" scoped>
.text-left {
    text-align: left;
}

:deep(.el-input-number .el-input__inner) {
    width: 100%;
    margin-bottom: 15px;
    height: 36px !important;
}
</style>
