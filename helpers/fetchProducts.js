const apiURL = () => 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';

const fetchProducts = async () => {
  try {
    const url = apiURL();
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};

if (typeof module !== 'undefined') {
  module.exports = {
    fetchProducts,
  };
}
