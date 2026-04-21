const API_KEY = "acb3f11d6c8a8e87e9b7c3834624dc16";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const Movie_grid = document.getElementById("movie-grid");

let currentPage = 1;

console.log("JS cargado");
console.log(Movie_grid);

// 🎬 POPULARES
async function getPopularMovies(page = 1) {
    try {
        const response = await fetch(
            BASE_URL + "/movie/popular?api_key=" + API_KEY + "&language=es-MX&page=" + page
        );

        const data = await response.json();

        displayMovies(data.results);
    } catch (error) {
        console.error("Error:", error);
    }
}

// 🎨 RENDER
function displayMovies(movies) {
    Movie_grid.innerHTML = "";

    movies.forEach(movie => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");

        const poster = movie.poster_path
            ? IMG_URL + movie.poster_path
            : "https://via.placeholder.com/300x450";

        movieCard.innerHTML =
            "<img src='" + poster + "' alt='" + movie.title + "'>" +
            "<div class='overview'>" +
                "<h3>" + movie.title + "</h3>" +
                "<span class='rating " + getRatingClass(movie.vote_average) + "'>" +
                    "⭐ " + movie.vote_average +
                "</span>" +
                "<p>" + shortenText(movie.overview) + "</p>" +
                "<div class='trailer'></div>" +
            "</div>";

        // 👇 SOLO UN HOVER LIMPIO
        movieCard.addEventListener("mouseenter", () => {
            loadTrailer(movie.id, movieCard);

            const overview = movieCard.querySelector(".overview");
            const rect = movieCard.getBoundingClientRect();
            const screenWidth = window.innerWidth;

            const cardWidth = 320;

            // reset estilos
            overview.style.left = "";
            overview.style.right = "";
            overview.style.transform = "";

            // ajuste bordes
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

        movieCard.addEventListener("mouseleave", () => {
            removeTrailer(movieCard);
        });

        Movie_grid.appendChild(movieCard);
    });
}

getPopularMovies();

// 🔍 BUSCADOR
const form = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const query = searchInput.value.trim();

    if (query) {
        searchMovies(query);
        searchInput.value = "";
    } else {
        getPopularMovies();
    }
});

// 🔍 SEARCH
async function searchMovies(query) {
    try {
        const response = await fetch(
            BASE_URL +
                "/search/movie?api_key=" +
                API_KEY +
                "&language=es-MX&query=" +
                encodeURIComponent(query)
        );

        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error("Error:", error);
    }
}

// ⭐ RATING COLOR
function getRatingClass(vote) {
    if (vote >= 7) return "green";
    if (vote >= 5) return "orange";
    return "red";
}

// ✂️ TEXTO CORTO
function shortenText(text, maxLength = 120) {
    if (!text) return "Sin descripción";
    return text.length > maxLength
        ? text.substring(0, maxLength) + "..."
        : text;
}

// 🎥 TRAILER
async function loadTrailer(movieId, card) {
    const container = card.querySelector(".trailer");

    if (container.innerHTML !== "") return;

    try {
        const res = await fetch(
            BASE_URL + "/movie/" + movieId + "/videos?api_key=" + API_KEY
        );
        const data = await res.json();

        const trailer = data.results.find(v => v.type === "Trailer");

        if (trailer) {
            container.innerHTML =
                "<div class='trailer-wrap'>" +
                    "<iframe id='player-" + movieId + "' " +
                    "src='https://www.youtube.com/embed/" +
                    trailer.key +
                    "?autoplay=1&mute=1&controls=0' " +
                    "frameborder='0'></iframe>" +
                "</div>";
        }

    } catch (error) {
        console.error(error);
    }
}

// ❌ LIMPIAR TRAILER
function removeTrailer(card) {
    const container = card.querySelector(".trailer");
    container.innerHTML = "";
}

const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const pageText = document.getElementById("page");

function updatePageText() {
    pageText.textContent = "Página " + currentPage;
}

prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        getPopularMovies(currentPage);
        updatePageText();
    }
});

nextBtn.addEventListener("click", () => {
    currentPage++;
    getPopularMovies(currentPage);
    updatePageText();
});

// inicial
getPopularMovies();
updatePageText();

const hero = document.getElementById("hero");
const heroTitle = document.getElementById("hero-title");
const heroDesc = document.getElementById("hero-desc");

let heroMovies = [];
let heroIndex = 0;

async function loadHeroMovies() {
    try {
        const response = await fetch(
            BASE_URL + "/movie/popular?api_key=" + API_KEY + "&language=es-MX"
        );

        const data = await response.json();

        heroMovies = data.results.slice(0, 10); // 👈 solo top 10

        updateHero(); // primera carga

        setInterval(() => {
            heroIndex = (heroIndex + 1) % heroMovies.length;
            updateHero();
        }, 6000); // 👈 cambia cada 6 segundos

    } catch (error) {
        console.error("Hero error:", error);
    }
}

function updateHero() {
    const movie = heroMovies[heroIndex];

    if (!movie) return;

    const bg = movie.backdrop_path
        ? "https://image.tmdb.org/t/p/original" + movie.backdrop_path
        : "";

    hero.style.backgroundImage = `url(${bg})`;

}

loadHeroMovies();

const heroBtn = document.querySelector(".hero-btn");
heroBtn.addEventListener("click", () => {
    const grid = document.getElementById("movie-grid");
    grid.scrollIntoView({ behavior: "smooth", block: "start" });
});