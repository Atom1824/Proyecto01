const API_KEY = "acb3f11d6c8a8e87e9b7c3834624dc16";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

// DOM
const genreList = document.getElementById("genre-list");
const movieGrid = document.getElementById("movie-grid");
const title = document.getElementById("category-title");
const categoriesLayout = document.querySelector(".categories-layout");
const sidebarToggle = document.querySelector(".sidebar-toggle");

const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const pageText = document.getElementById("page");

// estado
let currentPage = 1;
let currentGenre = null;

function closeSidebarMenu() {
    if (!categoriesLayout || !sidebarToggle) return;

    categoriesLayout.classList.remove("sidebar-open");
    sidebarToggle.setAttribute("aria-expanded", "false");
}

if (categoriesLayout && sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
        const isOpen = categoriesLayout.classList.toggle("sidebar-open");
        sidebarToggle.setAttribute("aria-expanded", String(isOpen));
    });

    categoriesLayout.addEventListener("click", event => {
        if (window.innerWidth > 767) return;
        if (!categoriesLayout.classList.contains("sidebar-open")) return;
        if (event.target !== categoriesLayout) return;

        closeSidebarMenu();
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 767) {
            closeSidebarMenu();
        }
    });
}

/* =========================
🎬 GÉNEROS
========================= */
async function getGenres() {
    try {
        const res = await fetch(
            `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=es-MX`
        );

        const data = await res.json();
        displayGenres(data.genres);
    } catch (error) {
        console.error(error);
    }
}

function displayGenres(genres) {
    genreList.innerHTML = "";

    genres.forEach(genre => {
        const li = document.createElement("li");
        li.textContent = genre.name;

        li.addEventListener("click", () => {
            currentGenre = genre.id;
            currentPage = 1;

            getMoviesByGenre(currentGenre, currentPage);
            title.textContent = genre.name;
            closeSidebarMenu();

            document.querySelectorAll("#genre-list li").forEach(el => {
                el.classList.remove("active");
            });

            li.classList.add("active");
        });

        genreList.appendChild(li);
    });
}

/* =========================
🎬 PELÍCULAS POR GÉNERO
========================= */
async function getMoviesByGenre(genreId, page = 1) {
    try {
        const res = await fetch(
            `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=es-MX&page=${page}`
        );

        const data = await res.json();

        displayMovies(data.results);
        updatePageText();
    } catch (error) {
        console.error(error);
    }
}

/* =========================
🎨 GRID
========================= */
function displayMovies(movies) {
    movieGrid.innerHTML = "";

    movies.forEach(movie => {
        const card = document.createElement("div");
        card.classList.add("movie-card");

        const poster = movie.poster_path
            ? IMG_URL + movie.poster_path
            : "https://via.placeholder.com/300x450";

        card.innerHTML = `
            <img src="${poster}" alt="${movie.title}">
            <div class="overview">
                <h3>${movie.title}</h3>
                <span class="rating">${movie.vote_average}</span>
                <p>${movie.overview?.slice(0, 100) || "Sin descripción"}...</p>
                <div class="trailer"></div>
            </div>
        `;

        card.addEventListener("mouseenter", () => {
            loadTrailer(movie.id, card);

            const overview = card.querySelector(".overview");
            const rect = card.getBoundingClientRect();
            const screenWidth = window.innerWidth;
            const cardWidth = 320;

            overview.style.left = "";
            overview.style.right = "";
            overview.style.top = "";
            overview.style.position = "";
            overview.style.transform = "";

            if (screenWidth <= 900) {
                overview.style.position = "fixed";
                overview.style.top = "50%";
                overview.style.left = "50%";
                overview.style.right = "auto";
                overview.style.transform = "translate(-50%, -50%)";
                return;
            }

            if (rect.left + cardWidth > screenWidth) {
                overview.style.left = "auto";
                overview.style.right = "0";
            } else if (rect.left < 10) {
                overview.style.left = "0";
                overview.style.right = "auto";
            } else {
                overview.style.left = "50%";
                overview.style.transform = "translateX(-50%)";
            }
        });

        card.addEventListener("mouseleave", () => {
            removeTrailer(card);
        });

        movieGrid.appendChild(card);
    });
}

/* =========================
🎥 TRAILER
========================= */
async function loadTrailer(movieId, card) {
    const container = card.querySelector(".trailer");

    if (!container || container.innerHTML !== "") return;

    try {
        const res = await fetch(
            `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`
        );
        const data = await res.json();

        const trailer = data.results.find(video => video.type === "Trailer");

        if (trailer) {
            container.innerHTML = `
                <div class="trailer-wrap">
                    <iframe
                        src="https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0"
                        frameborder="0">
                    </iframe>
                </div>
            `;
        }
    } catch (error) {
        console.error(error);
    }
}

function removeTrailer(card) {
    const container = card.querySelector(".trailer");
    if (container) container.innerHTML = "";
}

/* =========================
📄 PAGINACIÓN
========================= */
function updatePageText() {
    if (pageText) {
        pageText.textContent = "Página " + currentPage;
    }
}

prevBtn?.addEventListener("click", () => {
    if (currentPage > 1 && currentGenre) {
        currentPage--;
        getMoviesByGenre(currentGenre, currentPage);
    }
});

nextBtn?.addEventListener("click", () => {
    if (currentGenre) {
        currentPage++;
        getMoviesByGenre(currentGenre, currentPage);
    }
});

/* =========================
🚀 INICIO
========================= */
getGenres();
