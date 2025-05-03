<script>
// Mostrar detalles de tipo
function showType(typeId) {
    // Oculta todos los detalles primero
    var details = document.getElementsByClassName('type-detail');
    for (var i = 0; i < details.length; i++) {
        details[i].style.display = 'none';
    }

    // Muestra el seleccionado
    document.getElementById(typeId).style.display = 'block';

    // Desplaza a la vista (sin animación smooth para mejor rendimiento)
    document.getElementById(typeId).scrollIntoView();
}

var pokedata = [];

// Cargar datos del archivo JSON
var xhr = new XMLHttpRequest();
xhr.open('GET', 'pokedata.json', true);
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        pokedata = JSON.parse(xhr.responseText);
    }
};
xhr.send();

// Buscar Pokémon al escribir
document.addEventListener('DOMContentLoaded', function () {
    var input = document.getElementById('search');
    var infoDiv = document.getElementById('pokemon-info');

    input.oninput = function () {
        var query = this.value.toLowerCase().trim();
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
    };

    function mostrarPokemon(pokemon) {
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
});
</script>
