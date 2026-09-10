const FALLBACK_IMAGE_DETAIL = "https://placehold.co/800x400?text=No+Image";

function withFallbackDetail(imgEl, src) {
    imgEl.src = src || FALLBACK_IMAGE_DETAIL;
    imgEl.onerror = () => {
        imgEl.onerror = null;
        imgEl.src = FALLBACK_IMAGE_DETAIL;
    };
}

function getSpotIdFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get("id");
    return idParam ? Number(idParam) : null;
}

function renderError(message) {
    document.getElementById("detail-content").style.display = "none";
    const errEl = document.getElementById("detail-error");
    errEl.style.display = "block";
    errEl.querySelector("p").textContent = message;
}

function initLightbox() {
    const overlay = document.getElementById("lightbox-overlay");
    const overlayImg = document.getElementById("lightbox-image");
    const closeBtn = document.getElementById("lightbox-close");

    const open = (src, alt) => {
        overlayImg.src = src;
        overlayImg.alt = alt || "";
        overlay.hidden = false;
    };
    const close = () => {
        overlay.hidden = true;
        overlayImg.src = "";
    };

    document.getElementById("detail-content").addEventListener("click", (e) => {
        const target = e.target;
        if (target.tagName === "IMG" && (target.id === "hero-image" || target.closest("#gallery"))) {
            open(target.src, target.alt);
        }
    });

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay || e.target === closeBtn) close();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !overlay.hidden) close();
    });
}

function renderSpot(spot) {
    document.title = `${spot.name}｜${TRIP_INFO.title}`;

    document.getElementById("trip-title-link").textContent = TRIP_INFO.title;

    withFallbackDetail(document.getElementById("hero-image"), spot.thumbnail);
    document.getElementById("detail-title").textContent = `${spot.order}. ${spot.name}`;
    document.getElementById("detail-place").textContent = spot.name;
    document.getElementById("detail-date").textContent = spot.visitDate;
    document.getElementById("detail-summary").textContent = spot.memo;
    document.getElementById("detail-description").textContent = spot.description;

    const gallery = document.getElementById("gallery");
    gallery.innerHTML = "";
    const images = spot.images && spot.images.length ? spot.images : [spot.thumbnail];
    images.forEach((src) => {
        const img = document.createElement("img");
        img.alt = spot.name;
        withFallbackDetail(img, src);
        gallery.appendChild(img);
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    initLightbox();
    try {
        await loadTripData();
    } catch (e) {
        renderError("旅行データ(data.json)の読み込みに失敗しました。");
        return;
    }

    const id = getSpotIdFromQuery();
    if (id === null || Number.isNaN(id)) {
        renderError("スポットが指定されていません。地図に戻ってマーカーを選択してください。");
        return;
    }

    const spot = SPOTS.find((s) => s.id === id);
    if (!spot) {
        renderError("該当するスポットが見つかりませんでした。");
        return;
    }

    renderSpot(spot);
});
