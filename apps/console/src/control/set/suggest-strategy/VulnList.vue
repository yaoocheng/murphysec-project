<template>
    <el-dialog align-center title="漏洞列表" width="840px" @closed="handleClose">
        <div class="desc text-85 font-normal mt-[-16px] mb-6">组件之间为"或"的关系</div>
        <div @click="addVuln"
             class="add-btn flex items-center justify-center p-1 w-20 mb-2 hover_icon hover:bg-[#6C87FF1A] text-primary">
            <i class="murphy icon-jia" /> 添加漏洞
        </div>

        <div class="vuln-list" style="max-height: calc(100vh - 304px);overflow: auto;">
            <div v-for="(item, index) in vulnList" :key="index" class="vuln-item">
                <div class="vuln-type">
                    <el-select class="w-[240px]" v-model="item.type" placeholder="请选择漏洞编号类型">
                        <el-option label="CVE编号" value="CVE" />
                        <el-option label="MPS编号" value="MPS" />
                        <el-option label="CAVD编号" value="CAVD" />
                        <el-option label="CNVD编号" value="CNVD" />
                        <el-option label="VUL编号" value="VUL" />
                    </el-select>
                    <div class="error-text opacity-0" v-if="item.errorMsg">&nbsp;</div>
                </div>
                <div class="vuln-input">
                    <el-input class="w-[512px]" v-model="item.number" :placeholder="`请输入漏洞编号`"
                              @blur="validateVulnItem(index)" />
                    <div class="error-text" v-if="item.errorMsg">{{ item.errorMsg }}</div>
                </div>
                <div v-if="index === 0" class="w-6 opacity-0 ml-2"></div>
                <span v-if="index !== 0" class="button-icon-grey box-border close">
                    <i @click="deleteVuln(index)" class="murphy icon-cuo g-cursor-pointer font-bold" />
                </span>
            </div>
        </div>

        <template #footer>
            <el-button class="minor_btn h-8 w-20" @click="handleClose">取消</el-button>
            <el-button class="w-20" type="primary" @click="handleConfirm" :disabled="isSubmitDisabled">确定</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import {
    ref, watch, computed, defineEmits,
} from 'vue';

/**
 * 漏洞项接口定义
 * @interface VulnItem
 * @property {('CVE'|'MPS')} type - 漏洞编号类型
 * @property {string} number - 漏洞编号
 * @property {string} [errorMsg] - 错误信息
 */
interface VulnItem {
    type: 'CVE' | 'MPS' | 'CAVD' | 'CNVD' | 'VUL';
    number: string;
    errorMsg?: string;
}

// 组件属性定义
const props = defineProps(['showData']);
const emit = defineEmits(['update:modelValue', 'confirm']);

// 漏洞列表数据，默认包含一个空的CVE项
const vulnList = ref<VulnItem[]>([{ type: 'CVE', number: '', errorMsg: '' }]);

// 判断提交按钮是否禁用
const isSubmitDisabled = computed(() => vulnList.value.length === 0 || vulnList.value.every((item) => !item.number.trim()));

/**
 * 监听showData变化，用于初始化漏洞列表数据
 */
watch(() => props.showData, (newVal) => {
    if (newVal?.length) {
        vulnList.value = newVal.map((number: string) => {
            let type = 'CVE';
            if (number.startsWith('MPS')) type = 'MPS';
            else if (number.startsWith('CAVD')) type = 'CAVD';
            else if (number.startsWith('CNVD')) type = 'CNVD';
            else if (number.startsWith('VUL')) type = 'VUL';
            return {
                type,
                number,
                errorMsg: '',
            };
        });
    }
}, { immediate: true });

/**
 * 添加新的漏洞项
 */
const addVuln = () => {
    vulnList.value.push({ type: 'CVE', number: '', errorMsg: '' });
};

/**
 * 删除指定索引的漏洞项
 * @param {number} index - 要删除的漏洞项索引
 */
const deleteVuln = (index: number) => {
    vulnList.value.splice(index, 1);
};

/**
 * 验证单个漏洞项
 * @param {number} index - 要验证的漏洞项索引
 * @returns {boolean} - 验证是否通过
 */
const validateVulnItem = (index: number) => {
    const item = vulnList.value[index];
    item.errorMsg = '';

    // 检查编号是否以合法前缀开头
    const validPrefixes = ['CVE', 'MPS', 'CAVD', 'CNVD', 'VUL'];
    if (!validPrefixes.some((prefix) => item.number.startsWith(prefix))) {
        item.errorMsg = `编号格式不符，必须以${validPrefixes.join('、')}开头`;
        return false;
    }
    // 检查编号类型是否合法
    if (!item.number.includes(item.type)) {
        item.errorMsg = `编号格式不符，必须包含${item.type}前缀`;
        return false;
    }
    return true;
};

/**
 * 验证整个漏洞列表
 * @returns {boolean} - 验证是否通过
 */
const validateVulnList = () => {
    let isValid = true;
    vulnList.value.forEach((_, index) => {
        if (!validateVulnItem(index)) {
            isValid = false;
        }
    });
    return isValid;
};

/**
 * 确认按钮点击处理
 * 验证通过后发送确认事件并关闭对话框
 */
const handleConfirm = () => {
    if (validateVulnList()) {
        emit('confirm', vulnList.value.map((item) => item.number));
        emit('update:modelValue', false);
    }
};

/**
 * 关闭对话框处理
 */
const handleClose = () => {
    emit('update:modelValue', false);
};
</script>

<style scoped lang="less">
.vuln-list {
    .add-vuln {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;

        .title {
            color: #999;
            font-size: 14px;
        }
    }

    .vuln-item {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        width: 100%;

        .vuln-type {
            margin-right: 8px;
        }

        .vuln-input {
            margin-right: 8px;
        }

        .delete-icon {
            cursor: pointer;
            color: #999;
            font-size: 20px;

            &:hover {
                color: #666;
            }
        }
    }

    .error-text {
        color: #F34D3D;
        font-size: 12px;
        margin-top: 2px;
    }
}

.button-icon-grey.close i {
    color: #858585 !important;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}
</style>
