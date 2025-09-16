<template>
    <div class="w-full h-[calc(100%-56px)] p-6 box-border">
        <div class="flex gap-10 flex-col">
            <!-- 个人账户 -->
            <div>
                <span class="text text-3c font-pingfang font-medium text-[15px] line-height-150 leading-150 tracking-normal">个人账户</span>
                <div class="mt-6 flex items-center">
                    <Svg height="80px" width="80px" name="user-head
                    "></Svg>

                    <div class="pl-4">
                        <div class="pb-2 text-lg">
                            {{ userInfo.nickname || '-' }}
                        </div>
                        <a-tag v-for="role in userInfo.role_names" :key="role" class="role-tag">{{ role }}</a-tag>
                        <span v-if="!userInfo.role_names?.length" class="text-99">暂无角色</span>
                    </div>
                </div>
            </div>

            <!-- 账号信息  -->
            <div>
                <div class="text text-black font-medium text-base line-height-150 leading-150 tracking-normal mb-6">账号信息</div>

                <div class="px-6 py-4 bg-[#F2F2F280] rounded-3 mb-4">
                    <div class=" font-normal text-sm leading-150 tracking-normal mb-2 text-[#858585]">邮箱</div>
                    <div>
                        {{ userInfo.email || '-' }}
                    </div>
                </div>

                <div class="px-6 py-4 bg-[#F2F2F280] rounded-3 mb-4 flex items-center justify-between">
                    <div>
                        <div class=" font-normal text-sm leading-150 tracking-normal mb-2 text-[#858585]">密码</div>
                        <div>
                            ********
                        </div>

                    </div>

                    <div v-if="userInfo.can_set_password" class="py-1 px-[15px] bg-white border border-gary-100 border-solid rounded-3 cursor-pointer" style="box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.016);" @click="openChangePasswordModal = true">修改密码</div>

                </div>

                <div class="px-6 py-4 bg-[#F2F2F280] rounded-3 mb-4">
                    <div class=" font-normal text-sm leading-150 tracking-normal mb-2 text-[#858585]">所属组织</div>
                    <div>
                        <span v-if="userInfo.organize_names?.length">
                            {{ userInfo.organize_names.join('、') }}
                        </span>
                        <span v-else class="text-99">暂无组织</span>
                    </div>
                </div>

            </div>
        </div>

    </div>

    <changePassword v-model:open="openChangePasswordModal" v-if="openChangePasswordModal" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getUserInfoApi } from '@/api/user';
import changePassword from './Modals/changePassword.vue';

const openChangePasswordModal = ref(false);
const userInfo = ref({});

// 获取用户信息
const fetchUserInfo = async () => {
    try {
        const { data } = await getUserInfoApi();
        userInfo.value = data.data || {};
    } catch (error) {
        console.error('获取用户信息失败:', error);
    }
};

// 组件挂载时获取用户信息
onMounted(() => {
    fetchUserInfo();
});
</script>

<style scoped>
.role-tag{
    height: 19px;
    /* padding: 1px 6px; */
    border-radius: 3px;
    border: 0.5px solid #999999;
    line-height: 19px;
    background-color: #fff;
    font-size: 11px;
    color: #999999;

}
</style>
