<template>
    <div class="list-wrapper">
        <div class="block pagination-container">
            <el-pagination
                :hide-on-single-page="false"
                layout="prev, pager, next"
                :page-size="USERS_SIZE_PER_PAGE"
                :total="totalUsers"
                v-model:currentPage="currentPage"
                popper-class="pagination-select"
                v-if="totalUsers > USERS_SIZE_PER_PAGE"
                @current-change="handlePaginate"
            >
            </el-pagination>
        </div>
        <div class="row">
            <template v-for="user in users" :key="user.id">
                <div class="col-xl-3 col-md-4 col-sm-6 col-12 mb-3">
                    <UserCard :user="user" />
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { USERS_SIZE_PER_PAGE } from '../constants';
import { userModule } from '../store';
import { IUser } from '../types';
import UserCard from './UserCard.vue';

@Options({
    components: { UserCard },
})
export default class UserGrid extends Vue {
    USERS_SIZE_PER_PAGE = USERS_SIZE_PER_PAGE;
    get users(): IUser[] {
        return userModule.users;
    }

    get currentPage(): number {
        return userModule.queryString.page || NaN;
    }

    set currentPage(page: number) {
        userModule.setQueryString({
            page,
        });
    }

    get totalUsers(): number {
        return userModule.totalUsers;
    }

    handlePaginate(pageNumber: number): void {
        userModule.setQueryString({
            page: pageNumber,
        });
        userModule.getUsers();
    }
}
</script>

<style scoped lang="scss">
.pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-right: 20px;
    margin-bottom: 20px;
}

.list-wrapper {
    padding: 20px 20px;
    @media only screen and (max-width: 991.98px) {
        margin: 0 5px;
    }
    overflow: auto;
    /* width */
    &::-webkit-scrollbar {
        width: 10px;
    }

    /* Track */
    &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px grey;
        border-radius: 10px;
    }

    /* Handle */
    &::-webkit-scrollbar-thumb {
        background: rgb(180, 179, 179);
        border-radius: 10px;
    }
}
</style>
