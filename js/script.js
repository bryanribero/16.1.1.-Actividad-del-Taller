document.addEventListener("DOMContentLoaded", function () {
    const totalPokemons = 1000; // Número total de Pokémon disponibles
    const limit = 12; // Número de Pokémon por página
    let allPokemons = []; // Array para almacenar todos los Pokémon
    let filteredPokemons = []; // Array para Pokémon filtrados
    let currentPage = 1; // Página actual
    let paginationBlock = 1; // Bloque de paginación actual

    const cardContainer = document.getElementById('card-container');
    const searchInput = document.querySelector('.buscador');
    const searchButton = document.querySelector('.btn-search');
    const paginationContainer = document.getElementById('pagination'); // Contenedor de paginación

    // Función para obtener todos los Pokémon
    const fetchAllPokemons = async () => {
        for (let offset = 0; offset < totalPokemons; offset += limit) {
            const apiURL = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
            const response = await fetch(apiURL);
            const data = await response.json();

            const fetchPromises = data.results.map(pokemon => {
                return fetch(pokemon.url).then(response => response.json());
            });

            const pokemons = await Promise.all(fetchPromises);
            allPokemons = allPokemons.concat(pokemons); // Almacena todos los Pokémon en el array
        }
        filteredPokemons = allPokemons; // Inicia con todos los Pokémon como filtrados
        displayPokemons(); // Muestra los Pokémon en la primera carga
        setupPagination(filteredPokemons); // Configura la paginación según los Pokémon filtrados
    };

    // Función para mostrar los Pokémon en tarjetas
    const displayPokemons = (pagePokemons = filteredPokemons) => {
        cardContainer.innerHTML = ""; // Limpia el contenedor de tarjetas
        const startIndex = (currentPage - 1) * limit; // Índice de inicio para la página actual
        const endIndex = startIndex + limit; // Índice de fin para la página actual
        const pokemonsToShow = pagePokemons.slice(startIndex, endIndex); // Pokémon a mostrar en la página actual

        pokemonsToShow.forEach(pokemon => {
            const card = document.createElement("div");
            card.className = "col-md-4 mt-5 mb-4";

            card.innerHTML = `
            <div class="card text-center">
                <img src="${pokemon.sprites.front_default}" class="pokemon-img" alt="${pokemon.name}">
                <div class="card-body d-flex flex-column justify-content-center align-items-center">
                    <h6 class="pokemon-number">#${pokemon.id}</h6> <!-- Número del Pokémon -->
                    <h5 class="card-title">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h5>
                    <p class="card-text">Altura: ${pokemon.height} decímetros</p>
                    <p class="card-text">Peso: ${pokemon.weight} hectogramos</p>
                    <p class="card-text">Tipo: ${pokemon.types.map(type => type.type.name).join(', ')}</p>
                    <a href="#" class="btn btn-primary">Ver Más</a>
                </div>
            </div>
        `;

            cardContainer.appendChild(card);
        });
    };

    // Función para configurar la paginación
    const setupPagination = (pokemonArray) => {
        paginationContainer.innerHTML = ""; // Limpia el contenedor de paginación
        const pageCount = Math.ceil(pokemonArray.length / limit); // Número total de páginas según los Pokémon filtrados
        const maxPagesVisible = 10; // Máximo de páginas visibles en un bloque

        const startPage = (paginationBlock - 1) * maxPagesVisible + 1;
        const endPage = Math.min(startPage + maxPagesVisible - 1, pageCount);

        // Botón para ir al bloque anterior de páginas
        if (paginationBlock > 1) {
            const prevBlockButton = document.createElement('li');
            prevBlockButton.className = 'page-item';
            prevBlockButton.innerHTML = `<a class="page-link" href="#" aria-label="Previous Block">&laquo;</a>`;
            prevBlockButton.addEventListener('click', (e) => {
                e.preventDefault(); // Evita el desplazamiento hacia arriba
                paginationBlock--;
                setupPagination(pokemonArray);
            });
            paginationContainer.appendChild(prevBlockButton);
        }

        // Mostrar los números de página del bloque actual
        for (let i = startPage; i <= endPage; i++) {
            const button = document.createElement('li');
            button.className = `page-item ${currentPage === i ? 'active' : ''}`;
            button.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            button.addEventListener('click', (e) => {
                e.preventDefault(); // Evita el desplazamiento hacia arriba
                currentPage = i;
                displayPokemons();
                setupPagination(pokemonArray);
            });
            paginationContainer.appendChild(button);
        }

        // Botón para ir al siguiente bloque de páginas
        if (endPage < pageCount) {
            const nextBlockButton = document.createElement('li');
            nextBlockButton.className = 'page-item';
            nextBlockButton.innerHTML = `<a class="page-link" href="#" aria-label="Next Block">&raquo;</a>`;
            nextBlockButton.addEventListener('click', (e) => {
                e.preventDefault(); // Evita el desplazamiento hacia arriba
                paginationBlock++;
                setupPagination(pokemonArray);
            });
            paginationContainer.appendChild(nextBlockButton);
        }
    };

    // Función para filtrar Pokémon según el término de búsqueda
    const filterPokemons = () => {
        const searchTerm = searchInput.value.toLowerCase();
        filteredPokemons = allPokemons.filter(pokemon =>
            pokemon.name.toLowerCase().includes(searchTerm)
        );

        // Resetea la página y el bloque actual y muestra los Pokémon filtrados
        currentPage = 1;
        paginationBlock = 1;
        displayPokemons(filteredPokemons);
        setupPagination(filteredPokemons);
    };

    // Evento de búsqueda
    searchButton.addEventListener('click', filterPokemons);

    // Llamar a la función para obtener todos los Pokémon
    fetchAllPokemons().catch(error => console.error("Error:", error));
});
