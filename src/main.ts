import './scss/styles.scss';
import { ProductCatalog } from './components/base/Models/ProductCatalog.ts';
import { ShoppingCart } from './components/base/Models/ShoppingCart.ts';
import { Customer } from './components/base/Models/Customer.ts';
import { apiProducts } from './utils/data.ts';
import { ProductApi } from './components/base/Models/ProductApi.ts';

// Создаем модель каталога товаров и наполняем ее начальными товарами из apiProducts
const productCatalogModel = new ProductCatalog();
productCatalogModel.setItems(apiProducts.items);

// Создаем модель корзины и добавляем в нее первый товар из каталога
const shoppingCartModel = new ShoppingCart();
shoppingCartModel.addItem(apiProducts.items[0]);

// Создаем модель покупателя и задаем тестовые данные покупателя
const customerModel = new Customer();
customerModel.setData({
  email: 'test@test.com',
  phone: '+79999999999',
  address: 'Test address',
});

// Выводим содержимое каталога товаров в консоль
console.log('Массив товаров из каталога: ', productCatalogModel.getItems());

// Выводим содержимое корзины в консоль
console.log('Корзина: ', shoppingCartModel.getItems());

// Выводим данные о покупателе в консоль
console.log('Покупатель: ', customerModel.getData());

// Создаем экземпляр API для работы с сервером
const productApi = new ProductApi(
  'https://larek-api.nomoreparties.co/api/weblarek'
);

// Получаем каталог товаров с сервера
console.log('\n=== Тестирование ProductApi ===');
productApi
  .getProducts()
  .then(products => {
    console.log('Товары полученные с сервера:', products);
    // Сохраняем полученные товары в модель каталога
    productCatalogModel.setItems(products.items);
    console.log('Обновленный каталог товаров:', productCatalogModel.getItems());
    console.log(
      'Количество товаров с сервера:',
      productCatalogModel.getItems().length
    );

    // Тестируем работу с товарами с сервера
    if (products.items.length > 0) {
      const firstProduct = products.items[0];
      console.log('Первый товар с сервера:', firstProduct);
      productCatalogModel.setSelectedCard(firstProduct);
      console.log(
        'Выбранная карточка с сервера:',
        productCatalogModel.getSelectedCard()
      );
    }
  })
  .catch(error => {
    console.error('Ошибка при получении товаров с сервера:', error);
  });
