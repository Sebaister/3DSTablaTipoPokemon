function showType(typeId) {
            // Oculta todos los detalles primero
            var details = document.getElementsByClassName('type-detail');
            for (var i = 0; i < details.length; i++) {
                details[i].style.display = 'none';
            }
            
            // Muestra el seleccionado
            document.getElementById(typeId).style.display = 'block';
            
            // Desplaza a la vista (sin animación smooth para mejor rendimiento)
            document.getElementById(typeId).scrollIntoView();
        }
