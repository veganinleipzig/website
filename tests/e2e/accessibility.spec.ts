import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

import { createPageIssueCollector, gotoAndWaitForPage } from "./helpers";

const pageDefinition = {
  path: "/"
} as const;

test.describe("accessibility", () => {
  test(`passes automated WCAG checks on ${pageDefinition.path}`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Accessibility audit runs once per suite.");

    const collector = createPageIssueCollector(page);

    await gotoAndWaitForPage(page, pageDefinition.path);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .disableRules(["color-contrast"])
      .analyze();

    expect(
      results.violations,
      results.violations.length > 0
        ? `Accessibility violations:\n${results.violations
            .map((violation) => `[${violation.impact}] ${violation.id}: ${violation.description}`)
            .join("\n")}`
        : "Expected no accessibility violations."
    ).toEqual([]);

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
