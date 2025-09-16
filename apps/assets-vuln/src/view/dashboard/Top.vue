<template>
    <div class="flex-1">
        <div class="flex items-center font-medium text-base mb-4">
            {{ title }}
            <span class="mx-1.5 font-black text-lg"
                  :class="{ 'text-gray-400': title.includes('重点提升'), 'gradient-text': !title.includes('重点提升') }"
            >TOP5</span>
            <Svg :name="`drivinghouse-${icon}`" width="18px" height="19px"></Svg>
        </div>

        <div v-if="tableData?.length" class="sai-table">
            <div class="table-header rounded-[3px] px-3 flex text-xs font-semibold h-8 leading-8 bg-[#F2F2F2] text-[#333] gap-4">
                <div class="flex-1 text-left">{{ title.includes('团队') ? '团队名称' : '业务系统名称' }}</div>
                <div class="w-[72px] text-right">综合风险指数</div>
                <div class="w-6 text-left">操作</div>
            </div>
            <div class="table-body">
                <div v-for="(item, index) in tableData" :key="item.key" class="flex rounded-[3px] text-[12px] px-3 h-8 leading-8 bg-[#F2F2F280] mt-2 gap-4">
                    <div class="ellipsis flex-1 w-0">
                        <a-tooltip
                            :title="item.organize?.organize_name || item.business_system?.business_system_name"
                            placement="topLeft"
                            :visible="tooltipVisible[index]"
                            :mouseEnterDelay="0.5">
                            <span
                                class="ellipsis block w-full"
                                ref="nameText"
                                @mouseenter="checkOverflow(index, $event)"
                                @mouseleave="tooltipVisible[index] = false">
                                {{ item.organize?.organize_name || item.business_system?.business_system_name }}
                            </span>
                        </a-tooltip>
                    </div>
                    <div class="w-[72px] text-right font-bold">{{ item.data?.cri ? item.data?.cri.toFixed(2) : '-' }}</div>
                    <!-- <div class="w-6 flex justify-end items-center">
                        <div class=" text-primary hover:text-purple-100 cursor-pointer" @click="handleSAIUpgrade(item)">
                            <span>提升</span>
                        </div>
                    </div> -->
                    <div @click="handleSAIUpgrade(item)" class=" w-6 text-left text-primary hover:text-purple-100 cursor-pointer">提升</div>
                </div>
            </div>
        </div>
        <a-empty v-else class="mt-[25%] text-[#2A2B32] " :image="simpleImage" />
        <!-- <a-empty v-else class="mt-[25%]" :image-style="{
            height: '80px',
            marginBottom: '16px'
        }" :image="emptyImg"></a-empty> -->
    </div>
</template>

<script setup>
// import emptyImg from 'assets/img/empty.png';
import {
    defineProps, watch, reactive, h,
} from 'vue';
import { notification, Empty } from 'ant-design-vue';
import { AimOutlined } from '@ant-design/icons-vue';
import { userInfo, globalState } from '@/store';
import { getBusinessSystemParentOrganizeApi } from '@/api/bus';

const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        default: '🥺',
    },
    tableData: {
        type: Array,
        default: () => [],
    },
});

// 为每个表格项创建一个tooltip显示状态
const tooltipVisible = reactive({});

// 检查文本是否溢出
function checkOverflow(index, event) {
    const el = event.target;
    tooltipVisible[index] = el.scrollWidth > el.offsetWidth;
}

watch(
    () => props.tableData,
    (newVal) => {
        // 初始化所有tooltip为不可见
        newVal.forEach((_, index) => {
            tooltipVisible[index] = false;
        });
    },
    { immediate: true },
);

// 根据部门ID查找部门名称
const findOrgNameById = (orgId) => {
    const findOrgInTree = (tree, id) => tree.find((org) => {
        if (org.organize_id === id) return true;
        if (org.organize?.length > 0) {
            const found = findOrgInTree(org.organize, id);
            if (found) return true;
        }
        return false;
    });

    return findOrgInTree(globalState.orgTree, orgId);
};

// 添加卡片高亮动画效果
const addCardHighlightEffect = () => {
    // 设置高亮动画持续时间（秒）
    const highlightDuration = 6;

    // 尝试查找卡片元素
    let saiCard = document.querySelector('.card.flex-1.w-0.border-gradient:not(.relative)');
    let siiCard = document.querySelector('.card.relative.flex-1.w-0.border-gradient');

    if (!saiCard) {
        saiCard = document.querySelector('.card.flex-1.w-0');
    }

    if (!siiCard) {
        siiCard = document.querySelector('.card.relative.flex-1');
    }

    if (!saiCard && !siiCard) {
        const cards = document.querySelectorAll('.card');
        Array.from(cards).forEach((card) => {
            const text = card.textContent || '';
            if (text.includes('安全能力差距指数') || text.includes('SAI')) {
                saiCard = card;
            } else if (text.includes('安全问题指数') || text.includes('SII')) {
                siiCard = card;
            }
        });
    }

    if (!saiCard && !siiCard) return;

    // 动态创建和应用样式
    const createHighlightStyle = () => {
        const styleId = 'highlight-animation-style';
        const existingStyle = document.getElementById(styleId);
        if (existingStyle) {
            existingStyle.remove();
        }

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* 边缘发光动画 */
            @keyframes border-glow {
                0% { box-shadow: 0 0 3px rgba(109, 56, 255, 0.3), inset 0 0 3px rgba(109, 56, 255, 0.3); }
                25% { box-shadow: 0 0 10px rgba(109, 56, 255, 0.6), inset 0 0 5px rgba(109, 56, 255, 0.3); }
                50% { box-shadow: 0 0 15px rgba(109, 56, 255, 0.8), inset 0 0 7px rgba(109, 56, 255, 0.3); }
                75% { box-shadow: 0 0 10px rgba(109, 56, 255, 0.6), inset 0 0 5px rgba(109, 56, 255, 0.3); }
                100% { box-shadow: 0 0 3px rgba(109, 56, 255, 0.3), inset 0 0 3px rgba(109, 56, 255, 0.3); }
            }
            
            @keyframes border-glow-sii {
                0% { box-shadow: 0 0 3px rgba(228, 96, 255, 0.3), inset 0 0 3px rgba(228, 96, 255, 0.3); }
                25% { box-shadow: 0 0 10px rgba(228, 96, 255, 0.6), inset 0 0 5px rgba(228, 96, 255, 0.3); }
                50% { box-shadow: 0 0 15px rgba(228, 96, 255, 0.8), inset 0 0 7px rgba(228, 96, 255, 0.3); }
                75% { box-shadow: 0 0 10px rgba(228, 96, 255, 0.6), inset 0 0 5px rgba(228, 96, 255, 0.3); }
                100% { box-shadow: 0 0 3px rgba(228, 96, 255, 0.3), inset 0 0 3px rgba(228, 96, 255, 0.3); }
            }
            
            /* 边框渐变呼吸动画 */
            @keyframes border-opacity {
                0% { opacity: 0.3; }
                25% { opacity: 0.6; }
                50% { opacity: 0.9; }
                75% { opacity: 0.6; }
                100% { opacity: 0.3; }
            }
            
            /* 微妙的缩放效果 */
            @keyframes very-subtle-scale {
                0% { transform: scale(1); }
                50% { transform: scale(1.003); }
                100% { transform: scale(1); }
            }
            
            /* SAI卡片高亮 */
            .sai-card-highlight {
                position: relative;
                z-index: 10 !important;
                animation: border-glow ${highlightDuration}s ease-in-out, very-subtle-scale ${highlightDuration}s ease-in-out !important;
            }
            
            .sai-card-highlight::before {
                content: '';
                position: absolute;
                inset: 0;
                padding: 1.5px;
                background: linear-gradient(98.08deg, rgba(109, 56, 255, 0.9) 0%, rgba(56, 93, 255, 0.9) 100%);
                -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                -webkit-mask-composite: xor;
                mask-composite: exclude;
                border-radius: 6px;
                pointer-events: none;
                opacity: 0.3;
                animation: border-opacity ${highlightDuration}s ease-in-out;
                z-index: 11 !important;
                filter: blur(0.5px);
            }
            
            .sai-card-highlight::after {
                content: '';
                position: absolute;
                inset: -2px;
                border-radius: 8px;
                background: linear-gradient(135deg, 
                    rgba(109, 56, 255, 0) 0%, 
                    rgba(56, 93, 255, 0.05) 40%, 
                    rgba(109, 56, 255, 0.1) 50%, 
                    rgba(56, 93, 255, 0.05) 60%, 
                    rgba(109, 56, 255, 0) 100%
                );
                filter: blur(3px);
                opacity: 0;
                animation: border-opacity ${highlightDuration}s ease-in-out;
                pointer-events: none;
                z-index: 11 !important;
            }
            
            /* SII卡片高亮 */
            .sii-card-highlight {
                position: relative;
                z-index: 10 !important;
                animation: border-glow-sii ${highlightDuration}s ease-in-out, very-subtle-scale ${highlightDuration}s ease-in-out !important;
            }
            
            .sii-card-highlight::before {
                content: '';
                position: absolute;
                inset: 0;
                padding: 1.5px;
                background: linear-gradient(98.08deg, rgba(228, 96, 255, 0.9) 0%, rgba(185, 56, 255, 0.9) 100%);
                -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                -webkit-mask-composite: xor;
                mask-composite: exclude;
                border-radius: 6px;
                pointer-events: none;
                opacity: 0.3;
                animation: border-opacity ${highlightDuration}s ease-in-out;
                z-index: 11 !important;
                filter: blur(0.5px);
            }
            
            .sii-card-highlight::after {
                content: '';
                position: absolute;
                inset: -2px;
                border-radius: 8px;
                background: linear-gradient(135deg, 
                    rgba(228, 96, 255, 0) 0%, 
                    rgba(185, 56, 255, 0.05) 40%, 
                    rgba(228, 96, 255, 0.1) 50%, 
                    rgba(185, 56, 255, 0.05) 60%, 
                    rgba(228, 96, 255, 0) 100%
                );
                filter: blur(3px);
                opacity: 0;
                animation: border-opacity ${highlightDuration}s ease-in-out;
                pointer-events: none;
                z-index: 11 !important;
            }
        `;
        document.head.appendChild(style);
        return style;
    };

    // 创建样式并添加到页面
    const style = createHighlightStyle();

    // 为卡片添加高亮效果类
    if (saiCard) {
        saiCard.classList.remove('sai-card-highlight');
        window.getComputedStyle(saiCard).getPropertyValue('width');
        saiCard.classList.add('sai-card-highlight');

        setTimeout(() => {
            saiCard.classList.remove('sai-card-highlight');
        }, highlightDuration * 1000);
    }

    if (siiCard) {
        siiCard.classList.remove('sii-card-highlight');
        window.getComputedStyle(siiCard).getPropertyValue('width');
        siiCard.classList.add('sii-card-highlight');

        setTimeout(() => {
            siiCard.classList.remove('sii-card-highlight');

            // 在所有动画结束后移除样式元素
            setTimeout(() => {
                style.remove();
            }, 100);
        }, highlightDuration * 1000);
    }
};

const handleSAIUpgrade = async (item) => {
    // 获取部门和业务系统名称
    let orgName = item.organize?.organize_name || '';
    const sysName = item.business_system?.business_system_name || '所有业务系统';

    // 根据不同情况设置userInfo
    if (props.title.includes('团队')) {
        userInfo.value.org_id = item.organize?.organize_id;
    } else {
        userInfo.value.business_system_id = item.business_system?.business_system_id;

        // 如果是业务系统且没有部门信息，则获取部门信息
        if (item.business_system?.business_system_id && !orgName) {
            try {
                const { data } = await getBusinessSystemParentOrganizeApi(item.business_system.business_system_id);
                if (data.data) {
                    userInfo.value.org_id = String(data.data);
                    const orgInfo = findOrgNameById(data.data);
                    if (orgInfo) {
                        orgName = orgInfo.organize_name;
                    }
                }
            } catch (error) {
                console.error('获取业务系统所属部门失败:', error);
            }
        }
    }

    // 构建描述内容
    const description = h('div', {}, [
        h('div', {
            style: {
                fontSize: '14px', lineHeight: '1.4', marginBottom: '8px', display: 'flex', flexWrap: 'wrap',
            },
        }, [
            h('span', { style: { fontWeight: 500 } }, '已切换至 '),
            h('span', { style: { fontWeight: 600, color: '#6C87FF' } }, orgName),

            (props.title.includes('业务系统') || item.business_system?.business_system_id)
                && sysName !== '所有业务系统'
                ? [
                    h('span', { style: { fontWeight: 400, marginLeft: '4px' } }, ' ('),
                    h('span', { style: { fontWeight: 600, color: '#6C87FF' } }, sysName),
                    h('span', { style: { fontWeight: 400 } }, ')'),
                ] : null,
        ]),

        h('div', {
            style: {
                marginTop: '0px',
                fontSize: '12px',
                color: '#666',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f9f9f9',
                padding: '6px 10px',
                borderRadius: '4px',
                borderLeft: '3px solid #6C87FF',
            },
        }, [
            h('span', {}, '请关注安全能力差距和安全问题指数进行提升'),
        ]),
    ]);

    // 图标
    const icon = h(AimOutlined, {
        style: {
            color: '#6C87FF',
            fontSize: '24px',
        },
    });

    // 平滑滚动到顶部
    const smoothScrollToTop = () => {
        const dashboardContainer = document.querySelector('.dashboard-container');
        if (dashboardContainer) {
            try {
                if (dashboardContainer.scrollTop === 0) {
                    dashboardContainer.scrollTop = 1;
                }
                dashboardContainer.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                });
                return true;
            } catch (dashboardError) {
                console.error('Dashboard容器滚动失败', dashboardError);
            }
        }

        try {
            document.documentElement.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
            return true;
        } catch (htmlError) {
            console.error('HTML滚动失败', htmlError);

            try {
                document.body.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                });
                return true;
            } catch (bodyError) {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                });
            }
        }

        return true;
    };

    // 先滚动，再显示通知
    smoothScrollToTop();

    // 显示通知
    setTimeout(() => {
        notification.open({
            message: '数据范围已切换',
            description,
            placement: 'topRight',
            style: {
                top: '40px',
                width: '420px',
                maxWidth: '80vw',
                backgroundColor: '#fff',
                border: '1px solid #ebedf0',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                borderRadius: '4px',
            },
            duration: 4,
            class: 'custom-notification',
            icon,
            onClose: () => {
                setTimeout(addCardHighlightEffect, 100);
            },
        });
    }, 400);
};

</script>

<style lang="less">
.gradient-text {
    background: linear-gradient(270deg, #6C87FF -57.73%, #B273FF 92.33%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
}

// 自定义通知样式
.custom-notification {
    .ant-notification-notice-message {
        font-weight: 600;
        font-size: 14px;
        color: #262626;
        margin-bottom: 4px;
        position: relative;
    }

    .ant-notification-notice-description {
        font-size: 13px;
        line-height: 1.5;
        color: #595959;
        word-break: break-word;
    }

    .ant-notification-notice-close {
        color: #999;
        top: 12px;

        &:hover {
            color: #666;
        }
    }

    .ant-notification-notice-with-icon .ant-notification-notice-message {
        margin-left: 32px;
        margin-top: 2px;
    }

    .ant-notification-notice-with-icon .ant-notification-notice-description {
        margin-left: 32px;
    }

    .ant-notification-notice {
        padding: 12px 16px;
    }

    .ant-notification-notice-icon {
        margin-left: 0;
        font-size: 22px;
        line-height: 22px;
        margin-top: 2px;
    }
}

// 注意：移除了:global()选择器和在<style>标签中的动画定义
// 现在通过JavaScript动态添加样式

</style>
