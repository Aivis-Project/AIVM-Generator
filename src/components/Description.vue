<template>
    <p class="description">
        <slot></slot>
    </p>
</template>
<style lang="scss" scoped>

.description {
    display: block;
    width: 100%;
    color: rgb(var(--v-theme-text-darken-1));
    font-size: 13.5px;
    font-weight: 500;
    line-height: 1.65;
}

</style>