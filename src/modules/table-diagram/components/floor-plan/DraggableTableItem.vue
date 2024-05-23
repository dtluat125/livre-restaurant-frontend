<script setup lang="ts">
import DraggableItem from './DraggableItem.vue';
import TablesRestaurant from '../TablesRestaurants.vue';
import { ITable } from '@/modules/table-diagram/types';
import { toRefs } from 'vue';
interface Props {
    table: ITable;
    isDraggable?: boolean;
}

const emit = defineEmits<{
    (event: 'drag-end', id: number, endCoordinate: { x: number; y: number }): void;
}>();

const props = withDefaults(defineProps<Props>(), { table: {}, isDraggable: false });

const { table, isDraggable } = toRefs(props);
const onDragEnd = (coordinate) => {
    emit('drag-end', props.table?.id, coordinate);
    console.log(coordinate);
};
</script>
<template>
    <DraggableItem
        :isDraggable="isDraggable"
        @drag-end="onDragEnd"
        :initialX="table.coordinateX"
        :initialY="table.coordinateY"
    >
        <div
            class="child-wrapper"
            :style="{ pointerEvents: isDraggable ? 'none' : 'auto' }"
        >
            <TablesRestaurant :table="table" />
        </div>
    </DraggableItem>
</template>

<style lang="scss" scoped>
.child-wrapper {
    width: 100%;
    height: 100%;
}
</style>
