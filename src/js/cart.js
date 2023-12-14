import { getLocalStorage } from "./utils.mjs";
import { loadHeaderFooter } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");

  if (cartItems && cartItems.length > 0) {
    let totalCart = total(cartItems);
    document.querySelector("#total").className = "cart-footershow";
    document.querySelector("#totalPrice").innerHTML = `Total: $${totalCart}`;
  } else {
    document.querySelector("#total").className = "cart-footerhide";
  }

  const htmlItems = cartItems?.map((item) => cartItemTemplate(item));
  const productListElement = document.querySelector(".product-list");
  productListElement.innerHTML = htmlItems?.length
    ? htmlItems?.join("")
    : `<p>Your cart looks empty!</p>`;

  // Add event listener to handle item deletion when the 'X' button is clicked
  productListElement.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-item-btn")) {
      const itemId = event.target.getAttribute("data-id");
      deleteItem(itemId);
    }
  });
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img src="${item.Images.PrimaryMedium}" alt="${item.Name}" />
    </a>
    <a href="#">
    <button class="delete-item-btn" data-id="${item.Id}">X</button>

      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item?.Colors?.[0]?.ColorName}</p>
    <p class="cart-card__quantity">qty: ${item.Qty}</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
  </li>`;

  return newItem;
}

function total(items) {
  return items.reduce((totalValue, item) => totalValue + item.FinalPrice * item.Qty, 0);
}

async function deleteItem(itemId) {
  let cartItems = getLocalStorage("so-cart") || [];

  const itemIndex = cartItems.findIndex((item) => item.Id === itemId);

  if (itemIndex !== -1) {
    cartItems.splice(itemIndex, 1);

    localStorage.setItem("so-cart", JSON.stringify(cartItems));
    renderCartContents();
  }
}
renderCartContents();
loadHeaderFooter();
