var pokedata = [];
var typeData = {};

// Cargar los datos de los Pokémon y los tipos
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
            if (document.getElementById("pokeInput").value) {
                buscar();
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

// Capitalizar la primera letra
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

// Ajustar tildes en tipos
function resolveElectricAndPsychicTypes(type) {
    if (type === "Electrico") return "Eléctrico";
    if (type === "Psiquico") return "Psíquico";
    return type;
}

// Calcular interacciones de tipos
function calcularInteracciones(tipos) {
    if (!typeData.gen1 || tipos.length === 0) return null;

    var gen = tipos.length > 1 ? 'gen2' : 'gen1';
    if (tipos.includes('hada')) gen = 'gen6';
    if (tipos.includes('acero') || tipos.includes('siniestro')) gen = 'gen2';

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
            data.weak.forEach(t => resultado.weak[t] = (resultado.weak[t] || 0) + 1);
        }
        if (data.resist) {
            data.resist.forEach(t => resultado.resist[t] = (resultado.resist[t] || 0) + 1);
        }
        if (data.strong) {
            data.strong.forEach(t => resultado.strong[t] = (resultado.strong[t] || 0) + 1);
        }
        if (data.immune) {
            data.immune.forEach(t => {
                if (!resultado.immune.includes(t)) resultado.immune.push(t);
            });
        }
    }

    for (var type in resultado.weak) {
        if (resultado.resist[type] && resultado.weak[type] === resultado.resist[type]) {
            delete resultado.weak[type];
            delete resultado.resist[type];
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

    if (Object.keys(interacciones.weak).length > 0) {
        html += '<div class="type-section"><strong>Débil contra:</strong><div class="type-list">';
        for (var type in interacciones.weak) {
            var mult = interacciones.weak[type] > 1 ? ' (x4)' : ' (x2)';
            html += `<div class="type-tag weak ${type}">${resolveElectricAndPsychicTypes(capitalizeFirstLetter(type))}${mult}</div>`;
        }
        html += '</div></div>';
    }

    if (Object.keys(interacciones.resist).length > 0) {
        html += '<div class="type-section"><strong>Resistente a:</strong><div class="type-list">';
        for (var type in interacciones.resist) {
            var mult = interacciones.resist[type] > 1 ? ' (x1/4)' : ' (x1/2)';
            html += `<div class="type-tag resist ${type}">${resolveElectricAndPsychicTypes(capitalizeFirstLetter(type))}${mult}</div>`;
        }
        html += '</div></div>';
    }

    if (interacciones.immune.length > 0) {
        html += '<div class="type-section"><strong>Inmune a:</strong><div class="type-list">';
        interacciones.immune.forEach(type => {
            html += `<div class="type-tag immune ${type}">${resolveElectricAndPsychicTypes(capitalizeFirstLetter(type))}</div>`;
        });
        html += '</div></div>';
    }

    if (Object.keys(interacciones.strong).length > 0) {
        html += '<div class="type-section"><strong>Fuerte contra:</strong><div class="type-list">';
        for (var type in interacciones.strong) {
            html += `<div class="type-tag strong ${type}">${capitalizeFirstLetter(type)}</div>`;
        }
        html += '</div></div>';
    }

    detailsContainer.innerHTML = html;
    detailsContainer.style.display = 'block';
}

// Buscar Pokémon
function navegarPokemon(direccion) {
    var pokemonActual = document.getElementById("pokeInput").value.toLowerCase();
    var pokemon = pokedata.find(p => p.nombre.toLowerCase() === pokemonActual);
    
    if (pokemon) {
        var idActual = pokemon.id;
        var nuevoId = idActual + direccion;
        
        // Buscar el siguiente/anterior Pokémon
        var nuevoPokemon = pokedata.find(p => p.id === nuevoId);
        
        if (nuevoPokemon) {
            document.getElementById("pokeInput").value = nuevoPokemon.nombre;
            buscar();
        }
    }
}

function actualizarBotonesNavegacion(pokemon) {
    var prevButton = document.getElementById("prevButton");
    var nextButton = document.getElementById("nextButton");
    
    if (pokemon) {
        // Ocultar botón anterior si es el primer Pokémon
        prevButton.style.display = pokemon.id === 1 ? "none" : "inline";
        
        // Ocultar botón siguiente si es el último Pokémon
        var ultimoId = Math.max(...pokedata.map(p => p.id));
        nextButton.style.display = pokemon.id === ultimoId ? "none" : "inline";
    } else {
        // Ocultar ambos botones si no hay Pokémon seleccionado
        prevButton.style.display = "none";
        nextButton.style.display = "none";
    }
}

// Modificar la función buscar existente para incluir la actualización de los botones
function buscar() {
    var input = document.getElementById("pokeInput").value.toLowerCase();
    var pokemon = pokedata.find(p => p.nombre.toLowerCase() === input);
    
    var img = document.getElementById("pokeImg");
    var info = document.getElementById("pokeInfo");
    var resultado = document.getElementById("resultado");
    var pokeName = document.getElementById("pokeName");

    var pokemon = null;

    if (!isNaN(input)) {
        var numero = parseInt(input);
        pokemon = pokedata.find(p => p.id === numero);
    } else {
        pokemon = pokedata.find(p => p.nombre.toLowerCase() === input);
    }

    if (pokemon) {
        var genFolder = determinarGeneracion(pokemon.id);
        img.src = "sprites/" + genFolder + "/" + pokemon.id + ".png";
        img.onerror = function () {
            this.src = "sprites/MissingNo.png";
        };

        pokeName.innerHTML = pokemon.nombre;

        var html = "<b>Tipos:</b> ";
        var tipos = [];
        pokemon.tipos.forEach(tipo => {
            tipos.push(tipo.toLowerCase());
            html += `<span class="type-btn ${tipo.toLowerCase()}">${resolveElectricAndPsychicTypes(tipo)}</span> `;
        });

        html += "<br><a id='tablaTiposBtn' href='index.html'>Revisar tabla de tipos</a><br><br>";
        html += "<b>Estadísticas:</b><br>";
        for (var stat in pokemon.stats) {
            html += `${traducirEstadisticas(stat)}: ${pokemon.stats[stat]}<br>`;
        }

        if (pokemon.evolucion.length > 0) {
            var evo = pokemon.evolucion[0];
            html += `<br><b>Evoluciona a:</b> ${evo.b}<br><b>Condiciones:</b><br>`;
            evo.condiciones.forEach(cond => {
                html += `- ${cond}<br>`;
            });
        } else {
            html += "<br><b>Sin evoluciones.</b>";
        }

        info.innerHTML = html;
        resultado.style.display = "block";
        mostrarDetallesTipos(tipos);
    } else {
        alert("Pokémon no encontrado.");
    }

    actualizarBotonesNavegacion(pokemon);
}

// Agregar al cargarDatos para inicializar los botones
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
            if (document.getElementById("pokeInput").value) {
                buscar();
            }
        }
    };
    xhr2.send();
}

// Iniciar al cargar
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    cargarDatos();
} else {
    document.addEventListener('DOMContentLoaded', cargarDatos);
}
