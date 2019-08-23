import './style.scss';

const fio = document.querySelector('#fio');

fio.addEventListener('keyup', () => {
   console.dir(event.target);
   console.log(event.target.value);
    fetch();
    let url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/fio';
    let url2 = 'https://cleaner.dadata.ru/api/v1/clean/name\n';
    const API_KEY = '094e0b373b850837a7f70c90899afc2cdf780966';
    fetch(url, {
        method: 'POST', // или 'PUT'
        body: JSON.stringify(data), // data может быть типа `string` или {object}!
        headers:{
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Token ${API_KEY}`,
            'X-Secret': '0b91e0292d9ca0d249ce23dfcecda1830575b98b'
        }
    }).then(res => res.json())
        .then(response => console.log('”спех:', JSON.stringify(response)))
});