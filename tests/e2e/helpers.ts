import { expect, Page } from "@playwright/test";

type PageIssueCollector = {
  consoleErrors: string[];
  pageErrors: string[];
};

type GotoOptions = {
  retries?: number;
  retryDelayMs?: number;
};

export function createPageIssueCollector(page: Page): PageIssueCollector {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];

  page.on("console", (message) => {
    if (message.type() !== "error") {
      return;
    }

    consoleErrors.push(message.text());
  });

  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });

  return { consoleErrors, pageErrors };
}

export async function gotoAndWaitForPage(page: Page, path: string, options: GotoOptions = {}) {
  const retries = options.retries ?? 0;
  const retryDelayMs = options.retryDelayMs ?? 1_000;

  let response = null;
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      response = await page.goto(path, { waitUntil: "domcontentloaded" });

      if (response?.ok()) {
        break;
      }

      lastError = new Error(
        response
          ? `Expected "${path}" to load successfully, received ${response.status()}.`
          : `Expected a navigation response for "${path}".`
      );
    } catch (error) {
      lastError = error;
    }

    if (attempt < retries) {
      await page.waitForTimeout(retryDelayMs * (attempt + 1));
    }
  }

  expect(response, `Expected a navigation response for "${path}".`).not.toBeNull();
  expect(
    response?.ok(),
    lastError instanceof Error ? lastError.message : `Expected "${path}" to load successfully.`
  ).toBeTruthy();

  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(200);

  await page.evaluate(async () => {
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  });
}

export async function getRootRelativeAssetUrls(page: Page) {
  return page.evaluate(() => {
    const assetUrls = new Set<string>();

    const collect = (selector: string, attribute: "href" | "src") => {
      document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
        const value = element.getAttribute(attribute);

        if (!value || !value.startsWith("/")) {
          return;
        }

        assetUrls.add(new URL(value, window.location.origin).toString());
      });
    };

    collect('link[rel="stylesheet"][href]', "href");
    collect('link[rel="icon"][href]', "href");
    collect("script[src]", "src");
    collect("img[src]", "src");
    document.querySelectorAll<HTMLSourceElement>("source[srcset]").forEach((source) => {
      const srcset = source.getAttribute("srcset");

      if (!srcset) {
        return;
      }

      for (const candidate of srcset.split(",")) {
        const url = candidate.trim().split(/\s+/)[0];

        if (!url || !url.startsWith("/")) {
          continue;
        }

        assetUrls.add(new URL(url, window.location.origin).toString());
      }
    });

    return Array.from(assetUrls).sort();
  });
}
