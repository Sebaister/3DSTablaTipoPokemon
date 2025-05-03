// Función para mostrar tipos (existente)
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

// Inicialización
if (document.addEventListener) {
  document.addEventListener('DOMContentLoaded', function() {
    // Ocultar detalles de tipo al cargar
    var details = document.getElementsByClassName('type-detail');
    for (var i = 0; i < details.length; i++) {
      details[i].style.display = 'none';
    }
    
    // Cargar datos de Pokémon
    loadPokemonData();
  });
}

// Cargar datos JSON
function loadPokemonData() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'pokedata.json', true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          window.pokemonData = JSON.parse(xhr.responseText);
          setupSearch();
        } catch (e) {
          console.error('Error parsing JSON:', e);
          alert('Error al cargar los datos de Pokémon');
        }
      } else {
        console.error('Error loading JSON file');
        alert('No se pudo cargar el archivo de datos');
      }
    }
  };
  xhr.send(null);
}

// Configurar búsqueda
function setupSearch() {
  var searchInput = document.getElementById('pokemon-search');
  var searchButton = document.getElementById('search-button');
  
  if (!searchInput || !searchButton) {
    console.error('Search elements not found');
    return;
  }
  
  searchButton.addEventListener('click', doSearch);
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') doSearch();
  });
}

// Realizar búsqueda
function doSearch() {
  var searchTerm = document.getElementById('pokemon-search').value.trim().toLowerCase();
  var result = document.getElementById('pokemon-result');
  
  if (!searchTerm) {
    result.style.display = 'none';
    return;
  }
  
  var foundPokemon = null;
  
  // Buscar por nombre o ID
  for (var i = 0; i < window.pokemonData.length; i++) {
    var pokemon = window.pokemonData[i];
    if (pokemon.nombre.toLowerCase() === searchTerm || 
        pokemon.id.toString() === searchTerm) {
      foundPokemon = pokemon;
      break;
    }
  }
  
  if (foundPokemon) {
    showPokemon(foundPokemon);
  } else {
    alert('Pokémon no encontrado. Intenta con otro nombre o número.');
    result.style.display = 'none';
  }
}

// Mostrar Pokémon con sprite
function showPokemon(pokemon) {
  var result = document.getElementById('pokemon-result');
  result.style.display = 'block';
  
  // Nombre y número
  document.getElementById('pokemon-name').textContent = '#' + pokemon.id + ' ' + pokemon.nombre;
  
  // Cargar sprite desde la carpeta Sprite
  var spriteImg = document.getElementById('pokemon-sprite');
  spriteImg.src = 'Sprite/' + pokemon.id + '.png';
  
  // Manejar error si el sprite no carga
  spriteImg.onerror = function() {
    console.warn('No se encontró el sprite local, usando fuente online');
    this.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + pokemon.id + '.png';
    this.onerror = null; // Prevenir bucles infinitos
  };
  
  // Mostrar tipos
  var typesContainer = document.getElementById('pokemon-types');
  typesContainer.innerHTML = '';
  pokemon.tipos.forEach(function(type) {
    var typeBadge = document.createElement('span');
    typeBadge.className = 'type-badge';
    typeBadge.textContent = type;
    typeBadge.style.backgroundColor = getTypeColor(type);
    typesContainer.appendChild(typeBadge);
  });
  
  // Mostrar estadísticas
  var statsContainer = document.getElementById('pokemon-stats');
  statsContainer.innerHTML = '<h3>Estadísticas</h3>';
  for (var stat in pokemon.stats) {
    if (pokemon.stats.hasOwnProperty(stat)) {
      var statElement = document.createElement('p');
      statElement.textContent = stat + ': ' + pokemon.stats[stat];
      statsContainer.appendChild(statElement);
    }
  }
  
  // Mostrar evoluciones
  var evolutionContainer = document.getElementById('pokemon-evolution');
  evolutionContainer.innerHTML = '<h3>Evoluciones</h3>';
  
  if (pokemon.evolucion.length === 0) {
    evolutionContainer.innerHTML += '<p>No tiene evoluciones</p>';
  } else {
    pokemon.evolucion.forEach(function(evo) {
      var evoElement = document.createElement('p');
      evoElement.textContent = 'Evoluciona a ' + evo.b;
      
      // Mostrar condiciones si existen
      if (evo.condiciones && evo.condiciones.length > 0) {
        var conditions = document.createElement('small');
        conditions.textContent = ' (' + evo.condiciones.join(', ') + ')';
        conditions.style.display = 'block';
        conditions.style.color = '#666';
        evoElement.appendChild(conditions);
      }
      
      evolutionContainer.appendChild(evoElement);
    });
  }
}

// Función auxiliar para colores de tipos
function getTypeColor(type) {
  var typeColors = {
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
