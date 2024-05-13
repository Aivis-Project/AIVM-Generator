<template>
    <div class="card">
        <div class="card__header">
            <div class="card__header-details">
                <div class="card__icon"></div>
                <div class="card__title">詳細情報</div>
            </div>
        </div>
        <div class="card__section">
            <div class="card__section-item">
                <div class="card__content">利用規約</div>
            </div>
            <div class="card__section-details">
                <div class="card__link">AivisHub 共通モデルライセンス</div>
            </div>
        </div>
        <div class="card__section">
            <div class="card__section-item">
                <div class="card__content">AIVM バージョン</div>
            </div>
            <div class="card__section-details">
                <div class="card__text">1.0</div>
            </div>
        </div>
        <div class="card__section">
            <div class="card__section-item">
                <div class="card__content">モデルバージョン</div>
            </div>
            <div class="card__section-details">
                <div class="card__text">1.0.0</div>
            </div>
        </div>
        <div class="card__section">
            <div class="card__section-item">
                <div class="card__content">モデル UUID</div>
            </div>
            <div class="card__section-details">
                <div class="card__text">769bb8f0-9e51-4058-8507-a1d21e5d70b9</div>
            </div>
        </div>
        <div class="card__section">
            <div class="card__section-item">
                <div class="card__content">話者の対応言語</div>
            </div>
            <div class="card__section-details">
                <div class="card__text">日本語</div>
            </div>
        </div>
        <div class="card__section">
            <div class="card__section-item">
                <div class="card__content">話者バージョン</div>
            </div>
            <div class="card__section-details">
                <div class="card__text">1.0.0</div>
            </div>
        </div>
        <div class="card__section">
            <div class="card__section-item">
                <div class="card__content">話者 UUID</div>
            </div>
            <div class="card__section-details">
                <div class="card__text">769bb8f0-9e51-4058-8507-a1d21e5d70b9</div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.card {
    width: 100%;
    height: 100%;
    background: #2A2E33;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid #3B3E43;
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
}

.card__header, .card__section {
    width: 100%;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
}

.card__header-details {
    padding: 4px 16px;
    display: inline-flex;
    align-items: center;
    width: 100%;
}

.card__icon {
    width: 19px;
    height: 19px;
    background: #FBEEEA;
}

.card__title {
    margin-left: 12px;
    color: #FBEEEA;
    font-size: 16px;
    font-weight: 700;
    line-height: 19.2px;
    word-wrap: break-word;
}

.card__section-item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    flex-shrink: 0;
    width: 120px;
    height: 45px;
    border-right: 1px solid #3B3E43;
    border-bottom: 1px solid #3B3E43;
    background: #363A3F;
    text-align: center;
}

.card__section-details {
    display: flex;
    align-items: center;
    height: 45px;
    padding: 0px 12px;
    border-bottom: 1px solid #3B3E43;
}

.card__section-details {
    width: 100%;
}

.card__content, .card__text, .card__link {
    display: inline-block;
    color: #D2D3D4;
    font-size: 12.5px;
    font-weight: 400;
    line-height: 15px;
    word-wrap: break-word;
    flex: 1 1 0%;
}

.card__link {
    color: #41A2EC;
    text-decoration: underline;
}

.card__text {
    color: #FBEEEA;
    line-height: 15.62px;
}
</style>