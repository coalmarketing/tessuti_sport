/**
 * Label Filtering System
 * Two modes:
 * 1. Catalog mode (katalog.njk): Switches to global results view like search
 * 2. Category mode (category.njk): Filters visible category products
 */

class LabelFilters {
  constructor() {
    this.filterTags = document.querySelectorAll(".filter-tag");
    this.clearFiltersBtn = document.getElementById("clearFilters");
    this.activeFilters = [];

    // Detect page type
    this.isCatalogPage =
      document.getElementById("catalog-label-filters") !== null;
    this.isCategoryPage =
      document.getElementById("category-label-filters") !== null;

    if (this.isCatalogPage) {
      this.initCatalogMode();
    } else if (this.isCategoryPage) {
      this.initCategoryMode();
    }
  }

  /**
   * CATALOG MODE: Global results view (like search)
   */
  initCatalogMode() {
    // DOM elements for catalog mode
    this.gridView = document.getElementById("gridView");
    this.listView = document.getElementById("listView");
    this.searchResultsGrid = document.getElementById("searchResultsGrid");
    this.filterResultsSummary = document.getElementById(
      "filter-results-summary"
    );
    this.filterResultsCount = document.getElementById("filter-results-count");

    if (!this.searchResultsGrid) {
      console.warn("LabelFilters (catalog): searchResultsGrid not found");
      return;
    }

    this.attachEventListeners();
  }

  /**
   * CATEGORY MODE: Filter visible products
   */
  initCategoryMode() {
    this.productItems = document.querySelectorAll(".product-item");
    this.resultsCounter = document.getElementById("resultsCounter");

    if (!this.productItems.length) {
      console.warn("LabelFilters (category): No product items found");
      return;
    }

    this.attachEventListeners();
    this.clearAllFilters();
  }

  /**
   * Apply filters - different logic for catalog vs category
   */
  applyFilters() {
    if (this.isCatalogPage) {
      this.applyCatalogFilters();
    } else if (this.isCategoryPage) {
      this.applyCategoryFilters();
    }
  }

  /**
   * CATALOG MODE: Show global results (like search)
   */
  applyCatalogFilters() {
    // No filters = show normal catalog
    if (this.activeFilters.length === 0) {
      this.exitFilterMode();
      return;
    }

    // Hide normal catalog views
    if (this.gridView) this.gridView.classList.add("hidden");
    if (this.listView) this.listView.classList.add("hidden");

    // Filter product cards by labels
    const productCards = this.searchResultsGrid.querySelectorAll(
      ".search-product-card"
    );
    let visibleCount = 0;

    productCards.forEach((card) => {
      const cardLabels = card.dataset.labels
        ? card.dataset.labels.split(",").map((l) => l.trim())
        : [];

      // Show if card has ANY of the active filters (OR logic)
      const shouldShow = this.activeFilters.some((filter) =>
        cardLabels.includes(filter)
      );

      if (shouldShow) {
        card.style.display = "";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    // Show results grid
    if (this.searchResultsGrid) {
      this.searchResultsGrid.classList.remove("hidden");
    }

    // Update and show results summary
    if (this.filterResultsCount) {
      this.filterResultsCount.textContent = visibleCount;
    }
    if (this.filterResultsSummary) {
      this.filterResultsSummary.classList.remove("hidden");
    }

    // Add body class to indicate filter mode
    document.body.classList.add("is-filtering");
  }

  /**
   * CATEGORY MODE: Filter visible products
   */
  applyCategoryFilters() {
    let visibleCount = 0;

    this.productItems.forEach((item) => {
      const itemLabels = item.dataset.labels
        ? item.dataset.labels.split(",").map((l) => l.trim())
        : [];
      const shouldShow =
        this.activeFilters.length === 0 ||
        this.activeFilters.some((filter) => itemLabels.includes(filter));

      if (shouldShow) {
        item.style.display = "";
        visibleCount++;
      } else {
        item.style.display = "none";
      }
    });

    // Update counter
    if (this.resultsCounter) {
      const totalCount = this.productItems.length;
      if (this.activeFilters.length === 0) {
        this.resultsCounter.textContent = `Zobrazeno ${totalCount} položek`;
      } else {
        this.resultsCounter.textContent = `Zobrazeno ${visibleCount} z ${totalCount} položek`;
      }
    }
  }

  /**
   * Exit filter mode and return to normal catalog view (CATALOG MODE ONLY)
   */
  exitFilterMode() {
    if (!this.isCatalogPage) return;

    // Hide filter results elements
    if (this.searchResultsGrid) this.searchResultsGrid.classList.add("hidden");
    if (this.filterResultsSummary)
      this.filterResultsSummary.classList.add("hidden");

    // Show normal catalog views
    if (this.gridView) this.gridView.classList.remove("hidden");
    // listView visibility is controlled by view toggle

    // Remove body class
    document.body.classList.remove("is-filtering");
  }

  /**
   * Clear all filters
   */
  clearAllFilters() {
    // Exit search mode if available
    if (window.productSearch && window.productSearch.exitSearchMode) {
      window.productSearch.exitSearchMode();
    }
    if (window.categorySearch && window.categorySearch.exitSearchMode) {
      window.categorySearch.exitSearchMode();
    }

    this.activeFilters = [];

    // Reset all filter buttons
    this.filterTags.forEach((tag) => {
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

    this.applyFilters();
  }

  /**
   * Toggle a filter on/off
   */
  toggleFilter(label, button) {
    // Exit search mode if available
    if (window.productSearch && window.productSearch.exitSearchMode) {
      window.productSearch.exitSearchMode();
    }
    if (window.categorySearch && window.categorySearch.exitSearchMode) {
      window.categorySearch.exitSearchMode();
    }

    const index = this.activeFilters.indexOf(label);

    if (index === -1) {
      // Add filter
      this.activeFilters.push(label);
      button.classList.add("active", "bg-[#00A44F]", "text-white");
      button.classList.remove(
        "bg-white",
        "text-[#00A44F]",
        "border-2",
        "border-[#00A44F]"
      );

      // Deactivate "Vše" button
      if (this.clearFiltersBtn) {
        this.clearFiltersBtn.classList.remove(
          "active",
          "bg-[#00A44F]",
          "text-white"
        );
        this.clearFiltersBtn.classList.add(
          "bg-white",
          "text-[#00A44F]",
          "border-2",
          "border-[#00A44F]"
        );
      }
    } else {
      // Remove filter
      this.activeFilters.splice(index, 1);
      button.classList.remove("active", "bg-[#00A44F]", "text-white");
      button.classList.add(
        "bg-white",
        "text-[#00A44F]",
        "border-2",
        "border-[#00A44F]"
      );

      // If no filters active, activate "Vše" button
      if (this.activeFilters.length === 0 && this.clearFiltersBtn) {
        this.clearFiltersBtn.classList.add(
          "active",
          "bg-[#00A44F]",
          "text-white"
        );
        this.clearFiltersBtn.classList.remove(
          "bg-white",
          "text-[#00A44F]",
          "border-2",
          "border-[#00A44F]"
        );
      }
    }

    this.applyFilters();
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Clear filters button
    if (this.clearFiltersBtn) {
      this.clearFiltersBtn.addEventListener("click", () => {
        this.clearAllFilters();
      });
    }

    // Label filter tags
    this.filterTags.forEach((tag) => {
      if (tag.dataset.label) {
        tag.addEventListener("click", () => {
          this.toggleFilter(tag.dataset.label, tag);
        });
      }
    });
  }

  /**
   * Public API: Programmatically set active filters
   */
  setActiveFilters(labels) {
    this.activeFilters = labels;

    // Update button states
    this.filterTags.forEach((tag) => {
      if (tag.id === "clearFilters") {
        if (labels.length === 0) {
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
      } else if (tag.dataset.label) {
        if (labels.includes(tag.dataset.label)) {
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
      }
    });

    this.applyFilters();
  }

  /**
   * Public API: Get current active filters
   */
  getActiveFilters() {
    return [...this.activeFilters];
  }
}

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", function () {
  // Initialize filters if filter tags exist
  if (document.querySelectorAll(".filter-tag").length > 0) {
    window.labelFilters = new LabelFilters();
  }
});
