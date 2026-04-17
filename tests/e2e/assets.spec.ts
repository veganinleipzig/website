import { expect, test } from "@playwright/test";

import { createPageIssueCollector, getRootRelativeAssetUrls, gotoAndWaitForPage } from "./helpers";

const pageDefinition = {
  path: "/"
} as const;

const assetResourceTypes = new Set(["stylesheet", "script", "image", "font"]);

test.describe("asset integrity", () => {
  test(`loads same-origin assets without failures on ${pageDefinition.path}`, async ({ page, request }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Asset integrity runs once per suite.");

    const collector = createPageIssueCollector(page);
    const failedResponses: Array<{ status: number; type: string; url: string }> = [];
    const origin = new URL(testInfo.project.use.baseURL as string).origin;

    page.on("response", (response) => {
      const requestInfo = response.request();
      const type = requestInfo.resourceType();

      if (!assetResourceTypes.has(type)) {
        return;
      }

      if (!response.url().startsWith(origin)) {
        return;
      }

      if (response.status() >= 400) {
        failedResponses.push({
          status: response.status(),
          type,
          url: response.url()
        });
      }
    });

    await gotoAndWaitForPage(page, pageDefinition.path);

    const assetUrls = await getRootRelativeAssetUrls(page);
    expect(assetUrls.length, "Expected root-relative assets to be present in the rendered page.").toBeGreaterThan(0);

    const assetFailures: string[] = [];

    for (const assetUrl of assetUrls) {
      const response = await request.get(assetUrl);

      if (!response.ok()) {
        assetFailures.push(`${response.status()} ${assetUrl}`);
      }
    }

    expect(
      failedResponses,
      failedResponses.length > 0
        ? `Expected no same-origin asset request failures:\n${failedResponses
            .map((failure) => `${failure.status} ${failure.type} ${failure.url}`)
            .join("\n")}`
        : "Expected no same-origin asset request failures."
    ).toEqual([]);

    expect(
      assetFailures,
      assetFailures.length > 0
        ? `Expected all root-relative assets to return 2xx:\n${assetFailures.join("\n")}`
        : "Expected all root-relative assets to return 2xx."
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
