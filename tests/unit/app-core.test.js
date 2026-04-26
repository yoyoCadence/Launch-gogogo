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
    expect(core.defaultMealType(new Date("2026-04-26T13:59:00+08:00"))).toBe("lunch");
    expect(core.defaultMealType(new Date("2026-04-26T14:00:00+08:00"))).toBe("dinner");
    expect(core.parseMoney("99.6")).toBe(100);
    expect(core.money(1234)).toBe("$1,234");
    expect(core.signedMoney(-42)).toBe("-$42");
    expect(core.escapeHtml("<b>A&B</b>")).toBe("&lt;b&gt;A&amp;B&lt;/b&gt;");
    expect(core.googleSearchUrl(" 阿明 便當 ")).toBe("https://www.google.com/search?q=%E9%98%BF%E6%98%8E%20%E4%BE%BF%E7%95%B6");
  });

  it("creates and validates backup payloads", () => {
    const payload = core.createBackupPayload({
      coworkers: [coworker({ id: "amy", name: "Amy", group: "業務部", avatarDataUrl: "data:image/png;base64,abc" })],
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

  it("rejects non-image coworker avatar data in backups", () => {
    const result = core.validateBackupPayload(core.createBackupPayload({
      coworkers: [coworker({ avatarDataUrl: "data:text/plain;base64,abc" })],
      stores: [],
      transactions: []
    }));

    expect(result.ok).toBe(false);
    expect(result.errors).toContain("coworkers[0] avatarDataUrl 必須是圖片 data URL。");
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
