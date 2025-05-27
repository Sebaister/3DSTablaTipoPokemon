// Cache para datos de tipos
var typeDataCache = null;

// Función para mostrar el tipo seleccionado
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
        // Usar scrollIntoView con opciones para suavizar el desplazamiento
        element.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
}

// Función para capitalizar
function capitalizeFirstLetter(string) {
    if (typeof string !== 'string') return string;
    return formatearNombresTipos(string.charAt(0).toUpperCase() + string.slice(1));
}

// Función para formatear nombres de tipos
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

// Función para crear botones de tipos
function createTypeButtons(genId, types) {
    var container = document.getElementById(genId + '-types');
    if (!container) return;
    
    // Usar DocumentFragment para mejor rendimiento
    var fragment = document.createDocumentFragment();
    
    for (var i = 0; i < types.length; i++) {
        var type = types[i];
        var button = document.createElement('button');
        button.className = 'type-btn ' + type;
        button.textContent = formatearNombresTipos(capitalizeFirstLetter(type));
        button.setAttribute('data-type', type); // Usar atributos de datos
        
        // Usar closure para evitar problemas con el valor de 'type'
        button.addEventListener('click', function(typeValue) {
            return function() {
                showType(genId + '-' + typeValue);
            };
        }(type));
        
        fragment.appendChild(button);
    }
    
    container.appendChild(fragment);
}

// Función para crear detalles de tipos
function createTypeDetails(genId, typeData) {
    var container = document.getElementById(genId + '-details');
    if (!container) return;
    
    // Usar DocumentFragment para mejor rendimiento
    var fragment = document.createDocumentFragment();
    
    for (var type in typeData) {
        if (typeData.hasOwnProperty(type)) {
            var data = typeData[type];
            var detailDiv = document.createElement('div');
            detailDiv.id = genId + '-' + type;
            detailDiv.className = 'type-detail';
            detailDiv.style.display = 'none';
            
            // Construir HTML usando arrays y join (más eficiente)
            var htmlParts = [];
            
            htmlParts.push('<div class="type-header ' + type + '">' + 
                formatearNombresTipos(capitalizeFirstLetter(type)) + '</div>');
            
            if (data.weak && data.weak.length) {
                htmlParts.push('<div class="type-section"><strong>Débil contra:</strong><div class="type-list">');
                for (var j = 0; j < data.weak.length; j++) {
                    htmlParts.push('<div class="type-tag weak ' + data.weak[j] + '">' + 
                        formatearNombresTipos(capitalizeFirstLetter(data.weak[j])) + '</div>');
                }
                htmlParts.push('</div></div>');
            }
            
            if (data.resist && data.resist.length) {
                htmlParts.push('<div class="type-section"><strong>Resistente a:</strong><div class="type-list">');
                for (var j = 0; j < data.resist.length; j++) {
                    htmlParts.push('<div class="type-tag resist ' + data.resist[j] + '">' + 
                        formatearNombresTipos(capitalizeFirstLetter(data.resist[j])) + '</div>');
                }
                htmlParts.push('</div></div>');
            }
            
            if (data.strong && data.strong.length) {
                htmlParts.push('<div class="type-section"><strong>Fuerte contra:</strong><div class="type-list">');
                for (var j = 0; j < data.strong.length; j++) {
                    htmlParts.push('<div class="type-tag strong ' + data.strong[j] + '">' + 
                        formatearNombresTipos(capitalizeFirstLetter(data.strong[j])) + '</div>');
                }
                htmlParts.push('</div></div>');
            }
            
            if (data.immune && data.immune.length) {
                htmlParts.push('<div class="type-section"><strong>Inmune a:</strong><div class="type-list">');
                for (var j = 0; j < data.immune.length; j++) {
                    htmlParts.push('<div class="type-tag immune ' + data.immune[j] + '">' + 
                        formatearNombresTipos(capitalizeFirstLetter(data.immune[j])) + '</div>');
                }
                htmlParts.push('</div></div>');
            }
            
            if (data.note) {
                htmlParts.push('<div class="note">' + data.note + '</div>');
            }
            
            detailDiv.innerHTML = htmlParts.join('');
            fragment.appendChild(detailDiv);
        }
    }
    
    container.appendChild(fragment);
}

// Función para cargar datos con caché
function loadData() {
    // Verificar si ya tenemos los datos en caché
    if (typeDataCache) {
        procesarDatos(typeDataCache);
        return;
    }
    
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'types.json', true);
    xhr.responseType = 'json'; // Usar responseType para parsing automático
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                // Usar response en lugar de responseText para obtener el objeto ya parseado
                var data = xhr.response || JSON.parse(xhr.responseText);
                typeDataCache = data; // Guardar en caché
                procesarDatos(data);
            } catch(e) {
                console.error('Error al procesar los datos:', e);
                mostrarError('Error al cargar los datos');
            }
        } else {
            mostrarError('Error al cargar los datos');
        }
    };
    
    xhr.onerror = function() {
        mostrarError('Error de conexión');
    };
    
    xhr.send();
}

// Función para procesar datos
function procesarDatos(data) {
    // Procesar generación 1
    var gen1Types = Object.keys(data.gen1 || {});
    createTypeButtons('gen1', gen1Types);
    createTypeDetails('gen1', data.gen1);
    
    // Procesar generación 2-5
    var gen2Types = Object.keys(data.gen2 || {});
    createTypeButtons('gen2', gen2Types);
    createTypeDetails('gen2', data.gen2);
    
    // Procesar generación 6+
    var gen6Types = Object.keys(data.gen6 || {});
    createTypeButtons('gen6', gen6Types);
    createTypeDetails('gen6', data.gen6);
}

// Función para mostrar errores de manera amigable
function mostrarError(mensaje) {
    var containers = ['gen1-types', 'gen2-types', 'gen6-types'];
    for (var i = 0; i < containers.length; i++) {
        var container = document.getElementById(containers[i]);
        if (container) {
            container.innerHTML = '<div class="error">' + mensaje + '</div>';
        }
    }
}

// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadData);
} else {
    loadData();
}
