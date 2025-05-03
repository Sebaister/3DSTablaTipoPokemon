// Usar const/let en lugar de var para mejor scope
const POKE_API_BASE = '';
let pokedata = [];

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    loadPokemonData();
    initializeTypeButtons();
});

// Cargar datos de Pokémon (mejorado con fetch y manejo de errores)
async function loadPokemonData() {
    try {
        const response = await fetch('pokedata.json');
        if (!response.ok) throw new Error('Error al cargar datos');
        pokedata = await response.json();
        initializeSearch();
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('pokemon-info').innerHTML = 
            '<p class="error">Error al cargar los datos de Pokémon</p>';
    }
}

// Función para mostrar/ocultar tipos (mejorada)
function showType(typeId) {
    // Ocultar todos los detalles primero
    document.querySelectorAll('.type-detail').forEach(detail => {
        detail.classList.remove('active');
    });
    
    // Mostrar el seleccionado
    const typeDetail = document.getElementById(typeId);
    if (typeDetail) {
        typeDetail.classList.add('active');
        typeDetail.scrollIntoView({ behavior: 'smooth' });
    }
}

// Inicializar botones de tipo (nueva función)
function initializeTypeButtons() {
    document.querySelectorAll('.type-btn').forEach(button => {
        button.addEventListener('click', function() {
            const typeId = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            showType(typeId);
        });
    });
}

// Inicializar buscador (mejorado)
function initializeSearch() {
    const input = document.getElementById('search');
    const btn = document.getElementById('search-btn');
    const infoDiv = document.getElementById('pokemon-info');

    const searchPokemon = () => {
        const query = input.value.trim().toLowerCase();
        if (!query) {
            infoDiv.innerHTML = '';
            return;
        }

        // Búsqueda más flexible (incluye búsqueda parcial)
        const result = pokedata.find(p => 
            p.nombre.toLowerCase().includes(query) || 
            String(p.numero).includes(query)
        );

        if (result) {
            displayPokemon(result);
        } else {
            infoDiv.innerHTML = '<p class="not-found">No se encontró ningún Pokémon.</p>';
        }
    };

    btn.addEventListener('click', searchPokemon);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchPokemon();
    });
}

// Mostrar detalles del Pokémon (mejorado con template strings)
function displayPokemon(pokemon) {
    const infoDiv = document.getElementById('pokemon-info');
    
    const statsHTML = Object.entries(pokemon.estadisticas)
        .map(([stat, value]) => `<li><strong>${stat}:</strong> ${value}</li>`)
        .join('');

    infoDiv.innerHTML = `
        <div class="pokemon-card">
            <h2>${pokemon.nombre} <span class="number">#${pokemon.numero.toString().padStart(3, '0')}</span></h2>
            <img src="sprites/${pokemon.numero}.png" alt="${pokemon.nombre}" 
                 onerror="this.src='sprites/placeholder.png'">
            <div class="types">${pokemon.tipos.map(t => `<span class="type-tag ${t.toLowerCase()}">${t}</span>`).join('')}</div>
            <div class="stats">
                <h3>Estadísticas</h3>
                <ul>${statsHTML}</ul>
            </div>
            ${pokemon.evolucion ? `<div class="evolution"><h3>Evolución</h3><p>${pokemon.evolucion}</p></div>` : ''}
        </div>
    `;
}

// Manejo de errores para imágenes faltantes (global)
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG' && e.target.getAttribute('alt')?.includes('Pokémon')) {
        e.target.src = 'sprites/placeholder.png';
    }
}, true);
