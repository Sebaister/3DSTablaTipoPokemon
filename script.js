function loadPokemonFromLocalFile() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "pikachu.json", true); // Archivo local
    xhr.onload = function() {
        if (xhr.status === 200) {
            var pokemon = JSON.parse(xhr.responseText);
            displayPokemon(pokemon);
        } else {
            document.getElementById("pokemon-info").innerHTML = 
                "<p>Error al cargar el archivo local.</p>";
        }
    };
    xhr.send();
}

// Llama a esta función en lugar de getPokemon()
loadPokemonFromLocalFile();
