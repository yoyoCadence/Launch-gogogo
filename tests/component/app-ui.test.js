describe("app UI components", () => {
  beforeAll(() => {
    window.LaunchGoGoGoCore = require("../../app-core.js");
    window.LAUNCH_GOGOGO_SKIP_AUTO_INIT = true;
    require("../../app.js");
  });

  beforeEach(() => {
    document.body.innerHTML = "";
    window.LaunchGoGoGoApp.state.coworkers = [];
    window.LaunchGoGoGoApp.state.stores = [];
    window.LaunchGoGoGoApp.state.transactions = [];
    window.LaunchGoGoGoApp.state.theme = "default";
    window.LaunchGoGoGoApp.state.theaterStyle = "miniature";
    window.LaunchGoGoGoApp.state.activePage = "ledger";
    window.LaunchGoGoGoApp.state.theaterCollapsed = false;
    document.body.className = "";
    document.documentElement.removeAttribute("data-theater-style");
  });

  it("switches the active page and tab together", () => {
    document.body.innerHTML = `
      <h1 id="pageTitle">Ledger</h1>
      <section id="ledgerPage" class="page active"></section>
      <section id="lunchPage" class="page"></section>
      <section id="dinnerPage" class="page"></section>
      <section id="settingsPage" class="page"></section>
      <button id="ledgerTab" class="tab active"></button>
      <button id="lunchTab" class="tab"></button>
      <button id="dinnerTab" class="tab"></button>
      <button id="settingsTab" class="tab"></button>
    `;

    window.LaunchGoGoGoApp.setPage("lunch");

    expect(document.querySelector("#lunchPage").classList.contains("active")).toBe(true);
    expect(document.querySelector("#ledgerPage").classList.contains("active")).toBe(false);
    expect(document.querySelector("#lunchTab").classList.contains("active")).toBe(true);
    expect(document.querySelector("#pageTitle").textContent).toBe("Lunch Stores");
  });

  it("requires a new store name only when the new-store option is selected", () => {
    document.body.innerHTML = window.LaunchGoGoGoApp.orderStoreFields("lunch");
    const select = document.querySelector("#orderStoreSelect");
    const field = document.querySelector("#newStoreNameField");
    const input = field.querySelector("input");
    const typeField = document.querySelector("#newStoreTypeField");

    window.LaunchGoGoGoApp.bindOrderStoreToggle();

    expect(field.classList.contains("hidden")).toBe(false);
    expect(typeField.classList.contains("hidden")).toBe(false);
    expect(input.required).toBe(true);
    expect(typeField.textContent).toContain("便當店");

    select.insertAdjacentHTML("afterbegin", '<option value="existing">Existing</option>');
    select.value = "existing";
    select.dispatchEvent(new Event("change"));

    expect(field.classList.contains("hidden")).toBe(true);
    expect(typeField.classList.contains("hidden")).toBe(true);
    expect(input.required).toBe(false);
  });

  it("setPage updates title correctly for all pages", () => {
    document.body.innerHTML = `
      <h1 id="pageTitle">Ledger</h1>
      <section id="ledgerPage" class="page active"></section>
      <section id="lunchPage" class="page"></section>
      <section id="dinnerPage" class="page"></section>
      <section id="settingsPage" class="page"></section>
      <button id="ledgerTab" class="tab active"></button>
      <button id="lunchTab" class="tab"></button>
      <button id="dinnerTab" class="tab"></button>
      <button id="settingsTab" class="tab"></button>
    `;
    window.LaunchGoGoGoApp.setPage("dinner");
    expect(document.querySelector("#pageTitle").textContent).toBe("Dinner Stores");
    window.LaunchGoGoGoApp.setPage("settings");
    expect(document.querySelector("#pageTitle").textContent).toBe("Settings");
    window.LaunchGoGoGoApp.setPage("ledger");
    expect(document.querySelector("#pageTitle").textContent).toBe("Ledger");
  });

  it("renders coworker list with names, balances, and correct positive/negative classes", () => {
    document.body.innerHTML = `
      <span id="coworkerCount"></span>
      <div id="coworkerList"></div>
    `;
    window.LaunchGoGoGoApp.state.coworkers = [
      { id: "c1", name: "Amy", balance: 300, createdAt: "", updatedAt: "" },
      { id: "c2", name: "Ben", balance: -50, createdAt: "", updatedAt: "" }
    ];

    window.LaunchGoGoGoApp.renderCoworkers();

    expect(document.querySelector("#coworkerCount").textContent).toBe("2 位");
    expect(document.querySelector("#coworkerList").textContent).toContain("Amy");
    expect(document.querySelector("#coworkerList").textContent).toContain("Ben");
    expect(document.querySelector(".money.positive").textContent).toContain("300");
    expect(document.querySelector(".money.negative").textContent).toContain("50");
    expect(document.querySelector("#coworkerList").textContent).toContain("目前餘額");
    expect(document.querySelector("#coworkerList").textContent).toContain("目前欠款");
  });

  it("renderDailySummary shows meal order entries and daily total for the selected date", () => {
    document.body.innerHTML = `
      <input id="ledgerDate" value="2026-04-20">
      <div id="dailyTotal"></div>
      <div id="dailySummary"></div>
    `;
    window.LaunchGoGoGoApp.state.coworkers = [
      { id: "c1", name: "Amy", balance: 0, createdAt: "", updatedAt: "" }
    ];
    window.LaunchGoGoGoApp.state.stores = [
      { id: "s1", name: "阿明便當", rating: 3, availableForLunch: true, availableForDinner: false, createdAt: "", updatedAt: "" }
    ];
    window.LaunchGoGoGoApp.state.transactions = [
      {
        id: "t1", date: "2026-04-20", type: "mealOrder", mealType: "lunch",
        coworkerId: "c1", storeId: "s1", mealName: "雞腿飯", amount: 100,
        paymentMethod: "prepaidBalance", createdAt: "", updatedAt: ""
      },
      {
        id: "t2", date: "2026-04-19", type: "mealOrder", mealType: "lunch",
        coworkerId: "c1", storeId: "s1", mealName: "排骨飯", amount: 90,
        paymentMethod: "prepaidBalance", createdAt: "", updatedAt: ""
      }
    ];

    window.LaunchGoGoGoApp.renderDailySummary();

    expect(document.querySelector("#dailyTotal").textContent).toBe("餐點合計 $100");
    expect(document.querySelector("#dailySummary").textContent).toContain("Amy");
    expect(document.querySelector("#dailySummary").textContent).toContain("阿明便當");
    expect(document.querySelector("#dailySummary").textContent).toContain("雞腿飯");
    expect(document.querySelector("#dailySummary").textContent).not.toContain("排骨飯");
  });

  it("renderCoworkers shows a payment button on each coworker card", () => {
    document.body.innerHTML = `
      <span id="coworkerCount"></span>
      <div id="coworkerList"></div>
    `;
    window.LaunchGoGoGoApp.state.coworkers = [
      { id: "c1", name: "Amy", balance: -50, createdAt: "", updatedAt: "" }
    ];

    window.LaunchGoGoGoApp.renderCoworkers();

    const btn = document.querySelector('[data-action="open-payment"][data-id="c1"]');
    expect(btn).not.toBeNull();
    expect(btn.textContent).toBe("收款");
  });

  it("renderDailySummary shows payment entry with 收款 label and excludes it from meal total", () => {
    document.body.innerHTML = `
      <input id="ledgerDate" value="2026-04-27">
      <div id="dailyTotal"></div>
      <div id="dailySummary"></div>
    `;
    window.LaunchGoGoGoApp.state.coworkers = [
      { id: "c1", name: "Amy", balance: 0, createdAt: "", updatedAt: "" }
    ];
    window.LaunchGoGoGoApp.state.stores = [];
    window.LaunchGoGoGoApp.state.transactions = [
      {
        id: "t1", date: "2026-04-27", type: "payment",
        coworkerId: "c1", storeId: null, mealName: "", amount: 150,
        mealType: null, paymentMethod: null, createdAt: "", updatedAt: ""
      }
    ];

    window.LaunchGoGoGoApp.renderDailySummary();

    expect(document.querySelector("#dailySummary").textContent).toContain("收款");
    expect(document.querySelector("#dailySummary").textContent).toContain("Amy");
    expect(document.querySelector("#dailySummary").textContent).toContain("150");
    expect(document.querySelector("#dailyTotal").textContent).toBe("");
  });

  it("renders the selected theme as pressed and updates the current name", () => {
    document.body.innerHTML = `
      <span id="currentThemeName"></span>
      <div id="themeGrid"></div>
      <span id="currentTheaterStyleName"></span>
      <div id="theaterStyleGrid"></div>
    `;
    window.LaunchGoGoGoApp.state.theme = "github";
    window.LaunchGoGoGoApp.state.theaterStyle = "anime";

    window.LaunchGoGoGoApp.renderSettings();

    expect(document.querySelector("#currentThemeName").textContent).toBe("GitHub");
    expect(document.querySelector('[data-theme-id="github"]').getAttribute("aria-pressed")).toBe("true");
    expect(document.querySelector('[data-theme-id="default"]').getAttribute("aria-pressed")).toBe("false");
    expect(document.querySelector("#currentTheaterStyleName").textContent).toBe("日本動漫風格");
    expect(document.querySelector('[data-theater-style-id="anime"]').getAttribute("aria-pressed")).toBe("true");
    expect(document.querySelector('[data-theater-style-id="cyberpunk"]').disabled).toBe(true);
  });

  it("applies the anime theater style and rejects unfinished styles", () => {
    window.LaunchGoGoGoApp.applyTheaterStyle("anime");

    expect(window.LaunchGoGoGoApp.state.theaterStyle).toBe("anime");
    expect(document.documentElement.dataset.theaterStyle).toBe("anime");

    window.LaunchGoGoGoApp.applyTheaterStyle("cyberpunk");

    expect(window.LaunchGoGoGoApp.state.theaterStyle).toBe("miniature");
    expect(document.documentElement.hasAttribute("data-theater-style")).toBe(false);
  });

  it("renders the status theater as waiting until an unpaid order has a payment", () => {
    document.body.innerHTML = `<section id="statusTheater"></section>`;
    window.LaunchGoGoGoApp.state.coworkers = [
      { id: "c1", name: "Amy", balance: -120, playerCharacter: "foodie", createdAt: "", updatedAt: "" }
    ];
    window.LaunchGoGoGoApp.state.stores = [
      { id: "s1", name: "Tea Bar", restaurantType: "drink", rating: 3, availableForLunch: true, availableForDinner: false, createdAt: "", updatedAt: "" }
    ];
    window.LaunchGoGoGoApp.state.transactions = [
      {
        id: "o1", date: "2026-04-28", type: "mealOrder", mealType: "lunch",
        coworkerId: "c1", storeId: "s1", mealName: "紅茶", amount: 120,
        paymentMethod: "unpaid", createdAt: "2026-04-28T04:00:00.000Z", updatedAt: ""
      }
    ];
    window.LaunchGoGoGoApp.state.activeTheaterTransactionId = "o1";

    window.LaunchGoGoGoApp.renderStatusTheater();

    expect(document.querySelector("#statusTheater").textContent).toContain("待收款");
    expect(document.querySelector(".theater-stage").classList.contains("stage-waiting")).toBe(true);
    expect(document.querySelector(".actor-arm.right")).not.toBeNull();
    expect(document.querySelector(".meal-prop").textContent).toBe("飲料");

    window.LaunchGoGoGoApp.state.transactions.push({
      id: "p1", date: "2026-04-28", type: "payment", mealType: null,
      coworkerId: "c1", storeId: null, mealName: "", amount: 120,
      paymentMethod: null, createdAt: "2026-04-28T04:05:00.000Z", updatedAt: ""
    });

    window.LaunchGoGoGoApp.renderStatusTheater();

    expect(document.querySelector("#statusTheater").textContent).toContain("已收款");
    expect(document.querySelector(".theater-stage").classList.contains("stage-eating")).toBe(true);
  });

  it("shows the theater only on ledger and supports collapsing", () => {
    document.body.innerHTML = `
      <h1 id="pageTitle">Ledger</h1>
      <section id="ledgerPage" class="page active"></section>
      <section id="lunchPage" class="page"></section>
      <section id="dinnerPage" class="page"></section>
      <section id="settingsPage" class="page"></section>
      <section id="statusTheater"></section>
      <button id="ledgerTab" class="tab active"></button>
      <button id="lunchTab" class="tab"></button>
      <button id="dinnerTab" class="tab"></button>
      <button id="settingsTab" class="tab"></button>
    `;

    window.LaunchGoGoGoApp.setPage("ledger");
    expect(document.querySelector("#statusTheater").classList.contains("hidden")).toBe(false);
    expect(document.body.classList.contains("theater-visible")).toBe(true);

    window.LaunchGoGoGoApp.state.theaterCollapsed = true;
    window.LaunchGoGoGoApp.renderStatusTheater();
    expect(document.body.classList.contains("theater-collapsed")).toBe(true);
    expect(document.querySelector('[data-action="toggle-theater"]').textContent).toContain("展開");

    window.LaunchGoGoGoApp.setPage("lunch");
    expect(document.querySelector("#statusTheater").classList.contains("hidden")).toBe(true);
    expect(document.body.classList.contains("theater-visible")).toBe(false);
  });
});
