<template>
    <div />
</template>

<script lang="ts">
import { Options, Vue, setup } from 'vue-class-component';
import { useRoute } from 'vue-router';
import { IGoogleLoginForm } from '../types';
import { authModule } from '@auth/store';

@Options({})
export default class GoogleLoginPage extends Vue {
    state = setup(() => {
        const route = useRoute();
        const { code = '' } = route?.query;
        const form = {
            redirectUri: `${window.location.origin}/google-login`,
            code,
        } as IGoogleLoginForm;
        authModule.loginWithGoogle(form);
        return {};
    });
}
</script>

<style scoped>
.none-box-shadow {
    box-shadow: none;
    border: none;
}
.google-login {
    text-transform: none;
    box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14),
        0px 1px 5px 0px rgba(0, 0, 0, 0.12) !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
        Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
</style>
