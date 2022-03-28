function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

const calculatePrice = (price, isSum) => {
  const elem = document.querySelector('.total-price');
  const lastPrice = parseFloat(elem.innerText);

  const newPrice = isSum ? `${lastPrice + price}` : `${lastPrice - price}`;

  elem.innerText = newPrice;
};

function cartItemClickListener(event) {
  const items = JSON.parse(getSavedCartItems() || '[]');
  const elem = event.target.innerText;
  const sku = elem.substring(elem.indexOf(':') + 1, elem.indexOf('|')).trim();
  const removedItem = items.find((item) => item.sku === sku);
  const newItems = items.length > 1 ? items.filter((item) => item.sku !== removedItem.sku) : [];

  saveCartItems(JSON.stringify(newItems));
  calculatePrice(removedItem.salePrice, false);
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const addItemLocalStorage = (obj) => {
  const savedItems = JSON.parse(getSavedCartItems() || '[]');
  const newItem = { sku: obj.id, name: obj.title, salePrice: obj.price };

  if (savedItems !== null) {
    savedItems.push(newItem);
    saveCartItems(JSON.stringify(savedItems));
  } else {
    saveCartItems(JSON.stringify(newItem));
  }  
};

const addToCart = async (event) => {
  const id = getSkuFromProductItem(event.target.parentNode);
  const obj = await fetchItem(id);

  const item = createCartItemElement({ sku: [obj.id], name: [obj.title], salePrice: [obj.price] });
  const element = document.querySelector('.cart__items');
  element.appendChild(item);

  calculatePrice(obj.price, true);
  addItemLocalStorage(obj);
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const btn = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  btn.onclick = addToCart;
  section.appendChild(btn);

  return section;
}

const showLoad = () => {
  const item = document.querySelector('.items');
  const load = document.createElement('h3');
  load.innerText = 'Carregando...';
  load.setAttribute('class', 'loading');
  item.appendChild(load);
};

const hideLoad = () => {
  const load = document.querySelector('.loading');
  load.style.display = 'none';
};

const showcase = async () => {
  showLoad();

  const obj = await fetchProducts('computador');
  await hideLoad();
  const item = obj.results.map((elem) => (
    {
      sku: elem.id,
      name: elem.title,
      image: elem.thumbnail,
    }
  ));

  item.forEach((elem) => {
    const element = document.querySelector('.items');
    element.appendChild(createProductItemElement(elem));
  });
};

const cleanCart = () => {
  const cartList = document.querySelector('.cart__items');
  cartList.innerHTML = '';
  localStorage.removeItem('cartItems');
  const price = document.querySelector('.total-price');
  price.innerText = 0;
};

const showCart = () => {
  const element = document.getElementsByClassName('cart__items')[0];
  const cart = JSON.parse(getSavedCartItems());

  if (cart !== null) {
    cart.forEach((item) => {
      const { sku, name, salePrice } = item;
      const slv = createCartItemElement({ sku, name, salePrice });
      element.appendChild(slv);
      calculatePrice(salePrice, true);
    });
  }
};

window.onload = () => { 
  showcase();
  showCart();

  const emptyCart = document.querySelector('.empty-cart');
  emptyCart.onclick = cleanCart;
};
