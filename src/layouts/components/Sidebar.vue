<template>
    <!-- <sidebar> -->
    <div class="sidebar">
        <div class="sidebar-inner">
            <!--Logo-->
            <div class="logo-container">
                <div class="logo">
                    <!-- <img
                        class="logo-image logo-square"
                        src="@/assets/images/logo/logo-horizontal.svg"
                        height="40"
                        alt=""
                        v-if="!openSidebar"
                    /> -->
                    <img
                        class="logo-image"
                        :class="openSidebar ? 'logo-center' : 'logo-left'"
                        src="@/assets/images/logo/logo-horizontal.svg"
                        height="40"
                        alt=""
                    />
                </div>
            </div>
            <hr class="horizontal-line" />
            <SidebarDesktop />
        </div>
    </div>
    <!-- </sidebar> -->
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import {
    User as UserIcon,
    House as HouseIcon,
    Clock as ClockIcon,
    Calendar as CalenderIcon,
    Monitor as MonitorIcon,
    Service as ServiceIcon,
    Printer as PrinterIcon,
    Key as KeyIcon,
    Setting as SettingIcon,
    QuestionFilled as QuestionIcon,
    Back as BackIcon,
} from '@element-plus/icons-vue';
import SidebarDesktop from './SidebarDesktop.vue';
import { appModule } from '@/store/app';

@Options({
    components: {
        UserIcon,
        HouseIcon,
        ClockIcon,
        CalenderIcon,
        MonitorIcon,
        ServiceIcon,
        PrinterIcon,
        KeyIcon,
        SettingIcon,
        QuestionIcon,
        SidebarDesktop,
        BackIcon,
    },
})
export default class SideBar extends Vue {
    get openSidebar(): boolean {
        return appModule.openSidebar;
    }
}
</script>
<style lang="scss" scoped>
.sidebar {
    height: 100%;
    background-color: unset;
    overflow: hidden;
    border-radius: 16px;
    height: auto;
    @media only screen and (max-width: 991.98px) {
        background-color: #fff;
        box-shadow: 0 20px 27px 0 rgb(0 0 0 / 5%);
    }
}

.logo {
    display: flex;
    padding: 15px;
    align-items: center;
    .logo-square {
        margin-left: -1px;
    }
    .logo-center {
        margin-left: 65px;
    }
    .logo-left {
        margin-left: -13px;
    }
}

.horizontal-line {
    background-image: linear-gradient(
        to right,
        rgba(0, 0, 0, 0),
        rgba(0, 0, 0, 0.4),
        rgba(0, 0, 0, 0)
    );
    background-color: transparent;
    margin: 0px !important;
}
</style>
