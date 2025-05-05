        var pokedata = [];
        var typeData = {};
        function delaySearch(pokemonName) {
            // Limpiar primero la pantalla
            document.getElementById("resultado").style.display = "none";
            document.getElementById("pokeInput").value = pokemonName;
            
            // Pequeño retraso para la 3DS
            setTimeout(function() {
                buscar();
            }, 150);
            
            return false; // Previene el comportamiento por defecto del enlace
        }
        // Manejo de parámetros URL (compatible con 3DS)
        if (location.search) {
            var params = location.search.substring(1).split('=');
            if (params[0] === 'pokemon') {
         document.getElementById('pokeInput').value = decodeURIComponent(params[1]);
            buscar();
            }
        }
        // Función global para cargar evoluciones (compatible con 3DS)
        function cargarEvolucion(pokemon) {
        document.getElementById('pokeInput').value = pokemon;
        buscar();
        return false; // Previene el comportamiento por defecto del enlace
        }
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
            else if (id >= 810 && id <= 898) return "8gen";
            else if (id >= 899 && id <= 1025) return "9gen";
            else return "unknown";
        }

        // Calcular interacciones de tipos combinados
        function calcularInteracciones(tipos) {
            if (!typeData.gen1 || tipos.length === 0) return null;
            
            var gen = 'gen1'; // Por defecto usamos gen1 para máxima compatibilidad
            
            // Determinar la generación correcta
            if (tipos.length > 1) {
                gen = 'gen2'; // Tipos duales fueron introducidos en gen2
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
                
                // Procesar debilidades
                if (data.weak) {
                    for (var j = 0; j < data.weak.length; j++) {
                        var weakType = data.weak[j];
                        resultado.weak[weakType] = (resultado.weak[weakType] || 0) + 1;
                    }
                }
                
                // Procesar resistencias
                if (data.resist) {
                    for (var j = 0; j < data.resist.length; j++) {
                        var resistType = data.resist[j];
                        resultado.resist[resistType] = (resultado.resist[resistType] || 0) + 1;
                    }
                }
                
                // Procesar fortalezas
                if (data.strong) {
                    for (var j = 0; j < data.strong.length; j++) {
                        var strongType = data.strong[j];
                        resultado.strong[strongType] = (resultado.strong[strongType] || 0) + 1;
                    }
                }
                
                // Procesar inmunidades
                if (data.immune) {
                    for (var j = 0; j < data.immune.length; j++) {
                        var immuneType = data.immune[j];
                        if (resultado.immune.indexOf(immuneType) === -1) {
                            resultado.immune.push(immuneType);
                        }
                    }
                }
            }
            
            // Ajustar multiplicadores para tipos duales
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
                    html += '<div class="type-tag weak ' + type + '">' + resolveElectricAndPsychicTypes(capitalizeFirstLetter(type))  + multiplier + '</div>';
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
                    html += '<div class="type-tag immune ' + interacciones.immune[i] + '">' + resolveElectricAndPsychicTypes(capitalizeFirstLetter(type)) + '</div>';
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

        // agrega la tilde ( ´ ) a los tipos que lo utilizan en español
        function resolveElectricAndPsychicTypes (type) {
        
            if(type === "Electrico") {
                return "Eléctrico"
            } 
            if(type === "Psiquico") {
                return "Psíquico"
            } else {
                return type
            }
        }

        // Función de búsqueda del Pokémon
        function buscar() {
            var input = document.getElementById("pokeInput").value.trim().toLowerCase();
            
            // Limpiar resultados previos inmediatamente
            document.getElementById("resultado").style.display = "none";
            
            // Pequeño retraso para permitir que la 3DS procese
            setTimeout(function() {
                var pokemon = null;
                
                // Búsqueda optimizada para 3DS
                for (var i = 0; i < pokedata.length; i++) {
                    if ((!isNaN(input) && pokedata[i].id === parseInt(input)) || 
                        (pokedata[i].nombre.toLowerCase() === input)) {
                        pokemon = pokedata[i];
                        break;
                    }
                }
        
                if (pokemon) {
                    var genFolder = determinarGeneracion(pokemon.id);
                    var img = document.getElementById("pokeImg");
                    img.src = "sprites/" + genFolder + "/" + pokemon.id + ".png";
                    
                    // Función de fallback para imágenes
                    img.onerror = function() {
                        this.src = "sprites/MissingNo.png";
                    };
                    
                    document.getElementById("pokeName").textContent = pokemon.nombre;
                    
                    var html = "<b>Tipos:</b> ";
                    for (var j = 0; j < pokemon.tipos.length; j++) {
                        var tipo = pokemon.tipos[j];
                        html += '<span class="type-btn ' + tipo.toLowerCase() + '">' + 
                               resolveElectricAndPsychicTypes(tipo) + '</span> ';
                    }
        
                    html += "<br><a href='index.html'>Revisar tabla de tipos</a><br><br><b>Estadísticas:</b><br>";
                    
                    var stats = pokemon.stats;
                    for (var stat in stats) {
                        if (stats.hasOwnProperty(stat)) {
                            html += traducirEstadisticas(stat) + ": " + stats[stat] + "<br>";
                        }
                    }
        
                    if (pokemon.evolucion.length > 0) {
                        var evo = pokemon.evolucion[0];
                        html += "<br><b>Evoluciona a:</b> <a href='#' onclick='delaySearch(\"" + 
                               evo.b.toLowerCase() + "\")'>" + evo.b + "</a><br>" +
                               "<b>Condiciones:</b><br>";
                        
                        for (var k = 0; k < evo.condiciones.length; k++) {
                            html += "- " + evo.condiciones[k] + "<br>";
                        }
                    } else {
                        html += "<br><b>Sin evoluciones.</b>";
                    }
        
                    document.getElementById("pokeInfo").innerHTML = html;
                    document.getElementById("resultado").style.display = "block";
                } else {
                    alert("Pokémon no encontrado.");
                }
            }, 100); // Retraso de 100ms para la 3DS
        }

        // Iniciar carga de datos cuando la página esté lista
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            cargarDatos();
        } else {
            document.addEventListener('DOMContentLoaded', cargarDatos);
        }
