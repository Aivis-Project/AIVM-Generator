<template>
    <header class="header">
        <router-link v-ripple class="header__logo" :to="disable_link ? '' : '/'">
            <img src="/assets/images/logo.svg" alt="logo" />
        </router-link>
        <a class="header__github-link" href="https://github.com/Aivis-Project/AIVM-Generator" target="_blank">
            <Icon class="mr-1" icon="mdi:github" height="20px" />
            GitHub
        </a>
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

    &__github-link {
        display: flex;
        align-items: center;
        margin-left: auto;
        transition: color 0.2s;
        &:hover {
            color: rgb(var(--v-theme-primary));
        }
    }
}

</style>