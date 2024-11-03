// URL de la API
const apiURL = 'https://localhost:7223/api/Peliculas'; // Cambia esta URL por la de tu API

// Selecciona el contenedor donde se renderizarán las películas
const movieContainer = document.getElementById('movie-container');

// Función para obtener y renderizar películas
async function fetchMovies() {
    try {
        const response = await fetch(apiURL);
        const movies = await response.json();

        // Limpia el contenedor
        movieContainer.innerHTML = '';

        // Recorre cada película y crea una card
        movies.forEach(movie => {
            const movieCard = `
                <div class="col-md-4 mb-4">
                    <div class="card card-inner">
                        <div class="card-front">
                            <img src="https://via.placeholder.com/300x400" class="card-img-top" alt="${movie.titulo}">
                            <div class="card-body">
                                <h5 class="card-title">${movie.titulo}</h5>
                                <p class="card-text">
                                    <strong>Año:</strong> ${movie.anio}<br>
                                    <strong>Director:</strong> ${movie.director}<br>
                                    <strong>Género:</strong> ${movie.generoNavigation.nombre}
                                </p>
                                <a href="#" class="btn btn-primary ver-detalles">Ver detalles</a>
                            </div>
                        </div>
                        <div class="card-back">
                            <div class="card-body">
                                <h5 class="card-title">Detalles de ${movie.titulo}</h5>
                                <p class="card-text">Aquí se pueden mostrar detalles adicionales de la película.</p>
                                <button class="btn btn-secondary volver">Volver</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            // Agrega la card al contenedor
            movieContainer.innerHTML += movieCard;
        });

        // Asignar eventos a los botones después de renderizar las películas
        assignFlipEvents();
    } catch (error) {
        console.error('Error al obtener las películas:', error);
    }
}

document.querySelectorAll('.ver-detalles').forEach(button => {
    button.addEventListener('click', function(event) {
        event.preventDefault(); // Evita la acción predeterminada del enlace
        const card = this.closest('.card'); // Encuentra la card más cercana
        card.querySelector('.card-front').style.display = 'none'; // Oculta la cara frontal
        card.querySelector('.card-back').style.display = 'block'; // Muestra la cara trasera
    });
});

document.querySelectorAll('.volver').forEach(button => {
    button.addEventListener('click', function() {
        const card = this.closest('.card'); // Encuentra la card más cercana
        card.querySelector('.card-front').style.display = 'block'; // Muestra la cara frontal
        card.querySelector('.card-back').style.display = 'none'; // Oculta la cara trasera
    });
});



// Llama a la función para cargar las películas cuando la página cargue
document.addEventListener('DOMContentLoaded', fetchMovies);