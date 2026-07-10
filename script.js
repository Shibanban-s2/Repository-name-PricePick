/*
    PricePick Version 2

    プレゼン用Webアプリの試作品です。

    ・価格はサンプルデータです。
    ・アプリ内の徒歩時間は概算です。
    ・正確な徒歩時間はGoogleマップで確認します。
*/


/* ==============================
   店舗情報
============================== */

const stores = {
    sundi: {
        name: "サンディ西宮北口店",
        shortName: "サンディ",
        address: "兵庫県西宮市長田町1-22",
        latitude: 34.7508,
        longitude: 135.3607
    },

    gyomu: {
        name: "業務スーパー西宮薬師店",
        shortName: "業務スーパー",
        address: "兵庫県西宮市薬師町3-12",
        latitude: 34.7568,
        longitude: 135.3658
    },

    ok: {
        name: "オーケー西宮北口店",
        shortName: "オーケー",
        address: "兵庫県西宮市芦原町11-1",
        latitude: 34.7429,
        longitude: 135.3545
    },

    life: {
        name: "ライフ西宮北口店",
        shortName: "ライフ",
        address: "兵庫県西宮市芦原町8-10",
        latitude: 34.7414,
        longitude: 135.3538
    },

    coop: {
        name: "コープ北口食彩館",
        shortName: "コープ",
        address: "兵庫県西宮市北口町1-2",
        latitude: 34.7474,
        longitude: 135.3583
    }
};


/* ==============================
   商品価格
============================== */

const priceData = {
    "鶏もも肉": [
        {
            storeId: "sundi",
            price: 78,
            unit: "円 / 100g"
        },
        {
            storeId: "gyomu",
            price: 82,
            unit: "円 / 100g"
        },
        {
            storeId: "ok",
            price: 88,
            unit: "円 / 100g"
        },
        {
            storeId: "life",
            price: 95,
            unit: "円 / 100g"
        },
        {
            storeId: "coop",
            price: 108,
            unit: "円 / 100g"
        }
    ],

    "卵": [
        {
            storeId: "gyomu",
            price: 168,
            unit: "円 / 10個"
        },
        {
            storeId: "sundi",
            price: 178,
            unit: "円 / 10個"
        },
        {
            storeId: "ok",
            price: 185,
            unit: "円 / 10個"
        },
        {
            storeId: "life",
            price: 198,
            unit: "円 / 10個"
        },
        {
            storeId: "coop",
            price: 218,
            unit: "円 / 10個"
        }
    ],

    "牛乳": [
        {
            storeId: "ok",
            price: 168,
            unit: "円 / 1L"
        },
        {
            storeId: "sundi",
            price: 178,
            unit: "円 / 1L"
        },
        {
            storeId: "gyomu",
            price: 182,
            unit: "円 / 1L"
        },
        {
            storeId: "life",
            price: 198,
            unit: "円 / 1L"
        },
        {
            storeId: "coop",
            price: 208,
            unit: "円 / 1L"
        }
    ],

    "豆腐": [
        {
            storeId: "gyomu",
            price: 39,
            unit: "円 / 1パック"
        },
        {
            storeId: "sundi",
            price: 45,
            unit: "円 / 1パック"
        },
        {
            storeId: "ok",
            price: 49,
            unit: "円 / 1パック"
        },
        {
            storeId: "life",
            price: 58,
            unit: "円 / 1パック"
        },
        {
            storeId: "coop",
            price: 68,
            unit: "円 / 1パック"
        }
    ],

    "食パン": [
        {
            storeId: "sundi",
            price: 98,
            unit: "円 / 1袋"
        },
        {
            storeId: "gyomu",
            price: 108,
            unit: "円 / 1袋"
        },
        {
            storeId: "ok",
            price: 118,
            unit: "円 / 1袋"
        },
        {
            storeId: "life",
            price: 128,
            unit: "円 / 1袋"
        },
        {
            storeId: "coop",
            price: 138,
            unit: "円 / 1袋"
        }
    ]
};


/* ==============================
   商品名の表記ゆれ
============================== */

const productAliases = {
    "鶏もも肉": [
        "鶏もも肉",
        "とりもも肉",
        "とりもも",
        "鳥もも肉",
        "鶏肉",
        "チキン"
    ],

    "卵": [
        "卵",
        "たまご",
        "玉子",
        "タマゴ"
    ],

    "牛乳": [
        "牛乳",
        "ぎゅうにゅう",
        "ミルク"
    ],

    "豆腐": [
        "豆腐",
        "とうふ",
        "トウフ"
    ],

    "食パン": [
        "食パン",
        "しょくぱん",
        "パン"
    ]
};


/* ==============================
   現在の状態
============================== */

let currentProduct = "";

let currentPosition = null;


/* ==============================
   HTML要素
============================== */

const homeScreen =
    document.getElementById("home-screen");

const detailScreen =
    document.getElementById("detail-screen");

const bottomNavigation =
    document.getElementById("bottom-navigation");

const productInput =
    document.getElementById("product-input");

const clearButton =
    document.getElementById("clear-button");

const suggestions =
    document.getElementById("suggestions");

const popularSection =
    document.getElementById("popular-section");

const rankingSection =
    document.getElementById("ranking-section");

const rankingResult =
    document.getElementById("ranking-result");

const locationStatus =
    document.getElementById("location-status");


/* ==============================
   入力中の候補表示
============================== */

productInput.addEventListener(
    "input",
    function () {
        const keyword =
            normalizeText(productInput.value);

        clearButton.classList.toggle(
            "hidden",
            productInput.value.length === 0
        );

        if (keyword === "") {
            hideSuggestions();
            return;
        }

        const matchedProducts =
            Object.keys(priceData).filter(
                function (productName) {
                    return productAliases[
                        productName
                    ].some(
                        function (alias) {
                            return normalizeText(alias)
                                .includes(keyword);
                        }
                    );
                }
            );

        if (matchedProducts.length === 0) {
            suggestions.innerHTML = `
                <div class="suggestion-empty">
                    該当する商品がありません
                </div>
            `;

            suggestions.classList.remove("hidden");

            return;
        }

        suggestions.innerHTML =
            matchedProducts
                .map(
                    function (productName) {
                        return `
                            <button
                                type="button"
                                class="suggestion-item"
                                onclick="selectProduct('${productName}')"
                            >
                                <span>${productName}</span>
                                <span class="suggestion-arrow">›</span>
                            </button>
                        `;
                    }
                )
                .join("");

        suggestions.classList.remove("hidden");
    }
);


/* Enterキーで検索 */

productInput.addEventListener(
    "keydown",
    function (event) {
        if (event.key === "Enter") {
            event.preventDefault();

            searchProduct();
        }
    }
);


/* 検索欄以外を押すと候補を閉じる */

document.addEventListener(
    "click",
    function (event) {
        const searchSection =
            document.querySelector(".search-section");

        if (!searchSection.contains(event.target)) {
            hideSuggestions();
        }
    }
);


/* ==============================
   商品入力
============================== */

function selectProduct(productName) {
    productInput.value = productName;

    clearButton.classList.remove("hidden");

    hideSuggestions();
}


function quickSearch(productName) {
    productInput.value = productName;

    clearButton.classList.remove("hidden");

    searchProduct();
}


function clearSearch() {
    productInput.value = "";

    clearButton.classList.add("hidden");

    hideSuggestions();

    productInput.focus();
}


/* ==============================
   商品検索
============================== */

function searchProduct() {
    const inputValue =
        productInput.value.trim();

    const resolvedProduct =
        findProductName(inputValue);

    hideSuggestions();

    popularSection.classList.add("hidden");

    rankingSection.classList.remove("hidden");

    if (!resolvedProduct) {
        rankingResult.innerHTML = `
            <div class="message-card">

                「${escapeHtml(inputValue || "未入力")}」の商品は
                見つかりませんでした。

                <br><br>

                現在は、鶏もも肉・卵・牛乳・豆腐・食パンを
                検索できます。

            </div>
        `;

        return;
    }

    currentProduct = resolvedProduct;

    productInput.value = resolvedProduct;

    renderRanking();
}


/* ==============================
   ランキング
============================== */

function renderRanking() {
    const rankingItems =
        priceData[currentProduct];

    let html = `
        <div class="ranking-header">

            <div class="ranking-title-row">

                <div>
                    <p class="section-label">
                        LOWEST PRICE
                    </p>

                    <h3>
                        ${currentProduct}の安い順
                    </h3>
                </div>

                <span class="ranking-count">
                    ${rankingItems.length}店舗
                </span>

            </div>

            <p class="ranking-description">
                店舗を押すと、住所や徒歩ルートを確認できます
            </p>

        </div>
    `;

    rankingItems.forEach(
        function (item, index) {
            const store =
                stores[item.storeId];

            const rank =
                getRankLabel(index);

            const walkingText =
                getWalkingText(store);

            html += `
                <button
                    type="button"
                    class="ranking-card"
                    onclick="showStoreDetail(${index})"
                >

                    <span class="rank-number">
                        ${rank}
                    </span>

                    <span class="ranking-store">

                        <strong>
                            ${store.shortName}
                        </strong>

                        <small>
                            ${walkingText}
                        </small>

                    </span>

                    <span class="ranking-price">

                        ${item.price}

                        <small>
                            ${item.unit}
                        </small>

                    </span>

                    <span class="ranking-arrow">
                        ›
                    </span>

                </button>
            `;
        }
    );

    rankingResult.innerHTML = html;
}


/* ==============================
   店舗詳細
============================== */

function showStoreDetail(index) {
    const item =
        priceData[currentProduct][index];

    const store =
        stores[item.storeId];

    const badge =
        index === 0
            ? "本日の最安値"
            : `${index + 1}位`;

    const walkingText =
        getWalkingText(store);

    const walkingNote =
        currentPosition
            ? "直線距離を基にした概算時間です"
            : "現在地を取得すると概算時間を表示します";

    const mapUrl =
        createGoogleMapsUrl(store);

    const storeDetail =
        document.getElementById("store-detail");

    storeDetail.innerHTML = `
        <article class="store-hero-card">

            <div class="detail-badge">
                ${badge}
            </div>

            <h2>
                ${store.name}
            </h2>

            <p class="detail-product">
                ${currentProduct}
            </p>

            <div class="detail-price">

                ${item.price}

                <span>
                    ${item.unit}
                </span>

            </div>


            <div class="detail-list">

                <div class="detail-row">

                    <span class="detail-icon">
                        🚶
                    </span>

                    <div class="detail-content">

                        <span>
                            現在地から
                        </span>

                        <strong>
                            ${walkingText}
                        </strong>

                        <small>
                            ${walkingNote}
                        </small>

                    </div>

                </div>


                <div class="detail-row">

                    <span class="detail-icon">
                        📍
                    </span>

                    <div class="detail-content">

                        <span>
                            住所
                        </span>

                        <strong>
                            ${store.address}
                        </strong>

                    </div>

                </div>


                <div class="detail-row">

                    <span class="detail-icon">
                        🕒
                    </span>

                    <div class="detail-content">

                        <span>
                            価格更新
                        </span>

                        <strong>
                            2026年7月10日
                        </strong>

                    </div>

                </div>

            </div>


            <a
                class="google-map-button"
                href="${mapUrl}"
                target="_blank"
                rel="noopener noreferrer"
            >
                Googleマップで徒歩ルートを見る
                <span>↗</span>
            </a>


            <p class="sample-warning">
                ※表示価格はプレゼンテーション用の
                サンプルデータです。正確な徒歩時間は
                Googleマップで確認してください。
            </p>

        </article>
    `;

    homeScreen.classList.add("hidden");

    detailScreen.classList.remove("hidden");

    bottomNavigation.classList.add("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* ==============================
   画面移動
============================== */

function showRanking() {
    detailScreen.classList.add("hidden");

    homeScreen.classList.remove("hidden");

    bottomNavigation.classList.remove("hidden");

    rankingSection.classList.remove("hidden");

    popularSection.classList.add("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function showHome() {
    detailScreen.classList.add("hidden");

    homeScreen.classList.remove("hidden");

    bottomNavigation.classList.remove("hidden");

    popularSection.classList.remove("hidden");

    rankingSection.classList.add("hidden");

    productInput.value = "";

    clearButton.classList.add("hidden");

    hideSuggestions();

    setActiveNavigation(0);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function focusSearch() {
    detailScreen.classList.add("hidden");

    homeScreen.classList.remove("hidden");

    bottomNavigation.classList.remove("hidden");

    setActiveNavigation(1);

    productInput.focus();

    productInput.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


function showPrototypeMessage() {
    window.alert(
        "この機能は、今後追加予定のプロトタイプ機能です。"
    );
}


/* 下部ナビの選択表示 */

function setActiveNavigation(index) {
    const navigationItems =
        document.querySelectorAll(".nav-item");

    navigationItems.forEach(
        function (item, itemIndex) {
            item.classList.toggle(
                "active",
                itemIndex === index
            );
        }
    );
}


/* ==============================
   現在地取得
============================== */

function getCurrentLocation() {
    if (!navigator.geolocation) {
        locationStatus.textContent =
            "位置情報に対応していません";

        return;
    }

    locationStatus.textContent =
        "現在地を取得しています…";

    navigator.geolocation.getCurrentPosition(
        function (position) {
            currentPosition = {
                latitude:
                    position.coords.latitude,

                longitude:
                    position.coords.longitude
            };

            locationStatus.textContent =
                "現在地を取得しました";

            if (
                currentProduct &&
                !rankingSection.classList.contains("hidden")
            ) {
                renderRanking();
            }
        },

        function (error) {
            if (error.code === 1) {
                locationStatus.textContent =
                    "位置情報が許可されていません";
            } else if (error.code === 2) {
                locationStatus.textContent =
                    "現在地を特定できません";
            } else if (error.code === 3) {
                locationStatus.textContent =
                    "位置情報の取得がタイムアウトしました";
            } else {
                locationStatus.textContent =
                    "現在地を取得できませんでした";
            }
        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
        }
    );
}


/* ==============================
   徒歩時間の概算
============================== */

function getWalkingText(store) {
    if (!currentPosition) {
        return "現在地を取得すると表示";
    }

    const straightDistance =
        calculateDistanceKm(
            currentPosition.latitude,
            currentPosition.longitude,
            store.latitude,
            store.longitude
        );

    /*
        直線距離を1.25倍して道路距離を概算し、
        時速4.8kmで歩くと仮定しています。
    */

    const estimatedRoadDistance =
        straightDistance * 1.25;

    const walkingMinutes =
        Math.max(
            1,
            Math.round(
                estimatedRoadDistance / 4.8 * 60
            )
        );

    return `徒歩 約${walkingMinutes}分`;
}


/* 緯度・経度から距離を求める */

function calculateDistanceKm(
    latitude1,
    longitude1,
    latitude2,
    longitude2
) {
    const earthRadius = 6371;

    const latitudeDifference =
        toRadians(latitude2 - latitude1);

    const longitudeDifference =
        toRadians(longitude2 - longitude1);

    const a =
        Math.sin(latitudeDifference / 2) ** 2 +
        Math.cos(toRadians(latitude1)) *
        Math.cos(toRadians(latitude2)) *
        Math.sin(longitudeDifference / 2) ** 2;

    const c =
        2 * Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return earthRadius * c;
}


function toRadians(degrees) {
    return degrees * Math.PI / 180;
}


/* ==============================
   Googleマップ
============================== */

function createGoogleMapsUrl(store) {
    const destination =
        encodeURIComponent(
            `${store.name} ${store.address}`
        );

    let url =
        "https://www.google.com/maps/dir/?api=1" +
        `&destination=${destination}` +
        "&travelmode=walking";

    if (currentPosition) {
        const origin =
            `${currentPosition.latitude},` +
            `${currentPosition.longitude}`;

        url +=
            `&origin=${encodeURIComponent(origin)}`;
    }

    return url;
}


/* ==============================
   商品名の判定
============================== */

function findProductName(inputValue) {
    const normalizedInput =
        normalizeText(inputValue);

    if (normalizedInput === "") {
        return null;
    }

    return (
        Object.keys(productAliases).find(
            function (productName) {
                return productAliases[
                    productName
                ].some(
                    function (alias) {
                        return normalizeText(alias) ===
                            normalizedInput;
                    }
                );
            }
        ) || null
    );
}


function normalizeText(text) {
    return text
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "");
}


/* ==============================
   補助機能
============================== */

function getRankLabel(index) {
    if (index === 0) {
        return "🥇";
    }

    if (index === 1) {
        return "🥈";
    }

    if (index === 2) {
        return "🥉";
    }

    return `${index + 1}位`;
}


function hideSuggestions() {
    suggestions.innerHTML = "";

    suggestions.classList.add("hidden");
}


function escapeHtml(text) {
    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}