<template>
    <div class="container-fluid">
        <div class="row">
            <div class="login-page">
                <BaseErrorMessage v-if="errorMessage" :title="errorMessage" />
                <div class="login-inner">
                    <img
                        class="m-auto d-block"
                        height="100"
                        src="@/assets/images/logo/logo-horizontal.svg"
                    />
                    <h3 class="mt-5" style="font-weight: 600">
                        Login with your Google Account
                    </h3>
                    <el-button class="v-btn--text" @click="getGoogleLoginLink">
                        <img
                            :alt="$t('auth.login.google.googleLoginText')"
                            src="@/assets/icons/logo_google.svg"
                        />
                        {{ $t('auth.login.google.googleLoginText') }}
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { useRoute } from 'vue-router';
import { IGoogleLoginLinkParams } from '../types';
import { authModule } from '@auth/store';
import { ElLoading } from 'element-plus';

@Options({})
export default class LoginPage extends Vue {
    errorMessage = '';

    async getGoogleLoginLink(): Promise<void> {
        const route = useRoute();
        const params: IGoogleLoginLinkParams = {
            redirectUri: `${window.location.origin}/google-login`,
        };
        if (route?.query?.redirect) {
            params.state = (route?.query?.redirect || '') as string;
        }
        const loading = ElLoading.service({
            target: '.content',
        });
        await authModule.getGoogleLoginLink(params);
        loading.close();

        if (authModule?.googleLoginLink) {
            window.open(authModule.googleLoginLink, '_self');
        }
    }
}
</script>

<style lang="scss" scoped>
.login-page {
    background-color: #f5f5f5;
    background-image: url('~@/assets/images/login-bg.jpg');
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-position: center;
    background-size: cover;
    position: relative;
    justify-content: center;

    &:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.2);
    }
}
.login-inner {
    align-self: center;
    position: relative;
    z-index: map-get($map: $zIndex, $key: loginInner);
    width: 500px;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    padding: 25px;
    border-radius: 8px;
    background-color: #ffffff;
}

.login-inner {
    button {
        margin-top: 15px;
        color: #212121;
        text-transform: none;
        box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14),
            0px 1px 5px 0px rgba(0, 0, 0, 0.12) !important;
    }

    span {
        display: flex;
        align-items: center;
        img {
            width: 20px;
            margin-right: 5px;
        }
    }
}
</style>
