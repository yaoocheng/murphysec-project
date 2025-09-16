<template>
    <CommonHead>
        <span>集成方式</span>
    </CommonHead>

    <div class="intergrate main_content">
        <div class="class_item" v-for="(item, index) in intergrateData" :key="index">
            <div class="title">
                {{ item.name }}
            </div>
            <div class="ways">
                <div v-show="showAuthAccessType(ele.type)" class="item" v-for="(ele, i) in item.content" :key="i"
                     @click="detectInHandle(ele.type)">
                    <img v-if="ele.img" :src="ele.img" alt="">

                    <JetBrainsSvg :w="56" :type="ele.svg" v-if="ele.svg" />

                    <div class="name">{{ ele.name }}</div>
                    <el-button>立即进入</el-button>

                    <div class="config_text" v-if="store.allAccessInfo[ele.type]?.length">已配置</div>
                    <div class="config_icon" v-if="showSetIcon(ele.type)"
                         @click.stop="$router.push(`/set/${ele.type}`)">
                        <i class="murphy icon-shezhi1"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import store from 'util/store';
// import { isUserSpace, normalTeamAuth } from 'util/tools';
import { useRouter } from 'vue-router';
import { intergrateData } from './constants/constant';
import JetBrainsSvg from './components/JetBrainsSvg.vue';
import { getCurRole, getOrgAuthInfo } from '@/control/org/hooks';
import CommonHead from '@/components/CommonHead.vue';
import { showMessage } from '@/utils/tools';

const {
    isUserSpace, orgManage, teamManage,
} = getOrgAuthInfo();
const router = useRouter();

const showSetIconType = ['github', 'gitlab', 'gerrit', 'harbor', 'nexus', 'jfrog', 'folib', 'coding', 'bitbucket', 'ecr', 'ezone_code', 'ezone_package'];
const showSetIcon = (type: string) => showSetIconType.includes(type) && store.allAccessInfo[type]?.length;
const directAccessData = ['git', 'upload', 'svn', 'idea', 'eclipse', 'vscode', 'cli', 'jenkins', 'docker', 'comp', 'binary', '4a', 'ij', 'pc', 'cl', 'ws', 'ps', 'go', 'rm'];

const showAuthAccessType = (type: string) => {
    if (showSetIconType.includes(type)) return true;

    if (type === 'binary' && store.conf?.upload_binary_diff) return true;

    if (type === '4a' && store.conf?.is_4a) return true;

    if (type !== 'binary' && type !== '4a') return true;
};

// 进入检测
const detectInHandle = (name: string) => {
    if (directAccessData.includes(name)) {
        router.push(`/detect-main?from=${name}`);
        return;
    }

    if (store.allAccessInfo[name]?.length) {
        router.push(`/detect-main?from=${name}`);
    } else {
        if (!isUserSpace.value && getCurRole() === 'Normal' && !orgManage.value && !teamManage.value) {
            showMessage('普通用户不可接入', 'warning');
            return;
        }
        router.push(`/detect-access?from=${name}`);
    }
};
</script>

<style lang='less' scoped>
.intergrate {
    padding: 24px;

    .class_item {
        &:nth-of-type(1) .title {
            font-size: 18px;
            color: #3c3c3c;
            font-weight: 500;
        }

        color: #858585;
        font-size: 14px;

        .title {
            margin-bottom: 12px;
        }

        img {
            width: 56px;
        }

        .ways {
            display: flex;
            flex-wrap: wrap;

            .item {
                position: relative;
                margin-right: 24px;
                width: 180px;
                height: 173px;
                background: #FFFFFF;
                border: 1px solid #EBEBEB;
                border-radius: 16px;
                margin-bottom: 24px;
                .center();
                flex-direction: column;
            }

            .item .name {
                margin: 14px 0;
            }

            .config_text {
                position: absolute;
                top: 8px;
                left: 0;
                font-size: 12px;
                width: 52px;
                padding: 2px 0;
                color: #6C87FF;
                text-align: center;
                background: rgba(108, 135, 255, 0.2);
                border-radius: 0px 4px 4px 0px;
            }

            .config_icon {
                &:hover {
                    background: #EBEBEB;
                }

                width: 32px;
                height: 32px;
                border-radius: 6px;
                text-align: center;
                line-height: 32px;
                color: #3c3c3c;
                position: absolute;
                right: 8px;
                top: 8px;
                cursor: pointer;
            }

            .el-button {
                &:hover {
                    background: #f7f7f7;
                }

                width: 100px;
                height: 28px;
                background: #FFFFFF;
                border: 1px solid #EBEBEB;
                border-radius: 6px;
                color: #3c3c3c;
                font-size: 12px;
            }
        }
    }
}
</style>
