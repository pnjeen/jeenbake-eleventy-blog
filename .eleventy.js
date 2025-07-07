const { DateTime } = require("luxon");
const slugify = require("slugify");
const util = require("util");
const fs = require("fs");
const path = require("path");
const pluginSitemap = require("@quasibit/eleventy-plugin-sitemap");

module.exports = function (eleventyConfig) {
  // ------------------------------
  // 1. Shortcodes
  // ------------------------------
  eleventyConfig.addShortcode("currentYear", () => `${new Date().getFullYear()}`);

  // ------------------------------
  // 2. Filters
  // ------------------------------
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat("MMMM d, yyyy");
  });

  eleventyConfig.addFilter("slug", (input) => {
    if (!input) return '';
    return slugify(input.toString(), {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });
  });

  eleventyConfig.addFilter("debug", (value) => {
    return util.inspect(value, { compact: false });
  });

  // ------------------------------
  // 3. Collections
  // ------------------------------
  eleventyConfig.addCollection("blogPosts", (collectionApi) => {
    const now = DateTime.now();

    return collectionApi.getFilteredByTag("post")
      .filter(item => {
        const date = item.date ? DateTime.fromJSDate(item.date) : null;
        const isFuture = date && date > now;
        const isDraft = item.data.draft === true;

        // Mark for sitemap exclusion
        item.data.eleventyExcludeFromSitemap = isDraft || isFuture;

        return !isDraft && !isFuture;
      })
      .reverse();
  });

  eleventyConfig.addCollection("tagList", (collection) => {
    const tagSet = new Set();
    collection.getAll().forEach(item => {
      if (!item.data.tags) return;

      const tags = Array.isArray(item.data.tags)
        ? item.data.tags
        : [item.data.tags];

      tags.forEach(tag => {
        if (typeof tag === 'string' && tag !== 'post') {
          tagSet.add(tag);
        }
      });
    });
    return Array.from(tagSet).sort();
  });

  eleventyConfig.addCollection("categories", (collectionApi) => {
    const categoryMap = new Map();
    const now = DateTime.now();

    collectionApi.getFilteredByTag("post").forEach(item => {
      const date = item.date ? DateTime.fromJSDate(item.date) : null;
      const isFuture = date && date > now;
      const isDraft = item.data.draft === true;

      // Mark for sitemap exclusion
      item.data.eleventyExcludeFromSitemap = isDraft || isFuture;
      if (isDraft || isFuture) return;

      const category = item.data.category;
      if (category) {
        const key = category.toLowerCase();
        if (!categoryMap.has(key)) {
          categoryMap.set(key, {
            name: category,
            slug: slugify(category, { lower: true, strict: true }),
            items: [],
          });
        }
        categoryMap.get(key).items.push(item);
      }
    });

    return Array.from(categoryMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  });

  eleventyConfig.addCollection("categoryList", (collectionApi) => {
    const categorySet = new Set();
    const now = DateTime.now();

    collectionApi.getFilteredByTag("post").forEach(item => {
      const date = item.date ? DateTime.fromJSDate(item.date) : null;
      const isFuture = date && date > now;
      const isDraft = item.data.draft === true;

      item.data.eleventyExcludeFromSitemap = isDraft || isFuture;
      if (!isDraft && !isFuture && item.data.category) {
        categorySet.add(item.data.category);
      }
    });

    return Array.from(categorySet).sort();
  });

  // ------------------------------
  // 4. Global Data
  // ------------------------------
  eleventyConfig.addGlobalData("env", process.env.ELEVENTY_ENV || "development");

  // ------------------------------
  // 5. robots.txt handling
  // ------------------------------
  eleventyConfig.on('eleventy.before', () => {
    const env = process.env.ELEVENTY_ENV;
    const sourceFile =
      env === "production"
        ? "robots.production.txt"
        : env === "staging"
        ? "robots.staging.txt"
        : null;

    if (sourceFile) {
      const source = path.join(__dirname, sourceFile);
      const target = path.join(__dirname, "src", "robots.txt");

      if (fs.existsSync(source)) {
        fs.copyFileSync(source, target);
        console.log(`✅ Copied ${sourceFile} → src/robots.txt`);
      } else {
        console.warn(`⚠️ ${sourceFile} not found — skipping copy.`);
      }
    }
  });

  // ------------------------------
  // 6. Passthrough Copy
  // ------------------------------
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("src/admin");

  // ------------------------------
  // 7. Sitemap Plugin
  // ------------------------------
  eleventyConfig.addPlugin(pluginSitemap, {
    sitemap: {
      hostname: "https://jeenbake.com",
      changefreq: "weekly",
      priority: 0.7
    }
  });

  // ------------------------------
  // 8. Return Configuration
  // ------------------------------
  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site",
      data: "_data"
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    passthroughFileCopy: true
  };
};
