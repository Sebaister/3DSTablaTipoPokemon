// Funciones para interactuar con la PokeAPI v2
const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

// Función para realizar peticiones a la API
async function fetchFromPokeAPI(endpoint) {
    try {
        const response = await fetch(`${POKEAPI_BASE_URL}/${endpoint}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener datos de PokeAPI:', error);
        return null;
    }
}

// Función para buscar un Pokémon por nombre o ID
async function searchPokemon(query) {
    query = query.toLowerCase().trim();
    return await fetchFromPokeAPI(`pokemon/${query}`);
}

// Función para buscar un tipo
async function searchType(query) {
    query = query.toLowerCase().trim();
    return await fetchFromPokeAPI(`type/${query}`);
}

// Función para buscar un movimiento
async function searchMove(query) {
    query = query.toLowerCase().trim();
    return await fetchFromPokeAPI(`move/${query}`);
}

// Función para buscar una habilidad
async function searchAbility(query) {
    query = query.toLowerCase().trim();
    return await fetchFromPokeAPI(`ability/${query}`);
}

// Función para buscar un objeto
async function searchItem(query) {
    query = query.toLowerCase().trim();
    return await fetchFromPokeAPI(`item/${query}`);
}

// Función para mostrar los detalles de un Pokémon
function displayPokemonDetails(pokemon, container) {
    if (!pokemon) {
        container.innerHTML = '<p class="error">No se encontró el Pokémon.</p>';
        return;
    }

    // Crear el HTML para mostrar los detalles del Pokémon
    let html = `
        <div class="pokemon-card">
            <h3>${capitalizeFirstLetter(pokemon.name)} #${pokemon.id}</h3>
            <div class="pokemon-images">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" class="pokemon-sprite">
                ${pokemon.sprites.front_shiny ? `<img src="${pokemon.sprites.front_shiny}" alt="${pokemon.name} shiny" class="pokemon-sprite">` : ''}
            </div>
            <div class="pokemon-types">
                ${pokemon.types.map(t => `<span class="type-badge ${t.type.name}">${capitalizeFirstLetter(t.type.name)}</span>`).join('')}
            </div>
            <div class="pokemon-info">
                <p><strong>Altura:</strong> ${pokemon.height / 10} m</p>
                <p><strong>Peso:</strong> ${pokemon.weight / 10} kg</p>
            </div>
            <div class="pokemon-stats">
                <h4>Estadísticas base</h4>
                <ul>
                    ${pokemon.stats.map(s => `<li><strong>${translateStatName(s.stat.name)}:</strong> ${s.base_stat}</li>`).join('')}
                </ul>
            </div>
            <div class="pokemon-abilities">
                <h4>Habilidades</h4>
                <ul>
                    ${pokemon.abilities.map(a => `<li>${capitalizeFirstLetter(a.ability.name)}${a.is_hidden ? ' (Oculta)' : ''}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// Función para mostrar los detalles de un tipo
function displayTypeDetails(type, container) {
    if (!type) {
        container.innerHTML = '<p class="error">No se encontró el tipo.</p>';
        return;
    }

    // Crear el HTML para mostrar los detalles del tipo
    let html = `
        <div class="type-card ${type.name}">
            <h3>${capitalizeFirstLetter(type.name)}</h3>
            <div class="damage-relations">
                <h4>Relaciones de daño</h4>
                
                <div class="damage-section">
                    <h5>Doble daño a:</h5>
                    <div class="type-list">
                        ${type.damage_relations.double_damage_to.length ? 
                            type.damage_relations.double_damage_to.map(t => 
                                `<span class="type-badge ${t.name}">${capitalizeFirstLetter(t.name)}</span>`
                            ).join('') : 
                            '<span class="none">Ninguno</span>'}
                    </div>
                </div>
                
                <div class="damage-section">
                    <h5>Mitad de daño a:</h5>
                    <div class="type-list">
                        ${type.damage_relations.half_damage_to.length ? 
                            type.damage_relations.half_damage_to.map(t => 
                                `<span class="type-badge ${t.name}">${capitalizeFirstLetter(t.name)}</span>`
                            ).join('') : 
                            '<span class="none">Ninguno</span>'}
                    </div>
                </div>
                
                <div class="damage-section">
                    <h5>Sin efecto a:</h5>
                    <div class="type-list">
                        ${type.damage_relations.no_damage_to.length ? 
                            type.damage_relations.no_damage_to.map(t => 
                                `<span class="type-badge ${t.name}">${capitalizeFirstLetter(t.name)}</span>`
                            ).join('') : 
                            '<span class="none">Ninguno</span>'}
                    </div>
                </div>
                
                <div class="damage-section">
                    <h5>Doble daño de:</h5>
                    <div class="type-list">
                        ${type.damage_relations.double_damage_from.length ? 
                            type.damage_relations.double_damage_from.map(t => 
                                `<span class="type-badge ${t.name}">${capitalizeFirstLetter(t.name)}</span>`
                            ).join('') : 
                            '<span class="none">Ninguno</span>'}
                    </div>
                </div>
                
                <div class="damage-section">
                    <h5>Mitad de daño de:</h5>
                    <div class="type-list">
                        ${type.damage_relations.half_damage_from.length ? 
                            type.damage_relations.half_damage_from.map(t => 
                                `<span class="type-badge ${t.name}">${capitalizeFirstLetter(t.name)}</span>`
                            ).join('') : 
                            '<span class="none">Ninguno</span>'}
                    </div>
                </div>
                
                <div class="damage-section">
                    <h5>Sin efecto de:</h5>
                    <div class="type-list">
                        ${type.damage_relations.no_damage_from.length ? 
                            type.damage_relations.no_damage_from.map(t => 
                                `<span class="type-badge ${t.name}">${capitalizeFirstLetter(t.name)}</span>`
                            ).join('') : 
                            '<span class="none">Ninguno</span>'}
                    </div>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// Función para mostrar los detalles de un movimiento
function displayMoveDetails(move, container) {
    if (!move) {
        container.innerHTML = '<p class="error">No se encontró el movimiento.</p>';
        return;
    }

    // Obtener la descripción en español si está disponible
    let description = '';
    if (move.flavor_text_entries) {
        const spanishEntry = move.flavor_text_entries.find(entry => entry.language.name === 'es');
        description = spanishEntry ? spanishEntry.flavor_text : 'No hay descripción disponible en español.';
    }

    // Crear el HTML para mostrar los detalles del movimiento
    let html = `
        <div class="move-card ${move.type.name}">
            <h3>${capitalizeFirstLetter(move.name)}</h3>
            <p class="move-description">${description}</p>
            <div class="move-info">
                <p><strong>Tipo:</strong> <span class="type-badge ${move.type.name}">${capitalizeFirstLetter(move.type.name)}</span></p>
                <p><strong>Categoría:</strong> ${capitalizeFirstLetter(move.damage_class.name)}</p>
                <p><strong>PP:</strong> ${move.pp}</p>
                <p><strong>Potencia:</strong> ${move.power || 'N/A'}</p>
                <p><strong>Precisión:</strong> ${move.accuracy || 'N/A'}</p>
            </div>
            <div class="move-effect">
                <h4>Efecto</h4>
                <p>${move.effect_entries.length > 0 ? move.effect_entries[0].effect : 'No hay información disponible.'}</p>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// Función para mostrar los detalles de una habilidad
function displayAbilityDetails(ability, container) {
    if (!ability) {
        container.innerHTML = '<p class="error">No se encontró la habilidad.</p>';
        return;
    }

    // Obtener la descripción en español si está disponible
    let description = '';
    if (ability.flavor_text_entries) {
        const spanishEntry = ability.flavor_text_entries.find(entry => entry.language.name === 'es');
        description = spanishEntry ? spanishEntry.flavor_text : 'No hay descripción disponible en español.';
    }

    // Crear el HTML para mostrar los detalles de la habilidad
    let html = `
        <div class="ability-card">
            <h3>${capitalizeFirstLetter(ability.name)}</h3>
            <p class="ability-description">${description}</p>
            <div class="ability-effect">
                <h4>Efecto</h4>
                <p>${ability.effect_entries.length > 0 ? ability.effect_entries[0].effect : 'No hay información disponible.'}</p>
            </div>
            <div class="pokemon-with-ability">
                <h4>Pokémon con esta habilidad</h4>
                <ul>
                    ${ability.pokemon.slice(0, 10).map(p => `<li>${capitalizeFirstLetter(p.pokemon.name)}</li>`).join('')}
                    ${ability.pokemon.length > 10 ? `<li>Y ${ability.pokemon.length - 10} más...</li>` : ''}
                </ul>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// Función para mostrar los detalles de un objeto
function displayItemDetails(item, container) {
    if (!item) {
        container.innerHTML = '<p class="error">No se encontró el objeto.</p>';
        return;
    }

    // Obtener la descripción en español si está disponible
    let description = '';
    if (item.flavor_text_entries) {
        const spanishEntry = item.flavor_text_entries.find(entry => entry.language.name === 'es');
        description = spanishEntry ? spanishEntry.flavor_text : 'No hay descripción disponible en español.';
    }

    // Crear el HTML para mostrar los detalles del objeto
    let html = `
        <div class="item-card">
            <h3>${capitalizeFirstLetter(item.name)}</h3>
            <div class="item-image">
                <img src="${item.sprites.default}" alt="${item.name}" class="item-sprite">
            </div>
            <p class="item-description">${description}</p>
            <div class="item-info">
                <p><strong>Categoría:</strong> ${capitalizeFirstLetter(item.category.name)}</p>
                <p><strong>Costo:</strong> ${item.cost} PokéDólares</p>
            </div>
            <div class="item-effect">
                <h4>Efecto</h4>
                <p>${item.effect_entries.length > 0 ? item.effect_entries[0].effect : 'No hay información disponible.'}</p>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// Función para capitalizar la primera letra de una cadena
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Función para traducir los nombres de las estadísticas
function translateStatName(statName) {
    const translations = {
        'hp': 'PS',
        'attack': 'Ataque',
        'defense': 'Defensa',
        'special-attack': 'Ataque Especial',
        'special-defense': 'Defensa Especial',
        'speed': 'Velocidad'
    };
    return translations[statName] || statName;
}

// Inicializar la funcionalidad cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    const searchType = document.getElementById('searchType');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsContainer = document.getElementById('pokeapi-results');
    const detailsContainer = document.getElementById('pokeapi-details');

    // Función para realizar la búsqueda
    async function performSearch() {
        const query = searchInput.value.trim();
        if (!query) {
            resultsContainer.innerHTML = '<p class="error">Por favor, ingresa un término de búsqueda.</p>';
            return;
        }

        resultsContainer.innerHTML = '<p class="loading">Cargando...</p>';
        detailsContainer.innerHTML = '';

        let result;
        switch (searchType.value) {
            case 'pokemon':
                result = await searchPokemon(query);
                if (result) displayPokemonDetails(result, detailsContainer);
                break;
            case 'type':
                result = await searchType(query);
                if (result) displayTypeDetails(result, detailsContainer);
                break;
            case 'move':
                result = await searchMove(query);
                if (result) displayMoveDetails(result, detailsContainer);
                break;
            case 'ability':
                result = await searchAbility(query);
                if (result) displayAbilityDetails(result, detailsContainer);
                break;
            case 'item':
                result = await searchItem(query);
                if (result) displayItemDetails(result, detailsContainer);
                break;
        }

        if (result) {
            resultsContainer.innerHTML = '<p class="success">¡Búsqueda exitosa!</p>';
        } else {
            resultsContainer.innerHTML = '<p class="error">No se encontraron resultados. Verifica el término de búsqueda.</p>';
            detailsContainer.innerHTML = '';
        }
    }

    // Evento para el botón de búsqueda
    searchButton.addEventListener('click', performSearch);

    // Evento para buscar al presionar Enter
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
});