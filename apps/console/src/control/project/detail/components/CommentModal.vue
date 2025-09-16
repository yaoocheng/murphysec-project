<template>
    <el-dialog title="组件注释" @close="emits('updateComp')" width="603px" align-center :close-on-click-modal="false"
               class="comment-dialog">
        <div class="flex flex-col" style="max-height: calc(100vh - 200px);">
            <div v-if="commentList.length" class="overflow-auto flex-1 mb-2">
                <div v-for="(comment, index) in commentList" :key="index" class="flex gap-2 comment_item group mb-4">
                    <AvatarComp :size="28" :name="comment.created_user_name" />

                    <div class="flex-1">
                        <div class="flex items-center mb-1">
                            <span class="text-sm text-[#3C3C3C] mr-2">{{ comment.created_user_name }}</span>
                            <span class="text-xs text-[#858585]">{{ formatDate(comment.updated_at) }}</span>
                        </div>

                        <div v-if="!comment.is_editing" class="flex items-start">
                            <p class="rounded-md flex-1 text-sm text-[#3C3C3C] break-all bg-[#F7F8FB] px-3 py-2">
                                {{ comment.comment }}
                            </p>
                            <div v-if="comment.created_user_id === store.userInfo.id">
                                <el-tooltip popper-class="user_tooltip" :show-arrow="false" placement="left-start"
                                            effect="light" trigger="click">
                                    <template #content>
                                        <div class="user_popup w-[140px]">
                                            <div class="item" @click="handleEdit(index)">编辑</div>

                                            <el-popconfirm  popper-class="cancle-popper confirm-popper" :width="200"
                                                            @confirm="handleDelete(index)" title="此操作将彻底删除组件注释">
                                                <template #reference>
                                                    <div class="item" style="color: #F34D3D;">
                                                        删除</div>
                                                </template>
                                            </el-popconfirm>
                                        </div>
                                    </template>
                                    <span class="hover_icon px-1.5 hover:bg-[#EBEBEB] leading-7 ml-1">
                                        <i class="murphy icon-dots" style="font-size: 14px;"></i>
                                    </span>
                                </el-tooltip>
                            </div>
                        </div>

                        <div v-else class="flex flex-col gap-2">
                            <el-input v-model="comment.edit_content" type="textarea" placeholder="请输入组件注释"
                                      class="flex-1 bg-[#F7F8FB] rounded-md" resize="none" maxlength="1000"
                                      :autosize="{ minRows: 1, maxRows: 10 }" />
                            <div class="flex justify-end">
                                <el-button class="minor_white_btn h-7 w-auto text-xs"
                                           @click="comment.is_editing = false">取消</el-button>
                                <el-button class="h-7 w-auto text-xs" type="primary"
                                           @click="handleSave(index)">保存</el-button>
                            </div>
                        </div>
                    </div>
                </div>

                <PageComp hide-on-single-page v-model:currentPage="curPage" :total="total" :page-size="10" />
            </div>

            <div class="flex gap-3 items-start">
                <el-input v-model="commentText" type="textarea" placeholder="请输入组件注释"
                          class="flex-1 bg-[#F7F8FB] rounded-md" maxlength="1000" resize="none"
                          :autosize="{ minRows: 1, maxRows: 10 }" />
                <el-button @click="handleSubmit" :disabled="!commentText.trim()" class="w-[31px] h-[31px]">
                    <SvgIcon name="send" color="#fff" class="w-[14px] h-[14px] mt-0.5" />
                </el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import useList from 'util/hook';
import store from 'util/store';
import { showMessage, formatDate } from 'util/tools';
// import { ElMessageBox } from 'element-plus';
import { saveCommentApi, getCommentListApi, deleteCommentApi } from '@/api/detail';

const { rowComp } = defineProps(['rowComp']);
const emits = defineEmits(['updateComp']);
const route = useRoute();
const commentText = ref('');

const baseParams = {
    team_id: store.teamInfo.team_id,
    subtask_id: route.params.sid,
    comp_name: rowComp.comp_name, // 组件名称，必填
    comp_version: rowComp.comp_version, // 组件版本，选填
    ecosystem: rowComp.ecosystem, // 生态系统类型，选填（如：npm, maven, pip等）
    repository: rowComp.repository, // 仓库类型，选填
};

const reqParams = ref({
    ...baseParams,
    limit: 10,
});

const {
    listData: commentList, curPage, total, getData,
} = useList(getCommentListApi, reqParams);

/**
 * 提交新评论
 */
const handleSubmit = async () => {
    if (!commentText.value.trim()) return;

    try {
        await saveCommentApi({
            ...baseParams,
            comment: commentText.value, // 评论内容，必填
        });
        await getData(); // 重新获取评论列表
        commentText.value = '';
    } catch (error) {
        console.error('发布评论失败:', error);
    }
};

/**
 * 编辑评论
 */
const handleEdit = (index: number) => {
    const comment = commentList.value[index];
    comment.is_editing = true;
    comment.edit_content = comment.comment;
};

/**
 * 保存编辑后的评论
 */
const handleSave = async (index: number) => {
    const comment = commentList.value[index];
    try {
        await saveCommentApi({
            ...baseParams,
            comment: comment.edit_content, // 评论内容，必填
            comment_id: comment.id,
        });
        comment.comment = comment.edit_content;
        comment.is_editing = false;
        getData();
    } catch (error) {
        console.error('更新评论失败:', error);
    }
};

/**
 * 删除评论
 * @param index 要删除的评论在列表中的索引
 * 弹出确认框，确认后从列表中删除该评论
 */
const handleDelete = async (index: number) => {
    const comment = commentList.value[index];
    try {
        await deleteCommentApi(comment.id);
        getData();
        showMessage('删除成功', 'success');
    } catch (error) {
        console.error('删除评论失败:', error);
    }
    // ElMessageBox.confirm('此操作将彻底删除评论', '确定删除？', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     showClose: false,
    //     cancelButtonClass: 'minor_white_btn h-7 w-auto text-xs',
    //     confirmButtonClass: 'bg-[#F34D3D] hover:bg-[#f34d3d9c] h-7 w-auto text-xs',
    //     customClass: 'p-6 w-[280px] text-xs ElMessageBox',
    //     beforeClose: async (action, instance, done) => {
    //         if (action === 'confirm') {
    //             try {
    //                 await deleteCommentApi(comment.id);
    //                 getData();
    //                 showMessage('删除成功', 'success');
    //             } catch (error) {
    //                 console.error('删除评论失败:', error);
    //             }
    //         }
    //         done();
    //     },
    // });
};
</script>
