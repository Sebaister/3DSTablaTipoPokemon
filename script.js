// Función para obtener datos de un Pokémon
function getPokemon(pokemonName) {
    var xhr = new XMLHttpRequest();
    var url = "https://pokeapi.co/api/v2/pokemon/" + pokemonName.toLowerCase();
    
    xhr.open("GET", url, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var pokemon = JSON.parse(xhr.responseText);
            displayPokemon(pokemon);
        } else {
            document.getElementById("pokemon-info").innerHTML = 
                "<p>Pokémon no encontrado. Intenta con otro nombre.</p>";
        }
    };
    xhr.onerror = function() {
        document.getElementById("pokemon-info").innerHTML = 
            "<p>Error al cargar los datos.</p>";
    };
    xhr.send();
}

// Función para mostrar los datos del Pokémon
function displayPokemon(pokemon) {
    var pokemonInfo = document.getElementById("pokemon-info");
    pokemonInfo.innerHTML = `
        <h2>${pokemon.name.toUpperCase()}</h2>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <p>Altura: ${pokemon.height / 10} m</p>
        <p>Peso: ${pokemon.weight / 10} kg</p>
        <p>Tipo(s): ${pokemon.types.map(t => t.type.name).join(", ")}</p>
    `;
}

// Ejemplo: Cargar Pikachu al inicio
getPokemon("pikachu");