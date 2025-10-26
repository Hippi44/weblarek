import './scss/styles.scss';
import { ProductCatalog } from './components/base/Models/ProductCatalog.ts';
import { ShoppingCart } from './components/base/Models/ShoppingCart.ts';
import { Customer } from './components/base/Models/Customer.ts';
import { apiProducts } from './utils/data.ts';

const productCatalogModel = new ProductCatalog();
productCatalogModel.setItems(apiProducts.items);
const shoppingCartModel = new ShoppingCart();
const customerModel = new Customer();

console.log("Массив товаров из каталога: ", productCatalogModel.getItems());
console.log("Корзина: ", shoppingCartModel.getItems());
console.log("Покупатель: ", customerModel.getData());