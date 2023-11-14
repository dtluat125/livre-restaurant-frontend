<template>
    <el-dropdown ref="dropdown" trigger="click" :hide-on-click="false">
        <el-button
            :style="{ backgroundImage: `url(${imagePath})` }"
            class="filter-exchange"
            size="medium"
        />
        <template #dropdown>
            <div class="toolbox">
                <h3 class="toolbox-title">
                    {{ $t('common.app.sort.title') }}
                </h3>
                <div class="toolbox-inner">
                    <el-dropdown-menu>
                        <el-dropdown-item>
                            <BaseSingleSelect
                                v-model:value="orderBy"
                                :options="sortOptions"
                                :placeholder="placeholder"
                                @visible-change="handleVisible"
                            />
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <el-button
                                class="btn-sort"
                                @click="changeOrderDirection"
                                :class="`btn-sort-${orderDirection}`"
                            >
                                <div class="bar">
                                    <div class="bar-line"></div>
                                    <div class="bar-line"></div>
                                    <div class="bar-line"></div>
                                </div>
                                {{ orderDirectionText }}
                            </el-button>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </div>
            </div>
        </template>
    </el-dropdown>
</template>

<script lang="ts">
import {
    DEFAULT_ORDER_BY,
    DEFAULT_ORDER_DIRECTION,
    Order,
    OrderDirection,
} from '@/common/constants';
import { ISelectOptions } from '@/common/types';
import { Vue } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

export default class Sort extends Vue {
    @Prop({ default: [] }) readonly sortOptions!: ISelectOptions[];
    @Prop({ default: '' }) readonly placeholder!: string;
    @Prop({ default: '' }) order!: string;
    declare $refs: { dropdown: HTMLFormElement };

    orderBy!: string;
    orderDirection: OrderDirection = DEFAULT_ORDER_DIRECTION;
    get orderDirectionText(): string {
        return (Order as Record<string, Record<string, string>>)[
            this.orderDirection.toUpperCase()
        ].label;
    }

    get imagePath(): void {
        return require('@/assets/icons/exchange-icon.svg');
    }

    created(): void {
        this.orderBy = this.order || DEFAULT_ORDER_BY;
    }

    changeOrderDirection(): void {
        this.orderDirection =
            this.orderDirection === OrderDirection.ASC
                ? OrderDirection.DESC
                : OrderDirection.ASC;
        this.$refs.dropdown.handleClose();
    }

    handleVisible(): void {
        this.$refs.dropdown.handleOpen();
    }

    @Watch('orderDirection')
    @Watch('orderBy')
    onHandleSort(): void {
        // eslint-disable-next-line no-unused-expressions
        this.$emit('handleSort', this.orderBy, this.orderDirection);
    }
}
</script>

<style lang="scss" scoped>
.toolbox {
    padding: 15px;

    .el-dropdown-menu {
        display: flex;
        padding: 0;
    }

    .el-dropdown-menu__item {
        padding: 0;

        &:hover,
        &:focus {
            background-color: transparent;
        }
    }
}
.toolbox-title {
    font-size: 13px;
    color: #7d7d7d;
    text-transform: uppercase;
}
:deep(.toolbox-inner) {
    display: flex;
    align-items: center;
    .el-input {
        width: 150px;
    }
}
.btn-sort {
    display: flex;
    align-items: center;
    background-color: #3c61e0;
    border-color: #3c61e0;
    &:hover,
    &:focus {
        background-color: #409eff;
        border-color: #409eff;
        color: #fff;
    }
    :deep(span) {
        color: #fff;
        display: flex;
    }
}

.btn-sort-desc {
    .bar-line {
        &:nth-child(1) {
            width: 7px;
        }

        &:nth-child(2) {
            width: 11px;
        }
        &:nth-child(3) {
            width: 15px;
        }
    }
}

.bar {
    display: flex;
    flex-direction: column;
    min-width: 20px;
    margin-right: 3px;
}

.bar-line {
    display: inline-block;
    width: 15px;
    height: 2px;
    background-color: #fff;
    margin-bottom: 4px;
    transition: 0.4s all;

    &:nth-child(2) {
        width: 11px;
    }

    &:nth-child(3) {
        width: 7px;
    }
}

.filter-exchange {
    width: 36px;
    height: 36px;
    padding: 0;
    display: flex;
    align-items: center;
    background-position: center;
}

:deep(.form-group) {
    margin-bottom: 0 !important;
}
:deep(.el-dropdown-menu__item) {
    padding: 0px;
}
:deep(.el-dropdown-menu__item):last-child {
    margin-left: 10px;
    .btn-sort {
        height: 36px;
    }
}
</style>
