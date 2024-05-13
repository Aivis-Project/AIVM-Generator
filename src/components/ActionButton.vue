<template>
    <button v-ripple class="action-button" :disabled="disabled" :style="{ width, height }"
        :class="{
            'action-button--secondary': secondary,
            'action-button--danger': danger,
            'action-button--disabled': disabled,
        }">
        <div class="action-button__content">
            <v-progress-circular indeterminate color="text" bg-color="background-lighten-2" size="20" width="3" v-if="processing" />
            <Icon :icon="icon" width="20px" height="20px" v-else />
            <div class="action-button__text" :style="{fontSize: font_size}">
                <slot></slot>
            </div>
        </div>
    </button>
</template>
<script lang="ts" setup>

const props = defineProps({
    icon: {
        type: String,
        required: true,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    secondary: {
        type: Boolean,
        default: false,
    },
    danger: {
        type: Boolean,
        default: false,
    },
    processing: {
        type: Boolean,
        default: false,
    },
    width: {
        type: String,
        default: 'auto',
    },
    height: {
        type: String,
        default: '36px',
    },
    font_size: {
        type: String,
        default: '14px',
    },
});

</script>
<style scoped lang="scss">

.action-button {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    padding: 10px 16px;
    gap: 10px;
    background: rgb(var(--v-theme-background-lighten-1));
    border-radius: 4px;
    transition: all 0.28s cubic-bezier(.4,0,.2,1);
    overflow: hidden;
    cursor: pointer;
    user-select: none;

    &:hover {
        background: rgb(var(--v-theme-background-lighten-2));
        // タッチデバイスで hover を無効にする
        @media (hover: none) {
            background: rgb(var(--v-theme-background-lighten-1));
        }
    }

    &--secondary {
        background: rgb(var(--v-theme-secondary));
        &:hover {
            background: rgb(var(--v-theme-secondary-lighten-1));
            // タッチデバイスで hover を無効にする
            @media (hover: none) {
                background: rgb(var(--v-theme-secondary));
            }
        }
    }

    &--danger {
        background: rgb(var(--v-theme-error));
        &:hover {
            background: rgb(var(--v-theme-error-lighten-1));
            // タッチデバイスで hover を無効にする
            @media (hover: none) {
                background: rgb(var(--v-theme-error));
            }
        }
    }

    &--disabled {
        opacity: 0.6;
        cursor: default;
        pointer-events: none;
    }

    &__content {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
    }

    &__text {
        color: rgb(var(--v-theme-text));
    }
}

</style>