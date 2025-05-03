// Versión compatible con 3DS
function showType(typeId) {
  var details = document.getElementsByClassName('type-detail');
  for (var i = 0; i < details.length; i++) {
    details[i].style.display = 'none';
  }
  
  var el = document.getElementById(typeId);
  if (el) {
    el.style.display = 'block';
    el.scrollIntoView();
  }
}

// Inicialización segura para 3DS
if (document.addEventListener) {
  document.addEventListener('DOMContentLoaded', function() {
    var details = document.getElementsByClassName('type-detail');
    for (var i = 0; i < details.length; i++) {
      details[i].style.display = 'none';
    }
  });
}
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('pokemon-search');
    const searchButton = document.getElementById('search-button');
    const resultContainer = document.getElementById('pokemon-result');
    
    // Cargar los datos del JSON
    fetch('pokedata.json')
        .then(response => response.json())
        .then(data => {
            const pokemonData = data;
            
            searchButton.addEventListener('click', function() {
                const searchTerm = searchInput.value.trim().toLowerCase();
                const pokemon = pokemonData.find(p => 
                    p.nombre.toLowerCase() === searchTerm || 
                    p.id.toString() === searchTerm
                );
                
                if (pokemon) {
                    displayPokemon(pokemon);
                } else {
                    alert('Pokémon no encontrado. Intenta con otro nombre o número.');
                }
            });
            
            // También puedes permitir búsqueda al presionar Enter
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    searchButton.click();
                }
            });
        })
        .catch(error => console.error('Error cargando los datos:', error));
    
    function displayPokemon(pokemon) {
        // Mostrar el contenedor de resultados
        resultContainer.style.display = 'block';
        
        // Nombre y ID
        document.getElementById('pokemon-name').textContent = `#${pokemon.id} ${pokemon.nombre}`;
        
        // Sprite - asumiendo que tienes una carpeta sprites con imágenes nombradas como "1.png", "2.png", etc.
        document.getElementById('pokemon-sprite').src = `sprites/${pokemon.id}.png`;
        document.getElementById('pokemon-sprite').alt = pokemon.nombre;
        
        // Tipos
        const typesContainer = document.getElementById('pokemon-types');
        typesContainer.innerHTML = '';
        pokemon.tipos.forEach(type => {
            const typeBadge = document.createElement('span');
            typeBadge.className = 'type-badge';
            typeBadge.textContent = type;
            typeBadge.style.backgroundColor = getTypeColor(type);
            typesContainer.appendChild(typeBadge);
        });
        
        // Estadísticas
        const statsContainer = document.getElementById('pokemon-stats');
        statsContainer.innerHTML = '<h3>Estadísticas</h3>';
        for (const [stat, value] of Object.entries(pokemon.stats)) {
            const statElement = document.createElement('p');
            statElement.textContent = `${stat}: ${value}`;
            statsContainer.appendChild(statElement);
        }
        
        // Evoluciones
        const evolutionContainer = document.getElementById('pokemon-evolution');
        evolutionContainer.innerHTML = '<h3>Evoluciones</h3>';
        
        if (pokemon.evolucion.length === 0) {
            evolutionContainer.innerHTML += '<p>No tiene evoluciones</p>';
        } else {
            pokemon.evolucion.forEach(evo => {
                const evoElement = document.createElement('p');
                evoElement.textContent = `Evoluciona a ${evo.b} (${evo.condiciones.join(', ')})`;
                evolutionContainer.appendChild(evoElement);
            });
        }
    }
    
    // Función auxiliar para colores de tipos
    function getTypeColor(type) {
        const typeColors = {
            'Planta': '#78C850',
            'Fuego': '#F08030',
            'Agua': '#6890F0',
            'Eléctrico': '#F8D030',
            'Hielo': '#98D8D8',
            'Lucha': '#C03028',
            'Veneno': '#A040A0',
            'Tierra': '#E0C068',
            'Volador': '#A890F0',
            'Psíquico': '#F85888',
            'Bicho': '#A8B820',
            'Roca': '#B8A038',
            'Fantasma': '#705898',
            'Dragón': '#7038F8',
            'Siniestro': '#705848',
            'Acero': '#B8B8D0',
            'Hada': '#EE99AC',
            'Normal': '#A8A878'
        };
        return typeColors[type] || '#777777';
    }
});
