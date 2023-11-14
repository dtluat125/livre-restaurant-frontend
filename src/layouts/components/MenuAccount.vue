<template>
    <div class="user-dropdown">
        <el-dropdown trigger="click">
            <a href="#" class="nav-link">
                <div class="d-flex align-items-center">
                    <span class="user-img">
                        <BaseAvatar :imageUrl="imageUrl" :height="25" :width="25" />
                        <span class="status online" />
                    </span>
                    <span class="user-name">{{ userName }}</span>
                </div>
            </a>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item @click="onClickProfileButton">
                        {{ $t('common.app.menuAccount.myProfile') }}
                    </el-dropdown-item>
                    <el-dropdown-item @click="logout">
                        {{ $t('common.app.menuAccount.logout') }}
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>

<script lang="ts">
import { UtilMixins } from '@/mixins/utilMixins';
import { mixins } from 'vue-property-decorator';
import { Options } from 'vue-class-component';
import { appService } from '@/utils/app';
import { authModule } from '@/modules/auth/store';
import { ElLoading } from 'element-plus';
import router from '@/router';
import { PageName } from '@/common/constants';

@Options({})
export default class MenuAccount extends mixins(UtilMixins) {
    async getProfile(): Promise<void> {
        const profile = await authModule.getProfile();
        if (!profile.success) {
            this.showErrorNotification(profile.message as string);
        }
    }

    get imageUrl(): string {
        return (
            authModule.userProfile?.avatarUrl ||
            require('@/assets/icons/avatar-default.png')
        );
    }

    get userName(): string {
        return authModule.userProfile?.fullName;
    }

    async initData(): Promise<void> {
        const loading = ElLoading.service({
            target: '.content',
        });
        await this.getProfile();
        loading.close();
    }

    async created(): Promise<void> {
        this.initData();
    }

    onClickProfileButton(): void {
        router.push({
            name: PageName.PROFILE_PAGE,
        });
    }

    onClickSettings(): void {
        router.push({
            name: PageName.SETTINGS_POSITION_PAGE,
        });
    }

    logout(): void {
        appService.resetAll();
        router.push({
            name: PageName.LOGIN_PAGE,
        });
    }
}
</script>

<style lang="scss" scoped>
.el-dropdown-menu {
    padding: 0 !important;
}
.user-dropdown {
    background-color: transparent;
    border: none;
    padding: 0 2px;
    height: 100%;
    display: flex;
    align-items: center;
    .user-img {
        display: inline-block;
        position: relative;
        .status {
            border: 2px solid #fff;
            bottom: 0;
            height: 10px;
            margin: 0;
            position: absolute;
            right: 0;
            width: 10px;
            border-radius: 50%;
            display: inline-block;
            &.online {
                background-color: #55ce63;
            }
        }
    }
    .user-name {
        line-height: initial;
        color: #212121;
        margin-left: 5px;
        @media only screen and (max-width: 991.98px) {
            display: none;
        }
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .nav-link {
        display: flex;
        align-items: center;
        &:hover {
            background-color: #ededed;
        }
    }
}
</style>
