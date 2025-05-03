// Variables globales
let pokemonData = [];

// Cargar datos al iniciar
document.addEventListener('DOMContentLoaded', function() {
  loadPokemonData();
});

// Cargar pokedata.json
function loadPokemonData() {
  fetch('pokedata.json')
    .then(response => {
      if (!response.ok) throw new Error("Error al cargar pokedata.json");
      return response.json();
    })
    .then(data => {
      pokemonData = data;
      console.log(`${data.length} Pokémon cargados`);
      setupSearch();
    })
    .catch(error => {
      console.error("Error:", error);
      alert("Error al cargar los datos. Recarga la página.");
    });
}

// Configurar búsqueda
function setupSearch() {
  const searchBtn = document.getElementById('search-btn');
  const searchInput = document.getElementById('pokemon-input');

  searchBtn.addEventListener('click', searchPokemon);
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') searchPokemon();
  });
}

// Buscar Pokémon
function searchPokemon() {
  const input = document.getElementById('pokemon-input').value.trim().toLowerCase();
  
  if (!input) {
    alert("¡Escribe un nombre o número!");
    return;
  }

  const pokemon = pokemonData.find(p => 
    p.nombre.toLowerCase() === input || 
    p.id.toString() === input
  );

  if (pokemon) {
    showPokemon(pokemon);
  } else {
    document.getElementById('pokemon-result').style.display = 'none';
    alert("Pokémon no encontrado. Ejemplos: 'Bulbasaur', '1'");
  }
}

// Mostrar Pokémon
function showPokemon(pokemon) {
  const result = document.getElementById('pokemon-result');
  result.style.display = 'block';

  // Nombre y número
  document.getElementById('pokemon-name').textContent = `#${pokemon.id} ${pokemon.nombre}`;

  // Sprite
  const spriteImg = document.getElementById('pokemon-sprite');
  spriteImg.src = `Sprite/${pokemon.id}.png`; // Asume que los sprites se llaman "1.png", "2.png", etc.
  spriteImg.onerror = function() {
    this.src = 'Sprite/placeholder.png'; // Fallback si no existe el sprite
  };

  // Tipos
  const typesContainer = document.getElementById('pokemon-types');
  typesContainer.innerHTML = pokemon.tipos.map(type => 
    `<span class="type-${type.toLowerCase()}">${type}</span>`
  ).join('');

  // Stats (opcional)
  if (pokemon.stats) {
    document.getElementById('pokemon-stats').innerHTML = `
      <p><b>HP:</b> ${pokemon.stats.hp}</p>
      <p><b>Ataque:</b> ${pokemon.stats.attack}</p>
      <p><b>Defensa:</b> ${pokemon.stats.defense}</p>
    `;
  }

  // Evolución (opcional)
  if (pokemon.evolucion) {
    document.getElementById('pokemon-evolution').innerHTML = `
      <p><b>Evoluciona a:</b> ${pokemon.evolucion[0].b} (Nivel ${pokemon.evolucion[0].condiciones[0].split(": ")[1]})</p>
    `;
  }
}

// ----- Para debug en 3DS (opcional) -----
// Muestra alerts en lugar de console.log
window.onerror = function(message) {
  alert("Error: " + message);
};
