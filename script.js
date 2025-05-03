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
    if (xhr.readyState === 4 && xhr.status === 200) {
      try {
        window.pokemonData = JSON.parse(xhr.responseText);
        setupSearch();
      } catch (e) {
        console.error('Error parsing JSON:', e);
      }
    }
  };
  xhr.send(null);
}

// Configurar búsqueda
function setupSearch() {
  var searchInput = document.getElementById('pokemon-search');
  var searchButton = document.getElementById('search-button');
  
  if (!searchInput || !searchButton) return;
  
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
  
  var found = window.pokemonData.find(function(p) {
    return p.nombre.toLowerCase() === searchTerm || p.id.toString() === searchTerm;
  });
  
  if (found) {
    showPokemon(found);
  } else {
    alert('Pokémon no encontrado');
    result.style.display = 'none';
  }
}

// Mostrar resultados
function showPokemon(pokemon) {
  var result = document.getElementById('pokemon-result');
  result.style.display = 'block';
  
  // Mostrar datos básicos
  document.getElementById('pokemon-name').textContent = '#' + pokemon.id + ' ' + pokemon.nombre;
  document.getElementById('pokemon-sprite').src = 'sprites/' + pokemon.id + '.png';
  
  // Mostrar tipos
  var typesContainer = document.getElementById('pokemon-types');
  typesContainer.innerHTML = '';
  pokemon.tipos.forEach(function(type) {
    var badge = document.createElement('span');
    badge.className = 'type-badge';
    badge.textContent = type;
    badge.style.backgroundColor = getTypeColor(type);
    typesContainer.appendChild(badge);
  });
  
  // Mostrar estadísticas
  var statsContainer = document.getElementById('pokemon-stats');
  statsContainer.innerHTML = '<h3>Estadísticas</h3>';
  for (var stat in pokemon.stats) {
    var p = document.createElement('p');
    p.textContent = stat + ': ' + pokemon.stats[stat];
    statsContainer.appendChild(p);
  }
  
  // Mostrar evoluciones
  var evoContainer = document.getElementById('pokemon-evolution');
  evoContainer.innerHTML = '<h3>Evoluciones</h3>';
  if (pokemon.evolucion.length === 0) {
    evoContainer.innerHTML += '<p>No tiene evoluciones</p>';
  } else {
    pokemon.evolucion.forEach(function(evo) {
      var p = document.createElement('p');
      p.textContent = '→ ' + evo.b + ' (' + evo.condiciones.join(', ') + ')';
      evoContainer.appendChild(p);
    });
  }
}

// Colores para tipos (igual que tu tabla)
function getTypeColor(type) {
  var colors = {
    'Acero': '#B8B8D0', 'Agua': '#6890F0', 'Bicho': '#A8B820',
    'Dragón': '#7038F8', 'Eléctrico': '#F8D030', 'Fantasma': '#705898',
    'Fuego': '#F08030', 'Hada': '#EE99AC', 'Hielo': '#98D8D8',
    'Lucha': '#C03028', 'Normal': '#A8A878', 'Planta': '#78C850',
    'Psíquico': '#F85888', 'Roca': '#B8A038', 'Siniestro': '#705848',
    'Tierra': '#E0C068', 'Veneno': '#A040A0', 'Volador': '#A890F0'
  };
  return colors[type] || '#777777';
}
