const formPokemon = document.getElementById('form-pokemon');
const pokemonLegendaryBool = document.getElementsByName('pokemon-leg-rb');
const pokeTable = document.getElementById('body-poke-table');

const pokemonTypesIcons = {
    Normal: '<i class="fas fa-bullseye fa-2x text-secondary"></i>',
    Water: '<i class="fas fa-tint fa-2x text-info"></i>',
    Fire: '<i class="fas fa-fire fa-2x text-danger"></i>',
    Ghost: '<i class="fas fa-ghost fa-2x " style="color: #7950F2"></i>',
    Plant: '<i class="fas fa-leaf fa-2x text-success"></i>',
    Ice: '<i class="fas fa-snowflake fa-2x text-info"></i>',
    Electric: '<i class="fas fa-bolt fa-2x text-warning"></i>'
}

tinymce.init({
    selector: '#pokemon-desc-form',
    height: 250,
    menubar: false,
    plugins: [
        'advlist autolink lists link image charmap print preview anchor',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table paste code help wordcount'
    ],
    toolbar: 'undo redo | formatselect | ' +
        'bold italic backcolor | alignleft aligncenter ' +
        'alignright alignjustify | bullist numlist outdent indent | ' +
        'removeformat | help',
    content_style: 'body { font-family:Inter,Arial,sans-serif; font-size:14px }'
});

const getPokeListFromStorage = () => {
    let pokeList = localStorage.getItem('pokeList');
    if (!pokeList) {
        localStorage.setItem('pokeList', '');
        return [];
    }
    return localStorage.getItem('pokeList').split('|').map(JSON.parse)
}

const addPokeToStorage = (pokemon) => {
    const updatedList = getPokeListFromStorage();
    updatedList.push(pokemon);
    localStorage.setItem('pokeList', updatedList.map(JSON.stringify).join('|'));
    return updatedList;
}

const updatePokeTableHTML = (updatedList) => {
    pokeTable.innerHTML = '';
    updatedList.forEach((pokemon, index) => {
        pokeTable.innerHTML += `
            <tr>
                <td> ${index + 1} </td>
                <td> ${pokemon.name} </td>
                <td class="text-center"> ${pokemonTypesIcons[pokemon.pokeType]} </td>
                <td> ${pokemon.desc} </td>
                <td> Something </td>
            </tr>
        `;
    });
}

formPokemon.addEventListener('submit', async (e) => {
    e.preventDefault();
    let i = 0, legendaryValue = '';
    while (i < pokemonLegendaryBool.length && legendaryValue === '') {
        if (pokemonLegendaryBool[i].checked) {
            legendaryValue = pokemonLegendaryBool[i].value
        }
        i++;
    }
    const newPokemon = {
        name: document.getElementById('pokemon-name-form').value,
        pokeType: document.getElementById('pokemon-type-form').value,
        desc: tinymce.get("pokemon-desc-form").getContent(),
        isLegendary: legendaryValue === 'si'
    }
    const updatedList = addPokeToStorage(newPokemon);
    updatePokeTableHTML(updatedList);
    Swal.fire('Resultado exitoso', 'Pokemon agregado', 'success')
})

window.onload = () => {
    updatePokeTableHTML(getPokeListFromStorage());
}