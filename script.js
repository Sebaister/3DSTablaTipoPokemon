<script>
// Declarar global para que la usen otras funciones
var pokedata = [];

// Cargar JSON al iniciar
var xhr = new XMLHttpRequest();
xhr.open('GET', 'pokedata.json', true);
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        pokedata = JSON.parse(xhr.responseText);
        inicializarBuscador();
    }
};
xhr.send();

// Función global para mostrar tipos (para botones)
function showType(typeId) {
    var details = document.getElementsByClassName('type-detail');
    for (var i = 0; i < details.length; i++) {
        details[i].style.display = 'none';
    }

    var el = document.getElementById(typeId);
    if (el) {
        el.style.display = 'block';
        el.scrollIntoView();
    }
}

// Inicializa eventos de búsqueda cuando se cargan los datos
function inicializarBuscador() {
    var input = document.getElementById('search');
    var btn = document.getElementById('search-btn');
    var infoDiv = document.getElementById('pokemon-info');

    function buscarPokemon() {
        var query = input.value.toLowerCase().trim();
        if (query === '') {
            infoDiv.innerHTML = '';
            return;
        }

        var result = null;
        for (var i = 0; i < pokedata.length; i++) {
            var p = pokedata[i];
            if (p.nombre.toLowerCase() === query || String(p.numero) === query) {
                result = p;
                break;
            }
        }

        if (result) {
            mostrarPokemon(result);
        } else {
            infoDiv.innerHTML = '<p>No se encontró ningún Pokémon.</p>';
        }
    }

    btn.onclick = buscarPokemon;
    input.onkeypress = function (e) {
        if (e.key === 'Enter') buscarPokemon();
    };
}

// Mostrar detalles del Pokémon
function mostrarPokemon(pokemon) {
    var infoDiv = document.getElementById('pokemon-info');
    var html = '';
    html += '<h2>' + pokemon.nombre + ' (#' + pokemon.numero + ')</h2>';
    html += '<img src="sprites/' + pokemon.numero + '.png" alt="' + pokemon.nombre + '">';
    html += '<p><strong>Tipo:</strong> ' + pokemon.tipos.join(', ') + '</p>';
    html += '<p><strong>Estadísticas:</strong></p>';
    html += '<ul>';
    for (var clave in pokemon.estadisticas) {
        html += '<li>' + clave + ': ' + pokemon.estadisticas[clave] + '</li>';
    }
    html += '</ul>';
    html += '<p><strong>Evolución:</strong> ' + (pokemon.evolucion || 'Ninguna') + '</p>';
    infoDiv.innerHTML = html;
}
</script>
