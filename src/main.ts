import './scss/styles.scss';
import { ProductCatalog } from './components/Models/ProductCatalog.ts';
import { ShoppingCart } from './components/Models/ShoppingCart.ts';
import { Customer } from './components/Models/Customer.ts';
import { ProductApi } from './components/Models/ProductApi.ts';
import { API_URL } from './utils/constants.ts';
import { EventEmitter } from './components/base/Events.ts';
import {
  Header,
  Gallery,
  Modal,
  CatalogCard,
  PreviewCard,
  Basket,
  BasketItemCard,
  OrderForm,
  ContactsForm,
  Success,
} from './components/View';
import { cloneTemplate, ensureElement } from './utils/utils.ts';

// Единый брокер событий для всего приложения
const events = new EventEmitter();

// Модели данных с внедрением общего брокера
const productCatalogModel = new ProductCatalog(events);
const shoppingCartModel = new ShoppingCart(events);
const customerModel = new Customer(events);

// Представления
const header = new Header(events, ensureElement<HTMLElement>('.header'));
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const modal = new Modal(events, ensureElement<HTMLElement>('#modal-container'));

// Шаблоны
const tplCatalog = ensureElement<HTMLTemplateElement>('#card-catalog');
const tplPreview = ensureElement<HTMLTemplateElement>('#card-preview');
const tplBasket = ensureElement<HTMLTemplateElement>('#basket');
const tplBasketItem = ensureElement<HTMLTemplateElement>('#card-basket');
const tplOrder = ensureElement<HTMLTemplateElement>('#order');
const tplContacts = ensureElement<HTMLTemplateElement>('#contacts');
const tplSuccess = ensureElement<HTMLTemplateElement>('#success');

// API
const productApi = new ProductApi(API_URL);

// Текущие инстансы отображаемых во всплывающем окне форм/корзины
let basketView: Basket | null = null;
let orderForm: OrderForm | null = null;
let contactsForm: ContactsForm | null = null;
let previewCard: PreviewCard | null = null;

// Инициализация счётчика корзины
header.setCounter(shoppingCartModel.getTotalItemsCount());

// Загрузка каталога с сервера и сохранение в модель (только данные)
productApi
  .getProducts()
  .then(({ items }) => productCatalogModel.setItems(items))
  .catch((error) => console.error('Ошибка при получении товаров с сервера:', error));

// ===== Обработчики событий от МОДЕЛЕЙ =====

// Изменение каталога товаров -> рендер списка в галерее
events.on<{ items: ReturnType<typeof productCatalogModel.getItems> }>('items:changed', ({ items }) => {
  const cards = items.map((item) => {
    const card = new CatalogCard(events, cloneTemplate<HTMLElement>(tplCatalog));
    return card.render({
      id: item.id,
      title: item.title,
      image: item.image,
      price: item.price,
      category: item.category,
    });
  });
  gallery.setCatalog(cards);
});

// Изменение содержимого корзины -> обновить счётчик и, если корзина открыта, её содержимое
events.on<{ items: ReturnType<typeof shoppingCartModel.getItems> }>('cart:changed', () => {
  header.setCounter(shoppingCartModel.getTotalItemsCount());
  // если корзина открыта, обновим её содержимое
  if (basketView) {
    const items = shoppingCartModel.getItems();
    const basketItemNodes = items.map((item, index) => {
      const node = new BasketItemCard(events, cloneTemplate<HTMLElement>(tplBasketItem));
      const el = node.render({
        id: item.id,
        title: item.title,
        image: item.image,
        price: item.price,
        category: item.category,
      });
      // индекс зададим отдельным сеттером
      (node as unknown as { index: number }).index = index + 1;
      return el;
    });
    basketView.setItems(basketItemNodes);
    basketView.setTotal(shoppingCartModel.getTotalPrice());
    basketView.setSubmitDisabled(items.length === 0);
  }
});

// Изменение данных покупателя (в данной реализации валидируем при изменении форм)
events.on('customer:changed', () => {
  // в этом месте можно было бы синхронизировать формы, если открыты
});

// ===== Обработчики событий от ПРЕДСТАВЛЕНИЙ =====

// Открыть превью карточки
events.on<{ id: string }>('card:open', ({ id }) => {
  const item = productCatalogModel.getItem(id);
  if (!item) return;
  previewCard = new PreviewCard(events, cloneTemplate<HTMLElement>(tplPreview));
  previewCard.render({
    id: item.id,
    title: item.title,
    image: item.image,
    price: item.price,
    category: item.category,
  });
  // выставляем состояние кнопки в зависимости от наличия в корзине
  (previewCard as unknown as { inCartState: boolean }).inCartState = shoppingCartModel.contains(id);
  modal.open(previewCard.render());
});

// Добавить товар в корзину
events.on<{ id: string }>('card:add', ({ id }) => {
  const item = productCatalogModel.getItem(id);
  if (!item) return;
  if (!shoppingCartModel.contains(id)) {
    shoppingCartModel.addItem(item);
  }
  if (previewCard && (previewCard as unknown as { container: HTMLElement }).container.dataset.id === id) {
    (previewCard as unknown as { inCartState: boolean }).inCartState = true;
  }
});

// Удалить товар из корзины
events.on<{ id: string }>('card:remove', ({ id }) => {
  if (shoppingCartModel.contains(id)) {
    shoppingCartModel.removeItem(id);
  }
  if (previewCard && (previewCard as unknown as { container: HTMLElement }).container.dataset.id === id) {
    (previewCard as unknown as { inCartState: boolean }).inCartState = false;
  }
});

// Открыть корзину
events.on('basket:open', () => {
  basketView = new Basket(events, cloneTemplate<HTMLElement>(tplBasket));
  const items = shoppingCartModel.getItems();
  const basketItemNodes = items.map((item, index) => {
    const node = new BasketItemCard(events, cloneTemplate<HTMLElement>(tplBasketItem));
    const el = node.render({
      id: item.id,
      title: item.title,
      image: item.image,
      price: item.price,
      category: item.category,
    });
    (node as unknown as { index: number }).index = index + 1;
    return el;
  });
  basketView.setItems(basketItemNodes);
  basketView.setTotal(shoppingCartModel.getTotalPrice());
  basketView.setSubmitDisabled(items.length === 0);
  modal.open(basketView.render());
});

// Начать оформление заказа -> форма выбора оплаты и адреса
events.on('basket:order', () => {
  orderForm = new OrderForm(events, cloneTemplate<HTMLElement>(tplOrder));
  orderForm.setValid(false);
  modal.setContent(orderForm.render());
});

// Выбор способа оплаты
events.on<{ payment: string }>('payment:select', ({ payment }) => {
  customerModel.setData({ payment: payment as any });
  if (orderForm) {
    const errors = customerModel.validateData();
    const isValid = !errors.address && !errors.payment;
    orderForm.setErrors(isValid ? '' : (errors.address || errors.payment || ''));
    orderForm.setValid(isValid);
  }
});

// Изменения в формах -> валидация и управление submit
events.on<{ form: string; value: Record<string, unknown> }>('form:change', ({ form, value }) => {
  if (form === 'order') {
    customerModel.setData({
      address: String(value.address || ''),
      // payment меняется отдельным событием payment:select
    });
    const errors = customerModel.validateData();
    const isValid = !errors.address && !errors.payment;
    if (orderForm) {
      orderForm.setErrors(isValid ? '' : (errors.address || errors.payment || ''));
      orderForm.setValid(isValid);
    }
  }
  if (form === 'contacts') {
    customerModel.setData({
      email: String(value.email || ''),
      phone: String(value.phone || ''),
    });
    const errors = customerModel.validateData();
    const isValid = !errors.email && !errors.phone;
    if (contactsForm) {
      contactsForm.setErrors(isValid ? '' : (errors.email || errors.phone || ''));
      contactsForm.setValid(isValid);
    }
  }
});

// Сабмит форм
events.on<{ form: string; value: Record<string, unknown> }>('form:submit', ({ form }) => {
  if (form === 'order') {
    contactsForm = new ContactsForm(events, cloneTemplate<HTMLElement>(tplContacts));
    contactsForm.setValid(false);
    modal.setContent(contactsForm.render());
  }
  if (form === 'contacts') {
    // Отправка заказа
    const orderRequest = {
      ...customerModel.getData(),
      total: shoppingCartModel.getTotalPrice(),
      items: shoppingCartModel.getItems().map((i) => i.id),
    };
    productApi
      .postOrder(orderRequest)
      .then(({ total }) => {
        const success = new Success(events, cloneTemplate<HTMLElement>(tplSuccess));
        success.render({ total });
        modal.setContent(success.render());
        shoppingCartModel.clear();
        customerModel.clear();
        // очистим ссылки на временные представления
        basketView = null;
        orderForm = null;
        contactsForm = null;
      })
      .catch((err) => console.error('Ошибка при оформлении заказа:', err));
  }
});

// Закрытие экрана успеха -> закрыть модалку и вернуться к каталогу
events.on('success:close', () => {
  modal.close();
  basketView = null;
  orderForm = null;
  contactsForm = null;
});