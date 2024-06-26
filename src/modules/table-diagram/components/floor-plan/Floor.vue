<script setup lang="ts">
import { tableService } from '@/modules/booking/services/api.service';
import { tableDiagramModule } from '@/modules/table-diagram/store';
import { ITable } from '@/modules/table-diagram/types';
import {
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/utils/helper';
import { ElLoading } from 'element-plus';
import { ref, toRefs, watch } from 'vue';
import DraggableTableItem from './DraggableTableItem.vue';
import { bookingModule } from '../../../booking/store';

interface Props {
    tables: ITable[];
}

const props = defineProps<Props>();

const { tables } = toRefs(props);
watch(tables, (newTables) => {
    console.log('newTables', newTables);
    updatedTables.value = newTables || [];
});
const isEditingFloorPlan = ref(false);
const onClickButtonEdit = () => {
    isEditingFloorPlan.value = true;
};
const onClickButtonCancel = () => {
    isEditingFloorPlan.value = false;
};
const updatedTables = ref(props.tables || []);

const onDragEnd = (id: number, coordinate: { x: number; y: number }) => {
    console.log(id);
    if (!id) return;
    updatedTables.value = updatedTables.value?.map((item) => {
        if (
            item?.id !== id ||
            (item.coordinateX === coordinate.x && item.coordinateY === coordinate.y)
        )
            return item;
        console.log({
            ...item,
            coordinateX: coordinate.x || 0,
            coordinateY: coordinate.y || 0,
            updated: true,
        });
        return {
            ...item,
            coordinateX: coordinate.x || 0,
            coordinateY: coordinate.y || 0,
            updated: true,
        };
    });
    console.log(updatedTables.value);
};

const onClickButtonSave = async () => {
    const loading = ElLoading.service({
        target: '.content',
    });
    let isSuccess = true;
    let errorMessage = '';
    console.log(updatedTables.value);
    for (const table of updatedTables.value || []) {
        if (!table.updated) continue;
        const response = await tableService.update(table.id, {
            coordinateX: table.coordinateX || 0,
            coordinateY: table.coordinateY || 0,
        });
        if (!response.success) {
            isSuccess = false;
            errorMessage = response?.message;
            break;
        }
    }
    loading.close();
    if (isSuccess) {
        showSuccessNotificationFunction('Thay đổi trạng thái bàn thành công');
        await tableDiagramModule.getTables();
        loading.close();
    } else {
        showErrorNotificationFunction(errorMessage);
        const loading = ElLoading.service({
            target: '.content',
        });
        await tableDiagramModule.getTables();
        loading.close();
    }
    isEditingFloorPlan.value = false;
};

const isBookingFormOpen = bookingModule.isShowBookingFormPopUp;
</script>

<template>
    <div class="floor-plan">
        <div class="button-group" v-if="!isBookingFormOpen">
            <el-button
                v-if="!isEditingFloorPlan"
                type="primary"
                size="mini"
                @click="onClickButtonEdit"
            >
                {{ $t('common.common.button.edit') }}
            </el-button>
            <el-button
                type="info"
                size="mini"
                @click="onClickButtonCancel"
                v-if="isEditingFloorPlan"
                plain
            >
                {{ $t('common.common.button.cancel') }}
            </el-button>
            <el-button
                type="success"
                size="mini"
                plain
                @click="onClickButtonSave"
                v-if="isEditingFloorPlan"
            >
                {{ $t('common.common.button.save') }}
            </el-button>
        </div>

        <div class="list-table" ref="container">
            <DraggableTableItem
                v-for="(table, index) in updatedTables"
                :key="table?.id || index"
                :table="table"
                :isDraggable="isEditingFloorPlan"
                @drag-end="onDragEnd"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.button-group {
    display: flex;
    justify-content: flex-end;
    gap: 24px;
    margin-bottom: 24px;
}

.floor-plan {
    width: 100%;
    height: 600px;
    margin: 50px;
    margin-bottom: 80px;
}
.list-table {
    width: 1000px;
    height: 600px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    background-color: #e9e9e9;
    border: 1px solid #b3b3b3;
    border-radius: 10px;
    position: relative;
}
</style>
