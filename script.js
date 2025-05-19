// Función para mostrar el tipo seleccionado (original)
function showType(typeId) {
    // Oculta todos los detalles primero
    var details = document.getElementsByClassName('type-detail');
    for (var i = 0; i < details.length; i++) {
        details[i].style.display = 'none';
    }
    
    // Muestra el seleccionado
    var element = document.getElementById(typeId);
    if (element) {
        element.style.display = 'block';
        element.scrollIntoView();
    }
}

// Funciones de utilidad
function $(id) {
    return document.getElementById(id);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatearNombresTipos(nombre) {
    // Mantener la función original para compatibilidad
    return nombre;
}

function mostrarError(mensaje) {
    alert(mensaje);
}

// Funciones para crear elementos de UI
function createTypeButtons(genId, types) {
    var container = $(genId + '-types');
    if (!container) return;
    
    container.innerHTML = '';
    
    for (var i = 0; i < types.length; i++) {
        var type = types[i];
        var button = document.createElement('button');
        button.className = 'type-btn ' + type;
        button.textContent = formatearNombresTipos(capitalizeFirstLetter(type));
        button.setAttribute('data-type', type);
        button.setAttribute('data-gen', genId);
        button.setAttribute('role', 'button');
        button.setAttribute('tabindex', '0');
        container.appendChild(button);
    }
    
    // Usar delegación de eventos para mejor rendimiento
    container.addEventListener('click', function(e) {
        var target = e.target;
        if (target.classList.contains('type-btn')) {
            var type = target.getAttribute('data-type');
            var gen = target.getAttribute('data-gen');
            showType(gen + '-' + type);
        }
    });
}

// Función para crear detalles (adaptada)
function createTypeDetails(genId, typeData) {
    var container = document.getElementById(genId + '-details');
    if (!container) return;
    
    container.innerHTML = '';
    
    for (var type in typeData) {
        if (typeData.hasOwnProperty(type)) {
            var data = typeData[type];
            var detailDiv = document.createElement('div');
            detailDiv.id = genId + '-' + type;
            detailDiv.className = 'type-detail';
            detailDiv.style.display = 'none';
            
            var html = '<div class="type-header ' + type + '">' + formatearNombresTipos(capitalizeFirstLetter(type)) + '</div>';
            
            if (data.weak) {
                html += '<div class="type-section"><strong>Débil contra:</strong><div class="type-list">';
                for (var j = 0; j < data.weak.length; j++) {
                    html += '<div class="type-tag weak ' + data.weak[j] + '">' + formatearNombresTipos(capitalizeFirstLetter(data.weak[j])) + '</div>';
                }
                html += '</div></div>';
            }
            
            if (data.resist) {
                html += '<div class="type-section"><strong>Resistente a:</strong><div class="type-list">';
                for (var j = 0; j < data.resist.length; j++) {
                    html += '<div class="type-tag resist ' + data.resist[j] + '">' + formatearNombresTipos(capitalizeFirstLetter(data.resist[j])) + '</div>';
                }
                html += '</div></div>';
            }
            
            if (data.strong) {
                html += '<div class="type-section"><strong>Fuerte contra:</strong><div class="type-list">';
                for (var j = 0; j < data.strong.length; j++) {
                    html += '<div class="type-tag strong ' + data.strong[j] + '">' + formatearNombresTipos(capitalizeFirstLetter(data.strong[j])) + '</div>';
                }
                html += '</div></div>';
            }
            
            if (data.immune) {
                html += '<div class="type-section"><strong>Inmune a:</strong><div class="type-list">';
                for (var j = 0; j < data.immune.length; j++) {
                    html += '<div class="type-tag immune ' + data.immune[j] + '">' + formatearNombresTipos(capitalizeFirstLetter(data.immune[j])) + '</div>';
                }
                html += '</div></div>';
            }
            
            if (data.note) {
                html += '<div class="note">' + data.note + '</div>';
            }
            
            detailDiv.innerHTML = html;
            container.appendChild(detailDiv);
        }
    }
}

// Mejorar la carga de datos
function loadData() {
    fetch('types.json')
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Error al cargar los datos');
            }
            return response.json();
        })
        .then(function(data) {
            // Procesamiento por lotes para mejorar rendimiento
            setTimeout(function() {
                // Generación 1
                var gen1Types = Object.keys(data.gen1 || {});
                createTypeButtons('gen1', gen1Types);
                createTypeDetails('gen1', data.gen1);
                
                setTimeout(function() {
                    // Generación 2-5
                    var gen2Types = Object.keys(data.gen2 || {});
                    createTypeButtons('gen2', gen2Types);
                    createTypeDetails('gen2', data.gen2);
                    
                    setTimeout(function() {
                        // Generación 6+
                        var gen6Types = Object.keys(data.gen6 || {});
                        createTypeButtons('gen6', gen6Types);
                        createTypeDetails('gen6', data.gen6);
                    }, 0);
                }, 0);
            }, 0);
        })
        .catch(function(error) {
            console.error('Error:', error);
            mostrarError('Error al cargar los datos');
        });
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    
    // Función para manejar la visibilidad del logo
    function actualizarLogoVisibilidad() {
        var hash = window.location.hash;
        var defaultLogo = $('defaultLogo');
        if (defaultLogo) {
            defaultLogo.style.display = (hash && hash !== '#') ? 'none' : 'block';
        }
    }
    
    // Eventos optimizados
    window.addEventListener('hashchange', actualizarLogoVisibilidad);
    actualizarLogoVisibilidad();
});
