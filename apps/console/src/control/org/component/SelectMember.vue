<template>
    <el-select-v2 :options="listData" :props="{ value: 'user_id', label: 'nickname' }" :filterable="true" multiple
        popper-class="custom-select-popper" class="g-w-100" placeholder="请搜索并选择团队负责人">
        <template #default="{ item }">
            <!-- <el-option v-for="item in listData" :key="item.user_id" :label="item.nickname" :value="item.user_id"> -->
            <div class="g-flex g-align-center">
                <AvatarComp class="g-mr-8" :size="24" :name="item.nickname" />
                <div class="g-flex g-align-center">
                    <div class="g-color-1 g-fw-400">{{ item.nickname }}（{{ item.email }}）</div>

                    <el-tooltip placement="top">
                        <template #content>
                            <div v-for="(ele) in item.org_names" :key="ele">
                                {{ ele }}
                            </div>
                        </template>
                        <div class="g-fw-400 g-f-12 g-color-3 g-flex ellipsis" style="max-width: 300px;">
                            <span v-for="(ele, index) in item.org_names" :key="ele">
                                {{ ele }}
                                <span v-if="index !== item.org_names.length - 1">、</span>
                            </span>
                        </div>
                    </el-tooltip>
                </div>
            </div>
            <!-- </el-option> -->
        </template>
    </el-select-v2>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { getOrgMemberApi } from 'api/org';
import AvatarComp from 'comp/AvatarComp.vue';
import { orgHooks } from '../hooks';

const filterOptions = ref<any>({
    org_id: 2,
    org_path: '1,2,',
    include_child: 1,
    page: undefined,
    limit: undefined,
});

const {
    listData,
} = orgHooks(getOrgMemberApi, filterOptions);

</script>
