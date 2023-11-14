<template>
    <div class="language-select">
        <el-dropdown trigger="click" @command="changeLanguage">
            <a class="nav-link" data-toggle="dropdown" href="#" role="button">
                <img
                    v-if="lang === 'en'"
                    src="@/assets/icons/flags/en.png"
                    class="language-icon"
                    alt="en"
                />
                <img
                    v-else
                    src="@/assets/icons/flags/vn.png"
                    class="language-icon"
                    alt="vi"
                />
                <span class="language-text">
                    {{ $t('common.app.menuLanguage.title') }}
                </span>
            </a>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item @click="setLocale('en')">
                        <img
                            style="margin-right: 10px"
                            src="@/assets/icons/flags/en.png"
                            alt=""
                            height="16"
                            class="language-icon-sm"
                        />
                        {{ $t('common.app.menuLanguage.en') }}
                    </el-dropdown-item>
                    <el-dropdown-item @click="setLocale('vi')">
                        <img
                            style="margin-right: 10px"
                            src="@/assets/icons/flags/vn.png"
                            alt=""
                            height="16"
                            class="language-icon-sm"
                        />
                        {{ $t('common.app.menuLanguage.vi') }}
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { appService } from '@/utils/app';
import i18n from '@/plugins/vue-i18n';
import { setLocale } from '@vee-validate/i18n';
import { appModule } from '@/store/app';
import { SupportLanguage } from '@/common/constants';

@Options({})
export default class MenuLanguage extends Vue {
    lang = appService.currentAppLang;

    setLocale(lang: SupportLanguage): void {
        this.lang = lang;
        appService.setLang(lang);
        // set language to i18n
        i18n.global.locale = lang;
        setLocale(lang);
        appModule.setLanguage(lang);
    }
}
</script>

<style lang="scss" scoped>
.language-select {
    background-color: transparent;
    display: flex;
    align-items: center;
    padding: 0 2px;
    height: 100%;
    .language-text {
        color: #212121;
        margin-left: 5px;
        @media only screen and (max-width: 991.98px) {
            display: none;
        }
    }
    .language-icon {
        width: 25px;
    }
    .nav-link {
        display: flex;
        align-items: center;
        &:hover {
            background: #ededed;
        }
    }
}
.el-dropdown-menu {
    padding: 0px !important;
}
.language-icon-sm {
    width: 16px;
    margin-right: 5px;
}
</style>
