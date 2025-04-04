<template>
    <div class="layout">
        <HeaderBar />
        <router-view v-slot="{ Component }">
            <component :is="Component" />
        </router-view>
    </div>
    <FooterBar />
</template>
<script lang="ts" setup>

import FooterBar from '@/components/FooterBar.vue';
import HeaderBar from '@/components/HeaderBar.vue';

</script>
<style lang="scss" scoped>

// レイアウト
.layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: 74px 1fr;
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
}

</style>