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

  // DOM elements - Autocomplete
  const searchInput = document.getElementById("product-search");
  const autocompleteContainer = document.getElementById("search-autocomplete");
  const noAutocompleteMsg = document.getElementById("search-no-autocomplete");
  const searchButton = document.getElementById("search-button");

  // DOM elements - Search Results View
  const searchResultsHeader = document.getElementById("search-results-header");
  const searchQueryDisplay = document.getElementById("search-query-display");
  const searchQueryBreadcrumb = document.getElementById(
    "search-query-breadcrumb"
  );
  const searchResultsGrid = document.getElementById("searchResultsGrid");
  const searchResultsSummary = document.getElementById(
    "search-results-summary"
  );
  const searchResultsCount = document.getElementById("search-results-count");

  // DOM elements - Normal Catalog View
  const gridView = document.getElementById("gridView");
  const listView = document.getElementById("listView");

  if (
    !searchInput ||
    !autocompleteContainer ||
    !noAutocompleteMsg ||
    !searchButton
  ) {
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
        <div class="text-xs md:text-sm text-gray-500 mt-1 font-body">
          ${escapeHtml(product.category)}
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
   * Filter and show pre-rendered product cards based on search query
   */
  function filterProductCards(query) {
    if (!searchResultsGrid) return 0;

    const normalizedQuery = normalize(query);
    const productCards = searchResultsGrid.querySelectorAll(
      ".search-product-card"
    );
    let visibleCount = 0;

    productCards.forEach((card) => {
      const title = card.dataset.title || "";
      const normalizedTitle = normalize(title);

      if (normalizedTitle.includes(normalizedQuery)) {
        card.style.display = "";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    return visibleCount;
  }

  /**
   * Show search results view using pre-rendered product cards
   */
  function showSearchResults(query) {
    // CRITICAL: Clear any active filters first (search overrides filters)
    if (window.labelFilters && window.labelFilters.activeFilters) {
      // Reset filter state without triggering filter mode
      window.labelFilters.activeFilters = [];

      // Reset all filter button UI states
      const filterTags = document.querySelectorAll(".filter-tag");
      filterTags.forEach((tag) => {
        if (tag.id === "clearFilters") {
          tag.classList.add("active", "bg-[#00A44F]", "text-white");
          tag.classList.remove(
            "bg-white",
            "text-[#00A44F]",
            "border-2",
            "border-[#00A44F]"
          );
        } else {
          tag.classList.remove("active", "bg-[#00A44F]", "text-white");
          tag.classList.add(
            "bg-white",
            "text-[#00A44F]",
            "border-2",
            "border-[#00A44F]"
          );
        }
      });

      // Exit filter mode if active
      if (document.body.classList.contains("is-filtering")) {
        document.body.classList.remove("is-filtering");
        const filterResultsHeader = document.getElementById(
          "filter-results-header"
        );
        const filterResultsSummary = document.getElementById(
          "filter-results-summary"
        );
        if (filterResultsHeader) filterResultsHeader.classList.add("hidden");
        if (filterResultsSummary) filterResultsSummary.classList.add("hidden");
      }
    }

    // Close autocomplete
    closeAutocomplete();

    // Update header and breadcrumbs
    if (searchQueryDisplay) searchQueryDisplay.textContent = query;
    if (searchQueryBreadcrumb) searchQueryBreadcrumb.textContent = query;

    // Hide normal catalog views
    if (gridView) gridView.classList.add("hidden");
    if (listView) listView.classList.add("hidden");

    // Show search results header
    if (searchResultsHeader) searchResultsHeader.classList.remove("hidden");

    // Filter and show matching product cards (based ONLY on search query)
    const visibleCount = filterProductCards(query);

    if (searchResultsGrid) {
      searchResultsGrid.classList.remove("hidden");
    }

    // Update and show results summary
    if (searchResultsCount) searchResultsCount.textContent = visibleCount;
    if (searchResultsSummary) searchResultsSummary.classList.remove("hidden");

    // Add body class to indicate search mode
    document.body.classList.add("is-searching");
  }

  /**
   * Exit search mode and return to normal catalog view
   * This function is exposed globally for view toggle controls
   */
  function exitSearchMode() {
    // Clear search input
    searchInput.value = "";

    // Close autocomplete
    closeAutocomplete();

    // Hide search results elements
    if (searchResultsHeader) searchResultsHeader.classList.add("hidden");
    if (searchResultsGrid) searchResultsGrid.classList.add("hidden");
    if (searchResultsSummary) searchResultsSummary.classList.add("hidden");

    // Show normal catalog views
    if (gridView) gridView.classList.remove("hidden");
    // listView visibility is controlled by view toggle

    // Remove body class
    document.body.classList.remove("is-searching");
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

    // If search is cleared, return to normal catalog view
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
    }
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
    // Load index (still used for autocomplete)
    loadIndex();

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

    // Expose exitSearchMode globally for view toggle controls
    window.productSearch = {
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
