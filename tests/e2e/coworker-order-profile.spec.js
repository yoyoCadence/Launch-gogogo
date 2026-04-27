const { expect, test } = require("@playwright/test");

test("adds coworker group and avatar, then records an order without meal name", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "新增同事" }).click();
  await page.getByLabel("姓名").fill("Mina");
  await page.getByLabel("群組").fill("設計部");
  await page.locator('input[name="avatarFile"]').setInputFiles({
    name: "avatar.svg",
    mimeType: "image/svg+xml",
    buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#0a84ff"/></svg>')
  });
  await page.getByRole("button", { name: "儲存" }).click();

  await expect(page.locator(".group-heading").getByText("設計部")).toBeVisible();
  await expect(page.locator("#coworkerList").getByText("Mina")).toBeVisible();
  await expect(page.locator("#coworkerList img.avatar")).toHaveAttribute("src", /^data:image\/svg\+xml;base64,/);

  await page.getByRole("button", { name: "新增餐點訂單" }).click();
  await page.getByLabel("新店家名稱").fill("小巷便當");
  await page.getByLabel("金額").fill("90");
  await page.getByRole("button", { name: "儲存" }).click();

  await expect(page.getByText("小巷便當 · 未指定餐點")).toBeVisible();
});
