<template>
    <div class="cp-header">
        <!-- Cpanel Left -->
        <div class="cp-left">
            <el-button
                class="filter-exchange header-breadcrumb"
                size="medium"
                @click="onClickBackButton"
                v-if="isShowBackButton"
            >
                <ArrowLeftIcon style="width: 1.4em; height: 1.4em; align-items: center" />
            </el-button>
            <h3 class="cp-page-title">{{ pageTitle }}</h3>
            <div class="cp-button" v-if="isShowCreateButton">
                <el-button size="mini" type="primary" @click="onClickCreateButton">
                    {{ createButtonText || $t('common.app.buttons.create') }}
                </el-button>
            </div>
        </div>
        <!-- End Cpanel Left -->

        <!-- Cpanel Right -->
        <div class="cp-right">
            <transition name="slide-fade">
                <div class="search-box" v-if="isShowSearchBox">
                    <el-input
                        v-model="keywordValue"
                        :placeholder="$t('common.app.filterForm.keyword')"
                        @keyup.enter="onClickSearchButton"
                    >
                        <template #suffix>
                            <i
                                class="el-input__icon el-icon-search"
                                @click="toggleSearchBox"
                            ></i>
                        </template>
                    </el-input>
                </div>
            </transition>
            <!-- upload timekeeping -->
            <div class="cp-search">
                <slot name="custom-button" />
                <el-button
                    v-if="hasFilterForm"
                    :style="{
                        backgroundImage: `url(${searchImage})`,
                        backgroundRepeat: 'no-repeat',
                    }"
                    size="medium"
                    type="default"
                    @click="toggleFilterForm"
                />
                <transition v-else-if="!isShowSearchBox && isShowSearchBox">
                    <el-button
                        :style="{
                            backgroundImage: `url(${searchImage})`,
                            backgroundRepeat: 'no-repeat',
                        }"
                        size="medium"
                        type="default"
                        @click="toggleSearchBox"
                    />
                </transition>
            </div>
            <div class="cp-sort" v-if="hasSortBox">
                <slot name="sort-box-content" />
            </div>
            <div class="cp-pagination" v-if="totalPages > 1">
                <div class="cp-total">
                    <span class="page-pagination-title">
                        {{ $t('common.app.cPanel.page') }}
                    </span>
                    <BaseInputNumber
                        v-model:value="selectedPage"
                        @blur="onBlur"
                        @keyup.enter="onPaginate"
                        :min="1"
                        @keydown="preventInput"
                    />
                    <span class="page-seperator">/</span>
                    <span class="total-page">
                        {{ totalPages }}
                    </span>
                </div>
                <div class="cp-pagination-action">
                    <el-button
                        size="small"
                        type="default"
                        @click="onClickPreviousPage"
                        :disabled="selectedPage === 1"
                    >
                        <ArrowLeftIcon class="arrow-icon" />
                    </el-button>
                    <el-button
                        size="small"
                        type="default"
                        @click="onClickNextPage"
                        :disabled="selectedPage === totalPages"
                    >
                        <ArrowRightIcon class="arrow-icon" />
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {
    DEFAULT_FIRST_PAGE,
    KEYBOARD_EVENT_CODE,
    LIMIT_PER_PAGE,
} from '@/common/constants';
import { Prop, Model, Vue, Options } from 'vue-property-decorator';
import {
    ArrowLeft as ArrowLeftIcon,
    ArrowRight as ArrowRightIcon,
} from '@element-plus/icons-vue';

@Options({
    components: {
        ArrowLeftIcon,
        ArrowRightIcon,
    },
})
export default class ListPageHeader extends Vue {
    @Prop({ default: '' }) readonly pageTitle!: string;
    @Prop({ default: '' }) readonly createButtonText!: string;
    @Prop({ default: 0 }) readonly totalItems!: number;
    @Prop({ default: LIMIT_PER_PAGE }) readonly pageLimit!: number;
    @Prop({ default: true }) readonly hasFilterForm!: boolean;
    @Prop({ default: false }) readonly hasSortBox!: boolean;
    @Prop({ default: false }) readonly isShowCreateButton!: boolean;
    @Prop({ default: false }) readonly isShowBackButton!: boolean;
    @Prop({ default: false }) readonly isShowSearchBox!: boolean;

    @Model('page', { type: Number })
    selectedPage!: number;

    @Model('keyword', { type: String })
    keywordValue!: string;

    oldPage = DEFAULT_FIRST_PAGE;

    get searchImage(): void {
        return require('@/assets/icons/btn.search.svg');
    }

    get totalPages(): number {
        return Math.ceil(this.totalItems / this.pageLimit);
    }

    preventInput(event: KeyboardEvent): void {
        if (
            event.code === KEYBOARD_EVENT_CODE.E ||
            event.code === KEYBOARD_EVENT_CODE.EQUAL ||
            event.code === KEYBOARD_EVENT_CODE.DASH ||
            event.code === KEYBOARD_EVENT_CODE.PERIOD
        ) {
            event.preventDefault();
        }
    }

    onClickPreviousPage(): void {
        if (this.selectedPage > 1) {
            this.selectedPage--;
            this.oldPage = this.selectedPage;
            this.$emit('on-paginate');
        }
    }

    onClickNextPage(): void {
        if (this.selectedPage <= this.totalPages) {
            this.selectedPage++;
            this.oldPage = this.selectedPage;
            this.$emit('on-paginate');
        }
    }

    toggleFilterForm(): void {
        this.$emit('toggle-filter-form');
    }

    toggleSearchBox(): void {
        this.$emit('toggle-search-box');
    }

    onBlur(): void {
        if (this.selectedPage > this.totalPages) {
            this.selectedPage = this.oldPage;
        } else if (this.oldPage !== this.selectedPage) {
            this.oldPage = this.selectedPage;
        }
        this.$emit('on-blur');
    }

    onClickCreateButton(): void {
        this.$emit('create');
    }

    onClickSearchButton(): void {
        this.keywordValue = this.keywordValue?.trim();
        this.$emit('search');
    }

    onClickBackButton(): void {
        this.$emit('on-click-back-button');
    }

    onPaginate(): void {
        if (this.selectedPage > this.totalPages) {
            this.selectedPage = this.oldPage;
        } else if (this.oldPage !== this.selectedPage) {
            this.$emit('on-paginate');
            this.oldPage = this.selectedPage;
        }
    }
}
</script>

<style scoped lang="scss">
.cp-header {
    background-color: #ffffff;
    border-bottom: 1px solid #e0e0e0;
    padding: 18px 20px;
    position: sticky;
    top: 64px;
    z-index: map-get($map: $zIndex, $key: cpHeader);
    @media (min-width: 576px) {
        display: flex;
        justify-content: space-between;
    }
}
.cp-left {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    @media (min-width: 576px) {
        margin-bottom: 0;
    }
}

.arrow-icon {
    height: 1em;
    width: 1em;
}

.cp-page-title {
    font-size: 20px;
    color: #212121;
    font-weight: 400;
    margin: 0;
}
.cp-right {
    display: flex;
    align-items: center;
}
.cp-pagination {
    display: flex;
    align-items: center;
}
.cp-sort {
    display: flex;
    align-items: center;
    margin-right: 8px;
}
.cp-search {
    display: flex;
    margin-right: 10px;
    button {
        width: 36px;
        height: 36px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0;
        color: #212121;
        background-position: center;
    }
}
.search-box {
    .el-input {
        width: 300px;
        transition: all 0.3s;
        text-align: center;
        height: 36px;
        line-height: 36px;
        &.is-focus {
            margin: 0;
            text-align: center;
        }

        :deep(.el-input__inner) {
            height: 36px;
            line-height: 36px;
        }

        :deep(.el-input__suffix) {
            display: flex;
            align-items: center;
        }
    }
    .el-input__inner {
        margin-left: 20px;
        border-color: #e0e0e0;
        color: #212121;
        height: 36px;
        padding: 0px 35px 0px 0px;
        &:focus {
            border-color: #3c61e0;
        }
    }
}
.cp-total {
    color: #212121;
    margin-right: 15px;
    display: flex;
    align-items: center;
    :deep(.el-input) {
        width: 60px;
        margin-right: -20px;
        transition: all 0.3s;
        &.is-focus {
            border-color: white;
            text-align: center;
        }
    }

    :deep(.el-input__inner) {
        border-color: transparent;
        color: #212121;
        height: 36px;
        padding: 0px 35px 0px 0px;
        box-shadow: none;
        &:focus {
            border-color: #fffcfc;
        }
    }
    /** Remove Arrows/Spinners */
    /* Chrome, Safari, Edge, Opera */
    :deep(.el-input__inner::-webkit-outer-spin-button),
    :deep(.el-input__inner::-webkit-inner-spin-button) {
        -webkit-appearance: none;
        margin: 0;
    }
    /* Firefox */
    :deep(.el-input__inner[type='number']) {
        -moz-appearance: textfield;
    }

    :deep(.is-focus) {
        :deep(.el-input__inner) {
            border: inherit;
        }
    }
    .form-group {
        margin-bottom: 0;
        width: 25px;
        position: relative;
    }

    :deep(.invalid-feedback) {
        position: absolute;
        bottom: -18px;
        left: -15px;
        width: 200px;
    }

    span {
        height: 40px;
        line-height: 40px;
        background-color: #fff;
        z-index: map-get($map: $zIndex, $key: totalPage);
    }
    .page-pagination-title {
        margin-right: 5px;
    }
    .page-seperator {
        margin: 0 5px;
    }
    .total-page {
        width: 25px;
    }
}
.cp-pagination-action {
    button {
        font-size: 14px;
        border: 0;
        padding: 3px;
        &:hover,
        &:focus {
            background-color: transparent;
        }
    }
    width: 60px;
}
/* Enter and leave animations can use different */
/* durations and timing functions.              */

.slide-fade-leave-active {
    transition: all 0s ease-out;
}

.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(50px);
    opacity: 0;
}

.slide-fade-leave-from {
    opacity: 0;
}
.cp-button {
    margin-left: 15px;
    margin-right: 10px;
}
:deep(.cp-total .el-input__inner) {
    text-align: center !important;
}
:deep(.invalid-feedback) {
    margin-top: 0 !important;
}
.filter-exchange {
    width: 36px;
    height: 36px;
    border: 0;
    padding: 0;
    &:hover {
        background-color: #ededed;
        color: black;
    }
}
</style>
