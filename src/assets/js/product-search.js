/**
 * Product Search - Typeahead with diacritic normalization
 * Zero dependencies, vanilla JS
 */
(function () {
  "use strict";

  // Configuration
  const CONFIG = {
    indexUrl: "/assets/data/products-index.json",
    maxResults: 10,
    minChars: 1,
  };

  // State
  let productsIndex = [];
  let currentFocus = -1;
  let isOpen = false;

  // DOM elements
  const searchInput = document.getElementById("product-search");
  const resultsContainer = document.getElementById("search-results");
  const noResultsMsg = document.getElementById("search-no-results");

  if (!searchInput || !resultsContainer || !noResultsMsg) {
    console.warn("Product search: Required elements not found");
    return;
  }

  /**
   * Remove diacritics from Czech text for better matching
   */
  function removeDiacritics(str) {
    const diacriticsMap = {
      á: "a",
      č: "c",
      ď: "d",
      é: "e",
      ě: "e",
      í: "i",
      ň: "n",
      ó: "o",
      ř: "r",
      š: "s",
      ť: "t",
      ú: "u",
      ů: "u",
      ý: "y",
      ž: "z",
      Á: "A",
      Č: "C",
      Ď: "D",
      É: "E",
      Ě: "E",
      Í: "I",
      Ň: "N",
      Ó: "O",
      Ř: "R",
      Š: "S",
      Ť: "T",
      Ú: "U",
      Ů: "U",
      Ý: "Y",
      Ž: "Z",
    };

    return str.replace(
      /[^\u0000-\u007E]/g,
      (char) => diacriticsMap[char] || char
    );
  }

  /**
   * Normalize string for comparison
   */
  function normalize(str) {
    return removeDiacritics(str.toLowerCase().trim());
  }

  /**
   * Escape HTML to prevent XSS
   */
  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Highlight matching portion of text
   */
  function highlightMatch(text, query) {
    const normalizedText = normalize(text);
    const normalizedQuery = normalize(query);
    const index = normalizedText.indexOf(normalizedQuery);

    if (index === -1) return escapeHtml(text);

    const before = text.substring(0, index);
    const match = text.substring(index, index + query.length);
    const after = text.substring(index + query.length);

    return (
      escapeHtml(before) +
      '<strong class="text-[#E92429]">' +
      escapeHtml(match) +
      "</strong>" +
      escapeHtml(after)
    );
  }

  /**
   * Search products by title
   */
  function searchProducts(query) {
    if (!query || query.length < CONFIG.minChars) return [];

    const normalizedQuery = normalize(query);

    // Filter and score results
    const results = productsIndex
      .map((product) => {
        const normalizedTitle = normalize(product.title);
        const startsWith = normalizedTitle.startsWith(normalizedQuery);
        const contains = normalizedTitle.includes(normalizedQuery);

        if (!contains) return null;

        return {
          ...product,
          score: startsWith ? 1 : 0.5, // Prioritize starts-with matches
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, "cs"))
      .slice(0, CONFIG.maxResults);

    return results;
  }

  /**
   * Render search results
   */
  function renderResults(results, query) {
    if (results.length === 0) {
      closeResults();
      noResultsMsg.classList.remove("hidden");
      return;
    }

    noResultsMsg.classList.add("hidden");

    const html = results
      .map(
        (product, index) => `
      <a
        href="${escapeHtml(product.url)}"
        class="search-result block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 focus:bg-gray-50 focus:outline-none transition-colors cursor-pointer"
        role="option"
        aria-selected="false"
        data-index="${index}"
      >
        <div class="font-semibold text-gray-900 font-heading text-sm md:text-base">
          ${highlightMatch(product.title, query)}
        </div>
        <div class="text-xs md:text-sm text-gray-500 mt-1 font-body">
          ${escapeHtml(product.category)}
        </div>
      </a>
    `
      )
      .join("");

    resultsContainer.innerHTML = html;
    openResults();
  }

  /**
   * Open results dropdown
   */
  function openResults() {
    resultsContainer.classList.remove("hidden");
    searchInput.setAttribute("aria-expanded", "true");
    isOpen = true;
    currentFocus = -1;
  }

  /**
   * Close results dropdown
   */
  function closeResults() {
    resultsContainer.classList.add("hidden");
    noResultsMsg.classList.add("hidden");
    searchInput.setAttribute("aria-expanded", "false");
    isOpen = false;
    currentFocus = -1;
    removeActiveStates();
  }

  /**
   * Remove active state from all results
   */
  function removeActiveStates() {
    const results = resultsContainer.querySelectorAll(".search-result");
    results.forEach((result) => {
      result.classList.remove("bg-gray-50");
      result.setAttribute("aria-selected", "false");
    });
  }

  /**
   * Set active state on result
   */
  function setActive(index) {
    const results = resultsContainer.querySelectorAll(".search-result");
    if (index < 0 || index >= results.length) return;

    removeActiveStates();
    currentFocus = index;

    const activeResult = results[index];
    activeResult.classList.add("bg-gray-50");
    activeResult.setAttribute("aria-selected", "true");
    activeResult.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  /**
   * Navigate to selected result
   */
  function navigateToResult(index) {
    const results = resultsContainer.querySelectorAll(".search-result");
    if (index >= 0 && index < results.length) {
      window.location.href = results[index].getAttribute("href");
    }
  }

  /**
   * Handle keyboard navigation
   */
  function handleKeyboard(e) {
    if (!isOpen) return;

    const results = resultsContainer.querySelectorAll(".search-result");
    const maxIndex = results.length - 1;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive(currentFocus < maxIndex ? currentFocus + 1 : 0);
        break;

      case "ArrowUp":
        e.preventDefault();
        setActive(currentFocus > 0 ? currentFocus - 1 : maxIndex);
        break;

      case "Enter":
        e.preventDefault();
        if (currentFocus >= 0) {
          navigateToResult(currentFocus);
        }
        break;

      case "Escape":
        e.preventDefault();
        closeResults();
        searchInput.blur();
        break;
    }
  }

  /**
   * Handle search input
   */
  function handleInput() {
    const query = searchInput.value.trim();

    if (query.length < CONFIG.minChars) {
      closeResults();
      return;
    }

    const results = searchProducts(query);
    renderResults(results, query);
  }

  /**
   * Load products index
   */
  async function loadIndex() {
    try {
      const response = await fetch(CONFIG.indexUrl);
      if (!response.ok) throw new Error("Failed to load search index");

      productsIndex = await response.json();
      console.log(`Product search: Loaded ${productsIndex.length} products`);
    } catch (error) {
      console.error("Product search: Failed to load index", error);
      searchInput.disabled = true;
      searchInput.placeholder = "Vyhledávání není k dispozici";
    }
  }

  /**
   * Initialize search
   */
  function init() {
    // Load index
    loadIndex();

    // Event listeners
    searchInput.addEventListener("input", handleInput);
    searchInput.addEventListener("keydown", handleKeyboard);

    // Click outside to close
    document.addEventListener("click", (e) => {
      if (
        !searchInput.contains(e.target) &&
        !resultsContainer.contains(e.target)
      ) {
        closeResults();
      }
    });

    // Delegate click on results
    resultsContainer.addEventListener("click", (e) => {
      e.preventDefault();
      const result = e.target.closest(".search-result");
      if (result) {
        window.location.href = result.getAttribute("href");
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
