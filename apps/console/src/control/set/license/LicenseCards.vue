<template>
    <SearchComp class="g-mb-16" @input="searchHandle" v-model="keyword" clearable placeholder="请搜索许可证名称" />

    <div style="height: 78%;">
        <div style="height: 100%;" class="g-flex g-justify-between">
            <div>
                <div class="g-f-14 g-fw-500 g-color-1 g-mb-8">
                    <i style="color: #F34D3D;" class="murphy icon-tanhao1 g-vertical--1"></i>
                    高风险 {{ highList.length }}
                </div>
                <section class="el1" ref="el1">
                    <div class="card risk-1 cursor-move" :class="{ 'high-light': item.highlight }"
                        v-for="item in highList" :key="item.license_name">
                        <div class="name g-color-1 g-fw-500 g-mb-8">
                            <span style="max-width: 200px;" class="ellipsis">{{ item.license_name }}</span>
                            <span v-if="lincenseStore.type !== 3" @click="editLicenseModal = true; licenseDesc = item"
                                class="hover_icon" :class="{ 'hover-icon-high--light': item.highlight }">
                                <i class="murphy icon-Union2"></i>
                            </span>
                        </div>
                        <el-tooltip v-if="item.license_desc" placement="top">
                            <template #content>
                                <div style="max-width: 344px;">
                                    {{ item.license_desc }}
                                </div>
                            </template>
                            <div class="g-f-12 g-fw-400 desc">
                                {{ item.license_desc }}
                            </div>
                        </el-tooltip>
                        <!-- <div v-else class="g-f-12 g-fw-400 desc">
                            {{ '暂无许可证说明' }}
                        </div> -->
                    </div>
                </section>
            </div>

            <div>
                <div class="g-f-14 g-fw-500 g-color-1 g-mb-8">
                    <i style="color: #FF9940;" class="murphy icon-tanhao1 g-vertical--1"></i>
                    中风险 {{ midList.length }}
                </div>
                <section class="el2" ref="el2">
                    <div class="cursor-move card risk-2" :class="{ 'high-light': item.highlight }"
                        v-for="item in midList" :key="item.license_name">
                        <div class="name g-color-1 g-fw-500 g-mb-8">
                            <span style="max-width: 200px;" class="ellipsis">{{ item.license_name }}</span>
                            <span v-if="lincenseStore.type !== 3" @click="editLicenseModal = true; licenseDesc = item"
                                class="hover_icon" :class="{ 'hover-icon-high--light': item.highlight }">
                                <i class="murphy icon-Union2"></i>
                            </span>
                        </div>
                        <el-tooltip v-if="item.license_desc" placement="top">
                            <template #content>
                                <div style="max-width: 344px;">
                                    {{ item.license_desc }}
                                </div>
                            </template>
                            <div class="g-f-12 g-fw-400 desc">
                                {{ item.license_desc }}
                            </div>
                        </el-tooltip>
                        <!-- <div v-else class="g-f-12 g-fw-400 desc">
                            {{ '暂无许可证说明' }}
                        </div> -->
                    </div>
                </section>
            </div>

            <div>
                <div class="g-f-14 g-fw-500 g-color-1 g-mb-8">
                    <i style="color: #FFCC33;" class="murphy icon-tanhao1 g-vertical--1"></i>
                    低风险 {{ lowList.length }}
                </div>
                <section class="el3" ref="el3">
                    <div class="cursor-move card risk-3" :class="{ 'high-light': item.highlight }"
                        v-for="item in lowList" :key="item.license_name">
                        <div class="name g-color-1 g-fw-500 g-mb-8">
                            <span style="max-width: 200px;" class="ellipsis">{{ item.license_name }}</span>
                            <span v-if="lincenseStore.type !== 3" @click="editLicenseModal = true; licenseDesc = item"
                                class="hover_icon" :class="{ 'hover-icon-high--light': item.highlight }">
                                <i class="murphy icon-Union2"></i>
                            </span>
                        </div>
                        <el-tooltip v-if="item.license_desc" placement="top">
                            <template #content>
                                <div style="max-width: 344px;">
                                    {{ item.license_desc }}
                                </div>
                            </template>
                            <div class="g-f-12 g-fw-400 desc">
                                {{ item.license_desc }}
                            </div>
                        </el-tooltip>
                        <!-- <div v-else class="g-f-12 g-fw-400 desc">
                            {{ '暂无许可证说明' }}
                        </div> -->
                    </div>
                </section>
            </div>

            <div>
                <div class="g-f-14 g-fw-500 g-color-1 g-mb-8">
                    <i style="color: #C7C7C780;" class="murphy icon-tanhao1 g-vertical--1"></i>
                    无风险 {{ safeList.length }}
                </div>
                <section class="el4" ref="el4">
                    <div class="cursor-move card risk-4" :class="{ 'high-light': item.highlight }"
                        v-for="item in safeList" :key="item.license_name">
                        <div class="name g-color-1 g-fw-500 g-mb-8">
                            <span style="max-width: 200px;" class="ellipsis">{{ item.license_name }}</span>
                            <span v-if="lincenseStore.type !== 3" @click="editLicenseModal = true; licenseDesc = item"
                                class="hover_icon" :class="{ 'hover-icon-high--light': item.highlight }">
                                <i class="murphy icon-Union2"></i>
                            </span>
                        </div>
                        <el-tooltip v-if="item.license_desc" placement="top">
                            <template #content>
                                <div style="max-width: 344px;">
                                    {{ item.license_desc }}
                                </div>
                            </template>
                            <div class="g-f-12 g-fw-400 desc">
                                {{ item.license_desc }}
                            </div>
                        </el-tooltip>
                        <!-- <div v-else class="g-f-12 g-fw-400 desc">
                            {{ '暂无许可证说明' }}
                        </div> -->
                    </div>
                </section>
            </div>
        </div>
    </div>

    <el-dialog v-model="editLicenseModal" @close="licenseDesc = {}" width="840px" title="编辑许可证信息"
        :close-on-click-modal="false">
        <div class="g-mb-32">
            <div class="g-fw-500 g-mb-8">许可证名称</div>
            <div>{{ licenseDesc.license_name }}</div>
        </div>
        <div class="g-mb-32">
            <div class="g-fw-500 g-mb-8">策略名称</div>
            <div>{{ lincenseStore.name }}</div>
        </div>
        <div class="g-mb-32">
            <div class="g-fw-500 g-mb-8">许可证说明</div>
            <el-input v-model="licenseDesc.license_desc" type="textarea" rows="4" placeholder="请输入许可证说明" maxlength="500"
                show-word-limit></el-input>
        </div>
        <div class="g-flex g-justify-end">
            <el-button @click="editLicenseModal = false; licenseDesc = {}" style="width: 80px;height: 32px;"
                class="minor_white_btn">取消</el-button>
            <el-button :disabled="!licenseDesc.license_desc" class="main_btn" @click="licenseEditConfirm">确定</el-button>
        </div>
    </el-dialog>
</template>

<script setup>
import { useDraggable } from 'vue-draggable-plus';
import { ref } from 'vue';
import SearchComp from 'comp/SearchComp.vue';
import lincenseStore, {
    highList, midList, lowList, safeList,
} from './store';

const editLicenseModal = ref(false);
const licenseDesc = ref({});
const keyword = ref('');
const el1 = ref();
const el2 = ref();
const el3 = ref();
const el4 = ref();

// 搜索筛选
const filterHighlight = (list, val) => {
    list.value.forEach((item) => {
        item.highlight = (val && item.license_name.includes(val));
    });
    // 高亮排前面
    list.value = [...list.value.filter((ele) => ele.highlight), ...list.value.filter((ele) => !ele.highlight)];
    document.getElementsByClassName('el1')[0].scrollTop = 0;
    document.getElementsByClassName('el2')[0].scrollTop = 0;
    document.getElementsByClassName('el3')[0].scrollTop = 0;
    document.getElementsByClassName('el4')[0].scrollTop = 0;
};

const searchHandle = (val) => {
    filterHighlight(highList, val);
    filterHighlight(midList, val);
    filterHighlight(lowList, val);
    filterHighlight(safeList, val);
};

// 拖拽绑定
const dragableFn = (el, list, risk) => {
    useDraggable(el, list, {
        animation: 0,
        group: 'license',
        // easing: true,
        disabled: lincenseStore.type === 3,
        // forceFallback: true,
        onAdd: () => {
            list.value.forEach((item) => {
                if (item.risk !== risk) {
                    item.risk = risk;
                    if (lincenseStore.licenses.some((ele) => ele.license_name === item.license_name)) {
                        lincenseStore.licenses.forEach((ele) => {
                            if (ele.license_name === item.license_name) {
                                Object.assign(ele, item);
                            }
                        });
                    } else {
                        lincenseStore.licenses.push(item);
                    }
                }
            });
        },
    });
};
dragableFn(el1, highList, 'High');
dragableFn(el2, midList, 'Medium');
dragableFn(el3, lowList, 'Low');
dragableFn(el4, safeList, 'Safe');

// 许可证修改
const licenseEditConfirm = () => {
    if (lincenseStore.licenses.some((ele) => ele.license_name === licenseDesc.value.license_name)) {
        lincenseStore.licenses.forEach((ele) => {
            if (ele.license_name === licenseDesc.value.license_name) {
                Object.assign(ele, licenseDesc.value);
            }
        });
    } else {
        lincenseStore.licenses.push(licenseDesc.value);
    }

    licenseDesc.value = {};
    editLicenseModal.value = false;
};
</script>

<style scoped lang='less'>
.card {
    border-radius: 6px;
    border: 1px solid #EBEBEB;
    border-left: 4px solid #F34D3D;
    padding: 16px 12px;
    margin-bottom: 12px;
    width: 300px;
    // height: 97px;
    box-sizing: border-box;
    background-color: #fff;
    cursor: pointer;

    .desc {
        overflow: hidden;
        height: 30px;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    .name {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 16px;

        .hover_icon {
            display: none;
            padding: 4px 5px;
            cursor: pointer;
        }

        i {
            font-size: 14px;
        }
    }
}

.card:hover .hover_icon {
    display: block;
}

.card:hover {
    box-shadow: 0px 8px 24px 0px #1F23290A;
}

section {
    width: 306px;
    height: 100%;
    overflow: auto;
}

.risk-1 {
    border-left-color: #F34D3D;
}

.risk-1.high-light {
    background-color: #EB4C3D1A;
    border-color: #F34D3D;

    .name {
        color: #D94536;
    }

    .hover-icon-high--light:hover {
        background-color: #f34c3d2a;
    }
}

.risk-2 {
    border-left-color: #FF9940;
}

.risk-2.high-light {
    background-color: #FF99401A;
    border-color: #FF9940;

    .hover-icon-high--light:hover {
        background-color: #ff99402f;
    }

    .name {
        color: #E58A3A;
    }
}

.risk-3 {
    border-left-color: #FFCC33;
}

.risk-3.high-light {
    background-color: #FFCC331A;
    border-color: #FFCC33;

    .hover-icon-high--light:hover {
        background-color: #ffcc332f;
    }

    .name {
        color: #E5B82E;
    }
}

.risk-4 {
    border-left-color: #C7C7C780;
}

.risk-4.high-light {
    background-color: #EBEBEB80;
    border-color: #C7C7C780;

    .hover-icon-high--light:hover {
        background-color: #EBEBEB80;
    }

    .name {
        color: #858585;
    }
}
</style>
