// node index.js

const TelegramBot = require('node-telegram-bot-api'); // подключаем node-telegram-bot-api

const token = '5359120855:AAEhADdpsIOoOV18tj4sNU4q3O6cZi45wbE'; // тут токен кторый мы получили от botFather

// включаем самого бота
const bot = new TelegramBot(token, { polling: true });

var isShiftClosed = true;
var category; // Отвечает за номер выбранной категории

//Списки отвечающие за пункты меню
var yesNo = [
    { name: 'Да' },
    { name: 'Нет' }
];

var openShift = [
    { name: 'Открыть' }
];

var backOrderMenu = [
    { name: 'В меню заказа' },
    { name: 'Отмена' }
];

var open = [
    { name: 'Новый заказ' },
    { name: 'Посмотреть статистику' },
    { name: 'Закрыть смену' }
];

var newOrder = [
    { name: 'Кофе' },
    { name: 'Горячие напитки' },
    { name: 'Холодные напитки' },
    { name: 'Десерты' },
    { name: 'Еда' },
    { name: 'Выпечка' },
    { name: 'Батончики' },
    { name: 'Закрыть чек' },
    { name: 'В главное меню' }
];


// Списки отвечающие за пункты таваров
var listCoffee = [
    { name: 'Американо', price: 4 },
    { name: 'Маленький капучино', price: 4 },

];

var listHotDrinks = [
    { name: 'Чаек', price: 4 },
    { name: 'Какавчик', price: 5 },

];

var listColdDrinks = [
    { name: 'Коктейльчик', price: 5.5 },
    { name: 'Кола', price: 5, },

];

var listDeserts = [
    { name: 'Медовик', price: 4.5 },
    { name: 'Красный бархат', price: 5 },

];

var listFood = [
    { name: 'Яишенка', price: 5 },
    { name: 'Сэндвич', price: 6 },

];

var listBakery = [
    { name: 'Крендель', price: 2.8 },
    { name: 'Берлинер', price: 3 },

];

var listBars = [
    { name: 'Шокожопка', price: 1.5 },
    { name: 'Крокант', price: 0.5 },

];


// Списки отвечающие за хранение выбранных позиций
var finalReceipt = [];
var statistic = [];


bot.on('message', (msg) => {
    console.log(msg);
    const chatId = msg.chat.id;

    var title = "";
    var buttons = [];

    switch (msg.text) {
        case '/start':
            category = 1;
            if (isShiftClosed) {
                bot.sendMessage(chatId, 'Открываю смену?', {
                    reply_markup: {
                        keyboard: [
                            ['Открыть']
                        ]
                    }
                });
            }
            break;
        case 'Открыть':
        case 'В главное меню':
            category = 2;
            title = 'Открыть';
            isShiftClosed = false;

            for (var i = 0; i < open.length; i++) {
                buttons.push(open[i].name);
            }
            break;

        case 'Закрыть смену':
        case 'Да':
        case 'Нет':
            if (msg.text === 'Закрыть смену') {
                title = 'Закрыть смену?'
                for (var i = 0; i < yesNo.length; i++) {
                    buttons.push(yesNo[i].name);
                }
            }

            if (msg.text === 'Да') {
                title = 'Смена закрыта \nСтатистика за смену\n';

                var sum = 0;
                for (var i = 0; i < statistic.length; i++) {
                    title += statistic[i].name + " - " + statistic[i].price + "\n";
                    sum += statistic[i].price;
                }
                title += "\nИтог за смену: " + sum;

                for (var i = 0; i < openShift.length; i++) {
                    buttons.push(openShift[i].name);
                }

                statistic = [];
                isShiftClosed = true
            }

            if (msg.text === 'Нет') {
                title = 'Отмена \nСмена не закрыта';

                for (var i = 0; i < open.length; i++) {
                    buttons.push(open[i].name);
                }
            }
            break;

        case 'Посмотреть статистику':
            title = 'Статистика за смену'

            var sum = 0;
            for (var i = 0; i < statistic.length; i++) {
                title += statistic[i].name + " - " + statistic[i].price + "\n";
                sum += statistic[i].price;
            }
            title += "\nИтог за смену: " + sum;
            break;

        case 'Закрыть чек':
            title = 'Чек закрыт'
            statistic.push.apply(statistic, finalReceipt);
            finalReceipt = [];

            for (var i = 0; i < open.length; i++) {
                buttons.push(open[i].name);
            }
            break;

        case 'Новый заказ':
        case 'В меню заказа':

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
            listName = listCoffee;

            for (var i = 0; i < listCoffee.length; i++) {
                buttons.push(listCoffee[i].name + ' ' + listCoffee[i].price);
            }

            for (var i = 0; i < backOrderMenu.length; i++) {
                buttons.push(backOrderMenu[i].name);
            }
            break;
        case 'Горячие напитки':
            category = 5;
            title = 'Горячие напитки';

            for (var i = 0; i < listHotDrinks.length; i++) {
                buttons.push(listHotDrinks[i].name + ' ' + listHotDrinks[i].price);
            }

            for (var i = 0; i < backOrderMenu.length; i++) {
                buttons.push(backOrderMenu[i].name);
            }
            break;
        case 'Холодные напитки':
            category = 6;
            title = 'Холодные напитки';

            for (var i = 0; i < listColdDrinks.length; i++) {
                buttons.push(listColdDrinks[i].name + ' ' + listColdDrinks[i].price);
            }

            for (var i = 0; i < backOrderMenu.length; i++) {
                buttons.push(backOrderMenu[i].name);
            }
            break;
        case 'Десерты':
            category = 7;
            title = 'Десерты';

            for (var i = 0; i < listDeserts.length; i++) {
                buttons.push(listDeserts[i].name + ' ' + listDeserts[i].price);
            }

            for (var i = 0; i < backOrderMenu.length; i++) {
                buttons.push(backOrderMenu[i].name);
            }
            break;
        case 'Еда':
            category = 8;
            title = 'Еда';

            for (var i = 0; i < listFood.length; i++) {
                buttons.push(listFood[i].name + ' ' + listFood[i].price);
            }

            for (var i = 0; i < backOrderMenu.length; i++) {
                buttons.push(backOrderMenu[i].name);
            }
            break;
        case 'Выпечка':
            category = 9
            title = 'Выпечка';

            for (var i = 0; i < listBakery.length; i++) {
                buttons.push(listBakery[i].name + ' ' + listBakery[i].price);
            }

            for (var i = 0; i < backOrderMenu.length; i++) {
                buttons.push(backOrderMenu[i].name);
            }
            break;
        case 'Батончики':
            category = 10;
            title = 'Батончики';

            for (var i = 0; i < listBars.length; i++) {
                buttons.push(listBars[i].name + ' ' + listBars[i].price);
            }

            for (var i = 0; i < backOrderMenu.length; i++) {
                buttons.push(backOrderMenu[i].name);
            }
            break;
        case 'Закрыть чек':
            for (var i = 0; i < finalReceipt.length; i++) {
                statistic.push(finalReceipt[i].name + ' ' + finalReceipt[i].price);
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
                console.log(finalReceipt);

                title = "Итоговый чек:\n";
                var sum = 0;
                for (var i = 0; i < finalReceipt.length; i++) {
                    title += finalReceipt[i].name + " - " + finalReceipt[i].price + "\n";
                    sum += finalReceipt[i].price;
                }
                title += "\nИтог: " + sum;
            }

            if (msg.text === 'Закрыть смену') {
                isShiftClosed = true;
                console.log(isShiftClosed);
            }

            break;

    }

    send(chatId, title, buttons);
});


// Не до конца понимаю как работают эти функции
function send(chatId, title, buttons) {
    console.log(buttons);
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


//TODO
//1.1 Не могу разобраться как вложить массив в массив, для более коректного отображения статистики.
//1.2 Не знаю как реализовать отправку чеков и статистики другому пользователю.

//2. Реализовал кнопку отмена, которая удаляет последний добавленный элемент в список.
//3. Реализовал закрытие смены и просмотр статистики.