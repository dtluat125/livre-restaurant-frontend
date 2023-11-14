<template>
    <div class="profile-widget" @click="isCanUpdate ? onClickButtonEdit(user.id) : null">
        <div class="profile-img">
            <router-link to="" class="avatar">
                <BaseAvatar :imageUrl="imageUrl" :height="80" :width="80" />
            </router-link>
            <el-tooltip
                class="item"
                effect="light"
                :content="$t(`user.list.filterForm.status.${user.status}`)"
                placement="bottom-end"
            >
                <div class="active-icon">
                    <i
                        :class="`el-icon-success icon-status icon-status-${user.status}`"
                    />
                </div>
            </el-tooltip>
        </div>

        <div class="profile-action">
            <el-tooltip
                class="item"
                effect="dark"
                :content="$t('user.list.userTable.action.edit')"
                placement="top"
                v-if="isCanUpdate"
            >
                <el-button
                    class="edit-user"
                    circle
                    size="mini"
                    @click="onClickButtonEdit()"
                >
                    <EditIcon style="width: 1em; height: 1em" />
                </el-button>
            </el-tooltip>
            <el-popover
                v-if="isCanUpdate"
                trigger="hover"
                placement="bottom-end"
                :offset="5"
                popper-class="box-popper-menu"
            >
                <template #reference>
                    <div class="menu-action">
                        <el-button @click.stop="" circle size="mini">
                            <MoreIcon
                                style="
                                    width: 1em;
                                    height: 1em;
                                    display: flex;
                                    justify-content: center;
                                    align-item: center;
                                "
                            />
                        </el-button>
                    </div>
                </template>
                <div class="box-menu">
                    <div
                        v-for="option in getAvailableStatus(user?.status, statusOptions)"
                        :key="option.value"
                        @click="state.updateStatus(option.value)"
                    >
                        {{ $t(option.label) }}
                    </div>
                    <div @click="onClickButtonDelete" v-if="isCanBeDeleted()">
                        {{ $t('user.list.menuAction.removeUser') }}
                    </div>
                </div>
            </el-popover>
        </div>
        <h4 class="user-name text-ellipsis">
            <router-link to="">
                {{ user.fullName }}
            </router-link>
        </h4>
        <div class="small text-ellipsis">
            {{ getNamePosition }}
        </div>
    </div>
</template>

<script lang="ts">
import { IUser } from '../types';
import { setupUpdateStatus } from '../composition/userList';
import { AllowUpdateStatus, StatusOptions, UserStatus } from '../constants';
import { Options, setup, Vue } from 'vue-class-component';
import { userModule } from '../store';
import { checkUserHasPermission, parseSelectOptions } from '@/utils/helper';
import { deleteUser } from '../composition/userForm';
import { Edit as EditIcon, More as MoreIcon } from '@element-plus/icons-vue';
import { PermissionActions, PermissionResources } from '@/modules/role/constants';
import { ISelectOptions } from '@/common/types';
import { SupportLanguage } from '@/common/constants';
import { appModule } from '@/store/app';

@Options({
    components: { EditIcon, MoreIcon },
    props: {
        user: {
            type: Object as () => IUser,
            default: () => ({}),
        },
    },
})
export default class UserCard extends Vue {
    user!: IUser;
    get imageUrl(): string {
        return this.user.avatar?.url || require('@/assets/icons/avatar-default.png');
    }

    get isCanUpdate(): boolean {
        return checkUserHasPermission(userModule.userPermissions, [
            `${PermissionResources.USER}_${PermissionActions.UPDATE}`,
        ]);
    }

    get statusOptions(): ISelectOptions[] {
        const statuses = StatusOptions.filter((option) => {
            return AllowUpdateStatus[this.user?.status]?.includes(option?.value);
        });
        const statusOptions = parseSelectOptions(statuses);
        return statusOptions;
    }

    state = setup(() => {
        const { updateStatus } = setupUpdateStatus(this.$props as { user: IUser });

        return { updateStatus };
    });

    get getNamePosition(): string {
        const currentLanguage = appModule.selectedLanguage as SupportLanguage;
        const position = userModule.userPositionList.find(
            (position) => position.code === this.user.position,
        );
        return position ? position.value?.[currentLanguage] : '';
    }

    isCanBeDeleted(): boolean {
        return (
            this.user.status === UserStatus.WAITING_FOR_APPROVAL &&
            userModule.userPermissions?.includes(
                `${PermissionResources.USER}_${PermissionActions.DELETE}`,
            )
        );
    }

    getAvailableStatus(
        userStatus: UserStatus,
        options: ISelectOptions[],
    ): ISelectOptions[] {
        if (userStatus === UserStatus.WAITING_FOR_APPROVAL) {
            return options.filter((option) => option.value !== UserStatus.INACTIVE);
        }
        return options;
    }

    async onClickButtonEdit(): Promise<void> {
        userModule.setIsDisabledSaveButton(false);
        await userModule.setSelectedUser({
            id: this.user.id,
            fullName: this.user.fullName,
            email: this.user.email,
            phoneNumber: this.user.phoneNumber,
            birthday: this.user.birthday,
            gender: this.user.gender,
            roleId: this.user.roleId as number,
            position: this.user.position,
            address: this.user.address,
            avatarId: null,
        } as IUser);
        userModule.setIsShowUserFormPopup(true);
    }

    async onClickButtonDelete(): Promise<void> {
        await deleteUser(this.user.id);
    }
}
</script>

<style lang="scss">
.text-ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
}

.profile-widget {
    text-align: center;
    height: 100%;
    position: relative;
    background-color: #ffffff;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    padding: 15px;
    transition: all 0.3s;
    &:hover {
        cursor: pointer;
        border-color: blue;
        box-shadow: 0 0 0 0;
    }
    .avatar-user {
        width: 50px;
        height: 50px;
    }
    .icon-more-user {
        font-size: 25px;
        transform: rotate(90deg);
    }
    .profile-img {
        width: 80px;
        margin: auto;
        position: relative;

        img {
            border-radius: 50%;
        }
    }
    .profile-action {
        position: absolute;
        right: 15px;
        top: 15px;
        display: flex;
        flex-direction: column;
        align-items: center;
        button {
            &:not(:last-child) {
                margin-bottom: 5px;
            }
        }
        .edit-user {
            margin-bottom: 5px;
            width: 24px;
            height: 24px;
            min-height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .icon-change-status {
            transform: rotate(90deg);
            margin: 0px;
        }

        .menu-action {
            -webkit-transform: rotate(90deg);
            transform: rotate(90deg);
            cursor: pointer;

            button {
                width: 24px;
                height: 24px;
                min-height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }
    .active-icon {
        position: absolute;
        right: 5px;
        top: 7px;
        background: transparent;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        .icon-status {
            background: #fff;
            border-radius: 50%;
            width: 14px;
            height: 14px;
            &:before {
                content: '';
            }
        }
    }
    .user-name {
        font-size: 14px;
        color: #212121;
        margin-top: 12px;
    }

    .small {
        font-size: 12px;
        color: #424242;
        &:not(:last-child) {
            margin-bottom: 2px;
        }
    }
}

.icon-status-active {
    background-color: $--color-success !important;
}
.icon-status-inactive {
    background-color: $--color-info !important;
}
.icon-status-waiting_for_approval {
    background-color: $--color-warning !important;
}

.box-popper-menu {
    .box-menu {
        font-size: 13px;
        cursor: pointer;
        margin: 0 -13px;
        div {
            padding: 8px 13px;
            transition: all 0.2s;
            &:hover {
                background-color: #eceffc;
            }
        }
    }
}
</style>
<style scoped>
.el-popper {
    padding: 0px 12px 0px 12px !important;
}
</style>
