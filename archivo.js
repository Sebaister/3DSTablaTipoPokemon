var pokedata = [];
var typeData = {};

function cargarDatos() {
    var xhr1 = new XMLHttpRequest();
    xhr1.open("GET", "pokedata.json", true);
    xhr1.onreadystatechange = function () {
        if (xhr1.readyState == 4 && xhr1.status == 200) {
            pokedata = JSON.parse(xhr1.responseText);
        }
    };
    xhr1.send();

    var xhr2 = new XMLHttpRequest();
    xhr2.open("GET", "types.json", true);
    xhr2.onreadystatechange = function () {
        if (xhr2.readyState == 4 && xhr2.status == 200) {
            typeData = JSON.parse(xhr2.responseText);
        }
    };
    xhr2.send();
}

function buscar() {
    var nombre = document.getElementById("pokeInput").value.toLowerCase();
    var resultado = null;

    for (var i = 0; i < pokedata.length; i++) {
        if (pokedata[i].name.toLowerCase() === nombre || pokedata[i].id == nombre) {
            resultado = pokedata[i];
            break;
        }
    }

    if (resultado !== null) {
        mostrarPokemon(resultado);
    } else {
        document.getElementById("pokeName").textContent = "Pokémon no encontrado";
        document.getElementById("pokeImg").src = "";
        document.getElementById("pokeInfo").textContent = "";
    }
}

function mostrarPokemon(poke) {
    document.getElementById("pokeName").textContent = "#" + poke.id + " " + poke.name;
    document.getElementById("pokeImg").src = "sprites/" + poke.id + ".png";

    var info = "Tipos: ";
    for (var i = 0; i < poke.types.length; i++) {
        var tipo = poke.types[i];
        info += tipo;
        if (i < poke.types.length - 1) {
            info += ", ";
        }
    }

    info += "<br>Estadísticas:<br>";
    for (var j = 0; j < poke.stats.length; j++) {
        var stat = poke.stats[j];
        info += traducirEstadisticas(stat.name) + ": " + stat.base_stat + "<br>";
    }

    if (poke.evolves_to) {
        info += "<br>Evoluciona a: " + poke.evolves_to;
    }

    document.getElementById("pokeInfo").innerHTML = info;
}

function traducirEstadisticas(stat) {
    var traducciones = {
        "hp": "PS",
        "attack": "Ataque",
        "defense": "Defensa",
        "special-attack": "Ataque Especial",
        "special-defense": "Defensa Especial",
        "speed": "Velocidad"
    };
    return traducciones[stat] || stat;
}

// Ejecutar cuando se cargue todo
window.onload = function () {
    cargarDatos();
};
