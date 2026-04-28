const navContainer = document.querySelector(".nav-container");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const navActions = document.querySelector(".nav-actions");

if (navContainer && navToggle && navLinks && navActions) {
    const closeMenu = () => {
        navContainer.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open menu");
    };

    navToggle.addEventListener("click", () => {
        const isOpen = navContainer.classList.toggle("nav-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
        navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 767) {
            closeMenu();
        }
    });
}
