// DATA

const rateFromEl = document.querySelector("#rateFrom");
const rateToEl = document.querySelector("#rateTo");
const newRateEl = document.querySelector("#enterNewRate");
const addRateEl = document.querySelector("#addNewRate");

let allRates = [];

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

function getDataFromApi() {
    fetch(
        "https://raw.githubusercontent.com/tonevrav/tonevrav.github.io/main/api.json"
    )
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            allRates = data;

            for (const item of data) {
                item.timestamp = new Date().getTime();
                item.date = new Date().toISOString().slice(0, 10);
            }

            addElementsToHTML();
            addGridElementToHTML();
        })
        .catch((error) => alert(`Sorry. There is an error: ${error}`));
}

function showInfoMarket() {
    const currentDate = new Date();
    const getHours = currentDate.getHours();

    let result = "";

    if (getHours < 9 || 9 > 17) {
        result = "The market is now closed";
    } else {
        result = "The market is now open";
    }

    const container = document.querySelector(".marketInfo");
    const messageInfoElement = document.createElement("p");
    messageInfoElement.textContent = result;
    container.appendChild(messageInfoElement);
}

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
                [rateFrom]: 1,
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
    // for (let i = 0; i < allRates.length; i++) {
    //     const base = allRates[i].base;
    //     if (!addedFromCurrencies.includes(base)) {
    //         // Add the elements to the first section element
    //         addOption(convertFromEl, base);
    //         addedFromCurrencies.push(base);
    //     }
    // }

    allRates.forEach((rate) => {
        if (!addedFromCurrencies.includes(rate.base)) {
            // Add the elements to the first section element
            addOption(convertFromEl, rate.base);
            addedFromCurrencies.push(rate.base);
        }
    });

    // Dynamically adds currencies to the second drop-down list depending on which currency selected in the first drop-down list
    convertFromEl.addEventListener("change", () => {
        const selectedCurrency = convertFromEl.value;

        convertToEl.innerHTML = "";
        addOption(convertToEl, "Select Currency");

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
    });
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
        currencyTo === "Select Currency" ||
        isNaN(amount) ||
        amount <= 0
    ) {
        resultMessageEl.innerText = "Please specify valid data for conversion";
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
                rateItem.textContent = `${currency}: ${rateObject.rates[
                    currency
                ].toFixed(2)}`;
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
    const filteredRates = allRates.filter((rateObject) => {
        if (rateObject.base.toLowerCase().includes(query)) {
            return true;
        }
    });
    updateGrid(filteredRates);
}

getDataFromApi();
showInfoMarket();

addRateEl.addEventListener("click", addNewRate);
convertEl.addEventListener("click", convertCurrency);
searchInput.addEventListener("keyup", searchFunction);
