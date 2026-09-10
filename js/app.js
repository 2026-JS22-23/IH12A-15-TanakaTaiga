const FALLBACK_IMAGE = "https://placehold.co/400x300?text=No+Image";

function withFallback(imgEl, src) {
    imgEl.src = src || FALLBACK_IMAGE;
    imgEl.onerror = () => {
        imgEl.onerror = null;
        imgEl.src = FALLBACK_IMAGE;
    };
}

function orderedSpots() {
    return [...SPOTS].sort((a, b) => a.order - b.order);
}

function renderTripHeader() {
    const titleEl = document.getElementById("trip-title");
    const periodEl = document.getElementById("trip-period");
    if (titleEl) titleEl.textContent = TRIP_INFO.title;
    if (periodEl) periodEl.textContent = `${TRIP_INFO.period}｜訪問スポット ${SPOTS.length}件`;
}

function renderSpotList(onCardClick) {
    const list = document.getElementById("trip-list");
    if (!list) return;
    list.innerHTML = "";
    orderedSpots().forEach((spot) => {
        const card = document.createElement("div");
        card.className = "trip-card";
        card.innerHTML = `
            <img alt="${spot.name}" />
            <div class="trip-card-info">
                <h3>${spot.order}. ${spot.name}</h3>
                <p>${spot.visitDate}</p>
            </div>
        `;
        withFallback(card.querySelector("img"), spot.thumbnail);
        card.addEventListener("click", () => onCardClick(spot));
        list.appendChild(card);
    });
}

function buildInfoWindowContent(spot) {
    const wrapper = document.createElement("div");
    wrapper.className = "info-window";
    wrapper.innerHTML = `
        <img alt="${spot.name}" />
        <div class="info-body">
            <h3>${spot.order}. ${spot.name}</h3>
            <p class="info-date">${spot.visitDate}</p>
            <p class="info-summary">${spot.memo}</p>
            <button class="btn" type="button">詳細を見る</button>
        </div>
    `;
    withFallback(wrapper.querySelector("img"), spot.thumbnail);
    wrapper.querySelector("button").addEventListener("click", () => {
        window.location.href = `detail.html?id=${spot.id}`;
    });
    return wrapper;
}

function showMapMessage(message) {
    const mapEl = document.getElementById("map");
    if (mapEl) mapEl.style.display = "none";
    const msgEl = document.getElementById("map-message");
    if (msgEl) {
        msgEl.textContent = message;
        msgEl.style.display = "flex";
    }
}

function initMap() {
    const mapEl = document.getElementById("map");
    let map;
    try {
        map = new google.maps.Map(mapEl, {
            center: { lat: 26.4, lng: 127.9 },
            zoom: 9,
        });
    } catch (e) {
        showMapMessage("地図の読み込みに失敗しました。しばらくしてから再度お試しください。");
        return;
    }

    const bounds = new google.maps.LatLngBounds();
    let activeInfoWindow = null;
    const spots = orderedSpots();
    const path = [];

    spots.forEach((spot) => {
        const position = { lat: spot.lat, lng: spot.lng };
        const marker = new google.maps.Marker({
            position,
            map,
            title: `${spot.order}. ${spot.name}`,
            label: String(spot.order),
        });

        const infoWindow = new google.maps.InfoWindow({
            content: buildInfoWindowContent(spot),
        });

        marker.addListener("click", () => {
            if (activeInfoWindow) activeInfoWindow.close();
            infoWindow.open({ anchor: marker, map });
            activeInfoWindow = infoWindow;
        });

        spot._marker = marker;
        spot._infoWindow = infoWindow;

        path.push(position);
        bounds.extend(position);
    });

    if (path.length > 1) {
        new google.maps.Polyline({
            path,
            map,
            strokeColor: "#1a73e8",
            strokeOpacity: 0.8,
            strokeWeight: 3,
        });
    }

    if (spots.length > 0) {
        map.fitBounds(bounds);
    }

    renderSpotList((spot) => {
        map.panTo({ lat: spot.lat, lng: spot.lng });
        map.setZoom(13);
        if (activeInfoWindow) activeInfoWindow.close();
        spot._infoWindow.open({ anchor: spot._marker, map });
        activeInfoWindow = spot._infoWindow;
    });
}

// Google Maps API のコールバックとしてグローバルに公開
window.initMap = initMap;

document.addEventListener("DOMContentLoaded", async () => {
    try {
        await loadTripData();
    } catch (e) {
        showMapMessage("旅行データ(data.json)の読み込みに失敗しました。");
        return;
    }

    renderTripHeader();
    renderSpotList(() => {});

    if (typeof GOOGLE_MAPS_API_KEY === "undefined" || !GOOGLE_MAPS_API_KEY) {
        showMapMessage("Google Maps APIキーが設定されていません。js/config.js に GOOGLE_MAPS_API_KEY を設定してください。");
        return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(GOOGLE_MAPS_API_KEY)}&callback=initMap`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
        showMapMessage("地図の読み込みに失敗しました。ネットワーク接続やAPIキーをご確認ください。");
    };
    document.head.appendChild(script);
});
