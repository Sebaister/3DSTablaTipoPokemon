function showType(typeId) {
    // Oculta todos los detalles primero
    var details = document.getElementsByClassName('type-detail');
    for (var i = 0; i < details.length; i++) {
        details[i].style.display = 'none';
    }
    
    // Muestra el seleccionado
    var selected = document.getElementById(typeId);
    if (selected) {
        selected.style.display = 'block';
        // Desplaza a la vista (sin animación para mejor compatibilidad)
        selected.scrollIntoView();
    }
}

// Manejo básico de hash para navegación
window.onload = function() {
    if (window.location.hash) {
        var hash = window.location.hash.substr(1);
        if (hash.startsWith('gen')) {
            // Mostrar el contenido correspondiente
            var content = document.getElementById(hash);
            if (content) {
                document.querySelector('.content:target')?.style.display = 'none';
                content.style.display = 'block';
            }
        }
    }
};
