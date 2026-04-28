const navSearchForm = document.getElementById("search-form");
const navSearchInput =
    document.getElementById("search-input") ||
    document.querySelector('#search-form input[type="search"]');

if (navSearchForm && navSearchInput) {
    navSearchForm.addEventListener("submit", event => {
        event.preventDefault();

        const query = navSearchInput.value.trim();

        if (!query) return;

        window.location.href = `index.html?search=${encodeURIComponent(query)}`;
    });
}
