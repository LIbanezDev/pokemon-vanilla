const pokedex = document.getElementById('pokedex');
const loadingPokemonSpinner = document.getElementById('spinner-container');
const paginationContainer = document.getElementById('pagination-container');
const limit = 8;
const totalPages = 10;
let offset = 0;

const setPokemonList = async () => {
    loadingPokemonSpinner.classList.remove('d-none');
    loadingPokemonSpinner.classList.add('d-block');
    pokedex.innerHTML = '';
    const pokemons = [];
    const promises = [];
    const {data: {results: pokemonsList}} = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset * limit}&limit=${limit}`);
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
    pokemons.forEach(pokemon => {
        const newPokemonDiv = document.createElement('div');
        const newPokemonImage = document.createElement('img')
        newPokemonImage.classList.add('img-fluid')
        newPokemonImage.src = pokemon.image;
        newPokemonDiv.classList.add('col-12', 'col-md-6', 'col-lg-3', 'animate__animated', 'animate__fadeIn');
        newPokemonDiv.textContent = pokemon.name;
        newPokemonDiv.appendChild(newPokemonImage)
        pokedex.appendChild(newPokemonDiv)
    });
    loadingPokemonSpinner.classList.remove('d-block');
    loadingPokemonSpinner.classList.add('d-none');
}

const clickPagination = (pageNumber) => {
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
    setPokemonList();
}

window.onload = () => {
    for (let i = 0; i < totalPages; i++) {
        paginationContainer.innerHTML +=
            `<li class="page-item ${i === 0 && 'active'}" id="page${i + 1}"><a class="page-link" href="#" onclick="clickPagination(${i})">${i + 1}</a></li>`
    }
    paginationContainer.innerHTML += `
        <li class="page-item">
            <a class="page-link" href="#" aria-label="Next" onclick="clickPagination(-2)">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>
    `
    setPokemonList();
}