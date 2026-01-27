/**
 * Product Search Index Generator
 * Generates a JSON array of all products for client-side search
 */

module.exports = function () {
  const fs = require("fs");
  const path = require("path");
  const matter = require("gray-matter");

  const productsDir = path.join(__dirname, "../products");
  const products = [];

  /**
   * Recursively find all .md files in products/
   */
  function findProductFiles(dir) {
    if (!fs.existsSync(dir)) {
      console.warn("Products directory not found:", dir);
      return;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    entries.forEach((entry) => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        findProductFiles(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        try {
          const content = fs.readFileSync(fullPath, "utf8");
          const { data } = matter(content);

          if (data.title && data.category && data.slug) {
            // Generate URL from category and slug
            const categorySlug = data.category
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, "");

            products.push({
              title: data.title,
              url: `/cs/katalog/${categorySlug}/${data.slug}/`,
              category: data.category,
            });
          }
        } catch (err) {
          console.warn(`Failed to parse ${fullPath}:`, err.message);
        }
      }
    });
  }

  findProductFiles(productsDir);

  console.log(`✓ Search index: Generated ${products.length} products`);

  return products;
};
