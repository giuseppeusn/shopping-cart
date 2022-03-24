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

function cartItemClickListener(event) {
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

const addToCart = async (event) => {
  const id = getSkuFromProductItem(event.target.parentNode);
  const obj = await fetchItem(id);

  const item = createCartItemElement({ sku: [obj.id], name: [obj.title], salePrice: [obj.price] });
  const element = document.getElementsByClassName('cart__items')[0];
  element.appendChild(item);
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

window.onload = () => { showcase(); };
