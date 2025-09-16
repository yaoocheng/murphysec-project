<template>
    <div class="sbom_file">
        <div class="module_tree">
            <div class="title g-flex g-justify-between g-align-center g-cursor-pointer"
                 @click="() => { getAllComp(route.params.sid as string, route.params.tid as string); showPath = '' }">
                <div>
                    <i class="murphy icon-xiangmu1" style="color: #858585;"></i>全部项目
                </div>
                <div>
                    <el-checkbox v-model="checkTamperFile" @change="handleTamperFileChange" label="只看被篡改文件" />
                </div>
            </div>
            <el-tree v-loading="treeDataLoading" :data="treeData" @node-click="nodeClickHandle" node-key="id" :default-expanded-keys="[1]">
                <template #default="{ data }">
                    <div class="tree_content">
                        <!-- <el-tooltip v-if="data.file_tampered&&checkTamperFile" :content="data.name" placement="top">
                            <span style="display: flex; align-items: center;">
                                <i v-if="data.children" class="murphy icon-wenjianjia folder"></i>
                                <img class="file_icon g-mr-4" v-else :src="getFileImg(data.name)" alt="">
                                <span class="sbom_name">
                                    {{ data.name }}</span>
                            </span>
                        </el-tooltip>
                        <div v-if="!data.file_tampered&&checkTamperFile">暂未被篡改</div> -->

                        <el-tooltip :content="data.name" placement="top">
                            <span style="display: flex; align-items: center;">
                                <span v-if="data.children" class="flex items-center">
                                    <img v-if="data.name === '[Remote]'" class="g-mr-4 w-4"
                                         src="~ast/fileImg/Remote_Folder.png" alt="">
                                    <i v-else class="murphy icon-wenjianjia folder"></i>
                                </span>
                                <img v-else-if="data.name === '同源分析'" class="g-mr-4" src="~ast/fileImg/tongyuan.png"
                                     alt="">
                                <img v-else class="file_icon g-mr-4" :src="getFileImg(data.name)" alt="">
                                <span class="sbom_name">
                                    {{ data.name }}</span>
                            </span>
                        </el-tooltip>
                    </div>
                </template>
            </el-tree>
        </div>

        <div class="comp_list" v-loading="compListLoading">
            <div class="bg-ff p-4 bdr-6">
                <div class="g-mb-16 g-f-14 g-color-1 break-all">
                    路径：{{ showPath?.replaceAll('!', '/') }}
                </div>

                <div class="g-color-1 g-mb-16" v-if="conpInfo.sha256">
                    <div class="g-mb-16 g-flex g-align-center g-justify-between">
                        <div class="g-flex g-align-center">
                            <img class="file_icon g-mr-4" style="width: 26px;" :src="getFileImg(conpInfo.showName)"
                                 alt="">
                            <span class="g-f-14 g-ml-4">{{ conpInfo.showName }}</span>
                        </div>
                        <div v-if="conpInfo.file_type && conpInfo.binary_analyze" @click="isShowFileINfo = true"
                             class="g-color-5 g-f-14 g-cursor-pointer">
                            查看文件信息<i class="murphy icon-youjiantou11"></i>
                        </div>
                    </div>
                    <div class="g-mb-8 g-p-16 g-bg-f7 g-bdr-6 g-f-14"
                         v-if="conpInfo.software_type && !conpInfo.file_tampered">
                        <div class="g-fw-500 g-mb-12">
                            关联信息
                        </div>
                        <div class="g-flex g-align-start g-justify-between">
                            <div class="g-mr-16">
                                <div class="info-title">
                                    类型
                                </div>
                                <div class="info-content">
                                    {{ conpInfo.software_type || '暂无' }}
                                </div>
                                <div class="info-title">
                                    生态类型
                                </div>
                                <div class="info-content">
                                    {{ conpInfo.ecosystem || '暂无' }}
                                </div>
                                <div class="info-title">
                                    开源项目地址
                                </div>
                                <div class="info-content">
                                    <el-tooltip :content="conpInfo.home_page_url">
                                        {{ conpInfo.home_page_url || '暂无' }}
                                    </el-tooltip>
                                </div>
                            </div>
                            <div class="g-mr-16">
                                <div class="info-title">
                                    组件名称 <span v-if="conpInfo.maturity != undefined" class="g-cursor-pointer g-color-5"
                                               @click="isShowRadar = true; radatData = conpInfo.maturity">成熟度评估</span>
                                </div>
                                <el-tooltip :content="conpInfo.comp_name" placement="top">
                                    <div class="info-content">
                                        {{ conpInfo.comp_name || '暂无' }}
                                    </div>
                                </el-tooltip>
                                <div class="info-title">
                                    许可证类型
                                </div>
                                <div class="info-content">
                                    <!-- {{ conpInfo.license }} -->
                                    <span v-for="item in conpInfo.license" :key="item.spdx">
                                        {{ item.spdx }} &nbsp;
                                    </span>
                                </div>
                            </div>
                            <div class="g-mr-16">
                                <div class="info-title">
                                    组件版本
                                </div>
                                <div class="info-content">
                                    {{ conpInfo.comp_version || '暂无' }}
                                </div>
                                <div class="info-title">
                                    仓库地址
                                </div>
                                <div class="info-content">
                                    <el-tooltip placement="top" :content="conpInfo.repository_url">
                                        {{ conpInfo.repository_url || '暂无' }}
                                    </el-tooltip>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="g-mb-8 g-p-16 g-border-box g-bdr-6 g-bg-f7 g-f-14">
                        <div class="g-mb-12">是否被篡改：{{ conpInfo.file_tampered === false || conpInfo.file_tampered ===
                            null ?
                                '否'
                            : '是' }}</div>
                        <div v-if="conpInfo.file_tampered">
                            <div class="g-mb-12 g-flex" v-for="item in conpInfo.references_sha1_hash_list"
                                 :key="item.sha1">
                                <div class="g-flex-grow-1">
                                    <p class="g-mb-8 g-f-12 g-color-3">组件名称</p>
                                    <p>{{ item.name }}</p>
                                </div>
                                <div class="g-flex-grow-1">
                                    <p class="g-mb-8 g-f-12 g-color-3">组件版本</p>
                                    <p>{{ item.version }}</p>
                                </div>
                                <div class="g-flex-grow-1">
                                    <p class="g-mb-8 g-f-12 g-color-3">原始文件SHA1</p>
                                    <p>{{ item.sha1 }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="line-height: 30px;"
                         class="file-info g-flex-wrap g-mb-8 g-p-16 g-border-box g-bg-f7 g-bdr-6 g-f-14 g-flex g-align-center g-justify-between">
                        <span class="g-mr-8">
                            文件类型：{{ conpInfo.file_type || '-' }}
                        </span>
                        <span class="g-mr-8">
                            文件大小：{{ (conpInfo.file_size / 1024).toFixed(0) }}KB
                        </span>
                        <el-tooltip placement="top" :content="conpInfo.md5">
                            <span class="g-mr-8">
                                MD5：<span class="hash">{{ conpInfo.md5 || '-' }}</span>
                            </span>
                        </el-tooltip>
                        <el-tooltip placement="top" :content="conpInfo.sha1">
                            <span class="g-mr-8">
                                SHA1：<span class="hash">{{ conpInfo.sha1 || '-' }}</span>
                            </span>
                        </el-tooltip>
                        <el-tooltip placement="top" :content="conpInfo.sha256">
                            <span class="g-mr-8">
                                SHA256：<span class="hash">{{ conpInfo.sha256 || '-' }}</span>
                            </span>
                        </el-tooltip>
                        <el-tooltip placement="top">
                            <template #content>
                                <div class="max-w-[400px]">
                                    {{ conpInfo.sha512 }}
                                </div>
                            </template>
                            <span class="g-mr-8">
                                SHA512：<span class="hash">{{ conpInfo.sha512 || '-' }}</span>
                            </span>
                        </el-tooltip>
                        <el-tooltip placement="top">
                            <template #content>
                                <div class="max-w-[400px]">
                                    {{ conpInfo.crc32 }}
                                </div>
                            </template>
                            <span class="g-mr-8">
                                CRC32：<span class="hash">{{ conpInfo.crc32 || '-' }}</span>
                            </span>
                        </el-tooltip>
                    </div>
                    <div v-if="conpInfo.additional_data?.description" class="p-4 rounded-md bg-ff text-sm leading-6">
                        {{ conpInfo.additional_data?.description }}
                    </div>
                </div>

                <div class="filter_wrap">
                    <!-- <div class="g-flex g-align-center fle-wrap"> -->
                    <SearchComp style="width: 170px" class="mb-2" v-model="searchData.keyword" clearable
                                placeholder="请搜索组件名称" />
                    <CheckboxComp style="width: 140px;" class="mb-2" v-model="searchData.suggest"
                                  :options="compSugOption" clearable placeholder="处置等级" />
                    <SelectComp style="width: 140px" class="mb-2" v-model="searchData.rely" :options="relyOptions"
                                clearable placeholder="依赖类型" />
                    <SelectComp style="width: 150px" class="mb-2" v-model="searchData.basis" :options="source_option"
                                clearable placeholder="组件识别准确性" />
                    <SelectComp style="width: 140px;" class="mb-2" v-model="searchData.compStra" :options="tagOptions"
                                clearable placeholder="命中组件策略" />
                    <SelectComp v-if="store.isLic" style="width: 140px;" class="mb-2" v-model="searchData.compUse"
                                :options="USEOP" clearable placeholder="组件用法" />
                    <el-checkbox class="g-ml-8 g-mr-8 mb-2" v-model="searchData.isOnline" label="线上依赖" />
                    <el-checkbox class="g-ml-8 mb-2" v-model="searchData.projectStra" label="命中项目策略" />

                    <el-button class="minor_btn mb-2" @click="resetHandle"
                               style="height: 32px;width: 52px;margin-left: 16px;">
                        重置
                    </el-button>
                    <!-- </div> -->
                </div>

                <div class="g-color-3 g-fw-400 g-f-14 g-mb-12 g-flex g-justify-between g-align-center">
                    <div>
                        共 <span class="g-color-1 g-fw-500">{{ compData.length }}</span> 条数据
                    </div>
                </div>

                <vxe-table v-if="Object.keys(compData)?.length" :cell-style="{ lineHeight: '56px' }"
                           :header-cell-style="{ height: '56px', background: '#F7F8FB', fontWeight: 400, color: '#8F959E' }"
                           :row-style="{ background: '#fff' }" :row-config="{ height: 56 }" min-height="50" max-height="500"
                           :scroll-y="{ enabled: true }" show-overflow border="inner" :round="true" :data="compData">
                    <vxe-column min-width="680" title="组件名称">
                        <template #default="scope">
                            <div class="g-flex g-align-center h-14">
                                <el-tooltip placement="top" :content="scope.row.comp_name">
                                    <div class="leading-none max-w-[200px] ellipsis">
                                        <span style="max-width: 200px;margin-right: 8px;"
                                              @click="compJump({ name: scope.row?.comp_name, version: scope.row?.comp_version, ecosystem: scope.row?.ecosystem, repository: scope.row?.repository })"
                                              class="link_text">
                                            {{ scope.row.comp_name }}
                                        </span>
                                    </div>
                                </el-tooltip>

                                <el-tooltip effect="light" placement="top">
                                    <TagComp class="g-mr-4" :content="getRepaireLevelTool(scope.row.suggest_level).text"
                                             :c="getRepaireLevelTool(scope.row.suggest_level).color"
                                             :bgc="getRepaireLevelTool(scope.row.suggest_level).bgc" />

                                    <template #content>
                                        <SuggestTips :text="getRepaireLevelTool(scope.row.suggest_level).text" />
                                    </template>
                                </el-tooltip>

                                <TagComp class="g-mr-4"
                                         v-if="scope.row.repository !== 'unmanaged' && (scope.row.ecosystem || scope.row.repository)"
                                         :content="scope.row.ecosystem || scope.row.repository || 'unmanaged'" />

                                <!-- <span class="tag" v-for="ele in scope.row.license" :key="ele.spdx">{{ ele.spdx }}</span> -->
                                <!-- <span v-if="scope.row.license" class="tag">{{ scope.row.license[0]?.spdx }}</span> -->
                                <div v-if="scope.row.license?.length > 1" style="vertical-align: -6px;"
                                     class="g-display-inline-block">
                                    <TagComp class="g-mr-4" :content="scope.row.license[0]?.spdx" />

                                    <el-tooltip placement="top" effect="light">
                                        <template #content>
                                            <div class=" max-h-[256px] overflow-auto">
                                                <div class="mb-2" v-for="o in (scope.row.license)" :key="o">
                                                    <TagComp class="g-mr-4" :content="o.spdx" />
                                                </div>
                                            </div>
                                        </template>
                                        <TagComp class="g-mr-4" bgc="rgba(31, 35, 41, 0.10)" c="#1F2329"
                                                 :content="`+${scope.row.license?.length - 1}`" />
                                    </el-tooltip>
                                </div>

                                <TagComp v-if="scope.row.license?.length === 1" class="g-mr-4 leading-3"
                                         :content="scope.row.license?.[0]?.spdx" />

                                <el-tooltip v-if="scope.row.is_online" effect="light" placement="top">
                                    <TagComp class="g-mr-4" :content="'线上依赖'" />

                                    <template #content>
                                        <div style="color: #2A2B32;">
                                            什么是线上依赖？<a href="/docs/glossary/production-dependencies.html"
                                                       target="_blank">详情</a>
                                        </div>
                                    </template>
                                </el-tooltip>

                                <TagComp class="g-mr-4" v-if="scope.row.maven_scope" :content="scope.row.maven_scope" />

                                <span v-if="scope.row.is_self">
                                    <TagComp class="g-mr-4" content="自身依赖" />
                                    <el-tooltip placement="top" effect="light">
                                        <template #content>
                                            <TagComp :content="scope.row.is_direct_dependency ? '直接依赖' : '间接依赖'" />
                                        </template>
                                        <TagComp class="g-mr-4" bgc="rgba(31, 35, 41, 0.10)" c="#1F2329" content="+1" />
                                    </el-tooltip>
                                </span>

                                <TagComp class="g-mr-4" v-else
                                         :content="scope.row.is_direct_dependency ? '直接依赖' : '间接依赖'" />

                                <el-tooltip placement="top"
                                            v-if="scope.row.detection_strategy_name && scope.row.detection_strategy_name?.length">
                                    <TagComp class="g-mr-4" c="#049FD7" bgc="#14C0FF33"
                                             :content="scope.row.detection_strategy_name[0]" />

                                    <template #content>
                                        <div v-for="ele in scope.row.detection_strategy_name" :key="ele">
                                            {{ ele }}
                                        </div>
                                    </template>
                                </el-tooltip>

                                <el-tooltip v-if="scope.row.evidence_accuracy === 'Inaccuracy'" placement="top"
                                            effect="light">
                                    <template #content>
                                        <div class="max-w-[344px] px-2 py-2">
                                            <span class="text-sm font-medium text-3c">
                                                组件为模糊匹配，涉及内容为预测值，<span
                                                    @click="isShowAdjustModal = true; adjustComp = scope.row"
                                                    class="text-primary cursor-pointer">校准组件</span>
                                                以获取更准确结果
                                            </span>
                                        </div>
                                    </template>

                                    <TagComp content="模糊" class="mr-1" c="#525252" bgc="#EBEBEB" />
                                </el-tooltip>

                                <TagComp v-if="scope.row.evidence_accuracy === 'Accuracy'" class="mr-1" content="精准"
                                         c="#6425D0" bgc="#7F3BF533" />

                                <TagComp v-if="scope.row.evidence_accuracy === 'Adjusted'" class="mr-1" content="校准"
                                         c="#B220B2" bgc="#D136D133" />

                                <el-tooltip v-if="scope.row.set_suggest_level_type"
                                            :content="scope.row.set_suggest_level_name" placement="top">
                                    <TagComp class="g-mr-4" bgc="#14C0FF33" c="#049FD7"
                                             v-if="scope.row.set_suggest_level_type === 'defect'" content="标记为缺陷组件" />

                                    <TagComp bgc="#14C0FF33" c="#049FD7"
                                             v-else-if="scope.row.set_suggest_level_type === 'safe'" content="标记为安全组件" />
                                </el-tooltip>

                                <el-tooltip v-if="scope.row.project_detection_strategy_name?.length" placement="top">
                                    <template #content>
                                        <div>
                                            命中项目策略：
                                        </div>
                                        <div v-for="o in (scope.row.project_detection_strategy_name)" :key="o">
                                            {{ o }}
                                        </div>
                                    </template>
                                    <div>
                                        <span class="status stra-icon g-mr-8 g-ml-4" style="vertical-align: -2px;">
                                            <i class="murphy icon-a-hitthetarget"
                                               style="color: #F34D3D;font-size: 16px;"></i>
                                        </span>
                                    </div>
                                </el-tooltip>

                            </div>
                        </template>
                    </vxe-column>

                    <vxe-column min-width="200" title="组件版本">
                        <template #default="scope">
                            <el-tooltip placement="top" :disabled="!scope.row.comp_version">
                                <template #content>
                                    <div class="max-w-[344px]">
                                        {{ scope.row.comp_version }}
                                    </div>
                                </template>
                                <span class="inline-block max-w-[140px] leading-none ellipsis">{{ scope.row.comp_version
                                    || '-'
                                }}</span>
                            </el-tooltip>

                            <el-tooltip placement="right" v-if="scope.row.the_chosen_version && scope.row.comp_version">
                                <template #content>
                                    <div style="max-width: 344px;">
                                        此版本为推测值，由于检测时获取到的特征有限，识别可能存在偏差，暂时无法提供精确版本。
                                    </div>
                                </template>
                                <span class="hover_icon g-ml-4" style="display: inline;padding:4px 5px">
                                    <i class="murphy icon-wenhaoxiao g-f-14 g-color-1"></i>
                                </span>
                            </el-tooltip>

                        </template>
                    </vxe-column>

                    <vxe-column min-width="240" v-if="store.isLic" title="组件用法">
                        <template #default="{ row }">
                            <el-tooltip effect="light" :disabled="row.way_of_use_list?.length<1" placement="top">
                                <template #content>
                                    <div class="leading-7" v-for="ele in row.way_of_use_list" :key="ele">
                                        <TagComp bgc="rgba(31, 35, 41, 0.10)" c="#1F2329" :content="USEMAP[ele]" />
                                    </div>
                                </template>
                                <span v-for="item in row.way_of_use_list" :key="item">{{ USEMAP[item] }}</span>
                            </el-tooltip>
                        </template>
                    </vxe-column>

                    <vxe-column min-width="100" title="安全分">
                        <template #default="scope">
                            <span v-if="scope.row.maturity != undefined" class="g-cursor-pointer"
                                  @click="radatData = scope.row?.maturity; isShowRadar = true">
                                <span class="g-fw-500"
                                      :style="{ color: scope.row?.maturity?.maturity > 60 ? '#38C728' : '#FF9940' }">
                                    <i class="murphy icon-leaf"></i> {{ scope.row?.maturity?.maturity }}
                                </span>
                            </span>
                            <span v-else>-</span>
                        </template>
                    </vxe-column>

                    <vxe-column min-width="200" title="官方地址">
                        <template #default="{ row }">
                            <a v-if="row.repo_url" :href="row.repo_url" target="_blank"
                               class="inline-block ellipsis max-w-full leading-none text-primary">{{ row.repo_url
                               }}</a>
                            <span v-else>-</span>
                        </template>
                    </vxe-column>

                    <vxe-column align="center">
                        <template #default="{ row }">
                            <i v-if="row.has_comment" @click="openComment(row)"
                               class="murphy cursor-pointer icon-comment text-85 hover:text-primary"></i>
                        </template>
                    </vxe-column>

                    <vxe-column title="操作" width="60" fixed="right">
                        <template #default="scope">
                            <div class="inline-block">
                                <el-tooltip popper-class="user_tooltip" :show-arrow="false" placement="left-start"
                                            effect="light" trigger="click">

                                    <span class="button-icon-blue leading-none" @click.stop>
                                        <!-- <span class="add leading-none" @click.stop> -->
                                        <i class="murphy icon-dots"></i>
                                    </span>

                                    <template #content>
                                        <div class="user_popup text-3c" style="width: 140px">
                                            <div class="g-cursor-pointer  item" @click="openAutonomousModal(scope.row)">
                                                组件溯源信息
                                            </div>

                                            <div v-if="!$route.fullPath.includes('share-report')">
                                                <div v-if="canAdjust && !hasSourceAnalysis(scope.row)"
                                                     class="item g-cursor-pointer"
                                                     @click="isShowAdjustModal = true; adjustComp = scope.row">组件版本校准</div>
                                                <Tooltip v-else-if="!canAdjust" width="264"
                                                         content="仅支持系统版本3.5.8之后的检测任务，可在重新检测后再对组件进行「校准」">
                                                    <div class="item" style="color: #c7c7c7">组件版本校准</div>
                                                </Tooltip>
                                                <div v-else class="item" style="color: #c7c7c7">组件版本校准</div>

                                                <div v-if="store.isLic">
                                                    <div v-if="canAdjust" class="item"
                                                         @click="isShowAdjustUseModal = true; adjustComp = scope.row">
                                                        组件用法校准
                                                    </div>
                                                    <Tooltip v-else width="264"
                                                             content="仅支持系统版本3.5.9之后的检测任务，可在重新检测后再对组件用法进行「校准」">
                                                        <div class="text-c7 item">组件用法校准</div>
                                                    </Tooltip>
                                                </div>
                                            </div>

                                            <div class="item" id="copy_path"
                                                 :data-clipboard-text="clipboardText(scope.row.module_path)"
                                                 @click="copyFunc('#copy_path')">
                                                复制组件路径
                                            </div>
                                            <div v-if="!$route.fullPath.includes('share-report')" class="item"
                                                 @click="openComment(scope.row)">
                                                组件注释
                                            </div>
                                        </div>
                                    </template>
                                </el-tooltip>
                            </div>
                        </template>
                    </vxe-column>
                </vxe-table>

                <NoData v-else />
            </div>

            <TraceMap v-model="isShowTraceMap" v-if="isShowTraceMap" :graph="graph" :graphLoading="graphLoading" :basisData="basisData"
                      :curCompInfo="curCompInfo" :codeFragment="codeFragment" />

            <RipeRadarModal v-model="isShowRadar" v-if="isShowRadar" :score="radatData" />

            <SbomFileInfoVue v-model="isShowFileINfo" v-if="isShowFileINfo" :name="conpInfo.showName"
                             :fileParams="fileParams" />

            <SbomSourceModal v-model="isShowSbomSourceModal" v-if="isShowSbomSourceModal"
                             :sbomSourceReqData="sbomSourceReqData" />

            <AdjustModal v-model="isShowAdjustModal" v-if="isShowAdjustModal" :adjustComp="adjustComp"
                         :clickPath="clickPath" />

            <AdjustUseModal v-model="isShowAdjustUseModal" v-if="isShowAdjustUseModal" :adjustComp="adjustComp"
                            :clickPath="clickPath" />

            <CommentModal v-model="isShowCommentModal" v-if="isShowCommentModal"
                          @updateComp="getAllComp(route.params.sid as string, route.params.tid as string);"
                          :rowComp="curCompInfo" />
        </div>
    </div>

    <SnippetModal v-model="isNewSnippetModal" v-if="isNewSnippetModal" />
    <CodeSnippetModal v-model="isOldSnippetModal" v-if="isOldSnippetModal"
                      :dialogRenderData="oldSnippetModalRenderData" />
</template>

<script setup lang='ts'>
import { onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import store from 'util/store';
import { getRepaireLevelTool, copyFunc } from 'util/tools';
import {
    getDetailSbomListApi, getSbomInfoApi, getFileSourceApi, getFileSourceSimilarCodeApi,
} from 'api/project';
import NoData from 'comp/NoData.vue';
import SearchComp from 'comp/SearchComp.vue';
import { getSnippetList } from 'api/detail';
import {
    getFileImg,
    useModalStates, useComponentData, useAnalysisData, useSearchData, sortHandle,
    useTamperFile, useClipboard,
} from './composables/use-sbom';
import { compJump } from '@/utils/hook';
import { UI, projectItemInfo } from './snippet/business';
import { isShowAdjustModal, canAdjust } from '../business';
import { isShowAdjustUseModal } from './comp_use/business';
import {
    compSugOption, source_option, relyOptions, tagOptions, USEMAP, USEOP,
} from '../constants/constants';
import TraceMap from '../../platform/comp/TraceMap.vue';
import RipeRadarModal from './RipeRadarModal.vue';
import SbomFileInfoVue from './components/SbomFileInfo.vue';
import SbomSourceModal from './components/SbomSourceModal.vue';
import AdjustModal from './sbom/AdjustModal.vue';
import AdjustUseModal from './comp_use/AdjustUseModal.vue';
import CommentModal from './components/CommentModal.vue';
import SnippetModal from './snippet/SnippetModal.vue';
import CodeSnippetModal from './components/CodeSnippetModal.vue';

const route = useRoute();
const {
    isShowTraceMap,
    isShowRadar,
    isShowFileINfo,
    isShowSbomSourceModal,
    isNewSnippetModal,
    isOldSnippetModal,
    oldSnippetModalRenderData,
} = useModalStates();

const {
    treeData,
    treeDataLoading,
    initCompData,
    compData,
    compListLoading,
    conpInfo,
    curCompInfo,
    adjustComp,
    clickPath,
    cacheTree,
    isShowCommentModal,
    openComment,
    getAllComp,
    getModuleList,
} = useComponentData();

const {
    graph,
    graphLoading,
    codeFragment,
    basisData,
    sbomSourceReqData,
    radatData,
    fileParams,
    getGraphData,
    getCodeData,
    getTraceBasisData,
} = useAnalysisData();

const {
    showPath,
    checkTamperFile,
    searchData,
    resetHandle,
} = useSearchData(initCompData, compData);

const hasSourceAnalysis = (row: any) => row.module_path.length === 1 && row.module_path.some((item: any) => item.associated_file_path.includes('同源分析'));

onBeforeMount(() => {
    getModuleList(route.params.sid as string, route.params.tid as string);
    getAllComp(route.params.sid as string, route.params.tid as string);
});

// 复制
const { clipboardText } = useClipboard();

// 篡改文件
const { changeTamperFile } = useTamperFile();
const handleTamperFileChange = (value: boolean) => {
    changeTamperFile(value, treeData, cacheTree);
};

// 获取组件列表
const getComponentList = async (data: any) => {
    compListLoading.value = true;
    try {
        const sbomData = await getDetailSbomListApi({
            subtask_id: route.params.sid,
            project_id: route.params.tid,
            module_filter: data.data,
            name: data.name,
        });

        compData.value = sortHandle(Object.values(sbomData.data || []));
        initCompData.value = sortHandle(Object.values(sbomData.data || []));
        compListLoading.value = false;
        resetHandle();
    } catch (error) {
        console.log(error);
    }
};

// 获取组件详细信息
const getComponentInfo = async (data: any) => {
    try {
        const res = await getSbomInfoApi({
            subtask_id: route.params.sid,
            project_id: route.params.tid,
            module_filter: data.data,
            name: data.name,
        });
        conpInfo.value = {
            ...res.data.comp, ...res.data.module, showName: data.name,
        };
        radatData.value = conpInfo.value?.component_maturity;
        showPath.value = data.data;
        clickPath.value = conpInfo.value.associated_file_path;

        fileParams.value = {
            module_filter: data.data,
            name: data.name,
            ...conpInfo.value,
        };
    } catch (error) {
        console.log(error);
    }
};

// 节点点击事件处理
const nodeClickHandle = async (data: any) => {
    getComponentList(data);
    getComponentInfo(data);
};

// 获取当前组件溯源
const getGraphDataHandle = async (comp: any) => {
    graphLoading.value = true;
    isShowTraceMap.value = true;
    if (comp.is_ac) {
        isShowSbomSourceModal.value = true;
        sbomSourceReqData.value = {
            subtask_id: route.params.sid,
            project_id: route.params.tid,
            project_name: comp.comp_name,
            name: comp.comp_name,
            version: comp.comp_version,
        };
        return;
    }

    const baseReq = {
        subtask_id: route.params.sid,
        project_id: route.params.tid,
        comp_name: comp.comp_name,
        comp_version: comp.comp_version,
        ecosystem: comp.ecosystem,
        repository: comp.repository,
    };
    try {
        await Promise.all([
            getGraphData(baseReq),
            getCodeData(baseReq),
            getTraceBasisData(baseReq),
        ]);

        curCompInfo.value = comp;
        graphLoading.value = false;
    } catch (error) {
        console.error('获取组件溯源数据失败:', error);
    }
};

// open old modal
const codeDiffHandle = async (item: any) => {
    const res = await getFileSourceSimilarCodeApi({
        project_id: route.params.tid, subtask_id: route.params.sid, name: item.name, version: item.version,
    });
    oldSnippetModalRenderData.value = {
        list: res.data || [],
        cache: res.data || [],
        project_license_data: item.license,
        project_licenses_data: item.licenses,
        ...item,
    };
    isOldSnippetModal.value = true;
};

// 是同源分析路径打开同源性的弹框
const openAutonomousModal = async (row: any) => {
    // 是同源打开同源弹框
    if (row.module_path.length === 1 && row.module_path.some((item: any) => item.associated_file_path.includes('同源分析'))) {
        if (UI.value === 1) {
            //  旧的
            try {
                const { data } = await getFileSourceApi({
                    project_id: route.params.tid as string,
                    subtask_id: route.params.sid as string,
                    project_name: '',
                });
                const findItem = data.list.find((item: any) => item.name === row.comp_name);
                if (findItem) {
                    codeDiffHandle(findItem);
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            try {
                const { data } = await getSnippetList({
                    project_id: route.params.tid,
                    subtask_id: route.params.sid,
                    project_name: row.comp_name,
                });
                const findItem = data.list.find((item: any) => item.target_project_name === row.comp_name);
                if (findItem) {
                    projectItemInfo.value = findItem;
                    isNewSnippetModal.value = true;
                }
            } catch (error) {
                console.log(error);
            }
        }
    } else {
        // 打开溯源图
        getGraphDataHandle(row);
    }
};

</script>

<style lang='less' scoped>
.sbom_file {
    display: flex;
    // justify-content: space-between;
    width: 100%;

    .title {
        font-size: 14px;
        color: @text-color;
        margin-bottom: 16px;

        i {
            vertical-align: -1px;
            margin-right: 4px;
        }
    }

    .module_tree {
        // width: 20%;
        flex: 1;
        // margin-right: 16px;
        padding-right: 8px;
        box-sizing: border-box;

        // overflow: auto;
        .file_icon {
            width: 24px;
        }

        .sbom_name {
            display: inline-block;
            max-width: 120px;
            .ellipsis();
        }
    }

    .comp_list {
        flex: 4.2;
        background-color: #F7F8FB;
        border-radius: 4px;
        padding: 16px;
        box-sizing: border-box;
        width: 0;

        // .hash {
        //     max-width: 300px;
        //     display: inline-block;
        //     vertical-align: -3px;
        //     .ellipsis();
        // }

        .status {
            &:hover {
                background-color: #f34d3d38;
            }

            display: inline;
            padding: 5px 4px;
            font-size: 12px;
            border-radius: 4px;

            i {
                font-size: 14px;
                vertical-align: -1px;
            }
        }

        .info-title {
            font-size: 12px;
            margin-bottom: 8px;
            .g-color-3();
        }

        .file-info span {
            width: 30%;
            .ellipsis();
        }

        .info-content {
            font-size: 14px;
            margin-bottom: 16px;
            max-width: 260px;
            .ellipsis();
            .g-wb-all();
            .g-color-1();
        }
    }

    :deep(.el-tree-node__content) {
        height: 38px;
        border-radius: 6px;

        .el-icon {
            font-size: 14px;
        }

        .tree_content {
            padding: 8px 18px;
            padding-left: 0;
            font-size: 14px;
            color: @text-color;
            .ellipsis();
        }

        .folder {
            font-size: 12px;
            margin-right: 6px;
            color: #FFCB1F;
        }

        i {
            vertical-align: 3px;
        }
    }

    .filter_wrap {
        display: flex;
        align-items: center;
        width: 100%;
        flex-wrap: wrap;
        margin-bottom: 8px;
    }

    span.tag {
        padding: 3px 5px;
        background: rgba(73, 102, 230, 0.2);
        border-radius: 4px;
        color: #2946C7;
        font-size: 12px;
        // margin-right: 8px;
        display: inline-block;
        transform: scale(0.8);
    }

    .comp_item {
        // width: 100%;
        padding: 16px;
        background-color: #fff;
        border-radius: 4px;
        margin-bottom: 10px;
        font-size: 14px;
        color: @text-color;
        display: flex;
        align-items: center;
        justify-content: space-between;
        // flex-wrap: wrap;
        box-sizing: border-box;

        div {
            .ellipsis();
        }

        .text {
            display: inline-block;
            max-width: 20%;
            margin-right: 8px;
            vertical-align: middle;
            .ellipsis();
        }
    }
}

.add {
    &:hover {
        background-color: #EBEBEB;
    }

    width: 28px;
    height: 28px;
    padding: 7px;
    border-radius: 6px;
    cursor: pointer;
    box-sizing: border-box;
    display: inline-block;

    i {
        font-size: 14px;
    }
}
</style>

<style lang="less">
.export {
    font-size: 14px;
    color: @text-color;

    div {
        &:hover {
            color: rgb(108, 135, 255);
        }

        height: 30px;
        line-height: 30px;
        cursor: pointer;
    }
}
</style>
