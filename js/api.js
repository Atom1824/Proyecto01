const API_KEY = "acb3f11d6c8a8e87e9b7c3834624dc16";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

async function searchMoviesGlobal(query) {
    const res = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&language=es-MX&query=${encodeURIComponent(query)}`
    );

    const data = await res.json();
    return data.results;
}