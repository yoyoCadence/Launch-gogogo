const { expect, test } = require("@playwright/test");
const fs = require("fs/promises");

test("exports local data and imports a valid backup", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "新增同事" }).click();
  await page.getByLabel("姓名").fill("Amy");
  await page.getByRole("button", { name: "儲存" }).click();
  await page.getByRole("button", { name: "新增儲值金" }).click();
  await page.getByLabel("金額").fill("500");
  await page.getByRole("button", { name: "儲存" }).click();

  await page.getByRole("button", { name: "Settings" }).click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "匯出 JSON" }).click();
  const download = await downloadPromise;
  const exported = JSON.parse(await fs.readFile(await download.path(), "utf8"));

  expect(exported.app).toBe("Launch-GoGoGo");
  expect(exported.schemaVersion).toBe(1);
  expect(exported.data.coworkers[0].name).toBe("Amy");
  expect(exported.data.transactions[0].amount).toBe(500);

  page.once("dialog", (dialog) => dialog.accept());
  await page.locator("#importDataInput").setInputFiles({
    name: "backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(makeBackupPayload()))
  });

  await expect(page.getByText("匯入完成，已重新計算餘額與店家統計。")).toBeVisible();
  await page.getByRole("button", { name: "Ledger" }).click();
  await expect(page.locator("#coworkerList").getByText("Ben")).toBeVisible();
  await expect(page.locator("#coworkerList").getByText("$200", { exact: true })).toBeVisible();
  await expect(page.locator("#coworkerList").getByText("Amy")).toHaveCount(0);
});

function makeBackupPayload() {
  return {
    app: "Launch-GoGoGo",
    schemaVersion: 1,
    exportedAt: "2026-04-26T00:00:00.000Z",
    data: {
      coworkers: [{
        id: "ben",
        name: "Ben",
        balance: 999,
        createdAt: "2026-04-26T00:00:00.000Z",
        updatedAt: "2026-04-26T00:00:00.000Z"
      }],
      stores: [],
      transactions: [{
        id: "topup-ben",
        date: "2026-04-26",
        type: "topup",
        mealType: null,
        coworkerId: "ben",
        storeId: null,
        mealName: "",
        amount: 200,
        paymentMethod: null,
        note: "Imported balance",
        createdAt: "2026-04-26T00:00:00.000Z",
        updatedAt: "2026-04-26T00:00:00.000Z"
      }]
    }
  };
}
