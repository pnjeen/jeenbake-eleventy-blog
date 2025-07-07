// tabs.js
document.addEventListener("DOMContentLoaded", function () {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabPanes = document.querySelectorAll(".tab-pane");
  const tabContentContainer = document.querySelector(".tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetTab = button.getAttribute("data-tab");

      // Deactivate all buttons
      tabButtons.forEach((btn) => btn.classList.remove("active"));

      // Activate clicked button
      button.classList.add("active");

      // Hide all tab panes
      tabPanes.forEach((pane) => pane.classList.remove("active"));

      // Show selected tab pane
      const targetPane = document.getElementById(`tab-${targetTab}`);
      if (targetPane) {
        targetPane.classList.add("active");
        tabContentContainer.scrollTop = 0;
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      // Auto-close floating panel on mobile
      if (window.innerWidth <= 768) {
        document.body.classList.remove("show-tab-panel");
      }
    });
  });
});
