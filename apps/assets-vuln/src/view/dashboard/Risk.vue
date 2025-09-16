<template>
    <div class="w-full bg-[#fff] h-fit rounded-md p-6 box-border text-3c flex gap-12">
        <div class="w-[45%] card h-full">
            <div class=" flex items-center justify-between font-medium text-lg mb-1">
                <div class="flex items-center">
                    <Svg class="mr-1.5" color="#6C87FF" name="index" width="18px" height="18px"></Svg>
                    <span class="text-[18px] font-medium">综合风险指数（CRI）</span>
                </div>

                <a-popover :overlayClassName="'cri-popup'" trigger="hover" :arrow="false" placement="bottomRight"
                           color="linear-gradient(180deg, #E5EAFF 0%, #fff 30%)" :mouseEnterDelay="0.3" :mouseLeaveDelay="0.3">
                    <template #content>
                        <div class="p-3 w-[340px]">
                            <div class="mb-3">
                                <div class="flex items-center font-medium">
                                    <Svg class="mr-2" color="#6C87FF" name="index" width="16px" height="16px"></Svg>
                                    <span class="text-sm text-[#333]">综合风险指数（CRI）</span>
                                </div>
                                <div class="text-xs text-[#999] ml-6">Comprehensive Risk Index</div>
                            </div>
                            <div class="text-[13px] leading-6 mb-3 text-[#333]">衡量企业软件安全风险的核心指标，CRI 越低越好</div>
                            <div
                                class="text-[#001C99] text-center py-2 bg-[rgba(229,234,255,0.5)] rounded-sm text-xs font-medium">
                                CRI = SII (安全问题指数) × SAI (安全能力差距指数)
                            </div>
                        </div>
                    </template>
                    <div class="cursor-pointer explain_wrap rounded-3 w-6 h-6">
                        <img src="@/assets/svg/explain.svg" alt="" class="info-icon">
                    </div>
                    <!-- <img src="@/assets/svg/explain.svg" alt="" class="cursor-pointer info-icon"> -->
                </a-popover>
            </div>
            <div class="text-xs text-99 mb-2 text-[12px]">
                反映企业软件安全的总体风险水平，数值越高表示风险越大（CRI = SAI * SII）
            </div>

            <div class="text-[48px] leading-[150%] mb-1 big-number">
                {{ data.root?.cri ? data.root?.cri.toFixed(2) : '--' }}
            </div>
            <div class="mb-10 flex">
                <a-tag :class="{
                    'dashboard-tag-up': data?.month_rate?.avg_cri && data?.month_rate?.avg_cri > 0,
                    'dashboard-tag-flat': !data?.month_rate?.avg_cri ,
                    'dashboard-tag': true
                }">
                    <span class="name text-[13px]">月环比</span>
                    <span class="num">
                        <Svg v-if="data?.month_rate?.avg_cri && data?.month_rate?.avg_cri < 0" width="12px"
                             height="12px" name="down-arrow" class="align-[-1px]"></Svg>
                        <Svg v-else-if="data?.month_rate?.avg_cri && data?.month_rate?.avg_cri > 0" width="12px"
                             height="12px" name="up-arrow" class="align-[-1px]"></Svg>
                        <Svg v-else width="12px" height="12px" name="drivinghouse-flatArrow"
                             class="align-[-1px] text-error"></Svg>
                        <span class="text-[14px] big-number ml-0.5">
                            {{ Math.abs(data?.month_rate?.avg_cri).toFixed(2) + '%' }}
                        </span>
                    </span>
                </a-tag>
                <a-tag :class="{
                    'dashboard-tag-up': calculateYearOnYear(data.root?.cri, data.whole?.cri).trend === 'up',
                    'dashboard-tag': true
                }">
                    <span class="name text-[13px]">同公司平均水平比</span>
                    <span class="num"
                          :class="{ 'text-error': calculateYearOnYear(data.root?.cri, data.whole?.cri) !== '-' && calculateYearOnYear(data.root?.cri, data.whole?.cri).trend === 'up' }">
                        <Svg v-if="calculateYearOnYear(data.root?.cri, data.whole?.cri) !== '-' && calculateYearOnYear(data.root?.cri, data.whole?.cri).trend === 'down'"
                             width="12px" height="12px" name="down-arrow" class="align-[-1px]"></Svg>
                        <Svg v-else-if="calculateYearOnYear(data.root?.cri, data.whole?.cri) !== '-' && calculateYearOnYear(data.root?.cri, data.whole?.cri).trend === 'up'"
                             width="12px" height="12px" name="up-arrow" class="align-[-1px] text-error"></Svg>
                        <span class="text-[14px] big-number">
                            {{ calculateYearOnYear(data.root?.cri, data.whole?.cri).data || '-' }}
                        </span>
                    </span>
                </a-tag>
                <a-tag :class="{
                    'dashboard-tag-up': calculateIndustryOnYear(data.root?.cri, data?.industries?.cri).trend === 'up',
                    'dashboard-tag': true
                }">
                    <span class="name text-[13px]">同行业比</span>
                    <span class="num"
                          :class="{ 'text-error': calculateIndustryOnYear(data.root?.cri, data?.industries?.cri) !== '-' && calculateIndustryOnYear(data.root?.cri, data?.industries?.cri).trend === 'up' }">
                        <Svg v-if="calculateIndustryOnYear(data.root?.cri, data?.industries?.cri) !== '-' && calculateIndustryOnYear(data.root?.cri, data?.industries?.cri).trend === 'down'"
                             width="12px" height="12px" name="down-arrow" class="align-[-1px]"></Svg>
                        <Svg v-else-if="calculateIndustryOnYear(data.root?.cri, data?.industries?.cri) !== '-' && calculateIndustryOnYear(data.root?.cri, data?.industries?.cri).trend === 'up'"
                             width="12px" height="12px" name="up-arrow" class="align-[-1px] text-error"></Svg>
                        <span class="text-[14px] big-number">
                            {{ calculateIndustryOnYear(data.root?.cri, data?.industries?.cri).data || '-' }}
                        </span>
                    </span>
                </a-tag>
            </div>

            <div class="h-[180px] w-full">
                <Chart_curve />
            </div>
        </div>

        <div class="flex w-[50%] flex-1 gap-6">
            <div class="card flex-1 w-0 border-gradient-left rounded-md" :class="{ 'is-scrolling': isScrolling }">
                <div class="index-head left rounded-tl-md rounded-tr-md flex justify-between">
                    <div class="z-10">
                        <div class="flex items-center justify-between font-medium text-base mb-1">
                            <div class="flex items-center text-[#fff] font-medium">
                                <!-- <Svg class="mr-1.5" color="#00D9D2" name="index" width="16px" height="16px"></Svg> -->
                                <span class="text-[16px] font-medium">安全能力差距指数（SAI）</span>
                            </div>

                            <a-popover :overlayClassName="'sai-popover'" trigger="hover" :arrow="false"
                                       placement="bottomRight" color="linear-gradient(180deg, #E8E5FF 0%, #fff 30%)"
                                       :mouseEnterDelay="0.3" :mouseLeaveDelay="0.3">
                                <template #content>
                                    <div class="p-3 w-[340px]">
                                        <div class="mb-3">
                                            <div class="flex items-center font-medium">
                                                <Svg class="mr-2" color="#6D38FF" name="index" width="16px"
                                                     height="16px"></Svg>
                                                <span class="text-sm text-[#333]">安全能力差距指数（SAI）</span>
                                            </div>
                                            <div class="text-xs text-[#999] ml-6">Security Ability Gap Index</div>
                                        </div>
                                        <div class="text-[13px] leading-6 text-[#333]">用于衡量企业安全能力建设情况与目标安全能力集合之间的差距，SAI
                                            越低越好</div>
                                    </div>
                                </template>
                                <div class="cursor-pointer explain_wrap absolute top-4 right-4 rounded-3 w-6 h-6">
                                    <img src="@/assets/svg/explain.svg" alt="" class="info-icon">
                                </div>
                            </a-popover>
                        </div>
                        <div class="text-[32px] text-[#fff] leading-[150%] mb-1 big-number">
                            <span>{{ data.root?.sai?.toFixed(2) || '--' }}</span>
                        </div>
                        <div class="scale-[0.85] origin-left flex">
                            <a-tag :class="{
                                'dashboard-tag-up': data?.month_rate?.avg_sai && data?.month_rate?.avg_sai > 0,
                                'dashboard-tag-flat': !data?.month_rate?.avg_sai,
                                'dashboard-tag': true,
                                'risk-tag': true
                            }">
                                <span class="name text-[13px]">月环比</span>
                                <span class="num"
                                      :class="{ 'text-error': data?.month_rate?.avg_sai && data?.month_rate?.avg_sai > 0 }">
                                    <Svg v-if="data?.month_rate?.avg_sai && data?.month_rate?.avg_sai < 0" width="12px"
                                         height="12px" name="down-arrow" class="align-[-1px]"></Svg>
                                    <Svg v-else-if="data?.month_rate?.avg_sai && data?.month_rate?.avg_sai > 0"
                                         width="12px" height="12px" name="up-arrow"
                                         class="align-[-1px] text-error"></Svg>
                                    <Svg v-else width="12px" height="12px" name="drivinghouse-flatArrow"
                                         class="align-[-1px] text-error"></Svg>
                                    <span class="text-[14px] big-number ml-0.5">
                                        {{ Math.abs(data?.month_rate?.avg_sai).toFixed(2) + '%' }}
                                    </span>
                                </span>
                            </a-tag>
                            <a-tag :class="{
                                'dashboard-tag-up': calculateYearOnYear(data.root?.sai, data.whole?.sai).trend === 'up',
                                'dashboard-tag': true,
                                'risk-tag': true
                            }">
                                <span class="name text-[13px]">同司比</span>
                                <span class="num"
                                      :class="{ 'text-error': calculateYearOnYear(data.root?.sai, data.whole?.sai) !== '-' && calculateYearOnYear(data.root?.sai, data.whole?.sai).trend === 'up' }">
                                    <Svg v-if="calculateYearOnYear(data.root?.sai, data.whole?.sai) !== '-' && calculateYearOnYear(data.root?.sai, data.whole?.sai).trend === 'down'"
                                         width="12px" height="12px" name="down-arrow" class="align-[-1px]"></Svg>
                                    <Svg v-else-if="calculateYearOnYear(data.root?.sai, data.whole?.sai) !== '-' && calculateYearOnYear(data.root?.sai, data.whole?.sai).trend === 'up'"
                                         width="12px" height="12px" name="up-arrow"
                                         class="align-[-1px] text-error"></Svg>
                                    <span class="text-[14px] big-number">
                                        {{ calculateYearOnYear(data.root?.sai, data.whole?.sai).data || '-' }}
                                    </span>
                                </span>
                            </a-tag>

                            <a-tag :class="{
                                'dashboard-tag-up': calculateIndustryOnYear(data.root?.sai, data?.industries?.sai).trend === 'up',
                                'dashboard-tag': true,
                                'risk-tag': true
                            }">
                                <span class="name text-[13px]">同业比</span>
                                <span class="num"
                                      :class="{ 'text-error': calculateIndustryOnYear(data.root?.sai, data?.industries?.sai) !== '-' && calculateIndustryOnYear(data.root?.sai, data?.industries?.sai).trend === 'up' }">
                                    <Svg v-if="calculateIndustryOnYear(data.root?.sai, data?.industries?.sai) !== '-' && calculateIndustryOnYear(data.root?.sai, data?.industries?.sai).trend === 'up'"
                                         width="12px" height="12px" name="up-arrow"
                                         class="align-[-1px] text-error"></Svg>
                                    <Svg v-else-if="calculateIndustryOnYear(data.root?.sai, data?.industries?.sai) !== '-' && calculateIndustryOnYear(data.root?.sai, data?.industries?.sai).trend === 'down'"
                                         width="12px" height="12px" name="down-arrow" class="align-[-1px]"></Svg>
                                    <span class="text-[14px] big-number">
                                        {{ calculateIndustryOnYear(data.root?.sai, data?.industries?.sai).data || '-' }}
                                    </span>
                                </span>
                            </a-tag>
                        </div>

                    </div>

                    <div class="absolute right-0 top-5 z-0 flex items-center">
                        <Svg name="drivinghouse-bg" color="#fff" width="112px" height="83px"></Svg>
                    </div>

                </div>
                <div class="p-4">
                    <div class="sai-table">
                        <div
                            class="table-header rounded-sm px-2 font-medium flex text-[10px] h-[36px] leading-[36px] bg-[#F2F2F2] text-[#333]">
                            <div class="flex-1 font-medium text-[12px]">安全能力</div>
                            <div class="mr-4 text-right font-medium text-[12px]">应用覆盖缺失率</div>
                            <div class="w-[24%] mr-4 text-right font-medium text-[12px]">同司比</div>
                            <div class="w-[24px] mr-1.5 font-medium text-[12px]">操作</div>
                        </div>
                        <div class="table-body sai-scroll-container overflow-y-auto h-[176px] mb-1">
                            <div v-for="(item, key) in securityCapabilityList" :key="key"
                                 class="flex text-[12px] px-2 h-[36px] leading-[36px] bg-[#F2F2F280] mt-2 rounded-sm">
                                <div class="flex-1 text-[12px]">
                                    <a-tooltip :title="getSecurityCapabilityLabel(item.name)" placement="top">
                                        <span class="cursor-help">{{ getSecurityCapabilityShortName(item.name) }}</span>
                                    </a-tooltip>
                                </div>

                                <div class="mr-4 text-right text-[12px]">
                                    <span v-if="!item.value || item.value === 1" class="text-[#999999]">暂未覆盖</span>
                                    <span v-else class="data-number">{{ `${(item.value * 100).toFixed(2)}%` }}</span>
                                </div>
                                <div class="w-[24%] mr-4 text-right">
                                    <span :class="{
                                        'text-error': item?.trend === 'up',
                                        'text-[#999999]': item?.trend === 'down'
                                    }" class="data-number text-[12px]">
                                        <Svg v-if="item?.trend === 'down' && calculateYearOnYear(item, data.whole?.sa_score?.[key]) !== '-'"
                                             width="10px" height="10px" name="grey-arrow" class="align-[-1px]"></Svg>
                                        <Svg v-else-if="item?.trend === 'up' && calculateYearOnYear(item, data.whole?.sa_score?.[key]) !== '-'"
                                             width="10px" height="10px" name="up-arrow"
                                             class="align-[-1px] text-error"></Svg>
                                        <span>
                                            {{ calculateYearOnYear(item, (1 - Number(data.whole?.sa_score?.[key])) || 0)
                                                || '-'
                                            }}
                                        </span>
                                    </span>
                                </div>
                                <div class="flex items-center">
                                    <div v-if="item.value && item.value !== 0 && item.value !== 1"
                                         class="px-1 py-0.5 text-xs text-primary hover:text-purple-100" @click="handleSAIUpgrade(item)">
                                        <span>提升</span>
                                    </div>
                                    <span v-else class="px-1 cursor-not-allowed text-gary-200 text-xs">提升</span>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div class="card relative flex-1 w-0 border-gradient-right rounded-md" :class="{ 'is-scrolling': isScrolling }">
                <div class="index-head right rounded-tl-md rounded-tr-md flex justify-between">
                    <div class="z-10">
                        <div class="flex items-center justify-between font-medium text-base mb-1">
                            <div class="flex items-center text-[#fff]">
                                <span class="text-[16px] font-medium">安全问题指数（SII）</span>
                            </div>

                            <a-popover :overlayClassName="'sii-popover'" trigger="hover" :arrow="false"
                                       placement="bottomRight" color="linear-gradient(180deg, #FBE5FF 0%, #fff 30%)"
                                       :mouseEnterDelay="0.3" :mouseLeaveDelay="0.3">
                                <template #content>
                                    <div class="p-3 w-[348px]">
                                        <div class="mb-3">
                                            <div class="flex items-center font-medium">
                                                <Svg class="mr-2" color="#E460FF" name="index" width="16px"
                                                     height="16px"></Svg>
                                                <span class="text-sm text-[#333]">安全问题指数（SII）</span>
                                            </div>
                                            <div class="text-xs text-[#999] ml-6">Security Issue Index</div>
                                        </div>
                                        <div class="text-[13px] leading-6 text-[#333]">用于评估应用资产中风险水平的关键指标，SII 越低越好</div>
                                    </div>
                                </template>
                                <div class="cursor-pointer explain_wrap absolute top-4 right-4 rounded-3 w-6 h-6">
                                    <img src="@/assets/svg/explain.svg" alt="" class="info-icon">
                                </div>
                            </a-popover>

                        </div>
                        <div class="text-[32px] text-[#fff] leading-[150%] mb-1 big-number">
                            <span>{{ data.root?.sii?.toFixed(2) || '--' }}</span>
                        </div>
                        <div class="scale-[0.85] origin-left flex">
                            <a-tag :class="{
                                'dashboard-tag-up': data?.month_rate?.avg_sii && data?.month_rate?.avg_sii > 0,
                                'dashboard-tag-flat': !data?.month_rate?.avg_sii,
                                'dashboard-tag': true,
                                'risk-tag': true
                            }">
                                <span class="name text-[13px]">月环比</span>
                                <span class="num"
                                      :class="{ 'text-error': data?.month_rate?.avg_sii && data?.month_rate?.avg_sii > 0 }">
                                    <Svg v-if="data?.month_rate?.avg_sii && data?.month_rate?.avg_sii < 0" width="12px"
                                         height="12px" name="down-arrow" class="align-[-1px]"></Svg>
                                    <Svg v-else-if="data?.month_rate?.avg_sii && data?.month_rate?.avg_sii > 0"
                                         width="12px" height="12px" name="up-arrow"
                                         class="align-[-1px] text-error"></Svg>
                                    <Svg v-else width="12px" height="12px" name="drivinghouse-flatArrow"
                                         class="align-[-1px] text-error"></Svg>
                                    <span class="text-[14px] big-number ml-0.5">
                                        {{ Math.abs(data?.month_rate?.avg_sii).toFixed(2) + '%' }}
                                    </span>
                                </span>
                            </a-tag>
                            <a-tag :class="{
                                'dashboard-tag-up': calculateYearOnYear(data.root?.sii, data.whole?.sii).trend === 'up',
                                'dashboard-tag': true,
                                'risk-tag': true
                            }">
                                <span class="name text-[13px]">同司比</span>
                                <span class="num"
                                      :class="{ 'text-error': calculateYearOnYear(data.root?.sii, data.whole?.sii) !== '-' && calculateYearOnYear(data.root?.sii, data.whole?.sii).trend === 'up' }">
                                    <Svg v-if="calculateYearOnYear(data.root?.sii, data.whole?.sii) !== '-' && calculateYearOnYear(data.root?.sii, data.whole?.sii).trend === 'down'"
                                         width="12px" height="12px" name="down-arrow" class="align-[-1px]"></Svg>
                                    <Svg v-else-if="calculateYearOnYear(data.root?.sii, data.whole?.sii) !== '-' && calculateYearOnYear(data.root?.sii, data.whole?.sii).trend === 'up'"
                                         width="12px" height="12px" name="up-arrow"
                                         class="align-[-1px] text-error"></Svg>
                                    <span class="text-[14px] big-number">
                                        {{ calculateYearOnYear(data.root?.sii, data.whole?.sii).data || '-' }}
                                    </span>
                                </span>
                            </a-tag>
                            <a-tag :class="{
                                'dashboard-tag-up': calculateIndustryOnYear(data.root?.sii, data?.industries?.sii).trend === 'up',
                                'dashboard-tag': true,
                                'risk-tag': true
                            }">
                                <span class="name text-[13px]">同业比</span>
                                <span class="num"
                                      :class="{ 'text-error': calculateIndustryOnYear(data.root?.sii, data?.industries?.sii) !== '-' && calculateIndustryOnYear(data.root?.sii, data?.industries?.sii).trend === 'up' }">
                                    <Svg v-if="calculateIndustryOnYear(data.root?.sii, data?.industries?.sii) !== '-' && calculateIndustryOnYear(data.root?.sii, data?.industries?.sii).trend === 'up'"
                                         width="12px" height="12px" name="up-arrow"
                                         class="align-[-1px] text-error"></Svg>
                                    <Svg v-else-if="calculateIndustryOnYear(data.root?.sii, data?.industries?.sii) !== '-' && calculateIndustryOnYear(data.root?.sii, data?.industries?.sii).trend === 'down'"
                                         width="12px" height="12px" name="down-arrow" class="align-[-1px]"></Svg>
                                    <span class="text-[14px] big-number">
                                        {{ calculateIndustryOnYear(data.root?.sii, data?.industries?.sii).data || '-' }}
                                    </span>
                                </span>
                            </a-tag>
                        </div>
                    </div>
                    <div class="absolute right-0 top-5 z-0 flex items-center">
                        <Svg name="drivinghouse-bg" color="#fff" width="112px" height="83px"></Svg>
                    </div>
                </div>
                <div class="p-4">
                    <div class="sai-table">
                        <div
                            class="table-header rounded-sm px-2 flex font-medium text-[10px] h-[36px] leading-[36px] bg-[#F2F2F2] text-[#333]">
                            <div class="flex-1 font-medium text-[12px]">安全问题等级</div>
                            <div class="mr-4 text-right font-medium text-[12px]">得分</div>
                            <div class="w-[24%] mr-4 text-right font-medium text-[12px]">同司比</div>
                            <div class="w-[24px] mr-1 font-medium text-[12px]">操作</div>
                        </div>
                        <div class="table-body overflow-y-visible mb-1">
                            <div v-for="(item, key) in data.root?.si_score" :key="key"
                                 class="flex rounded-sm text-[12px] px-2 h-[36px] leading-[36px] bg-[#F2F2F280] mt-2">
                                <div class="flex-1 text-[12px]" :class="{
                                    'text-[#F34C3D]': key === 'critical',
                                    'text-[#FF8B25]': key === 'high',
                                    'text-[#FFBF00]': key === 'medium',
                                    'text-[#CCCCCC]': key === 'low'
                                }">{{SEC_LEVEL_OPTION.find((option) => option.value === key)?.label}}</div>
                                <div class="mr-4 text-right data-number text-[12px]">{{ item ? item.toFixed(2) : '-' }}
                                </div>

                                <div class="w-[24%] mr-4 text-right">
                                    <span :class="{
                                        'text-error': calculateYearOnYear(item, data.whole?.si_score?.[key]) !== '-' && calculateYearOnYear(item, data.whole?.si_score?.[key]).trend === 'up',
                                        'text-[#999999]': calculateYearOnYear(item, data.whole?.si_score?.[key]) !== '-' && calculateYearOnYear(item, data.whole?.si_score?.[key]).trend === 'down'
                                    }" class="data-number text-[12px]">
                                        <Svg v-if="calculateYearOnYear(item, data.whole?.si_score?.[key]) !== '-' && calculateYearOnYear(item, data.whole?.si_score?.[key]).trend === 'down'"
                                             width="10px" height="10px" name="grey-arrow" class="align-[-1px]"></Svg>
                                        <Svg v-else-if="calculateYearOnYear(item, data.whole?.si_score?.[key]) !== '-' && calculateYearOnYear(item, data.whole?.si_score?.[key]).trend === 'up'"
                                             width="10px" height="10px" name="up-arrow"
                                             class="align-[-1px] text-error"></Svg>
                                        <span>
                                            {{ calculateYearOnYear(item, data.whole?.si_score?.[key]) === '-' ? '-' :
                                                calculateYearOnYear(item, data.whole?.si_score?.[key]).data }}
                                        </span>
                                    </span>
                                </div>
                                <div class="flex items-center">
                                    <div class="px-1 py-0.5 text-xs text-primary hover:text-purple-100" @click="handleSIIUpgrade(key)">
                                        <span class="cursor-pointer">提升</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {
    ref,
    watch,
    onMounted,
    nextTick,
    onBeforeUnmount,
} from 'vue';
import { useRouter } from 'vue-router';
import { SEC_LEVEL_OPTION } from '@/constants/app';
import { getSecurityCapabilityShortName, getSecurityCapabilityLabel } from '@/constants/safetyCapabilities';
import Chart_curve from './Chart_curve.vue';

const router = useRouter();
const { data } = defineProps(['data']);
const isScrolling = ref(false);
const securityCapabilityList = ref([]);

let scrollTimer = null;
let handleScroll = null;

// 判断指标是否为0的函数
const isZeroScore = (score) => score === 0 || score === '0' || score === null || score === undefined;

// 计算同司比
const calculateYearOnYear = (current, previous) => {
    if (isZeroScore(current) || isZeroScore(previous) || current === previous) {
        return '-';
    }
    return {
        data: Math.abs(((current - previous) / previous) * 100).toFixed(2).concat('%'),
        trend: current > previous ? 'up' : 'down',
    };
};

// 计算同业比
const calculateIndustryOnYear = (current, previous) => {
    if (isZeroScore(current) || isZeroScore(previous) || current === previous) {
        return '-';
    }
    return {
        data: Math.abs(((current - previous) / previous) * 100).toFixed(2).concat('%'),
        trend: current > previous ? 'up' : 'down',
    };
};

// 检查表格是否需要滚动
const checkTableScroll = () => {
    nextTick(() => {
        const tableBodies = document.querySelectorAll('.table-body');
        tableBodies.forEach((body) => {
            if (body.scrollHeight > body.clientHeight) {
                body.classList.add('has-scroll');
            } else {
                body.classList.remove('has-scroll');
            }
        });
    });
};

// 设置滚动事件监听
const setupScrollListeners = () => {
    nextTick(() => {
        const tableBodies = document.querySelectorAll('.table-body');
        tableBodies.forEach((element) => {
            element.addEventListener('scroll', () => {
                isScrolling.value = true;
                clearTimeout(element.scrollTimeout);
                element.scrollTimeout = setTimeout(() => {
                    isScrolling.value = false;
                }, 1000);
            });
        });
    });
};

// 处理安全能力数据
const processSecurityCapabilities = (saScore) => {
    if (!saScore || typeof saScore !== 'object') {
        console.warn('安全能力数据格式不正确');
        securityCapabilityList.value = [];
        return;
    }

    const capabilities = Object.entries(saScore)
        .map(([name, value]) => ({
            name,
            value: 1 - value,
        }));

    // 将数据分为两组：值为1的和不为1的
    const valueOneItems = capabilities.filter((item) => item.value === 1);
    const otherItems = capabilities.filter((item) => item.value !== 1)
        .sort((a, b) => b.value - a.value);

    // 合并数组，将值为1的放在最后
    securityCapabilityList.value = [...otherItems, ...valueOneItems];
};

// 监听 data.root.sa_score 的变化
watch(
    () => data?.root?.sa_score,
    (newValue) => {
        processSecurityCapabilities(newValue);
    },
    { immediate: true },
);

// 监听安全能力列表变化，检查是否需要显示滚动提示
watch(securityCapabilityList, () => {
    checkTableScroll();
}, { deep: true });

// 组件挂载时设置滚动监听
onMounted(() => {
    setupScrollListeners();
    checkTableScroll();
    // 窗口大小变化时重新检查
    window.addEventListener('resize', checkTableScroll);

    const container = document.querySelector('.table-body.scroll-container');
    handleScroll = function handlescroll() {
        container.classList.add('sai-scrolling');
        if (scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            container.classList.remove('sai-scrolling');
        }, 800);
    };
    if (container) {
        container.addEventListener('scroll', handleScroll);
    }
});

onBeforeUnmount(() => {
    const container = document.querySelector('.table-body.scroll-container');
    if (container && handleScroll) {
        container.removeEventListener('scroll', handleScroll);
    }
});

// 跳转到应用管理
const handleSAIUpgrade = (item) => {
    router.push({
        path: '/app-manage',
        query: {
            security_capability_type: item.name,
            source: 'dashboard',
        },
    });
};

// 跳转到安全问题
const handleSIIUpgrade = (key) => {
    router.push({
        path: '/sec-issue/list',
        query: {
            issue_level: key,
            source: 'dashboard',
            issue_status: 'open',
        },
    });
};
</script>

<style lang="less">
.index-head {
    padding: 20px 16px;
    padding-bottom: 16px;
    padding-right: 0px;
    position: relative;
    // background-color: #E5EAFF40;

    &.left {
        background: linear-gradient(98.08deg, rgba(109, 56, 255, 0.8) 0%, rgba(56, 93, 255, 0.8) 100%);
    }

    &.right {
        background: linear-gradient(98.08deg, rgba(129, 56, 255, 0.8) 0%, rgba(185, 56, 255, 0.8) 100%);
    }
}

.risk-tag {
    background-color: rgba(255, 255, 255, 0.8) !important;
    border: none !important;
    font-size: 12px;
    line-height: 150%;
    padding: 1px 6px;
    margin-right: 6px;
}

.sai-table {
    border-radius: 2px;
    overflow: hidden;
}

.card {
    .info-icon {
        display: none;
    }

    &:hover {
        .info-icon {
            display: block;
        }

        .table-body::-webkit-scrollbar-thumb {
            background-color: rgba(108, 135, 255, 0.1);
            transition-delay: 0.7s;
        }
    }

    &.is-scrolling {
        .table-body::-webkit-scrollbar-thumb {
            background-color: rgba(108, 135, 255, 0.4);
            transition-delay: 0s;
        }
    }
}

/* Firefox specific styling */
@-moz-document url-prefix() {
    .table-body {
        scrollbar-width: thin;
        scrollbar-color: transparent transparent;
        transition: scrollbar-color 0.5s ease;
    }

    .card:hover .table-body {
        scrollbar-color: rgba(108, 135, 255, 0.1) transparent;
        transition-delay: 0.7s;
    }

    .card.is-scrolling .table-body {
        scrollbar-color: rgba(108, 135, 255, 0.4) transparent;
        transition-delay: 0s;
    }
}

.cri-popup,
.sai-popover,
.sii-popover{
    .ant-popover-inner {
        box-shadow: 0px 10px 36px 10px #1F23290A,
                    0px 8px 24px 0px #1F23290A,
                    0px 6px 12px -10px #1F23290F;
        border-radius: 6px;
        overflow: hidden;
        border: none;
        background: transparent;
    }

    .ant-popover-arrow {
        display: none;
    }

    .ant-popover-content {
        padding: 0;
    }
}

// 修改SAI卡片的边框渐变色
.sai-popover .ant-popover-inner::before {
    background: linear-gradient(135deg, rgba(109, 56, 255, 0.5) 0%, rgba(56, 93, 255, 0.5) 100%);
}

// 修改SII卡片的边框渐变色
.sii-popover .ant-popover-inner::before {
    background: linear-gradient(135deg, rgba(228, 96, 255, 0.5) 0%, rgba(185, 56, 255, 0.5) 100%);
}

@font-face {
    font-family: 'DIN Black';
    src: url('/fonts/DIN-Black.otf') format('truetype');
    font-weight: 900;
    font-style: normal;
    font-display: swap;
}

@font-face {
    font-family: 'DIN Bold';
    src: url('/fonts/DIN-Bold.ttf') format('truetype');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
}

.big-number {
    font-family: 'DIN Black', sans-serif;
    font-weight: 900;
}

.data-number {
    font-family: 'DIN Bold', sans-serif;
    font-weight: 700;
}

.border-gradient-left {
    position: relative;
    border-radius: 6px; // 你的圆角大小
    background: #fff;
    overflow: hidden;
    z-index: 1;

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        padding: 1px; // 控制边框宽度
        border-radius: 6px;
        background: linear-gradient(98.08deg, #835AF8 0%, #5976F8 100%);
        -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
        mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        pointer-events: none;
        z-index: 2;
    }
}

.border-gradient-right {
    position: relative;
    border-radius: 6px; // 你的圆角大小
    background: #fff;
    overflow: hidden;
    z-index: 1;

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        padding: 1px; // 控制边框宽度
        border-radius: 6px;
        background: linear-gradient(98.08deg, #9459F8 0%, #C059F8 100%);
        -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
        mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        pointer-events: none;
        z-index: 2;
    }
}

.dashboard-tag {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0.5px solid #6C87FF80;
    background: #E5EAFF80;
    border-radius: 2px;
    .name {
        margin-right: 4px;
        font-size: 12px;
        color: #666666;
    }
    .num {
        color: #6C87FF;
        font-weight: 900;
        font-size: 13px;
    }
}

.dashboard-tag.dashboard-tag-flat {
    border: 0.5px solid #CCCCCCCC;
    background: #F2F2F280;
    .num {
        color: #4D4D4D;
    }
}

.dashboard-tag.dashboard-tag-up {
    background-color: #FDE9E799;
    border-color: #F34C3D80;
    .num {
        color: #F34C3D;
    }
}

.text-error {
    color: #F34C3D;
}

.sai-scroll-container {
    overflow: overlay;
    scrollbar-gutter: stable;
    padding-right: 0;

    &::-webkit-scrollbar {
        width: 6px;
        background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
        background-color: transparent; // 默认完全透明
        border-radius: 4px;
        transition: background-color 0.3s;
    }
    &::-webkit-scrollbar-track {
        background-color: transparent;
    }
}

/* 悬停或滚动时显示颜色 */
.sai-scroll-container.sai-scrolling::-webkit-scrollbar-thumb {
    background-color: #F2F2F280;
}
</style>
