module.exports = { testFunc };

function testFunc() {
    var yesNo = [
        { name: 'Да' },
        { name: 'Нет' }
    ];

    var openShift = [
        { name: 'Открыть' }
    ];

    var backOrderMenu = [
        { name: 'В меню' },
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
}