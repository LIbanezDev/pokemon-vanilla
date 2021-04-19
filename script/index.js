const formPokemon = document.getElementById('form-pokemon');
const pokemonLegendaryBool = document.getElementsByName('pokemon-leg-rb');
const pokemonName = document.getElementById('pokemon-name-form');
const pokemonType = document.getElementById('pokemon-type-form');

tinymce.init({
  selector: 'textarea#pokemon-desc-form',
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

formPokemon.addEventListener('submit', async (e) => {
    e.preventDefault();
    let i = 0, legendaryValue = '';
    while (i < pokemonLegendaryBool.length && legendaryValue === '') {
        if (pokemonLegendaryBool[i].checked) {
            legendaryValue = pokemonLegendaryBool[i].value
        }
        i++;
    }
    console.log(document.getElementById('pokemon-desc-form').value)
})