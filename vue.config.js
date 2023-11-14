// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    lintOnSave: false,
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@auth', resolve('src/modules/auth'))
            .set('@common', resolve('src/common'))
            .set('@billing', resolve('src/modules/billing'))
            .set('@asset', resolve('src/modules/asset'))
            .set('@event', resolve('src/modules/event'))
            .set('@contract', resolve('src/modules/contract'))
            .set('@recruitment', resolve('src/modules/recruitment'))
            .set('@user', resolve('src/modules/user'))
            .set('@timeKeeping', resolve('src/modules/time-keeping'))
            .set('@role', resolve('src/modules/role'));
    },
    css: {
        loaderOptions: {
            sass: {
                additionalData: `
                    @import "@/assets/styles/_variables.scss";
                `,
            },
        },
    },
};
