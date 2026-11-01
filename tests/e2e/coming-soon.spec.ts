import { expect, test } from "@playwright/test";
import { siteConfig } from "../../src/config/site";

test.skip(!siteConfig.comingSoon, "Only runs while the site is in coming soon mode");

for (const path of ["/", "/about", "/projects", "/post/music-and-code"]) {
  test(`${path} shows only the coming soon screen`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByText("Coming soon", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { level: 1, name: siteConfig.name })).toBeVisible();
    await expect(page.getByRole("navigation")).toHaveCount(0);
    await expect(page.getByRole("contentinfo")).toHaveCount(0);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });
}
