// DATA

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

const formEl = document.querySelector(".convert-form");
const resultMessageEl = document.createElement("p");
resultMessageEl.classList.add("convert__message");

const searchInput = document.querySelector("#search");

// LOGIC

function addNewRate(element) {
    element.preventDefault();

    const rateFrom = rateFromEl.value;
    const rateTo = rateToEl.value;
    const newRate = parseFloat(newRateEl.value);

    if (rateFrom && rateTo && !isNaN(newRate)) {
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

        console.log(allRates); // modern debugger

        addElementsToHTML();
        addGridElementToHTML();
    }
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

    // Dynamically add currencies to the second section element depending on which currency is selected in the first drop-down list
    convertFromEl.onchange = function () {
        const selectedCurrency = convertFromEl.value;

        // ! DEFINITELY MUST CHANGE CODE BELOW
        for (let i = convertToEl.options.length - 1; i > 0; i--) {
            convertToEl.remove(i);
        }

        for (let i = 0; i < allRates.length; i++) {
            if (allRates[i].base === selectedCurrency) {
                for (const rateTo in allRates[i].rates) {
                    if (allRates[i].rates.hasOwnProperty(rateTo)) {
                        addOption(convertToEl, rateTo);
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

function addGridElementToHTML() {
    const gridContainer = document.querySelector(".grid__container");
    gridContainer.innerHTML = "";

    allRates.forEach((rateObject) => {
        const gridItem = document.createElement("div");
        gridItem.classList.add("grid__item");

        const baseElement = document.createElement("p");
        baseElement.textContent = `Base: ${rateObject.base}`;
        gridItem.appendChild(baseElement);

        const ratesElement = document.createElement("p");
        ratesElement.textContent = "Rates:";
        gridItem.appendChild(ratesElement);

        const ratesList = document.createElement("ul");
        for (const currency in rateObject.rates) {
            if (rateObject.rates.hasOwnProperty(currency)) {
                const rateItem = document.createElement("li");
                rateItem.textContent = `${currency}: ${rateObject.rates[currency]}`;
                ratesList.appendChild(rateItem);
            }
        }
        gridItem.appendChild(ratesList);

        const dateElement = document.createElement("p");
        dateElement.textContent = `Date: ${rateObject.date}`;
        gridItem.appendChild(dateElement);

        gridContainer.appendChild(gridItem);
    });
}

// Search Functionality
function updateGrid(rates) {
    const gridContainer = document.querySelector(".grid__container");
    gridContainer.innerHTML = "";

    rates.forEach((rateObject) => {
        const gridItem = document.createElement("div");
        gridItem.classList.add("grid__item");

        const baseElement = document.createElement("p");
        baseElement.textContent = `Base: ${rateObject.base}`;
        gridItem.appendChild(baseElement);

        const ratesElement = document.createElement("p");
        ratesElement.textContent = "Rates:";
        gridItem.appendChild(ratesElement);

        const ratesList = document.createElement("ul");
        for (const currency in rateObject.rates) {
            if (rateObject.rates.hasOwnProperty(currency)) {
                const rateItem = document.createElement("li");
                rateItem.textContent = `${currency}: ${rateObject.rates[currency]}`;
                ratesList.appendChild(rateItem);
            }
        }

        const dateElement = document.createElement("div");
        dateElement.textContent = `Date: ${rateObject.date}`;
        gridItem.appendChild(ratesList);
        gridItem.appendChild(dateElement);

        gridContainer.appendChild(gridItem);
    });
}

function searchFunction() {
    const query = searchInput.value.toLowerCase();
    const filteredRates = allRates.filter(
        (rateObject) =>
            rateObject.base.toLowerCase().includes(query) ||
            Object.keys(rateObject.rates).some((currency) =>
                currency.toLowerCase().includes(query)
            )
    );
    updateGrid(filteredRates);
}

addRateEl.addEventListener("click", addNewRate);
convertEl.addEventListener("click", convertCurrency);
searchInput.addEventListener("keyup", searchFunction);

// RENDER
