const pokemonListDom = document.getElementById('pokemon-list');
const formPokemon = document.getElementById('form-pokemon');
const loadingPokemonSpinner = document.getElementById('spinner-loading');


formPokemon.addEventListener('submit', async (e) => {
    e.preventDefault();
    const pokemonListFetched = await getPokemons();
    writePokemonList(pokemonListFetched);
})

const getPokemons = async () => {
    loadingPokemonSpinner.classList.remove('d-none');
    loadingPokemonSpinner.classList.add('d-block');
    pokemonListDom.innerHTML = '';
    const pokemonLimitForm = parseInt(document.getElementById('pokemon-limit-form').value);
    const data = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${pokemonLimitForm}`, {
        method: 'GET',
    });
    const {results: pokemonListFetched} = await data.json();
    console.log(pokemonListFetched);
    return pokemonListFetched;
}

const writePokemonList = (pokemonList) => {
    loadingPokemonSpinner.classList.remove('d-block');
    loadingPokemonSpinner.classList.add('d-none');
    for (let i in pokemonList) {
        const newPokemonLi = document.createElement('li');
        newPokemonLi.textContent = pokemonList[i].name;
        newPokemonLi.classList.add('list-group-item');
        pokemonListDom.appendChild(newPokemonLi)
    }
}