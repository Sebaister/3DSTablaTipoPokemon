// Intentamos cargar desde la API online primero, si falla -> usamos datos locales
async function searchPokemon() {
    const pokemonName = document.getElementById("pokemonInput").value.toLowerCase();
    const resultDiv = document.getElementById("result");

    // Limpiamos resultados anteriores
    resultDiv.innerHTML = "<p>Cargando...</p>";

    try {
        // 1. Intento ONLINE (usando proxy CORS para Firefox/PC)
        const onlineData = await fetchPokemonOnline(pokemonName);
        displayPokemon(onlineData);
    } catch (onlineError) {
        console.error("Error online:", onlineError);
        
        // 2. Si falla, intentamos OFFLINE (para 3DS)
        try {
            const offlineData = await fetchPokemonOffline(pokemonName);
            displayPokemon(offlineData);
            resultDiv.innerHTML += "<p><small>(Datos locales - Modo 3DS)</small></p>";
        } catch (offlineError) {
            console.error("Error offline:", offlineError);
            resultDiv.innerHTML = `<p>Error: Pokémon no encontrado. Prueba con "pikachu".</p>`;
        }
    }
}

// Método ONLINE (Funciona en Firefox/PC)
async function fetchPokemonOnline(name) {
    const proxyUrl = "https://corsproxy.io/?";  // Proxy CORS gratuito
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${name}`;
    
    const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
    if (!response.ok) throw new Error("Pokémon no encontrado online");
    return await response.json();
}

// Método OFFLINE (Para 3DS)
async function fetchPokemonOffline(name) {
    const response = await fetch(`pokemon/${name}.json`);
    if (!response.ok) throw new Error("Pokémon no encontrado offline");
    return await response.json();
}

// Muestra los datos del Pokémon
function displayPokemon(pokemon) {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `
        <h2>${pokemon.name.toUpperCase()}</h2>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
        <p>Altura: ${pokemon.height / 10}m</p>
        <p>Peso: ${pokemon.weight / 10}kg</p>
    `;
}