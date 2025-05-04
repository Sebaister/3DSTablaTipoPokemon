// Función existente para mostrar tipos (la mantendremos)
function showType(typeId) {
    // Oculta todos los detalles primero
    var details = document.getElementsByClassName('type-detail');
    for (var i = 0; i < details.length; i++) {
        details[i].style.display = 'none';
    }
    
    // Muestra el seleccionado
    var selectedType = document.getElementById(typeId);
    if (selectedType) {
        selectedType.style.display = 'block';
        // Desplaza a la vista (sin animación smooth para mejor rendimiento)
        selectedType.scrollIntoView();
    }
}

// Nuevas funciones para cargar dinámicamente los datos
function createTypeButtons(genId, types) {
    const container = document.getElementById(`${genId}-types`);
    if (!container) return;
    
    container.innerHTML = '';
    
    types.forEach(type => {
        const button = document.createElement('button');
        button.className = `type-btn ${type}`;
        button.textContent = capitalizeFirstLetter(type);
        button.onclick = () => showType(`${genId}-${type}`);
        container.appendChild(button);
    });
}

function createTypeDetails(genId, typeData) {
    const container = document.getElementById(`${genId}-details`);
    if (!container) return;
    
    container.innerHTML = '';
    
    for (const [type, data] of Object.entries(typeData)) {
        const detailDiv = document.createElement('div');
        detailDiv.id = `${genId}-${type}`;
        detailDiv.className = 'type-detail';
        detailDiv.style.display = 'none';
        
        let html = `<div class="type-header ${type}">${capitalizeFirstLetter(type)}</div>`;
        
        if (data.weak) {
            html += `<div class="type-section"><strong>Débil contra:</strong><div class="type-list">`;
            html += data.weak.map(t => `<div class="type-tag weak ${t}">${capitalizeFirstLetter(t)}</div>`).join('');
            html += `</div></div>`;
        }
        
        if (data.resist) {
            html += `<div class="type-section"><strong>Resistente a:</strong><div class="type-list">`;
            html += data.resist.map(t => `<div class="type-tag resist ${t}">${capitalizeFirstLetter(t)}</div>`).join('');
            html += `</div></div>`;
        }
        
        if (data.strong) {
            html += `<div class="type-section"><strong>Fuerte contra:</strong><div class="type-list">`;
            html += data.strong.map(t => `<div class="type-tag strong ${t}">${capitalizeFirstLetter(t)}</div>`).join('');
            html += `</div></div>`;
        }
        
        if (data.immune) {
            html += `<div class="type-section"><strong>Inmune a:</strong><div class="type-list">`;
            html += data.immune.map(t => `<div class="type-tag immune ${t}">${capitalizeFirstLetter(t)}</div>`).join('');
            html += `</div></div>`;
        }
        
        if (data.note) {
            html += `<div class="note">${data.note}</div>`;
        }
        
        detailDiv.innerHTML = html;
        container.appendChild(detailDiv);
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Cargar los datos y generar la interfaz
document.addEventListener('DOMContentLoaded', () => {
    // Primero verifica si ya hay contenido (para compatibilidad con el HTML existente)
    const hasExistingContent = document.querySelector('.type-detail') !== null;
    
    if (!hasExistingContent) {
        // Solo cargar dinámicamente si no hay contenido existente
        fetch('types.json')
            .then(response => response.json())
            .then(data => {
                // Generación 1
                const gen1Types = Object.keys(data.gen1);
                createTypeButtons('gen1', gen1Types);
                createTypeDetails('gen1', data.gen1);
                
                // Generación 2-5
                const gen2Types = Object.keys(data.gen2);
                createTypeButtons('gen2', gen2Types);
                createTypeDetails('gen2', data.gen2);
                
                // Generación 6+
                const gen6Types = Object.keys(data.gen6);
                createTypeButtons('gen6', gen6Types);
                createTypeDetails('gen6', data.gen6);
            })
            .catch(error => console.error('Error loading types data:', error));
    }
});
