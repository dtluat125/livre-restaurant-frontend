<template>
    <BaseSingleSelect
        v-model:value="floor"
        :options="FloorOptions"
        :label="$t('tableDiagram.table.floorOptions.label')"
        :placeholder="$t('tableDiagram.table.floorOptions.placeholder')"
        @change="changeFloor"
        style="width: 25%"
    />

    <el-scrollbar>
        <div class="d-flex justify-content-around" v-if="floor === FloorRestaurant.FIRST">
            <div style="width: 1100px">
                <div class="mt-4 d-flex justify-content-around align-items-center">
                    <img
                        class="decorations"
                        src="../../../assets/icons/table-diagram/window-icon.svg"
                    />
                    <img
                        class="img-item"
                        src="../../../assets/icons/table-diagram/glass-door-icon.svg"
                    />
                    <img
                        class="decorations"
                        src="../../../assets/icons/table-diagram/window-icon.svg"
                    />
                </div>
                <div class="d-flex flex-row justify-content-around">
                    <div class="p-1 d-flex flex-column justify-content-around">
                        <img
                            class="decorations"
                            src="../../../assets/icons/table-diagram/window-icon.svg"
                        />

                        <img
                            class="decorations"
                            src="../../../assets/icons/table-diagram/plant-2.svg"
                        />

                        <img
                            class="decorations"
                            src="../../../assets/icons/table-diagram/window-icon.svg"
                        />
                    </div>
                    <div class="p-10 list-table">
                        <TablesRestaurants
                            v-for="(table, index) in tableList"
                            :key="index"
                            :table="table"
                        />
                    </div>
                    <div class="p-1 d-flex flex-column justify-content-around">
                        <img
                            class="decorations"
                            src="../../../assets/icons/table-diagram/plant-1.svg"
                        />
                        <img
                            class="decorations"
                            src="../../../assets/icons/table-diagram/window-icon.svg"
                        />
                        <img
                            class="decorations"
                            src="../../../assets/icons/table-diagram/plant-4.svg"
                        />
                    </div>
                </div>

                <div class="d-flex justify-content-around">
                    <img
                        class="img-item"
                        src="../../../assets/icons/table-diagram/kitchen-room.svg"
                    />
                    <img
                        class="img-item"
                        src="../../../assets/icons/table-diagram/cash-machine.svg"
                    />

                    <img
                        class="img-item"
                        src="../../../assets/icons/table-diagram/stair-climbing-icon.svg"
                    />
                </div>
            </div>
        </div>

        <div
            class="d-flex justify-content-around"
            v-if="floor === FloorRestaurant.SECOND"
        >
            <div style="width: 1100px">
                <div class="mt-4 d-flex justify-content-around align-items-center">
                    <img
                        class="img-item"
                        src="../../../assets/icons/table-diagram/balcony-icon.svg"
                    />
                    <img
                        class="img-item"
                        src="../../../assets/icons/table-diagram/balcony-icon.svg"
                    />
                </div>
                <div class="d-flex flex-row justify-content-around">
                    <div class="p-1 d-flex flex-column justify-content-around">
                        <img
                            class="decorations"
                            src="../../../assets/icons/table-diagram/window-icon.svg"
                        />

                        <img
                            class="decorations"
                            src="../../../assets/icons/table-diagram/window-icon.svg"
                        />
                    </div>
                    <div class="p-10 list-table">
                        <TablesRestaurants
                            v-for="(table, index) in tableList"
                            :key="index"
                            :table="table"
                        />
                    </div>
                    <div class="p-1 d-flex flex-column justify-content-around">
                        <img
                            class="decorations"
                            src="../../../assets/icons/table-diagram/plant-1.svg"
                        />
                        <img
                            class="decorations"
                            src="../../../assets/icons/table-diagram/window-icon.svg"
                        />
                        <img
                            class="decorations"
                            src="../../../assets/icons/table-diagram/plant-4.svg"
                        />
                    </div>
                </div>

                <div class="d-flex justify-content-around">
                    <img
                        class="decorations"
                        src="../../../assets/icons/table-diagram/plant-2.svg"
                    />
                    <img
                        class="decorations"
                        src="../../../assets/icons/table-diagram/window-icon.svg"
                    />
                    <img
                        class="decorations"
                        src="../../../assets/icons/table-diagram/plant-5.svg"
                    />
                    <img
                        class="img-item"
                        src="../../../assets/icons/table-diagram/stair-climbing-icon.svg"
                    />
                </div>
            </div>
        </div>

        <div class="d-flex justify-content-around" v-if="floor === FloorRestaurant.THIRD">
            <div style="width: 1100px">
                <div class="mt-4 d-flex justify-content-around align-items-center">
                    <img
                        class="decorations"
                        src="../../../assets/icons/table-diagram/window-icon.svg"
                    />
                    <img
                        class="decorations"
                        src="../../../assets/icons/table-diagram/window-icon.svg"
                    />
                </div>
                <div class="d-flex flex-row justify-content-around">
                    <div class="p-1 d-flex flex-column justify-content-around">
                        <img
                            class="decorations"
                            src="../../../assets/icons/table-diagram/plant-4.svg"
                        />
                        <img
                            class="decorations"
                            src="../../../assets/icons/table-diagram/window-icon.svg"
                        />

                        <img
                            class="decorations"
                            src="../../../assets/icons/table-diagram/plant-2.svg"
                        />
                    </div>
                    <div class="p-10 list-table">
                        <TablesRestaurants
                            v-for="(table, index) in tableList"
                            :key="index"
                            :table="table"
                        />
                    </div>
                    <div class="p-1 d-flex flex-column justify-content-around">
                        <img
                            class="decorations"
                            src="../../../assets/icons/table-diagram/plant-3.svg"
                        />
                        <img
                            class="decorations"
                            src="../../../assets/icons/table-diagram/window-icon.svg"
                        />
                        <img
                            class="decorations"
                            src="../../../assets/icons/table-diagram/window-icon.svg"
                        />
                        <img
                            class="decorations"
                            src="../../../assets/icons/table-diagram/plant-5.svg"
                        />
                    </div>
                </div>

                <div class="d-flex justify-content-around">
                    <img
                        class="decorations"
                        src="../../../assets/icons/table-diagram/window-icon.svg"
                    />
                    <img
                        class="decorations"
                        src="../../../assets/icons/table-diagram/window-icon.svg"
                    />

                    <img
                        class="img-item"
                        src="../../../assets/icons/table-diagram/stair-climbing-icon.svg"
                    />
                </div>
            </div>
        </div>
    </el-scrollbar>
    <BookingListOfTablePopup />
</template>

<script lang="ts">
import { ISelectOptions } from '@/common/types';
import { bookingModule } from '@/modules/booking/store';
import { parseLanguageSelectOptions } from '@/utils/helper';
import { ElLoading } from 'element-plus';
import { mixins, Options } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import TablesRestaurants from '../components/TablesRestaurants.vue';
import { FloorOptions, FloorRestaurant } from '../constants';
import { TableMixins } from '../mixins';
import { tableDiagramModule } from '../store';
import { ITable } from '../types';
import BookingListOfTablePopup from './BookingListOfTablePopup.vue';

@Options({
    name: 'table-diagram-component',
    components: {
        TablesRestaurants,
        BookingListOfTablePopup,
    },
})
export default class TableDiagramPage extends mixins(TableMixins) {
    get tableList(): ITable[] {
        return tableDiagramModule.tableList || [];
    }

    get tableSelected(): ITable | null {
        return tableDiagramModule.tableSelected;
    }

    get FloorOptions(): ISelectOptions[] {
        return parseLanguageSelectOptions(FloorOptions);
    }

    get Floor(): FloorRestaurant {
        return tableDiagramModule.tableQueryString.floor || FloorRestaurant.FIRST;
    }

    created(): void {
        tableDiagramModule.clearQueryString();
        if (
            !(
                bookingModule.isShowSetupTableOfBookingPopup ||
                bookingModule.isShowBookingFormPopUp
            )
        ) {
            bookingModule.setSelectedBooking(null);
            tableDiagramModule.setTableSelected(null);
        }
        this.getTableList();
    }

    async getTableList(): Promise<void> {
        const loading = ElLoading.service({
            target: '.content',
        });
        await tableDiagramModule.getTables();
        loading.close();
    }

    floor = FloorRestaurant.FIRST;
    async changeFloor(): Promise<void> {
        tableDiagramModule.setTableQueryString({
            floor: this.floor,
        });
        this.getTableList();
    }

    @Watch('tableSelected')
    async changeFloorTableSelected(): Promise<void> {
        this.floor = this.tableSelected?.floor || FloorRestaurant.FIRST;
        tableDiagramModule.setTableQueryString({
            floor: this.floor,
        });
        await this.getTableList();
    }
}
</script>

<style lang="scss" scoped>
.img-item {
    width: 75px;
    height: 75px;
    margin: 20px auto;
}

.decorations {
    width: 50px;
    height: 50px;
    margin: 20px auto;
}

.list-note-diagram {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    .note-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 10px;
        .note-color {
            width: 30px;
            height: 30px;
            margin-right: 20px;
            border-radius: 5px;
        }

        .booked {
            background: #ebff78;
        }

        .used {
            background: #9eb3fa;
        }

        .not-enough {
            opacity: 0.2;
        }

        .selected {
            border: 1px solid #ff0000;
        }
    }
}

.list-table {
    width: 100%;
    margin: 50px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    background-color: #e9e9e9;
    border: 1px solid #b3b3b3;
    border-radius: 10px;
}
</style>
