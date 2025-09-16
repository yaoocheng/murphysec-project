<template>
    <div style="position: relative;">
        <a-textarea
            v-model:value="modelValue"
            :maxlength="maxlength"
            :rows="rows"
            min-rows="rows"
            :placeholder="placeholder"
            :disabled="disabled"
            class="base-textarea"
        />
        <span v-if="maxlength"
              style="
                                    position: absolute;
                                    right: 8px;
                                    bottom: 4px;
                                    font-size: 14px;
                                    color: #999;
                                    background: #fff;
                                    z-index: 1;
                                    pointer-events: none;
                                "
        >
            {{ (modelValue || '').length }} / {{ maxlength }}
        </span>
    </div>
</template>

<script setup>
const {
    maxlength, rows, placeholder, disabled,
} = defineProps(['maxlength', 'rows', 'placeholder', 'disabled']);
const modelValue = defineModel();

</script>

<style scoped>
.base-textarea {
    &::placeholder {
        color: #999999;
    }
    color: #3c3c3c;

    box-shadow: none;
}
</style>
