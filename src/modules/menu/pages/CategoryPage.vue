<template>
    <div class="content-wrapper filter-wrapper">
        <FilterForm />
    </div>

    <div class="content-wrapper">
        <CategoryTable />
    </div>
    <CategoryFormPopup />
</template>

<script lang="ts">
import { ElLoading } from 'element-plus';
import { Options, Vue } from 'vue-class-component';
import CategoryTable from '../components/category/CategoryTable.vue';
import { menuModule } from '../store';
import CategoryFormPopup from '../components/category/CategoryFormPopup.vue';
import FilterForm from '../components/category/FilterForm.vue';

@Options({
    components: {
        CategoryTable,
        FilterForm,
        CategoryFormPopup,
    },
})
export default class CategoryPage extends Vue {
    isToggleFilterForm = true;

    created(): void {
        menuModule.clearCategoryQueryString();
        this.getCategoryList();
    }

    async getCategoryList(): Promise<void> {
        const loading = ElLoading.service({
            target: '.content',
        });
        await menuModule.getCategories();
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
