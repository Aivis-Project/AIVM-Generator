<template>
    <header class="header">
        <router-link v-ripple class="header__logo" :to="disable_link ? '' : '/'">
            <img src="/assets/images/logo.svg" alt="logo" />
        </router-link>
    </header>
</template>
<script lang="ts" setup>

const props = defineProps({
    disable_link: {
        type: Boolean,
        default: false,
    },
});

</script>
<style lang="scss" scoped>

.header {
    display: flex;
    align-items: center;
    width: calc(100% - 40px);
    height: 100%;
    margin: 0px 20px;
    border-bottom: 1px solid rgb(var(--v-theme-background-lighten-2));

    &__logo {
        padding: 8px;
        margin: -5px;
        border-radius: 8px;

        img {
            display: block;
            height: 50px;
        }
    }
}

</style>