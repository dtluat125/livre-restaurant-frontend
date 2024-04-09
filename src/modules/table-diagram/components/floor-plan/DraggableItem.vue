<script setup lang="ts">
import { clamp, useDraggable, useElementBounding, useParentElement } from '@vueuse/core';
import { computed, onMounted, ref, unref, watchEffect } from 'vue';

const container = useParentElement();
const draggable = ref();
interface Props {
    isDraggable?: boolean;
    initialX: number;
    initialY: number;
}

const props = withDefaults(defineProps<Props>(), {
    isDraggable: false,
    initialX: 0,
    initialY: 0,
});

const {
    top: boundsTop,
    left: boundsLeft,
    width: boundsWidth,
    height: boundsHeight,
} = useElementBounding(container);
const { width, height } = useElementBounding(draggable);

const adjustedLeft = ref(Number(props.initialX));
const adjustedTop = ref(Number(props.initialY));

const emit = defineEmits<{
    (event: 'drag-end', endCoordinate: { x: number; y: number }): void;
}>();
const { x, y } = useDraggable(draggable, {
    onMove({ x, y }) {
        if (!props.isDraggable) return;
        adjustedLeft.value = x - unref(boundsLeft);
        adjustedTop.value = y - unref(boundsTop);
    },
    onEnd() {
        emit('drag-end', {
            x: boundedLeft.value / (boundsWidth.value - width.value),
            y: boundedTop.value / (boundsHeight.value - height.value),
        });
    },
});

const boundedLeft = computed(() =>
    clamp(0, adjustedLeft.value, boundsWidth.value - width.value),
);
const boundedTop = computed(() =>
    clamp(0, adjustedTop.value, boundsHeight.value - height.value),
);

const onDragOver = (a) => {
    console.log(a);
};

onMounted(() => {
    adjustedLeft.value = Number(props.initialX) * (boundsWidth.value - width.value);
    adjustedTop.value = Number(props.initialY) * (boundsHeight.value - height.value);
});

watchEffect(() => {
    adjustedLeft.value = boundedLeft.value;
    adjustedTop.value = boundedTop.value;
});
</script>
<template>
    <div
        ref="draggable"
        p="x-4 y-2"
        border="~ gray-800/30 rounded"
        shadow="~ hover:lg"
        class="table-item"
        :style="{
            userSelect: 'none',
            top: `${boundedTop}px`,
            left: `${boundedLeft}px`,
            cursor: isDraggable ? 'grab' : 'pointer',
        }"
        :on-dragover="onDragOver"
    >
        <slot />
    </div>
</template>

<style lang="scss" scoped>
.table-item {
    background-color: white;
    position: absolute !important;
    width: auto;
    border-radius: 10px;

    &:hover {
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        .table-description {
            font-weight: 700;
        }
    }
}
</style>
