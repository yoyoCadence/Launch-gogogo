(function attachLaunchGoGoGoCore(global) {
  const BALANCE_DEDUCTING_PAYMENT_METHODS = ["prepaidBalance", "unpaid"];

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

  const api = {
    calculateDerivedData,
    defaultMealType,
    escapeHtml,
    googleSearchUrl,
    money,
    parseMoney,
    signedMoney,
    sortStores,
    storeStats,
    todayString
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  global.LaunchGoGoGoCore = api;
})(typeof globalThis !== "undefined" ? globalThis : window);
