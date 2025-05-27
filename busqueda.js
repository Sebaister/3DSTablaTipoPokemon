// ... existing code ...

// Función para buscar Pokémon
function buscar() {
    var input = document.getElementById("pokeInput");
    var valor = input.value.trim();
    
    if (valor === "") {
        alert("Por favor ingresa un nombre o número de Pokémon");
        return;
    }
    
    // Usar caché si la búsqueda es la misma
    if (valor === ultimaBusqueda && resultadoCache) {
        mostrarPokemon(resultadoCache);
        return;
    }
    
    var pokemon = buscarPokemon(valor);
    
    if (pokemon) {
        // Guardar en caché
        ultimaBusqueda = valor;
        resultadoCache = pokemon;
        pokemonActual = pokemon;
        mostrarPokemon(pokemon);
    } else {
        alert("No se encontró ningún Pokémon con ese nombre o número");
    }
    
    // Limpiar sugerencias
    var sugerencias = document.getElementById("sugerencias");
    if (sugerencias) {
        sugerencias.style.display = "none";
    }
}

// Función para mostrar el Pokémon encontrado
function mostrarPokemon(pokemon) {
    if (!pokemon) return;
    
    var resultado = document.getElementById("resultado");
    var pokeImg = document.getElementById("pokeImg");
    var pokeName = document.getElementById("pokeName");
    var pokeInfo = document.getElementById("pokeInfo");
    var typeDetails = document.getElementById("typeDetails");
    
    // Mostrar el contenedor de resultados
    resultado.style.display = "block";
    
    // Determinar la generación para la imagen
    var gen = 1;
    if (pokemon.id > 151 && pokemon.id <= 251) gen = 2;
    else if (pokemon.id > 251 && pokemon.id <= 386) gen = 3;
    else if (pokemon.id > 386 && pokemon.id <= 493) gen = 4;
    else if (pokemon.id > 493 && pokemon.id <= 649) gen = 5;
    else if (pokemon.id > 649 && pokemon.id <= 721) gen = 6;
    else if (pokemon.id > 721 && pokemon.id <= 809) gen = 7;
    else if (pokemon.id > 809) gen = 8;
    
    // Actualizar imagen
    pokeImg.src = "sprites/gen" + gen + "/" + pokemon.id + ".png";
    pokeImg.alt = pokemon.nombre;
    
    // Actualizar nombre y número
    pokeName.textContent = "#" + pokemon.id + " - " + pokemon.nombre;
    
    // Construir información del Pokémon
    var infoHTML = "<div class='info-section'>";
    
    // Mostrar tipos
    infoHTML += "<div class='type-list'>";
    for (var i = 0; i < pokemon.tipos.length; i++) {
        infoHTML += "<div class='type-tag " + pokemon.tipos[i] + "'>" + 
            formatearNombresTipos(capitalizeFirstLetter(pokemon.tipos[i])) + "</div>";
    }
    infoHTML += "</div>";
    
    // Mostrar estadísticas si están disponibles
    if (pokemon.stats) {
        infoHTML += "<div class='stats-container'>";
        infoHTML += "<div class='stat'><span>HP:</span> " + pokemon.stats.hp + "</div>";
        infoHTML += "<div class='stat'><span>Ataque:</span> " + pokemon.stats.atk + "</div>";
        infoHTML += "<div class='stat'><span>Defensa:</span> " + pokemon.stats.def + "</div>";
        infoHTML += "<div class='stat'><span>Atq. Esp:</span> " + pokemon.stats.spa + "</div>";
        infoHTML += "<div class='stat'><span>Def. Esp:</span> " + pokemon.stats.spd + "</div>";
        infoHTML += "<div class='stat'><span>Velocidad:</span> " + pokemon.stats.spe + "</div>";
        infoHTML += "</div>";
    }
    
    infoHTML += "</div>";
    pokeInfo.innerHTML = infoHTML;
    
    // Mostrar detalles de tipos
    mostrarDetallesTipos(pokemon, typeDetails);
    
    // Ocultar logo
    var logoContainer = document.getElementById("logoContainer");
    if (logoContainer) {
        logoContainer.style.display = "none";
    }
}

// Función para mostrar detalles de tipos
function mostrarDetallesTipos(pokemon, container) {
    if (!pokemon || !container) return;
    
    // Determinar qué generación de tipos usar
    var genData;
    if (pokemon.id <= 151) {
        genData = typeData.gen1;
    } else if (pokemon.id <= 649) {
        genData = typeData.gen2;
    } else {
        genData = typeData.gen6;
    }
    
    var htmlParts = [];
    var debilidades = {};
    var resistencias = {};
    var inmunidades = {};
    
    // Procesar cada tipo del Pokémon
    for (var i = 0; i < pokemon.tipos.length; i++) {
        var tipo = pokemon.tipos[i];
        var tipoData = genData[tipo];
        
        if (!tipoData) continue;
        
        // Procesar debilidades
        if (tipoData.weak) {
            for (var j = 0; j < tipoData.weak.length; j++) {
                var weakType = tipoData.weak[j];
                debilidades[weakType] = (debilidades[weakType] || 1) * 2;
            }
        }
        
        // Procesar resistencias
        if (tipoData.resist) {
            for (var j = 0; j < tipoData.resist.length; j++) {
                var resistType = tipoData.resist[j];
                resistencias[resistType] = (resistencias[resistType] || 1) * 0.5;
            }
        }
        
        // Procesar inmunidades
        if (tipoData.immune) {
            for (var j = 0; j < tipoData.immune.length; j++) {
                inmunidades[tipoData.immune[j]] = 0;
            }
        }
    }
    
    // Ajustar debilidades y resistencias
    for (var tipo in debilidades) {
        if (inmunidades[tipo]) {
            delete debilidades[tipo];
        } else if (resistencias[tipo]) {
            var factor = debilidades[tipo] * resistencias[tipo];
            if (factor === 1) {
                delete debilidades[tipo];
                delete resistencias[tipo];
            } else if (factor < 1) {
                delete debilidades[tipo];
                resistencias[tipo] = factor;
            } else {
                debilidades[tipo] = factor;
                delete resistencias[tipo];
            }
        }
    }
    
    // Construir HTML para debilidades
    if (Object.keys(debilidades).length > 0) {
        htmlParts.push('<div class="type-section"><strong>Débil contra:</strong><div class="type-list">');        
        for (var tipo in debilidades) {
            var factor = debilidades[tipo];
            var className = factor >= 4 ? "very-weak" : "weak";
            htmlParts.push('<div class="type-tag ' + className + ' ' + tipo + '">' + 
                formatearNombresTipos(capitalizeFirstLetter(tipo)) + 
                (factor >= 4 ? ' (x4)' : '') + '</div>');
        }
        htmlParts.push('</div></div>');
    }
    
    // Construir HTML para resistencias
    if (Object.keys(resistencias).length > 0) {
        htmlParts.push('<div class="type-section"><strong>Resistente a:</strong><div class="type-list">');        
        for (var tipo in resistencias) {
            var factor = resistencias[tipo];
            var className = factor <= 0.25 ? "very-resist" : "resist";
            htmlParts.push('<div class="type-tag ' + className + ' ' + tipo + '">' + 
                formatearNombresTipos(capitalizeFirstLetter(tipo)) + 
                (factor <= 0.25 ? ' (x¼)' : '') + '</div>');
        }
        htmlParts.push('</div></div>');
    }
    
    // Construir HTML para inmunidades
    if (Object.keys(inmunidades).length > 0) {
        htmlParts.push('<div class="type-section"><strong>Inmune a:</strong><div class="type-list">');        
        for (var tipo in inmunidades) {
            htmlParts.push('<div class="type-tag immune ' + tipo + '">' + 
                formatearNombresTipos(capitalizeFirstLetter(tipo)) + '</div>');
        }
        htmlParts.push('</div></div>');
    }
    
    container.innerHTML = htmlParts.join('');
}

// Función para navegar entre Pokémon
function navegarPokemon(direccion) {
    if (!pokemonActual) return;
    
    var nuevoId = pokemonActual.id + direccion;
    
    // Asegurarse de que el ID esté en rango
    if (nuevoId < 1) nuevoId = pokedata.length;
    if (nuevoId > pokedata.length) nuevoId = 1;
    
    // Buscar por ID (búsqueda binaria)
    var inicio = 0;
    var fin = pokedata.length - 1;
    
    while (inicio <= fin) {
        var medio = Math.floor((inicio + fin) / 2);
        if (pokedata[medio].id === nuevoId) {
            pokemonActual = pokedata[medio];
            mostrarPokemon(pokemonActual);
            // Actualizar el input
            document.getElementById("pokeInput").value = pokemonActual.nombre;
            return;
        } else if (pokedata[medio].id < nuevoId) {
            inicio = medio + 1;
        } else {
            fin = medio - 1;
        }
    }
}

// Función para manejar teclas
function manejarTeclas(e) {
    // Si hay un diálogo de sugerencias abierto
    var sugerencias = document.getElementById("sugerencias");
    if (sugerencias && sugerencias.style.display !== "none") {
        var items = sugerencias.getElementsByTagName("div");
        var seleccionado = sugerencias.querySelector(".seleccionado");
        var index = -1;
        
        // Encontrar el índice del elemento seleccionado
        if (seleccionado) {
            for (var i = 0; i < items.length; i++) {
                if (items[i] === seleccionado) {
                    index = i;
                    break;
                }
            }
        }
        
        // Navegar con teclas de flecha
        if (e.key === "ArrowDown") {
            e.preventDefault();
            if (index < items.length - 1) {
                if (seleccionado) seleccionado.classList.remove("seleccionado");
                items[index + 1].classList.add("seleccionado");
            }
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (index > 0) {
                if (seleccionado) seleccionado.classList.remove("seleccionado");
                items[index - 1].classList.add("seleccionado");
            }
        } else if (e.key === "Enter" && seleccionado) {
            e.preventDefault();
            document.getElementById("pokeInput").value = seleccionado.textContent;
            sugerencias.style.display = "none";
            buscar();
        } else if (e.key === "Escape") {
            sugerencias.style.display = "none";
        }
        return;
    }
    
    // Navegación entre Pokémon con teclas de flecha
    if (e.key === "ArrowLeft") {
        navegarPokemon(-1);
    } else if (e.key === "ArrowRight") {
        navegarPokemon(1);
    }
}

// Función para autocompletar
function autocompletar() {
    var input = document.getElementById("pokeInput");
    var valor = input.value.trim().toLowerCase();
    
    if (valor.length < 2) {
        var sugerencias = document.getElementById("sugerencias");
        if (sugerencias) {
            sugerencias.style.display = "none";
        }
        return;
    }
    
    // Buscar coincidencias
    var coincidencias = [];
    for (var i = 0; i < pokedata.length && coincidencias.length < 5; i++) {
        if (pokedata[i].nombre.toLowerCase().indexOf(valor) === 0) {
            coincidencias.push(pokedata[i].nombre);
        }
    }
    
    // Si no hay coincidencias desde el inicio, buscar en cualquier parte
    if (coincidencias.length === 0) {
        for (var i = 0; i < pokedata.length && coincidencias.length < 5; i++) {
            if (pokedata[i].nombre.toLowerCase().indexOf(valor) > 0) {
                coincidencias.push(pokedata[i].nombre);
            }
        }
    }
    
    // Mostrar sugerencias
    var sugerencias = document.getElementById("sugerencias");
    if (!sugerencias) {
        sugerencias = document.createElement("div");
        sugerencias.id = "sugerencias";
        sugerencias.className = "sugerencias";
        input.parentNode.appendChild(sugerencias);
    }
    
    if (coincidencias.length > 0) {
        var html = "";
        for (var i = 0; i < coincidencias.length; i++) {
            html += "<div>" + coincidencias[i] + "</div>";
        }
        sugerencias.innerHTML = html;
        sugerencias.style.display = "block";
        
        // Agregar eventos a las sugerencias
        var items = sugerencias.getElementsByTagName("div");
        for (var i = 0; i < items.length; i++) {
            items[i].addEventListener("click", function() {
                input.value = this.textContent;
                sugerencias.style.display = "none";
                buscar();
            });
            
            items[i].addEventListener("mouseover", function() {
                var seleccionado = sugerencias.querySelector(".seleccionado");
                if (seleccionado) seleccionado.classList.remove("seleccionado");
                this.classList.add("seleccionado");
            });
        }
    } else {
        sugerencias.style.display = "none";
    }
}

// Función para formatear nombres de tipos (si no está definida)
function formatearNombresTipos(tipo) {
    if (typeof tipo !== 'string') return tipo;
    
    // Usar un objeto para mapeo directo (más eficiente)
    var tiposConAcento = {
        'dragon': 'Dragón',
        'electrico': 'Eléctrico',
        'psiquico': 'Psíquico'
    };
    
    return tiposConAcento[tipo.toLowerCase()] || tipo;
}

// Función para capitalizar (si no está definida)
function capitalizeFirstLetter(string) {
    if (typeof string !== 'string') return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
}