<template>
    <footer class="footer">
        <div class="footer__content">
            <!-- Top Section -->
            <div class="footer__top">
                <!-- Social Links -->
                <div class="footer__social-links">
                    <a v-ripple href="https://x.com/aivis_project" target="_blank" class="footer__button">
                        <Icon icon="mdi:twitter" width="21px" height="21px" />
                        Twitter (X)
                    </a>
                    <a v-ripple href="https://github.com/Aivis-Project" target="_blank" class="footer__button">
                        <Icon icon="mdi:github" width="21px" height="21px" />
                        GitHub
                    </a>
                    <a v-ripple href="https://note.com/aivis_project/" target="_blank" class="footer__button">
                        <Icon icon="material-symbols:note-outline" width="21px" height="21px" />
                        公式 note
                    </a>
                </div>
                <!-- Contact Button -->
                <a v-ripple href="https://forms.gle/sTsZGfX7aR8ox8Rs7" target="_blank" class="footer__button footer__button--dark">
                    <Icon icon="majesticons:mail-line" width="21px" height="21px" />
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
                    <a href="https://aivis-project.com/cloud-api/" target="_blank">Aivis Cloud API</a>
                    <a href="https://aivis-project.com/builder/" target="_blank">AivisBuilder</a>
                </div>
                <div class="footer__bottom-section">
                    <div class="footer__company-links">
                        <a href="https://hub.aivis-project.com/terms-of-service/" target="_blank">利用規約</a>
                        <a href="https://hub.aivis-project.com/privacy-policy/" target="_blank">プライバシーポリシー</a>
                        <a href="https://walker-s.co.jp/" target="_blank">会社概要</a>
                    </div>
                    <div class="footer__copyright">© 2024-{{ new Date().getFullYear() }} Walkers Inc.</div>
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

        @include tablet-smartphone {
            padding-left: 16px;
            padding-right: 16px;
        }
    }

    &__top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;

        @include tablet-smartphone {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
        }
    }

    &__social-links {
        display: flex;
        gap: 16px;

        @include tablet-smartphone {
            flex-wrap: wrap;
            gap: 12px;
        }
    }

    &__button {
        display: flex;
        align-items: center;
        height: 46px;
        gap: 8px;
        padding: 0px 16px;
        border-radius: 8px;
        font-size: 15px;
        line-height: 1.2;
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
        transition: background-color 0.2s ease;
        color: rgb(var(--v-theme-text-darken-1));
        background: rgb(var(--v-theme-background));
        border: 1px solid rgb(var(--v-theme-background-lighten-2));

        &:hover {
            background-color: rgb(var(--v-theme-background-lighten-1));
        }

        @include tablet-smartphone {
            height: 40px;
            font-size: 14px;
            padding: 0px 12px;
        }

        &--dark {
            @include tablet-smartphone {
                width: 100%;
                justify-content: center;
            }
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
        gap: 20px;
        margin-top: 28px;

        @include tablet-smartphone {
            flex-direction: column;
            align-items: flex-start;
            margin-top: 20px;
            gap: 16px;
        }

        @include smartphone {
            gap: 20px;
        }
    }

    &__logo {
        padding: 8px;
        border-radius: 8px;
        margin-left: -8px;
        flex-shrink: 0;

        img {
            display: block;
            height: 42px;
        }
    }

    &__links {
        display: flex;
        flex-wrap: wrap;
        gap: 8px 16px;
        font-weight: 700;
        font-size: 15px;

        @include smartphone {
            gap: 8px 16px;
            font-size: 14px;
        }

        a {
            color: rgb(var(--v-theme-text-darken-1));
            transition: color 0.2s;
            flex-shrink: 0;

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

        @include tablet-smartphone {
            width: 100%;
            align-items: flex-start;
            margin-left: 0;
        }

        @include smartphone {
            gap: 20px;
        }
    }

    &__company-links {
        display: flex;
        flex-wrap: wrap;
        gap: 8px 16px;
        margin-left: auto;
        font-size: 15px;

        @include tablet-smartphone {
            margin-left: 0;
        }

        @include smartphone {
            gap: 8px 16px;
            font-size: 13px;
        }

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
        font-size: 14.5px;

        @include smartphone {
            font-size: 12.5px;
        }
    }
}

</style>