<template>
    <div class="heading-2">
        <div class="heading-2__text mr-auto" :style="no_letter_spacing ? 'letter-spacing: 0;' : ''">
            <slot></slot>
        </div>
        <slot name="action-button"></slot>
    </div>
</template>
<script lang="ts" setup>

const props = defineProps({
    no_letter_spacing: {
        type: Boolean,
        default: false,
    },
});

</script>
<style lang="scss" scoped>

.heading-2 {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 12px;
    width: 100%;
    color: rgb(var(--v-theme-text));

    &__text {
        font-size: 20px;
        font-weight: 700;
        word-wrap: break-word;
        font-feature-settings: "palt" 1;  // 文字詰め
        letter-spacing: 0.04em;  // 字間を少し空ける
    }
}

</style>