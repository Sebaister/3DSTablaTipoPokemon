function showPokemon(pokemon) {
  var result = document.getElementById('pokemon-result');
  result.style.display = 'block';
  
  // Nombre y número
  document.getElementById('pokemon-name').textContent = '#' + pokemon.id + ' ' + pokemon.nombre;
  
  // Sprite con múltiples fuentes de respaldo
  var spriteImg = document.getElementById('pokemon-sprite');
  var spritePaths = [
    'sprites/' + pokemon.id + '.png', // Local
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + pokemon.id + '.png', // PokeAPI
    'https://cdn.traction.one/pokedex/pokemon/' + pokemon.id + '.png' // Alternativa
  ];
  
  tryLoadSprite(spriteImg, spritePaths, 0);
  
  // Resto de la función (tipos, stats, evoluciones)...
}

function tryLoadSprite(img, paths, index) {
  if (index >= paths.length) {
    img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><text x="32" y="32" font-family="Arial" font-size="10" fill="black" text-anchor="middle" dominant-baseline="middle">No sprite</text></svg>';
    return;
  }
  
  img.src = paths[index] + '?v=' + Date.now();
  img.onerror = function() {
    tryLoadSprite(img, paths, index + 1);
  };
}
