import { ComponentCustomProperties } from '@vue/runtime-core';

declare module '@vue/runtime-core' {
    // eslint-disable-next-line no-unused-vars, no-shadow
    interface ComponentCustomProperties {
        $systemConfig: {
            shortName: string,
            longName: string,
            enName: string,
            mainLogo: string,
            whiteLogo: string,
            isClose: boolean,
            isCloseAccess: boolean,
            isGf: boolean,
            isPV3: boolean,
            isOpenAdmin: boolean,
            isExportReport: boolean,
        };
        $route: any,
        $router: any,
    }
}
export default ComponentCustomProperties;
