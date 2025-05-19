// Función para mostrar el tipo seleccionado (optimizada para 3DS)
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
        // Usar try-catch para manejar posibles errores en 3DS
        try {
            element.scrollIntoView();
        } catch(e) {
            // Fallback para 3DS si scrollIntoView no está disponible
            window.scrollTo(0, element.offsetTop);
        }
        
        // Ocultar el logo cuando se muestra un tipo
        var defaultLogo = document.getElementById('defaultLogo');
        if (defaultLogo) {
            defaultLogo.style.display = 'none';
        }
    }
}

// Funciones de utilidad optimizadas para 3DS
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

// Funciones para crear elementos de UI (optimizadas)
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
        // Usar función anónima con closure para preservar valores
        (function(currentType, currentGen) {
            button.onclick = function() {
                showType(currentGen + '-' + currentType);
            };
        })(type, genId);
        container.appendChild(button);
    }
}

// Función para crear detalles (optimizada para 3DS)
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

// Carga de datos optimizada para 3DS
function loadData() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'types.json', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    var data = JSON.parse(xhr.responseText);
                    
                    // Procesamiento simplificado para 3DS
                    var gen1Types = Object.keys(data.gen1 || {});
                    createTypeButtons('gen1', gen1Types);
                    createTypeDetails('gen1', data.gen1);
                    
                    // Generación 2-5
                    var gen2Types = Object.keys(data.gen2 || {});
                    createTypeButtons('gen2', gen2Types);
                    createTypeDetails('gen2', data.gen2);
                    
                    // Generación 6+
                    var gen6Types = Object.keys(data.gen6 || {});
                    createTypeButtons('gen6', gen6Types);
                    createTypeDetails('gen6', data.gen6);
                } catch(e) {
                    console.error('Error al procesar tipos:', e);
                    mostrarError('Error al procesar los datos de tipos');
                }
            } else {
                mostrarError('Error al cargar datos: ' + xhr.status);
            }
        }
    };
    xhr.send();
}

// Inicialización optimizada para 3DS
if (document.addEventListener) {
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
        if (window.addEventListener) {
            window.addEventListener('hashchange', actualizarLogoVisibilidad);
        } else if (window.attachEvent) {
            // Soporte para IE antiguo que podría estar en 3DS
            window.attachEvent('onhashchange', actualizarLogoVisibilidad);
        }
        
        actualizarLogoVisibilidad();
    });
} else if (document.attachEvent) {
    // Soporte para navegadores antiguos
    document.attachEvent('onDOMContentLoaded', loadData);
}
