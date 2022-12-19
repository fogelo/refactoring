const plays = {
    hamlet: {name: "Hamlet", type: "tragedy"},
    "as-like": {name: "As You Like It", type: "comedy"},
    othello: {name: "Othello", type: "tragedy"},
}

const invoices = [
    {
        "customer": "BigCo",
        "performances": [
            {
                "playlD": "hamlet",
                "audience": 55
            },
            {
                "playlD": "as-like",
                "audience": 35
            },
            {
                "playlD": "othello",
                "audience": 40
            }
        ]
    }
]

function statement(invoice, plays) {
    return renderPlainText(createStatementData(invoice, plays))
}

function createStatementData(invoice) {
    const statementData = {}
    statementData.customer = invoice.customer
    statementData.performances = invoice.performances.map(enrichPerformance)
    statementData.totalAmount = totalAmount(statementData)
    statementData.totalVolumeCredits = totalVolumeCredits(statementData)
    return statementData
}

function enrichPerformance(aPerformance) {
    const result = Object.assign({}, aPerformance);
    result.play = playFor(result)
    result.amount = amountFor(result)
    result.volumeCredits = volumeCreditsFor(result)

    return result;
}

function renderPlainText(data, plays) {
    let result = `Statement for ${data.customer}\n`;
    for (let perf of data.performances) {
        // Вывод строки счета
        result += ` ${perf.play.name}: ${usd(perf.amount / 100)}`;
        result += ` (${perf.audience} seats)\n`;
    }


    result += `Amount owed is ${usd(data.totalAmount / 100)}\n`;
    result += `You earned ${data.totalVolumeCredits} credits\n`;
    return result;
}

function totalAmount(data) {
    return data.performances.reduce((total, p) => total + p.amount, 0);
}

function totalVolumeCredits(data) {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
}

function usd(aNumber) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2
    }).format(aNumber);
}

function volumeCreditsFor(aPerformance) {
    let result = 0;

    // Добавление бонусов
    result += Math.max(aPerformance.audience - 30, 0);
    // Дополнительный бонус за каждые 10 комедий
    if ("comedy" === aPerformance.play.type) result += Math.floor(
        aPerformance.audience / 5);
    return result
}

function playFor(aPerformance) {
    return plays[aPerformance.playlD]
}

function amountFor(aPerformance) {
    let result = 0
    switch (playFor(aPerformance).type) {
        case "tragedy":
            result = 40000;
            if (aPerformance.audience > 30) {
                result += 1000 * (aPerformance.audience - 30);
            }
            break;
        case "comedy":
            result = 30000;
            if (aPerformance.audience > 20) {
                result += 10000 + 500 * (aPerformance.audience - 20);
            }
            result += 300 * aPerformance.audience;
            break;
        default:
            throw new Error(`unknown type: ${aPerformance.play.type}`);
    }
    return result
}

console.log(statement(invoices[0], plays))
