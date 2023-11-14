<template>
    <div>
        <el-dialog
            v-model="isShowUserFormPopup"
            width="60%"
            top="5vh"
            @open="form.openPopup"
            destroy-on-close
            @closed="closePopup"
        >
            <template #title>
                <h3 class="text-start">
                    {{
                        !isCreate
                            ? $t('user.form.titleUpdateUser')
                            : $t('user.form.titleCreateUser')
                    }}
                </h3>
            </template>
            <div>
                <div class="row" wrap-style="padding-top: 0px;">
                    <!-- Avatar -->
                    <div class="col-12 col-xl-3">
                        <BaseUploadAvatar
                            isHorizontal="true"
                            name="avatar"
                            path="avatar"
                            :reset="isShowUserFormPopup"
                            :currentImageURL="avatarUrl"
                            @set-avatar-id="setAvatarId"
                            @set-avatar-url="setAvatarUrl"
                        />
                    </div>
                    <!-- Name + Email + Phone + Birthday -->
                    <div class="col-12 col-xl-9">
                        <div class="row">
                            <!-- Name -->
                            <div class="col-12 col-lg-6">
                                <BaseInputText
                                    v-model:value="form.fullName"
                                    is-required="true"
                                    :label="$t('user.form.fullName.label')"
                                    :placeholder="$t('user.form.fullName.placeholder')"
                                    name="fullName"
                                    :error="translateYupError(form.errors.fullName)"
                                />
                            </div>
                            <!-- Email -->
                            <div class="col-12 col-lg-6">
                                <BaseInputText
                                    name="email"
                                    is-required="true"
                                    v-model:value="form.email"
                                    :label="$t('user.form.email.label')"
                                    :placeholder="$t('user.form.email.placeholder')"
                                    :error="translateYupError(form.errors.email)"
                                    :is-disabled="!isCreate"
                                />
                            </div>
                            <!-- Phone -->
                            <div class="col-12 col-lg-6">
                                <BaseInputNumber
                                    name="phoneNumber"
                                    is-required="true"
                                    v-model:value="form.phoneNumber"
                                    :label="$t('user.form.phoneNumber.label')"
                                    :placeholder="$t('user.form.phoneNumber.placeholder')"
                                    :error="translateYupError(form.errors.phoneNumber)"
                                />
                            </div>
                            <!-- Birthday -->
                            <div class="col-12 col-lg-6">
                                <BaseDatePicker
                                    name="birthday"
                                    v-model:value="form.birthday"
                                    :label="$t('user.form.birthday.label')"
                                    :placeholder="$t('user.form.birthday.placeholder')"
                                    :maxDate="new Date()"
                                    :minDate="MIN_DATE_PICKER"
                                    :error="translateYupError(form.errors.birthday)"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <!-- Gender -->
                    <div class="col-12 col-lg-4">
                        <BaseSingleSelect
                            v-model:value="form.gender"
                            :options="genderOptions"
                            :label="$t('user.form.gender.label')"
                            :placeholder="$t('user.form.gender.placeholder')"
                            name="gender"
                            is-required="true"
                            :error="translateYupError(form.errors.gender)"
                        />
                    </div>
                    <!-- Position -->
                    <div class="col-12 col-lg-4">
                        <BaseSingleSelect
                            v-model:value="form.position"
                            :isRequired="true"
                            :options="positionOptions"
                            :label="$t('user.form.position.label')"
                            :placeholder="$t('user.form.position.placeholder')"
                            :filterable="true"
                            name="position"
                            :error="translateYupError(form.errors.position)"
                        />
                    </div>
                    <!-- Role -->
                    <div class="col-12 col-lg-4">
                        <BaseSingleSelect
                            v-model:value="form.roleId"
                            is-required="true"
                            :options="roleOptions"
                            :label="$t('user.form.role.label')"
                            :placeholder="$t('user.form.role.placeholder')"
                            name="role"
                            :isDisabled="!isCanUpdateRole"
                            :error="translateYupError(form.errors.roleId)"
                        />
                    </div>
                    <!-- Address -->
                    <div class="col-12 col-lg-8">
                        <BaseInputText
                            v-model:value="form.address"
                            :label="$t('user.form.address.label')"
                            :placeholder="$t('user.form.address.placeholder')"
                            name="address"
                            :error="translateYupError(form.errors.address)"
                        />
                    </div>
                    <!-- Province -->
                    <div class="col-12 col-lg-4">
                        <BaseSingleSelect
                            v-model:value="form.provinceId"
                            is-required="true"
                            :options="provincesOptions"
                            :label="$t('user.form.province.label')"
                            :placeholder="$t('user.form.province.placeholder')"
                            name="province"
                            :error="translateYupError(form.errors.provinceId)"
                        />
                    </div>
                    <!-- Note -->
                    <div class="col lg-4">
                        <BaseInputTextarea
                            v-model:value="form.note"
                            :label="$t('user.list.filterForm.note.label')"
                            :placeholder="$t('user.list.filterForm.note.placeholder')"
                            name="note"
                            :error="translateYupError(form.errors.note)"
                        />
                    </div>
                </div>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <div class="row justify-content-center footer">
                        <div
                            class="col-md-4 col-sm-6 d-flex justify-content-md-end justify-content-center"
                        >
                            <el-button @click="closePopup">
                                {{ $t('user.form.button.cancel') }}
                            </el-button>
                        </div>
                        <div
                            class="col-md-4 col-sm-6 d-flex justify-content-md-start justify-content-center"
                        >
                            <el-button
                                type="primary"
                                :disabled="isDisabledSaveButton"
                                @click="onSubmit"
                            >
                                {{ $t('user.form.button.submit') }}
                            </el-button>
                        </div>
                    </div>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { UtilMixins } from '@/mixins/utilMixins';
import { checkUserHasPermission, parseLanguageSelectOptions } from '@/utils/helper';
import { Options, setup } from 'vue-class-component';
import { mixins } from 'vue-property-decorator';
import { initForm, parseDataToSubmit, submitForm } from '../composition/userForm';
import { GenderOptions, userSchema } from '../constants';
import { userModule } from '../store';
import { IUser } from '../types';
import * as yup from 'yup';
import { FormValidationResult } from 'vee-validate';
import { PermissionActions, PermissionResources } from '@/modules/role/constants';
import { ISelectOptions } from '@/common/types';

@Options({})
export default class UserForm extends mixins(UtilMixins) {
    get avatarUrl(): string {
        return userModule.avatarUrl;
    }

    get isShowUserFormPopup(): boolean {
        return userModule.isShowUserFormPopup;
    }

    get isDisabledSaveButton(): boolean {
        return userModule.isDisabledSaveButton;
    }

    get isCanUpdate(): boolean {
        return checkUserHasPermission(userModule.userPermissions, [
            `${PermissionResources.USER}_${PermissionActions.UPDATE}`,
        ]);
    }

    get isCanDelete(): boolean {
        return checkUserHasPermission(userModule.userPermissions, [
            `${PermissionResources.USER}_${PermissionActions.DELETE}`,
        ]);
    }

    get isCanUpdateRole(): boolean {
        return checkUserHasPermission(userModule.userPermissions, [
            `${PermissionResources.USER}_${PermissionActions.UPDATE_ROLE}`,
        ]);
    }

    get isCreate(): boolean {
        return !userModule.selectedUser?.id;
    }

    // for options of all dropdown lists
    get genderOptions(): ISelectOptions[] {
        return parseLanguageSelectOptions(GenderOptions);
    }

    get roleOptions(): Record<string, string | number>[] {
        return userModule.roleOptions;
    }

    get positionOptions(): ISelectOptions[] {
        return this.getPositionOptions(userModule.userPositionList);
    }

    get banksOptions(): ISelectOptions[] {
        return userModule.banks;
    }

    get provincesOptions(): ISelectOptions[] {
        return userModule.provinceOptions;
    }

    // form setup
    form = setup(() => initForm(userSchema as unknown as yup.SchemaOf<IUser>));

    // event when close popup
    async closePopup(): Promise<void> {
        userModule.setAvatarUrl('');
        userModule.setIsShowUserFormPopup(false);
        userModule.setSelectedUser(null);
    }

    setAvatarId(fileId: number): void {
        this.form.avatarId = fileId;
    }

    setAvatarUrl(url: string): void {
        userModule.setAvatarUrl(url);
    }

    // submit user form
    async onSubmit(): Promise<void> {
        userModule.setIsDisabledSaveButton(true);
        const isValid = (
            await (this.form.validate as () => Promise<FormValidationResult<IUser>>)()
        ).valid;
        if (isValid) {
            const user = parseDataToSubmit(this.form as Record<string, string | number>);
            await submitForm(user);
        }
        userModule.setIsDisabledSaveButton(false);
    }
}
</script>

<style lang="scss" scoped>
.el-dialog__header {
    padding-bottom: 0;
}
</style>
