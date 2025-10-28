import './scss/styles.scss';
import { ProductCatalog } from './components/Models/ProductCatalog.ts';
import { ShoppingCart } from './components/Models/ShoppingCart.ts';
import { Customer } from './components/Models/Customer.ts';
import { apiProducts } from './utils/data.ts';
import { ProductApi } from './components/Models/ProductApi.ts';
import { API_URL } from './utils/constants.ts';

// Создаем модель каталога товаров и наполняем ее начальными товарами из apiProducts
const productCatalogModel = new ProductCatalog();
productCatalogModel.setItems(apiProducts.items);

// Создаем модель корзины и добавляем в нее первый товар из каталога
const shoppingCartModel = new ShoppingCart();
shoppingCartModel.addItem(apiProducts.items[0]);

// Тестируем работу модели корзины
console.log('Массив товаров в корзине:', shoppingCartModel.getItems());
console.log('Удаляем товар из корзины:', shoppingCartModel.removeItem('854cef69-976d-4c2a-a18c-2aa45046c390'));
console.log('Очищаем корзину от всех товаров:', shoppingCartModel.clear());
console.log('Количество товаров:', shoppingCartModel.getTotalItemsCount());
shoppingCartModel.addItem(apiProducts.items[0]);
console.log('Общая стоимость товаров:', shoppingCartModel.getTotalPrice());
console.log('Проверка товара по ID:', shoppingCartModel.contains('854cef69-976d-4c2a-a18c-2aa45046c390'));

// Создаем модель покупателя и задаем тестовые данные покупателя
const customerModel = new Customer();

// Тестируем работу модели покупателя
customerModel.setData({
  email: 'test@test.com',
  phone: '+79999999999',
  address: 'Test address',
});
// Выводим данные покупателя в консоль
console.log('Данные покупателя:', customerModel.getData());

// Выполняем валидацию данных покупателя
const errors = customerModel.validateData();
// Выводим результат валидации в консоль

if (Object.keys(errors).length === 0) {
  console.log('Данные покупателя прошли валидацию');
} else {
  console.log('Данные покупателя невалидны:', errors);
}

// Очищаем данные покупателя
console.log('Очистка данных:', customerModel.clear());

// Создаем экземпляр API для работы с сервером
const productApi = new ProductApi(API_URL);

// Получаем каталог товаров с сервера
console.log('=== Тестирование ProductApi ==='); 
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