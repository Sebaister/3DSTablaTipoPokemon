function showType(typeId) {
    // Oculta todos los detalles primero
    var details = document.getElementsByClassName('type-detail');
    for (var i = 0; i < details.length; i++) {
        details[i].style.display = 'none';
    }
    
    // Muestra el seleccionado si existe, si no, lo crea
    var selectedType = document.getElementById(typeId);
    if (!selectedType && window.typeData) {
        // Extraer generación y tipo del ID (ej: 'gen1-fuego' -> ['gen1', 'fuego'])
        var parts = typeId.split('-');
        if (parts.length === 2) {
            var gen = parts[0];
            var type = parts[1];
            if (window.typeData[gen] && window.typeData[gen][type]) {
                createTypeDetail(gen, type, window.typeData[gen][type]);
                selectedType = document.getElementById(typeId);
            }
        }
    }
    
    if (selectedType) {
        selectedType.style.display = 'block';
        // Desplaza a la vista (sin animación smooth para mejor rendimiento)
        selectedType.scrollIntoView();
    }
}

// Función para crear detalles de tipo (compatible con tu estructura)
function createTypeDetail(gen, typeKey, typeData) {
    var container = document.createElement('div');
    container.id = gen + '-' + typeKey;
    container.className = 'type-detail';
    container.style.display = 'none';
    
    var header = document.createElement('div');
    header.className = 'type-header ' + typeKey;
    header.textContent = typeData.name || typeKey.charAt(0).toUpperCase() + typeKey.slice(1);
    container.appendChild(header);
    
    // Función auxiliar para crear secciones
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
    addSection('Débil contra:', typeData.weak, 'weak');
    addSection('Resistente a:', typeData.resist, 'resist');
    addSection('Fuerte contra:', typeData.strong, 'strong');
    addSection('Inmune a:', typeData.immune, 'immune');
    
    // Añadir nota si existe
    if (typeData.note) {
        var note = document.createElement('div');
        note.className = 'note';
        note.textContent = typeData.note;
        container.appendChild(note);
    }
    
    // Añadir al DOM
    document.getElementById(gen).appendChild(container);
}

// Función auxiliar para nombres de tipos (igual que antes)
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

// Cargar datos al iniciar (versión simple)
document.addEventListener('DOMContentLoaded', function() {
    // Esto reemplazaría tu carga actual de JSON
    // En tu implementación real, mantén tu sistema de carga de JSON
    // y simplemente guarda los datos en window.typeData
    
    // Mostrar primera generación por defecto
    document.getElementById('gen1').style.display = 'block';
});
