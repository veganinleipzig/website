const MarkdownIt = require("markdown-it");

module.exports = function (eleventyConfig) {
  const pathPrefix = process.env.ELEVENTY_PATH_PREFIX || "/";
  const outputDir = process.env.ELEVENTY_OUTPUT_DIR || "output/site";
  const cmsMarkdown = new MarkdownIt({
    html: true,
    breaks: true,
    linkify: true
  });

  eleventyConfig.addFilter("cmsInline", function (value) {
    if (value === null || value === undefined) {
      return "";
    }

    return cmsMarkdown.renderInline(String(value));
  });

  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/assets/fonts");
  eleventyConfig.addWatchTarget("src/assets/fonts/");

  return {
    pathPrefix,
    dir: {
      input: "src",
      output: outputDir,
      data: "_data"
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk"
  };
};
