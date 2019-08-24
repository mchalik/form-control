import './styles/style.scss';

const fio = document.querySelector('#fio');

fio.addEventListener('keyup', () => {
    const input = event.target;
    const inputData = input.value;
    const url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/fio';
    const API_KEY = '094e0b373b850837a7f70c90899afc2cdf780966';
    const data = {query: inputData};

    fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Token ${API_KEY}`,
            'X-Secret': '0b91e0292d9ca0d249ce23dfcecda1830575b98b'
        }
    }).then(res => res.json())
        .then(({suggestions}) => {
            let ul = input.parentElement.querySelector('.suggestions');
            if (ul) {
                ul.innerHTML = '';
            } else {
                ul = document.createElement('ul');
                ul.classList.add('suggestions');
                input.insertAdjacentElement('afterend', ul);
            }
            const liElems = suggestions.map(item => {
                const li = document.createElement('li');
                li.classList.add('suggestions__item');
                li.innerText = item.value;
                return li;
            });
            liElems.forEach(li => ul.append(li));
        })
        .catch(error => console.log(error));
});



document.addEventListener('mousedown', function (event) {
    const suggestion = event.target;
    if (!suggestion.classList.contains('suggestions__item')) return;
    const input = suggestion.closest('.input-wrap').querySelector('input');
    input.value = suggestion.innerText;
    input.focus();
});

document
    .querySelectorAll('input')
    .forEach(input => input.addEventListener('blur', (event) => {
        const input = event.target;

        const suggestions = input.parentElement.querySelector('.suggestions');
        if (suggestions) suggestions.hidden = true;
}));

document
    .querySelectorAll('input')
    .forEach(input => input.addEventListener('keydown', (event) => {
        const input = event.target;
        let dir;
        switch (event.keyCode) {
            case 37:
                dir = 'UP';
                break;
            case 40:
                dir = 'DOWN';
                break;
            default:
                return;
        }
        const suggestions = input.parentElement.querySelector('.suggestions');
        if (!suggestions) return;
        const suggestionItem = suggestions.querySelector('.selected');
        const selectedItem = (dir === 'UP')
            ? suggestions.querySelector('.suggestion__item').nextSibling.classList.add('selected')
            : suggestions.querySelector('.suggestion__item').previousSibling.classList.add('selected');

    }));


document
    .querySelectorAll('input')
    .forEach(input => input.addEventListener('focus', (event) => {
        const input = event.target;
        const suggestions = input.parentElement.querySelector('.suggestions');
        if (suggestions) suggestions.hidden = false;
}));
