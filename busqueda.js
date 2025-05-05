// Variables globales
var pokedata = [];
var typeData = {};

// Función para cargar datos
function cargarDatos() {
    console.log("Iniciando carga de datos...");
    
    // Cargar pokedata.json
    var xhr1 = new XMLHttpRequest();
    xhr1.open("GET", "./pokedata.json", true);
    xhr1.onreadystatechange = function() {
        if (xhr1.readyState === 4) {
            if (xhr1.status === 200) {
                try {
                    pokedata = JSON.parse(xhr1.responseText);
                    console.log("Pokédex cargada (" + pokedata.length + " Pokémon)");
                } catch (e) {
                    console.error("Error al parsear pokedata.json:", e);
                }
            } else {
                console.error("Error al cargar pokedata.json:", xhr1.status);
            }
        }
    };
    xhr1.send();

    // Cargar types.json
    var xhr2 = new XMLHttpRequest();
    xhr2.open("GET", "./types.json", true);
    xhr2.onreadystatechange = function() {
        if (xhr2.readyState === 4) {
            if (xhr2.status === 200) {
                try {
                    typeData = JSON.parse(xhr2.responseText);
                    console.log("Tipos cargados");
                    // Auto-búsqueda si hay texto en el input
                    var inputVal = document.getElementById("pokeInput").value;
                    if (inputVal && inputVal.trim() !== "") {
                        setTimeout(buscar, 100);
                    }
                } catch (e) {
                    console.error("Error al parsear types.json:", e);
                }
            } else {
                console.error("Error al cargar types.json:", xhr2.status);
            }
        }
    };
    xhr2.send();
}

// Traducción de estadísticas
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

// Capitalizar primera letra
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Determinar generación por ID
function determinarGeneracion(id) {
    if (id >= 1 && id <= 151) return "1gen";
    else if (id >= 152 && id <= 251) return "2gen";
    else if (id >= 252 && id <= 386) return "3gen";
    else if (id >= 387 && id <= 493) return "4gen";
    else if (id >= 494 && id <= 649) return "5gen";
    else if (id >= 650 && id <= 721) return "6gen";
    else if (id >= 722 && id <= 809) return "7gen";
    else if (id >= 810 && id <= 898) return "8gen";
    else if (id >= 899 && id <= 1025) return "9gen";
    else return "unknown";
}

// Calcular interacciones de tipos
function calcularInteracciones(tipos) {
    if (!typeData.gen1 || tipos.length === 0) return null;
    
    var gen = 'gen1';
    if (tipos.length > 1) {
        gen = 'gen2';
    } else {
        if (tipos[0] === 'hada') gen = 'gen6';
        else if (tipos[0] === 'acero' || tipos[0] === 'siniestro') gen = 'gen2';
    }
    
    var resultado = {
        weak: {},
        resist: {},
        strong: {},
        immune: []
    };
    
    for (var i = 0; i < tipos.length; i++) {
        var tipo = tipos[i].toLowerCase();
        if (!typeData[gen] || !typeData[gen][tipo]) continue;
        var data = typeData[gen][tipo];
        
        if (data.weak) {
            for (var j = 0; j < data.weak.length; j++) {
                var weakType = data.weak[j];
                resultado.weak[weakType] = (resultado.weak[weakType] || 0) + 1;
            }
        }
        
        if (data.resist) {
            for (var j = 0; j < data.resist.length; j++) {
                var resistType = data.resist[j];
                resultado.resist[resistType] = (resultado.resist[resistType] || 0) + 1;
            }
        }
        
        if (data.strong) {
            for (var j = 0; j < data.strong.length; j++) {
                var strongType = data.strong[j];
                resultado.strong[strongType] = (resultado.strong[strongType] || 0) + 1;
            }
        }
        
        if (data.immune) {
            for (var j = 0; j < data.immune.length; j++) {
                var immuneType = data.immune[j];
                if (resultado.immune.indexOf(immuneType) === -1) {
                    resultado.immune.push(immuneType);
                }
            }
        }
    }
    
    for (var type in resultado.weak) {
        if (resultado.resist[type]) {
            if (resultado.weak[type] === resultado.resist[type]) {
                delete resultado.weak[type];
                delete resultado.resist[type];
            }
        }
    }
    
    return resultado;
}

// Mostrar detalles de tipos
function mostrarDetallesTipos(tipos) {
    var detailsContainer = document.getElementById('typeDetails');
    detailsContainer.innerHTML = '';
    
    if (!tipos || tipos.length === 0 || !typeData.gen1) {
        detailsContainer.style.display = 'none';
        return;
    }
    
    var interacciones = calcularInteracciones(tipos);
    if (!interacciones) {
        detailsContainer.style.display = 'none';
        return;
    }
    
    var html = '<div class="type-header">Interacciones de Tipo</div>';
    
    // Debilidades
    if (Object.keys(interacciones.weak).length > 0) {
        html += '<div class="type-section"><strong>Débil contra:</strong><div class="type-list">';
        for (var type in interacciones.weak) {
            var multiplier = interacciones.weak[type] > 1 ? ' (x4)' : ' (x2)';
            html += '<div class="type-tag weak ' + type + '">' + resolveElectricAndPsychicTypes(capitalizeFirstLetter(type)) + multiplier + '</div>';
        }
        html += '</div></div>';
    }
    
    // Resistencias
    if (Object.keys(interacciones.resist).length > 0) {
        html += '<div class="type-section"><strong>Resistente a:</strong><div class="type-list">';
        for (var type in interacciones.resist) {
            var multiplier = interacciones.resist[type] > 1 ? ' (x1/4)' : ' (x1/2)';
            html += '<div class="type-tag resist ' + type + '">' + resolveElectricAndPsychicTypes(capitalizeFirstLetter(type)) + multiplier + '</div>';
        }
        html += '</div></div>';
    }
    
    // Inmunidades
    if (interacciones.immune.length > 0) {
        html += '<div class="type-section"><strong>Inmune a:</strong><div class="type-list">';
        for (var i = 0; i < interacciones.immune.length; i++) {
            html += '<div class="type-tag immune ' + interacciones.immune[i] + '">' + resolveElectricAndPsychicTypes(capitalizeFirstLetter(interacciones.immune[i])) + '</div>';
        }
        html += '</div></div>';
    }
    
    // Fortalezas
    if (Object.keys(interacciones.strong).length > 0) {
        html += '<div class="type-section"><strong>Fuerte contra:</strong><div class="type-list">';
        for (var type in interacciones.strong) {
            html += '<div class="type-tag strong ' + type + '">' + capitalizeFirstLetter(type) + '</div>';
        }
        html += '</div></div>';
    }
    
    detailsContainer.innerHTML = html;
    detailsContainer.style.display = 'block';
}

// Corregir nombres de tipos
function resolveElectricAndPsychicTypes(type) {
    if (type === "Electrico") return "Eléctrico";
    if (type === "Psiquico") return "Psíquico";
    return type;
}

// Función de búsqueda principal
function buscar() {
    console.log("Ejecutando búsqueda...");
    var input = document.getElementById("pokeInput").value.trim().toLowerCase();
    var img = document.getElementById("pokeImg");
    var info = document.getElementById("pokeInfo");
    var pokeName = document.getElementById("pokeName");

    if (!input) {
        console.log("Búsqueda vacía");
        return;
    }

    var pokemon = null;

    // Buscar por número o nombre
    if (!isNaN(input)) {
        var numero = parseInt(input);
        for (var i = 0; i < pokedata.length; i++) {
            if (pokedata[i].id === numero) {
                pokemon = pokedata[i];
                break;
            }
        }
    } else {
        for (var i = 0; i < pokedata.length; i++) {
            if (pokedata[i].nombre.toLowerCase() === input) {
                pokemon = pokedata[i];
                break;
            }
        }
    }

    if (pokemon) {
        console.log("Pokémon encontrado:", pokemon.nombre);
        var genFolder = determinarGeneracion(pokemon.id);
        img.src = "sprites/" + genFolder + "/" + pokemon.id + ".png";
        
        img.onerror = function() {
            console.log("Imagen no encontrada, usando MissingNo");
            this.src = "sprites/MissingNo.png";
        };

        pokeName.innerHTML = pokemon.nombre;

        var html = "<b>Tipos:</b> ";
        var tipos = [];
        for (var i = 0; i < pokemon.tipos.length; i++) {
            var tipo = pokemon.tipos[i].toLowerCase();
            tipos.push(tipo);
            html += '<span class="type-btn ' + tipo + '">' + resolveElectricAndPsychicTypes(pokemon.tipos[i]) + '</span> ';
        }

        html += "<br><a id='tablaTiposBtn' href='index.html'>Revisar tabla de tipos</a><br><br>";
        html += "<b>Estadísticas:</b><br>";
        var stats = pokemon.stats;
        for (var stat in stats) {
            html += traducirEstadisticas(stat) + ": " + stats[stat] + "<br>";
        }

        if (pokemon.evolucion.length > 0) {
            var evo = pokemon.evolucion[0];
            html += "<br><b>Evoluciona a:</b> " + evo.b + "<br>";
            html += "<b>Condiciones:</b><br>";
            for (var j = 0; j < evo.condiciones.length; j++) {
                html += "- " + evo.condiciones[j] + "<br>";
            }
        } else {
            html += "<br><b>Sin evoluciones.</b>";
        }

        info.innerHTML = html;
        mostrarDetallesTipos(tipos);
    } else {
        console.log("Pokémon no encontrado");
        alert("Pokémon no encontrado.");
    }
}

// Inicialización
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(cargarDatos, 100);
} else {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(cargarDatos, 100);
    });
}
