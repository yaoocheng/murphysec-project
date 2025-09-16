<template>
    <div :class="{ 'tree_diff_full_screen': isFullScreen }" class="h-full w-full bg-ff box-border rounded-md p-4">
        <div v-if="compareData?.LeftTree?.children?.length || compareData?.RightTree?.children?.length"
            class="mb-3 flex items-center justify-between">
            <el-checkbox v-model="isCheckDiffFile" @change="changeCheckDiffFile">
                <template #default>
                    <span class="font-normal text-3c">仅查看有差异的文件</span>
                </template>
            </el-checkbox>
            <span v-if="!isFullScreen" class="hover_icon cursor-pointer">
                <i @click="isFullScreen = true" class="murphy icon-full-screen-open"></i>
            </span>
            <span v-else class="hover_icon cursor-pointer">
                <i @click="isFullScreen = false" class="murphy icon-full-screen-close"></i>
            </span>
        </div>

        <div v-if="compareData?.LeftTree?.children?.length || compareData?.RightTree?.children?.length"
            style="border: 1px solid #EBEBEB; height: calc(100% - 50px);" class="relative rounded-md">
            <div class="flex">
                <div class="flex-1 border px-4 py-3 text-3c">当前任务</div>
                <!-- <el-divider direction="vertical" class="h-[45px] mx-0 border-slate-200" /> -->
                <div class="flex-1 border px-4 py-3 text-3c">对比任务</div>
            </div>

            <div style="height: calc(100% - 45px);" class="scroll_null flex w-full overflow-auto">
                <el-divider direction="vertical" style="left: 50%;top: 0"
                    class="absolute h-full mx-0 border-slate-200" />

                <div class="flex-1 box-border p-4">
                    <!-- <el-auto-resizer> -->
                    <!-- <template #default="{ width, height }"> -->
                    <el-tree v-if="compareData?.LeftTree?.children?.length" node-key="id" :highlight-current="true"
                        :filter-node-method="filterNode" :props="treeProp" class="code-tree flex-1"
                        :data="compareData?.LeftTree?.children" @node-click="nodeClick1" ref="tree1">
                        <template #default="{ node, data }">
                            <TreeLine :showLabelLine="true" :node="node">
                                <template #node-label>
                                    <div class="w-full pl-2 flex justify-between text-3c text-sm font-normal leading-7">

                                        <div class="flex items-center">
                                            <i v-if="data.type === 'd'" class="murphy text-85 mr-1"
                                                :class="{ 'icon-shouqi1': !node.expanded, 'icon-zhankai': node.expanded||!data.children?.length }"></i>

                                            <img class="w-5" v-if="data.type === 'd'" :src="getFileImg(data.diff_type)"
                                                alt="">

                                            <span :style="{ color: getDiffColor(data.diff_type, data.type) }" class="ml-1">{{
                                                data.name }}</span>
                                        </div>

                                        <div v-if="data.type === 'f'" :style="{ color: getDiffColor(data.diff_type, data.type) }">
                                            {{ (data.size / 1000).toFixed(2) }} KB</div>
                                    </div>
                                </template>

                            </TreeLine>
                        </template>
                    </el-tree>

                    <div v-else class="h-full flex items-center justify-center">
                        <NoData />
                    </div>

                        <!-- </template> -->
                    <!-- </el-auto-resizer> -->
                </div>

                <div class="flex-1 box-border p-4">
                    <!-- <el-auto-resizer>
                        <template #default="{ width, height }"> -->
                    <el-tree v-if="compareData?.RightTree?.children?.length" node-key="id" :highlight-current="true"
                        :filter-node-method="filterNode" :props="treeProp" class="code-tree flex-1"
                        :data="compareData?.RightTree?.children" @node-click="nodeClick2" ref="tree2">
                        <template #default="{ node, data }">
                            <TreeLine :showLabelLine="true" :node="node">
                                <template #node-label>
                                    <div class="w-full pl-2 flex justify-between text-3c text-sm font-normal leading-7">

                                        <div class="flex items-center">
                                            <i v-if="data.type === 'd'" class="murphy text-85 mr-1"
                                                :class="{ 'icon-shouqi1': !node.expanded, 'icon-zhankai': node.expanded||!data.children?.length }"></i>
                                            <img class="w-5" v-if="data.type === 'd'" :src="getFileImg(data.diff_type)"
                                                alt="">
                                            <span :style="{ color: getDiffColor(data.diff_type, data.type) }" class="ml-1">{{
                                                data.name }}</span>
                                        </div>

                                        <div v-if="data.type === 'f'" :style="{ color: getDiffColor(data.diff_type, data.type) }">
                                            {{ (data.size / 1000).toFixed(2) }} KB</div>
                                    </div>
                                </template>
                            </TreeLine>
                        </template>
                    </el-tree>

                    <div v-else class="h-full flex items-center justify-center">
                        <NoData />
                    </div>                    <!-- </template>
                    </el-auto-resizer> -->
                </div>
            </div>
        </div>

        <NoData class="mt-20" description="暂无文件差异" v-else />
    </div>

    <FileDiff v-model="showFileDiff" :path="path" :fileDiffCode="fileDiffCode" />
</template>

<script setup lang='ts'>
import { ref, h } from 'vue';
import diff_one from 'ast/img/diff_one.png';
import diff_two from 'ast/img/diff_double.png';
import diff_n from 'ast/img/diff_n.png';
import diff_del from 'ast/img/diff_del.png';
import { getElementLabelLine } from 'element-tree-line';
// import { data1, data2 } from './mock';
import NoData from 'comp/NoData.vue';
import { getDiffFileInfo } from 'api/project';
import { compareData, ids, treehandle } from './data';
import FileDiff from './FileDiff.vue';
import 'element-tree-line/dist/style.css';

const isCheckDiffFile = ref<boolean>(false);
const showFileDiff = ref<boolean>(false);
const isFullScreen = ref<boolean>(false);
const treeProp = {
    // value: 'id',
    label: 'name',
    children: 'children',
};

const tree1 = ref();
const tree2 = ref();
const TreeLine = getElementLabelLine(h);
const fileDiffCode = ref<any>({});
const path = ref<string>('');

treehandle(compareData.value?.LeftTree?.children, '');
treehandle(compareData.value?.RightTree?.children, '');

// 过滤
const changeCheckDiffFile = (val: boolean) => {
    tree1.value.filter(val);
    tree2.value.filter(val);
};

const filterNode = (val: any, data: any) => {
    if (val) {
        return data.diff_type !== 'na';
    }
    return true;
};

const getFileImg = (diffType: string) => {
    if (diffType === 'modify') return diff_one;
    if (diffType === 'modify_part') return diff_two;
    if (diffType === 'add' || diffType === 'delete') return diff_del;
    return diff_n;
};

const getDiffColor = (diffType: string, fileType:string) => {
    if (fileType === 'f') {
        if (diffType === 'add' || diffType === 'delete') return '#7842F0';
        if (diffType === 'modify') return '#F34D3D';
        if (diffType === 'na' || diffType === 'modify_part') return '#3c3c3c';
    }
};

const checkFileDiff = async (node: any, flag: number) => {
    if (node.type === 'f') {
        const sn = flag === 1 ? tree2.value.getNode(node.id).data?.file_index : node.file_index;
        const fn = flag === 1 ? node.file_index : tree1.value.getNode(node.id).data?.file_index;

        const sn_encode = flag === 1 ? tree2.value.getNode(node.id).data?.encoding : node.encoding;
        const fn_encode = flag === 1 ? node.encoding : tree1.value.getNode(node.id).data?.encoding;

        try {
            const { data } = await getDiffFileInfo(ids.value.fid, ids.value.sid, fn, sn, fn_encode, sn_encode);
            showFileDiff.value = true;
            path.value = node.path;
            fileDiffCode.value = {
                leftInfo: flag === 1 ? node : tree1.value.getNode(node.id).data,
                rightInfo: flag === 1 ? tree2.value.getNode(node.id).data : node,
                ...data,
            };
        } catch (error) {
            console.log(error);
        }
    }
};

const nodeClick1 = async (node: any) => {
    if (!tree1.value.getNode(node.id).data?.children?.length) {
        tree1.value.getNode(node.id).expanded = !tree1.value.getNode(node.id).expanded;
    }

    tree2.value.getNode(node.id).expanded = !tree2.value.getNode(node.id).expanded;
    tree2.value.setCurrentKey(node.id);

    checkFileDiff(node, 1);
};
const nodeClick2 = async (node: any) => {
    if (!tree2.value.getNode(node.id).data?.children?.length) {
        tree2.value.getNode(node.id).expanded = !tree2.value.getNode(node.id).expanded;
    }
    tree1.value.getNode(node.id).expanded = !tree1.value.getNode(node.id).expanded;
    tree1.value.setCurrentKey(node.id);

    checkFileDiff(node, 2);
};

</script>

<style lang="less">
.tree_diff_full_screen {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    border-radius: 0;
    padding: 24px;
    z-index: 999;
}

.border {
    border-bottom: 1px solid #EBEBEB
}

.code-tree {
    .element-tree-node-line-hor {
        width: 10px !important;
    }

    .el-icon {
        display: none;
    }

    .el-tree-node__content:hover {
        background-color: #EBEBEB !important;
    }

    .el-tree-node.is-current>.el-tree-node__content {
        background-color: #6C87FF1A !important;

    }

}

.scroll_null::-webkit-scrollbar {
    display: none;
    /* Chrome Safari */
}

.scroll_null {
    scrollbar-width: none;
    /* firefox */
    -ms-overflow-style: none;
    /* IE 10+ */
    overflow-x: hidden;
    overflow-y: auto;
}
</style>
