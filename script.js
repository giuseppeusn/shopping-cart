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
  const elem = document.querySelector('.value');

  let newPrice = 0;
  if (isSum) {
    newPrice = `${parseFloat(elem.innerText) + price}`;
  } else {
    newPrice = `${parseFloat(elem.innerText) - price}`;
  }

  elem.innerText = newPrice;
};

function cartItemClickListener(event) {
  event.target.remove();
  const items = JSON.parse(getSavedCartItems() || '[]');
  const elem = event.target.innerText;
  const sku = elem.substring(elem.indexOf(':') + 1, elem.indexOf('|')).trim();
  
  const x = items.find((item) => item.sku === sku);

  let newItems = 0;
  if (items.length > 1) {
    newItems = items.filter((item) => item.sku !== x.sku);
  } else {
    newItems = [];
  }

  saveCartItems(JSON.stringify(newItems));

  calculatePrice(x.salePrice, false);
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

const addToCart = async (event) => {
  const id = getSkuFromProductItem(event.target.parentNode);
  const obj = await fetchItem(id);

  const item = createCartItemElement({ sku: [obj.id], name: [obj.title], salePrice: [obj.price] });
  const element = document.getElementsByClassName('cart__items')[0];
  element.appendChild(item);

  calculatePrice(obj.price, true);
  const x = JSON.parse(getSavedCartItems() || '[]');
  const s = { sku: obj.id, name: obj.title, salePrice: obj.price };

  if (x !== null) {
    x.push(s);
    saveCartItems(JSON.stringify(x));
  } else {
    saveCartItems(JSON.stringify(s));
  }  
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

const showcase = async () => {
  const obj = await fetchProducts('computador');
  const item = obj.results.map((elem) => (
    {
      sku: elem.id,
      name: elem.title,
      image: elem.thumbnail,
    }
  ));

  item.forEach((elem) => {
    const element = document.getElementsByClassName('items')[0];
    element.appendChild(createProductItemElement(elem));
  });
};

const cleanCart = () => {
  const cartList = document.querySelector('.cart__items');
  cartList.innerHTML = '';
  localStorage.removeItem('cartItems');
  const price = document.querySelector('.value');
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

  // const items = document.querySelectorAll('.cart__item');
  // items.forEach((elem) => {
  //   const x = elem;
  //   x.onclick = cartItemClickListener;
  // });

  const emptyCart = document.querySelector('.empty-cart');
  emptyCart.onclick = cleanCart;
};
