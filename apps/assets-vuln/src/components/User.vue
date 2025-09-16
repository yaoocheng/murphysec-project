<template>
    <div class="flex items-center">
        <a-avatar size="small" class="mr-1">
            {{ users[0]?.slice(0, 1) }}
        </a-avatar>
        {{ users[0] }}
        <a-tooltip v-if="users?.length > 1" class="ml-1">
            <template #title>
                <div v-for="a in users" :key="a">
                    {{ a }}
                </div>
            </template>
            <span class="icon-hover hover:bg-e6">+{{ users?.length }}</span>
        </a-tooltip>
    </div>
</template>

<script setup>
defineProps(['users']);
</script>
