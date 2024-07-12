<template>
    <footer class="footer">
        <a v-ripple class="footer__logo" href="https://aivis-project.com" target="_blank">
            <img src="/assets/images/aivis-project.svg" alt="logo" />
        </a>
        <div class="d-flex text-text-darken-1 align-center ml-7 font-weight-bold" style="gap: 20px;">
            <a href="https://aivis-project.com/speech/" target="_blank">AivisSpeech</a>
            <a href="https://aivis-project.com/builder/" target="_blank">AivisBuilder</a>
        </div>
        <a class="ml-auto" href="https://jpchain.co.jp/" target="_blank">運営会社</a>
    </footer>
</template>
<style lang="scss" scoped>

.footer {
    display: flex;
    align-items: center;
    width: calc(100% - 40px);
    height: 100%;
    margin: 0px 20px;
    border-top: 1px solid rgb(var(--v-theme-background-lighten-2));

    &__logo {
        padding: 8px;
        margin: -5px;
        border-radius: 8px;

        img {
            display: block;
            height: 42px;
        }
    }

    a {
        transition: color 0.2s;
        &:hover {
            color: rgb(var(--v-theme-primary));
        }
    }
}

</style>