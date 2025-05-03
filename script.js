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
    // Ocultar todos los detalles de tipo al cargar
    var details = document.getElementsByClassName('type-detail');
    for (var i = 0; i < details.length; i++) {
      details[i].style.display = 'none';
    }
    
    // Configurar la búsqueda de Pokémon (versión compatible con 3DS)
    setupPokemonSearch();
  });
}

// Función para configurar la búsqueda de Pokémon
function setupPokemonSearch() {
  var searchInput = document.getElementById('pokemon-search');
  var searchButton = document.getElementById('search-button');
  var resultContainer = document.getElementById('pokemon-result');
  
  if (!searchInput || !searchButton || !resultContainer) {
    console.error('Elementos de búsqueda no encontrados');
    return;
  }
  
  // Cargar los datos del JSON (versión compatible con 3DS)
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'pokedata.json', true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          var pokemonData = JSON.parse(xhr.responseText);
          
          // Configurar evento de búsqueda
          searchButton.addEventListener('click', function() {
            searchPokemon(pokemonData, searchInput.value.trim(), resultContainer);
          });
          
          // Configurar búsqueda al presionar Enter
          searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
              searchPokemon(pokemonData, searchInput.value.trim(), resultContainer);
            }
          });
          
        } catch (e) {
          console.error('Error al parsear JSON:', e);
        }
      } else {
        console.error('Error al cargar el archivo JSON');
      }
    }
  };
  xhr.send(null);
}

// Función para buscar Pokémon
function searchPokemon(pokemonData, searchTerm, resultContainer) {
  searchTerm = searchTerm.toLowerCase();
  var pokemon = null;
  
  // Buscar por nombre o ID
  for (var i = 0; i < pokemonData.length; i++) {
    if (pokemonData[i].nombre.toLowerCase() === searchTerm || 
        pokemonData[i].id.toString() === searchTerm) {
      pokemon = pokemonData[i];
      break;
    }
  }
  
  if (pokemon) {
    displayPokemon(pokemon, resultContainer);
  } else {
    alert('Pokémon no encontrado. Intenta con otro nombre o número.');
  }
}

// Función para mostrar los datos del Pokémon
function displayPokemon(pokemon, resultContainer) {
  // Mostrar el contenedor de resultados
  resultContainer.style.display = 'block';
  
  // Nombre y ID
  document.getElementById('pokemon-name').textContent = '#' + pokemon.id + ' ' + pokemon.nombre;
  
  // Sprite
  var spriteElement = document.getElementById('pokemon-sprite');
  spriteElement.src = 'sprites/' + pokemon.id + '.png';
  spriteElement.alt = pokemon.nombre;
  
  // Tipos
  var typesContainer = document.getElementById('pokemon-types');
  typesContainer.innerHTML = '';
  for (var i = 0; i < pokemon.tipos.length; i++) {
    var type = pokemon.tipos[i];
    var typeBadge = document.createElement('span');
    typeBadge.className = 'type-badge';
    typeBadge.textContent = type;
    typeBadge.style.backgroundColor = getTypeColor(type);
    typesContainer.appendChild(typeBadge);
  }
  
  // Estadísticas
  var statsContainer = document.getElementById('pokemon-stats');
  statsContainer.innerHTML = '<h3>Estadísticas</h3>';
  var stats = pokemon.stats;
  for (var stat in stats) {
    if (stats.hasOwnProperty(stat)) {
      var statElement = document.createElement('p');
      statElement.textContent = stat + ': ' + stats[stat];
      statsContainer.appendChild(statElement);
    }
  }
  
  // Evoluciones
  var evolutionContainer = document.getElementById('pokemon-evolution');
  evolutionContainer.innerHTML = '<h3>Evoluciones</h3>';
  
  if (pokemon.evolucion.length === 0) {
    evolutionContainer.innerHTML += '<p>No tiene evoluciones</p>';
  } else {
    for (var j = 0; j < pokemon.evolucion.length; j++) {
      var evo = pokemon.evolucion[j];
      var evoElement = document.createElement('p');
      evoElement.textContent = 'Evoluciona a ' + evo.b + ' (' + evo.condiciones.join(', ') + ')';
      evolutionContainer.appendChild(evoElement);
    }
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
