// Ruta base de tu API
const apiURL = 'https://localhost:7220/api/Cine/peliculas';
const apiGeneros = 'https://localhost:7220/api/Cine/generos';

// Referencias a elementos del DOM
const movieContainer = document.getElementById('movie-container');
const genreFilter = document.getElementById('genre-filter');

// Objeto de imágenes hardcodeadas
const images = {
    "Absolution": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6jWTLDhDIrE_QHFtgI-dK1CnLv9pGTTP5Iw&s",
    "Lost on a mountain in Maine": "https://m.media-amazon.com/images/M/MV5BN2VkMmNmYWYtNmMxMC00ZDU3LTk3MjQtNGQ0YTAzYTA4MTZmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    "Bird": "https://pics.filmaffinity.com/Bird-803359683-mmed.jpg",
    "Heretic": "https://vvsfilms.com/wp-content/uploads/2024/06/vvs-heretic-poster-27x39-1.jpg",
    "100 Yards": "https://m.media-amazon.com/images/M/MV5BMjgzNGEyNmYtNmExNi00ZDAwLWJhYjEtYzkzZmQ0NzA2YjVlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    "Fast & Furious 1": "https://i.pinimg.com/originals/d3/10/2f/d3102f4468a78a30ad531d03a00ea14d.jpg"
};

// Cargar géneros al iniciar la página
async function loadGenres() {
    try {
        const response = await fetch(apiGeneros);
        const genres = await response.json();

        genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre.idGenero;  // Usar idGenero como valor
            option.textContent = genre.descripcion;  // Usar descripcion como texto
            genreFilter.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar géneros:', error);
    }
}

async function fetchMovies() {
    try {
        const response = await fetch(apiURL);
        const movies = await response.json();

        console.log(movies);
        movieContainer.innerHTML = '';

        movies.forEach(movie => {
            const movieImage = images[movie.tituloPelicula] || "https://via.placeholder.com/300x400";
            const generos = movie.generos ? movie.generos.join(", ") : "Sin género";

            const movieCard = `
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <img src="${movieImage}" class="card-img-top" alt="${movie.tituloPelicula}">
                        <div class="card-body">
                            <h5 class="card-title">${movie.tituloPelicula}</h5>
                            <p class="card-text">
                                <strong>Director:</strong> ${movie.director}<br>
                            </p>
                            <button class="btn btn-primary reservar" data-id="${movie.idPelicula}">Reservar</button>
                        </div>
                    </div>
                </div>
            `;
            movieContainer.innerHTML += movieCard;
        });

        // Agregar los event listeners después de que las películas hayan sido renderizadas
        document.querySelectorAll('.reservar').forEach(button => {
            button.addEventListener('click', (event) => {
                const movieId = event.target.getAttribute('data-id');  // Obtener el id de la película
                window.location.href = `/CLIENTE/reservas/reservas.html?id=${movieId}`;  // Redirigir a reservas.html con el id de la película
            });
        });
    } catch (error) {
        console.error('Error al obtener las películas:', error);
    }
}

// Filtrar películas según género seleccionado
async function filterMoviesByGenre() {
    const selectedGenreId = genreFilter.value; // Obtenemos el id del género seleccionado

    try {
        const response = await fetch(apiURL); // Ruta para obtener todas las películas
        const movies = await response.json();

        // Cargar los géneros para poder comparar con su descripción
        const genreResponse = await fetch(apiGeneros);
        const genres = await genreResponse.json();

        // Encontrar la descripción del género seleccionado usando su id
        const selectedGenre = genres.find(genre => genre.idGenero == selectedGenreId)?.descripcion;

        // Si se selecciona un género, filtrar películas; si no, mostrar todas
        const filteredMovies = selectedGenre
            ? movies.filter(movie => movie.generos.includes(selectedGenre))  // Compara con el nombre del género
            : movies;

        displayMovies(filteredMovies);
    } catch (error) {
        console.error('Error al filtrar películas:', error);
    }
}

// Mostrar películas
function displayMovies(movies) {
    movieContainer.innerHTML = ''; // Limpiar el contenedor

    movies.forEach(movie => {
        const movieImage = images[movie.tituloPelicula] || "https://via.placeholder.com/300x400";
        const generos = movie.generos ? movie.generos.join(", ") : "Sin género";

        const movieCard = `
    <div class="col-md-4 mb-4">
        <div class="card">
            <img src="${movieImage}" class="card-img-top" alt="${movie.tituloPelicula}">
            <div class="card-body">
                <h5 class="card-title">${movie.tituloPelicula}</h5>
                <p class="card-text">
                    <strong>Director:</strong> ${movie.director}<br>
                </p>
                <!-- Botón de reservar con data-id -->
                <button class="btn btn-primary reservar" data-id="${movie.idPelicula}">Reservar</button>
            </div>
        </div>
    </div>
`;

        movieContainer.innerHTML += movieCard;
    });

    // Agregar los event listeners después de que las películas hayan sido renderizadas
    document.querySelectorAll('.reservar').forEach(button => {
        button.addEventListener('click', (event) => {
            const movieId = event.target.getAttribute('data-id');  // Obtener el id de la película
            window.location.href = `/CLIENTE/reservas/reservas.html?id=${movieId}`;  // Redirigir a reservas.html con el id de la película
        });
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadGenres();
    fetchMovies();
});

genreFilter.addEventListener('change', filterMoviesByGenre);



// Función de cierre de sesión
function logout() {
    // Elimina los datos de sesión de localStorage
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");

    // Redirige a la página de inicio de sesión
    window.location.href = "/Login/login.html"; // Cambia la ruta según la ubicación de tu página de login
}

// Verificar si el usuario ha iniciado sesión
function checkLoginStatus() {
    const userRole = localStorage.getItem("userRole");

    if (userRole) {
        // Si hay un rol en localStorage, significa que el usuario está autenticado
        document.getElementById("login-button").style.display = "none"; // Oculta el botón de iniciar sesión
        document.getElementById("logout-button").style.display = "inline-block"; // Muestra el botón de cerrar sesión
    } else {
        // Si no hay sesión activa, oculta el botón de cerrar sesión y muestra el de iniciar sesión
        document.getElementById("login-button").style.display = "inline-block";
        document.getElementById("logout-button").style.display = "none";
    }
}

// Ejecuta la verificación de sesión cuando la página se carga
document.addEventListener("DOMContentLoaded", () => {
    checkLoginStatus();
    loadGenres(); // Cargar géneros al iniciar la página
    fetchMovies(); // Cargar películas al iniciar la página
});

genreFilter.addEventListener('change', filterMoviesByGenre);
