document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.querySelector(".nav-menu");

  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open"); // Toggle only 'open'
  });
});
