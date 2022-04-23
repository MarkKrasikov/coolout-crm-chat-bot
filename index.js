// node index.js

const TelegramBot = require('node-telegram-bot-api'); // подключаем node-telegram-bot-api

const token = '5359120855:AAEhADdpsIOoOV18tj4sNU4q3O6cZi45wbE'; // тут токен кторый мы получили от botFather

// включаем самого бота
const bot = new TelegramBot(token, { polling: true });

var isShiftClosed = true;
var category;

var listCoffee = [
    { name: 'Американо', price: 4 },
    { name: 'Маленький капучино', price: 4 }
];

var listHotDrinks = [
    { name: 'Чаек', price: 4 },
    { name: 'Какавчик', price: 5 }
];

var listColdDrinks = [
    { name: 'Коктейльчик', price: 5.5 },
    { name: 'Кола', price: 5 }
];

var listDeserts = [
    { name: 'Медовик', price: 4.5 },
    { name: 'Красный бархат', price: 5 }
];

var listFood = [
    { name: 'Яишенка', price: 5 },
    { name: 'Сэндвич', price: 6 }
];

var listBakery = [
    { name: 'Крендель', price: 2.8 },
    { name: 'Берлинер', price: 3 }
];

var listBars = [
    { name: 'Шокожопка', price: 1.5 },
    { name: 'Крокант', price: 0.5 }
];

var open = [
    { name: 'Новый заказ' }
];

var newOrder = [
    { name: 'Кофе' },
    { name: 'Горячие напитки' },
    { name: 'Холодные напитки' },
    { name: 'Десерты' },
    { name: 'Еда' },
    { name: 'Выпечка' },
    { name: 'Батончики' }
];

var finalReceipt = [];

bot.on('message', (msg) => {
    console.log(msg);
    const chatId = msg.chat.id;

    var title = "";
    var buttons = [];
    var listName;

    switch (msg.text) {
        case '/start':
            category = 1;
            if (isShiftClosed) {
                bot.sendMessage(chatId, 'Открываю смену?', {
                    reply_markup: {
                        keyboard: [
                            ['Открыть', 'Назад']
                        ]
                    }
                });
            } else {
                bot.sendMessage(chatId, 'Смена уже открыта', {
                    reply_markup: {
                        keyboard: [
                            ['Новый заказ', 'Посмотреть статистику'],
                            ['Закрыть смену', 'Test Chapter']
                        ]
                    }
                });
            }
            break;
        case 'Открыть':
            category = 2;
            title = 'Открыть';
            for (var i = 0; i < open.length; i++) {
                buttons.push(open[i].name);
            }
            break;
        case 'Новый заказ':
            category = 3;
            title = 'Новый заказ';
            for (var i = 0; i < newOrder.length; i++) {
                buttons.push(newOrder[i].name);
            }
            break;
        case 'Кофе':
            category = 4;
            title = 'Кофе';
            listName = listCoffee;
            for (var i = 0; i < listCoffee.length; i++) {
                buttons.push(listCoffee[i].name + ' ' + listCoffee[i].price);
            }
            break;
        case 'Горячие напитки':
            category = 5;
            title = 'Горячие напитки';
            for (var i = 0; i < listHotDrinks.length; i++) {
                buttons.push(listHotDrinks[i].name + ' ' + listHotDrinks[i].price);
            }
            break;
        case 'Холодные напитки':
            category = 6;
            title = 'Холодные напитки';
            for (var i = 0; i < listColdDrinks.length; i++) {
                buttons.push(listColdDrinks[i].name + ' ' + listColdDrinks[i].price);
            }
            break;
        case 'Десерты':
            category = 7;
            title = 'Десерты';
            for (var i = 0; i < listDeserts.length; i++) {
                buttons.push(listDeserts[i].name + ' ' + listDeserts[i].price);
            }
            break;
        case 'Еда':
            category = 8;
            title = 'Еда';
            for (var i = 0; i < listFood.length; i++) {
                buttons.push(listFood[i].name + ' ' + listFood[i].price);
            }
            break;
        case 'Выпечка':
            category = 9
            title = 'Выпечка';
            for (var i = 0; i < listBakery.length; i++) {
                buttons.push(listBakery[i].name + ' ' + listBakery[i].price);
            }
            break;
        case 'Батончики':
            category = 10;
            title = 'Батончики';
            for (var i = 0; i < listBars.length; i++) {
                buttons.push(listBars[i].name + ' ' + listBars[i].price);
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
                title = "Добавляю в чек\n" + finalReceipt.name;
            }
            break;

    }

    send(chatId, title, buttons);
});

function send(chatId, title, buttons) {
    console.log(buttons);
    if (title !== "") {
        bot.sendMessage(chatId, title, {
            reply_markup: {
                keyboard: sliceIntoChunks(buttons, 3)
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
//1. Вынести название и кнопки в переменные title и buttons
//2. Функция send() в одном месте
//3. Вынести в списки позиция + цена (listCoffee, listDeserts, listDrinks)
//4. Если ты в какой-либо категории (кофе, напитки), то вывожу значения позиция + цена из списков. И присваиюваю category
//5. Проверяю category, ищу значение из списка
//6. Вывожу найденную позиция и цену на консоль