<template>
    <el-dialog width="840px" title="开源项目许可证">
        <div class="mt-6 h-[500px] overflow-auto text-3c">
            <div v-for="item in list" :key="item.name" class="p-4 rounded-md bg-f7">
                <div class="flex items-center justify-between">
                    <div>
                        <span class="font-medium">{{ item.name }}</span>
                        <TagComp v-if="licenseOption?.length" class="ml-2 font-normal" c="#fff"
                                 :bgc="licenseOption.find(ele => ele.value === item.level)?.c"
                                 :content="`${licenseOption.find(ele => ele.value === item.level)?.label}风险`" />
                        <span class="ml-4">文件路径：{{ item.path }}</span>
                    </div>
                    <!-- <span @click="getText(item)" class="text-primary flex items-center cursor-pointer"> -->
                    <span @click="getText(item)" class="expand_icon">
                        声明内容
                        <ExpandIcon :type="'t'" :expand="item.expand" />
                    </span>
                </div>

                <div @click.stop v-if="item.expand" class="bg-ff max-h-[400px] overflow-auto p-3 mt-2">
                    <pre v-if="item.code">{{ item.code }}</pre>
                    <div v-else class="text-center">暂无许可证声明内容</div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { getProjectLicenseTxtApi } from 'api/detail';
import { licenseOption } from './business';

const { projectItemInfo } = defineProps(['projectItemInfo']);
const route = useRoute();

if (projectItemInfo.target_project_spdx) {
    projectItemInfo.target_project_spdx.forEach((item) => {
        item.expand = false;
    });
} else {
    projectItemInfo.target_project_license_list.forEach((item) => {
        item.expand = false;
    });
}

const list = ref(projectItemInfo.target_project_license_list || projectItemInfo.target_project_spdx);

const getText = async (item) => {
    // if (!item.code) {
    try {
        const { data } = await getProjectLicenseTxtApi({
            project_id: route.params.tid,
            subtask_id: route.params.sid,
            target_project_id: projectItemInfo.target_project_id,
            text_index: item.text_index,
        });
        item.code = data.license_text;
        item.expand = !item.expand;
    } catch (error) {
        console.log(error);
    }
    // } else {
    //     item.expand = !item.expand;
    // }
};
</script>
