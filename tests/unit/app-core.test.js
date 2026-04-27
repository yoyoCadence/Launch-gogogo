const core = require("../../app-core.js");

describe("core business rules", () => {
  it("calculates balances from topups, adjustments, and meal payment methods", () => {
    const result = core.calculateDerivedData({
      coworkers: [
        { id: "amy", name: "Amy", balance: 999 },
        { id: "ben", name: "Ben", balance: 999 }
      ],
      stores: [],
      transactions: [
        tx({ id: "1", coworkerId: "amy", type: "topup", amount: 500 }),
        tx({ id: "2", coworkerId: "amy", type: "mealOrder", paymentMethod: "prepaidBalance", amount: 120 }),
        tx({ id: "3", coworkerId: "amy", type: "mealOrder", paymentMethod: "cashToday", amount: 95 }),
        tx({ id: "4", coworkerId: "amy", type: "mealOrder", paymentMethod: "unpaid", amount: 80 }),
        tx({ id: "5", coworkerId: "ben", type: "adjustment", amount: -30 })
      ]
    });

    expect(result.coworkers.find((coworker) => coworker.id === "amy").balance).toBe(300);
    expect(result.coworkers.find((coworker) => coworker.id === "ben").balance).toBe(-30);
  });

  it("rebuilds store meal availability, counts, and latest dates from transactions", () => {
    const result = core.calculateDerivedData({
      coworkers: [{ id: "amy", name: "Amy", balance: 0 }],
      stores: [
        store({ id: "s1", name: "A", lunchUsedCount: 99, lunchLastUsedDate: "2099-01-01" }),
        store({ id: "s2", name: "B" })
      ],
      transactions: [
        tx({ id: "1", storeId: "s1", mealType: "lunch", date: "2026-04-01" }),
        tx({ id: "2", storeId: "s1", mealType: "lunch", date: "2026-04-03" }),
        tx({ id: "3", storeId: "s2", mealType: "dinner", date: "2026-04-02" })
      ]
    });

    expect(result.stores.find((item) => item.id === "s1")).toMatchObject({
      availableForLunch: true,
      lunchUsedCount: 2,
      lunchLastUsedDate: "2026-04-03"
    });
    expect(result.stores.find((item) => item.id === "s2")).toMatchObject({
      availableForDinner: true,
      dinnerUsedCount: 1,
      dinnerLastUsedDate: "2026-04-02"
    });
  });

  it("sorts stores by rating, recent usage, oldest usage, and count", () => {
    const stores = [
      store({ id: "a", name: "Alpha", rating: 3, lunchUsedCount: 2, lunchLastUsedDate: "2026-04-02", availableForLunch: true }),
      store({ id: "b", name: "Beta", rating: 5, lunchUsedCount: 1, lunchLastUsedDate: "2026-04-03", availableForLunch: true }),
      store({ id: "c", name: "Cafe", rating: 5, lunchUsedCount: 7, lunchLastUsedDate: "2026-03-30", availableForLunch: true })
    ];

    expect(core.sortStores([...stores], "lunch", "rating").map((item) => item.id)).toEqual(["b", "c", "a"]);
    expect(core.sortStores([...stores], "lunch", "recent").map((item) => item.id)).toEqual(["b", "a", "c"]);
    expect(core.sortStores([...stores], "lunch", "oldest").map((item) => item.id)).toEqual(["c", "a", "b"]);
    expect(core.sortStores([...stores], "lunch", "count").map((item) => item.id)).toEqual(["c", "a", "b"]);
  });

  it("keeps formatting and defaults predictable", () => {
    // Use Date(y,m,d,h) constructor — no timezone offset, always local time
    expect(core.defaultMealType(new Date(2026, 3, 26, 13, 59))).toBe("lunch");
    expect(core.defaultMealType(new Date(2026, 3, 26, 14, 0))).toBe("dinner");
    expect(core.parseMoney("99.6")).toBe(100);
    expect(core.money(1234)).toBe("$1,234");
    expect(core.signedMoney(-42)).toBe("-$42");
    expect(core.signedMoney(0)).toBe("$0");
    expect(core.escapeHtml("<b>A&B</b>")).toBe("&lt;b&gt;A&amp;B&lt;/b&gt;");
    expect(core.escapeHtml('"quoted" & \'apostrophe\'')).toBe("&quot;quoted&quot; &amp; &#039;apostrophe&#039;");
    expect(core.googleSearchUrl(" 阿明 便當 ")).toBe("https://www.google.com/search?q=%E9%98%BF%E6%98%8E%20%E4%BE%BF%E7%95%B6");
  });

  it("storeStats returns correct count and last date per meal type", () => {
    const s = store({
      lunchUsedCount: 3,
      lunchLastUsedDate: "2026-04-01",
      dinnerUsedCount: 7,
      dinnerLastUsedDate: "2026-03-15"
    });
    expect(core.storeStats(s, "lunch")).toEqual({ count: 3, last: "2026-04-01" });
    expect(core.storeStats(s, "dinner")).toEqual({ count: 7, last: "2026-03-15" });
    expect(core.storeStats(store(), "lunch")).toEqual({ count: 0, last: "" });
  });

  it("sortStores filters out stores not available for the requested meal type", () => {
    const stores = [
      store({ id: "a", availableForLunch: true, availableForDinner: false }),
      store({ id: "b", availableForLunch: false, availableForDinner: true }),
      store({ id: "c", availableForLunch: true, availableForDinner: true })
    ];
    const lunchIds = core.sortStores(stores, "lunch", "rating").map((s) => s.id);
    expect(lunchIds).toContain("a");
    expect(lunchIds).toContain("c");
    expect(lunchIds).not.toContain("b");

    const dinnerIds = core.sortStores(stores, "dinner", "rating").map((s) => s.id);
    expect(dinnerIds).toContain("b");
    expect(dinnerIds).toContain("c");
    expect(dinnerIds).not.toContain("a");

    expect(core.sortStores([], "lunch", "rating")).toEqual([]);
  });

  it("validateBackupPayload rejects invalid root types and wrong metadata", () => {
    expect(core.validateBackupPayload(null).ok).toBe(false);
    expect(core.validateBackupPayload([]).ok).toBe(false);
    expect(core.validateBackupPayload("string").ok).toBe(false);

    const base = { app: "Launch-GoGoGo", schemaVersion: 1, data: { coworkers: [], stores: [], transactions: [] } };
    expect(core.validateBackupPayload({ ...base, app: "WrongApp" }).ok).toBe(false);
    expect(core.validateBackupPayload({ ...base, schemaVersion: 99 }).ok).toBe(false);

    const noData = { app: "Launch-GoGoGo", schemaVersion: 1 };
    expect(core.validateBackupPayload(noData).ok).toBe(false);
    expect(core.validateBackupPayload(noData).errors).toContain("備份檔缺少 data 區塊。");
  });

  it("validates individual store and transaction records in backup payloads", () => {
    const base = { app: "Launch-GoGoGo", schemaVersion: 1, data: {} };

    const storeResult = core.validateBackupPayload({
      ...base,
      data: { coworkers: [], stores: [{ ...store(), rating: 0 }], transactions: [] }
    });
    expect(storeResult.ok).toBe(false);
    expect(storeResult.errors).toContain("stores[0] rating 必須是 1 到 5 的整數。");

    const txResult = core.validateBackupPayload({
      ...base,
      data: { coworkers: [], stores: [], transactions: [{ ...tx(), date: "20260401" }] }
    });
    expect(txResult.ok).toBe(false);
    expect(txResult.errors).toContain("transactions[0] date 必須是 YYYY-MM-DD。");

    const nullMealTypeResult = core.validateBackupPayload({
      ...base,
      data: { coworkers: [], stores: [], transactions: [{ ...tx(), type: "topup", mealType: null, paymentMethod: null }] }
    });
    expect(nullMealTypeResult.ok).toBe(true);
  });

  it("creates and validates backup payloads", () => {
    const payload = core.createBackupPayload({
      coworkers: [coworker({ id: "amy", name: "Amy" })],
      stores: [store({ id: "store", name: "阿明便當" })],
      transactions: [tx({ id: "tx1", coworkerId: "amy", storeId: "store" })]
    }, "2026-04-26T00:00:00.000Z");

    expect(payload).toMatchObject({
      app: "Launch-GoGoGo",
      schemaVersion: 1,
      exportedAt: "2026-04-26T00:00:00.000Z"
    });
    expect(core.validateBackupPayload(payload)).toEqual({ ok: true, errors: [] });
  });

  it("rejects invalid backup payloads before import", () => {
    const result = core.validateBackupPayload({
      app: "Launch-GoGoGo",
      schemaVersion: 1,
      data: {
        coworkers: [{ id: "", name: "", balance: 1.5 }],
        stores: [],
        transactions: []
      }
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toEqual(expect.arrayContaining([
      "coworkers[0] id 必須是非空字串。",
      "coworkers[0] name 必須是非空字串。",
      "coworkers[0] balance 必須是整數。"
    ]));
  });
});

function tx(overrides = {}) {
  return {
    id: "tx",
    date: "2026-04-01",
    type: "mealOrder",
    mealType: "lunch",
    coworkerId: "amy",
    storeId: "store",
    amount: 100,
    paymentMethod: "prepaidBalance",
    createdAt: "2026-04-01T00:00:00.000Z",
    updatedAt: "2026-04-01T00:00:00.000Z",
    ...overrides
  };
}

function store(overrides = {}) {
  return {
    id: "store",
    name: "Store",
    rating: 3,
    availableForLunch: false,
    availableForDinner: false,
    lunchUsedCount: 0,
    dinnerUsedCount: 0,
    lunchLastUsedDate: "",
    dinnerLastUsedDate: "",
    createdAt: "2026-04-01T00:00:00.000Z",
    updatedAt: "2026-04-01T00:00:00.000Z",
    ...overrides
  };
}

function coworker(overrides = {}) {
  return {
    id: "coworker",
    name: "Coworker",
    balance: 0,
    createdAt: "2026-04-01T00:00:00.000Z",
    updatedAt: "2026-04-01T00:00:00.000Z",
    ...overrides
  };
}
