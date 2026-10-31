import { expect, test, type Page } from "@playwright/test";

/** On small screens the nav links live behind the menu button. */
async function clickNav(page: Page, label: string) {
  const menuButton = page.getByRole("button", { name: "Open menu" });
  if (await menuButton.isVisible()) await menuButton.click();
  await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: label }).click();
}

test("navigates between every page", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Swift Notes" })).toBeVisible();

  await clickNav(page, "About");
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole("heading", { level: 1, name: "About" })).toBeVisible();

  await clickNav(page, "Projects");
  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.getByRole("heading", { level: 2, name: "Pulse" })).toBeVisible();

  await clickNav(page, "Blog");
  await expect(page).toHaveURL(/\/$/);

  await page.getByRole("link", { name: /What Playing Jazz Taught Me/ }).click();
  await expect(page).toHaveURL(/\/post\/music-and-code$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "What Playing Jazz Taught Me About Writing Code",
  );

  await page.getByRole("link", { name: "Back to blog" }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("search and tag filters narrow the post list", async ({ page }) => {
  await page.goto("/");
  const cards = page.locator('a[href^="/post/"]');
  await expect(cards).toHaveCount(4);

  await page.getByRole("button", { name: "Career" }).click();
  await expect(cards).toHaveCount(1);
  await page.getByRole("button", { name: "Career" }).click();
  await expect(cards).toHaveCount(4);

  await page.getByRole("searchbox", { name: "Search posts" }).fill("design system");
  await expect(cards).toHaveCount(1);

  await page.getByRole("searchbox", { name: "Search posts" }).fill("zzzz");
  await expect(page.getByText("No posts found.")).toBeVisible();
});

test("code blocks have a copy button", async ({ page, context, browserName }) => {
  test.skip(browserName !== "chromium", "Clipboard permissions are Chromium-only here");
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/post/understanding-swift-concurrency");
  const copy = page.getByRole("button", { name: "Copy code" }).first();
  await copy.click();
  await expect(page.getByRole("button", { name: "Copied to clipboard" }).first()).toBeVisible();
  const text = await page.evaluate(() => navigator.clipboard.readText());
  expect(text).toContain("func fetchUser");
});

test("newsletter form validates and confirms", async ({ page }) => {
  await page.goto("/");
  const input = page.getByLabel("Email address");
  const submit = page.getByRole("button", { name: "Subscribe" });

  await input.fill("not-an-email");
  await submit.click();
  await expect(page.getByText("Invalid email")).toBeVisible();

  await input.fill("reader@example.com");
  await submit.click();
  await expect(page.getByText("You're subscribed!")).toBeVisible();
  await expect(input).toHaveValue("");
});

test("unknown pages show the 404 page", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
});
