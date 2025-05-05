(function () {
    var searchInput = document.getElementById("searchInput");
    var resultsDiv = document.getElementById("results");

    function loadJSON(callback) {
        var xhr = new XMLHttpRequest();
        xhr.overrideMimeType("application/json");
        xhr.open("GET", "pokedex.json", true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                callback(JSON.parse(xhr.responseText));
            }
        };
        xhr.send(null);
    }

    function mostrarResultados(data, query) {
        resultsDiv.innerHTML = "";

        for (var i = 0; i < data.length; i++) {
            var pokemon = data[i];
            if (
                pokemon.nombre.toLowerCase().indexOf(query) !== -1 ||
                (pokemon.nombre_alt && pokemon.nombre_alt.toLowerCase().indexOf(query) !== -1)
            ) {
                var card = document.createElement("div");
                card.className = "pokemon-card";

                var nombre = document.createElement("h2");
                nombre.textContent = pokemon.nombre;

                var imagen = document.createElement("img");
                imagen.src = "sprites/" + pokemon.id + ".png";
                imagen.alt = pokemon.nombre;

                var tipos = document.createElement("p");
                tipos.textContent = "Tipo: " + pokemon.tipos.join(", ");

                var stats = document.createElement("p");
                stats.textContent = "PS: " + pokemon.ps + " | Ataque: " + pokemon.ataque + " | Defensa: " + pokemon.defensa;

                var evolucion = document.createElement("p");
                if (pokemon.evoluciona_de) {
                    evolucion.textContent = "Evoluciona de: " + pokemon.evoluciona_de;
                } else if (pokemon.evoluciona_a && pokemon.evoluciona_a.length > 0) {
                    evolucion.textContent = "Evoluciona a: " + pokemon.evoluciona_a.join(", ");
                } else {
                    evolucion.textContent = "No tiene evolución.";
                }

                card.appendChild(nombre);
                card.appendChild(imagen);
                card.appendChild(tipos);
                card.appendChild(stats);
                card.appendChild(evolucion);
                resultsDiv.appendChild(card);
            }
        }
    }

    loadJSON(function (data) {
        searchInput.addEventListener("input", function () {
            var query = searchInput.value.toLowerCase().trim();
            if (query.length >= 1) {
                mostrarResultados(data, query);
            } else {
                resultsDiv.innerHTML = "";
            }
        });
    });
})();
