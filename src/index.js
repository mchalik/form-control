import './styles/style.scss';

'use strict';

const fio = document.querySelector('#fio');
suggestionHandler(fio, 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/fio');
document.addEventListener('mousedown', handleSuggestionClick);

function suggestionHandler(input, url) {
    let currentIndex = -1;

    input.addEventListener('keydown', function() {
        let key;
        switch (event.keyCode) {
            case 38:
                key = 'UP';
                break;
            case 40:
                key = 'DOWN';
                break;
            case 13:
                key = 'ENTER';
                break;
        }
        const suggestions = input.parentElement.querySelector('.suggestions');
        if (key && suggestions) {
            selectionHandle(input, key, event);
        }
        if (key === 'UP' || key === 'DOWN') return;
        currentIndex = -1;
        autocompleteDataOutput(input, url)
    });

    input.addEventListener('blur', () => {
        const suggestions = input.parentElement.querySelector('.suggestions');
        if (suggestions) suggestions.hidden = true;
    });

    input.addEventListener('focus', () => {
        const suggestions = input.parentElement.querySelector('.suggestions');
        if (suggestions) suggestions.hidden = false;
    });


    function selectionHandle(input, key, event) {
        const suggestions = input.parentNode.querySelectorAll('.suggestions__item');
        clearSelection(suggestions);
        switch (key) {
            case 'DOWN':
                if (currentIndex >= suggestions.length) {
                    currentIndex = 0;
                } else {
                    currentIndex = currentIndex + 1;
                }
                suggestions[currentIndex].classList.add('selected');
                input.value = suggestions[currentIndex].innerText;
                break;
            case 'UP':
                if (currentIndex <= 0) {
                    currentIndex = suggestions.length - 1;
                } else {
                    currentIndex = currentIndex - 1;
                }
                suggestions[currentIndex].classList.add('selected');
                input.value = suggestions[currentIndex].innerText;
                break;
            case 'ENTER':
                event.preventDefault();
                input.value = suggestions[currentIndex].innerText;
                break;
        }
    }

    function clearSelection(suggestions) {
        suggestions.forEach(item => item.classList.remove('selected'));
    }

    function autocompleteDataOutput(input, url) {
        const inputData = input.value;
        const API_KEY = '094e0b373b850837a7f70c90899afc2cdf780966';
        const data = { query: inputData };

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
                    ul = createElem('ul', 'suggestions');
                    input.insertAdjacentElement('afterend', ul);
                }
                const liElems = suggestions.map(item => createElem('li', 'suggestions__item', item.value));
                liElems.forEach(li => ul.append(li));
            })
            .catch(error => console.error(error));
    }
}


function handleSuggestionClick(event) {
    const suggestion = event.target;
    if (!suggestion.classList.contains('suggestions__item')) return;
    const input = suggestion.closest('.input-wrap').querySelector('input');
    input.value = suggestion.innerText;
}

function createElem(tag = 'div', className, text) {
    const elem = document.createElement(tag);
    if (text) elem.innerText = text;
    if (className) elem.classList.add(className);
    return elem;
}


function mask(input, separator, separatorPlace, length) {
    let oldValue,
        oldCursor;
    const regex = new RegExp("^\\d{0," + length + "}$", 'g'),
        mask = function(value) {
            const output = [];
            for (let i = 0; i < value.length; i++) {
                if (i === separatorPlace) {
                    output.push(separator); // add the separator
                }
                output.push(value[i]);
            }
            return output.join("");
        },
        unmask = function(value) {
            return value.replace(new RegExp(/[^\d]/, 'g'), ''); // Remove every non-digit character
        },
        keydownHandler = function(e) {
            const el = e.target;

            oldValue = el.value;
            oldCursor = el.selectionEnd;
        },
        inputHandler = function(e) {
            const el = e.target;
            let newValue = unmask(el.value);

            if(newValue.match(regex)) {
                newValue = mask(newValue);

                if(newValue !== "") {
                    el.value = newValue;
                } else {
                    el.value = "";
                }
            } else {
                el.value = oldValue;
            }
        }
    ;

    input.addEventListener('keydown', keydownHandler);
    input.addEventListener('input', inputHandler);
}
const passPortUnitCode = document.querySelector('#passport_unit_code');
mask(passPortUnitCode, '-', 3, 6);
const passportSeriesNumber = document.querySelector('#passport_series_number');
mask(passportSeriesNumber, ' ', 4, 12);