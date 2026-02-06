/**
 * Filter Panel Toggle
 * Handles show/hide behavior for category filter chips
 */

document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.getElementById("filterToggleBtn");
  const filterPanel = document.getElementById("filterPanel");

  if (!toggleBtn || !filterPanel) return;

  let isExpanded = false;

  /**
   * Toggle filter panel visibility
   */
  function toggleFilterPanel() {
    isExpanded = !isExpanded;

    if (isExpanded) {
      // Expand panel
      filterPanel.classList.add("filter-panel--expanded");
      toggleBtn.setAttribute("aria-expanded", "true");
      toggleBtn.setAttribute("aria-label", "Skrýt filtry");

      // Add click-outside listener
      setTimeout(() => {
        document.addEventListener("click", handleClickOutside);
      }, 100);
    } else {
      // Collapse panel
      filterPanel.classList.remove("filter-panel--expanded");
      toggleBtn.setAttribute("aria-expanded", "false");
      toggleBtn.setAttribute("aria-label", "Zobrazit filtry");

      // Remove click-outside listener
      document.removeEventListener("click", handleClickOutside);
    }
  }

  /**
   * Close panel when clicking outside
   */
  function handleClickOutside(event) {
    const isClickInside =
      filterPanel.contains(event.target) || toggleBtn.contains(event.target);

    if (!isClickInside && isExpanded) {
      toggleFilterPanel();
    }
  }

  /**
   * Close panel on ESC key
   */
  function handleEscapeKey(event) {
    if (event.key === "Escape" && isExpanded) {
      toggleFilterPanel();
      toggleBtn.focus(); // Return focus to toggle button
    }
  }

  // Event Listeners
  toggleBtn.addEventListener("click", toggleFilterPanel);

  // Keyboard support for toggle button
  toggleBtn.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleFilterPanel();
    }
  });

  // ESC key listener
  document.addEventListener("keydown", handleEscapeKey);

  // Prevent filter panel clicks from closing it
  filterPanel.addEventListener("click", function (event) {
    event.stopPropagation();
  });
});
