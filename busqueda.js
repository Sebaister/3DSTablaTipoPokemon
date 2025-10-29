var pokeData = [];
var typesData = {};

// Variables globales para caché
var ultimoPokemon = null;
var MAX_CACHE_SIZE = 20; // Límite de caché para 3DS (memoria limitada)
var MAX_IMAGE_CACHE = 10; // Límite de imágenes en caché (unificado para 3DS)

// Función para cargar datos
// function cargarDatos()
function cargarDatos() {
    try {
        // Cargar datos solo si no están ya cargados
        if (pokeData.length === 0) {
            var xhr1 = new XMLHttpRequest();
            // Cache-busting para evitar respuestas obsoletas o bloqueos del cache en 3DS
            xhr1.open("GET", "./pokedata.json?ts=" + new Date().getTime(), true);
            xhr1.onreadystatechange = function() {
                if (xhr1.readyState === 4) {
                    var loadingIndicator = document.getElementById("loadingIndicator");
                    if (xhr1.status === 200) {
                        try {
                            pokeData = JSON.parse(xhr1.responseText);
                            var inputElement = document.getElementById("pokeInput");
                            if (inputElement) inputElement.disabled = false;
                            if (loadingIndicator) loadingIndicator.parentNode.removeChild(loadingIndicator);
                            cargarTipos();
                        } catch (e) {
                            if (loadingIndicator) loadingIndicator.parentNode.removeChild(loadingIndicator);
                            alert(getText ? getText("error_load_data", "Error al procesar datos de Pokémon") : "Error al procesar datos de Pokémon");
                        }
                    } else {
                        if (loadingIndicator) loadingIndicator.parentNode.removeChild(loadingIndicator);
                        alert(getText ? getText("error_load_data", "Error al cargar pokedata.json") : "Error al cargar pokedata.json");
                    }
                }
            };
            xhr1.onerror = function() {
                var loadingIndicator = document.getElementById("loadingIndicator");
                if (loadingIndicator) loadingIndicator.parentNode.removeChild(loadingIndicator);
                alert(getText ? getText("error_connection", "Error de conexión") : "Error de conexión");
            };
            xhr1.send();
        } else if (Object.keys(typesData).length === 0) {
            cargarTipos();
        }
    } catch (e) {
        alert(getText ? getText("error_connection", "Error de conexión") : "Error de conexión");
    }
}

// Función separada para cargar tipos
// function cargarTipos()
function cargarTipos() {
    if (Object.keys(typesData).length === 0) {
        var xhr2 = new XMLHttpRequest();
        // Cache-busting para evitar problemas de cache del 3DS
        xhr2.open("GET", "./types.json?ts=" + new Date().getTime(), true);
        xhr2.onreadystatechange = function() {
            if (xhr2.readyState === 4) {
                var loadingIndicator = document.getElementById("loadingIndicator");
                if (xhr2.status === 200) {
                    try {
                        typesData = JSON.parse(xhr2.responseText);
                        if (loadingIndicator) loadingIndicator.parentNode.removeChild(loadingIndicator);
                    } catch (e) {
                        if (loadingIndicator) loadingIndicator.parentNode.removeChild(loadingIndicator);
                        alert(getText ? getText("error_load_data", "Error al procesar datos de tipos") : "Error al procesar datos de tipos");
                    }
                } else {
                    if (loadingIndicator) loadingIndicator.parentNode.removeChild(loadingIndicator);
                    alert(getText ? getText("error_load_data", "Error al cargar types.json") : "Error al cargar types.json");
                }
            }
        };
        xhr2.onerror = function() {
            var loadingIndicator = document.getElementById("loadingIndicator");
            if (loadingIndicator) loadingIndicator.parentNode.removeChild(loadingIndicator);
            alert(getText ? getText("error_connection", "Error de conexión") : "Error de conexión");
        };
        xhr2.send();
    }
}

// Optimización de la función buscar con caché
var ultimaBusqueda = "";
var resultadoCache = null;

// función buscar (segunda definición al final del archivo)
function buscar() {
    try {
        if (!pokeData || !pokeData.length) {
            alert(getText("no_data_loaded", "No hay datos cargados"));
            return;
        }

        var inputElement = document.getElementById("pokeInput");
        if (!inputElement) {
            alert(getText("search_field_error", "Error: No se encuentra el campo de búsqueda"));
            return;
        }

        var searchValue = inputElement.value;
        if (!searchValue) {
            alert(getText("enter_name_number", "Por favor ingrese un nombre o número"));
            return;
        }
        searchValue = searchValue.toLowerCase().replace(/^\s+|\s+$/g, '');

        // Usar caché si la búsqueda es la misma
        if (searchValue === ultimaBusqueda && resultadoCache) {
            mostrarResultado(resultadoCache);
            return;
        }
        
        // Búsqueda directa en pokeData
        var pokemon = null;

        // Buscar por ID
        if (!isNaN(searchValue)) {
            var id = parseInt(searchValue, 10);
            for (var i = 0; i < pokeData.length; i++) {
                if (pokeData[i] && pokeData[i].id === id) {
                    pokemon = pokeData[i];
                    break;
                }
            }
        }

        // Si no se encontró por ID, buscar por nombre
        if (!pokemon) {
            for (var i = 0; i < pokeData.length; i++) {
                if (pokeData[i] && pokeData[i].nombre &&
                    pokeData[i].nombre.toLowerCase().indexOf(searchValue) === 0) {
                    pokemon = pokeData[i];
                    break;
                }
            }
        }

        if (!pokemon) {
            alert(getText("pokemon_not_found", "Pokémon no encontrado"));
            return;
        }

        // Guardar en caché
        ultimaBusqueda = searchValue;
        resultadoCache = pokemon;

        mostrarResultado(pokemon);
    } catch(e) {
        alert(getText("search_error", "Error en la búsqueda"));
    }
}

// Índices para búsqueda rápida
var pokemonPorId = null;
var pokemonPorNombre = null;

// Función para inicializar índices de búsqueda (optimizada para 3DS)
function inicializarIndices() {
    if (pokemonPorId === null && pokeData && pokeData.length > 0) {
        pokemonPorId = {};
        pokemonPorNombre = {};
        
        for (var i = 0; i < pokeData.length; i++) {
            var pokemon = pokeData[i];
            if (pokemon && pokemon.id && pokemon.nombre) {
                pokemonPorId[pokemon.id] = pokemon;
                pokemonPorNombre[pokemon.nombre.toLowerCase()] = pokemon;
            }
        }
        console.log("Índices inicializados correctamente");
    } else {
        console.log("No se pudieron inicializar los índices o ya estaban inicializados");
    }
}

// Función separada para buscar Pokémon (optimizada para 3DS)
function buscarPokemon(searchValue) {
    try {
        // Inicializar índices si no existen
        inicializarIndices();
        
        // Si los índices no se inicializaron correctamente, buscar directamente en pokeData
        if (!pokemonPorId || !pokemonPorNombre) {
            // Búsqueda de respaldo directamente en pokeData
            if (!pokeData) return null;
            
            // Buscar por ID
            if (!isNaN(searchValue)) {
                var id = parseInt(searchValue, 10);
                for (var i = 0; i < pokeData.length; i++) {
                    if (pokeData[i] && pokeData[i].id === id) {
                        return pokeData[i];
                    }
                }
            }
            
            // Buscar por nombre
            var searchLower = searchValue.toLowerCase();
            for (var i = 0; i < pokeData.length; i++) {
                if (pokeData[i] && pokeData[i].nombre && 
                    (pokeData[i].nombre.toLowerCase() === searchLower || 
                     pokeData[i].nombre.toLowerCase().indexOf(searchLower) === 0)) {
                    return pokeData[i];
                }
            }
            return null;
        }
        
        // Buscar por ID (acceso directo al objeto)
        if (!isNaN(searchValue)) {
            var id = parseInt(searchValue, 10);
            if (pokemonPorId && pokemonPorId[id]) {
                return pokemonPorId[id];
            }
        }
        
        // Buscar por nombre exacto (acceso directo)
        if (pokemonPorNombre && pokemonPorNombre[searchValue]) {
            return pokemonPorNombre[searchValue];
        }
        
        // Buscar por nombre parcial (solo si es necesario)
        if (pokemonPorNombre) {
            for (var nombre in pokemonPorNombre) {
                if (nombre.indexOf(searchValue) === 0) {
                    return pokemonPorNombre[nombre];
                }
            }
        }
        
        return null;
    } catch (error) {
        console.log("Error en buscarPokemon: " + error.message);
        return null;
    }
}

// Función separada para mostrar el resultado (optimizada para 3DS)
function mostrarResultado(pokemon) {
    // Ocultar el logo cuando se encuentra un Pokémon
    var logoContainer = document.getElementById("logoContainer");
    if (logoContainer) {
        logoContainer.style.display = "none";
    }

    var resultadoElement = document.getElementById("resultado");
    var pokeImgElement = document.getElementById("pokeImg");
    var pokeNameElement = document.getElementById("pokeName");
    var pokeInfoElement = document.getElementById("pokeInfo");

    if (!resultadoElement || !pokeImgElement || !pokeNameElement || !pokeInfoElement) {
        alert("Error: Elementos no encontrados");
        return;
    }

    // Mostrar primero la información básica para dar feedback rápido al usuario
    resultadoElement.style.display = "block";
    pokeNameElement.innerHTML = pokemon.id + ". " + pokemon.nombre;
    
    // Cargar la imagen después para evitar bloquear la interfaz
    setTimeout(function() {
        // Precargar la imagen para evitar parpadeos
        var img = new Image();
        img.onload = function() {
            pokeImgElement.src = this.src;
        };
        img.onerror = function() {
            pokeImgElement.src = "sprites/MissingNo.png";
        };
        img.src = "sprites/" + determinarGeneracion(pokemon.id) + "/" + pokemon.id + ".png";
        
        // Construir HTML de una sola vez para mejor rendimiento
        var infoHtml = construirInfoHTML(pokemon);
        pokeInfoElement.innerHTML = infoHtml;
        
        // Cargar los detalles de tipos al final
        setTimeout(function() {
            mostrarDetallesTipos(pokemon.tipos);
        }, 50);
    }, 50);
    
    // Guardar el último Pokémon buscado para poder actualizar la información cuando cambie el idioma
    ultimoPokemon = pokemon;
}

// Función para actualizar la información del Pokémon con el idioma actual
function actualizarInfoPokemon() {
    if (ultimoPokemon) {
        var infoHtml = construirInfoHTML(ultimoPokemon);
        document.getElementById("pokeInfo").innerHTML = infoHtml;
        mostrarDetallesTipos(ultimoPokemon.tipos);
    }
}

// Función que se llama cuando cambia el idioma
function onLanguageChange() {
    // Actualizar la información del Pokémon actual
    actualizarInfoPokemon();
}

// Función para construir el HTML de la información
function construirInfoHTML(pokemon) {
    var infoHtml = "<b>Tipos:</b> ";
    var tipos = [];
    for (var i = 0; i < pokemon.tipos.length; i++) {
        var tipo = pokemon.tipos[i].toLowerCase();
        tipos.push(tipo);
        
        // Normalizar el tipo para la clase CSS
        var tipoClase = tipo;
        if (tipo === 'dragón') tipoClase = 'dragon';
        if (tipo === 'eléctrico') tipoClase = 'electrico';
        if (tipo === 'psíquico') tipoClase = 'psiquico';
        
        infoHtml += '<span class="type-btn ' + tipoClase + '">' + formatearNombresTipos(tipo) + '</span> ';
    }

    infoHtml += "<br><a href='index.html' class='table-button'>Revisar tabla de tipos</a><br>";
    infoHtml += "<b>Estadísticas:</b><br>";
    
    for (var stat in pokemon.stats) {
        infoHtml += traducirEstadisticas(stat) + ": " + pokemon.stats[stat] + "<br>";
    }

    if (pokemon.evolucion && pokemon.evolucion.length > 0) {
        var evo = pokemon.evolucion[0];
        infoHtml += "<br><b>Evoluciona a:</b> " + evo.b + "<br>";
        infoHtml += "<b>Condiciones:</b><br>";
        for (var i = 0; i < evo.condiciones.length; i++) {
            infoHtml += "- " + evo.condiciones[i] + "<br>";
        }
    } else {
        infoHtml += "<br><b>Sin evoluciones.</b>";
    }
    
    return infoHtml;
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

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function determinarGeneracion(id) {
    // Convertir a número para asegurar comparación correcta
    id = parseInt(id, 10);
    
    // Usar rangos más eficientes
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

// Precarga de imágenes para mejorar rendimiento
var imageCache = {};
function precargarImagen(src, callback) {
    // Si ya está en caché, usar directamente
    if (imageCache[src]) {
        if (callback) callback(imageCache[src]);
        return;
    }
    
    // Limitar el tamaño de la caché de imágenes
    if (Object.keys(imageCache).length >= MAX_IMAGE_CACHE) {
        // Eliminar la entrada más antigua
        var keys = Object.keys(imageCache);
        delete imageCache[keys[0]];
    }
    
    // Si no está en caché, cargar
    var img = new Image();
    img.onload = function() {
        imageCache[src] = this;
        if (callback) callback(this);
    };
    img.onerror = function() {
        imageCache[src] = null;
        if (callback) callback(null);
    };
    img.src = src;
}

function calcularInteracciones(tipos) {
    if (!typesData || !typesData.gen1 || !tipos || tipos.length === 0) return null;

    var gen = 'gen6';
    
    // Reemplazar includes y every por bucles for tradicionales
    var tieneHada = false;
    var tieneAceroOSiniestro = false;
    var todosTiposGen1 = true;
    
    for (var i = 0; i < tipos.length; i++) {
        if (tipos[i] === 'hada') {
            tieneHada = true;
        }
        if (tipos[i] === 'acero' || tipos[i] === 'siniestro') {
            tieneAceroOSiniestro = true;
        }
        if (tipos[i] === 'acero' || tipos[i] === 'siniestro' || tipos[i] === 'hada') {
            todosTiposGen1 = false;
        }
    }
    
    if (tieneHada) {
        gen = 'gen6';
    } else if (tieneAceroOSiniestro) {
        gen = 'gen2';
    } else if (todosTiposGen1) {
        gen = 'gen1';
    }
    
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
        if (tipo === 'dragón') tipo = 'dragon';
        if (tipo === 'eléctrico') tipo = 'electrico';
        if (tipo === 'psíquico') tipo = 'psiquico';
        
        if (!typesData[gen] || !typesData[gen][tipo]) continue;
        var data = typesData[gen][tipo];
        
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

function mostrarDetallesTipos(tipos) {
    var detailsContainer = document.getElementById('typeDetails');
    if (!tipos || tipos.length === 0 || !typesData || !typesData.gen1) {
        detailsContainer.style.display = 'none';
        return;
    }
    
    var interacciones = calcularInteracciones(tipos);
    if (!interacciones) {
        detailsContainer.style.display = 'none';
        return;
    }
    
    // Traducciones para las etiquetas de efectividad
    var efectividadTextos = {
        "es": {
            "header": "Interacciones de Tipo",
            "debil": "Débil contra:",
            "resistente": "Resistente a:",
            "inmune": "Inmune a:",
            "fuerte": "Fuerte contra:"
        },
        "en": {
            "header": "Type Interactions",
            "debil": "Weak against:",
            "resistente": "Resistant to:",
            "inmune": "Immune to:",
            "fuerte": "Strong against:"
        }
    };
    
    // Usar el idioma actual o español por defecto
    var currentLang = window.currentLang || "es";
    var textos = efectividadTextos[currentLang] || efectividadTextos["es"];
    
    // Optimización: Construir HTML de una sola vez
    var html = ['<div class="type-header">' + textos.header + '</div>'];
    
    if (Object.keys(interacciones.weak).length > 0) {
        html.push('<div class="type-section"><strong>' + textos.debil + '</strong><div class="type-list">');
        for (var type in interacciones.weak) {
            var multiplier = interacciones.weak[type] > 1 ? ' (x4)' : ' (x2)';
            html.push('<div class="type-tag weak ' + type + '">' + formatearNombresTipos(capitalizeFirstLetter(type)) + multiplier + '</div>');
        }
        html.push('</div></div>');
    }
    
    if (Object.keys(interacciones.resist).length > 0) {
        html.push('<div class="type-section"><strong>' + textos.resistente + '</strong><div class="type-list">');
        for (var type in interacciones.resist) {
            var multiplier = interacciones.resist[type] > 1 ? ' (x1/4)' : ' (x1/2)';
            html.push('<div class="type-tag resist ' + type + '">' + formatearNombresTipos(capitalizeFirstLetter(type)) + multiplier + '</div>');
        }
        html.push('</div></div>');
    }
    
    if (interacciones.immune.length > 0) {
        html.push('<div class="type-section"><strong>' + textos.inmune + '</strong><div class="type-list">');
        for (var i = 0; i < interacciones.immune.length; i++) {
            var immuneType = interacciones.immune[i];
            html.push('<div class="type-tag immune ' + immuneType + '">' + formatearNombresTipos(capitalizeFirstLetter(immuneType)) + '</div>');
        }
        html.push('</div></div>');
    }
    
    if (Object.keys(interacciones.strong).length > 0) {
        html.push('<div class="type-section"><strong>' + textos.fuerte + '</strong><div class="type-list">');
        for (var type in interacciones.strong) {
            html.push('<div class="type-tag strong ' + type + '">' + formatearNombresTipos(capitalizeFirstLetter(type)) + '</div>');
        }
        html.push('</div></div>');
    }
    
    detailsContainer.innerHTML = html.join('');
    detailsContainer.style.display = 'block';
}

function formatearNombresTipos(type) {
    // Primero normalizamos el tipo a minúsculas
    var typeLower = type.toLowerCase();
    
    // Casos especiales para tipos sin acento
    if(typeLower === "electrico") {
        return "Eléctrico";
    } 
    if(typeLower === "psiquico") {
        return "Psíquico";
    }
    if(typeLower === "dragon") {
        return "Dragón";
    }
    
    // Casos especiales para tipos que ya vienen con acento
    if(typeLower === "dragón") {
        return "Dragón";
    }
    if(typeLower === "eléctrico") {
        return "Eléctrico";
    }
    if(typeLower === "psíquico") {
        return "Psíquico";
    }
    
    // Para cualquier otro tipo, capitalizamos la primera letra
    return type.charAt(0).toUpperCase() + type.slice(1);
}

function buscar() {
    try {
        if (!pokeData || !pokeData.length) {
            alert("No hay datos cargados");
            return;
        }

        var inputElement = document.getElementById("pokeInput");
        if (!inputElement) {
            alert("Error: No se encuentra el campo de búsqueda");
            return;
        }

        var searchValue = inputElement.value;
        if (!searchValue) {
            alert("Por favor ingrese un nombre o número");
            return;
        }
        searchValue = searchValue.toLowerCase().replace(/^\s+|\s+$/g, '');

        // Usar caché si la búsqueda es la misma
        if (searchValue === ultimaBusqueda && resultadoCache) {
            mostrarResultado(resultadoCache);
            return;
        }
        
        // Optimización: Búsqueda más eficiente
        var pokemon = buscarPokemon(searchValue);

        if (!pokemon) {
            alert("Pokémon no encontrado");
            return;
        }
        
        // Guardar en caché
        ultimaBusqueda = searchValue;
        resultadoCache = pokemon;
        
        mostrarResultado(pokemon);
    } catch(e) {
        alert("Error en la búsqueda");
    }
}

// function navegarPokemon(direccion)  (corrige 'pokedata' → 'pokeData')
function navegarPokemon(direccion) {
    try {
        // Obtener el Pokémon actual
        var pokemonActual = null;
        var nombreElement = document.getElementById("pokeName");
        
        if (nombreElement && nombreElement.innerHTML) {
            // Extraer el número del Pokémon actual
            var idActual = parseInt(nombreElement.innerHTML.split(".")[0]);

            if (!isNaN(idActual)) {
                // Calcular el nuevo ID
                var nuevoId = idActual + direccion;

                // Asegurarse de que el ID esté dentro del rango válido
                if (nuevoId > 0 && nuevoId <= pokeData.length) {
                    // Mostrar indicador de carga rápido
                    var pokeImgElement = document.getElementById("pokeImg");
                    if (pokeImgElement) {
                        pokeImgElement.src = "sprites/MissingNo.png"; // Usar como indicador de carga
                    }
                    
                    // Usar setTimeout para dar tiempo al navegador para actualizar la UI
                    setTimeout(function() {
                        // Buscar el Pokémon con el nuevo ID
                        document.getElementById("pokeInput").value = nuevoId;
                        buscar();

                        // Precargar el siguiente Pokémon en la dirección de navegación
                        var nextId = nuevoId + direccion;
                        if (nextId > 0 && nextId <= pokeData.length) {
                            var nextGen = determinarGeneracion(nextId);
                            var nextImgPath = 'sprites/' + nextGen + '/' + nextId + '.png';
                            precargarImagen(nextImgPath, function(){});
                        }
                    }, 50);
                }
            }
        } else {
            // Si no hay Pokémon mostrado, mostrar el primero o el último
            if (direccion > 0) {
                document.getElementById("pokeInput").value = "1";
            } else {
                document.getElementById("pokeInput").value = pokeData.length.toString();
            }
            buscar();
        }
    } catch(e) {
        alert("Error al navegar: " + e.message);
    }
}

// Función para manejar las teclas (separada para mejor organización)
function manejarTeclas(event) {
    var sugerencias = document.getElementById("sugerencias");
    var items = sugerencias ? sugerencias.getElementsByClassName("sugerencia-item") : [];
    var selectedIndex = -1;
    
    // Buscar elemento seleccionado actualmente
    for (var i = 0; i < items.length; i++) {
        if (items[i].classList.contains("selected")) {
            selectedIndex = i;
            break;
        }
    }
    
    // Obtener elementos navegables
    var navegables = [
        document.querySelector('.button-small'), // Botón volver
        document.getElementById('prevPokemon'), // Botón anterior
        document.getElementById('pokeInput'),   // Campo de búsqueda
        document.querySelector('input[type="submit"]'), // Botón buscar
        document.getElementById('nextPokemon')  // Botón siguiente
    ];
    
    var elementoActivo = document.activeElement;
    var indiceActivo = -1;
    
    // Encontrar el índice del elemento activo
    for (var i = 0; i < navegables.length; i++) {
        if (navegables[i] === elementoActivo) {
            indiceActivo = i;
            break;
        }
    }
    
    // Tecla izquierda
    if (event.keyCode === 37) {
        if (sugerencias && sugerencias.style.display !== "none" && selectedIndex >= 0) {
            // Si hay sugerencias visibles, ignorar navegación lateral
            return;
        }
        
        if (indiceActivo > 0) {
            navegables[indiceActivo - 1].focus();
            event.preventDefault();
        }
    }
    // Tecla derecha
    else if (event.keyCode === 39) {
        if (sugerencias && sugerencias.style.display !== "none" && selectedIndex >= 0) {
            // Si hay sugerencias visibles, ignorar navegación lateral
            return;
        }
        
        if (indiceActivo < navegables.length - 1) {
            navegables[indiceActivo + 1].focus();
            event.preventDefault();
        }
    }
    // Tecla abajo (para navegar por sugerencias)
    else if (event.keyCode === 40) {
        if (sugerencias && sugerencias.style.display !== "none") {
            event.preventDefault();
            if (selectedIndex < items.length - 1) {
                if (selectedIndex >= 0) {
                    items[selectedIndex].classList.remove("selected");
                }
                items[selectedIndex + 1].classList.add("selected");
            } else if (selectedIndex === -1 && items.length > 0) {
                // Si no hay ningún elemento seleccionado, seleccionar el primero
                items[0].classList.add("selected");
            }
        }
    }
    // Tecla arriba (para navegar por sugerencias)
    else if (event.keyCode === 38) {
        if (sugerencias && sugerencias.style.display !== "none") {
            event.preventDefault();
            if (selectedIndex > 0) {
                items[selectedIndex].classList.remove("selected");
                items[selectedIndex - 1].classList.add("selected");
            }
        }
    }
    // Tecla Enter
    else if (event.keyCode === 13) {
        if (sugerencias && sugerencias.style.display !== "none" && selectedIndex >= 0) {
            // Seleccionar sugerencia
            var input = document.getElementById("pokeInput");
            input.value = items[selectedIndex].getAttribute('data-nombre') || items[selectedIndex].textContent;
            sugerencias.style.display = "none";
            buscar();
            event.preventDefault();
        } else if (document.activeElement.tagName === 'BUTTON' || 
                  (document.activeElement.tagName === 'INPUT' && document.activeElement.type === 'submit')) {
            document.activeElement.click();
            event.preventDefault();
        } else if (document.activeElement.tagName === 'INPUT' && document.activeElement.type === 'text') {
            // Si el foco está en el campo de texto, realizar búsqueda
            buscar();
            event.preventDefault();
        }
    }
}

function autocompletar() {
    var input = document.getElementById("pokeInput");
    var sugerenciasContainer = document.getElementById("sugerencias");
    if (!input || !sugerenciasContainer || !pokeData || !pokeData.length) return;

    var searchValue = (input.value || "").toLowerCase().trim();
    if (!searchValue) {
        sugerenciasContainer.style.display = "none";
        return;
    }

    var coincidencias = [];
    for (var i = 0; i < pokeData.length && coincidencias.length < 3; i++) {
        if (pokeData[i] && pokeData[i].nombre &&
            pokeData[i].nombre.toLowerCase().indexOf(searchValue) === 0) {
            coincidencias.push(pokeData[i]);
        }
    }

    if (coincidencias.length > 0) {
        var html = '';
        for (var i = 0; i < coincidencias.length; i++) {
            html += '<div class="sugerencia-item" data-nombre="' + coincidencias[i].nombre + '">' +
                    coincidencias[i].nombre + '</div>';
        }
        sugerenciasContainer.innerHTML = html;
        sugerenciasContainer.style.display = "block";

        var items = sugerenciasContainer.getElementsByClassName("sugerencia-item");
        for (var i = 0; i < items.length; i++) {
            items[i].onclick = function() {
                input.value = this.getAttribute('data-nombre');
                sugerenciasContainer.style.display = "none";
                buscar();
            };
        }
    } else {
        sugerenciasContainer.style.display = "none";
    }
}

// Código para cargar datos al inicio
window.onload = function() {
    // Mostrar indicador de carga
    var loadingIndicator = document.createElement('div');
    loadingIndicator.id = 'loadingIndicator';
    loadingIndicator.textContent = '...';
    loadingIndicator.style.textAlign = 'center';
    loadingIndicator.style.margin = '20px 0';
    document.body.appendChild(loadingIndicator);
    
    // Cargar datos en segundo plano
    cargarDatos();
    
    // Agregar evento para autocompletar
    var input = document.getElementById("pokeInput");
    if (input) {
        // Deshabilitar input hasta que los datos estén cargados
        input.disabled = true;
        input.addEventListener("input", autocompletar);
        
        // Ocultar sugerencias al perder el foco
        input.addEventListener("blur", function() {
            setTimeout(function() {
                var sugerencias = document.getElementById("sugerencias");
                if (sugerencias) {
                    sugerencias.style.display = "none";
                }
            }, 200);
        });
    }
    
    // Agregar manejo de eventos de teclado
    document.addEventListener('keydown', manejarTeclas);
    
    // Precargar imágenes de Pokémon populares
    setTimeout(function() {
        precargarPokemonesPopulares();
    }, 2000);
};

// Función para precargar Pokémon populares
function precargarPokemonesPopulares() {
    // IDs de Pokémon populares (Pikachu, Charizard, Mewtwo, etc.)
    var pokemonPopulares = [25, 6, 150, 1, 9];
    
    // Precargar en secuencia para no sobrecargar
    function precargarSiguiente(indice) {
        if (indice >= pokemonPopulares.length) return;
        
        var id = pokemonPopulares[indice];
        var gen = determinarGeneracion(id);
        var imgPath = 'sprites/' + gen + '/' + id + '.png';
        
        precargarImagen(imgPath, function() {
            // Continuar con el siguiente después de un breve retraso
            setTimeout(function() {
                precargarSiguiente(indice + 1);
            }, 100);
        });
    }
    
    // Comenzar precarga
    precargarSiguiente(0);
}