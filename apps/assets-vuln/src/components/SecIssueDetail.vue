<template>
    <div class="sec-issue-detail">
        <div class="sec-issue-detail-header">
            <a>这是安全问题详情</a>
            <a @click="close">关闭</a>
        </div>
        <div class="sec-issue-detail-content">
            <div class="basic_information">
                <a class="title">基本信息</a>
                <div class="basic_information_content shadow-box">
                    <a>安全问题ID 234324</a>
                    <a>安全问题名称 234324</a>
                    <a>安全问题描述 234324</a>
                    <a>安全问题等级 234324</a>
                    <a>安全问题状态 234324</a>
                    <a>安全问题创建时间 234324</a>
                    <a>安全问题更新时间 234324</a>
                </div>
            </div>
            <div class="range_of_impact">
                <a class="title">影响范围</a>
                <div class="range_of_impact_content shadow-box">
                    <a>影响范围 234324</a>
                </div>
            </div>
            <div class="vulnerability_list">
                <a class="title">漏洞列表</a>
                <div class="vulnerability_list_content">
                    <a>漏洞名称 234324</a>
                    <a>漏洞描述 234324</a>
                    <a>漏洞等级 234324</a>
                    <a>漏洞创建时间 234324</a>
                    <a>漏洞更新时间 234324</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';

const emit = defineEmits(['close']);
const props = defineProps({
    id: {
        type: String,
        required: true,
    },
});

onMounted(() => {
    console.log('secIssueDetailVisible');
    console.log('id', props.id);
});

const close = () => {
    emit('close');
};
</script>

<style scoped >

.sec-issue-detail{
    background-color: #ffffff;
    width: 100%;
    height: 93%;
    position: absolute;
    bottom: 0;
    right: 0;
}

.title {
    font-size: 16px;
    font-weight: bold;
    color: #000000;
}

.sec-issue-detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 40px 10px;
    border-bottom: 1px solid #000000;
}

.sec-issue-detail-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin: 20px 40px 20px;

    .shadow-box{
        border: 1px solid #000000;
    }
}

</style>
