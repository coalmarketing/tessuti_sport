/**
 * Category Search - Scoped search within a single category
 * Zero dependencies, vanilla JS
 */
(function () {
  "use strict";

  // Configuration
  const CONFIG = {
    maxResults: 10,
    minChars: 1,
  };

  // State
  let categoryProducts = [];
  let currentFocus = -1;
  let isOpen = false;
  let isSearchMode = false;

  // DOM elements - Search UI
  const searchInput = document.getElementById("category-search");
  const autocompleteContainer = document.getElementById(
    "category-search-autocomplete"
  );
  const noAutocompleteMsg = document.getElementById(
    "category-search-no-autocomplete"
  );
  const searchButton = document.getElementById("category-search-button");

  // DOM elements - Results Header
  const searchResultsHeader = document.getElementById(
    "category-search-results-header"
  );
  const searchQueryDisplay = document.getElementById(
    "category-search-query-display"
  );

  // DOM elements - Products Grid
  const productsGrid = document.getElementById("category-products-grid");
  const labelFilters = document.getElementById("category-label-filters");
  const resultsCounter = document.getElementById("resultsCounter");

  if (
    !searchInput ||
    !autocompleteContainer ||
    !noAutocompleteMsg ||
    !searchButton ||
    !productsGrid
  ) {
    console.warn("Category search: Required elements not found");
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
   * Build product index from DOM
   */
  function buildProductIndex() {
    const productItems = productsGrid.querySelectorAll(".product-item");
    categoryProducts = [];

    productItems.forEach((item) => {
      const title = item.dataset.productTitle || "";
      const url = item.dataset.productUrl || "";

      if (title && url) {
        categoryProducts.push({
          title: title,
          url: url,
          element: item,
        });
      }
    });

    console.log(`Category search: Loaded ${categoryProducts.length} products`);
  }

  /**
   * Search products by title (category-scoped)
   */
  function searchProducts(query) {
    if (!query || query.length < CONFIG.minChars) return [];

    const normalizedQuery = normalize(query);

    // Filter and score results
    const results = categoryProducts
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
   * Render autocomplete results
   */
  function renderAutocomplete(results, query) {
    if (results.length === 0) {
      closeAutocomplete();
      noAutocompleteMsg.classList.remove("hidden");
      return;
    }

    noAutocompleteMsg.classList.add("hidden");

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
      </a>
    `
      )
      .join("");

    autocompleteContainer.innerHTML = html;
    openAutocomplete();
  }

  /**
   * Open autocomplete dropdown
   */
  function openAutocomplete() {
    autocompleteContainer.classList.remove("hidden");
    searchInput.setAttribute("aria-expanded", "true");
    isOpen = true;
    currentFocus = -1;
  }

  /**
   * Close autocomplete dropdown
   */
  function closeAutocomplete() {
    autocompleteContainer.classList.add("hidden");
    noAutocompleteMsg.classList.add("hidden");
    searchInput.setAttribute("aria-expanded", "false");
    isOpen = false;
    currentFocus = -1;
    removeActiveStates();
  }

  /**
   * Remove active state from all results
   */
  function removeActiveStates() {
    const results = autocompleteContainer.querySelectorAll(".search-result");
    results.forEach((result) => {
      result.classList.remove("bg-gray-50");
      result.setAttribute("aria-selected", "false");
    });
  }

  /**
   * Set active state on result
   */
  function setActive(index) {
    const results = autocompleteContainer.querySelectorAll(".search-result");
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
    const results = autocompleteContainer.querySelectorAll(".search-result");
    if (index >= 0 && index < results.length) {
      window.location.href = results[index].getAttribute("href");
    }
  }

  /**
   * Filter product cards based on search query
   */
  function filterProductCards(query) {
    const normalizedQuery = normalize(query);
    let visibleCount = 0;

    categoryProducts.forEach((product) => {
      const normalizedTitle = normalize(product.title);

      if (normalizedTitle.includes(normalizedQuery)) {
        product.element.style.display = "";
        visibleCount++;
      } else {
        product.element.style.display = "none";
      }
    });

    return visibleCount;
  }

  /**
   * Show search results view
   */
  function showSearchResults(query) {
    // Close autocomplete
    closeAutocomplete();

    // Update header
    if (searchQueryDisplay) searchQueryDisplay.textContent = query;
    if (searchResultsHeader) searchResultsHeader.classList.remove("hidden");

    // Hide label filters during search
    if (labelFilters) labelFilters.classList.add("hidden");

    // Filter and show matching product cards
    const visibleCount = filterProductCards(query);

    // Update results counter
    if (resultsCounter) {
      resultsCounter.textContent = `Nalezeno ${visibleCount} produktů`;
    }

    // Mark as in search mode
    isSearchMode = true;
    document.body.classList.add("is-category-searching");
  }

  /**
   * Exit search mode and return to normal category view
   */
  function exitSearchMode() {
    // Clear search input
    searchInput.value = "";

    // Close autocomplete
    closeAutocomplete();

    // Hide search results header
    if (searchResultsHeader) searchResultsHeader.classList.add("hidden");

    // Show label filters again
    if (labelFilters) labelFilters.classList.remove("hidden");

    // Show all products
    categoryProducts.forEach((product) => {
      product.element.style.display = "";
    });

    // Reset counter
    if (resultsCounter) {
      resultsCounter.textContent = `V kategorii se nachází ${categoryProducts.length} položek`;
    }

    // Mark as not in search mode
    isSearchMode = false;
    document.body.classList.remove("is-category-searching");
  }

  /**
   * Handle keyboard navigation
   */
  function handleKeyboard(e) {
    // Enter key when autocomplete is NOT open - trigger search
    if (e.key === "Enter" && !isOpen) {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query.length >= CONFIG.minChars) {
        showSearchResults(query);
      }
      return;
    }

    // Rest of keyboard handling for autocomplete navigation
    if (!isOpen) return;

    const results = autocompleteContainer.querySelectorAll(".search-result");
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
        closeAutocomplete();
        searchInput.blur();
        break;
    }
  }

  /**
   * Handle search input - for autocomplete
   */
  function handleInput() {
    const query = searchInput.value.trim();

    // If search is cleared, return to normal category view
    if (query.length === 0) {
      closeAutocomplete();
      exitSearchMode();
      return;
    }

    // Show autocomplete if query is long enough
    if (query.length < CONFIG.minChars) {
      closeAutocomplete();
      return;
    }

    const results = searchProducts(query);
    renderAutocomplete(results, query);
  }

  /**
   * Handle search button click
   */
  function handleSearchButtonClick() {
    const query = searchInput.value.trim();
    if (query.length >= CONFIG.minChars) {
      showSearchResults(query);
    } else if (query.length === 0) {
      exitSearchMode();
    }
  }

  /**
   * Initialize category search
   */
  function init() {
    // Build product index from DOM
    buildProductIndex();

    // Event listeners
    searchInput.addEventListener("input", handleInput);
    searchInput.addEventListener("keydown", handleKeyboard);
    searchButton.addEventListener("click", handleSearchButtonClick);

    // Click outside to close autocomplete
    document.addEventListener("click", (e) => {
      if (
        !searchInput.contains(e.target) &&
        !autocompleteContainer.contains(e.target) &&
        !searchButton.contains(e.target)
      ) {
        closeAutocomplete();
      }
    });

    // Delegate click on autocomplete results
    autocompleteContainer.addEventListener("click", (e) => {
      e.preventDefault();
      const result = e.target.closest(".search-result");
      if (result) {
        window.location.href = result.getAttribute("href");
      }
    });

    // Expose exitSearchMode globally for filter controls
    window.categorySearch = {
      exitSearchMode: exitSearchMode,
    };
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
