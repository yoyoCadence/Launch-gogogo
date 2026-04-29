const { test, expect } = require("@playwright/test");

test("adds and removes sample data from settings", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Settings" }).click();
  page.once("dialog", async (dialog) => {
    expect(dialog.message()).toContain("測試用範例資料");
    await dialog.accept();
  });
  await page.locator("#sampleDataToggle").check();

  await page.getByRole("button", { name: "Ledger" }).click();
  await expect(page.locator("#coworkerList").getByText("範例A同事")).toBeVisible();
  await expect(page.locator("#coworkerList").getByText("範例E同事")).toBeVisible();
  await expect(page.locator("#coworkerList").getByText("目前欠款")).toHaveCount(5);

  await page.getByRole("button", { name: "Lunch" }).click();
  await expect(page.locator("#lunchStoreList").getByText("範例A店家")).toBeVisible();
  await expect(page.locator("#lunchStoreList").getByText("範例E店家")).toBeVisible();

  await page.getByRole("button", { name: "Settings" }).click();
  page.once("dialog", async (dialog) => {
    expect(dialog.message()).toContain("移除測試用範例資料");
    await dialog.accept();
  });
  await page.locator("#sampleDataToggle").uncheck();

  await page.getByRole("button", { name: "Ledger" }).click();
  await expect(page.locator("#coworkerList").getByText("範例A同事")).toHaveCount(0);

  await page.getByRole("button", { name: "Lunch" }).click();
  await expect(page.locator("#lunchStoreList").getByText("範例A店家")).toHaveCount(0);
});
