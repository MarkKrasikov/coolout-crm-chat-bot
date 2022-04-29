var menu = require('./menu.cjs');
var botButtons = require('./buttons.cjs');

const TelegramBot = require('node-telegram-bot-api'); // подключаем node-telegram-bot-api
const token = '5359120855:AAEhADdpsIOoOV18tj4sNU4q3O6cZi45wbE'; // тут токен кторый мы получили от botFather
const bot = new TelegramBot(token, { polling: true });

var isShiftClosed = true;
var category;
var finalReceipt = [];
var totalReceipts = [];

bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    var title = "";
    var buttons = [];

    switch (msg.text) {
        case '/start':
            category = 1;
            if (isShiftClosed) {
                title = 'Открываю смену?';
                buttons.push('Открыть');
            }
            break;
        case 'Открыть':
        case 'В главное меню':
            category = 2;
            title = 'Открыть';
            isShiftClosed = false;
            showOpenButtons(buttons);
            break;
        case 'Закрыть смену':
        case 'Да':
        case 'Нет':
            if (msg.text === 'Закрыть смену') {
                title = 'Закрыть смену?'
                for (var i = 0; i < botButtons.yesno.length; i++) {
                    buttons.push(botButtons.yesno[i]);
                }
            }

            if (msg.text === 'Да') {
                isShiftClosed = true;
                title = 'Смена закрыта.\nСтатистика за смену:';
                let generalSum = 0;
                for (let i = 0; i < totalReceipts.length; i++) {
                    title += "\n\nЧек №" + (i + 1) + ":\n";
                    let receiptSum = 0;
                    for (let j = 0; j < totalReceipts[i].length; j++) {
                        title += totalReceipts[i][j].name + " - " + totalReceipts[i][j].price + "\n";
                        receiptSum += totalReceipts[i][j].price;
                    }
                    title += "Итог по чеку: " + receiptSum;
                    generalSum += receiptSum;
                }
                title += "\n\nИтог за смену: " + generalSum;
                isShiftClosed = true;
                buttons.push("/start");
            }

            if (msg.text === 'Нет') {
                title = 'Отмена \nСмена не закрыта';
                showOpenButtons(buttons);
            }
            break;
        case 'Новый заказ':
        case 'В меню':
            if (msg.text === "Новый заказ") {
                finalReceipt = [];
            }

            category = 3;
            title = 'Новый заказ';
            for (var i = 0; i < newOrder.length; i++) {
                buttons.push(newOrder[i].name);
            }
            break;
        case 'Отмена':
            title = 'Отмена';

            if (msg.text === 'Отмена') {
                finalReceipt.pop();
            }

            title = "Итоговый чек:\n";
            var sum = 0;
            for (var i = 0; i < finalReceipt.length; i++) {
                title += finalReceipt[i].name + " - " + finalReceipt[i].price + "\n";
                sum += finalReceipt[i].price;
            }
            title += "\nИтог: " + sum;
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

            for (var i = 0; i < listHotDrinks.length; i++) {
                buttons.push(listHotDrinks[i].name + ' ' + listHotDrinks[i].price);
            }

            showBackButtons(buttons);
            break;
        case 'Холодные напитки':
            category = 6;
            title = 'Холодные напитки';

            for (var i = 0; i < listColdDrinks.length; i++) {
                buttons.push(listColdDrinks[i].name + ' ' + listColdDrinks[i].price);
            }

            showBackButtons(buttons);
            break;
        case 'Десерты':
            category = 7;
            title = 'Десерты';

            for (var i = 0; i < listDeserts.length; i++) {
                buttons.push(listDeserts[i].name + ' ' + listDeserts[i].price);
            }

            showBackButtons(buttons);
            break;
        case 'Еда':
            category = 8;
            title = 'Еда';

            for (var i = 0; i < listFood.length; i++) {
                buttons.push(listFood[i].name + ' ' + listFood[i].price);
            }

            showBackButtons(buttons);
            break;
        case 'Выпечка':
            category = 9
            title = 'Выпечка';

            for (var i = 0; i < listBakery.length; i++) {
                buttons.push(listBakery[i].name + ' ' + listBakery[i].price);
            }

            showBackButtons(buttons);
            break;
        case 'Батончики':
            category = 10;
            title = 'Батончики';

            for (var i = 0; i < listBars.length; i++) {
                buttons.push(listBars[i].name + ' ' + listBars[i].price);
            }

            showBackButtons(buttons);
            break;
        case 'Посмотреть статистику':
            title = 'Статистика за смену:'
            let generalSum = 0;
            for (let i = 0; i < totalReceipts.length; i++) {
                title += "\n\nЧек №" + (i + 1) + ":\n";
                let receiptSum = 0;
                for (let j = 0; j < totalReceipts[i].length; j++) {
                    title += totalReceipts[i][j].name + " - " + totalReceipts[i][j].price + "\n";
                    receiptSum += totalReceipts[i][j].price;
                }
                title += "Итог по чеку: " + receiptSum;
                generalSum += receiptSum;
            }
            title += "\n\nИтог за смену: " + generalSum;
            break;
        case 'Закрыть чек':
            totalReceipts.push(finalReceipt);
            finalReceipt = [];
            title = "Новый заказ";
            for (let i = 0; i < open.length; i++) {
                buttons.push(open[i].name);
            }
            break;
        default:
            var categoryElement = {};
            if (category === 4) {
                categoryElement = listCoffee.find(e => (e.name + " " + e.price) === msg.text);
            } else if (category === 5) {
                categoryElement = listHotDrinks.find(e => (e.name + " " + e.price) === msg.text);
            } else if (category === 6) {
                categoryElement = listColdDrinks.find(e => (e.name + " " + e.price) === msg.text);
            } else if (category === 7) {
                categoryElement = listDeserts.find(e => (e.name + " " + e.price) === msg.text);
            } else if (category === 8) {
                categoryElement = listFood.find(e => (e.name + " " + e.price) === msg.text);
            } else if (category === 9) {
                categoryElement = listBakery.find(e => (e.name + " " + e.price) === msg.text);
            } else if (category === 10) {
                categoryElement = listBars.find(e => (e.name + " " + e.price) === msg.text);
            }

            if (categoryElement !== undefined) {
                console.log("В чек добавляю " + categoryElement.name + " с ценой " + categoryElement.price);
                finalReceipt.push(categoryElement);

                title = "Итоговый чек:\n";
                let finalSum = 0;
                for (let i = 0; i < finalReceipt.length; i++) {
                    title += finalReceipt[i].name + " - " + finalReceipt[i].price + "\n";
                    finalSum += finalReceipt[i].price;
                }
                title += "\nИтог: " + finalSum;
            }
            break;
    }
    send(chatId, title, buttons);
});

function send(chatId, title, buttons) {
    if (title !== "") {
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