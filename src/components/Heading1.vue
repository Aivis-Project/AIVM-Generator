<template>
    <div class="heading-1">
        <a v-ripple class="cursor-pointer" @click="$router.back()" v-if="back === true">
            <Icon icon="fluent:chevron-left-20-filled" width="36px" height="36px" style="display: block;" />
        </a>
        <div class="heading-1__text mr-auto" :style="no_letter_spacing ? 'letter-spacing: 0;' : ''">
            <slot></slot>
        </div>
        <slot name="action-button"></slot>
    </div>
</template>
<script lang="ts" setup>

const props = defineProps({
    back: {
        type: Boolean,
        default: false,
    },
    no_letter_spacing: {
        type: Boolean,
        default: false,
    },
});

</script>
<style lang="scss" scoped>

.heading-1 {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 12px;
    width: 100%;

    a {
        color: rgb(var(--v-theme-text));
        margin: 0px -10px;
        border-radius: 50%;
    }

    &__text {
        color: rgb(var(--v-theme-text));
        font-size: 24px;
        font-weight: 700;
        word-wrap: break-word;
        font-feature-settings: "palt" 1;  // 文字詰め
        letter-spacing: 0.04em;  // 字間を少し空ける
    }
}

</style>