// Variables globales
let currentGen = 'gen1'; // Generación por defecto
let currentType = '';    // Tipo seleccionado

// Inicialización cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Configura los eventos de los botones
    setupButtons();
    
    // Muestra la generación por defecto (Gen1)
    filterByGen('gen1');
});

// Configura todos los botones
function setupButtons() {
    // Botones de generación
    document.getElementById('gen1').addEventListener('click', function() { filterByGen('gen1'); });
    document.getElementById('gen2-').addEventListener('click', function() { filterByGen('gen2-'); });
    document.getElementById('gen6+').addEventListener('click', function() { filterByGen('gen6+'); });
    
    // Botones de tipos
    const typeButtons = document.querySelectorAll('.type-button');
    typeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const typeId = this.id.replace('btn-', '');
            filterByType(typeId);
        });
    });
}

// Función showType corregida
function showType(typeId) {
    // Oculta todos los detalles primero
    hideAllTypeDetails();
    
    // Muestra el seleccionado
    const element = document.getElementById(typeId);
    if (element) {
        element.style.display = 'block';
        element.scrollIntoView();
    }
}

// Filtra por generación
function filterByGen(genId) {
    currentGen = genId;
    
    // Si hay un tipo seleccionado, muestra solo ese tipo en esta generación
    if (currentType) {
        showType(currentGen + '-' + currentType);
    } else {
        // Oculta todo primero
        hideAllTypeDetails();
        
        // Muestra todos los tipos para esta generación
        const details = document.querySelectorAll('[id^="' + genId + '-"]');
        details.forEach(detail => {
            detail.style.display = 'block';
        });
    }
    
    // Actualiza el botón activo
    updateActiveGenButton(genId);
}

// Filtra por tipo
function filterByType(typeId) {
    currentType = typeId;
    showType(currentGen + '-' + typeId);
    updateActiveTypeButton(typeId);
}

// Oculta todas las secciones
function hideAllTypeDetails() {
    const details = document.getElementsByClassName('type-detail');
    for (let i = 0; i < details.length; i++) {
        details[i].style.display = 'none';
    }
}

// Actualiza el botón de generación activo
function updateActiveGenButton(genId) {
    document.getElementById('gen1').classList.remove('active');
    document.getElementById('gen2-').classList.remove('active');
    document.getElementById('gen6+').classList.remove('active');
    document.getElementById(genId).classList.add('active');
}

// Actualiza el botón de tipo activo
function updateActiveTypeButton(typeId) {
    const typeButtons = document.querySelectorAll('.type-button');
    typeButtons.forEach(button => {
        button.classList.remove('active');
    });
    document.getElementById('btn-' + typeId).classList.add('active');
}

// Función para manejar errores (compatible con 3DS)
window.onerror = function(message) {
    alert('Error: ' + message);
    return true;
};
