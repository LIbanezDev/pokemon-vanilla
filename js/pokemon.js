const pokedex = document.getElementById('pokedex');
const loadingPokemonSpinner = document.getElementById('spinner-container');
const paginationContainer = document.getElementById('pagination-container');
const modalPokemonName = document.getElementById('modal-poke-name');
const modalPokemonDesc = document.getElementById('modal-poke-info');
const formFilterPokemon = document.getElementById('form-filter-pokemon');
const pokemonTypeSelect = document.getElementById('pokemon-type-select');

const limit = 8;
const totalPages = 12;
let offset = 0;
let pokemons = [];


formFilterPokemon.addEventListener('submit', async ev => {
    ev.preventDefault();
    const {data: {pokemon: pokemonsList}} = await axios.get(`https://pokeapi.co/api/v2/type/${pokemonTypeSelect.value}?offset=${offset * limit}&limit=${limit}`);
    setPokemonList(pokemonsList.map(pok => pok.pokemon));
})


const setPokemonList = async (pokemonsList = []) => {
    loadingPokemonSpinner.classList.remove('d-none');
    loadingPokemonSpinner.classList.add('d-block');
    pokedex.innerHTML = '';
    pokemons = [];
    const promises = [];
    for (let poke of pokemonsList) {
        pokemons.push({
            name: poke.name
        });
        promises.push(axios.get(poke.url));
    }
    const responses = await Promise.all(promises);
    responses.forEach((resp, index) =>
        pokemons[index].image = resp.data.sprites.other["official-artwork"].front_default
    )
    pokemons.forEach((pokemon, i) => {
        pokedex.innerHTML += `
            <a href="#" class="col-12 col-md-6 col-lg-3 animate__animated animate__fadeIn" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="setModalData(${i})"> 
                <img src="${pokemon.image}" class="img-fluid" alt="${pokemon.name}" />
                ${pokemon.name}
            </a>
        `
    });
    loadingPokemonSpinner.classList.remove('d-block');
    loadingPokemonSpinner.classList.add('d-none');
}

const clickPagination = async (pageNumber) => {
    if (pageNumber === -1) {
        offset -= 1;
    } else if (pageNumber === -2) {
        offset += 1;
    } else {
        offset = pageNumber;
    }
    const pageNumberReal = offset + 1;
    document.getElementById(`page${pageNumberReal}`).classList.add('active');
    for (let i = 1; i <= totalPages; i++) {
        if (i !== pageNumberReal) {
            document.getElementById(`page${i}`).classList.remove('active');
        }
    }
    const {data: {results: pokemonsList}} = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset * limit}&limit=${limit}`);
    await setPokemonList(pokemonsList);
    if (pageNumberReal === totalPages) {
        paginationContainer.lastElementChild.classList.add('disabled');
        paginationContainer.firstElementChild.classList.remove('disabled')
    } else if (pageNumberReal === 1) {
        paginationContainer.firstElementChild.classList.add('disabled');
        paginationContainer.lastElementChild.classList.remove('disabled')
    } else {
        paginationContainer.firstElementChild.classList.remove('disabled')
        paginationContainer.lastElementChild.classList.remove('disabled')
    }
}

const setModalData = (pokemonPosition) => {
    modalPokemonName.textContent = pokemons[pokemonPosition].name;
    modalPokemonDesc.textContent = 'Descripcion generica...';
}

window.onload = async () => {
    for (let i = 0; i < totalPages; i++) {
        paginationContainer.innerHTML +=
            `<li class="page-item ${i === 0 && 'active'}" id="page${i + 1}">
                <a class="page-link" href="#" onclick="clickPagination(${i})">
                    ${i + 1}
                </a>
            </li>`
    }
    paginationContainer.innerHTML += `
        <li class="page-item">
            <a class="page-link" href="#" aria-label="Next" onclick="clickPagination(-2)">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>
    `
    const {data: {results: pokemonsList}} = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset * limit}&limit=${limit}`);
    setPokemonList(pokemonsList);
}