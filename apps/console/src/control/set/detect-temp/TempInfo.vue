<template>
    <el-dialog width="840px" title="检测范围模版">
        <el-form label-position="top" label-width="auto">
            <el-form-item class="g-mb-24" label="扫描语言">
                <div>
                    <span v-for="item in showInfo?.info?.language_filter" :key="item.language"
                        class="tag g-mr-4 lang-tag">{{ item.language }}</span>
                    <span v-if="!showInfo?.info?.language_filter?.length">全部语言</span>
                </div>
            </el-form-item>

            <el-form-item class="g-mb-24" label="排除目录">
                <template #label>
                    <div>
                        排除目录
                        <TipsComp content="排除目录" placement="right" />
                    </div>
                </template>

                <div>
                    <div v-for="item in showInfo?.info?.exclude_dir_regular" :key="item" class="g-color-1">
                        {{ item }}
                    </div>
                    <div v-if="!showInfo?.info?.exclude_dir_regular?.length">-</div>
                </div>
            </el-form-item>

            <el-form-item class="g-mb-24" label="排除目录">
                <template #label>
                    <div>
                        扫描目录
                        <TipsComp content="扫描目录" placement="right" />
                    </div>
                </template>
                <div>
                    <div v-for="item in showInfo?.info?.include_dir_regular" :key="item" class="g-color-1">
                        {{ item }}
                    </div>
                    <div v-if="!showInfo?.info?.include_dir_regular?.length">-</div>
                </div>
            </el-form-item>

            <el-form-item class="g-mb-24" label="模版名称">
                <div>
                    {{ showInfo.name }}
                </div>
            </el-form-item>

            <el-form-item label="模版说明">
                <div>
                    {{ showInfo.description || '-' }}
                </div>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script setup lang='ts'>
import TipsComp from 'comp/TipsComp.vue';

defineProps(['showInfo']);
</script>

<style scoped lang='less'>
.lang-tag {
    display: inline;
    font-size: 14px;
    font-weight: 400;
    padding: 4px 6px;
    color: #3c3c3c;
    background-color: #2A2B321A;
}
</style>
