<template>
    <BaseFilterFormLayout
        :isToggleFilterForm="isToggleFilterForm"
        @search="handleFilter"
        @keyup.enter="handleFilter"
    >
        <template #filter-title>
            <h5 class="filter-title">{{ $t('common.app.filterForm.search') }}</h5>
        </template>
        <slot>
            <div class="row">
                <div :class="'col-xl-12 col-md-12 col-12 mb-sm-2'">
                    <BaseMultipleSelect
                        v-model:value="userIds"
                        :options="userOptions"
                        :filterable="true"
                        :placeholder="$t('contract.list.filterForm.user.placeholder')"
                        :label="$t('contract.list.filterForm.user.label')"
                        @keyup.enter="handleFilter"
                    />
                </div>
                <div class="col-xl-6 col-md-6 col-12 mb-sm-2">
                    <BaseDatePicker
                        v-model:value="startAt"
                        :label="$t('timekeeping.list.title.startAt')"
                        name="searchByMonth"
                    />
                </div>
                <div class="col-xl-6 col-md-6 col-12 mb-sm-2">
                    <BaseDatePicker
                        v-model:value="endAt"
                        :label="$t('timekeeping.list.title.endAt')"
                        name="searchByMonth"
                        :min-date="startAt"
                    />
                </div>
            </div>
        </slot>
    </BaseFilterFormLayout>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { commonService } from '@/common/services/api.services';
import { UserStatus } from '@/modules/user/constants';
import { IDropdownUserItem } from '@/common/types';
@Options({})
export default class FilterForm extends Vue {
    userOptions: Record<string, string | number>[] = [];

    userIds = [];

    // get user list
    async getUsers(): Promise<void> {
        const response = await commonService.getDropdownUsers({
            status: Object.values(UserStatus),
        });
        if (response.success) {
            this.userOptions = response.data?.items?.map((user: IDropdownUserItem) => {
                return {
                    label: user.fullName,
                    value: user.id,
                };
            });
        } else {
            this.userOptions = [];
        }
    }

    async created(): Promise<void> {
        this.getUsers();
    }
}
</script>
<style scoped>
.filter-title {
    font-weight: bold;
    margin-bottom: 8px;
}

.btn-search {
    width: 160px;
}
:deep(.form-group) {
    margin-bottom: 0 !important;
}
:deep(label) {
    font-size: 13px;
}
</style>
