// Configuración del proxy
const PROXY_URL = "https://proxy3ds.sebadrgn.workers.dev/";
const POKEAPI_URL = "https://pokeapi.co/api/v2/pokemon/";

document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const input = document.getElementById('pokemon-input').value.trim().toLowerCase();
    if (input) {
        searchPokemon(input);
    }
});

function searchPokemon(query) {
    const infoDiv = document.getElementById('pokemon-info');
    infoDiv.innerHTML = '<p>Cargando...</p>';
    
    // Usamos el proxy de Cloudflare para evitar problemas CORS y limitaciones de la 3DS
    fetch(`${PROXY_URL}?url=${encodeURIComponent(POKEAPI_URL + query)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Pokémon no encontrado');
            }
            return response.json();
        })
        .then(data => {
            displayPokemonInfo(data);
        })
        .catch(error => {
            infoDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
        });
}

function displayPokemonInfo(pokemon) {
    const infoDiv = document.getElementById('pokemon-info');
    
    // Usamos sprites de la generación 5 que son más ligeros
    const imageUrl = pokemon.sprites.versions['generation-v']['black-white'].front_default || 
                     pokemon.sprites.front_default;
    
    let html = `
        <h2>#${pokemon.id} - ${capitalizeFirstLetter(pokemon.name)}</h2>
        <img src="${imageUrl}" alt="${pokemon.name}" class="pokemon-image">
        <div class="stats">
            <p><strong>Altura:</strong> ${pokemon.height / 10}m</p>
            <p><strong>Peso:</strong> ${pokemon.weight / 10}kg</p>
            <p><strong>Tipo(s):</strong> ${pokemon.types.map(t => capitalizeFirstLetter(t.type.name)).join(', ')}</p>
            <p><strong>Habilidades:</strong> ${pokemon.abilities.map(a => capitalizeFirstLetter(a.ability.name)).join(', ')}</p>
        </div>
    `;
    
    infoDiv.innerHTML = html;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
