<template>
    <div :class="['empty-ctn', styleContainer]">
        <img class="icon-empty" :src="require('@/assets/icons/empty.svg')" />
        <label :style="styleIcon" class="fw-bold text-start mb-2 label-text txt">
            {{ message }}</label
        >
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

export default class EmptyBox extends Vue {
    @Prop({ default: '' }) readonly message!: string;
    @Prop({ default: '' }) readonly styleContainer!: Record<string, unknown>;
    @Prop({ default: '' }) readonly styleIcon!: Record<string, unknown>;
}
</script>

<style lang="scss" scoped>
.empty-ctn {
    margin: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.icon-empty {
    width: 200px;
    height: 140px;
}
.txt {
    font-size: 20px;
    margin: 20px;
}
</style>
