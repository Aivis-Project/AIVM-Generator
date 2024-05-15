<template>
    <div class="layout">
        <HeaderBar />
        <router-view v-slot="{ Component }">
            <component :is="Component" />
        </router-view>
        <FooterBar />
    </div>
</template>
<script lang="ts" setup>

import FooterBar from '@/components/FooterBar.vue';
import HeaderBar from '@/components/HeaderBar.vue';

</script>
<style lang="scss" scoped>

// レイアウト
.layout {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 74px 1fr 80px;
    height: 100%;

    // ヘッダーバー
    .header {
        grid-column: 1 / 2;
        grid-row: 1 / 2;
    }

    // メインコンテナ
    main {
        grid-column: 1 / 2;
        grid-row: 2 / 3;
    }

    // フッターバー
    .footer {
        grid-column: 1 / 2;
        grid-row: 3 / 4;
    }
}

</style>