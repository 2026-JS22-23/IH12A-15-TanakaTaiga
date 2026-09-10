// data.json を読み込み、TRIP_INFO / SPOTS としてグローバルに公開する
let TRIP_INFO = null;
let SPOTS = [];

async function loadTripData() {
    const res = await fetch("./data.json");
    if (!res.ok) {
        throw new Error(`旅行データの読み込みに失敗しました (status: ${res.status})`);
    }
    const data = await res.json();
    TRIP_INFO = data.tripInfo;
    SPOTS = data.spots || [];
}
