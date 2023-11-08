import { convertToJson } from "./productData.mjs";
import { alertMessage, getLocalStorage, loadHeaderFooter, removeAllAlerts, setLocalStorage } from "./utils.mjs";
loadHeaderFooter();

function getValuesOfForm() {
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const street = document.getElementById("street").value;
  const city = document.getElementById("city").value;
  const state = document.getElementById("state").value;
  const zipcode = document.getElementById("zipcode").value;
  const cardNumber = document.getElementById("cardNumber").value;
  const expiration = document.getElementById("expiration").value;
  const securityCode = document.getElementById("securityCode").value;

  return {
    firstName,
    lastName,
    street,
    state,
    city,
    zipcode,
    cardNumber,
    securityCode,
    expiration,
  };
}

document.getElementById("form")?.addEventListener("submit", onSubmit);

function onSubmit(event) {
  event.preventDefault();
  const formValues = getValuesOfForm();
  const numbers = loadAndReturnTotalValues();
  let items = [];
  for (let i = 0; i < numbers.savedProducts.length; i++) {
    let productItem = {
      id: numbers.savedProducts[i].id,
      name: numbers.savedProducts[i].Brand.Name,
      price: numbers.savedProducts[i].FinalPrice,
      quantity: numbers.savedProducts[i].Qty,
    };
    items.push(productItem);
  }

  let date = new Date();
  // checkout api.
  const apiCall = {
    orderDate: date,
    fname: formValues.firstName,
    lname: formValues.lastName,
    street: formValues.street,
    city: formValues.city,
    state: formValues.state,
    zip: formValues.zipcode,
    cardNumber: formValues.cardNumber,
    expiration: formValues.expiration,
    code: formValues.securityCode,
    items: items,
    orderTotal: numbers.total,
    shipping: numbers.shipping,
    tax: numbers.tax,
  };

  submitForm(apiCall);
}


async function submitForm(apiCall) {
  try {
    await makeCheckout(apiCall);
    setLocalStorage("so-cart", []);
    window.location.replace("/checkout/success.html");
  } catch (err) {
    console.log('error', err);
    removeAllAlerts();
    for (let message in err.message) {
      alertMessage(err.message[message]);
    }
  }
}

function total(item) {
  let totalValue = 0;

  let numberOfItems = item.length;
  for (let i = 0; i < numberOfItems; i++) {
    totalValue = totalValue + item[i].FinalPrice * item[i].Qty;
  }
  return totalValue;
}

function loadAndReturnTotalValues() {
  const savedProducts = getLocalStorage("so-cart");

  const subtotal = total(savedProducts);
  const tax = subtotal * 0.06;
  const shipping = 2 * savedProducts.length + 8;
  const totalValue = (subtotal + tax + shipping).toFixed(2);
  document.getElementById("subtotal").innerHTML = total(savedProducts);
  document.getElementById("tax").innerHTML = tax.toFixed(2);
  document.getElementById("shipping").innerHTML = shipping;

  document.getElementById("total").innerHTML = totalValue;

  return { savedProducts, subtotal, tax, shipping, total };
}

export async function makeCheckout(payload) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  const baseURL = import.meta.env.VITE_SERVER_URL;

  const response = await fetch(baseURL + "checkout", options);
  const data = await convertToJson(response);
  return data.Result;
}


loadAndReturnTotalValues();
