// assets/js/filter-toggle.js
document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.querySelector(".filter-toggle-btn");
  const sidebar = document.querySelector(".blog-sidebar");

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener("click", function (e) {
      e.stopPropagation(); // Prevent auto-close on click
      document.body.classList.toggle("show-filters");
    });

    // Auto-close sidebar when clicking outside
    document.addEventListener("click", function (event) {
      const clickedInsideSidebar = sidebar.contains(event.target);
      const clickedToggle = toggleBtn.contains(event.target);

      if (!clickedInsideSidebar && !clickedToggle) {
        document.body.classList.remove("show-filters");
      }
    });
  }
});
