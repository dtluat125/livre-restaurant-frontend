<template>
    <ElConfigProvider :locale="locale">
        <router-view />
    </ElConfigProvider>
</template>
<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { ElConfigProvider } from 'element-plus';
import { appModule } from './store/app';
import { Watch } from 'vue-property-decorator';
import throttle from 'lodash/throttle';
import { networkErrNotitfication } from '@/utils/commonFunction';
import { SupportLanguage } from './common/constants';
import en from '@/plugins/element-ui/lang/en';
import vi from '@/plugins/element-ui/lang/vi';

@Options({
    components: {
        ElConfigProvider,
    },
})
export default class App extends Vue {
    throttleMessage = throttle(() => networkErrNotitfication(), 2000, {
        trailing: false,
    });

    get isShowNetworkError(): boolean {
        return appModule.isShowNetworkError;
    }

    get locale(): Record<string, unknown> {
        const i18nLocale = appModule.selectedLanguage;
        if (i18nLocale === SupportLanguage.EN) {
            return en;
        }
        return vi;
    }

    @Watch('isShowNetworkError')
    onNetworkError(isError: boolean): void {
        if (isError) {
            this.throttleMessage();
            appModule.SET_SHOW_NETWORK_ERROR(false);
        }
    }
}
</script>
