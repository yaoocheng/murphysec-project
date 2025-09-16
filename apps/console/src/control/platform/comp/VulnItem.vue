<template>
    <div class="item flex-1 ml-3">
        <div class="top">
            <div class="part_info">
                <a class="hover_text g-f-14 g-fw-500 g-color-1 g-mr-4"
                    :href="generateVulnLink(info.mps_id, info.cve_id)" target="_blank">
                    {{ info.title }}
                </a>
                <TagComp class="ml-1 mr-1" c="#fff" :bgc="getDangerLevel(info?.level).color"
                    :content="getDangerLevel(info?.level).text" />
                <TagComp class="g-mr-4" :content="repaireChangeColor(info?.fix_suggestion_level||info?.suggest).text"
                    :c="repaireChangeColor(info?.fix_suggestion_level||info?.suggest).color"
                    :bgc="repaireChangeColor(info?.fix_suggestion_level||info?.suggest).bgc" />
                <TagComp class="g-mr-4" content="CVE未收录漏洞" v-if="!info?.cve_id">
                </TagComp>
                <TagComp class="g-mr-4" content="独家漏洞" v-if="info?.is_sole">
                </TagComp>
                <TagComp content="投毒组件" v-if="info?.cwe_id === 'CWE-506'"></TagComp>
                <TagComp bgc="#14C0FF33" c="#049FD7" class="g-mr-4" v-if="info?.cavd_id"
                    :content="'CAVD漏洞'" />
            </div>
        </div>

        <div class="bottom">
            <div class="part_info">
                编号
                <span class="info">{{ info?.cve_id || info?.mps_id
                    }}</span>
            </div>

            <div class="part_info">
                POC
                <span class="info">{{ info?.poc ? '有' : '无' }}</span>
            </div>

            <div class="part_info">
                利用成本
                <span class="info">{{ info?.exploit_requirement_cost || '暂无'
                    }}</span>
            </div>

            <div class="part_info">
                影响范围
                <span class="info">{{ info?.scope_influence || '暂无' }}</span>
            </div>

            <div class="part_info">
                可触发漏洞
                <span class="info">{{ info?.is_triggers ? '是' : '否' }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import { generateVulnLink, repaireChangeColor, getDangerLevel } from 'util/tools';

const props = defineProps(['info']);
const { info } = toRefs(props);

</script>

<style lang="less" scoped>
.item {
    height: 84px;
    padding: 16px;
    padding-left: 0;
    box-sizing: border-box;
    background-color: #F7F8FB;
    margin-bottom: 8px;
    border-radius: 4px;

    .tag {
        padding: 3px 6px;
        // background: #34C72433;
        border-radius: 4px;
        display: inline-block;
        font-size: 12px;
        // color: #2EA121;
        font-weight: 500;
        transform: scale(0.8);
        margin-left: -6px;

        i {
            font-size: 12px;
            margin-right: 5px;
        }
    }

    .info {
        font-size: 14px;
        color: #3c3c3c;
        // font-weight: 500;
        display: inline-block;
        vertical-align: -3px;
    }

    .top,
    .bottom {
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        color: #8F959E;
    }

    .bottom {
        font-size: 12px;
    }

    .comp-tag .tag {
        margin-left: -8px;
    }

    .part_info {
        margin-left: 16px;

        .tag {
            margin-right: -0;
            color: #2946C7 !important;
            background-color: #4966E633 !important;
        }

        .info {
            margin-left: 4px
        }

        .center();

        a {
            color: @text-color;
        }

        a:hover {
            color: #6c87ff;
            text-decoration: underline;
        }
    }
}
</style>
