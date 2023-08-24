const tableBody = document.querySelector(".table-body");
function tableRowGenerator(data) {
    const tableRow = document.createElement("tr");
    Object.keys(data).forEach((information) => {
        if (information === "date")
            return;
        const tableData = document.createElement("td");
        if (information === "value") {
            tableData.innerText = `R$ ${data.value}`;
        }
        else {
            tableData.innerText = data[information];
        }
        tableRow.append(tableData);
    });
    tableBody.appendChild(tableRow);
}
function formatFetchData(infoToFormat) {
    const formattedData = infoToFormat.map((infos) => {
        return {
            nome: infos.Nome,
            email: infos.Email,
            value: infos["Valor (R$)"],
            paymentOption: infos["Forma de Pagamento"],
            status: infos.Status,
            date: infos.Data,
        };
    });
    return formattedData;
}
function getTotalValues(data) {
    const removeEmptyValues = data.filter((data) => data.value !== "-");
    const getTotalValues = removeEmptyValues.reduce((acc, data) => {
        const formatValue = parseFloat(data.value.replace(".", "").replace(",", "."));
        return (acc += formatValue);
    }, 0);
    const totalValueFormattedCurrency = formatTotalValue(getTotalValues);
    setTotalValue(totalValueFormattedCurrency);
    return totalValueFormattedCurrency;
}
function formatTotalValue(totalValue) {
    const total = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(totalValue);
    return total;
}
function setTotalValue(totalToSet) {
    const total = document.querySelector(".total-values");
    total.textContent = totalToSet;
}
function setPaymentOptionsInformations(optionsToSet) {
    const creditCards = document.querySelector(".total-credit-cards");
    const ticketOptions = document.querySelector(".total-tickets");
    const [totalCredits, totalTickets] = optionsToSet;
    creditCards.textContent = String(totalCredits);
    ticketOptions.textContent = String(totalTickets);
}
function getTotalPaymentOptions(data) {
    const getTotalCreditCards = data.filter(({ paymentOption }) => paymentOption === "Cartão de Crédito");
    const getTotalTicket = data.filter(({ paymentOption }) => paymentOption === "Boleto");
    setPaymentOptionsInformations([
        getTotalCreditCards.length,
        getTotalTicket.length,
    ]);
}
function setTransactionsInformations(informations) {
    const paid = document.querySelector(".paid");
    const refused = document.querySelector(".refused");
    const waitingPayment = document.querySelector(".waiting-payment");
    const reversed = document.querySelector(".reversed");
    paid.textContent = informations.allPaid.toString();
    refused.textContent = informations.allRefused.toString();
    waitingPayment.textContent = informations.allStatusPaymentPending.toString();
    reversed.textContent = informations.allReversed.toString();
}
function getAllTransactionsStatus(data) {
    let allStatusPaid = 0;
    let allStatusRefused = 0;
    let allStatusPaymentPending = 0;
    let allStatusReversed = 0;
    for (let i = 0; i <= data.length; i++) {
        if (data[i]?.status === "Paga") {
            allStatusPaid += 1;
        }
        else if (data[i]?.status === "Recusada pela operadora de cartão") {
            allStatusRefused += 1;
        }
        else if (data[i]?.status === "Aguardando pagamento") {
            allStatusPaymentPending += 1;
        }
        else if (data[i]?.status === "Estornada") {
            allStatusReversed += 1;
        }
    }
    const informations = {
        allPaid: allStatusPaid,
        allRefused: allStatusRefused,
        allStatusPaymentPending: allStatusPaymentPending,
        allReversed: allStatusReversed,
    };
    setTransactionsInformations(informations);
}
function setDateWithMoreSelling(day) {
    const moreSelling = document.querySelector(".more-sellings");
    const firstLetter = day.split("");
    const formatFirstLetter = firstLetter.map((letter, idx) => {
        if (idx === 0) {
            return letter.toUpperCase();
        }
        return letter;
    });
    moreSelling.textContent = String(formatFirstLetter).replaceAll(",", "");
}
function getDatesWithMoreSelling(dataWithDates) {
    const daysCount = {};
    dataWithDates.forEach((venda) => {
        const data = venda.date.split(" ")[0];
        if (daysCount[data]) {
            daysCount[data]++;
        }
        else {
            daysCount[data] = 1;
        }
    });
    const getMostOccurenciesDatesNumber = Math.max.apply(Math, Object.values(daysCount).map((dates) => {
        return dates;
    }));
    const getDateThatMostRepeat = Object.keys(daysCount).find((dates) => {
        return daysCount[dates] >= getMostOccurenciesDatesNumber;
    });
    const formattedDate = new Intl.DateTimeFormat("pt-BR", {
        weekday: "long",
    }).format(new Date(getDateThatMostRepeat));
    setDateWithMoreSelling(formattedDate);
}
const main = async () => {
    const getAllData = await fetch("https://api.origamid.dev/json/transacoes.json");
    const transactionsData = await getAllData.json();
    const formattedData = formatFetchData(transactionsData);
    formattedData.forEach((information) => {
        tableRowGenerator(information);
    });
    getDatesWithMoreSelling(formattedData);
    getTotalValues(formattedData);
    getTotalPaymentOptions(formattedData);
    getAllTransactionsStatus(formattedData);
};
main();
export {};
