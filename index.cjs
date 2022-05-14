process.env.NTBA_FIX_319 = 1;

var express = require('express');
var app = express();
var menu = require('./menu.cjs');
var botButtons = require('./buttons.cjs');

const TOKEN_TEST = '5185062504:AAE63XTQpe6Ib-DQ7bavI3zeThI8zTykEHM';
const TOKEN_AERO = '5396401897:AAHdIGqwHrjFp4K3LRPtFQxB4VaJa7bAsUk';

const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(TOKEN_TEST, { polling: true });
const PORT = process.env.PORT || 3000;

var http = require('http'); //importing http

function startKeepAlive() {
    setInterval(function() {
        var options = {
            host: 'http://coolout-crm-aerodrom.herokuapp.com',
            port: 80,
            path: '/'
        };
        http.get(options, function(res) {
            res.on('data', function(chunk) {
                try {
                    console.log("HEROKU RESPONSE: " + chunk);
                } catch (err) {
                    console.log(err.message);
                }
            });
        }).on('error', function(err) {
            console.log("Error: " + err.message);
        });
    }, 20 * 60 * 1000);
}

app.listen(PORT, () => {
    startKeepAlive();
    console.log(`Our app is running on port ${PORT}`);
});

var isShiftClosed = true;
var category;
var finalReceipt = [];
var paymentInCash = [];
var withoutCashPayment = [];

bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    var title = "";
    var buttons = [];

    switch (msg.text) {
        case '/start':
            category = 1;
            if (isShiftClosed) {
                title = 'Доброе утро. Открыть смену? \uD83D\uDE0A';
                buttons.push('Открыть');
            }
            break;
        case 'Открыть':
        case 'В главное меню':
            if (msg.text === 'В главное меню') {
                title = 'Очистил предыдущий чек';
                showOpenButtons(buttons);
            } else {
                category = 2;
                title = 'Смена открыта: ' + new Date().toLocaleString("en-US", { timeZone: "Europe/Moscow" }).slice(0, -2) + '\nХороших продаж \uD83D\uDE09';
                isShiftClosed = false;
                showOpenButtons(buttons);
            }
            break;
        case 'Закрыть смену':
        case 'Да':
        case 'Нет':
            if (msg.text === 'Закрыть смену') {
                title = 'Хочешь закрыть смену?'
                for (var i = 0; i < botButtons.yesno.length; i++) {
                    buttons.push(botButtons.yesno[i]);
                }
            }
            if (msg.text === 'Да') {
                isShiftClosed = true;
                title = 'Смена закрыта ' + new Date().toLocaleString("en-US", { timeZone: "Europe/Moscow" }).slice(0, -2) + '\nПосмотри сколько чеков \uD83D\uDE0D';
                let generalSum = 0;
                for (let i = 0; i < paymentInCash.length; i++) {
                    title += "\n\nЧек №" + (i + 1) + ":\n";
                    let receiptSum = 0;
                    for (let j = 0; j < paymentInCash[i].length; j++) {
                        title += paymentInCash[i][j].name + " - " + paymentInCash[i][j].price + "\n";
                        receiptSum += paymentInCash[i][j].price;
                    }
                    title += "Итог по чеку: " + receiptSum;
                    generalSum += receiptSum;
                }
                title += "\n\nВыручка наличными: " + generalSum;
                title += "\n\n-----------------------------------";

                let generalSum1 = 0;
                for (let i = 0; i < withoutCashPayment.length; i++) {
                    title += "\n\nЧек №" + (i + 1) + ":\n";
                    let receiptSum1 = 0;
                    for (let j = 0; j < withoutCashPayment[i].length; j++) {
                        title += withoutCashPayment[i][j].name + " - " + withoutCashPayment[i][j].price + "\n";
                        receiptSum1 += withoutCashPayment[i][j].price;
                    }
                    title += "Итог по чеку: " + receiptSum1;
                    generalSum1 += receiptSum1;
                }
                title += "\n\nВыручка по карте: " + generalSum1;
                title += "\n\n-----------------------------------";
                title += "\n\nОбщий итог: " + (generalSum + generalSum1);
                
                isShiftClosed = true;
                buttons.push("/start");
                paymentInCash = [];
                withoutCashPayment = [];
                finalReceipt = [];


                //1052353083 - My id
                //521483514 - Maksim id
                bot.sendMessage(521483514, title); // send reports to Maksim
            }


            if (msg.text === 'Нет') {
                title = 'Смену не закрыл. Не переживай \uD83D\uDE22';
                showOpenButtons(buttons);
            }
            break;
        case 'Новый чек':
        case 'В меню':
            if (msg.text === "Новый чек") {
                finalReceipt = [];
                title = 'Открыл новый чек. Добавляй в него побольше \uD83D\uDE05';
            } else {
                title = showFinalReceipt(title);
                category = 3;
            }

            for (var i = 0; i < botButtons.newOrder.length; i++) {
                buttons.push(botButtons.newOrder[i]);
            }
            break;
        case 'Отмена':
            title = 'Отмена';

            if (msg.text === 'Отмена') {
                finalReceipt.pop();
            }

            title = showFinalReceipt(title);
            break;
        case 'Кофе':
            category = 4;
            title = 'Кофе';

            for (var i = 0; i < menu.listCoffee.length; i++) {
                buttons.push(menu.listCoffee[i].name + ' ' + menu.listCoffee[i].price);
            }

            showBackButtons(buttons);
            break;
        case 'Горячие напитки':
            category = 5;
            title = 'Горячие напитки';

            for (var i = 0; i < menu.listHotDrinks.length; i++) {
                buttons.push(menu.listHotDrinks[i].name + ' ' + menu.listHotDrinks[i].price);
            }

            showBackButtons(buttons);
            break;
        case 'Холодные напитки':
            category = 6;
            title = 'Холодные напитки';

            for (var i = 0; i < menu.listColdDrinks.length; i++) {
                buttons.push(menu.listColdDrinks[i].name + ' ' + menu.listColdDrinks[i].price);
            }

            showBackButtons(buttons);
            break;
        case 'Десерты':
            category = 7;
            title = 'Десерты';

            for (var i = 0; i < menu.listDeserts.length; i++) {
                buttons.push(menu.listDeserts[i].name + ' ' + menu.listDeserts[i].price);
            }

            showBackButtons(buttons);
            break;
        case 'Еда':
            category = 8;
            title = 'Еда';

            for (var i = 0; i < menu.listFood.length; i++) {
                buttons.push(menu.listFood[i].name + ' ' + menu.listFood[i].price);
            }

            showBackButtons(buttons);
            break;
        case 'Выпечка':
            category = 9
            title = 'Выпечка';

            for (var i = 0; i < menu.listBakery.length; i++) {
                buttons.push(menu.listBakery[i].name + ' ' + menu.listBakery[i].price);
            }

            showBackButtons(buttons);
            break;
        case 'Батончики':
            category = 10;
            title = 'Батончики';

            for (var i = 0; i < menu.listBars.length; i++) {
                buttons.push(menu.listBars[i].name + ' ' + menu.listBars[i].price);
            }

            showBackButtons(buttons);
            break;
        case 'Посмотреть статистику':
            title = 'Посмотри сколько чеков \uD83D\uDE0D'
            let generalSum = 0;
            let generalSum1 = 0;
            
            for (let i = 0; i < paymentInCash.length; i++) {
                title += "\n\nЧек №" + (i + 1) + ":\n";
                let receiptSum = 0;
                for (let j = 0; j < paymentInCash[i].length; j++) {
                    title += paymentInCash[i][j].name + " - " + paymentInCash[i][j].price + "\n";
                    receiptSum += paymentInCash[i][j].price;
                }
                title += "Итог по чеку: " + receiptSum;
                generalSum += receiptSum;
            }
            title += "\n\nВыручка наличными: " + generalSum;
            
            title += "\n\n-----------------------------------";
            for (let i = 0; i < withoutCashPayment.length; i++) {
                title += "\n\nЧек №" + (i + 1) + ":\n";
                let receiptSum1 = 0;
                for (let j = 0; j < withoutCashPayment[i].length; j++) {
                    title += withoutCashPayment[i][j].name + " - " + withoutCashPayment[i][j].price + "\n";
                    receiptSum1 += withoutCashPayment[i][j].price;
                }
                title += "Итог по чеку: " + receiptSum1;
                generalSum1 += receiptSum1;
            }
            title += "\n\nВыручка по карте: " + generalSum1;
            title += "\n\n-----------------------------------";
            title += "\n\nОбщий итог: " + (generalSum + generalSum1);
            break;
        case 'Закрыть чек':
            if (finalReceipt.length === 0) {
                title = 'Нельзя закрыть пустой чек!'

            } else {
                title = "Какой способ оплаты?";

                buttons.push("Наличными", "Без. нал");
            }    

        break;
        case "Наличными":
        case "Без. нал":
            if (msg.text === "Наличными") {
                paymentInCash.push(finalReceipt);
                finalReceipt = [];
                title = "Закрыл чек. Наличными. Ты молодец \uD83D\uDE0E";

                for (let i = 0; i < botButtons.open.length; i++) {
                    buttons.push(botButtons.open[i]);
                }
            } if (msg.text === "Без. нал") {
                withoutCashPayment.push(finalReceipt);
                finalReceipt = [];
                title = "Закрыл чек. По карте. Ты молодец \uD83D\uDE0E";
                
                for (let i = 0; i < botButtons.open.length; i++) {
                    buttons.push(botButtons.open[i]);
                }
            }

            break;
        default:
            var categoryElement = {};
            if (category === 4) {
                categoryElement = menu.listCoffee.find(e => (e.name + " " + e.price) === msg.text);
            } else if (category === 5) {
                categoryElement = menu.listHotDrinks.find(e => (e.name + " " + e.price) === msg.text);
            } else if (category === 6) {
                categoryElement = menu.listColdDrinks.find(e => (e.name + " " + e.price) === msg.text);
            } else if (category === 7) {
                categoryElement = menu.listDeserts.find(e => (e.name + " " + e.price) === msg.text);
            } else if (category === 8) {
                categoryElement = menu.listFood.find(e => (e.name + " " + e.price) === msg.text);
            } else if (category === 9) {
                categoryElement = menu.listBakery.find(e => (e.name + " " + e.price) === msg.text);
            } else if (category === 10) {
                categoryElement = menu.listBars.find(e => (e.name + " " + e.price) === msg.text);
            }

            if (categoryElement !== undefined) {
                finalReceipt.push(categoryElement);

                title = showFinalReceipt(title);
            }
            break;
    }
    send(chatId, title, buttons);
});

function send(chatId, title, buttons) {
    if (title !== '') {
        bot.sendMessage(chatId, title, {
            reply_markup: {
                keyboard: sliceIntoChunks(buttons, 2)
            }
        });
    }
}

function sliceIntoChunks(arr, chunkSize) {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        res.push(chunk);
    }
    return res;
}

function showOpenButtons(buttons) {
    for (var i = 0; i < botButtons.open.length; i++) {
        buttons.push(botButtons.open[i]);
    }
}

function showBackButtons(buttons) {
    for (var i = 0; i < botButtons.backOrderMenu.length; i++) {
        buttons.push(botButtons.backOrderMenu[i]);
    }
}

function showFinalReceipt(title) {
    title = "Итоговый чек:\n";
    var sum = 0;
    for (var i = 0; i < finalReceipt.length; i++) {
        title += "\uD83D\uDD38" + finalReceipt[i].name + " - " + finalReceipt[i].price + "\n";
        sum += finalReceipt[i].price;
    }
    title += "\nИтог: " + sum + "\nДавай ещё \uD83D\uDE08";
    return title;
}