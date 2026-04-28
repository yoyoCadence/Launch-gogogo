(function attachLaunchGoGoGoCore(global) {
  const BALANCE_DEDUCTING_PAYMENT_METHODS = ["prepaidBalance", "unpaid"];
  const BACKUP_SCHEMA_VERSION = 1;

  function todayString(date = new Date()) {
    return date.toISOString().slice(0, 10);
  }

  function money(value) {
    return `$${Number(value || 0).toLocaleString("zh-TW")}`;
  }

  function signedMoney(value) {
    return `${value >= 0 ? "" : "-"}$${Math.abs(value || 0).toLocaleString("zh-TW")}`;
  }

  function parseMoney(value) {
    return Math.round(Number(value || 0));
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#039;"
    }[char]));
  }

  function defaultMealType(date = new Date()) {
    return date.getHours() < 14 ? "lunch" : "dinner";
  }

  function googleSearchUrl(name) {
    return `https://www.google.com/search?q=${encodeURIComponent(name.trim())}`;
  }

  function storeStats(store, mealType) {
    return mealType === "lunch"
      ? { count: store.lunchUsedCount || 0, last: store.lunchLastUsedDate || "" }
      : { count: store.dinnerUsedCount || 0, last: store.dinnerLastUsedDate || "" };
  }

  function calculateDerivedData({ coworkers = [], stores = [], transactions = [] }) {
    const coworkerMap = new Map(coworkers.map((coworker) => [coworker.id, { ...coworker, balance: 0 }]));
    const storeMap = new Map(stores.map((store) => [store.id, {
      ...store,
      lunchUsedCount: 0,
      dinnerUsedCount: 0,
      lunchLastUsedDate: "",
      dinnerLastUsedDate: ""
    }]));

    const chronological = [...transactions].sort((a, b) => `${a.date}${a.createdAt}`.localeCompare(`${b.date}${b.createdAt}`));
    chronological.forEach((entry) => {
      const coworker = coworkerMap.get(entry.coworkerId);
      if (coworker) {
        if (entry.type === "topup") coworker.balance += entry.amount;
        if (entry.type === "payment") coworker.balance += entry.amount;
        if (entry.type === "adjustment") coworker.balance += entry.amount;
        if (entry.type === "mealOrder" && BALANCE_DEDUCTING_PAYMENT_METHODS.includes(entry.paymentMethod)) {
          coworker.balance -= entry.amount;
        }
      }

      if (entry.type === "mealOrder" && entry.storeId && ["lunch", "dinner"].includes(entry.mealType)) {
        const store = storeMap.get(entry.storeId);
        if (!store) return;
        const flag = entry.mealType === "lunch" ? "availableForLunch" : "availableForDinner";
        const countKey = entry.mealType === "lunch" ? "lunchUsedCount" : "dinnerUsedCount";
        const dateKey = entry.mealType === "lunch" ? "lunchLastUsedDate" : "dinnerLastUsedDate";
        store[flag] = true;
        store[countKey] += 1;
        if (!store[dateKey] || entry.date > store[dateKey]) store[dateKey] = entry.date;
      }
    });

    return {
      coworkers: Array.from(coworkerMap.values()),
      stores: Array.from(storeMap.values())
    };
  }

  function sortStores(stores = [], mealType, sortValue) {
    const availableKey = mealType === "lunch" ? "availableForLunch" : "availableForDinner";
    return stores.filter((store) => store[availableKey]).sort((a, b) => {
      const aStats = storeStats(a, mealType);
      const bStats = storeStats(b, mealType);
      if (sortValue === "rating") return (b.rating || 0) - (a.rating || 0) || a.name.localeCompare(b.name, "zh-Hant");
      if (sortValue === "recent") return (bStats.last || "").localeCompare(aStats.last || "");
      if (sortValue === "oldest") return (aStats.last || "0000-00-00").localeCompare(bStats.last || "0000-00-00");
      if (sortValue === "count") return bStats.count - aStats.count;
      return 0;
    });
  }

  function createBackupPayload({ coworkers = [], stores = [], transactions = [] }, exportedAt = new Date().toISOString()) {
    return {
      app: "Launch-GoGoGo",
      schemaVersion: BACKUP_SCHEMA_VERSION,
      exportedAt,
      data: {
        coworkers,
        stores,
        transactions
      }
    };
  }

  function validateBackupPayload(payload) {
    const errors = [];
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return { ok: false, errors: ["備份檔必須是 JSON object。"] };
    }
    if (payload.app !== "Launch-GoGoGo") errors.push("備份檔 app 名稱不符合。");
    if (payload.schemaVersion !== BACKUP_SCHEMA_VERSION) errors.push("備份檔版本不支援。");
    if (!payload.data || typeof payload.data !== "object" || Array.isArray(payload.data)) {
      errors.push("備份檔缺少 data 區塊。");
      return { ok: false, errors };
    }

    const { coworkers, stores, transactions } = payload.data;
    validateArray("coworkers", coworkers, validateCoworker, errors);
    validateArray("stores", stores, validateStore, errors);
    validateArray("transactions", transactions, validateTransaction, errors);

    return { ok: errors.length === 0, errors };
  }

  function validateArray(name, value, validator, errors) {
    if (!Array.isArray(value)) {
      errors.push(`${name} 必須是陣列。`);
      return;
    }
    value.forEach((item, index) => {
      const itemErrors = validator(item);
      itemErrors.forEach((error) => errors.push(`${name}[${index}] ${error}`));
    });
  }

  function validateCoworker(item) {
    const errors = validateBaseRecord(item);
    if (!isNonEmptyString(item?.name)) errors.push("name 必須是非空字串。");
    if (!Number.isInteger(item?.balance)) errors.push("balance 必須是整數。");
    if (item?.group !== undefined && typeof item.group !== "string") errors.push("group 必須是字串。");
    if (item?.playerCharacter !== undefined && typeof item.playerCharacter !== "string") errors.push("playerCharacter 必須是字串。");
    if (item?.avatarDataUrl !== undefined && typeof item.avatarDataUrl !== "string") errors.push("avatarDataUrl 必須是字串。");
    if (item?.avatarDataUrl && !item.avatarDataUrl.startsWith("data:image/")) errors.push("avatarDataUrl 必須是圖片 data URL。");
    return errors;
  }

  function validateStore(item) {
    const errors = validateBaseRecord(item);
    if (!isNonEmptyString(item?.name)) errors.push("name 必須是非空字串。");
    if (!Number.isInteger(item?.rating) || item.rating < 1 || item.rating > 5) errors.push("rating 必須是 1 到 5 的整數。");
    if (item?.restaurantType !== undefined && typeof item.restaurantType !== "string") errors.push("restaurantType 必須是字串。");
    ["availableForLunch", "availableForDinner"].forEach((key) => {
      if (typeof item?.[key] !== "boolean") errors.push(`${key} 必須是 boolean。`);
    });
    ["lunchUsedCount", "dinnerUsedCount"].forEach((key) => {
      if (!Number.isInteger(item?.[key]) || item[key] < 0) errors.push(`${key} 必須是非負整數。`);
    });
    return errors;
  }

  function validateTransaction(item) {
    const errors = validateBaseRecord(item);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(item?.date || "")) errors.push("date 必須是 YYYY-MM-DD。");
    if (!["topup", "payment", "mealOrder", "adjustment"].includes(item?.type)) errors.push("type 不支援。");
    if (!(item?.mealType === null || ["lunch", "dinner"].includes(item?.mealType))) errors.push("mealType 不支援。");
    if (!isNonEmptyString(item?.coworkerId)) errors.push("coworkerId 必須是非空字串。");
    if (!(item?.storeId === null || typeof item?.storeId === "string")) errors.push("storeId 必須是字串或 null。");
    if (!Number.isInteger(item?.amount)) errors.push("amount 必須是整數。");
    if (!(item?.paymentMethod === null || ["prepaidBalance", "cashToday", "unpaid"].includes(item?.paymentMethod))) errors.push("paymentMethod 不支援。");
    return errors;
  }

  function validateBaseRecord(item) {
    const errors = [];
    if (!item || typeof item !== "object" || Array.isArray(item)) return ["必須是 object。"];
    if (!isNonEmptyString(item.id)) errors.push("id 必須是非空字串。");
    if (!isNonEmptyString(item.createdAt)) errors.push("createdAt 必須是非空字串。");
    if (!isNonEmptyString(item.updatedAt)) errors.push("updatedAt 必須是非空字串。");
    return errors;
  }

  function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
  }

  const api = {
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
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  global.LaunchGoGoGoCore = api;
})(typeof globalThis !== "undefined" ? globalThis : window);
