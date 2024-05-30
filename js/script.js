// ! DATA

const rateFromEl = document.querySelector("#rateFrom");
const rateToEl = document.querySelector("#rateTo");
const newRateEl = document.querySelector("#enterNewRate");
const addRateEl = document.querySelector("#addNewRate");

const allRates = [];

const convertFromEl = document.querySelector("#convertFrom");
const convertToEl = document.querySelector("#convertTo");
const amountEl = document.querySelector("#amountToConvert");
const convertEl = document.querySelector("#convert");

const addedFromCurrencies = [];

// ! LOGIC

function addNewRate() {
    const rateFrom = rateFromEl.value;
    const rateTo = rateToEl.value;
    const newRate = parseFloat(newRateEl.value);

    const newRateObject = {
        timestamp: new Date().getTime(),
        base: rateFrom,
        date: new Date().toISOString().slice(0, 10),
        rates: {
            [rateTo]: newRate,
        },
    };

    let found = false;
    for (let i = 0; i < allRates.length; i++) {
        // Check if the rate object already exists in the allRates array
        if (allRates[i].base === rateFrom) {
            allRates[i].rates[rateTo] = newRate;
            found = true;
            break;
        }
    }

    if (!found) {
        allRates.push(newRateObject);
    }

    console.log(allRates); // Remove this later

    addElementsToHTML();
}

function addElementsToHTML() {
    for (let i = 0; i < allRates.length; i++) {
        const base = allRates[i].base;
        if (!addedFromCurrencies.includes(base)) {
            // Add the elements to the first section element
            addOption(convertFromEl, base);
            addedFromCurrencies.push(base);
        }
    }

    convertFromEl.onchange = function () {
        // Dynamically add currencies to the second section element depending on which currency is selected in the first drop-down list

        const selectedCurrency = convertFromEl.value;

        // ! DEFINITELY MUST CHANGE CODE BELOW
        for (let i = convertToEl.options.length - 1; i > 0; i--) {
            convertToEl.remove(i);
        }

        for (let i = 0; i < allRates.length; i++) {
            if (allRates[i].base === selectedCurrency) {
                for (const rate in allRates[i].rates) {
                    if (allRates[i].rates.hasOwnProperty(rate)) {
                        addOption(convertToEl, rate);
                    }
                }
                break;
            }
        }
    };
}

function addOption(selectElement, value) {
    const option = document.createElement("option");
    option.innerText = value;

    selectElement.appendChild(option);
}

function convertCurrency(event) {
    event.preventDefault();

    const currencyFrom = convertFromEl.value;
    const currencyTo = convertToEl.value;
    const amount = amountEl.value;

    // const selectedCurrency = convertFromEl.value;

    let rate = 0;
    let result = 0;

    for (let i = 0; i < allRates.length; i++) {
        if (allRates[i].base === currencyFrom) {
            rate = allRates[i].rates[currencyTo];
            break;
        }
    }

    result = amount * rate;

    const formEl = document.convertForm;
    const resultMessageEl = document.createElement("p");

    if (
        currencyFrom === "Select Currency" ||
        currencyTo === "Select Currency"
    ) {
        resultMessageEl.innerText = "Please, select correct currency";
    } else {
        resultMessageEl.innerText = `${amount} ${currencyFrom} will be ${result.toFixed(
            2
        )} ${currencyTo}`;
    }

    formEl.appendChild(resultMessageEl);
}

addRateEl.addEventListener("click", addNewRate);
convertEl.addEventListener("click", convertCurrency);

// ! RENDER
