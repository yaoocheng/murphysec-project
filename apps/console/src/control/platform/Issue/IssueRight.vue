<template>
    <div class="code_info" v-if="store.isAllTeam">
        <div class="name">
            团队信息
        </div>
        <div class="item">
            <div>所属团队</div>
            <div class="info">{{ info.team_name }}</div>
        </div>
        <div class="item">
            <div>团队负责人</div>
            <div class="small_person">
                <UserComp :name="info.owner_user_name" />
            </div>
        </div>
    </div>

    <div class="code_info">
        <div class="name">
            所属代码项目信息
        </div>
        <div class="item">
            <div>项目名称</div>
            <div class="info">{{ info.subtask_name }}</div>
        </div>
        <div class="item">
            <div>项目分支</div>
            <div class="info">{{ info.branch || '-' }}</div>
        </div>
        <div class="item">
            <div>Commit ID</div>
            <div class="info">{{ info.commit?.slice(0, 7) || '-' }} <i v-if="info.commit" id="copy-commit"
                                                                       :data-clipboard-text="info.commit" @click="copyFunc('#copy-commit')"
                                                                       class="g-cursor-pointer murphy icon-fuzhi1"></i>
            </div>
        </div>
        <div class="item">
            <div>项目地址</div>
            <div class="info link">
                <span>{{ info.addr || '-' }}</span>
                <!-- <a class="hover_text" v-if="info.addr" :href="info.addr" target="_blank">{{ info.addr }}</a>
                <span v-else>-</span> -->
            </div>
        </div>
        <div class="item" v-if="info.subtask?.author">
            <div>Last commiter</div>
            <div class="small_person">
                <UserComp :name="info.subtask?.author" />
            </div>
        </div>
    </div>

    <div class="fund_info">
        <div class="name">
            安全问题基本信息
        </div>
        <div class="item">
            <div style="margin-bottom: 4px;">创建人</div>
            <div class="small_person">
                <UserComp :name="info.created_user_name" />
            </div>
        </div>
        <div class="item">
            <!-- <div v-if="!store.isAllTeam" style="margin-bottom: 4px;"
                 @click="store.isShowChangePrincipal = true; store.securityId = info.id"> -->
            <div v-if="!store.isAllTeam" style="margin-bottom: 4px; justify-content:left; width: fit-content;" class="flex items-center"
                 @click="store.isShowChangePrincipal = true; store.securityId = info.id">
                负责人
                <div class="button-icon-grey">
                    <i v-if="!$route.path.includes('report')" style="color: #6C87FF;font-size: 14px;cursor: pointer;"
                       class="murphy icon-principal"></i>
                </div>
            </div>
            <!-- <div class="button-icon-grey"> -->
            <div class="small_person">
                <UserComp :name="info.owner_user_name" />
            </div>
        </div>
        <!-- <div class="item">
            <div style="margin-bottom: 6px;">创建时间</div>
            <div class="info">{{ formatDate(info.created_at) }}</div>
        </div> -->
    </div>

    <div class="code_info" v-if="info.import_object && info.import_object?.length">
        <div class="name">
            组件引入信息
        </div>
        <div>
            <div class="item">
                <div>提交人</div>
                <div class="info">
                    <UserComp :name="info.import_object[0]?.username" />
                </div>
            </div>
            <div class="item">
                <div>提交邮箱</div>
                <div class="info">{{ info.import_object[0]?.email }}</div>
            </div>
            <div class="item">
                <div>commit</div>
                <div class="info" style="word-break: break-all;">
                    {{ info.import_object[0]?.commit }}
                    <i class="murphy icon-fuzhi1 g-cursor-pointer g-color-3" id="copy_url"
                       :data-clipboard-text="info.import_object[0]?.commit" @click="copyFunc('#copy_url')"></i>
                </div>
            </div>
            <div class="item">
                <div>提交时间</div>
                <div class="info">
                    {{ info.import_object[0]?.submit_time ?
                        formatDate(info.import_object[0]?.submit_time) : '-'
                    }}
                </div>
            </div>
        </div>
    </div>

    <div class="dynamic">
        <div class="name">安全问题动态</div>
        <div style="max-height: 900px; overflow: auto;">
            <div class="item" v-for="(item, index) in info.repository_log" :key="index">
                <div class="g-f-14 g-fw-400 g-color-3" style="margin-bottom: 12px;">{{ formatDate(item.created_at) }}
                </div>
                <!-- <div class="dynamic_content" v-html="item.show_title"></div> -->

                <!-- 动态 -->
                <div>
                    <div class="g-mr-4" style="display: inline-block;vertical-align: 2px;">
                        <UserComp
                            v-if="item.log_type !== 20 && item.log_type !== 23 && item.log_type !== 22 && item.log_type !== 11"
                            :name="item.user_name" />
                    </div>
                    <span v-if="item.log_type === 21">
                        <span class="text">扫描了项目后，系统检测后创建了该安全问题</span>
                    </span>
                    <span v-else-if="item.log_type === 8">
                        <span class="text">将安全问题状态变更为 <span class="g-fw-500">待修复</span></span>
                    </span>
                    <span v-else-if="item.log_type === 6">
                        <span class="text">提交了PR</span>
                    </span>
                    <span v-else-if="item.log_type === 1">
                        <span class="text">将安全问题状态变更为 <span class="g-fw-500">已修复</span> </span>
                    </span>
                    <span v-else-if="item.log_type === 20">
                        <span class="text"><span class="g-fw-500">「系统」</span>本次检测到安全问题依旧存在，已重新打开安全问题，安全问题状态为 <span
                            class="g-fw-500">待修复</span></span>
                    </span>
                    <span v-else-if="item.log_type === 5">
                        <span class="text">将安全问题状态变更为 <span class="g-fw-500">7天忽略</span>
                            <div class="g-color-3 g-mt-4">原因： {{ item.log_desc.split('：')[0] }}</div>
                            <div class="g-color-3 g-mt-4" v-if="item.log_desc.split('：')[1]">说明： {{
                                item.log_desc.split('：')[1] }}</div>
                        </span>
                    </span>
                    <span v-else-if="item.log_type === 23">
                        <span class="text">7天忽略已到期，<span class="g-fw-500">「系统」</span>已重新打开安全问题，安全状态为 <span
                            class="g-fw-500">待修复</span></span>
                    </span>
                    <span v-else-if="item.log_type === 2">
                        <span class="text">将安全问题状态变更为 <span class="g-fw-500">关闭</span>
                            <div class="g-color-3 g-mt-4">原因： {{ item.log_desc.split('：')[0] }}</div>
                            <div class="g-color-3 g-mt-4" v-if="item.log_desc.split('：')[1]">说明： {{
                                item.log_desc.split('：')[1] }}</div>
                        </span>
                    </span>
                    <span v-else-if="item.log_type === 4">
                        <span class="text">将安全问题状态变更为 <span class="g-fw-500">待修复</span></span>
                    </span>
                    <span v-else-if="item.log_type === 22">
                        <span class="text"><span class="g-fw-500">「系统」</span>本次未检测到该安全问题，安全问题被关闭，安全问题状态为 <span
                            class="g-fw-500">已修复</span></span>
                    </span>
                    <span v-else-if="item.log_type === 3">
                        <span class="text">将安全问题指派给
                            <span style="vertical-align: 2px;">
                                <UserComp :name="item.related_user_name" />
                            </span>
                        </span>
                    </span>
                    <span v-else-if="item.log_type === 11">
                        <span class="text">接入了一个代码项目</span>
                    </span>
                </div>

            </div>
            <NoData :image-size="80" v-if="!info.repository_log || !info.repository_log.length" />
        </div>
    </div>

    <ChangePrincipal v-model="store.isShowChangePrincipal" v-if="store.isShowChangePrincipal"
                     :currentUser="info.owner_user_id" />
</template>

<script setup lang='ts'>
import {
    formatDate, copyFunc,
} from 'util/tools';
import store from 'util/store';
import UserComp from '@/components/UserComp.vue';
import NoData from '@/components/NoData.vue';
import ChangePrincipal from '../comp/ChangePrincipal.vue';

defineProps(['info']);

</script>

<style scoped lang='less'>
.ai-chat {
    width: 100%;
    height: 78px;
    border-radius: 6px;
    background: linear-gradient(135deg, #6C87FF 0%, #996DF7 100%);
}

.name {
    font-size: 16px;
    margin-bottom: 16px;
    color: #3c3c3c;
    font-weight: 500;
}

.code_info,
.fund_info,
.dynamic {
    background: #FFFFFF;
    border-radius: 6px;
    padding: 16px;
    font-size: 12px;
    color: #8F959E;
    margin-bottom: 16px;
}

.dynamic {

    .text {
        font-size: 14px;
        font-weight: 400;
        color: #525252;
    }
}

.small_person {
    display: inline-block;
    background: rgba(31, 35, 41, 0.1);
    border-radius: 10px;
    font-size: 12px;
    color: #3c3c3c;
    // padding: 4px 8px;
    padding-right: 6px;
    margin-top: 6px;

    img {
        width: 20px;
        border-radius: 50%;
        vertical-align: -5px;
    }
}

.item {
    margin-bottom: 12px;
}

.item .link {
    a {
        color: #6C87FF;
    }

    word-break: break-all;
}

.info {
    font-size: 14px;
    color: #3c3c3c;
    margin-top: 4px;
}

.dynamic {
    margin-bottom: 0;

    img {
        width: 24px;
        border-radius: 50%;
        vertical-align: middle;
        margin-bottom: 4px;
    }

    .time {
        margin-bottom: 8px;
    }

    .user {
        color: #3c3c3c;
    }

    .item {
        font-size: 14px;
        color: #525252;
        padding-bottom: 8px;
        line-height: 24px;
    }
}
</style>
