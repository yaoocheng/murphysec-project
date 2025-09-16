<template>
    <el-dialog width="1300" @open="open" top="5%">
        <div v-if="info&&info.length">
            <div class="g-f-18 g-color-1 g-mb-16">
                {{ info ? info[0]?.image_name : '暂无' }}
                <span v-if="info" class="tag">版本：{{ info ? info[0]?.image_version : '暂无' }}</span>
                <span v-if="info" class="tag">ID：{{ info ? info[0]?.image_id : '暂无' }}</span>
                <!-- <span v-if="info" class="tag">{{ info ? info[0]?.app_type : '' }}</span> -->
            </div>
            <div class="cluster" v-for="item in info" :key="item.cluster_name">
                <div class="head">
                    <div>
                        集群名称/ID：{{ item.cluster_name || '暂无' }}
                    </div>
                    <div>
                        节点名称/ID：{{ item.host_id || '暂无' }}
                    </div>
                    <div>
                        POD名称：{{ item.pod_name || '暂无' }}
                    </div>
                    <div>
                        容器 IP：{{ item.ip || '暂无' }}
                    </div>
                </div>

                <div class="item">
                    <div class="cur">
                        <span>容器全名称</span>
                        <el-tooltip :content="item.container_full_name">
                            <div class="long">{{ item.container_full_name || '暂无' }}</div>
                        </el-tooltip>
                    </div>
                    <div class="cur">
                        <span>容器名称</span>
                        <div>
                            {{ item.container_name || '暂无' }}
                            <span class="tag" style="display: inline-block;color:#2946C7">应用类型：{{ item.app_type }}</span>
                        </div>
                    </div>
                    <div class="cur">
                        <span>容器类型</span>
                        <div v-for="ele in item.container_type" :key="ele">{{ ele }}</div>
                    </div>
                </div>
                <div class="item">
                    <div class="cur">
                        <span>容器hash_id</span>
                        <el-tooltip :content="item.container_hash_id">
                            <div class="long">{{ item.container_hash_id || '暂无' }}</div>
                        </el-tooltip>
                    </div>
                    <div class="cur">
                        <span>容器运行状态</span>
                        <div v-if="item.container_run_state === 0">运行中</div>
                        <div v-if="item.container_run_state === 1">已停止</div>
                        <div v-if="item.container_run_state === 2">已暂停</div>
                        <div v-if="item.container_run_state == 30">已删除</div>
                    </div>
                    <div class="cur">
                        <span>POD命名空间</span>
                        <div>{{ item.pod_namespace || '暂无' }}</div>
                    </div>
                </div>
                <div class="item">
                    <div class="cur">
                        <span>容器标签</span>
                        {{ item.labels || '暂无' }}
                    </div>
                    <div class="cur">
                        <span>启动时间</span>
                        {{ item.start_time || '暂无' }}
                    </div>
                    <div class="cur">
                        <span>上次停止时间</span>
                        <div>{{ item.stop_time || '暂无' }}</div>
                    </div>
                </div>
            </div>
        </div>
        <NoDate v-else />
    </el-dialog>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { getContainerInfoApi } from 'api/project';
import NoDate from 'comp/NoData.vue';

const props = defineProps(['info']);
const info = ref<Array<any>>([]);
const open = async () => {
    const res = await getContainerInfoApi({
        addr: props.info.addr,
        image_name: props.info.name,
        image_version: props.info.branch,
        sha: props.info.commit,
        extend: props.info.extend,
    });
    info.value = res.data;
};
</script>

<style lang='less' scoped>
span.tag {
    padding: 3px 5px;
    background: rgba(73, 102, 230, 0.2);
    border-radius: 4px;
    color: #2946C7;
    font-size: 12px;
    margin-right: 4px;
    display: inline-block;
}

.cluster {
    border-radius: 6px;
    border: 1px solid rgba(42, 43, 50, 0.10);
    margin-bottom: 16px;

    .head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 24px;
        font-size: 14px;
        font-weight: 500;
        color: #2A2B32;
        background: rgba(235, 235, 235, 0.50);
    }

    .item {
        display: flex;
        justify-content: space-between;
        padding: 8px 24px;

        .long {
            width: 400px;
            .ellipsis();
        }

        span {
            display: block;
            font-size: 12px;
            color: #858585;
            margin-bottom: 6px;
        }

        .cur {
            flex: 1;
        }
    }
}
</style>
