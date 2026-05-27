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
    window.LaunchGoGoGoApp.state.theaterAssetStatus = {
      miniature: "ready",
      anime: "ready",
      cyberpunk: "ready",
      "gothic-lolita": "ready",
      pixel: "ready",
      arcade: "ready",
      "retro-16bit": "ready",
      storybook: "ready",
      chibi: "ready",
      "painted-fantasy": "ready",
      "muted-jp-life": "ready",
      "arcade-fighter-90s": "ready",
      "mecha-spy-race": "ready",
      "geass-mecha-race": "ready",
      "doraemon-cartoon-cafe": "ready",
      "shinchan-yakiniku-road": "ready",
      "hunter-nen-restaurant": "ready",
      "hero-academy-canteen": "ready",
      "gundam-mobile-suit-canteen": "ready",
      "mirmo-magical-fairy-cafe": "ready"
    };
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
    expect(document.querySelector('[data-theater-style-id="cyberpunk"]').dataset.assetState).toBe("ready");
    expect([...document.querySelectorAll("[data-theater-style-id]")].every((button) => button.dataset.assetState === "ready")).toBe(true);
  });

  it("renders unloaded theater styles as download cards", () => {
    document.body.innerHTML = `
      <span id="currentThemeName"></span>
      <div id="themeGrid"></div>
      <span id="currentTheaterStyleName"></span>
      <div id="theaterStyleGrid"></div>
    `;
    window.LaunchGoGoGoApp.state.theaterAssetStatus.cyberpunk = "pending";

    window.LaunchGoGoGoApp.renderSettings();

    const card = document.querySelector('[data-theater-style-id="cyberpunk"]');
    expect(card.dataset.action).toBe("download-theater-style");
    expect(card.dataset.assetState).toBe("pending");
    expect(card.textContent).toContain("點擊下載");
  });

  it("applies generated theater styles", () => {
    window.LaunchGoGoGoApp.applyTheaterStyle("anime");

    expect(window.LaunchGoGoGoApp.state.theaterStyle).toBe("anime");
    expect(document.documentElement.dataset.theaterStyle).toBe("anime");

    window.LaunchGoGoGoApp.applyTheaterStyle("cyberpunk");

    expect(window.LaunchGoGoGoApp.state.theaterStyle).toBe("cyberpunk");
    expect(document.documentElement.dataset.theaterStyle).toBe("cyberpunk");

    window.LaunchGoGoGoApp.applyTheaterStyle("gothic-lolita");

    expect(window.LaunchGoGoGoApp.state.theaterStyle).toBe("gothic-lolita");
    expect(document.documentElement.dataset.theaterStyle).toBe("gothic-lolita");

    window.LaunchGoGoGoApp.applyTheaterStyle("mecha-spy-race");

    expect(window.LaunchGoGoGoApp.state.theaterStyle).toBe("mecha-spy-race");
    expect(document.documentElement.dataset.theaterStyle).toBe("mecha-spy-race");

    window.LaunchGoGoGoApp.applyTheaterStyle("geass-mecha-race");

    expect(window.LaunchGoGoGoApp.state.theaterStyle).toBe("geass-mecha-race");
    expect(document.documentElement.dataset.theaterStyle).toBe("geass-mecha-race");

    window.LaunchGoGoGoApp.applyTheaterStyle("doraemon-cartoon-cafe");

    expect(window.LaunchGoGoGoApp.state.theaterStyle).toBe("doraemon-cartoon-cafe");
    expect(document.documentElement.dataset.theaterStyle).toBe("doraemon-cartoon-cafe");

    window.LaunchGoGoGoApp.applyTheaterStyle("shinchan-yakiniku-road");

    expect(window.LaunchGoGoGoApp.state.theaterStyle).toBe("shinchan-yakiniku-road");
    expect(document.documentElement.dataset.theaterStyle).toBe("shinchan-yakiniku-road");

    window.LaunchGoGoGoApp.applyTheaterStyle("hunter-nen-restaurant");

    expect(window.LaunchGoGoGoApp.state.theaterStyle).toBe("hunter-nen-restaurant");
    expect(document.documentElement.dataset.theaterStyle).toBe("hunter-nen-restaurant");

    window.LaunchGoGoGoApp.applyTheaterStyle("hero-academy-canteen");

    expect(window.LaunchGoGoGoApp.state.theaterStyle).toBe("hero-academy-canteen");
    expect(document.documentElement.dataset.theaterStyle).toBe("hero-academy-canteen");

    window.LaunchGoGoGoApp.applyTheaterStyle("gundam-mobile-suit-canteen");

    expect(window.LaunchGoGoGoApp.state.theaterStyle).toBe("gundam-mobile-suit-canteen");
    expect(document.documentElement.dataset.theaterStyle).toBe("gundam-mobile-suit-canteen");

    window.LaunchGoGoGoApp.applyTheaterStyle("mirmo-magical-fairy-cafe");

    expect(window.LaunchGoGoGoApp.state.theaterStyle).toBe("mirmo-magical-fairy-cafe");
    expect(document.documentElement.dataset.theaterStyle).toBe("mirmo-magical-fairy-cafe");
  });

  it("renders the status theater as waiting until an unpaid order has a payment", () => {
    document.body.innerHTML = `<section id="statusTheater"></section>`;
    window.LaunchGoGoGoApp.state.coworkers = [
      { id: "c1", name: "Amy", balance: -120, playerCharacter: "foodie", playerGender: "male", createdAt: "", updatedAt: "" }
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
    expect(document.querySelector(".anime-actor-sprite").getAttribute("src")).toBe("./assets/theater/anime/characters/foodie-male.png");
    expect(document.querySelector(".theater-stage").getAttribute("style")).toContain("stage-drink.png");
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

  it("uses theater animation sheets for the waiting and eating states", () => {
    document.body.innerHTML = `<section id="statusTheater"></section>`;
    window.LaunchGoGoGoApp.state.theaterStyle = "anime";
    document.documentElement.dataset.theaterStyle = "anime";
    window.LaunchGoGoGoApp.state.coworkers = [
      { id: "c1", name: "Amy", balance: -120, playerCharacter: "runner", playerGender: "female", createdAt: "", updatedAt: "" }
    ];
    window.LaunchGoGoGoApp.state.stores = [
      { id: "s1", name: "Bento", restaurantType: "bento", rating: 3, availableForLunch: true, availableForDinner: false, createdAt: "", updatedAt: "" }
    ];
    window.LaunchGoGoGoApp.state.transactions = [
      {
        id: "o1", date: "2026-04-28", type: "mealOrder", mealType: "lunch",
        coworkerId: "c1", storeId: "s1", mealName: "bento", amount: 120,
        paymentMethod: "unpaid", createdAt: "2026-04-28T04:00:00.000Z", updatedAt: ""
      }
    ];
    window.LaunchGoGoGoApp.state.activeTheaterTransactionId = "o1";

    window.LaunchGoGoGoApp.renderStatusTheater();

    expect(document.querySelector(".actor").classList.contains("has-animation-sheets")).toBe(true);
    expect(document.querySelector(".actor-walk-sheet")).not.toBeNull();
    expect(document.querySelector(".actor-paying-sheet")).not.toBeNull();
    expect(document.querySelector(".theater-stage").getAttribute("style")).toContain("animated/runner-female/walk-right-sheet.png");
    expect(document.querySelector(".theater-stage").getAttribute("style")).toContain("animated/runner-female/paying-sheet.png");

    window.LaunchGoGoGoApp.state.transactions.push({
      id: "p1", date: "2026-04-28", type: "payment", mealType: null,
      coworkerId: "c1", storeId: null, mealName: "", amount: 120,
      paymentMethod: null, createdAt: "2026-04-28T04:05:00.000Z", updatedAt: ""
    });

    window.LaunchGoGoGoApp.renderStatusTheater();

    expect(document.querySelector(".theater-stage").classList.contains("stage-eating")).toBe(true);
    expect(document.querySelector(".actor-eating-sheet")).not.toBeNull();
    expect(document.querySelectorAll(".theater-food-prop")).toHaveLength(3);
    expect(document.querySelector(".theater-payment-fx")).not.toBeNull();
    expect(document.querySelector(".theater-stage").getAttribute("style")).toContain("animated/runner-female/sit-eat-sheet.png");
    expect(document.querySelector(".theater-stage").getAttribute("style")).toContain("props/food/bento-food-0.png");
    expect(document.querySelector(".theater-stage").getAttribute("style")).toContain("props/food/bento-food-1.png");
    expect(document.querySelector(".theater-stage").getAttribute("style")).toContain("props/food/bento-food-2.png");
  });

  it("uses pixel production theater assets when selected", () => {
    document.body.innerHTML = `<section id="statusTheater"></section>`;
    window.LaunchGoGoGoApp.state.theaterStyle = "pixel";
    document.documentElement.dataset.theaterStyle = "pixel";
    window.LaunchGoGoGoApp.state.coworkers = [
      { id: "c1", name: "Amy", balance: -120, playerCharacter: "foodie", playerGender: "male", createdAt: "", updatedAt: "" }
    ];
    window.LaunchGoGoGoApp.state.stores = [
      { id: "s1", name: "Cafe", restaurantType: "cafe", rating: 3, availableForLunch: true, availableForDinner: false, createdAt: "", updatedAt: "" }
    ];
    window.LaunchGoGoGoApp.state.transactions = [
      {
        id: "o1", date: "2026-04-28", type: "mealOrder", mealType: "lunch",
        coworkerId: "c1", storeId: "s1", mealName: "cake", amount: 120,
        paymentMethod: "unpaid", createdAt: "2026-04-28T04:00:00.000Z", updatedAt: ""
      },
      {
        id: "p1", date: "2026-04-28", type: "payment", mealType: null,
        coworkerId: "c1", storeId: null, mealName: "", amount: 120,
        paymentMethod: null, createdAt: "2026-04-28T04:05:00.000Z", updatedAt: ""
      }
    ];
    window.LaunchGoGoGoApp.state.activeTheaterTransactionId = "o1";

    window.LaunchGoGoGoApp.renderStatusTheater();

    const style = document.querySelector(".theater-stage").getAttribute("style");
    expect(style).toContain("assets/theater/pixel/stages/stage-cafe.png");
    expect(style).toContain("assets/theater/pixel/animated/foodie-male/sit-eat-sheet.png");
    expect(style).toContain("assets/theater/pixel/props/food/cafe-food-0.png");
    expect(style).toContain("assets/theater/pixel/props/food/cafe-food-1.png");
    expect(style).toContain("assets/theater/pixel/props/food/cafe-food-2.png");
    expect(style).toContain("assets/theater/pixel/npcs/server-idle-sheet.png");
    expect(style).toContain("assets/theater/pixel/fx/payment-dollar-sheet.png");
  });

  it("uses retro 16-bit production theater assets when selected", () => {
    document.body.innerHTML = `<section id="statusTheater"></section>`;
    window.LaunchGoGoGoApp.state.theaterStyle = "retro-16bit";
    document.documentElement.dataset.theaterStyle = "retro-16bit";
    window.LaunchGoGoGoApp.state.coworkers = [
      { id: "c1", name: "Kai", balance: -95, playerCharacter: "thinker", playerGender: "female", createdAt: "", updatedAt: "" }
    ];
    window.LaunchGoGoGoApp.state.stores = [
      { id: "s1", name: "Noodle", restaurantType: "noodle", rating: 3, availableForLunch: true, availableForDinner: false, createdAt: "", updatedAt: "" }
    ];
    window.LaunchGoGoGoApp.state.transactions = [
      {
        id: "o1", date: "2026-04-28", type: "mealOrder", mealType: "lunch",
        coworkerId: "c1", storeId: "s1", mealName: "ramen", amount: 95,
        paymentMethod: "unpaid", createdAt: "2026-04-28T04:00:00.000Z", updatedAt: ""
      },
      {
        id: "p1", date: "2026-04-28", type: "payment", mealType: null,
        coworkerId: "c1", storeId: null, mealName: "", amount: 95,
        paymentMethod: null, createdAt: "2026-04-28T04:05:00.000Z", updatedAt: ""
      }
    ];
    window.LaunchGoGoGoApp.state.activeTheaterTransactionId = "o1";

    window.LaunchGoGoGoApp.renderStatusTheater();

    const style = document.querySelector(".theater-stage").getAttribute("style");
    expect(style).toContain("assets/theater/retro-16bit/stages/stage-noodle.png");
    expect(style).toContain("assets/theater/retro-16bit/animated/thinker-female/sit-eat-sheet.png");
    expect(style).toContain("assets/theater/retro-16bit/props/food/noodle-food-0.png");
    expect(style).toContain("assets/theater/retro-16bit/props/food/noodle-food-1.png");
    expect(style).toContain("assets/theater/retro-16bit/props/food/noodle-food-2.png");
    expect(style).toContain("assets/theater/retro-16bit/npcs/server-idle-sheet.png");
    expect(style).toContain("assets/theater/retro-16bit/fx/payment-dollar-sheet.png");
  });

  it("uses storybook production theater assets when selected", () => {
    document.body.innerHTML = `<section id="statusTheater"></section>`;
    window.LaunchGoGoGoApp.state.theaterStyle = "storybook";
    document.documentElement.dataset.theaterStyle = "storybook";
    window.LaunchGoGoGoApp.state.coworkers = [
      { id: "c1", name: "Mina", balance: -80, playerCharacter: "runner", playerGender: "female", createdAt: "", updatedAt: "" }
    ];
    window.LaunchGoGoGoApp.state.stores = [
      { id: "s1", name: "Bento", restaurantType: "bento", rating: 3, availableForLunch: true, availableForDinner: false, createdAt: "", updatedAt: "" }
    ];
    window.LaunchGoGoGoApp.state.transactions = [
      {
        id: "o1", date: "2026-04-28", type: "mealOrder", mealType: "lunch",
        coworkerId: "c1", storeId: "s1", mealName: "bento", amount: 80,
        paymentMethod: "unpaid", createdAt: "2026-04-28T04:00:00.000Z", updatedAt: ""
      },
      {
        id: "p1", date: "2026-04-28", type: "payment", mealType: null,
        coworkerId: "c1", storeId: null, mealName: "", amount: 80,
        paymentMethod: null, createdAt: "2026-04-28T04:05:00.000Z", updatedAt: ""
      }
    ];
    window.LaunchGoGoGoApp.state.activeTheaterTransactionId = "o1";

    window.LaunchGoGoGoApp.renderStatusTheater();

    const style = document.querySelector(".theater-stage").getAttribute("style");
    expect(style).toContain("assets/theater/storybook/stages/stage-bento.png");
    expect(style).toContain("assets/theater/storybook/animated/runner-female/sit-eat-sheet.png");
    expect(style).toContain("assets/theater/storybook/props/food/bento-food-0.png");
    expect(style).toContain("assets/theater/storybook/props/food/bento-food-1.png");
    expect(style).toContain("assets/theater/storybook/props/food/bento-food-2.png");
    expect(style).toContain("assets/theater/storybook/npcs/server-idle-sheet.png");
    expect(style).toContain("assets/theater/storybook/fx/payment-dollar-sheet.png");
  });

  it("uses chibi production theater assets when selected", () => {
    document.body.innerHTML = `<section id="statusTheater"></section>`;
    window.LaunchGoGoGoApp.state.theaterStyle = "chibi";
    document.documentElement.dataset.theaterStyle = "chibi";
    window.LaunchGoGoGoApp.state.coworkers = [
      { id: "c1", name: "Nori", balance: -70, playerCharacter: "foodie", playerGender: "male", createdAt: "", updatedAt: "" }
    ];
    window.LaunchGoGoGoApp.state.stores = [
      { id: "s1", name: "Cafe", restaurantType: "cafe", rating: 3, availableForLunch: true, availableForDinner: false, createdAt: "", updatedAt: "" }
    ];
    window.LaunchGoGoGoApp.state.transactions = [
      {
        id: "o1", date: "2026-04-28", type: "mealOrder", mealType: "lunch",
        coworkerId: "c1", storeId: "s1", mealName: "cake", amount: 70,
        paymentMethod: "unpaid", createdAt: "2026-04-28T04:00:00.000Z", updatedAt: ""
      },
      {
        id: "p1", date: "2026-04-28", type: "payment", mealType: null,
        coworkerId: "c1", storeId: null, mealName: "", amount: 70,
        paymentMethod: null, createdAt: "2026-04-28T04:05:00.000Z", updatedAt: ""
      }
    ];
    window.LaunchGoGoGoApp.state.activeTheaterTransactionId = "o1";

    window.LaunchGoGoGoApp.renderStatusTheater();

    const style = document.querySelector(".theater-stage").getAttribute("style");
    expect(style).toContain("assets/theater/chibi/stages/stage-cafe.png");
    expect(style).toContain("assets/theater/chibi/animated/foodie-male/sit-eat-sheet.png");
    expect(style).toContain("assets/theater/chibi/props/food/cafe-food-0.png");
    expect(style).toContain("assets/theater/chibi/props/food/cafe-food-1.png");
    expect(style).toContain("assets/theater/chibi/props/food/cafe-food-2.png");
    expect(style).toContain("assets/theater/chibi/npcs/server-idle-sheet.png");
    expect(style).toContain("assets/theater/chibi/fx/payment-dollar-sheet.png");
  });

  it("uses painted fantasy production theater assets when selected", () => {
    document.body.innerHTML = `<section id="statusTheater"></section>`;
    window.LaunchGoGoGoApp.state.theaterStyle = "painted-fantasy";
    document.documentElement.dataset.theaterStyle = "painted-fantasy";
    window.LaunchGoGoGoApp.state.coworkers = [
      { id: "c1", name: "Iris", balance: -140, playerCharacter: "thinker", playerGender: "female", createdAt: "", updatedAt: "" }
    ];
    window.LaunchGoGoGoApp.state.stores = [
      { id: "s1", name: "Guild Hall", restaurantType: "fastFood", rating: 3, availableForLunch: true, availableForDinner: false, createdAt: "", updatedAt: "" }
    ];
    window.LaunchGoGoGoApp.state.transactions = [
      {
        id: "o1", date: "2026-04-28", type: "mealOrder", mealType: "lunch",
        coworkerId: "c1", storeId: "s1", mealName: "burger", amount: 140,
        paymentMethod: "unpaid", createdAt: "2026-04-28T04:00:00.000Z", updatedAt: ""
      },
      {
        id: "p1", date: "2026-04-28", type: "payment", mealType: null,
        coworkerId: "c1", storeId: null, mealName: "", amount: 140,
        paymentMethod: null, createdAt: "2026-04-28T04:05:00.000Z", updatedAt: ""
      }
    ];
    window.LaunchGoGoGoApp.state.activeTheaterTransactionId = "o1";

    window.LaunchGoGoGoApp.renderStatusTheater();

    const style = document.querySelector(".theater-stage").getAttribute("style");
    expect(style).toContain("assets/theater/painted-fantasy/stages/stage-fastFood.png");
    expect(style).toContain("assets/theater/painted-fantasy/animated/thinker-female/sit-eat-sheet.png");
    expect(style).toContain("assets/theater/painted-fantasy/props/food/fastFood-food-0.png");
    expect(style).toContain("assets/theater/painted-fantasy/props/food/fastFood-food-1.png");
    expect(style).toContain("assets/theater/painted-fantasy/props/food/fastFood-food-2.png");
    expect(style).toContain("assets/theater/painted-fantasy/npcs/server-idle-sheet.png");
    expect(style).toContain("assets/theater/painted-fantasy/fx/payment-dollar-sheet.png");
  });

  it("uses muted Japanese daily-life production theater assets when selected", () => {
    document.body.innerHTML = `<section id="statusTheater"></section>`;
    window.LaunchGoGoGoApp.state.theaterStyle = "muted-jp-life";
    document.documentElement.dataset.theaterStyle = "muted-jp-life";
    window.LaunchGoGoGoApp.state.coworkers = [
      { id: "c1", name: "Sora", balance: -110, playerCharacter: "runner", playerGender: "female", createdAt: "", updatedAt: "" }
    ];
    window.LaunchGoGoGoApp.state.stores = [
      { id: "s1", name: "Quiet Bento", restaurantType: "bento", rating: 3, availableForLunch: true, availableForDinner: false, createdAt: "", updatedAt: "" }
    ];
    window.LaunchGoGoGoApp.state.transactions = [
      {
        id: "o1", date: "2026-04-28", type: "mealOrder", mealType: "lunch",
        coworkerId: "c1", storeId: "s1", mealName: "bento", amount: 110,
        paymentMethod: "unpaid", createdAt: "2026-04-28T04:00:00.000Z", updatedAt: ""
      },
      {
        id: "p1", date: "2026-04-28", type: "payment", mealType: null,
        coworkerId: "c1", storeId: null, mealName: "", amount: 110,
        paymentMethod: null, createdAt: "2026-04-28T04:05:00.000Z", updatedAt: ""
      }
    ];
    window.LaunchGoGoGoApp.state.activeTheaterTransactionId = "o1";

    window.LaunchGoGoGoApp.renderStatusTheater();

    const style = document.querySelector(".theater-stage").getAttribute("style");
    expect(style).toContain("assets/theater/muted-jp-life/stages/stage-bento.png");
    expect(style).toContain("assets/theater/muted-jp-life/animated/runner-female/sit-eat-sheet.png");
    expect(style).toContain("assets/theater/muted-jp-life/props/food/bento-food-0.png");
    expect(style).toContain("assets/theater/muted-jp-life/props/food/bento-food-1.png");
    expect(style).toContain("assets/theater/muted-jp-life/props/food/bento-food-2.png");
    expect(style).toContain("assets/theater/muted-jp-life/npcs/server-idle-sheet.png");
    expect(style).toContain("assets/theater/muted-jp-life/fx/payment-dollar-sheet.png");
  });

  it("uses 90s arcade fighter production theater assets when selected", () => {
    document.body.innerHTML = `<section id="statusTheater"></section>`;
    window.LaunchGoGoGoApp.state.theaterStyle = "arcade-fighter-90s";
    document.documentElement.dataset.theaterStyle = "arcade-fighter-90s";
    window.LaunchGoGoGoApp.state.coworkers = [
      { id: "c1", name: "Ryo", balance: -160, playerCharacter: "thinker", playerGender: "male", createdAt: "", updatedAt: "" }
    ];
    window.LaunchGoGoGoApp.state.stores = [
      { id: "s1", name: "Fight Cafe", restaurantType: "cafe", rating: 3, availableForLunch: true, availableForDinner: false, createdAt: "", updatedAt: "" }
    ];
    window.LaunchGoGoGoApp.state.transactions = [
      {
        id: "o1", date: "2026-04-28", type: "mealOrder", mealType: "lunch",
        coworkerId: "c1", storeId: "s1", mealName: "coffee set", amount: 160,
        paymentMethod: "unpaid", createdAt: "2026-04-28T04:00:00.000Z", updatedAt: ""
      },
      {
        id: "p1", date: "2026-04-28", type: "payment", mealType: null,
        coworkerId: "c1", storeId: null, mealName: "", amount: 160,
        paymentMethod: null, createdAt: "2026-04-28T04:05:00.000Z", updatedAt: ""
      }
    ];
    window.LaunchGoGoGoApp.state.activeTheaterTransactionId = "o1";

    window.LaunchGoGoGoApp.renderStatusTheater();

    const style = document.querySelector(".theater-stage").getAttribute("style");
    expect(style).toContain("assets/theater/arcade-fighter-90s/stages/stage-cafe.png");
    expect(style).toContain("assets/theater/arcade-fighter-90s/animated/thinker-male/sit-eat-sheet.png");
    expect(style).toContain("assets/theater/arcade-fighter-90s/props/food/cafe-food-0.png");
    expect(style).toContain("assets/theater/arcade-fighter-90s/props/food/cafe-food-1.png");
    expect(style).toContain("assets/theater/arcade-fighter-90s/props/food/cafe-food-2.png");
    expect(style).toContain("assets/theater/arcade-fighter-90s/npcs/server-idle-sheet.png");
    expect(style).toContain("assets/theater/arcade-fighter-90s/fx/payment-dollar-sheet.png");
  });

  it("uses mecha spy race theater assets when selected", () => {
    document.body.innerHTML = `<section id="statusTheater"></section>`;
    window.LaunchGoGoGoApp.state.theaterStyle = "mecha-spy-race";
    document.documentElement.dataset.theaterStyle = "mecha-spy-race";
    window.LaunchGoGoGoApp.state.coworkers = [
      { id: "c1", name: "Anya", balance: -180, playerCharacter: "runner", playerGender: "female", createdAt: "", updatedAt: "" }
    ];
    window.LaunchGoGoGoApp.state.stores = [
      { id: "s1", name: "Mecha Race Cafe", restaurantType: "cafe", rating: 3, availableForLunch: true, availableForDinner: false, createdAt: "", updatedAt: "" }
    ];
    window.LaunchGoGoGoApp.state.transactions = [
      {
        id: "o1", date: "2026-05-17", type: "mealOrder", mealType: "lunch",
        coworkerId: "c1", storeId: "s1", mealName: "spy bento", amount: 180,
        paymentMethod: "unpaid", createdAt: "2026-05-17T04:00:00.000Z", updatedAt: ""
      },
      {
        id: "p1", date: "2026-05-17", type: "payment", mealType: null,
        coworkerId: "c1", storeId: null, mealName: "", amount: 180,
        paymentMethod: null, createdAt: "2026-05-17T04:05:00.000Z", updatedAt: ""
      }
    ];
    window.LaunchGoGoGoApp.state.activeTheaterTransactionId = "o1";

    window.LaunchGoGoGoApp.renderStatusTheater();

    const style = document.querySelector(".theater-stage").getAttribute("style");
    expect(style).toContain("assets/theater/mecha-spy-race/stages/stage-cafe.png");
    expect(style).toContain("assets/theater/mecha-spy-race/animated/runner-female/sit-eat-sheet.png");
    expect(style).toContain("assets/theater/mecha-spy-race/props/food/cafe-food-0.png");
    expect(style).toContain("assets/theater/mecha-spy-race/props/food/cafe-food-1.png");
    expect(style).toContain("assets/theater/mecha-spy-race/props/food/cafe-food-2.png");
    expect(style).toContain("assets/theater/mecha-spy-race/npcs/server-idle-sheet.png");
    expect(style).toContain("assets/theater/mecha-spy-race/fx/payment-dollar-sheet.png");
  });

  it("uses distinct mecha spy race stages and male racer assets", () => {
    document.body.innerHTML = `<section id="statusTheater"></section>`;
    window.LaunchGoGoGoApp.state.theaterStyle = "mecha-spy-race";
    document.documentElement.dataset.theaterStyle = "mecha-spy-race";
    window.LaunchGoGoGoApp.state.coworkers = [
      { id: "c1", name: "Loid", balance: -150, playerCharacter: "thinker", playerGender: "male", createdAt: "", updatedAt: "" }
    ];
    window.LaunchGoGoGoApp.state.transactions = [
      {
        id: "o1", date: "2026-05-17", type: "mealOrder", mealType: "lunch",
        coworkerId: "c1", storeId: "s1", mealName: "spy lunch", amount: 150,
        paymentMethod: "unpaid", createdAt: "2026-05-17T04:00:00.000Z", updatedAt: ""
      }
    ];
    window.LaunchGoGoGoApp.state.activeTheaterTransactionId = "o1";

    for (const restaurantType of ["bento", "drink", "noodle", "fastFood", "cafe"]) {
      window.LaunchGoGoGoApp.state.stores = [
        { id: "s1", name: restaurantType, restaurantType, rating: 3, availableForLunch: true, availableForDinner: false, createdAt: "", updatedAt: "" }
      ];

      window.LaunchGoGoGoApp.renderStatusTheater();

      const style = document.querySelector(".theater-stage").getAttribute("style");
      expect(style).toContain(`assets/theater/mecha-spy-race/stages/stage-${restaurantType}.png`);
      expect(style).toContain("assets/theater/mecha-spy-race/animated/thinker-male/walk-right-sheet.png");
      expect(document.querySelector(".anime-actor-sprite").getAttribute("src")).toBe("./assets/theater/mecha-spy-race/characters/thinker-male.png");
    }
  });

  it("uses Code Geass mecha race theater assets and restaurant-specific stages", () => {
    document.body.innerHTML = `<section id="statusTheater"></section>`;
    window.LaunchGoGoGoApp.state.theaterStyle = "geass-mecha-race";
    document.documentElement.dataset.theaterStyle = "geass-mecha-race";
    window.LaunchGoGoGoApp.state.coworkers = [
      { id: "c1", name: "Lelouch", balance: -210, playerCharacter: "thinker", playerGender: "male", createdAt: "", updatedAt: "" }
    ];
    window.LaunchGoGoGoApp.state.transactions = [
      {
        id: "o1", date: "2026-05-17", type: "mealOrder", mealType: "lunch",
        coworkerId: "c1", storeId: "s1", mealName: "royal lunch", amount: 210,
        paymentMethod: "unpaid", createdAt: "2026-05-17T04:00:00.000Z", updatedAt: ""
      },
      {
        id: "p1", date: "2026-05-17", type: "payment", mealType: null,
        coworkerId: "c1", storeId: null, mealName: "", amount: 210,
        paymentMethod: null, createdAt: "2026-05-17T04:05:00.000Z", updatedAt: ""
      }
    ];
    window.LaunchGoGoGoApp.state.activeTheaterTransactionId = "o1";

    for (const restaurantType of ["bento", "drink", "noodle", "fastFood", "cafe"]) {
      window.LaunchGoGoGoApp.state.stores = [
        { id: "s1", name: restaurantType, restaurantType, rating: 3, availableForLunch: true, availableForDinner: false, createdAt: "", updatedAt: "" }
      ];

      window.LaunchGoGoGoApp.renderStatusTheater();

      const style = document.querySelector(".theater-stage").getAttribute("style");
      expect(style).toContain(`assets/theater/geass-mecha-race/stages/stage-${restaurantType}.png`);
      expect(style).toContain("assets/theater/geass-mecha-race/animated/thinker-male/sit-eat-sheet.png");
      expect(style).toContain(`assets/theater/geass-mecha-race/props/food/${restaurantType}-food-0.png`);
      expect(style).toContain(`assets/theater/geass-mecha-race/props/food/${restaurantType}-food-1.png`);
      expect(style).toContain(`assets/theater/geass-mecha-race/props/food/${restaurantType}-food-2.png`);
      expect(style).toContain("assets/theater/geass-mecha-race/npcs/server-idle-sheet.png");
      expect(style).toContain("assets/theater/geass-mecha-race/fx/payment-dollar-sheet.png");
      expect(document.querySelector(".anime-actor-sprite").getAttribute("src")).toBe("./assets/theater/geass-mecha-race/characters/thinker-male.png");
    }
  });

  it("uses Doraemon cartoon cafe theater assets and restaurant-specific stages", () => {
    document.body.innerHTML = `<section id="statusTheater"></section>`;
    window.LaunchGoGoGoApp.state.theaterStyle = "doraemon-cartoon-cafe";
    document.documentElement.dataset.theaterStyle = "doraemon-cartoon-cafe";
    window.LaunchGoGoGoApp.state.coworkers = [
      { id: "c1", name: "Nobita", balance: -120, playerCharacter: "foodie", playerGender: "male", createdAt: "", updatedAt: "" }
    ];
    window.LaunchGoGoGoApp.state.transactions = [
      {
        id: "o1", date: "2026-05-18", type: "mealOrder", mealType: "lunch",
        coworkerId: "c1", storeId: "s1", mealName: "dorayaki lunch", amount: 120,
        paymentMethod: "unpaid", createdAt: "2026-05-18T04:00:00.000Z", updatedAt: ""
      },
      {
        id: "p1", date: "2026-05-18", type: "payment", mealType: null,
        coworkerId: "c1", storeId: null, mealName: "", amount: 120,
        paymentMethod: null, createdAt: "2026-05-18T04:05:00.000Z", updatedAt: ""
      }
    ];
    window.LaunchGoGoGoApp.state.activeTheaterTransactionId = "o1";

    for (const restaurantType of ["bento", "drink", "noodle", "fastFood", "cafe"]) {
      window.LaunchGoGoGoApp.state.stores = [
        { id: "s1", name: restaurantType, restaurantType, rating: 3, availableForLunch: true, availableForDinner: false, createdAt: "", updatedAt: "" }
      ];

      window.LaunchGoGoGoApp.renderStatusTheater();

      const style = document.querySelector(".theater-stage").getAttribute("style");
      expect(style).toContain(`assets/theater/doraemon-cartoon-cafe/stages/stage-${restaurantType}.png`);
      expect(style).toContain("assets/theater/doraemon-cartoon-cafe/animated/foodie-male/sit-eat-sheet.png");
      expect(style).toContain(`assets/theater/doraemon-cartoon-cafe/props/food/${restaurantType}-food-0.png`);
      expect(style).toContain(`assets/theater/doraemon-cartoon-cafe/props/food/${restaurantType}-food-1.png`);
      expect(style).toContain(`assets/theater/doraemon-cartoon-cafe/props/food/${restaurantType}-food-2.png`);
      expect(style).toContain("assets/theater/doraemon-cartoon-cafe/npcs/server-idle-sheet.png");
      expect(style).toContain("assets/theater/doraemon-cartoon-cafe/fx/payment-dollar-sheet.png");
      expect(document.querySelector(".anime-actor-sprite").getAttribute("src")).toBe("./assets/theater/doraemon-cartoon-cafe/characters/foodie-male.png");
    }
  });

  it("uses Shin-chan yakiniku road theater assets and restaurant-specific stages", () => {
    document.body.innerHTML = `<section id="statusTheater"></section>`;
    window.LaunchGoGoGoApp.state.theaterStyle = "shinchan-yakiniku-road";
    document.documentElement.dataset.theaterStyle = "shinchan-yakiniku-road";
    window.LaunchGoGoGoApp.state.coworkers = [
      { id: "c1", name: "Shinnosuke", balance: -180, playerCharacter: "foodie", playerGender: "male", createdAt: "", updatedAt: "" }
    ];
    window.LaunchGoGoGoApp.state.transactions = [
      {
        id: "o1", date: "2026-05-19", type: "mealOrder", mealType: "lunch",
        coworkerId: "c1", storeId: "s1", mealName: "yakiniku lunch", amount: 180,
        paymentMethod: "unpaid", createdAt: "2026-05-19T04:00:00.000Z", updatedAt: ""
      },
      {
        id: "p1", date: "2026-05-19", type: "payment", mealType: null,
        coworkerId: "c1", storeId: null, mealName: "", amount: 180,
        paymentMethod: null, createdAt: "2026-05-19T04:05:00.000Z", updatedAt: ""
      }
    ];
    window.LaunchGoGoGoApp.state.activeTheaterTransactionId = "o1";

    for (const restaurantType of ["bento", "drink", "noodle", "fastFood", "cafe"]) {
      window.LaunchGoGoGoApp.state.stores = [
        { id: "s1", name: restaurantType, restaurantType, rating: 3, availableForLunch: true, availableForDinner: false, createdAt: "", updatedAt: "" }
      ];

      window.LaunchGoGoGoApp.renderStatusTheater();

      const style = document.querySelector(".theater-stage").getAttribute("style");
      expect(style).toContain(`assets/theater/shinchan-yakiniku-road/stages/stage-${restaurantType}.png`);
      expect(style).toContain("assets/theater/shinchan-yakiniku-road/animated/foodie-male/sit-eat-sheet.png");
      expect(style).toContain(`assets/theater/shinchan-yakiniku-road/props/food/${restaurantType}-food-0.png`);
      expect(style).toContain(`assets/theater/shinchan-yakiniku-road/props/food/${restaurantType}-food-1.png`);
      expect(style).toContain(`assets/theater/shinchan-yakiniku-road/props/food/${restaurantType}-food-2.png`);
      expect(style).toContain("assets/theater/shinchan-yakiniku-road/npcs/server-idle-sheet.png");
      expect(style).toContain("assets/theater/shinchan-yakiniku-road/fx/payment-dollar-sheet.png");
      expect(document.querySelector(".anime-actor-sprite").getAttribute("src")).toBe("./assets/theater/shinchan-yakiniku-road/characters/foodie-male.png");
    }
  });

  it("uses bundled theater assets and restaurant-specific stages for new packs", () => {
    const cases = [
      { styleId: "hunter-nen-restaurant", coworker: "Gon", mealName: "hunter lunch" },
      { styleId: "hero-academy-canteen", coworker: "Hero Student", mealName: "academy lunch" },
      { styleId: "gundam-mobile-suit-canteen", coworker: "Amuro", mealName: "colony lunch" },
      { styleId: "mirmo-magical-fairy-cafe", coworker: "Mirumo", mealName: "magical sweets" }
    ];

    for (const themeCase of cases) {
      document.body.innerHTML = `<section id="statusTheater"></section>`;
      window.LaunchGoGoGoApp.state.theaterStyle = themeCase.styleId;
      document.documentElement.dataset.theaterStyle = themeCase.styleId;
      window.LaunchGoGoGoApp.state.coworkers = [
        { id: "c1", name: themeCase.coworker, balance: -180, playerCharacter: "foodie", playerGender: "male", createdAt: "", updatedAt: "" }
      ];
      window.LaunchGoGoGoApp.state.transactions = [
        {
          id: "o1", date: "2026-05-19", type: "mealOrder", mealType: "lunch",
          coworkerId: "c1", storeId: "s1", mealName: themeCase.mealName, amount: 180,
          paymentMethod: "unpaid", createdAt: "2026-05-19T04:00:00.000Z", updatedAt: ""
        },
        {
          id: "p1", date: "2026-05-19", type: "payment", mealType: null,
          coworkerId: "c1", storeId: null, mealName: "", amount: 180,
          paymentMethod: null, createdAt: "2026-05-19T04:05:00.000Z", updatedAt: ""
        }
      ];
      window.LaunchGoGoGoApp.state.activeTheaterTransactionId = "o1";

      for (const restaurantType of ["bento", "drink", "noodle", "fastFood", "cafe"]) {
        window.LaunchGoGoGoApp.state.stores = [
          { id: "s1", name: restaurantType, restaurantType, rating: 3, availableForLunch: true, availableForDinner: false, createdAt: "", updatedAt: "" }
        ];

        window.LaunchGoGoGoApp.renderStatusTheater();

        const style = document.querySelector(".theater-stage").getAttribute("style");
        expect(style).toContain(`assets/theater/${themeCase.styleId}/stages/stage-${restaurantType}.png`);
        expect(style).toContain(`assets/theater/${themeCase.styleId}/animated/foodie-male/sit-eat-sheet.png`);
        expect(style).toContain(`assets/theater/${themeCase.styleId}/props/food/${restaurantType}-food-0.png`);
        expect(style).toContain(`assets/theater/${themeCase.styleId}/props/food/${restaurantType}-food-1.png`);
        expect(style).toContain(`assets/theater/${themeCase.styleId}/props/food/${restaurantType}-food-2.png`);
        expect(style).toContain(`assets/theater/${themeCase.styleId}/npcs/server-idle-sheet.png`);
        expect(style).toContain(`assets/theater/${themeCase.styleId}/fx/payment-dollar-sheet.png`);
        expect(document.querySelector(".anime-actor-sprite").getAttribute("src")).toBe(`./assets/theater/${themeCase.styleId}/characters/foodie-male.png`);
      }
    }
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
