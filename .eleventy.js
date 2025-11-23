// ─────────────────────────────────────────────────────────────────────────────
// ELEVENTY CONFIGURATION
// This file configures how Eleventy builds your static site
// Documentation: https://www.11ty.dev/docs/config/
// ─────────────────────────────────────────────────────────────────────────────

// 📦 Plugin Imports
const pluginImages = require("@codestitchofficial/eleventy-plugin-sharp-images");
const pluginMinifier = require("@codestitchofficial/eleventy-plugin-minify");
const pluginNavigation = require("@11ty/eleventy-navigation");
const pluginSitemap = require("@quasibit/eleventy-plugin-sitemap");
const { EleventyI18nPlugin } = require("@11ty/eleventy");

// ⚙️ Configuration Files
const configSitemap = require("./src/config/plugins/sitemap");
const configImages = require("./src/config/plugins/images");
const configI18n = require("./src/config/plugins/i18n");

// 🔧 Processing Functions
const javascript = require("./src/config/processors/javascript");

// 🛠️ Utilities
const filterPostDate = require("./src/config/filters/postDate");
const filterIsoDate = require("./src/config/filters/isoDate");
const isProduction = process.env.ELEVENTY_ENV === "PROD";

module.exports = function (eleventyConfig) {
  // ═════════════════════════════════════════════════════════════════════════
  // LANGUAGES
  // Using Eleventy's build events to process non-template languages
  // Learn more: https://www.11ty.dev/docs/events/
  // ═════════════════════════════════════════════════════════════════════════

  /*
   * JavaScript Processing
   * These processors handle bundling, transpiling, and minification
   * - JavaScript: Compiled with esbuild for modern bundling
   */
  eleventyConfig.on("eleventy.after", javascript);

  // ═════════════════════════════════════════════════════════════════════════
  // PLUGINS
  // Extend Eleventy with additional functionality
  // Learn more: https://www.11ty.dev/docs/plugins/
  // ═════════════════════════════════════════════════════════════════════════

  /*
   * 🖼️ Image Optimization
   * Resize and optimize images for better performance using {% getUrl %}
   * Documentation: https://github.com/CodeStitchOfficial/eleventy-plugin-sharp-images
   */
  eleventyConfig.addPlugin(pluginImages, configImages);

  /*
   * 🧭 Navigation Plugin
   * Enables hierarchical navigation structure via front matter
   * Documentation: https://www.11ty.dev/docs/plugins/navigation/
   */
  eleventyConfig.addPlugin(pluginNavigation);

  /*
   * 🗺️ Sitemap Generation
   * Creates sitemap.xml automatically using domain from _data/client.json
   * Documentation: https://github.com/quasibit/eleventy-plugin-sitemap
   */
  eleventyConfig.addPlugin(EleventyI18nPlugin, configI18n);

  /*
   * 🌍 Internationalization (i18n) Plugin
   * Adds support for translating content and generating localized URLs
   * Documentation: https://www.11ty.dev/docs/plugins/i18n/
   */
  eleventyConfig.addPlugin(pluginSitemap, configSitemap);

  /*
   * 📦 Production Minification
   * Minifies HTML, CSS, JSON, XML, XSL, and webmanifest files
   * Only runs during production builds (npm run build)
   * Documentation: https://github.com/CodeStitchOfficial/eleventy-plugin-minify
   */
  if (isProduction) {
    eleventyConfig.addPlugin(pluginMinifier);
  }

  // ═════════════════════════════════════════════════════════════════════════
  // PASSTHROUGH COPIES
  // Copy files directly to output without processing
  // Learn more: https://www.11ty.dev/docs/copy/
  // ═════════════════════════════════════════════════════════════════════════

  eleventyConfig.addPassthroughCopy("./src/assets"); // Static assets
  eleventyConfig.addPassthroughCopy("./src/admin"); // CMS admin files
  eleventyConfig.addPassthroughCopy("./src/_redirects"); // Redirect rules

  // ═════════════════════════════════════════════════════════════════════════
  // FILTERS
  // Transform data in templates at build time
  // Learn more: https://www.11ty.dev/docs/filters/
  // ═════════════════════════════════════════════════════════════════════════

  /*
   * 📅 Human-Readable Date Formatting Filter
   * Converts JavaScript dates to human-readable format
   * Usage: {{ "2023-12-02" | postDate }}
   * Powered by Luxon: https://moment.github.io/luxon/api-docs/
   */
  eleventyConfig.addFilter("postDate", filterPostDate);

  /*
   * 📅 ISO Date Formatting Filter
   * Converts JavaScript dates to ISO 8601 format
   * Usage: {{ "2023-12-02" | isoDate }}
   * Powered by Luxon: https://moment.github.io/luxon/api-docs/
   */
  eleventyConfig.addFilter("isoDate", filterIsoDate);

  /*
   * 🔢 Limit Filter
   * Returns a limited number of items from the beginning of an array
   * Usage: {{ collection | limit(5) }}
   * Useful for truncating lists, e.g. showing only the latest N items
   */
  eleventyConfig.addFilter("limit", function (array, limit) {
    return array.slice(0, limit);
  });

  /*
   * 🏷️ Page Language Filter
   * Filters collections by the current page language for i18n compatibility
   * Usage: {{ collections.all | pageLang | eleventyNavigation }}
   */
  eleventyConfig.addFilter("pageLang", function (value) {
    return value.filter((item) => item.page.lang === this.page.lang);
  });

  /*
   * 🔍 Property Equality Filter
   * Filters a collection based on a specific property and its exact value.
   * Useful for filtering items like adopted animals, specific breeds, etc.
   * Usage: {{ collections.adoption | where("adopted", true) }}
   */
  eleventyConfig.addFilter("where", function (collection, propName, value) {
    if (!Array.isArray(collection)) return [];
    return collection.filter((item) => {
      // Get the value from frontmatter/data
      const propValue = item.data?.[propName];

      // Support booleans, strings, numbers
      return propValue === value;
    });
  });

  // Filter products by category and language
  eleventyConfig.addFilter(
    "categoryProducts",
    function (products, categoryName, lang = "cs") {
      if (!Array.isArray(products)) return [];
      return products.filter((product) => {
        const hasCategory = product.data?.category === categoryName;
        const hasLang = product.data?.tags && product.data.tags.includes(lang);
        return hasCategory && hasLang;
      });
    }
  );

  // ─────────────────────────────────────────────────────────────────────────
  // PRODUCTS: collections + helpers
  // ─────────────────────────────────────────────────────────────────────────

  // Jednoduché slugování s podporou diakritiky (CZ)
  const slugify = (s = "") =>
    s
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  // Umožní použít {{ category | slug }} v šablonách i permalincích
  eleventyConfig.addFilter("slug", slugify);

  // Kolekce všech produktů (tag "product"), seřazené podle title (CZ kolace)
  eleventyConfig.addCollection("products", (api) => {
    return api
      .getFilteredByTag("product")
      .sort((a, b) =>
        (a.data.title || "").localeCompare(b.data.title || "", "cs")
      );
  });

  // Kolekce kategorií: seskupení produktů podle data.category
  // Filtrované na češtinu (i18n) přes tag 'cs' místo cesty
  eleventyConfig.addCollection("categories", (api) => {
    const items = api
      .getFilteredByTag("product")
      .filter((it) => it.data.tags && it.data.tags.includes("cs"));

    // Get category definition files
    const categoryFiles = api
      .getAll()
      .filter(
        (item) =>
          item.inputPath.includes("/katalog/") &&
          item.inputPath.endsWith("/index.md") &&
          item.data.layout === "layouts/category.njk"
      );

    const map = new Map();
    for (const it of items) {
      const name = it.data.category || "Nezařazené";
      if (!map.has(name)) map.set(name, []);
      map.get(name).push(it);
    }

    const slugify = (s = "") =>
      s
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const result = [...map.entries()]
      .map(([name, arr]) => {
        // Find matching category file
        const categoryFile = categoryFiles.find(
          (file) => file.data.name === name || file.data.slug === slugify(name)
        );

        return {
          name,
          slug: slugify(name),
          description: categoryFile?.data.description || "",
          image: categoryFile?.data.image || "",
          count: arr.length,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name, "cs"));

    return result;
  });

  // ═════════════════════════════════════════════════════════════════════════
  // BUILD CONFIGURATION
  // Define input/output directories and template engine
  // ═════════════════════════════════════════════════════════════════════════

  return {
    dir: {
      input: "src", // Source files directory
      output: "public", // Build output directory
      includes: "_includes", // Partial templates directory
      data: "_data", // Global data files directory
    },
    htmlTemplateEngine: "njk", // Nunjucks for HTML templates
  };
};
