const API_KEY = "acb3f11d6c8a8e87e9b7c3834624dc16";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const movieTopRated = document.getElementById("movie-top-rated");

const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const pageText = document.getElementById("page");

const hero = document.getElementById("hero");
const heroTitle = document.getElementById("hero-title");
const heroDesc = document.getElementById("hero-desc");

let currentPage = 1;

/* ========================= */
/* 🎬 TOP RATED */
/* ========================= */
async function getTopRatedMovies(page = 1) {
    try {
        const response = await fetch(
            `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=es-MX&page=${page}`
        );

        const data = await response.json();

        displayTopMovies(data.results);
        updatePageText();

    } catch (error) {
        console.error("Error:", error);
    }
}

/* ========================= */
/* 🎨 RENDER */
/* ========================= */
function displayTopMovies(movies) {
    movieTopRated.innerHTML = "";

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

        // 🎥 HOVER
        movieCard.addEventListener("mouseenter", () => {
            loadTrailer(movie.id, movieCard);

            const overview = movieCard.querySelector(".overview");
            const rect = movieCard.getBoundingClientRect();
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

        movieCard.addEventListener("mouseleave", () => {
            removeTrailer(movieCard);
        });

        movieTopRated.appendChild(movieCard);
    });
}

/* ========================= */
/* 🎥 TRAILER */
/* ========================= */
async function loadTrailer(movieId, card) {
    const container = card.querySelector(".trailer");

    if (container.innerHTML !== "") return;

    try {
        const res = await fetch(
            `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`
        );
        const data = await res.json();

        const trailer = data.results.find(v => v.type === "Trailer");

        if (trailer) {
            container.innerHTML =
                "<div class='trailer-wrap'>" +
                    "<iframe " +
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

/* ========================= */
/* ❌ LIMPIAR TRAILER */
/* ========================= */
function removeTrailer(card) {
    const container = card.querySelector(".trailer");
    container.innerHTML = "";
}

/* ========================= */
/* ⭐ UTILIDADES */
/* ========================= */
function getRatingClass(vote) {
    if (vote >= 7) return "green";
    if (vote >= 5) return "orange";
    return "red";
}

function shortenText(text, maxLength = 120) {
    if (!text) return "Sin descripción";
    return text.length > maxLength
        ? text.substring(0, maxLength) + "..."
        : text;
}

/* ========================= */
/* 📄 PAGINACIÓN */
/* ========================= */
function updatePageText() {
    pageText.textContent = "Página " + currentPage;
}

prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        getTopRatedMovies(currentPage);
    }
});

nextBtn.addEventListener("click", () => {
    currentPage++;
    getTopRatedMovies(currentPage);
});

/* ========================= */
/* 🎬 HERO DINÁMICO */
/* ========================= */
let heroMovies = [];
let heroIndex = 0;

async function loadHeroMovies() {
    try {
        const response = await fetch(
            `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=es-MX`
        );

        const data = await response.json();

        heroMovies = data.results.slice(0, 10);

        updateHero();

        setInterval(() => {
            heroIndex = (heroIndex + 1) % heroMovies.length;
            updateHero();
        }, 6000);

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

    // 🔥 FADE EFECTO
    hero.style.opacity = "0";

    setTimeout(() => {
        hero.style.backgroundImage = `url(${bg})`;

        heroTitle.textContent = movie.title;
        heroDesc.textContent = shortenText(movie.overview, 140);

        hero.style.opacity = "1";
    }, 300);
}

/* ========================= */
/* 🔽 SCROLL HERO */
/* ========================= */
const heroBtn = document.querySelector(".hero-btn");

heroBtn.addEventListener("click", () => {
    const grid = document.getElementById("movie-top-rated");
    grid.scrollIntoView({ behavior: "smooth" });
});

/* ========================= */
/* 🚀 INIT */
/* ========================= */
getTopRatedMovies();
loadHeroMovies();
