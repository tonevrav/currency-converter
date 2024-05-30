function convertCurrency(event) {
    event.preventDefault();

    const currencyFrom = convertFromEl.value;
    console.log(currencyFrom);
    const currencyTo = convertToEl.value;
    console.log(currencyTo);
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

    const formEl = document.convertForm;
    const resultMessageEl = document.createElement("p");

    resultMessageEl.innerText = `${amount} ${currencyFrom} will be ${result.toFixed(
        2
    )} ${currencyTo}`;
    formEl.appendChild(resultMessageEl);
}
