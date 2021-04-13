const pokedex = document.getElementById('pokedex');
const loadingPokemonSpinner = document.getElementById('spinner-container');

window.onload = async () => {
    const pokemons = [];
    const promises = []
    const {data: {results: pokemonsList}} = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=40`);
    for (let poke of pokemonsList) {
        pokemons.push({
            name: poke.name
        });
        promises.push(axios.get(poke.url));
        console.log('Obteniendo dato de pokemon ' + poke.name)
    }
    const responses = await Promise.all(promises);
    responses.forEach((resp, index) => {
        pokemons[index] = {
            ...pokemons[index],
            image: resp.data.sprites.other["official-artwork"].front_default
        }
    })
    pokemons.forEach(pokemon => {
        const newPokemonDiv = document.createElement('div');
        const newPokemonImage = document.createElement('img')
        newPokemonImage.classList.add('img-fluid')
        newPokemonImage.src = pokemon.image;
        newPokemonDiv.classList.add('col-12', 'col-md-6', 'col-lg-3');
        newPokemonDiv.textContent = pokemon.name;
        newPokemonDiv.appendChild(newPokemonImage)
        pokedex.appendChild(newPokemonDiv)
    });
    loadingPokemonSpinner.classList.remove('d-block');
    loadingPokemonSpinner.classList.add('d-none');
}