const DB_NAME = "launch-gogogo-pwa";
const DB_VERSION = 1;
const STORE_NAMES = {
  coworkers: "coworkers",
  stores: "stores",
  transactions: "transactions"
};

const PAYMENT_LABELS = {
  prepaidBalance: "儲值金扣款",
  cashToday: "當天現金付款",
  unpaid: "尚未付款"
};
const SAMPLE_DATA_PREFIX = "sample-demo";

const PLAYER_CHARACTERS = [
  { id: "runner", name: "效率上班族", tone: "快步", color: "#6ee7b7", hair: "#334155", detail: "#0f766e" },
  { id: "foodie", name: "開心吃貨", tone: "雀躍", color: "#fbbf24", hair: "#78350f", detail: "#f97316" },
  { id: "thinker", name: "冷靜工程師", tone: "淡定", color: "#93c5fd", hair: "#1e293b", detail: "#2563eb" }
];

const RESTAURANT_TYPES = [
  { id: "bento", name: "便當店", counter: "BENTO", accent: "#f97316", prop: "便當" },
  { id: "drink", name: "飲料店", counter: "TEA", accent: "#14b8a6", prop: "飲料" },
  { id: "noodle", name: "麵店", counter: "NOODLE", accent: "#ef4444", prop: "熱麵" },
  { id: "fastFood", name: "速食店", counter: "FAST", accent: "#eab308", prop: "托盤" },
  { id: "cafe", name: "咖啡輕食", counter: "CAFE", accent: "#a78bfa", prop: "咖啡" }
];

const THEME_STORAGE_KEY = "launch-gogogo-theme";
const THEATER_STYLE_STORAGE_KEY = "launch-gogogo-theater-style";
const THEATER_ASSET_CACHE_NAME = "launch-gogogo-theater-assets-v1";
const DEFAULT_MEAL_NAME = "未指定餐點";
const PLAYER_GENDERS = [
  { id: "female", icon: "./assets/theater/anime/characters/runner-female.png", label: "女生" },
  { id: "male", icon: "./assets/theater/anime/characters/runner-male.png", label: "男生" }
];
const THEMES = [
  { id: "default", name: "便當綠", colors: ["#1f6f5b", "#d66b3d", "#f6f4ee"] },
  { id: "dark-purple", name: "暗夜紫", colors: ["#7c3aed", "#f59e0b", "#0d0d1a"] },
  { id: "aurora-blue", name: "極光藍", colors: ["#0ea5e9", "#06d6a0", "#050d1a"] },
  { id: "emerald", name: "翡翠綠", colors: ["#16a34a", "#fbbf24", "#080f0a"] },
  { id: "flame", name: "赤焰", colors: ["#ea580c", "#fde047", "#120a05"] },
  { id: "neon-pink", name: "霓虹粉", colors: ["#db2777", "#a855f7", "#12040f"] },
  { id: "light", name: "純白光", colors: ["#7c3aed", "#d97706", "#f1f5f9"] },
  { id: "wabi", name: "日系簡約", colors: ["#9b2335", "#7a6a4a", "#f5f0e8"] },
  { id: "material", name: "Material", colors: ["#d0bcff", "#efb8c8", "#1c1b1f"] },
  { id: "cyberpunk", name: "賽博龐克", colors: ["#00ff9f", "#ff2d78", "#050508"] },
  { id: "pixel", name: "像素", colors: ["#39ff14", "#ffff00", "#0a0a0a"] },
  { id: "anime", name: "動漫", colors: ["#ff6b9d", "#7ec8e3", "#fff5f8"] },
  { id: "gothic", name: "哥德蘿莉", colors: ["#c41e3a", "#d4af37", "#0d0009"] },
  { id: "github", name: "GitHub", colors: ["#1f6feb", "#2da44e", "#0d1117"] }
];
const THEATER_STYLES = [
  {
    id: "miniature",
    name: "迷你幾何風",
    status: "已完成",
    available: true,
    colors: ["#f97316", "#6ee7b7", "#1c1c1e"],
    description: "輕量 CSS 小劇場，適合想保留簡潔記帳畫面的使用情境。"
  },
  {
    id: "anime",
    name: "日本動漫風格",
    status: "已完成",
    available: true,
    colors: ["#ff8ab3", "#7ec8ff", "#fff6fb"],
    description: "明亮線條、柔和賽璐璐光影、熱血少年漫畫感角色與午餐店場景。"
  },
  {
    id: "cyberpunk",
    name: "科技感 / Cyberpunk",
    status: "已完成",
    available: true,
    colors: ["#00ff9f", "#ff2d78", "#050508"],
    description: "霓虹邊光、全息面板、深色金屬表面與 sci-fi UI 狀態感。"
  },
  {
    id: "gothic-lolita",
    name: "歌德蘿莉",
    status: "已完成",
    available: true,
    colors: ["#c41e3a", "#d4af37", "#14000d"],
    description: "蕾絲、緞帶、酒紅天鵝絨、黑漆木與精緻茶室氛圍。"
  },
  {
    id: "pixel",
    name: "像素風格",
    status: "已完成",
    available: true,
    colors: ["#39ff14", "#ffff00", "#0a0a0a"],
    description: "低解析輪廓、有限色盤、清楚可讀的像素塊與道具。"
  },
  {
    id: "arcade",
    name: "街機風格",
    status: "已完成",
    available: true,
    colors: ["#ff005d", "#00e5ff", "#1a103d"],
    description: "投幣機台、飽和霓虹、亮面地板與高能量用餐小舞台。"
  },
  {
    id: "retro-16bit",
    name: "復古 16-bit RPG",
    status: "已完成",
    available: true,
    colors: ["#7c3f58", "#f9c22e", "#283d3b"],
    description: "16-bit 城鎮酒館語彙、溫暖木質櫃檯、緊湊可讀的 RPG 角色。"
  },
  {
    id: "storybook",
    name: "手繪童話風",
    status: "已完成",
    available: true,
    colors: ["#8bb174", "#f4d35e", "#f7ede2"],
    description: "水彩暈染、鉛筆線條、圓潤家具與溫暖繪本感場景。"
  },
  {
    id: "chibi",
    name: "Q 版 Chibi",
    status: "已完成",
    available: true,
    colors: ["#ffb3c7", "#bde0fe", "#fff1f2"],
    description: "大頭小身、圓潤表情、粉彩玩具感與可愛化午餐店。"
  },
  {
    id: "painted-fantasy",
    name: "厚塗奇幻 RPG",
    status: "已完成",
    available: true,
    colors: ["#7f5539", "#ddb892", "#2f1b45"],
    description: "厚塗筆觸、奇幻公會食堂、暖色魔法光與較重的材質感。"
  },
  {
    id: "muted-jp-life",
    name: "低飽和日系生活感",
    status: "已完成",
    available: true,
    colors: ["#9aa38f", "#d6ccc2", "#f5ebe0"],
    description: "低彩度、自然光、安靜街角午餐店與柔和生活感背景。"
  },
  {
    id: "arcade-fighter-90s",
    name: "90 年代街機格鬥感",
    status: "已完成",
    available: true,
    colors: ["#f72585", "#ffd166", "#111827"],
    description: "高反差邊光、濕地反射、戲劇化舞台構圖與粗壯 sprite 輪廓。"
  }
];

const state = {
  db: null,
  activePage: "ledger",
  coworkers: [],
  stores: [],
  transactions: [],
  deferredInstallPrompt: null,
  pendingServiceWorker: null,
  refreshingForUpdate: false,
  theme: "default",
  theaterStyle: "miniature",
  theaterAssetStatus: { miniature: "ready" },
  activeTheaterTransactionId: "",
  theaterSequence: 0,
  theaterCollapsed: false
};

const $ = (selector) => document.querySelector(selector);
const {
  calculateDerivedData,
  createBackupPayload,
  defaultMealType,
  escapeHtml,
  googleSearchUrl,
  money,
  parseMoney,
  signedMoney,
  sortStores,
  storeStats,
  todayString,
  validateBackupPayload
} = window.LaunchGoGoGoCore;
const nowIso = () => new Date().toISOString();
const uid = () => `${Date.now().toString(36)}-${crypto.getRandomValues(new Uint32Array(1))[0].toString(36)}`;

function getThemeById(themeId) {
  return THEMES.find((theme) => theme.id === themeId) || THEMES[0];
}

function getTheaterStyleById(styleId) {
  return THEATER_STYLES.find((style) => style.id === styleId) || THEATER_STYLES[0];
}

function theaterAssetStyleId() {
  return state.theaterStyle === "miniature" ? "anime" : state.theaterStyle;
}

function theaterStageImage(styleId, restaurantTypeId) {
  return `./assets/theater/${styleId}/stages/stage-${restaurantTypeId}.png`;
}

function theaterCharacterImage(styleId, characterId, gender = "female") {
  return `./assets/theater/${styleId}/characters/${characterId}-${gender}.png`;
}

function theaterStyleStageAssets(styleId) {
  return RESTAURANT_TYPES.map((type) => theaterStageImage(styleId, type.id));
}

function theaterStyleCharacterAssets(styleId) {
  return PLAYER_CHARACTERS.flatMap((character) =>
    PLAYER_GENDERS.map((gender) => theaterCharacterImage(styleId, character.id, gender.id))
  );
}

function theaterStyleAssets(styleId, assetGroup = "all") {
  if (styleId === "miniature") return [];
  const stages = theaterStyleStageAssets(styleId);
  if (assetGroup === "stages") return stages;
  return [...stages, ...theaterStyleCharacterAssets(styleId)];
}

function normalizedAssetUrl(path) {
  return new URL(path, window.location.href).href;
}

async function cachedAssetExists(cache, path) {
  return Boolean(await cache.match(normalizedAssetUrl(path)) || await cache.match(path));
}

async function isTheaterStyleDownloaded(styleId) {
  if (styleId === "miniature") return true;
  if (!("caches" in window)) return state.theaterAssetStatus[styleId] === "ready";
  const cache = await caches.open(THEATER_ASSET_CACHE_NAME);
  const assets = theaterStyleAssets(styleId);
  const matches = await Promise.all(assets.map((asset) => cachedAssetExists(cache, asset)));
  return matches.every(Boolean);
}

async function syncTheaterAssetStatus() {
  const entries = await Promise.all(THEATER_STYLES.map(async (style) => [
    style.id,
    await isTheaterStyleDownloaded(style.id) ? "ready" : "pending"
  ]));
  state.theaterAssetStatus = Object.fromEntries(entries);
  state.theaterAssetStatus.miniature = "ready";
}

function isTheaterStyleReady(styleId) {
  return styleId === "miniature" || state.theaterAssetStatus[styleId] === "ready";
}

async function downloadTheaterStyleAssets(styleId, assetGroup = "all") {
  if (styleId === "miniature") return;
  if (state.theaterAssetStatus[styleId] === "downloading") return;
  state.theaterAssetStatus[styleId] = "downloading";
  renderSettings();
  try {
    const assets = theaterStyleAssets(styleId, assetGroup);
    if ("caches" in window) {
      const cache = await caches.open(THEATER_ASSET_CACHE_NAME);
      await Promise.all(assets.map(async (asset) => {
        const response = await fetch(asset, { cache: "reload" });
        if (!response.ok) throw new Error(`${asset} 下載失敗`);
        await cache.put(normalizedAssetUrl(asset), response);
      }));
    } else {
      await Promise.all(assets.map((asset) => fetch(asset, { cache: "reload" })));
    }
    state.theaterAssetStatus[styleId] = await isTheaterStyleDownloaded(styleId) ? "ready" : "pending";
  } catch (error) {
    state.theaterAssetStatus[styleId] = "error";
    throw error;
  } finally {
    renderSettings();
  }
}

function applyTheme(themeId) {
  const theme = getThemeById(themeId);
  state.theme = theme.id;
  if (theme.id === "default") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.dataset.theme = theme.id;
  }
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme.colors[0]);
  localStorage.setItem(THEME_STORAGE_KEY, theme.id);
}

function applyTheaterStyle(styleId) {
  const style = getTheaterStyleById(styleId);
  state.theaterStyle = style.available && isTheaterStyleReady(style.id) ? style.id : THEATER_STYLES[0].id;
  if (state.theaterStyle === "miniature") {
    document.documentElement.removeAttribute("data-theater-style");
  } else {
    document.documentElement.dataset.theaterStyle = state.theaterStyle;
  }
  localStorage.setItem(THEATER_STYLE_STORAGE_KEY, state.theaterStyle);
}

function requiredLabel(text) {
  return `<span class="required-label">${text}</span>`;
}

function playerCharacterOptions(selectedId = "") {
  const selected = selectedId || PLAYER_CHARACTERS[0].id;
  return PLAYER_CHARACTERS.map((character) => `
    <option value="${character.id}" ${character.id === selected ? "selected" : ""}>${character.name}</option>
  `).join("");
}

function playerGenderOptions(selectedId = "female") {
  const selected = PLAYER_GENDERS.some((gender) => gender.id === selectedId) ? selectedId : "female";
  return `
      <div class="gender-picker" role="radiogroup" aria-label="角色性別">
        ${PLAYER_GENDERS.map((gender) => `
        <label class="gender-option" aria-label="${gender.label}">
          <input type="radio" name="playerGender" value="${gender.id}" ${gender.id === selected ? "checked" : ""}>
          <img src="${gender.icon}" alt="" aria-hidden="true">
        </label>
      `).join("")}
    </div>
  `;
}

function restaurantTypeOptions(selectedId = "") {
  const selected = selectedId || RESTAURANT_TYPES[0].id;
  return RESTAURANT_TYPES.map((type) => `
    <option value="${type.id}" ${type.id === selected ? "selected" : ""}>${type.name}</option>
  `).join("");
}

function getPlayerCharacter(id) {
  return PLAYER_CHARACTERS.find((character) => character.id === id) || PLAYER_CHARACTERS[0];
}

function getRestaurantType(id) {
  return RESTAURANT_TYPES.find((type) => type.id === id) || RESTAURANT_TYPES[0];
}

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAMES.coworkers)) {
        db.createObjectStore(STORE_NAMES.coworkers, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORE_NAMES.stores)) {
        db.createObjectStore(STORE_NAMES.stores, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORE_NAMES.transactions)) {
        db.createObjectStore(STORE_NAMES.transactions, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function txStore(name, mode = "readonly") {
  return state.db.transaction(name, mode).objectStore(name);
}

function getAll(name) {
  return new Promise((resolve, reject) => {
    const request = txStore(name).getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

function putItem(name, item) {
  return new Promise((resolve, reject) => {
    const request = txStore(name, "readwrite").put(item);
    request.onsuccess = () => resolve(item);
    request.onerror = () => reject(request.error);
  });
}

function deleteItem(name, id) {
  return new Promise((resolve, reject) => {
    const request = txStore(name, "readwrite").delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

function replaceAllData({ coworkers, stores, transactions }) {
  return new Promise((resolve, reject) => {
    const transaction = state.db.transaction(Object.values(STORE_NAMES), "readwrite");
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);

    const coworkerStore = transaction.objectStore(STORE_NAMES.coworkers);
    const storeStore = transaction.objectStore(STORE_NAMES.stores);
    const transactionStore = transaction.objectStore(STORE_NAMES.transactions);

    coworkerStore.clear();
    storeStore.clear();
    transactionStore.clear();

    coworkers.forEach((item) => coworkerStore.put(item));
    stores.forEach((item) => storeStore.put(item));
    transactions.forEach((item) => transactionStore.put(item));
  });
}

async function loadData() {
  const [coworkers, stores, transactions] = await Promise.all([
    getAll(STORE_NAMES.coworkers),
    getAll(STORE_NAMES.stores),
    getAll(STORE_NAMES.transactions)
  ]);
  state.coworkers = coworkers.sort((a, b) => a.name.localeCompare(b.name, "zh-Hant"));
  state.stores = stores.sort((a, b) => a.name.localeCompare(b.name, "zh-Hant"));
  state.transactions = transactions.sort((a, b) => `${b.date}${b.createdAt}`.localeCompare(`${a.date}${a.createdAt}`));
}

async function recalculateDerivedData() {
  const derived = calculateDerivedData(state);

  await Promise.all([
    ...derived.coworkers.map((coworker) => putItem(STORE_NAMES.coworkers, coworker)),
    ...derived.stores.map((store) => putItem(STORE_NAMES.stores, store))
  ]);
  await loadData();
}

async function refresh() {
  await loadData();
  await recalculateDerivedData();
  render();
}

function render() {
  renderCoworkerOptions();
  renderCoworkers();
  renderDailySummary();
  renderCoworkerHistory();
  renderStores("lunch");
  renderStores("dinner");
  renderSettings();
  syncSampleDataToggle();
  renderStatusTheater();
}

function renderCoworkerOptions() {
  const options = state.coworkers.map((coworker) => `<option value="${coworker.id}">${escapeHtml(coworker.name)}</option>`).join("");
  $("#historyCoworkerSelect").innerHTML = `<option value="">選擇同事</option>${options}`;
}

function renderCoworkers() {
  $("#coworkerCount").textContent = `${state.coworkers.length} 位`;
  if (!state.coworkers.length) {
    $("#coworkerList").innerHTML = `<div class="empty">先新增同事，再開始記錄儲值金與餐點。</div>`;
    return;
  }

  const groups = groupCoworkers(state.coworkers);
  $("#coworkerList").innerHTML = groups.map(({ name, coworkers }) => `
    <section class="coworker-group" aria-label="${escapeHtml(name)}">
      <div class="group-heading">
        <span>${escapeHtml(name)}</span>
        <span>${coworkers.length} 位</span>
      </div>
      ${coworkers.map(renderCoworkerItem).join("")}
    </section>
  `).join("");
}

function groupCoworkers(coworkers) {
  const map = new Map();
  coworkers.forEach((coworker) => {
    const groupName = coworker.group?.trim() || "未分組";
    if (!map.has(groupName)) map.set(groupName, []);
    map.get(groupName).push(coworker);
  });
  return Array.from(map.entries())
    .sort(([a], [b]) => {
      if (a === "未分組") return 1;
      if (b === "未分組") return -1;
      return a.localeCompare(b, "zh-Hant");
    })
    .map(([name, groupedCoworkers]) => ({ name, coworkers: groupedCoworkers }));
}

function renderCoworkerItem(coworker) {
  const className = coworker.balance >= 0 ? "positive" : "negative";
  const character = getPlayerCharacter(coworker.playerCharacter);
  return `
    <article class="item coworker-item">
      ${renderCoworkerAvatar(coworker)}
      <div class="coworker-main">
        <div class="item-title">
          <strong>${escapeHtml(coworker.name)}</strong>
          <span class="money ${className}">${signedMoney(coworker.balance)}</span>
        </div>
        <div class="muted">${coworker.balance < 0 ? "目前欠款" : "目前餘額"}</div>
        <div class="pill-row">
          <span class="pill">${escapeHtml(character.name)}</span>
        </div>
        <div class="card-actions">
          <button type="button" data-action="show-coworker-theater" data-id="${coworker.id}">小劇場</button>
          <button type="button" data-action="open-payment" data-id="${coworker.id}">收款</button>
          <button type="button" data-action="edit-coworker" data-id="${coworker.id}">編輯</button>
        </div>
      </div>
    </article>
  `;
}

function renderCoworkerAvatar(coworker) {
  if (coworker.avatarDataUrl) {
    return `<img class="avatar" src="${escapeHtml(coworker.avatarDataUrl)}" alt="${escapeHtml(coworker.name)} 頭像">`;
  }
  return `<span class="avatar avatar-fallback" aria-hidden="true">${escapeHtml((coworker.name || "?").trim().slice(0, 1).toUpperCase())}</span>`;
}

function renderDailySummary() {
  const selectedDate = $("#ledgerDate").value || todayString();
  const entries = state.transactions.filter((entry) => entry.date === selectedDate);
  const mealEntries = entries.filter((entry) => entry.type === "mealOrder");
  const total = mealEntries.reduce((sum, entry) => sum + entry.amount, 0);
  $("#dailyTotal").textContent = mealEntries.length ? `餐點合計 ${money(total)}` : "";

  $("#dailySummary").innerHTML = entries.length ? entries.map((entry) => {
    const coworker = state.coworkers.find((item) => item.id === entry.coworkerId);
    const store = state.stores.find((item) => item.id === entry.storeId);
    if (entry.type === "topup") {
      return `
        <article class="item">
          <div class="item-title">
            <strong>儲值金：${escapeHtml(coworker?.name || "已刪同事")}</strong>
            <span class="money positive">+${money(entry.amount)}</span>
          </div>
          <p class="muted">${escapeHtml(entry.note || "無備註")}</p>
          <div class="card-actions">
            <button type="button" data-action="edit-transaction" data-id="${entry.id}">編輯</button>
            <button type="button" data-action="delete-transaction" data-id="${entry.id}">刪除</button>
          </div>
        </article>
      `;
    }
    if (entry.type === "payment") {
      return `
        <article class="item">
          <div class="item-title">
            <strong>收款：${escapeHtml(coworker?.name || "已刪同事")}</strong>
            <span class="money positive">+${money(entry.amount)}</span>
          </div>
          <p class="muted">${escapeHtml(entry.note || "無備註")}</p>
          <div class="card-actions">
            <button type="button" data-action="edit-transaction" data-id="${entry.id}">編輯</button>
            <button type="button" data-action="delete-transaction" data-id="${entry.id}">刪除</button>
          </div>
        </article>
      `;
    }
    if (entry.type === "adjustment") {
      const amountDisplay = entry.amount >= 0 ? `+${money(entry.amount)}` : signedMoney(entry.amount);
      const amountClass = entry.amount >= 0 ? "positive" : "negative";
      return `
        <article class="item">
          <div class="item-title">
            <strong>餘額調整：${escapeHtml(coworker?.name || "已刪同事")}</strong>
            <span class="money ${amountClass}">${amountDisplay}</span>
          </div>
          <p class="muted">${escapeHtml(entry.note || "無備註")}</p>
          <div class="card-actions">
            <button type="button" data-action="delete-transaction" data-id="${entry.id}">刪除</button>
          </div>
        </article>
      `;
    }
    return `
      <article class="item">
        <div class="item-title">
          <strong>${entry.mealType === "lunch" ? "午餐" : "晚餐"}：${escapeHtml(coworker?.name || "已刪同事")}</strong>
          <span class="money">${money(entry.amount)}</span>
        </div>
        <div>${escapeHtml(store?.name || "已刪店家")} · ${escapeHtml(entry.mealName || DEFAULT_MEAL_NAME)}</div>
        <div class="pill-row">
          <span class="pill">${PAYMENT_LABELS[entry.paymentMethod]}</span>
          ${entry.note ? `<span class="pill">${escapeHtml(entry.note)}</span>` : ""}
        </div>
        <div class="card-actions">
          <button type="button" data-action="show-theater" data-id="${entry.id}">看動畫</button>
          <button type="button" data-action="edit-transaction" data-id="${entry.id}">編輯</button>
          <button type="button" data-action="delete-transaction" data-id="${entry.id}">刪除</button>
        </div>
      </article>
    `;
  }).join("") : `<div class="empty">這一天還沒有紀錄。</div>`;
}

function renderCoworkerHistory() {
  const coworkerId = $("#historyCoworkerSelect").value;
  const entries = coworkerId ? state.transactions.filter((entry) => entry.coworkerId === coworkerId) : [];
  $("#coworkerHistory").innerHTML = coworkerId && entries.length ? entries.map((entry) => {
    const store = state.stores.find((item) => item.id === entry.storeId);
    const direction = entry.type === "topup" || entry.type === "payment" ? "+"
      : entry.type === "adjustment" ? (entry.amount >= 0 ? "+" : "")
      : entry.paymentMethod === "cashToday" ? "" : "-";
    const typeLabel = entry.type === "topup" ? "儲值"
      : entry.type === "payment" ? "收款"
      : entry.type === "adjustment" ? "調整"
      : entry.mealType === "lunch" ? "午餐" : "晚餐";
    return `
      <article class="item">
        <div class="item-title">
          <strong>${entry.date} · ${typeLabel}</strong>
          <span class="money">${direction}${money(entry.amount)}</span>
        </div>
        <div class="muted">${entry.type === "mealOrder" ? `${escapeHtml(store?.name || "已刪店家")} · ${escapeHtml(entry.mealName || DEFAULT_MEAL_NAME)} · ${PAYMENT_LABELS[entry.paymentMethod]}` : escapeHtml(entry.note || "無備註")}</div>
      </article>
    `;
  }).join("") : `<div class="empty">${coworkerId ? "尚無交易紀錄。" : "選擇一位同事查看歷史交易。"}</div>`;
}

function sortedStores(mealType) {
  const sortValue = $(`#${mealType}Sort`).value;
  return sortStores(state.stores, mealType, sortValue);
}

function renderStores(mealType) {
  const target = $(`#${mealType}StoreList`);
  const otherType = mealType === "lunch" ? "dinner" : "lunch";
  const stores = sortedStores(mealType);
  target.innerHTML = stores.length ? stores.map((store) => {
    const stats = storeStats(store, mealType);
    const customUrl = store.customUrl || "";
    const searchUrl = customUrl || store.searchUrl || googleSearchUrl(store.name);
    const restaurantType = getRestaurantType(store.restaurantType);
    return `
      <article class="store-card">
        <div class="store-title">
          <strong>${escapeHtml(store.name)}</strong>
          <span>${"★".repeat(store.rating || 0)}${"☆".repeat(5 - (store.rating || 0))}</span>
        </div>
        <p class="muted">${escapeHtml(store.notes || "未填類型 / 備註")}</p>
        ${store.review ? `<p>${escapeHtml(store.review)}</p>` : ""}
        <div class="pill-row">
          <span class="pill">${escapeHtml(restaurantType.name)}</span>
          <span class="pill">吃過 ${stats.count} 次</span>
          <span class="pill">最後 ${stats.last || "尚未記錄"}</span>
        </div>
        <div class="card-actions">
          <a href="${escapeHtml(searchUrl)}" target="_blank" rel="noopener">開啟連結</a>
          <button type="button" data-action="edit-store" data-id="${store.id}" data-meal-type="${mealType}">編輯</button>
          <button type="button" data-action="copy-store" data-id="${store.id}" data-meal-type="${otherType}">也加入${otherType === "lunch" ? "午餐" : "晚餐"}</button>
        </div>
      </article>
    `;
  }).join("") : `<div class="empty">還沒有${mealType === "lunch" ? "午餐" : "晚餐"}店家。</div>`;
}

function latestMealOrderForCoworker(coworkerId) {
  return state.transactions
    .filter((entry) => entry.type === "mealOrder" && entry.coworkerId === coworkerId)
    .sort((a, b) => `${b.date}${b.createdAt}`.localeCompare(`${a.date}${a.createdAt}`))[0];
}

function latestMealOrder() {
  return state.transactions
    .filter((entry) => entry.type === "mealOrder")
    .sort((a, b) => `${b.date}${b.createdAt}`.localeCompare(`${a.date}${a.createdAt}`))[0];
}

function isUnpaidOrderCollected(order) {
  if (!order || order.paymentMethod !== "unpaid") return false;
  const orderCreatedAt = order.createdAt || `${order.date}T00:00:00.000Z`;
  return state.transactions.some((entry) => (
    entry.type === "payment"
    && entry.coworkerId === order.coworkerId
    && (entry.createdAt || `${entry.date}T00:00:00.000Z`).localeCompare(orderCreatedAt) >= 0
  ));
}

function theaterStageForOrder(order) {
  if (!order) return "idle";
  if (order.paymentMethod === "unpaid" && !isUnpaidOrderCollected(order)) return "waiting";
  return "eating";
}

function theaterCopy(order, coworker, store) {
  if (!order) {
    return {
      title: "今日訂餐小劇場",
      detail: "新增訂單或點同事，這裡會演出付款狀態。",
      status: "待命"
    };
  }
  if (order.paymentMethod === "prepaidBalance") {
    return {
      title: `${coworker?.name || "同事"} 已用儲值金扣款`,
      detail: `${store?.name || "店家"} 已結帳，吃飯中。`,
      status: "已扣款"
    };
  }
  if (order.paymentMethod === "cashToday") {
    return {
      title: `${coworker?.name || "同事"} 今天現金付款`,
      detail: `${store?.name || "店家"} 已收現金，吃飯中。`,
      status: "已收現金"
    };
  }
  if (isUnpaidOrderCollected(order)) {
    return {
      title: `${coworker?.name || "同事"} 已收款，吃飯中`,
      detail: `${store?.name || "店家"} 的款項已收齊。`,
      status: "已收款"
    };
  }
  return {
    title: `${coworker?.name || "同事"} 正在櫃檯等待付款`,
    detail: "尚未收款，先停在櫃檯提醒你。",
    status: "待收款"
  };
}

function renderStatusTheater() {
  const target = $("#statusTheater");
  if (!target) return;
  const isVisible = state.activePage === "ledger";
  target.classList.toggle("hidden", !isVisible);
  document.body.classList.toggle("theater-visible", isVisible);
  document.body.classList.toggle("theater-collapsed", isVisible && state.theaterCollapsed);
  if (!isVisible) return;

  const activeOrder = state.transactions.find((entry) => entry.id === state.activeTheaterTransactionId)
    || latestMealOrder();
  const coworker = state.coworkers.find((item) => item.id === activeOrder?.coworkerId);
  const store = state.stores.find((item) => item.id === activeOrder?.storeId);
  const character = getPlayerCharacter(coworker?.playerCharacter);
  const gender = coworker?.playerGender === "male" ? "male" : "female";
  const restaurantType = getRestaurantType(store?.restaurantType);
  const assetStyleId = theaterAssetStyleId();
  const stageImage = theaterStageImage(assetStyleId, restaurantType.id);
  const characterImage = theaterCharacterImage(assetStyleId, character.id, gender);
  const stage = theaterStageForOrder(activeOrder);
  const copy = theaterCopy(activeOrder, coworker, store);
  const balanceText = coworker ? `${Number(coworker.balance || 0).toLocaleString("zh-TW")} 元` : "--";
  const collapsedLabel = state.theaterCollapsed ? "展開" : "縮小";

  target.innerHTML = `
    <button class="theater-toggle" type="button" data-action="toggle-theater" aria-expanded="${!state.theaterCollapsed}">
      ${collapsedLabel}
    </button>
    <div class="theater-copy">
      <div>
        <p class="eyebrow">Lunch Status</p>
        <h2>${escapeHtml(copy.title)}</h2>
      </div>
      <p>${escapeHtml(copy.detail)}</p>
      <div class="pill-row">
        <span class="pill">${escapeHtml(copy.status)}</span>
        <span class="pill">${escapeHtml(restaurantType.name)}</span>
        <span class="pill">餘額 ${balanceText}</span>
      </div>
    </div>
    <div class="theater-stage stage-${stage} restaurant-${restaurantType.id}" style="--character-color:${character.color}; --character-hair:${character.hair}; --character-detail:${character.detail}; --shop-color:${restaurantType.accent}; --theater-stage-image:url('${stageImage}');" data-sequence="${state.theaterSequence}">
      <div class="shop-front">
        <span class="shop-awning"></span>
        <span>${escapeHtml(restaurantType.counter)}</span>
        <span class="shop-window"></span>
        <span class="shop-menu"></span>
      </div>
      <div class="counter-desk"></div>
      <div class="dining-table"></div>
      <div class="table-seat"></div>
      <div class="table-shadow"></div>
      <div class="food-tray"></div>
      <div class="meal-prop">${escapeHtml(restaurantType.prop)}</div>
      <div class="payment-flash"></div>
      <div class="actor actor-${character.id}">
        <img class="theater-actor-sprite anime-actor-sprite" src="${characterImage}" alt="" aria-hidden="true">
        <span class="actor-shadow"></span>
        <span class="actor-head"></span>
        <span class="actor-face"></span>
        <span class="actor-hair"></span>
        <span class="actor-body"></span>
        <span class="actor-arm left"></span>
        <span class="actor-arm right"></span>
        <span class="actor-leg left"></span>
        <span class="actor-leg right"></span>
      </div>
    </div>
  `;
}

function renderSettings() {
  const currentTheme = getThemeById(state.theme);
  const currentTheaterStyle = getTheaterStyleById(state.theaterStyle);
  $("#currentThemeName").textContent = currentTheme.name;
  $("#themeGrid").innerHTML = THEMES.map((theme) => `
    <button class="theme-card ${theme.id === currentTheme.id ? "active" : ""}" type="button" data-action="set-theme" data-theme-id="${theme.id}" aria-pressed="${theme.id === currentTheme.id}">
      <span class="theme-preview" aria-hidden="true">
        ${theme.colors.map((color) => `<span class="theme-swatch" style="background:${color}"></span>`).join("")}
      </span>
      <span class="theme-name">${escapeHtml(theme.name)}</span>
      ${theme.id === currentTheme.id ? `<span class="theme-check">✓</span>` : ""}
    </button>
  `).join("");
  $("#currentTheaterStyleName").textContent = currentTheaterStyle.name;
  $("#theaterStyleGrid").innerHTML = THEATER_STYLES.map((style) => `
    <button class="theme-card theater-style-card ${style.id === currentTheaterStyle.id ? "active" : ""} ${isTheaterStyleReady(style.id) ? "" : "disabled"} ${state.theaterAssetStatus[style.id] === "downloading" ? "downloading" : ""}"
      type="button"
      data-action="${isTheaterStyleReady(style.id) ? "set-theater-style" : "download-theater-style"}"
      data-theater-style-id="${style.id}"
      data-asset-state="${state.theaterAssetStatus[style.id] || "pending"}"
      aria-pressed="${style.id === currentTheaterStyle.id}"
    >
      <span class="theme-preview" aria-hidden="true">
        ${style.colors.map((color) => `<span class="theme-swatch" style="background:${color}"></span>`).join("")}
      </span>
      <span class="theme-name">${escapeHtml(style.name)}</span>
      <span class="theater-style-desc">${escapeHtml(style.description)}</span>
      ${isTheaterStyleReady(style.id) ? "" : `<span class="style-status">${state.theaterAssetStatus[style.id] === "downloading" ? "下載中..." : state.theaterAssetStatus[style.id] === "error" ? "下載失敗，點擊重試" : "點擊下載"}</span>`}
      ${style.id === currentTheaterStyle.id ? `<span class="theme-check">✓</span>` : ""}
    </button>
  `).join("");
}

function setDataStatus(message, type = "info") {
  const status = $("#dataStatus");
  if (!status) return;
  status.textContent = message;
  status.dataset.status = type;
}

function sampleDataRecords(date = todayString()) {
  const createdAt = `${date}T04:00:00.000Z`;
  const samples = [
    { suffix: "a", label: "A", character: "runner", gender: "female", restaurantType: "bento", amount: 110 },
    { suffix: "b", label: "B", character: "foodie", gender: "male", restaurantType: "drink", amount: 65 },
    { suffix: "c", label: "C", character: "thinker", gender: "female", restaurantType: "noodle", amount: 130 },
    { suffix: "d", label: "D", character: "runner", gender: "male", restaurantType: "fastFood", amount: 95 },
    { suffix: "e", label: "E", character: "foodie", gender: "female", restaurantType: "cafe", amount: 150 }
  ];
  const coworkers = samples.map((sample) => ({
    id: `${SAMPLE_DATA_PREFIX}-coworker-${sample.suffix}`,
    name: `範例${sample.label}同事`,
    group: "範例資料",
    balance: 0,
    playerCharacter: sample.character,
    playerGender: sample.gender,
    avatarDataUrl: "",
    createdAt,
    updatedAt: nowIso()
  }));
  const stores = samples.map((sample) => ({
    id: `${SAMPLE_DATA_PREFIX}-store-${sample.suffix}`,
    name: `範例${sample.label}店家`,
    notes: "測試用範例店家",
    rating: 3,
    review: "",
    searchUrl: googleSearchUrl(`範例${sample.label}店家`),
    customUrl: "",
    restaurantType: sample.restaurantType,
    availableForLunch: true,
    availableForDinner: false,
    lunchUsedCount: 0,
    dinnerUsedCount: 0,
    lunchLastUsedDate: "",
    dinnerLastUsedDate: "",
    createdAt,
    updatedAt: nowIso()
  }));
  const transactions = samples.map((sample) => ({
    id: `${SAMPLE_DATA_PREFIX}-order-${sample.suffix}`,
    date,
    type: "mealOrder",
    mealType: "lunch",
    coworkerId: `${SAMPLE_DATA_PREFIX}-coworker-${sample.suffix}`,
    storeId: `${SAMPLE_DATA_PREFIX}-store-${sample.suffix}`,
    mealName: DEFAULT_MEAL_NAME,
    amount: sample.amount,
    paymentMethod: "unpaid",
    note: "測試用範例訂單",
    createdAt,
    updatedAt: nowIso()
  }));
  return { coworkers, stores, transactions };
}

function hasSampleData() {
  return state.coworkers.some((item) => item.id.startsWith(`${SAMPLE_DATA_PREFIX}-coworker-`))
    || state.stores.some((item) => item.id.startsWith(`${SAMPLE_DATA_PREFIX}-store-`))
    || state.transactions.some((item) => item.id.startsWith(`${SAMPLE_DATA_PREFIX}-order-`));
}

function syncSampleDataToggle() {
  const toggle = $("#sampleDataToggle");
  if (!toggle) return;
  toggle.checked = hasSampleData();
}

async function addSampleData() {
  const records = sampleDataRecords();
  await Promise.all([
    ...records.coworkers.map((item) => putItem(STORE_NAMES.coworkers, item)),
    ...records.stores.map((item) => putItem(STORE_NAMES.stores, item)),
    ...records.transactions.map((item) => putItem(STORE_NAMES.transactions, item))
  ]);
  state.activeTheaterTransactionId = records.transactions[0].id;
  state.theaterSequence += 1;
  await refresh();
  setDataStatus("已加入 5 位範例同事、5 間範例店家與未付款訂單。", "success");
}

async function removeSampleData() {
  const sampleCoworkerIds = state.coworkers
    .filter((item) => item.id.startsWith(`${SAMPLE_DATA_PREFIX}-coworker-`))
    .map((item) => item.id);
  const sampleStoreIds = state.stores
    .filter((item) => item.id.startsWith(`${SAMPLE_DATA_PREFIX}-store-`))
    .map((item) => item.id);
  const sampleTransactionIds = state.transactions
    .filter((item) => item.id.startsWith(`${SAMPLE_DATA_PREFIX}-order-`)
      || sampleCoworkerIds.includes(item.coworkerId)
      || sampleStoreIds.includes(item.storeId))
    .map((item) => item.id);
  await Promise.all([
    ...sampleTransactionIds.map((id) => deleteItem(STORE_NAMES.transactions, id)),
    ...sampleCoworkerIds.map((id) => deleteItem(STORE_NAMES.coworkers, id)),
    ...sampleStoreIds.map((id) => deleteItem(STORE_NAMES.stores, id))
  ]);
  if (sampleTransactionIds.includes(state.activeTheaterTransactionId)) {
    state.activeTheaterTransactionId = "";
    state.theaterSequence += 1;
  }
  await refresh();
  setDataStatus("已移除測試用範例資料。", "success");
}

function setPage(page) {
  state.activePage = page;
  $(".page.active")?.classList.remove("active");
  $(".tab.active")?.classList.remove("active");
  $(`#${page}Page`).classList.add("active");
  $(`#${page}Tab`).classList.add("active");
  $("#pageTitle").textContent = page === "ledger" ? "Ledger" : page === "lunch" ? "Lunch Stores" : page === "dinner" ? "Dinner Stores" : "Settings";
  renderStatusTheater();
}

function coworkerOptions(selectedId = "") {
  return state.coworkers.map((coworker) => {
    const groupName = coworker.group?.trim();
    const label = groupName ? `${coworker.name}（${groupName}）` : coworker.name;
    return `<option value="${coworker.id}" ${coworker.id === selectedId ? "selected" : ""}>${escapeHtml(label)}</option>`;
  }).join("");
}

function storeOptions(mealType, selectedId = "") {
  const availableKey = mealType === "lunch" ? "availableForLunch" : "availableForDinner";
  return state.stores
    .filter((store) => store[availableKey])
    .map((store) => `<option value="${store.id}" ${store.id === selectedId ? "selected" : ""}>${escapeHtml(store.name)}</option>`)
    .join("");
}

function openDialog({ title, body, onSave, onDelete, saveText = "儲存" }) {
  const dialog = $("#editorDialog");
  $("#dialogTitle").textContent = title;
  $("#dialogBody").innerHTML = body;
  $("#saveButton").textContent = saveText;
  $("#deleteButton").classList.toggle("hidden", !onDelete);
  $("#deleteButton").onclick = onDelete ? async () => {
    if (!confirm("確定刪除？這個動作無法復原。")) return;
    await onDelete();
    dialog.close();
    await refresh();
  } : null;

  $("#editorForm").onsubmit = async (event) => {
    event.preventDefault();
    if (event.submitter?.value === "cancel") {
      dialog.close();
      return;
    }
    try {
      const formData = new FormData(event.currentTarget);
      await onSave(formData);
      dialog.close();
      await refresh();
    } catch (error) {
      alert(error.message || "儲存失敗，請檢查輸入內容。");
    }
  };
  dialog.showModal();
}

function openCoworkerEditor(coworker = null) {
  const groupOptions = Array.from(new Set(state.coworkers.map((item) => item.group?.trim()).filter(Boolean)))
    .sort((a, b) => a.localeCompare(b, "zh-Hant"))
    .map((group) => `<option value="${escapeHtml(group)}"></option>`)
    .join("");
  openDialog({
    title: coworker ? "編輯同事" : "新增同事",
    body: `
      <label class="field">
        <span>姓名</span>
        <input name="name" required maxlength="40" value="${escapeHtml(coworker?.name || "")}">
      </label>
      <label class="field">
        <span>群組</span>
        <input name="group" maxlength="40" list="coworkerGroupOptions" value="${escapeHtml(coworker?.group || "")}" placeholder="例如：業務部、設計部">
        <datalist id="coworkerGroupOptions">${groupOptions}</datalist>
      </label>
      <label class="field">
        <span>玩家角色</span>
        <select name="playerCharacter">${playerCharacterOptions(coworker?.playerCharacter)}</select>
        <span class="field-hint">小劇場會用這個角色外觀呈現該同事的訂餐狀態。</span>
      </label>
      <div class="field">
        <span>角色性別</span>
        ${playerGenderOptions(coworker?.playerGender)}
      </div>
      <label class="field">
        <span>頭像</span>
        <input name="avatarFile" type="file" accept="image/*">
        <span class="field-hint">可上傳圖片作為同事頭像；不選檔會保留目前頭像。</span>
      </label>
    `,
    onSave: async (formData) => {
      const name = formData.get("name").trim();
      const avatarFile = formData.get("avatarFile");
      const avatarDataUrl = avatarFile?.size ? await readFileAsDataUrl(avatarFile) : coworker?.avatarDataUrl || "";
      const entry = coworker || { id: uid(), balance: 0, createdAt: nowIso() };
      await putItem(STORE_NAMES.coworkers, {
        ...entry,
        name,
        group: formData.get("group").trim(),
        playerCharacter: formData.get("playerCharacter") || PLAYER_CHARACTERS[0].id,
        playerGender: formData.get("playerGender") || "female",
        avatarDataUrl,
        updatedAt: nowIso()
      });
    },
    onDelete: coworker ? async () => {
      const related = state.transactions.filter((entry) => entry.coworkerId === coworker.id);
      await Promise.all([
        deleteItem(STORE_NAMES.coworkers, coworker.id),
        ...related.map((entry) => deleteItem(STORE_NAMES.transactions, entry.id))
      ]);
    } : null
  });
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function openTopupEditor(transaction = null) {
  if (!state.coworkers.length) {
    alert("請先新增同事。");
    return;
  }
  openDialog({
    title: transaction ? "編輯儲值金" : "新增儲值金",
    body: `
      <label class="field">
        ${requiredLabel("日期")}
        <input name="date" type="date" required value="${transaction?.date || $("#ledgerDate").value || todayString()}">
      </label>
      <label class="field">
        ${requiredLabel("同事")}
        <select name="coworkerId" required>${coworkerOptions(transaction?.coworkerId)}</select>
      </label>
      <label class="field">
        ${requiredLabel("金額")}
        <input name="amount" type="number" inputmode="numeric" min="1" step="1" required value="${transaction?.amount || ""}">
      </label>
      <label class="field">
        <span>備註</span>
        <textarea name="note">${escapeHtml(transaction?.note || "")}</textarea>
      </label>
    `,
    onSave: async (formData) => {
      const entry = transaction || { id: uid(), type: "topup", mealType: null, storeId: null, mealName: "", paymentMethod: null, createdAt: nowIso() };
      await putItem(STORE_NAMES.transactions, {
        ...entry,
        date: formData.get("date"),
        coworkerId: formData.get("coworkerId"),
        amount: parseMoney(formData.get("amount")),
        note: formData.get("note").trim(),
        updatedAt: nowIso()
      });
    },
    onDelete: transaction ? async () => deleteItem(STORE_NAMES.transactions, transaction.id) : null
  });
}

function openPaymentEditor(coworkerId = null, transaction = null) {
  if (!state.coworkers.length) {
    alert("請先新增同事。");
    return;
  }
  const selectedCoworkerId = transaction?.coworkerId || coworkerId || "";
  openDialog({
    title: transaction ? "編輯收款" : "記錄收款",
    body: `
      <label class="field">
        ${requiredLabel("日期")}
        <input name="date" type="date" required value="${transaction?.date || $("#ledgerDate").value || todayString()}">
      </label>
      <label class="field">
        ${requiredLabel("同事")}
        <select name="coworkerId" required>${coworkerOptions(selectedCoworkerId)}</select>
      </label>
      <label class="field">
        ${requiredLabel("金額")}
        <input name="amount" type="number" inputmode="numeric" min="1" step="1" required value="${transaction?.amount || ""}">
      </label>
      <label class="field">
        <span>備註</span>
        <textarea name="note">${escapeHtml(transaction?.note || "")}</textarea>
      </label>
    `,
    onSave: async (formData) => {
      const entry = transaction || { id: uid(), type: "payment", mealType: null, storeId: null, mealName: "", paymentMethod: null, createdAt: nowIso() };
      const coworkerId = formData.get("coworkerId");
      await putItem(STORE_NAMES.transactions, {
        ...entry,
        date: formData.get("date"),
        coworkerId,
        amount: parseMoney(formData.get("amount")),
        note: formData.get("note").trim(),
        updatedAt: nowIso()
      });
      const unpaidOrder = state.transactions
        .filter((item) => item.type === "mealOrder" && item.paymentMethod === "unpaid" && item.coworkerId === coworkerId)
        .sort((a, b) => `${b.date}${b.createdAt}`.localeCompare(`${a.date}${a.createdAt}`))[0];
      if (unpaidOrder) {
        state.activeTheaterTransactionId = unpaidOrder.id;
        state.theaterSequence += 1;
      }
    },
    onDelete: transaction ? async () => deleteItem(STORE_NAMES.transactions, transaction.id) : null
  });
}

function orderStoreFields(mealType, selectedStoreId = "") {
  return `
    <label class="field">
      ${requiredLabel("店家")}
      <select name="storeId" id="orderStoreSelect" required>
        ${storeOptions(mealType, selectedStoreId)}
        <option value="__new" ${selectedStoreId ? "" : "selected"}>新增店家</option>
      </select>
    </label>
    <label class="field new-store-field" id="newStoreNameField">
      ${requiredLabel("新店家名稱")}
      <input name="newStoreName" maxlength="80" placeholder="例如：阿明便當">
      <span class="field-hint">選擇「新增店家」時必填。</span>
    </label>
    <label class="field new-store-field" id="newStoreTypeField">
      ${requiredLabel("餐廳類型")}
      <select name="newStoreRestaurantType">${restaurantTypeOptions()}</select>
      <span class="field-hint">小劇場會依餐廳類型切換舞台。</span>
    </label>
  `;
}

function bindOrderStoreToggle() {
  const select = $("#orderStoreSelect");
  const fields = Array.from(document.querySelectorAll(".new-store-field"));
  if (!select || !fields.length) return;
  const sync = () => fields.forEach((field) => field.classList.toggle("hidden", select.value !== "__new"));
  const syncRequired = () => {
    const input = $("#newStoreNameField input");
    if (!input) return;
    input.required = select.value === "__new";
  };
  select.addEventListener("change", sync);
  select.addEventListener("change", syncRequired);
  sync();
  syncRequired();
}

async function ensureStoreForOrder(formData, mealType) {
  const selectedStoreId = formData.get("storeId");
  if (selectedStoreId !== "__new") return selectedStoreId;
  const name = formData.get("newStoreName").trim();
  if (!name) throw new Error("請輸入店家名稱。");
  const existing = state.stores.find((store) => store.name === name);
  const availableKey = mealType === "lunch" ? "availableForLunch" : "availableForDinner";
  if (existing) {
    await putItem(STORE_NAMES.stores, {
      ...existing,
      restaurantType: existing.restaurantType || formData.get("newStoreRestaurantType") || RESTAURANT_TYPES[0].id,
      [availableKey]: true,
      updatedAt: nowIso()
    });
    return existing.id;
  }
  const store = {
    id: uid(),
    name,
    notes: "",
    rating: 3,
    review: "",
    searchUrl: googleSearchUrl(name),
    customUrl: "",
    restaurantType: formData.get("newStoreRestaurantType") || RESTAURANT_TYPES[0].id,
    availableForLunch: mealType === "lunch",
    availableForDinner: mealType === "dinner",
    lunchUsedCount: 0,
    dinnerUsedCount: 0,
    lunchLastUsedDate: "",
    dinnerLastUsedDate: "",
    createdAt: nowIso(),
    updatedAt: nowIso()
  };
  await putItem(STORE_NAMES.stores, store);
  return store.id;
}

function openOrderEditor(transaction = null) {
  if (!state.coworkers.length) {
    alert("請先新增同事。");
    return;
  }
  const mealType = transaction?.mealType || defaultMealType();
  openDialog({
    title: transaction ? "編輯餐點訂單" : "新增餐點訂單",
    body: `
      <label class="field">
        ${requiredLabel("日期")}
        <input name="date" type="date" required value="${transaction?.date || $("#ledgerDate").value || todayString()}">
      </label>
      <label class="field">
        ${requiredLabel("餐別")}
        <select name="mealType" id="mealTypeSelect" required>
          <option value="lunch" ${mealType === "lunch" ? "selected" : ""}>午餐</option>
          <option value="dinner" ${mealType === "dinner" ? "selected" : ""}>晚餐</option>
        </select>
        <span class="field-hint">系統會依目前時間預選：14:00 前午餐，14:00 後晚餐。</span>
      </label>
      <div id="orderStoreFields">${orderStoreFields(mealType, transaction?.storeId)}</div>
      <label class="field">
        <span>餐點名稱</span>
        <input name="mealName" maxlength="80" value="${escapeHtml(transaction?.mealName === DEFAULT_MEAL_NAME ? "" : transaction?.mealName || "")}" placeholder="可先留空，之後再補">
        <span class="field-hint">留空會先記為「${DEFAULT_MEAL_NAME}」。</span>
      </label>
      <label class="field">
        ${requiredLabel("同事")}
        <select name="coworkerId" required>${coworkerOptions(transaction?.coworkerId)}</select>
      </label>
      <label class="field">
        ${requiredLabel("金額")}
        <input name="amount" type="number" inputmode="numeric" min="1" step="1" required value="${transaction?.amount || ""}">
      </label>
      <label class="field">
        ${requiredLabel("付款方式")}
        <select name="paymentMethod" required>
          <option value="prepaidBalance" ${transaction?.paymentMethod === "prepaidBalance" ? "selected" : ""}>從儲值金扣款</option>
          <option value="cashToday" ${transaction?.paymentMethod === "cashToday" ? "selected" : ""}>當天現金付款</option>
          <option value="unpaid" ${transaction?.paymentMethod === "unpaid" ? "selected" : ""}>尚未付款</option>
        </select>
      </label>
      <label class="field">
        <span>備註</span>
        <textarea name="note">${escapeHtml(transaction?.note || "")}</textarea>
      </label>
    `,
    onSave: async (formData) => {
      const selectedMealType = formData.get("mealType");
      const storeId = await ensureStoreForOrder(formData, selectedMealType);
      const entry = transaction || { id: uid(), type: "mealOrder", createdAt: nowIso() };
      state.activeTheaterTransactionId = entry.id;
      state.theaterSequence += 1;
      await putItem(STORE_NAMES.transactions, {
        ...entry,
        date: formData.get("date"),
        mealType: selectedMealType,
        coworkerId: formData.get("coworkerId"),
        storeId,
        mealName: formData.get("mealName").trim() || DEFAULT_MEAL_NAME,
        amount: parseMoney(formData.get("amount")),
        paymentMethod: formData.get("paymentMethod"),
        note: formData.get("note").trim(),
        updatedAt: nowIso()
      });
    },
    onDelete: transaction ? async () => deleteItem(STORE_NAMES.transactions, transaction.id) : null
  });
  bindOrderStoreToggle();
  $("#mealTypeSelect").addEventListener("change", (event) => {
    $("#orderStoreFields").innerHTML = orderStoreFields(event.target.value, "");
    bindOrderStoreToggle();
  });
}

function openStoreEditor(mealType, store = null) {
  const availableKey = mealType === "lunch" ? "availableForLunch" : "availableForDinner";
  openDialog({
    title: store ? "編輯店家" : `新增${mealType === "lunch" ? "午餐" : "晚餐"}店家`,
    body: `
      <label class="field">
        <span>店名</span>
        <input name="name" required maxlength="80" value="${escapeHtml(store?.name || "")}">
      </label>
      <label class="field">
        <span>類型 / 備註</span>
        <input name="notes" maxlength="120" value="${escapeHtml(store?.notes || "")}" placeholder="例如：便當、麵、清淡">
      </label>
      <label class="field">
        <span>餐廳類型</span>
        <select name="restaurantType">${restaurantTypeOptions(store?.restaurantType)}</select>
        <span class="field-hint">小劇場會依這個類型切換便當店、飲料店等舞台。</span>
      </label>
      <label class="field">
        <span>星星評分 1 到 5</span>
        <select name="rating">
          ${[1, 2, 3, 4, 5].map((value) => `<option value="${value}" ${Number(store?.rating || 3) === value ? "selected" : ""}>${value}</option>`).join("")}
        </select>
      </label>
      <label class="field">
        <span>評語</span>
        <textarea name="review">${escapeHtml(store?.review || "")}</textarea>
      </label>
      <label class="field">
        <span>自訂連結</span>
        <input name="customUrl" type="url" value="${escapeHtml(store?.customUrl || "")}" placeholder="可貼 Google Map 或菜單連結">
      </label>
    `,
    onSave: async (formData) => {
      const name = formData.get("name").trim();
      const entry = store || {
        id: uid(),
        availableForLunch: false,
        availableForDinner: false,
        lunchUsedCount: 0,
        dinnerUsedCount: 0,
        lunchLastUsedDate: "",
        dinnerLastUsedDate: "",
        createdAt: nowIso()
      };
      await putItem(STORE_NAMES.stores, {
        ...entry,
        name,
        notes: formData.get("notes").trim(),
        restaurantType: formData.get("restaurantType") || RESTAURANT_TYPES[0].id,
        rating: Number(formData.get("rating")),
        review: formData.get("review").trim(),
        searchUrl: googleSearchUrl(name),
        customUrl: formData.get("customUrl").trim(),
        [availableKey]: true,
        updatedAt: nowIso()
      });
    },
    onDelete: store ? async () => deleteItem(STORE_NAMES.stores, store.id) : null
  });
}

async function deleteTransaction(id) {
  if (!confirm("確定刪除這筆紀錄？")) return;
  await deleteItem(STORE_NAMES.transactions, id);
  await refresh();
}

async function copyStoreToMealType(id, mealType) {
  const store = state.stores.find((item) => item.id === id);
  if (!store) return;
  const key = mealType === "lunch" ? "availableForLunch" : "availableForDinner";
  await putItem(STORE_NAMES.stores, { ...store, [key]: true, updatedAt: nowIso() });
  await refresh();
}

function exportData() {
  const payload = createBackupPayload(state);
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `launch-gogogo-backup-${todayString()}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  setDataStatus("已建立備份檔。", "success");
}

async function importDataFile(file) {
  if (!file) return;
  try {
    const payload = JSON.parse(await file.text());
    const validation = validateBackupPayload(payload);
    if (!validation.ok) {
      setDataStatus(`匯入失敗：${validation.errors[0]}`, "error");
      return;
    }
    const counts = payload.data;
    const ok = confirm(`匯入會覆寫目前本機資料。\n\n同事：${counts.coworkers.length}\n店家：${counts.stores.length}\n交易：${counts.transactions.length}\n\n確定匯入？`);
    if (!ok) {
      setDataStatus("已取消匯入。", "info");
      return;
    }
    await replaceAllData(payload.data);
    await refresh();
    setDataStatus("匯入完成，已重新計算餘額與店家統計。", "success");
  } catch (error) {
    setDataStatus(`匯入失敗：${error.message || "無法讀取 JSON 檔案。"}`, "error");
  }
}

function ensureUpdateToast() {
  let toast = $("#updateToast");
  if (toast) return toast;
  toast = document.createElement("div");
  toast.id = "updateToast";
  toast.className = "update-toast hidden";
  toast.innerHTML = `
    <div>
      <strong>有新版本可用</strong>
      <span>更新後會重新載入 App，資料仍保存在本機。</span>
    </div>
    <button id="updateNowButton" class="primary-button" type="button">更新</button>
  `;
  document.body.appendChild(toast);
  $("#updateNowButton").addEventListener("click", () => {
    if (!state.pendingServiceWorker) return;
    state.pendingServiceWorker.postMessage({ type: "SKIP_WAITING" });
  });
  return toast;
}

function showUpdateToast(worker) {
  state.pendingServiceWorker = worker;
  ensureUpdateToast().classList.remove("hidden");
}

function watchServiceWorkerUpdate(registration) {
  if (registration.waiting && navigator.serviceWorker.controller) {
    showUpdateToast(registration.waiting);
  }

  registration.addEventListener("updatefound", () => {
    const newWorker = registration.installing;
    if (!newWorker) return;
    newWorker.addEventListener("statechange", () => {
      if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
        showUpdateToast(newWorker);
      }
    });
  });

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (state.refreshingForUpdate) return;
    state.refreshingForUpdate = true;
    window.location.reload();
  });
}

function bindEvents() {
  $(".bottom-tabs").addEventListener("click", (event) => {
    const button = event.target.closest(".tab");
    if (button) setPage(button.dataset.page);
  });

  $("#ledgerDate").addEventListener("change", renderDailySummary);
  $("#historyCoworkerSelect").addEventListener("change", renderCoworkerHistory);
  $("#addCoworkerButton").addEventListener("click", () => openCoworkerEditor());
  $("#addTopupButton").addEventListener("click", () => openTopupEditor());
  $("#addOrderButton").addEventListener("click", () => openOrderEditor());
  $("#addLunchStoreButton").addEventListener("click", () => openStoreEditor("lunch"));
  $("#addDinnerStoreButton").addEventListener("click", () => openStoreEditor("dinner"));
  $("#lunchSort").addEventListener("change", () => renderStores("lunch"));
  $("#dinnerSort").addEventListener("change", () => renderStores("dinner"));
  $("#exportDataButton").addEventListener("click", exportData);
  $("#importDataButton").addEventListener("click", () => $("#importDataInput").click());
  $("#importDataInput").addEventListener("change", async (event) => {
    await importDataFile(event.target.files?.[0]);
    event.target.value = "";
  });
  $("#sampleDataToggle").addEventListener("change", async (event) => {
    const toggle = event.currentTarget;
    toggle.disabled = true;
    try {
      if (toggle.checked) {
        const ok = confirm("要加入測試用範例資料嗎？\n\n會建立 5 位範例同事、5 間範例店家，以及 5 筆尚未付款的午餐訂單。");
        if (!ok) return;
        await addSampleData();
      } else {
        const ok = confirm("要移除測試用範例資料嗎？\n\n會刪除 5 位範例同事、範例店家，以及相關範例訂單。你的其他資料不會被刪除。");
        if (!ok) return;
        await removeSampleData();
      }
    } finally {
      toggle.disabled = false;
      syncSampleDataToggle();
    }
  });

  document.body.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-action]");
    if (!trigger) return;
    const { action, id, mealType } = trigger.dataset;
    if (action === "show-theater") {
      state.activeTheaterTransactionId = id;
      state.theaterSequence += 1;
      renderStatusTheater();
    }
    if (action === "show-coworker-theater") {
      const order = latestMealOrderForCoworker(id);
      state.activeTheaterTransactionId = order?.id || "";
      state.theaterSequence += 1;
      renderStatusTheater();
    }
    if (action === "toggle-theater") {
      state.theaterCollapsed = !state.theaterCollapsed;
      renderStatusTheater();
    }
    if (action === "open-payment") openPaymentEditor(id);
    if (action === "edit-coworker") openCoworkerEditor(state.coworkers.find((item) => item.id === id));
    if (action === "edit-transaction") {
      const entry = state.transactions.find((item) => item.id === id);
      if (entry?.type === "topup") openTopupEditor(entry);
      if (entry?.type === "payment") openPaymentEditor(null, entry);
      if (entry?.type === "mealOrder") openOrderEditor(entry);
    }
    if (action === "delete-transaction") deleteTransaction(id);
    if (action === "edit-store") openStoreEditor(mealType, state.stores.find((item) => item.id === id));
    if (action === "copy-store") copyStoreToMealType(id, mealType);
    if (action === "set-theme") {
      applyTheme(trigger.dataset.themeId);
      renderSettings();
    }
    if (action === "set-theater-style") {
      applyTheaterStyle(trigger.dataset.theaterStyleId);
      renderSettings();
      renderStatusTheater();
    }
    if (action === "download-theater-style") {
      downloadTheaterStyleAssets(trigger.dataset.theaterStyleId)
        .then(() => {
          applyTheaterStyle(trigger.dataset.theaterStyleId);
          renderSettings();
          renderStatusTheater();
        })
        .catch((error) => alert(error.message || "素材下載失敗，請稍後再試。"));
    }
  });

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    state.deferredInstallPrompt = event;
    $("#installButton").classList.remove("hidden");
  });

  $("#installButton").addEventListener("click", async () => {
    if (!state.deferredInstallPrompt) return;
    state.deferredInstallPrompt.prompt();
    await state.deferredInstallPrompt.userChoice;
    state.deferredInstallPrompt = null;
    $("#installButton").classList.add("hidden");
  });
}

async function init() {
  applyTheme(localStorage.getItem(THEME_STORAGE_KEY) || "default");
  await syncTheaterAssetStatus();
  applyTheaterStyle(localStorage.getItem(THEATER_STYLE_STORAGE_KEY) || "miniature");
  $("#ledgerDate").value = todayString();
  bindEvents();
  state.db = await openDb();
  await refresh();
  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.register("./service-worker.js");
    watchServiceWorkerUpdate(registration);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") registration.update();
    });
  }
}

window.LaunchGoGoGoApp = {
  bindOrderStoreToggle,
  importDataFile,
  orderStoreFields,
  addSampleData,
  applyTheaterStyle,
  downloadTheaterStyleAssets,
  renderCoworkers,
  renderDailySummary,
  renderSettings,
  renderStatusTheater,
  replaceAllData,
  removeSampleData,
  setPage,
  syncTheaterAssetStatus,
  state
};

if (!window.LAUNCH_GOGOGO_SKIP_AUTO_INIT) {
  init().catch((error) => {
    console.error(error);
    alert(`啟動失敗：${error.message}`);
  });
}
