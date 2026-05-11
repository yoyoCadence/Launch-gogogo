const { expect, test } = require("@playwright/test");

test("records a coworker topup and a prepaid lunch order", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "新增同事" }).click();
  await page.getByLabel("姓名").fill("Amy");
  await page.getByRole("button", { name: "儲存" }).click();
  await expect(page.locator("#coworkerList").getByText("Amy")).toBeVisible();

  await page.getByRole("button", { name: "新增儲值金" }).click();
  await page.getByLabel("金額").fill("500");
  await page.getByRole("button", { name: "儲存" }).click();
  await expect(page.locator("#coworkerList").getByText("$500", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "新增餐點訂單" }).click();
  await page.getByLabel("餐別").selectOption("lunch");
  await page.getByLabel("餐點名稱").fill("雞腿飯");
  await page.getByLabel("新店家名稱").fill("阿明便當");
  await page.getByLabel("金額").fill("120");
  await page.getByRole("button", { name: "儲存" }).click();

  await expect(page.getByText("$380")).toBeVisible();
  await expect(page.getByText("餐點合計 $120")).toBeVisible();
  await expect(page.locator("#statusTheater")).toContainText("已用儲值金扣款");
  await expect(page.locator("#statusTheater .theater-stage")).toHaveClass(/stage-eating/);

  await page.locator('[data-action="toggle-theater"]').click();
  await expect(page.locator("body")).toHaveClass(/theater-collapsed/);

  await page.getByRole("button", { name: "Settings" }).click();
  await page.getByRole("button", { name: /日本動漫風格/ }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theater-style", "anime");
  await page.locator('[data-action="toggle-settings-theater"]').click();
  await page.locator('[data-theater-style-id="pixel"]').click();
  await expect(page.locator("html")).toHaveAttribute("data-theater-style", "pixel");
  await page.locator('[data-theater-style-id="retro-16bit"]').click();
  await expect(page.locator("html")).toHaveAttribute("data-theater-style", "retro-16bit");
  await page.locator('[data-theater-style-id="storybook"]').click();
  await expect(page.locator("html")).toHaveAttribute("data-theater-style", "storybook");
  await page.locator('[data-theater-style-id="chibi"]').click();
  await expect(page.locator("html")).toHaveAttribute("data-theater-style", "chibi");
  await page.locator('[data-theater-style-id="painted-fantasy"]').click();
  await expect(page.locator("html")).toHaveAttribute("data-theater-style", "painted-fantasy");
  await page.locator('[data-theater-style-id="muted-jp-life"]').click();
  await expect(page.locator("html")).toHaveAttribute("data-theater-style", "muted-jp-life");
  await page.locator('[data-theater-style-id="arcade-fighter-90s"]').click();
  await expect(page.locator("html")).toHaveAttribute("data-theater-style", "arcade-fighter-90s");

  await page.getByRole("button", { name: "Ledger" }).click();
  await expect(page.locator("#statusTheater .anime-actor-sprite")).toHaveJSProperty("naturalWidth", 128);
  await expect(page.locator("#statusTheater .theater-stage")).toHaveAttribute("style", /assets\/theater\/arcade-fighter-90s\/animated\//);

  await page.getByRole("button", { name: "Dinner" }).click();
  await expect(page.locator("#statusTheater")).toBeHidden();

  await page.getByRole("button", { name: "Lunch" }).click();
  await expect(page.locator("#statusTheater")).toBeHidden();
  await expect(page.locator("#lunchStoreList").getByText("阿明便當", { exact: true })).toBeVisible();
  await expect(page.locator("#lunchStoreList").getByText("吃過 1 次")).toBeVisible();
});
