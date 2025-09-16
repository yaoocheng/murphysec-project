<template>
    <div class="common_head">
        <slot></slot>

        <div class="user_nav">
            <div v-if="$systemConfig.isExportReport" @click="dialogVisible = true" class="help_text cursor-pointer">
                <i class="murphy icon-export mr-1 align-[-2px]" style="font-size: 18px;"></i>
                导出报表
            </div>
            <div class="help_text" v-if="!$systemConfig.isClose && !$systemConfig.isGf">
                <el-tooltip popper-class="user_tooltip" onOpen placement="bottom-start" effect="light" trigger="click">
                    <span class="hover_icon" @mouseenter="checkInfoHandle(1)">
                        <el-tooltip content="产品中心" :teleported="true">
                            <i class="murphy icon-product"></i>
                        </el-tooltip>
                    </span>
                    <template #content>
                        <div class="products">
                            <div class="item"
                                 @click="() => { if (!openProductInfo.server_sca) { activeCharacte = 0; isShowProductCharacter = true; } }">
                                <img src="~ast/img/product1.png" alt="">
                                <div>
                                    <div class="name">软件成分分析
                                        <span v-if="openProductInfo.server_sca" class="open">已开通</span>
                                        <span v-else class="not">未开通</span>
                                        <span class="now">当前</span>
                                    </div>
                                    <div class="desc">
                                        一键接入开发流程中的各种工具，漏洞快速自动化修复
                                    </div>
                                </div>
                            </div>
                            <div class="item"
                                 @click="() => { if (!openProductInfo.server_vw) { activeCharacte = 1; isShowProductCharacter = true; } }">
                                <img src="~ast/img/product2.png" alt="">
                                <div>
                                    <div class="name">资产管理及漏洞预警
                                        <span v-if="openProductInfo.server_vw" class="open">已开通</span>
                                        <span v-else class="not">未开通</span>
                                    </div>
                                    <div class="desc">
                                        自研、商采、开源等资产全覆盖，实时与0day漏洞&投毒预警关联
                                    </div>
                                </div>
                            </div>
                            <div class="item"
                                 @click="() => { if (!openProductInfo.server_oscgw) { activeCharacte = 2; isShowProductCharacter = true; } }">
                                <img src="~ast/img/product3.png" alt="">
                                <div>
                                    <div class="name">源安全网关
                                        <span v-if="openProductInfo.server_oscgw" class="open">已开通</span>
                                        <span v-else class="not">未开通</span>
                                    </div>
                                    <div class="desc">
                                        开源组件安全基线管理，高危风险组件、投毒组件实时拦截
                                    </div>
                                </div>
                            </div>
                            <!-- <div class="item"
                                @click="() => { if (!openProductInfo.server_ccm) { activeCharacte = 3; isShowProductCharacter = true; } }">
                                <img src="~ast/img/product4.png" alt="">
                                <div>
                                    <div class="name">代码合规管理
                                        <span v-if="openProductInfo.server_ccm" class="open">已开通</span>
                                        <span v-else class="not">未开通</span>
                                    </div>
                                    <div class="desc">
                                        开源组件许可证合规分析，灵活应对国内外合规监管
                                    </div>
                                </div>
                            </div> -->
                            <!-- <div class="item"
                                @click="() => { if (!openProductInfo.server_sast) { activeCharacte = 4; isShowProductCharacter = true; } }">
                                <img src="~ast/img/product5.png" alt="">
                                <div>
                                    <div class="name">静态代码扫描
                                        <span v-if="openProductInfo.server_sast" class="open">已开通</span>
                                        <span v-else class="not">未开通</span>
                                    </div>
                                    <div class="desc">
                                        高准确率漏洞检测能力、极快的检测速度和效率，常见安全漏洞全覆盖
                                    </div>
                                </div>
                            </div> -->
                        </div>
                    </template>
                </el-tooltip>
            </div>

            <div class="help_text" v-if="!$systemConfig.isClose && !$systemConfig.isGf">
                <a href="/openapi/v3/" target="_blank">
                    <el-tooltip content="API">
                        <span class="hover_icon">
                            <i style="font-size: 18px;color: #2A2B32;" class="murphy icon-Api"></i>
                        </span>
                    </el-tooltip>
                </a>
            </div>

            <!-- <div class="help_text">
                <el-tooltip content="产品特性">
                    <span class="hover_icon" @click="store.isShowNewUserGuide = true">
                        <i style="font-size: 20px;" class="murphy icon-line-magicmofabang"></i>
                    </span>
                </el-tooltip>
            </div> -->

            <div class="help_text" v-if="!$systemConfig.isClose">
                <a href="/docs/" target="_blank">
                    <el-tooltip content="帮助中心">
                        <span class="hover_icon">
                            <i style="font-size: 18px;color: #2A2B32;vertical-align: -1px;"
                               class="murphy icon-wenhaoxiao"></i>
                        </span>
                    </el-tooltip>
                </a>
            </div>
            <div class="help_text">
                <el-tooltip effect="light" trigger="click">
                    <span class="hover_icon" @mouseenter="checkInfoHandle(3)">
                        <i style="font-size: 18px;color: #2A2B32;vertical-align: -2px;"
                           class="murphy icon-tishishuoming"></i>
                    </span>
                    <template #content>
                        <div style="font-size: 14px;color: #2A2B32;line-height: 24px;padding: 4px;">
                            平台版本：{{ versionInfo.version_code }}<br>
                            引擎版本： {{ versionInfo.engine_version }}<br>
                            漏洞库版本：{{ versionInfo.vdb_version }}<br>
                            漏洞最新更新时间：{{ formatDate(versionInfo.vuln_last_updateed_time)  }}<br>
                        </div>
                    </template>
                </el-tooltip>
            </div>

            <div class="help_text">
                <el-tooltip popper-class="user_tooltip" content="异常通知" placement="bottom-start" effect="light"
                            trigger="click">
                    <span class="hover_icon hover_error" @mouseenter="checkInfoHandle(2)">
                        <el-tooltip content="异常通知" :teleported="true">
                            <div>
                                <i style="font-size: 18px;" class="murphy icon-error"></i>
                                <span class="num">{{ Object.values(errorInfo).filter((item: any) =>
                                    item?.show_name)?.length
                                }}</span>
                            </div>
                        </el-tooltip>
                    </span>
                    <template #content>
                        <div class="error">
                            <div class="title">
                                系统异常（{{ Object.values(errorInfo).filter((item: any) => item?.show_name)?.length }}）
                            </div>
                            <div class="error_content">
                                <div class="error_item" v-if="errorInfo?.maven_repo?.show_name">
                                    <i class="murphy icon-cuowu" style="color: #F34D3D; margin-right: 9px;"></i>
                                    <div class="info">
                                        <div class="name">{{ errorInfo?.maven_repo?.show_name }}</div>
                                        <div class="desc">可能无法完整识别企业内部使用的组件，导致检测结果不准确</div>
                                        <a v-if="!$systemConfig.isClose"
                                           href="/docs/faqs/system-errors/unconfigured-private-repository.html"
                                           target="_blank">查看文档
                                            <i style="vertical-align: -1px;font-size: 14px;"
                                               class="murphy icon-jiantou-you"></i></a>
                                    </div>
                                </div>
                                <div class="error_item" v-if="errorInfo?.cpu_warn?.show_name">
                                    <i class="murphy icon-cuowu" style="color: #F34D3D; margin-right: 9px;"></i>
                                    <div class="info">
                                        <div class="name">{{ errorInfo?.cpu_warn?.show_name }}</div>
                                        <div class="desc">这可能会影响系统正常运行</div>
                                        <a v-if="!$systemConfig.isClose"
                                           href="/docs/faqs/system-errors/cpu-usage-exceeds-limit.html"
                                           target="_blank">查看文档 <i style="vertical-align: -1px;font-size: 14px;"
                                                                   class="murphy icon-jiantou-you"></i></a>
                                    </div>
                                </div>
                                <div class="error_item" v-if="errorInfo?.mem_warn?.show_name">
                                    <i class="murphy icon-cuowu" style="color: #F34D3D; margin-right: 9px;"></i>
                                    <div class="info">
                                        <div class="name">{{ errorInfo?.mem_warn?.show_name }}</div>
                                        <div class="desc">这可能会影响系统正常运行</div>
                                        <a v-if="!$systemConfig.isClose"
                                           href="/docs/faqs/system-errors/memory-usage-exceeds-limit.html"
                                           target="_blank">查看文档 <i style="vertical-align: -1px;font-size: 14px;"
                                                                   class="murphy icon-jiantou-you"></i></a>
                                    </div>
                                </div>
                                <div class="error_item" v-if="errorInfo?.disk_warn?.show_name">
                                    <i class="murphy icon-cuowu" style="color: #F34D3D; margin-right: 9px;"></i>
                                    <div class="info">
                                        <div class="name">{{ errorInfo?.disk_warn?.show_name }}</div>
                                        <div class="desc">这可能会影响系统正常运行</div>
                                        <a v-if="!$systemConfig.isClose"
                                           href="/docs/faqs/system-errors/disk-usage-exceeds-limit.html"
                                           target="_blank">查看文档 <i style="vertical-align: -1px;font-size: 14px;"
                                                                   class="murphy icon-jiantou-you"></i></a>
                                    </div>
                                </div>
                            </div>
                            <NoData description="系统无异常"
                                    v-if="!Object.values(errorInfo).some((item: any) => item?.show_name)" />
                        </div>
                    </template>
                </el-tooltip>
            </div>

            <el-tooltip placement="bottom-end" :hide-after="0" popper-class="user_tooltip" effect="light"
                        trigger="click">
                <div class="user_wrap">
                    <AvatarComp :size="32" :name="getUserInfo()?.nickname" />
                    <i style="color:#2B2F36" class="murphy icon-xiala1"></i>
                </div>
                <template #content>
                    <div class="user_popup">
                        <div class="team_name item ">
                            <span class="name g-fw-600">{{ getUserInfo()?.nickname }}</span>
                            <!-- <div style="display: flex;"> -->
                            <!-- <span class="tab">企业版</span> -->
                            <!-- <span class="tab" v-if="store.teamInfo.owner_user_id === getUserInfo().id">团队负责人</span> -->
                            <!-- </div> -->
                        </div>
                        <div class="item set" @click="router.push('/usr/account')">
                            账户设置
                        </div>
                        <div v-if="(userRole === 'SA' || ownerOrgIDList.length)" class="item set"
                             @click="router.push('/org')">
                            组织管理
                        </div>
                        <a v-if="$systemConfig.isOpenAdmin" :href="$systemConfig.isGf ? '/scamanagement/' : '/admin/'"
                           target="_blank">
                            <div class="item set text-3c">
                                管理后台
                            </div>
                        </a>
                        <div class="item quit" @click="quitLoginHandle">
                            退出
                        </div>
                    </div>
                </template>
            </el-tooltip>
        </div>

        <el-dialog width="820px" top="2%" v-model="isShowProductCharacter" :close-on-press-escape="false"
                   :close-on-click-modal="false">
            <div class="ptoduct_character">
                <div class="title">
                    {{ characterInfo[activeCharacte].title }}
                    <span class="not">未开通</span>
                </div>
                <div class="desc">
                    {{ characterInfo[activeCharacte].desc }}
                </div>
                <img :src="characterInfo[activeCharacte].img" style="width: 100%;height: 482px;margin-bottom: 16px;"
                     alt="">
                <div class="contact">
                    <div style="color: #6C87FF;">
                        <i class="murphy icon-dianhuatianchong"></i> 400-180-9568
                    </div>
                    <div>
                        <span>
                            <i class="murphy icon-tishishuoming"
                               style="font-size: 13px;color:#858585;margin-right:4px"></i>
                            可联系管理员开放此功能或
                        </span>
                        <a href="https://www.murphysec.com/enterprise" target="_blank">
                            <el-button style="margin-left: 6px;">在线申请试用</el-button>
                        </a>
                    </div>
                </div>
            </div>
        </el-dialog>

        <el-dialog v-model="dialogVisible" :show-close=false align-center width="420">
            <template #header>
                <div class="flex items-center">
                    <img class="w-6 mr-4" src="~ast/img/icon_info.png" alt="">
                    确定导出该组织/团队的报表数据?
                </div>
            </template>
            <template #footer>
                <div class="dialog-footer mt-[-24px]">
                    <el-button @click="dialogVisible=false" class="minor_btn h-8 w-20">取消</el-button>
                    <el-button @click="exportOrgState" class="w-20">确认</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang='ts'>
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
// import { jumpLogin } from 'util/auth';
import character1 from 'ast/img/character1.svg';
import character2 from 'ast/img/character2.png';
import character3 from 'ast/img/character3.png';
import character4 from 'ast/img/character4.svg';
import character5 from 'ast/img/character5.svg';
import { stateExportApi } from 'api/set';
import {
    getProductOpenInfoApi, getSystemErrorApi, getSystemVersionApi, getVulnCountApi,
} from 'api/team';
import AvatarComp from 'comp/AvatarComp.vue';
import store from '@/utils/store';
import { getOrgAuthInfo } from '@/control/org/hooks';
import {
    getUserInfo, showMessage, localStorageUtil, formatDate,
} from '@/utils/tools';
import { quitLogin } from '@/api/user';
import NoData from '@/components/NoData.vue';

const {
    userRole, ownerOrgIDList,
} = getOrgAuthInfo();

const router = useRouter();
const dialogVisible = ref(false);
const isShowProductCharacter = ref<boolean>(false);
const characterInfo = ref<Array<any>>([
    {
        title: '软件成分分析',
        desc: '支持一键接入开发流程中的各种工具、源代码二进制成分分析及漏洞检测、漏洞快速自动化修复',
        img: character1,
    },
    {
        title: '资产管理及漏洞预警',
        desc: '企业级软件供应链资产台账，自研、商采、开源等资产全覆盖。实时0day漏洞&投毒预警关联，清晰灵活漏洞应急处置方案',
        img: character2,
    },
    {
        title: '源安全网关',
        desc: '开源组件安全基线管理、高危风险组件拦截、投毒组件实施拦截',
        img: character3,
    },
    {
        title: '代码合规管理',
        desc: '支持开源组件许可证合规分析、代码项目自主可控率分析、灵活应对国内外合规监管 ',
        img: character4,
    },
    {
        title: '静态代码扫描',
        desc: '高准确率漏洞检测能力、极快的检测速度和效率、常见安全漏洞全覆盖、专家定制策略的更新',
        img: character5,
    },
]);
const activeCharacte = ref<number>(0);
const openProductInfo = ref<any>({});
const errorInfo = ref<any>({});
const versionInfo = ref<any>({});

const quitLoginHandle = async () => {
    const res = await quitLogin({ token: getUserInfo()?.token });
    if (res.data.code === 200) {
        localStorageUtil('remove', 'g-u');
        localStorageUtil('remove', 'g-t');
        localStorageUtil('remove', 'g-conf');
        localStorageUtil('remove', 'cur-click-org-name');
        localStorageUtil('remove', 'cur-click-path');

        if (window.localStorage.getItem('logout')) {
            window.location.href = (window.localStorage.getItem('logout') as string);
            localStorageUtil('remove', 'logout');
        } else {
            window.location.href = '/console/login';
        }
    }
};

onBeforeMount(async () => {
    const res = await getSystemErrorApi();
    errorInfo.value = res.data;
});

const checkInfoHandle = async (iconType: number) => {
    if (iconType === 1 && !Object.keys(openProductInfo.value).length) {
        const res = await getProductOpenInfoApi();
        openProductInfo.value = res.data;
    }
    // if (iconType === 2 && !Object.keys(errorInfo.value).length) {
    //     const res = await getSystemErrorApi();
    //     errorInfo.value = res.data;
    // }
    if (iconType === 3 && !Object.keys(versionInfo.value).length) {
        const res = await getSystemVersionApi();
        versionInfo.value = res.data;

        const { data } = await getVulnCountApi();
        versionInfo.value.vuln_last_updateed_time = data?.vuln_last_update_at;
    }
};

const exportOrgState = async () => {
    try {
        await stateExportApi({
            team_id: store.teamInfo.team_id,
        });
        dialogVisible.value = false;
        showMessage('导出成功', 'success');
    } catch (error) {
        console.log(error);
    }
};
</script>

<style lang='less'>
.user_nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    // width: 130px;
    color: #3c3c3c;
    font-size: 14px;

    .help_text {
        margin-right: 15px;
        color: #2A2B32;
    }

    .hover_error {
        position: relative;
        color: #F34D3D;
        display: inline-block;
        padding: 6px;

        .num {
            font-size: 12px;
            position: absolute;
            right: 0;
            top: 0;
            z-index: 99;
            color: #F34D3D;
        }
    }

    .hover_error:hover {
        background-color: #F34D3D1A;
    }

    .hover_icon {
        padding: 6px;
    }
}

.products,
.error {
    width: 350px;
    padding: 16px;
    font-size: 14px;
    color: @text-color;

    img {
        width: 32px;
        margin-right: 12px;
    }

    .item {
        &:hover {
            background-color: #6C87FF1A;
        }

        cursor: pointer;
        border: 1px solid #EBEBEB;
        border-radius: 4px;
        padding: 16px;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        font-weight: 500;
        transition: all .2s;

        .desc {
            color: #646A73;
            font-weight: 400;
        }
    }

    .open {
        font-size: 12px;
        color: #fff;
        display: inline-block;
        width: 40px;
        padding: 2px 4px;
        text-align: center;
        border-radius: 0px 6px;
        background: linear-gradient(90deg, #596599 0%, #051766 100%);
        transform: scale(0.8);
    }

    .not {
        opacity: 0.5;
        border-radius: 0px 6px;
        font-size: 12px;
        color: #fff;
        display: inline-block;
        width: 40px;
        padding: 2px 4px;
        text-align: center;
        background: linear-gradient(90deg, #596599 0%, #051766 100%);
        transform: scale(0.8);
    }

    .now {
        color: #2946C7;
        font-size: 12px;
        display: inline-block;
        width: 28px;
        text-align: center;
        background-color: #4966E633;
        padding: 2px 4px;
        border-radius: 4px;
        transform: scale(0.8);
    }

    .title {
        padding: 16px;
        border-bottom: 1px solid rgba(42, 43, 50, 0.1);
    }
}

.error {
    padding: 0;

    img {
        width: 100px;
    }

    .title {
        font-weight: 500;
        font-size: 16px;
        color: @text-color;
    }

    .error_content {
        padding: 16px;
    }

    .error_item {
        border: 1px solid #EBEBEB;
        border-radius: 4px;
        padding: 16px;
        margin-bottom: 8px;
        display: flex;
        align-items: flex-start;
        font-weight: 500;

        .info {
            flex: 1;
        }

        .desc {
            font-weight: 400;
            margin: 8px 0;
            color: #646A73;
        }

        a {
            font-size: 12px;
            font-weight: 400;
            float: right;
        }
    }
}

.user_wrap {
    .center();
}

.user_wrap img {
    width: 32px;
    border-radius: 50%;
    cursor: pointer;
}

.user_wrap i {
    vertical-align: 8px;
    margin-left: 12px;
    cursor: pointer;
}

.ptoduct_character {
    .not {
        opacity: 0.5;
        border-radius: 0px 6px;
        font-size: 12px;
        color: #fff;
        display: inline-block;
        width: 40px;
        padding: 2px 4px;
        text-align: center;
        background: linear-gradient(90deg, #596599 0%, #051766 100%);
        transform: scale(0.8);
        font-weight: 500;
    }

    .title {
        font-size: 16px;
        color: @text-color;
        font-weight: 600;
        margin-bottom: 8px;
    }

    .desc {
        font-size: 14px;
        color: #858585;
        margin-bottom: 16px;
    }

    .contact {
        color: @text-color;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .minor_btn {
            width: auto;
            height: 32px;

            i {
                color: #6C87FF;
                font-size: 14px;
                margin-right: 6px;
            }
        }
    }
}
</style>
