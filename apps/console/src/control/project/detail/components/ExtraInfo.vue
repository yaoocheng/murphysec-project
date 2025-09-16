<template>
    <el-dialog
        title="更多信息"
        width="840px"
        align-center
        :close-on-click-modal="false"
        class="extra-info-dialog"
    >
        <div class="dialog-content">
            <div class="info-description">
                命令行工具或 API 调用在发起检测时提供的附加信息
            </div>

            <div class="info-sections">
                <!-- 项目附加信息 -->
                <div class="info-section">
                    <div class="section-title">项目附加信息</div>
                    <div class="section-content">
                        <div v-if="loading" class="loading-state">
                            <el-icon class="is-loading"><Loading /></el-icon>
                            <span>加载中...</span>
                        </div>
                        <div v-else-if="Object.keys(projectExtData).length === 0" class="empty-state">
                            <span>暂无项目附加信息</span>
                        </div>
                        <div v-for="(value, key) in projectExtData" :key="key" class="info-item">
                            <div class="info-label">{{ key }}</div>
                            <div class="info-value">{{ value }}</div>
                        </div>
                    </div>
                </div>

                <!-- 任务附加信息 -->
                <div class="info-section">
                    <div class="section-title">任务附加信息</div>
                    <div class="section-content">
                        <div v-if="loading" class="loading-state">
                            <el-icon class="is-loading"><Loading /></el-icon>
                            <span>加载中...</span>
                        </div>
                        <div v-else-if="Object.keys(subtaskExtData).length === 0" class="empty-state">
                            <span>暂无任务附加信息</span>
                        </div>
                        <div v-else class="task-info-list">
                            <div v-for="(value, key) in subtaskExtData" :key="key" class="info-item">
                                <div class="info-label">{{ key }}</div>
                                <div class="info-value">{{ value }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Loading } from '@element-plus/icons-vue';
import { getExtraInfoApi } from '@/api/project';

const route = useRoute();
const projectExtData = ref<Record<string, any>>({});
const subtaskExtData = ref<Record<string, any>>({});
const loading = ref(false);

// 获取扩展信息
const fetchExtraInfo = async () => {
    try {
        loading.value = true;
        const subtaskId = route.params.sid as string;
        const projectId = route.params.tid as string;

        if (!subtaskId || !projectId) {
            console.warn('缺少必要的路由参数: subtask_id 或 project_id');
            return;
        }

        const { data } = await getExtraInfoApi({
            subtask_id: subtaskId,
            project_id: projectId,
        });

        if (data) {
            projectExtData.value = data.project_ext?.ext || {};
            subtaskExtData.value = data.subtask_ext?.ext || {};
        }
    } catch (error) {
        console.error('获取扩展信息失败:', error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchExtraInfo();
});

</script>

<style scoped lang="less">
.extra-info-dialog {
  :deep(.el-dialog) {
    border-radius: 8px;
  }

  :deep(.el-dialog__header) {
    padding: 24px 24px 0 24px;

    .el-dialog__title {
      font-family: 'PingFang SC';
      font-weight: 500;
      font-size: 16px;
      line-height: 1.5;
      color: #2A2B32;
    }
  }

  :deep(.el-dialog__body) {
    padding: 8px 24px 24px 24px;
  }
}

.dialog-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-description {
  font-family: 'PingFang SC';
  font-weight: 400;
  font-size: 14px;
  line-height: 1.57;
  color: #858585;
  width: 372px;
  margin-top: -16px;
}

.info-sections {
  display: flex;
  gap: 3px;
  height: 100%;
}

.info-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background: #F7F8FB;
  border-radius: 6px;
}

.section-title {
  font-family: 'PingFang SC';
  font-weight: 500;
  font-size: 13px;
  line-height: 1.4;
  color: #2A2B32;
}

.section-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 12px 16px;
  background: #FFFFFF;
  border-radius: 6px;
  height: 512px;
  box-sizing: border-box;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #D1D5DB;
    border-radius: 3px;

    &:hover {
      background: #9CA3AF;
    }
  }
}

.task-info-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 100px;
  color: #858585;
  font-size: 14px;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  color: #858585;
  font-size: 14px;
}

.info-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
}

.info-label {
  font-family: 'PingFang SC';
  font-weight: 400;
  font-size: 12px;
  line-height: 1.33;
  color: #858585;
}

.info-value {
  font-family: 'PingFang SC';
  font-weight: 400;
  font-size: 14px;
  line-height: 1.57;
  color: #2A2B32;
}

</style>
