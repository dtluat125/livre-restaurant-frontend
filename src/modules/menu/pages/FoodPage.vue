<template>
    <div class="content-wrapper filter-wrapper">
        <FilterForm />
    </div>

    <div class="content-wrapper">
        <FoodTable />
    </div>
    <FoodFormPopup />
</template>

<script lang="ts">
import { DEFAULT_FIRST_PAGE } from '@/common/constants';
import { ElLoading } from 'element-plus';
import { Options, Vue } from 'vue-class-component';
import FoodTable from '../components/food/FoodTable.vue';
import { menuModule } from '../store';
import FoodFormPopup from '../components/food/FoodFormPopup.vue';
import FilterForm from '../components/food/FilterForm.vue';

@Options({
    components: {
        FoodTable,
        FilterForm,
        FoodFormPopup,
    },
})
export default class FoodPage extends Vue {
    isToggleFilterForm = true;

    get totalFoods(): number {
        return menuModule.totalFoods;
    }

    get selectedPage(): number {
        return menuModule.foodQueryString?.page || DEFAULT_FIRST_PAGE;
    }

    set selectedPage(value: number) {
        menuModule.foodQueryString.page = value;
    }

    created(): void {
        menuModule.clearFoodQueryString();
        this.getFoodList();
        menuModule.getDropdownCategories();
    }

    async getFoodList(): Promise<void> {
        const loading = ElLoading.service({
            target: '.content',
        });
        await menuModule.getFoods();
        loading.close();
    }

    toggleFilterForm(): void {
        this.isToggleFilterForm = !this.isToggleFilterForm;
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
