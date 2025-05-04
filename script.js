// Variable global para almacenar los datos de tipos
let typeData = {};

// Cargar los datos del JSON al iniciar
document.addEventListener('DOMContentLoaded', function() {
    fetch('tabladetipo.json')
        .then(response => response.json())
        .then(data => {
            typeData = data;
            // Mostrar la primera generación por defecto
            document.getElementById('gen1').style.display = 'block';
        })
        .catch(error => {
            console.error('Error cargando los datos:', error);
            document.getElementById('gen1').style.display = 'block';
        });
});

// Función para mostrar el tipo seleccionado
function showType(typeId) {
    // Oculta todos los detalles primero
    var details = document.getElementsByClassName('type-detail');
    for (var i = 0; i < details.length; i++) {
        details[i].style.display = 'none';
    }
    
    // Verifica si el elemento ya existe
    var typeElement = document.getElementById(typeId);
    
    // Si no existe, créalo
    if (!typeElement && typeData) {
        var parts = typeId.split('-');
        if (parts.length === 2) {
            var gen = parts[0];
            var type = parts[1];
            
            if (typeData[gen] && typeData[gen][type]) {
                createTypeDetail(gen, type, typeData[gen][type]);
                typeElement = document.getElementById(typeId);
            }
        }
    }
    
    // Muestra el elemento si existe
    if (typeElement) {
        typeElement.style.display = 'block';
        typeElement.scrollIntoView();
    } else {
        console.error('No se pudo cargar el tipo:', typeId);
    }
}

// Función para crear el detalle de un tipo
function createTypeDetail(gen, typeKey, data) {
    var container = document.createElement('div');
    container.id = gen + '-' + typeKey;
    container.className = 'type-detail';
    container.style.display = 'none';
    
    // Crear encabezado
    var header = document.createElement('div');
    header.className = 'type-header ' + typeKey;
    header.textContent = data.name || typeKey.charAt(0).toUpperCase() + typeKey.slice(1);
    container.appendChild(header);
    
    // Función para añadir secciones (débil, resistente, etc.)
    function addSection(title, items, className) {
        if (items && items.length > 0) {
            var section = document.createElement('div');
            section.className = 'type-section';
            
            var strong = document.createElement('strong');
            strong.textContent = title;
            section.appendChild(strong);
            
            var list = document.createElement('div');
            list.className = 'type-list';
            
            items.forEach(function(item) {
                var tag = document.createElement('div');
                tag.className = 'type-tag ' + className + ' ' + item;
                tag.textContent = getTypeName(item);
                list.appendChild(tag);
            });
            
            section.appendChild(list);
            container.appendChild(section);
        }
    }
    
    // Añadir secciones
    addSection('Débil contra:', data.weak, 'weak');
    addSection('Resistente a:', data.resist, 'resist');
    addSection('Fuerte contra:', data.strong, 'strong');
    addSection('Inmune a:', data.immune, 'immune');
    
    // Añadir nota si existe
    if (data.note) {
        var note = document.createElement('div');
        note.className = 'note';
        note.textContent = data.note;
        container.appendChild(note);
    }
    
    // Añadir al contenedor de la generación correspondiente
    document.getElementById(gen).appendChild(container);
}

// Función para obtener el nombre legible del tipo
function getTypeName(typeKey) {
    var typeNames = {
        "normal": "Normal",
        "fuego": "Fuego",
        "agua": "Agua",
        "planta": "Planta",
        "electrico": "Eléctrico",
        "hielo": "Hielo",
        "lucha": "Lucha",
        "veneno": "Veneno",
        "tierra": "Tierra",
        "volador": "Volador",
        "psiquico": "Psíquico",
        "bicho": "Bicho",
        "roca": "Roca",
        "fantasma": "Fantasma",
        "dragon": "Dragón",
        "acero": "Acero",
        "siniestro": "Siniestro",
        "hada": "Hada"
    };
    return typeNames[typeKey] || typeKey;
}
