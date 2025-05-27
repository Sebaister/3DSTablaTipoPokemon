// Variables globales con caché
var pokedata = [];
var typeData = {};
var ultimaBusqueda = "";
var resultadoCache = null;
var pokemonActual = null;

// Función optimizada para cargar datos
function cargarDatos() {
    // Usar Promise para mejor manejo asíncrono
    function cargarJSON(url) {
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.responseType = 'json';
            
            xhr.onload = function() {
                if (xhr.status === 200) {
                    resolve(xhr.response || JSON.parse(xhr.responseText));
                } else {
                    reject(new Error("Error al cargar " + url));
                }
            };
            
            xhr.onerror = function() {
                reject(new Error("Error de conexión"));
            };
            
            xhr.send();
        });
    }

    // Si ya tenemos los datos, no cargar de nuevo
    if (pokedata.length > 0 && Object.keys(typeData).length > 0) {
        return;
    }

    // Cargar pokedata primero
    if (pokedata.length === 0) {
        cargarJSON("pokedata.json")
            .then(function(data) {
                pokedata = data;
                // Ordenar por ID para búsqueda binaria
                pokedata.sort(function(a, b) {
                    return a.id - b.id;
                });
                // Cargar tipos después
                return cargarJSON("types.json");
            })
            .then(function(data) {
                typeData = data;
            })
            .catch(function(error) {
                alert(error.message);
            });
    }
}

// Función optimizada para buscar Pokémon
function buscarPokemon(searchValue) {
    // Búsqueda por ID (búsqueda binaria)
    if (!isNaN(searchValue)) {
        var id = parseInt(searchValue, 10);
        var inicio = 0;
        var fin = pokedata.length - 1;
        
        while (inicio <= fin) {
            var medio = Math.floor((inicio + fin) / 2);
            if (pokedata[medio].id === id) {
                return pokedata[medio];
            } else if (pokedata[medio].id < id) {
                inicio = medio + 1;
            } else {
                fin = medio - 1;
            }
        }
    }
    
    // Búsqueda por nombre (optimizada)
    var resultados = [];
    searchValue = searchValue.toLowerCase();
    
    // Primero buscar coincidencias exactas
    for (var i = 0; i < pokedata.length; i++) {
        if (pokedata[i].nombre.toLowerCase() === searchValue) {
            return pokedata[i];
        }
    }
    
    // Luego buscar coincidencias parciales desde el inicio
    for (var i = 0; i < pokedata.length; i++) {
        if (pokedata[i].nombre.toLowerCase().indexOf(searchValue) === 0) {
            return pokedata[i];
        }
    }
    
    return null;
}

// Inicialización mejorada
window.onload = function() {
    cargarDatos();
    
    // Configurar eventos con delegación
    var searchForm = document.getElementById("searchForm");
    if (searchForm) {
        searchForm.addEventListener("submit", function(e) {
            e.preventDefault();
            buscar();
        });
    }
    
    // Configurar eventos de navegación
    document.getElementById("prevPokemon").addEventListener("click", function() {
        navegarPokemon(-1);
    });
    
    document.getElementById("nextPokemon").addEventListener("click", function() {
        navegarPokemon(1);
    });
    
    // Configurar autocompletado
    var input = document.getElementById("pokeInput");
    if (input) {
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
};