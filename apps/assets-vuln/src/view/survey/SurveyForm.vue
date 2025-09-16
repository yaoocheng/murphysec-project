<template>
    <div class="form-landing-container">
        <!-- 左侧固定侧边栏 -->
        <div class="sidebar">
            <div class="sidebar-fixed-content">
                <div class="logo-area text-[#0025CC] text-xl font-semibold">
                    <img src="/logo.svg" alt="">
                    软件资产风险管理平台(SARM)
                </div>

                <!-- <h2 class="sidebar-title">{{ compiledPageTitle }}</h2> -->

                <div class="sidebar-content" v-html="compiledHeaderDescription"></div>

                <!-- 联系信息区域 -->
                <!-- <div v-if="pageConfig.sidebar.contactInfo && pageConfig.sidebar.contactInfo.enabled && pageConfig.sidebar.contactInfo.items && pageConfig.sidebar.contactInfo.items.length > 0" class="contact-info">
                    <h3 v-if="pageConfig.sidebar.contactInfo.title" class="contact-title">{{ pageConfig.sidebar.contactInfo.title }}</h3>
                    <div v-for="(item, index) in pageConfig.sidebar.contactInfo.items" :key="index" class="contact-item">
                        <component :is="getIconComponent(item.icon)" v-if="item.icon" class="contact-icon" />
                        <span v-if="item.label" class="contact-label">{{ item.label }}:</span>
                        <span class="contact-value">{{ compileTemplate(item.value, contextData) }}</span>
                    </div>
                </div> -->
            </div>

            <!-- 表单章节导航 -->
            <div class="form-nav" ref="formNavRef" @scroll="onNavScroll">
                <ul class="nav-list">
                    <li
                        v-for="(section, index) in pageConfig.form.sections"
                        :key="index"
                        :class="{ 'nav-item-active': currentSectionIndex === index }"
                        class="nav-item"
                        @click="scrollToSection(index)"
                        :ref="el => { if (el) navItemRefs[index] = el }"
                    >
                        <div class="nav-item-indicator"></div>
                        <span class="nav-item-number">{{ index + 1 }}.</span>
                        <span class="nav-item-text">{{ section.title.replace(/^\d+\.\s*/, '') }}</span>
                    </li>
                </ul>
            </div>
        </div>

        <!-- 右侧内容区 -->
        <div class="content" ref="contentRef" @scroll="handleScroll">
            <a-form
                class="base-form"
                :model="formState"
                name="softwareForm"
                layout="vertical"
                @finish="onFinish"
            >
                <!-- 动态生成表单内容，基于配置 -->
                <div v-for="(section, sectionIndex) in pageConfig.form.sections" :key="sectionIndex">
                    <!-- 章节标题 -->
                    <div class="section-title" :ref="el => { if (el) sectionRefs[sectionIndex] = el }">
                        <h3>{{ section.title }}</h3>
                        <p v-if="section.description" class="section-description">{{ section.description }}</p>
                    </div>

                    <!-- 章节下的表单项 -->
                    <div class="form-section">
                        <a-row :gutter="24" class="flex flex-col gap-4">
                            <div v-for="(field, fieldIndex) in section.fields.filter(f => f.visible !== false)" :key="`${sectionIndex}-${fieldIndex}`">
                                <a-col :span="field.span || 24">
                                    <a-form-item
                                        :label="field.label"
                                        :name="field.name"
                                        :rules="getFieldRules(field)"
                                    >
                                        <!-- 根据字段类型渲染不同的表单控件 -->
                                        <template v-if="field.type === 'input'">
                                            <a-input
                                                v-model:value="formState[field.name]"
                                                :placeholder="field.placeholder"
                                                :disabled="field.readonly"
                                                :maxLength="field.maxLength"
                                                class="form-control"
                                            >
                                                <template v-if="field.maxLength" #suffix>
                                                    <span class="char-count">{{ (formState[field.name] || '').length }}/{{ field.maxLength }}</span>
                                                </template>
                                            </a-input>
                                        </template>

                                        <template v-else-if="field.type === 'textarea'">
                                            <div class="textarea-wrapper">
                                                <a-textarea
                                                    v-model:value="formState[field.name]"
                                                    :placeholder="field.placeholder"
                                                    :rows="field.rows || 4"
                                                    :maxLength="field.maxLength"
                                                    :disabled="field.readonly"
                                                    class="form-control"
                                                />
                                                <div v-if="field.maxLength" class="textarea-char-count">
                                                    {{ (formState[field.name] || '').length }}/{{ field.maxLength }}
                                                </div>
                                            </div>
                                        </template>

                                        <template v-else-if="field.type === 'select'">

                                            <!-- 负责人选择组件 -->
                                            <template v-if="field.name === 'owner' || field.name === 'operations_owner'">
                                                <UserSelect
                                                    show-search
                                                    class="user-select survey-form-control"
                                                    :popupClassName="'user-select-dropdown'"
                                                    v-model:value="formState[field.name]"
                                                    :placeholder="field.placeholder"
                                                    :userid="formState[field.name]&&formState[field.name]!=='0'?formState[field.name]:undefined"
                                                />
                                            </template>

                                            <!-- 部门选择组件 -->
                                            <template v-else-if="field.name === 'owner_team' || field.name === 'operations_owner_team'">
                                                <OrgTreeSelect
                                                    class="base-tree-select survey-form-control form-control"
                                                    show-search
                                                    v-model:value="formState[field.name]"
                                                    :placeholder="field.placeholder"
                                                    :organizeId="formState[field.name]&&formState[field.name]!=='0'?formState[field.name]:undefined"
                                                    allowClear
                                                />
                                            </template>

                                            <a-select v-else
                                                      v-model:value="formState[field.name]"
                                                      :placeholder="field.placeholder"
                                                      :options="field.name==='application_id'?applicationOptions: field.options"
                                                      :mode="field.multiple ? 'multiple' : undefined"
                                                      :disabled="field.readonly"
                                                      allowClear
                                                      :getPopupContainer="triggerNode => triggerNode.parentNode"
                                                      :onPopupScroll="field.name==='application_id'?handleApplicationScroll:undefined"
                                                      class="form-control"
                                            >
                                                <template #suffixIcon>
                                                    <down-outlined />
                                                </template>
                                            </a-select>
                                        </template>

                                        <template v-else-if="field.type === 'datePicker'">
                                            <a-date-picker
                                                v-model:value="formState[field.name]"
                                                class="form-control"
                                                style="width: 100%"
                                                :placeholder="field.placeholder"
                                                :format="field.format || 'YYYY-MM-DD'"
                                                :picker="field.pickerType || 'date'"
                                                :disabled="field.readonly"
                                            />
                                        </template>

                                        <template v-else-if="field.type === 'timePicker'">
                                            <a-time-picker
                                                v-model:value="formState[field.name]"
                                                class="form-control"
                                                style="width: 100%"
                                                :placeholder="field.placeholder"
                                                :format="field.format || 'HH:mm:ss'"
                                                :disabled="field.readonly"
                                            />
                                        </template>

                                        <template v-else-if="field.type === 'radio'">
                                            <a-radio-group
                                                v-model:value="formState[field.name]"
                                                class="custom-radio-group"
                                                :disabled="field.readonly"
                                            >
                                                <div v-for="option in field.options" :key="option.value" class="custom-radio-item">
                                                    <a-radio :value="option.value">{{ option.label }}</a-radio>
                                                </div>
                                            </a-radio-group>
                                        </template>

                                        <template v-else-if="field.type === 'checkbox'">
                                            <a-checkbox-group
                                                v-model:value="formState[field.name]"
                                                class="custom-checkbox-group"
                                                :disabled="field.readonly"
                                            >
                                                <div v-for="option in field.options" :key="option.value" class="custom-checkbox-item">
                                                    <a-checkbox :value="option.value">{{ option.label }}</a-checkbox>
                                                </div>
                                            </a-checkbox-group>
                                        </template>

                                        <template v-else-if="field.type === 'switch'">
                                            <div class="custom-switch-wrapper">
                                                <a-switch
                                                    v-model:checked="formState[field.name]"
                                                    :disabled="field.readonly"
                                                    size="small"
                                                />
                                                <span class="switch-label">{{ formState[field.name] ? '是' : '否' }}</span>
                                            </div>
                                        </template>

                                        <template v-else-if="field.type === 'inputNumber'">
                                            <a-input-number
                                                v-model:value="formState[field.name]"
                                                :placeholder="field.placeholder"
                                                :min="field.min"
                                                :max="field.max"
                                                :step="field.step || 1"
                                                :disabled="field.readonly"
                                                class="form-control"
                                                style="width: 100%"
                                            />
                                        </template>

                                        <template v-else-if="field.type === 'ipInput'">
                                            <a-input
                                                v-model:value="formState[field.name]"
                                                :placeholder="field.placeholder"
                                                :disabled="field.readonly"
                                                :maxLength="field.maxLength"
                                                class="form-control"
                                            />
                                        </template>

                                        <!-- 帮助文本 -->
                                        <template #extra v-if="field.helpText">
                                            <div class="help-text">{{ field.helpText }}</div>
                                        </template>
                                    </a-form-item>
                                </a-col>
                            </div>
                        </a-row>
                    </div>
                </div>

                <!-- 提交按钮 -->
                <div class="submit-area">
                    <a-button
                        type="primary"
                        html-type="submit"
                        :loading="submitting"
                        class="submit-button base-button"
                        size="large"
                        block
                    >
                        {{ submitting ? pageConfig.submitButton.loadingText : pageConfig.submitButton.text }}
                    </a-button>
                    <p v-if="pageConfig.footerNote" class="submit-disclaimer">{{ pageConfig.footerNote }}</p>
                </div>
            </a-form>
        </div>
    </div>
</template>

<script setup>
import {
    ref, reactive, computed, onMounted, h, watch, onUnmounted,
} from 'vue';
import {
    DownOutlined,
} from '@ant-design/icons-vue';
import { useRoute } from 'vue-router';
import { pageConfig, contextExample } from './formConfig';
import { getComponentDetailApi, getAllApplicationsApi, saveComponentInfoApi } from '@/api/software';
import UserSelect from '@/components/UserSelect.vue';
import OrgTreeSelect from '@/components/OrgTreeSelect.vue';
// import { pageConfig, contextExample } from '../config/configTest';

// 上下文数据（通常从URL或API获取）
const contextData = reactive({
    ...contextExample, // 直接使用配置文件中的示例上下文数据
    prefilledData: {}, // 确保存在这个属性以避免引用错误
});

const applicationOptions = ref([]);
const componentDetail = ref(null);

// 应用列表分页状态
const applicationPagination = reactive({
    page: 1,
    limit: 20,
    total: 0,
    hasMore: true,
    loading: false,
});

const route = useRoute();
const component_id = route.params.id;
console.log(component_id);
// 模板字符串解析函数，支持嵌套的 ${变量} 替换
function compileTemplate(template, data) {
    if (!template) return '';

    return template.replace(/\${(\w+)}/g, (match, key) => (data[key] !== undefined ? data[key] : match));
}

// 编译模板字符串，用于侧边栏描述
const compiledHeaderDescription = computed(() => compileTemplate(pageConfig.sidebar.description, contextData));

// 根据字段类型获取提示文本
function getFieldTypeText(type) {
    const typeTextMap = {
        input: '输入',
        textarea: '输入',
        select: '选择',
        radio: '选择',
        checkbox: '选择',
        datePicker: '选择',
        timePicker: '选择',
        inputNumber: '输入',
        switch: '选择',
        ipInput: '输入',
    };

    return typeTextMap[type] || '输入';
}

// 获取字段的验证规则
function getFieldRules(field) {
    const rules = [];

    if (field.required) {
        rules.push({
            required: true,
            message: `请${getFieldTypeText(field.type)}${field.label}`,
        });
    }

    return rules;
}

// 表单提交状态
const submitting = ref(false);

// 获取应用列表（支持分页）
const fetchApplications = async (reset = false) => {
    if (applicationPagination.loading || (!reset && !applicationPagination.hasMore)) {
        return;
    }

    try {
        applicationPagination.loading = true;

        if (reset) {
            applicationPagination.page = 1;
            applicationPagination.hasMore = true;
        }

        const response = await getAllApplicationsApi(component_id, {
            page: applicationPagination.page,
            limit: applicationPagination.limit,
        });

        // 安全检查并处理数据
        const appList = response.data?.data?.list || response.data?.list || response.data || [];
        const total = response.data?.data?.total || response.data?.total || 0;

        if (Array.isArray(appList)) {
            const newOptions = appList.map((app) => ({
                label: app.application_name || app.name || app.label,
                value: app.application_id || app.id || app.value,
            }));

            if (reset) {
                applicationOptions.value = newOptions;
            } else {
                applicationOptions.value = [...applicationOptions.value, ...newOptions];
            }

            // 更新分页状态
            applicationPagination.total = total;
            applicationPagination.hasMore = applicationOptions.value.length < total;
            applicationPagination.page += 1;
        } else {
            if (reset) {
                applicationOptions.value = [];
            }
            console.warn('应用列表为空或格式不正确');
        }
    } catch (error) {
        console.error('获取应用列表失败:', error);
        if (reset) {
            applicationOptions.value = [];
        }
    } finally {
        applicationPagination.loading = false;
    }
};

// 处理应用选择器滚动事件
const handleApplicationScroll = (e) => {
    const { target } = e;
    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
        // 滚动到底部，加载更多数据
        fetchApplications(false);
    }
};

// 初始化表单数据，综合默认值和预填数据
function initFormState() {
    const initialState = {};

    // 遍历所有表单字段，设置初始值
    pageConfig.form.sections.forEach((section) => {
        section.fields.forEach((field) => {
            // 首先检查是否有预填数据
            if (contextExample.prefilledData && contextExample.prefilledData[field.name] !== undefined) {
                initialState[field.name] = contextExample.prefilledData[field.name];
            } else if (field.defaultValue !== undefined) {
                // 否则使用字段配置中的默认值
                initialState[field.name] = field.defaultValue;
            } else {
                // 对于没有默认值的字段，根据类型设置合适的空值
                const emptyValueMap = {
                    select: field.multiple ? [] : undefined,
                    checkbox: [],
                    switch: false,
                    inputNumber: null,
                    datePicker: null,
                    timePicker: null,
                };

                initialState[field.name] = emptyValueMap[field.type] !== undefined
                    ? emptyValueMap[field.type]
                    : '';
            }
        });
    });

    return initialState;
}

// 表单数据 - 使用预填数据初始化
const formState = reactive(initFormState());

// 将组件详情数据填充到表单中
const fillFormWithComponentData = (data) => {
    if (!data) return;

    // 填充基本信息
    formState.component_name = data.component_name || undefined;
    formState.component_version = data.component_version || undefined;
    formState.supplier_name = data.supplier_name || undefined;
    formState.component_desc = data.component_desc || undefined;
    formState.application_id = data.application?.map((item) => item.application_id) || undefined;

    const curInfo = data.application?.map((item) => ({
        label: item.application_name,
        value: item.application_id,
    })) || [];

    // 只添加不存在的应用选项，避免重复
    const newOptions = curInfo.filter((newItem) => !applicationOptions.value.some((existingItem) => existingItem.value === newItem.value));
    applicationOptions.value.unshift(...newOptions);

    // applicationOptions.value.push(...data.application?.map((item) => ({
    //     label: item.application_name,
    //     value: item.application_id,
    // })) || []);

    // 填充闭源软件相关信息
    if (data.component_closed_source_software) {
        const closedSourceData = data.component_closed_source_software;

        // 采购与供应商信息
        formState.procurement_type = closedSourceData.procurement_type || undefined;
        formState.supplier_country = closedSourceData.supplier_country || undefined;
        formState.supplier_identifier = closedSourceData.supplier_identifier || undefined;
        formState.contract_reference_id = closedSourceData.contract_reference_id || undefined;
        formState.owner_team = closedSourceData.owner_team && closedSourceData.owner_team !== '0' ? closedSourceData.owner_team : undefined;
        formState.owner = closedSourceData.owner && closedSourceData.owner !== '0' ? closedSourceData.owner : undefined;

        // 运维信息
        formState.operations_owner_team = closedSourceData.operations_owner_team && closedSourceData.operations_owner_team !== '0' ? closedSourceData.operations_owner_team : undefined;
        formState.operations_owner = closedSourceData.operations_owner && closedSourceData.operations_owner !== '0' ? closedSourceData.operations_owner : undefined;

        // 部署环境信息
        formState.deployment_model = closedSourceData.deployment_model || undefined;
        formState.installation_path = closedSourceData.installation_path || undefined;
        // 处理IP地址数组
        if (closedSourceData.deployed_ip_addresses && Array.isArray(closedSourceData.deployed_ip_addresses)) {
            formState.deployed_ip_addresses = closedSourceData.deployed_ip_addresses.filter((ip) => ip).join(',');
        }

        // 网络与数据安全
        formState.network_exposure = closedSourceData.network_exposure || undefined;
        formState.access_url = closedSourceData.access_url || undefined;
        formState.data_sensitivity_level = closedSourceData.data_sensitivity_level || undefined;
    }
};

// 获取成分详情
const fetchComponentDetail = async () => {
    try {
        if (component_id) {
            const response = await getComponentDetailApi(component_id);
            componentDetail.value = response.data.data;
            // 将获取到的数据填充到表单中
            fillFormWithComponentData(componentDetail.value);
            console.log('成分详情:', componentDetail.value);
        }
    } catch (error) {
        console.error('获取成分详情失败:', error);
    }
};

// 表单提交处理
const onFinish = async (values) => {
    console.log('表单提交的值:', values);
    submitting.value = true;

    try {
        // 构建提交数据结构
        const submitData = { ...values };

        // 定义属于component_closed_source_software的字段
        const closedSourceFields = [
            'procurement_type', 'supplier_country', 'supplier_identifier', 'contract_reference_id',
            'owner_team', 'owner', 'operations_owner_team', 'operations_owner',
            'deployment_model', 'installation_path', 'deployed_ip_addresses',
            'network_exposure', 'access_url', 'data_sensitivity_level',
        ];

        // 构建component_closed_source_software嵌套结构
        const closedSourceData = {};
        closedSourceFields.forEach((field) => {
            if (submitData[field] !== undefined) {
                closedSourceData[field] = submitData[field];
                delete submitData[field]; // 从外层删除
            }
        });

        // 处理deployed_ip_addresses字段，将字符串转换为数组
        if (closedSourceData.deployed_ip_addresses && typeof closedSourceData.deployed_ip_addresses === 'string') {
            closedSourceData.deployed_ip_addresses = closedSourceData.deployed_ip_addresses
                .split(',')
                .map((ip) => ip.trim())
                .filter((ip) => ip);
        } else {
            closedSourceData.deployed_ip_addresses = [];
        }

        // 如果有闭源软件相关数据，则添加到提交数据中
        if (Object.keys(closedSourceData).length > 0) {
            submitData.component_closed_source_software = closedSourceData;
        }

        // 调用保存成分信息API
        await saveComponentInfoApi({
            shareId: component_id,
            data: submitData,
        });

        // 显示成功信息
        submitting.value = false;

        // 使用Ant Design Vue的模态框
        import('ant-design-vue').then(({ Modal }) => {
            Modal.success({
                title: '提交成功',
                content: h('div', {
                    style: 'text-align: center;',
                }, [
                    h('div', {
                        style: 'font-size: 20px; margin-bottom: 16px;',
                    }, '提交成功！'),
                    h('p', {}, [
                        '感谢您完成软件信息的提交。',
                    ]),
                    h('p', {}, '我们的工作人员将尽快审核您提交的信息。'),
                ]),
                centered: true,
                okText: '关闭窗口',
            });
        });
    } catch (error) {
        console.error('提交失败:', error);
        submitting.value = false;
        // 显示错误信息
        import('ant-design-vue').then(({ Modal }) => {
            Modal.error({
                title: '提交失败',
                content: '提交过程中发生错误，请稍后重试。',
                centered: true,
                okText: '确定',
            });
        });
    }
};

// 导航相关逻辑
const contentRef = ref(null);
const formNavRef = ref(null);
const sectionRefs = ref([]);
const navItemRefs = ref({});
const currentSectionIndex = ref(0);
const lastScrollTop = ref(0); // 记录上次滚动位置以确定滚动方向

// 监听滚动事件
const handleScroll = () => {
    if (!contentRef.value || sectionRefs.value.length === 0) return;

    const { scrollTop } = contentRef.value;
    const contentHeight = contentRef.value.clientHeight;
    const scrollBottom = scrollTop + contentHeight;

    // 判断滚动方向
    const isScrollingDown = scrollTop > lastScrollTop.value;
    lastScrollTop.value = scrollTop;

    // 获取所有章节位置信息
    const sections = [];
    sectionRefs.value.forEach((section, index) => {
        if (section) {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const bottom = top + height;
            sections.push({ index, top, bottom });
        }
    });

    if (sections.length === 0) return;

    // 查找当前应该激活的章节
    let activeIndex = currentSectionIndex.value; // 默认保持当前章节

    if (isScrollingDown) {
        // === 向下滚动逻辑 ===
        // 查找视口中可见的章节标题
        const visibleSections = sections.filter((section) => section.top >= scrollTop && section.top < scrollBottom);

        if (visibleSections.length > 0) {
            // 向下滚动时选择可见章节中最靠后的章节
            activeIndex = visibleSections.reduce(
                (latest, current) => (current.index > latest.index ? current : latest),
                visibleSections[0],
            ).index;
        } else {
            // 无可见章节标题时，选择最接近视口顶部的已通过章节
            const passedSections = sections.filter((section) => section.top <= scrollTop);
            if (passedSections.length > 0) {
                activeIndex = passedSections.reduce(
                    (latest, current) => (current.index > latest.index ? current : latest),
                    passedSections[0],
                ).index;
            }
        }
    } else {
        // === 向上滚动逻辑 ===（按照用户新要求实现）

        // 获取视口中所有可见的章节标题
        const visibleTitles = sections.filter((section) => section.top >= scrollTop && section.top < scrollBottom);

        if (visibleTitles.length > 0) {
            // 条件2: 如果上方出现新章节标题，导航栏应显示这个新章节
            // 找到最靠近视口顶部的可见章节标题
            const topMostTitle = visibleTitles.reduce(
                (top, current) => (current.top < top.top ? current : top),
                visibleTitles[0],
            );

            // 条件1: 如果当前只有一个章节标题且位于视口下方30%区域，导航栏应显示前一章节
            // 计算视口下方30%的起始位置
            const lowerThresholdStart = scrollBottom - (contentHeight * 0.3);

            // 如果最上面的章节标题在视口上方70%区域
            if (topMostTitle.top < lowerThresholdStart) {
                activeIndex = topMostTitle.index;
            } else if (visibleTitles.length === 1 && topMostTitle.top >= lowerThresholdStart) {
                // 如果只有一个章节标题且它位于视口下方30%区域
                const prevIndex = topMostTitle.index - 1;
                // 确保前一章节存在
                if (prevIndex >= 0) {
                    activeIndex = prevIndex;
                } else {
                    activeIndex = topMostTitle.index;
                }
            } else {
                // 如果有多个章节标题同时可见
                activeIndex = topMostTitle.index;
            }
        }
    // 条件3: 如果视口中没有任何章节标题，保持当前导航不变
    // 此时不需要修改activeIndex，因为默认就是保持当前值
    }

    // 更新当前章节索引（只有在需要变化时才更新）
    if (activeIndex !== currentSectionIndex.value) {
        currentSectionIndex.value = activeIndex;
    }
};

// 点击导航项平滑滚动到对应章节
const scrollToSection = (index) => {
    if (!contentRef.value || !sectionRefs.value[index]) return;

    const targetPosition = sectionRefs.value[index].offsetTop;

    // 使用smooth选项实现平滑滚动
    contentRef.value.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
    });
};

// 监听当前章节变化，自动滚动导航
watch(currentSectionIndex, (newIndex) => {
    // 确保导航项引用和导航容器引用存在
    if (!navItemRefs.value[newIndex] || !formNavRef.value) return;

    // 使用 scrollIntoView 让当前项滚动到可见区域
    // 行为设置为 'smooth' 实现平滑滚动，block:'nearest' 表示尽可能少地滚动
    setTimeout(() => {
        navItemRefs.value[newIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
        });
    }, 100); // 短暂延迟确保 DOM 已更新
});

// 检查最后一个导航项是否在可视区域内
const isLastNavItemVisible = () => {
    if (!formNavRef.value || !pageConfig.form.sections.length) return true;

    // 获取最后一个章节索引
    const lastIndex = pageConfig.form.sections.length - 1;
    const lastNavItem = navItemRefs.value[lastIndex];

    if (!lastNavItem) return true; // 如果找不到最后一个项，默认为可见

    const navContainer = formNavRef.value;
    const containerRect = navContainer.getBoundingClientRect();
    const itemRect = lastNavItem.getBoundingClientRect();

    // 添加5px的容差值，只要最后一个导航项的顶部出现在容器中就视为可见
    return (itemRect.top <= containerRect.bottom - 5);
};

// 检查导航区域是否有溢出内容且最后一个章节未显示
const checkNavOverflow = () => {
    if (!formNavRef.value) return;

    const navEl = formNavRef.value;
    const hasOverflow = navEl.scrollHeight > navEl.clientHeight;

    // 检查最后一个导航项是否在可视区域
    const lastItemVisible = isLastNavItemVisible();

    // 只有当有溢出内容且最后一个导航项不可见时，才显示指示器
    if (hasOverflow && !lastItemVisible) {
        navEl.classList.add('has-overflow');
    } else {
        navEl.classList.remove('has-overflow');
    }
};

// 导航区域滚动事件处理
const onNavScroll = () => {
    checkNavOverflow();
};

// 组件挂载后执行
onMounted(async () => {
    // 初始化章节引用数组
    sectionRefs.value = Array(pageConfig.form.sections.length).fill(null);
    // 初始化导航项引用对象
    navItemRefs.value = {};

    // 添加窗口大小变化监听
    window.addEventListener('resize', checkNavOverflow);

    // 获取数据
    await fetchApplications(true);
    await fetchComponentDetail();

    // 初始滚动检测
    setTimeout(() => {
        handleScroll();
        checkNavOverflow();
    }, 200);
});

// 组件卸载时清理事件监听器
onUnmounted(() => {
    window.removeEventListener('resize', checkNavOverflow);
});
</script>

<style>
.survey-form-control .ant-select-selection-item {
    height: 32px;
}
</style>

<style scoped>
/* 重置基础样式，确保独立页面的样式一致性 */
:deep(*) {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 整体容器 */
.form-landing-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: #ffffff;
  font-family: 'Inter', 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  color: #1f2937;
  font-size: 16px;
}

/* 左侧上下文信息区 */
.sidebar {
  position: fixed;
  width: 30%;
  height: 100vh;
  background: linear-gradient(135deg, #f0f4ff 0%, #ebf1ff 35%, #e6eaff 70%, #e2e6fc 100%);
  padding: 2.5rem;
  overflow: hidden; /* 防止整体滚动 */
  box-shadow: inset -1px 0 0 rgba(59, 130, 246, 0.08);
  display: flex;
  flex-direction: column;
}

.sidebar-fixed-content {
  overflow-y: auto;
  flex-shrink: 0;
  padding-right: 0.5rem;
  margin-bottom: 1rem;
}

/* Logo区域 */
.logo-area {
    display: flex;
    align-items: center;
    gap: 8px;
  margin-bottom: 2.5rem;
}

.logo-text {
  font-family: 'Pacifico', 'PingFang SC', cursive;
  font-size: 1.8rem;
  color: #3B82F6;
}

/* 侧边栏标题 */
.sidebar-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1.8rem;
  color: #1f2937;
  line-height: 1.3;
}

/* 侧边栏内容 */
.sidebar-content {
  font-size: 1rem;
  color: #4b5563;
  line-height: 1.6;
  max-height: 25vh;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.sidebar-content::-webkit-scrollbar {
  width: 3px;
}

.sidebar-content::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-content::-webkit-scrollbar-thumb {
  background-color: rgba(59, 130, 246, 0.2);
  border-radius: 3px;
}

.sidebar-content p {
  margin-bottom: 1.2rem;
}

/* 联系人区域 */
.contact-info {
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.contact-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.2rem;
  color: #374151;
}

.contact-item {
  margin-bottom: 0.9rem;
  display: flex;
  align-items: center;
  font-size: 1rem;
}

.contact-icon {
  margin-right: 0.8rem;
  color: #0025cc;
  font-size: 1.125rem;
}

.contact-label {
  font-weight: 500;
  margin-right: 0.4rem;
  color: #4b5563;
}

.contact-value {
  color: #1f2937;
}

/* 表单章节导航样式 */
.form-nav {
  margin-top: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(59, 130, 246, 0.1);
  overflow-y: auto;
  flex-grow: 1;
  min-height: 150px; /* 确保至少能显示三条导航项 */
  position: relative;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  padding-bottom: 10px; /* 为指示器留出空间 */
}

/* 隐藏导航区域滚动条 */
.form-nav::-webkit-scrollbar {
  display: none;
}

/* 添加小箭头指示器 */
.form-nav::after {
  content: '▼';
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.6rem;
  color: rgba(59, 130, 246, 0.5);
  pointer-events: none; /* 确保不干扰点击事件 */
  opacity: 0;
  transition: opacity 0.3s ease, transform 0.3s ease;
  line-height: 1;
  text-shadow: 0 0 3px rgba(255, 255, 255, 0.5);
}

/* 仅当有溢出内容时显示指示器 */
.form-nav.has-overflow::after {
  opacity: 1;
  animation: subtle-bounce 2s ease-in-out infinite;
}

/* 微弱的跳动动画 */
@keyframes subtle-bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(2px); }
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.3rem;
  margin-bottom: 0.4rem;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  opacity: 0.65;
}

.nav-item:hover {
  opacity: 0.9;
}

.nav-item-number {
  font-weight: 400;
  color: #9CA3AF;
  margin-right: 0.4rem;
  font-size: 0.8rem;
  transition: all 0.3s ease;
}

.nav-item-text {
  color: #9CA3AF;
  font-size: 0.8rem;
  transition: all 0.3s ease;
}

.nav-item-indicator {
  width: 2px;
  height: 0;
  background-color: #3B82F6;
  position: absolute;
  left: -8px;
  border-radius: 2px;
  transition: height 0.3s ease;
}

.nav-item-active {
  opacity: 1;
}

.nav-item-active .nav-item-indicator {
  height: 65%;
}

.nav-item-active .nav-item-number,
.nav-item-active .nav-item-text {
  color: #0025cc;
  font-weight: 500;
  font-size: 0.95rem;
}

/* 右侧内容区 */
.content {
  margin-left: 30%;
  width: 70%;
  padding: 3.5rem;
  min-height: 100vh;
  max-height: 100vh;
  overflow-y: auto;
  scroll-behavior: smooth;
}

/* 表单部分样式 */
.section-title {
  margin-bottom: 2rem;
}

.section-title h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  position: relative;
  padding-bottom: 0.75rem;
}

.section-title h3:after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  width: 80px;
  background-color: #3B82F6;
}

.section-description {
  margin-top: 0.8rem;
  color: #6B7280;
  font-size: 1rem;
}

.form-section {
  margin-bottom: 3rem;
}

:deep(.ant-form-item) {
  margin-bottom: 1.8rem;
}

:deep(.ant-form-item-label) {
  padding-bottom: 0.6rem;
}

:deep(.ant-form-item-label > label) {
  font-size: 1rem;
  font-weight: 500;
  color: #374151;
  height: auto;
  line-height: 1.5;
}

.form-control {
  transition: all 0.25s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* 统一表单控件高度和样式 */
:deep(.ant-input),
:deep(.ant-select-selector),
:deep(.ant-picker) {
  padding: 0.75rem 1rem !important;
  border-color: #e5e7eb !important;
  border-radius: 0.5rem !important;
  min-height: 3.25rem !important;
  font-size: 1rem !important;
}

/* 仅添加圆角样式，不改变其他属性 */
:deep(.ant-input-affix-wrapper) {
  border-radius: 0.5rem !important;
  border-color: #e5e7eb !important;
}

:deep(.ant-select-selector) {
  /* height: auto !important; */
  display: flex;
  align-items: center;
}

:deep(.ant-select-selection-search) {
  display: flex;
  align-items: center;
}

:deep(.ant-select-selection-placeholder){
  line-height: 1.5 !important;
  font-size: 1rem !important;
}

/* 确保文本域也有相同的圆角 */
:deep(.ant-input-textarea) .ant-input {
  border-radius: 0.5rem !important;
}

:deep(.ant-input-number) {
  width: 100% !important;
  border-radius: 0.5rem !important;
}

:deep(.ant-input-number-input) {
  height: 3.25rem !important;
  padding: 0 1rem !important;
  font-size: 1rem !important;
}

:deep(.ant-input-number) {
  width: 100% !important;
  border-radius: 0.5rem !important;
}

:deep(.ant-input-number-input) {
  height: 3.25rem !important;
  padding: 0 1rem !important;
  font-size: 1rem !important;
}

:deep(.ant-picker-input > input) {
  font-size: 1rem !important;
}

:deep(.ant-input:hover),
:deep(.ant-input-affix-wrapper:hover),
:deep(.ant-select-selector:hover),
:deep(.ant-picker:hover) {
  border-color: #3B82F6 !important;
}

:deep(.ant-input:focus),
:deep(.ant-input-affix-wrapper-focused),
:deep(.ant-select-selector:focus),
:deep(.ant-picker-focused) {
  border-color: #3B82F6 !important;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15) !important;
}

/* 文本区域高度 */
:deep(.ant-input[type="textarea"]) {
  min-height: 6.5rem !important;
  line-height: 1.6 !important;
}

/* 自定义单选框和复选框 */
.custom-radio-group,
.custom-checkbox-group {
  display: flex;
  flex-direction: column;
}

.custom-radio-item,
.custom-checkbox-item {
  margin-bottom: 0.75rem;
}

:deep(.ant-radio-wrapper),
:deep(.ant-checkbox-wrapper) {
  margin-right: 0;
  margin-bottom: 0.6rem;
  font-size: 1rem;
  line-height: 1.5;
}

:deep(.ant-radio-inner),
:deep(.ant-checkbox-inner) {
  width: 1.25rem !important;
  height: 1.25rem !important;
}

:deep(.ant-radio-checked .ant-radio-inner),
:deep(.ant-checkbox-checked .ant-checkbox-inner) {
  background-color: #3B82F6;
  border-color: #3B82F6;
}

/* 开关 */
.custom-switch-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
}

:deep(.ant-switch) {
  min-width: 3rem !important;
  height: 1.5rem !important;
}

:deep(.ant-switch-handle) {
  width: 1.125rem !important;
  height: 1.125rem !important;
  top: 0.1875rem !important;
}

.switch-label {
  font-size: 1rem;
  color: #4b5563;
}

/* 帮助文本 */
.help-text {
  font-size: 0.75rem;
  color: #6B7280;
  margin-top: 0.4rem;
  line-height: 1.3;
}

/* 提交区域 */
.submit-area {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.submit-button {
  height: 3.5rem !important;
  font-size: 1.125rem !important;
  font-weight: 500;
  border-radius: 0.5rem;
  background: linear-gradient(to right, #3B82F6, #60a5fa);
  border: none;
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.25);
  transition: all 0.25s ease;
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 10px rgba(59, 130, 246, 0.3);
}

.submit-disclaimer {
  text-align: center;
  font-size: 0.9375rem;
  color: #6B7280;
  margin-top: 1.25rem;
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .form-landing-container {
    flex-direction: column;
  }

  .sidebar {
    position: relative;
    width: 100%;
    height: auto;
    padding: 2rem;
  }

  .content {
    margin-left: 0;
    width: 100%;
    padding: 2rem;
  }
}

/* 字符计数器样式 */
.char-count {
  font-size: 0.75rem;
  color: #9CA3AF;
  white-space: nowrap;
}

:deep(.ant-input-suffix) {
  margin-left: 8px;
  margin-right: 8px;
}

.textarea-wrapper {
  position: relative;
  width: 100%;
}

.textarea-char-count {
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 0.75rem;
  color: #9CA3AF;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 0 2px;
}

/* 下拉菜单样式调整 */
:deep(.ant-select-dropdown) {
  padding: 4px 0;
}

:deep(.ant-select-item) {
  padding: 5px 12px !important;
}

:deep(.ant-select-item-option-content) {
  padding-left: 8px;
}

/* 仅添加圆角样式，不改变其他属性 */
:deep(.ant-input-affix-wrapper) {
  border-radius: 0.5rem !important;
  border-color: #e5e7eb !important;
}

</style>
