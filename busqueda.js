var pokedata = [];
var typeData = {};

// Cargar los datos de los Pokémon y los tipos
function cargarDatos() {
    // Cargar datos de Pokémon
    var xhr1 = new XMLHttpRequest();
    xhr1.open("GET", "pokedata.json", true);
    xhr1.onreadystatechange = function() {
        if (xhr1.readyState == 4 && xhr1.status == 200) {
            pokedata = JSON.parse(xhr1.responseText);
        }
    };
    xhr1.send();
    
    // Cargar datos de tipos
    var xhr2 = new XMLHttpRequest();
    xhr2.open("GET", "types.json", true);
    xhr2.onreadystatechange = function() {
        if (xhr2.readyState == 4 && xhr2.status == 200) {
            typeData = JSON.parse(xhr2.responseText);
            // Forzar mostrar detalles después de cargar los datos
            if (document.getElementById("pokeInput").value) {
                buscar();
            }
        }
    };
    xhr2.send();
}

// Traducción de las estadísticas
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

// Función para capitalizar la primera letra
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Función para determinar la generación por el ID del Pokémon
function determinarGeneracion(id) {
    if (id >= 1 && id <= 151) return "1gen";
    else if (id >= 152 && id <= 251) return "2gen";
    else if (id >= 252 && id <= 386) return "3gen";
    else if (id >= 387 && id <= 493) return "4gen";
    else if (id >= 494 && id <= 649) return "5gen";
    else if (id >= 650 && id <= 721) return "6gen";
    else if (id >= 722 && id <= 809) return "7gen";
    else if (id >= 810 &&
