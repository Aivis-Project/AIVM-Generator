<template>
    <footer class="footer">
        <div class="footer__content">
            <!-- Top Section -->
            <div class="footer__top">
                <!-- Social Links -->
                <div class="footer__social-links">
                    <a v-ripple href="https://x.com/aivis_project" target="_blank" class="footer__button">
                        <Icon icon="mdi:twitter" height="24px" />
                        Twitter (X)
                    </a>
                    <a v-ripple href="https://github.com/Aivis-Project" target="_blank" class="footer__button">
                        <Icon icon="mdi:github" height="24px" />
                        GitHub
                    </a>
                </div>
                <!-- Contact Button -->
                <a v-ripple href="https://forms.gle/sTsZGfX7aR8ox8Rs7" target="_blank" class="footer__button footer__button--dark">
                    <Icon icon="majesticons:mail-line" height="24px" />
                    導入のご相談・資料請求
                </a>
            </div>

            <!-- Divider -->
            <div class="footer__divider"></div>

            <!-- Bottom Section -->
            <div class="footer__bottom">
                <a v-ripple class="footer__logo" href="https://aivis-project.com" target="_blank">
                    <img src="/assets/images/aivis-project.svg" alt="logo" />
                </a>
                <div class="footer__links">
                    <a href="https://aivis-project.com/speech/" target="_blank">AivisSpeech</a>
                    <a href="https://hub.aivis-project.com/" target="_blank">AivisHub</a>
                    <a href="https://aivis-project.com/builder/" target="_blank">AivisBuilder</a>
                </div>
                <div class="footer__bottom-section">
                    <div class="footer__company-links">
                        <a href="https://jpchain.co.jp/privacy/" target="_blank">プライバシーポリシー</a>
                        <a href="https://jpchain.co.jp/" target="_blank">会社概要</a>
                    </div>
                    <div class="footer__copyright">©️ 2024 JPchain Inc.</div>
                </div>
            </div>
        </div>
    </footer>
</template>
<style lang="scss" scoped>

.footer {
    width: 100vw;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    background: rgb(var(--v-theme-background-darken-1));

    &__content {
        max-width: 1010px;
        margin: 0 auto;
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 24px;
        padding-bottom: 28px;
    }

    &__top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
    }

    &__social-links {
        display: flex;
        gap: 16px;
    }

    &__button {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        border-radius: 8px;
        font-size: 16px;
        line-height: 1.2;
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
        transition: opacity 0.2s ease;
        color: rgb(var(--v-theme-text-darken-1));
        background: rgb(var(--v-theme-background));
        border: 1px solid rgb(var(--v-theme-background-lighten-2));

        &:hover {
            opacity: 0.75;
        }
    }

    &__divider {
        height: 1px;
        background: rgb(var(--v-theme-background-lighten-2));
        margin-top: 24px;
    }

    &__bottom {
        display: flex;
        align-items: center;
        gap: 28px;
        margin-top: 28px;
    }

    &__logo {
        padding: 8px;
        border-radius: 8px;
        margin-left: -8px;

        img {
            display: block;
            height: 42px;
        }
    }

    &__links {
        display: flex;
        gap: 20px;
        font-weight: 700;
        font-size: 15px;

        a {
            color: rgb(var(--v-theme-text-darken-1));
            transition: color 0.2s;

            &:hover {
                color: rgb(var(--v-theme-primary));
            }
        }
    }

    &__bottom-section {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 16px;
        margin-left: auto;
    }

    &__company-links {
        display: flex;
        gap: 20px;
        margin-left: auto;
        font-size: 15px;

        a {
            color: rgb(var(--v-theme-text-darken-1));
            transition: color 0.2s;

            &:hover {
                color: rgb(var(--v-theme-primary));
            }
        }
    }

    &__copyright {
        color: rgb(var(--v-theme-text-darken-1));
        font-size: 15px;
    }
}

</style>