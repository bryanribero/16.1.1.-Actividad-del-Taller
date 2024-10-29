document.addEventListener("DOMContentLoaded", function () {
    const totalPokemons = 1000; // Número total de Pokémon disponibles
    const limit = 10; // Número de Pokémon por página
    let allPokemons = []; // Array para almacenar todos los Pokémon
    let currentPage = 1; // Página actual

    const cardContainer = document.getElementById('card-container');
    const searchInput = document.querySelector('.buscador');
    const searchButton = document.querySelector('.btn-search');
    const paginationContainer = document.getElementById('pagination'); // Contenedor de paginación

    // Función para obtener Pokémon
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
        displayPokemons(); // Muestra los Pokémon en la primera carga
        setupPagination(); // Configura la paginación
    };

    // Función para mostrar los Pokémon en tarjetas
    const displayPokemons = (pagePokemons = allPokemons) => {
        cardContainer.innerHTML = ""; // Limpia el contenedor de tarjetas
        const startIndex = (currentPage - 1) * limit; // Índice de inicio para la página actual
        const endIndex = startIndex + limit; // Índice de fin para la página actual
        const pokemonsToShow = pagePokemons.slice(startIndex, endIndex); // Pokémon a mostrar en la página actual

        pokemonsToShow.forEach(pokemon => {
            const card = document.createElement("div");
            card.className = "col-md-4 mt-5 mb-4 ";

            card.innerHTML = `
                <div class="card">
                    <img src="${pokemon.sprites.front_default}" class="card-img-top" alt="${pokemon.name}">
                    <div class="card-body">
                        <h5 class="card-title">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h5>
                        <p class="card-text">Altura: ${pokemon.height} decímetros</p>
                        <p class="card-text">Peso: ${pokemon.weight} hectogramos</p>
                        <p class="card-text">Tipos: ${pokemon.types.map(type => type.type.name).join(', ')}</p>
                        <a href="#" class="btn btn-primary">Ver Más</a>
                    </div>
                </div>
            `;

            cardContainer.appendChild(card);
        });
    };

    // Función para configurar la paginación
    const setupPagination = () => {
        paginationContainer.innerHTML = ""; // Limpia el contenedor de paginación
        const pageCount = Math.ceil(allPokemons.length / limit); // Número total de páginas

        // Botón para la página anterior
        if (currentPage > 1) {
            const prevButton = document.createElement('li');
            prevButton.className = 'page-item';
            prevButton.innerHTML = `<a class="page-link" href="#" aria-label="Previous">&laquo;</a>`;
            prevButton.addEventListener('click', () => {
                currentPage--;
                displayPokemons();
                setupPagination();
            });
            paginationContainer.appendChild(prevButton);
        }

        // Botón para la primera página
        const firstPageButton = document.createElement('li');
        firstPageButton.className = 'page-item';
        firstPageButton.innerHTML = `<a class="page-link" href="#">1</a>`;
        firstPageButton.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = 1;
            displayPokemons();
            setupPagination();
        });
        paginationContainer.appendChild(firstPageButton);

        // Mostrar los números de las páginas siguientes
        const startPage = Math.max(2, currentPage - 8); // Comenzar desde 2 o el límite inferior
        const endPage = Math.min(startPage + 9, pageCount - 1); // Terminar en 10 o el límite superior

        for (let i = startPage; i <= endPage; i++) {
            const button = document.createElement('li');
            button.className = `page-item ${currentPage === i ? 'active' : ''}`;
            button.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            button.addEventListener('click', (e) => {
                e.preventDefault(); // Evita el comportamiento predeterminado del enlace
                currentPage = i; // Actualiza la página actual
                displayPokemons(); // Muestra los Pokémon de la nueva página
                setupPagination();
            });
            paginationContainer.appendChild(button);
        }

        // Botón para el último número de página
        if (pageCount > 1) {
            const lastPageButton = document.createElement('li');
            lastPageButton.className = 'page-item';
            lastPageButton.innerHTML = `<a class="page-link" href="#">${pageCount}</a>`;
            lastPageButton.addEventListener('click', (e) => {
                e.preventDefault();
                currentPage = pageCount;
                displayPokemons();
                setupPagination();
            });
            paginationContainer.appendChild(lastPageButton);
        }

        // Botón para la página siguiente
        if (currentPage < pageCount) {
            const nextButton = document.createElement('li');
            nextButton.className = 'page-item';
            nextButton.innerHTML = `<a class="page-link" href="#" aria-label="Next">&raquo;</a>`;
            nextButton.addEventListener('click', () => {
                currentPage++;
                displayPokemons();
                setupPagination();
            });
            paginationContainer.appendChild(nextButton);
        }
    };

    
    const filterPokemons = () => {
        const searchTerm = searchInput.value.toLowerCase(); 
        const filteredPokemons = allPokemons.filter(pokemon =>
            pokemon.name.toLowerCase().includes(searchTerm)
        );

        // Resetea la página actual y muestra los Pokémon filtrados
        currentPage = 1; // Reinicia a la primera página
        displayPokemons(filteredPokemons);
        setupPagination();
    };

    // Evento de búsqueda
    searchButton.addEventListener('click', filterPokemons);

    // Llamar a la función para obtener todos los Pokémon
    fetchAllPokemons().catch(error => console.error("Error:", error));
});
