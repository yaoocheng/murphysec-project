<template>
    <CommonHead>
        <span>用户组</span>
    </CommonHead>
    <div class="main_content">
        <div class="content">
            <div>
                <div @click="openMemberHandle(item.group_name, item.group_id)" class="item" v-for="item in groupData"
                    :key="item">
                    <div>
                        <img src="~ast/img/class.png" alt="">
                        <span>{{ item.group_name }}（{{ item.user_total }}）</span>
                    </div>
                    <span style="color:#6C87FF; cursor: pointer;">下级</span>
                </div>
            </div>
            <NoData v-if="!groupData || !groupData.length" />
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import NoData from 'comp/NoData.vue';
import store from 'util/store';
import { getGruopListApi } from 'api/team';
import CommonHead from '@/components/CommonHead.vue';

const router = useRouter();
const groupData = ref<Array<any>>([]);

onBeforeMount(async () => {
    const res = await getGruopListApi({ team_id: store.teamInfo.team_id });
    groupData.value = res.data;
});

const openMemberHandle = (name: string, groupId: string) => {
    store.groupName = name;
    router.push(`/member/${groupId}`);
};
</script>

<style lang='less' scoped>
.content {
    box-sizing: border-box;
    height: 100%;
    overflow: auto;
    font-size: 14px;
    color: #3D3D3D;
    background-color: #fff;
    padding: 16px;
    border-radius: 6px;

    img {
        width: 32px;
        height: 32px;
        vertical-align: middle;
        margin-right: 8px;
        border-radius: 50%;
    }

    .item {
        cursor: pointer;
        height: 48px;
        transition: all .2s;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #F2F4F6;
        padding: 16px;
        border-radius: 6px;
        background: var(--gray, #F7F8FB);
        box-sizing: border-box;
    }

    .info {
        display: flex;

        .name {
            font-size: 14px;
            font-weight: 600;
            color: #3D3D3D;
            margin-bottom: 5px;
        }

        .contact {
            font-size: 12px;
            color: #8C95A1;

            i {
                vertical-align: middle;
            }
        }
    }

    .num {
        display: inline-block;
        line-height: 32px;
        text-align: center;
        width: 32px;
        height: 32px;
        background: #6C87FF;
        border-radius: 13px;
        color: #fff;
    }

    .time {
        color: #A2A8B3;
    }

    .width:nth-of-type(1) {
        width: 50%;
    }

    .width:nth-of-type(2) {
        width: 30%;
    }
}
</style>
