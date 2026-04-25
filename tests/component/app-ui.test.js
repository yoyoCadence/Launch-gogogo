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
    window.LaunchGoGoGoApp.state.theme = "default";
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

    window.LaunchGoGoGoApp.bindOrderStoreToggle();

    expect(field.classList.contains("hidden")).toBe(false);
    expect(input.required).toBe(true);

    select.insertAdjacentHTML("afterbegin", '<option value="existing">Existing</option>');
    select.value = "existing";
    select.dispatchEvent(new Event("change"));

    expect(field.classList.contains("hidden")).toBe(true);
    expect(input.required).toBe(false);
  });

  it("renders the selected theme as pressed and updates the current name", () => {
    document.body.innerHTML = `
      <span id="currentThemeName"></span>
      <div id="themeGrid"></div>
    `;
    window.LaunchGoGoGoApp.state.theme = "github";

    window.LaunchGoGoGoApp.renderSettings();

    expect(document.querySelector("#currentThemeName").textContent).toBe("GitHub");
    expect(document.querySelector('[data-theme-id="github"]').getAttribute("aria-pressed")).toBe("true");
    expect(document.querySelector('[data-theme-id="default"]').getAttribute("aria-pressed")).toBe("false");
  });
});
