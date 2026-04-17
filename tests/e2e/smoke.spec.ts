import { expect, test } from "@playwright/test";

import { createPageIssueCollector, gotoAndWaitForPage } from "./helpers";

const pageDefinition = {
  path: "/",
  expectedTitle: "Vegan in Leipzig"
} as const;

const coreSectionIds = ["page-top", "folge-uns-hier", "initiativen-in-leipzig", "impressum"] as const;

test.describe("smoke", () => {
  test(`renders the core page structure on ${pageDefinition.path}`, async ({ page }, testInfo) => {
    const collector = createPageIssueCollector(page);

    await gotoAndWaitForPage(page, pageDefinition.path);

    await expect(page).toHaveTitle(pageDefinition.expectedTitle);
    await expect(page.locator("main#main")).toBeVisible();

    for (const sectionId of coreSectionIds) {
      await expect(page.locator(`#${sectionId}`), `Expected #${sectionId} to be visible.`).toBeVisible();
    }

    expect(
      await page.locator(".follow-grid .follow-card").count(),
      "Expected at least one follow card."
    ).toBeGreaterThan(0);
    expect(
      await page.locator(".initiative-grid .initiative-card").count(),
      "Expected at least one initiative card."
    ).toBeGreaterThan(0);

    const measurement = await page.evaluate(() => {
      const root = document.documentElement;

      return {
        clientWidth: root.clientWidth,
        scrollWidth: root.scrollWidth
      };
    });

    expect(
      measurement.scrollWidth - measurement.clientWidth,
      `Expected no horizontal overflow in ${testInfo.project.name}.`
    ).toBeLessThanOrEqual(2);

    expect(
      collector.consoleErrors,
      collector.consoleErrors.length > 0
        ? `Unexpected console errors:\n${collector.consoleErrors.join("\n")}`
        : "Expected no console errors."
    ).toEqual([]);

    expect(
      collector.pageErrors,
      collector.pageErrors.length > 0
        ? `Unexpected page errors:\n${collector.pageErrors.join("\n")}`
        : "Expected no page errors."
    ).toEqual([]);
  });
});
