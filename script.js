window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hide'), 700);
  }
});

const navbar = document.querySelector('.luxury-navbar');
window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }
});

const revealElements = document.querySelectorAll('.reveal-up');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.15 });
revealElements.forEach(el => revealObserver.observe(el));

const cookieBanner = document.getElementById('cookieBanner');
const acceptCookies = document.getElementById('acceptCookies');
if (cookieBanner && !localStorage.getItem('cookiesAccepted')) {
  cookieBanner.classList.remove('d-none');
}
if (acceptCookies) {
  acceptCookies.addEventListener('click', () => {
    localStorage.setItem('cookiesAccepted', 'true');
    document.cookie = 'maisonBrewCookies=accepted; max-age=31536000; path=/';
    cookieBanner.classList.add('d-none');
  });
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const contactData = {
      name: document.getElementById('customerName').value,
      email: document.getElementById('customerEmail').value,
      phone: document.getElementById('customerPhone').value,
      message: document.getElementById('customerMessage').value,
      time: new Date().toLocaleString()
    };

    const existingRequests = JSON.parse(localStorage.getItem('contactRequests')) || [];
    existingRequests.push(contactData);
    localStorage.setItem('contactRequests', JSON.stringify(existingRequests));

    document.cookie = `lastCustomer=${encodeURIComponent(contactData.name)}; max-age=604800; path=/`;

    const formAlert = document.getElementById('formAlert');
    formAlert.classList.remove('d-none');
    contactForm.reset();

    setTimeout(() => {
      formAlert.classList.add('d-none');
    }, 3000);
  });
}

let cart = JSON.parse(localStorage.getItem('maisonBrewCart')) || [];
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const clearCartBtn = document.getElementById('clearCart');

function renderCart() {
  if (!cartItemsContainer || !cartTotal) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="text-light-emphasis">No items added yet.</p>';
    cartTotal.textContent = '£0.00';
    return;
  }

  cartItemsContainer.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <div>
        <strong>${item.name}</strong>
        <div>£${item.price.toFixed(2)}</div>
      </div>
      <button class="btn btn-sm btn-outline-light" onclick="removeCartItem(${index})">Remove</button>
    `;
    cartItemsContainer.appendChild(cartItem);
  });

  cartTotal.textContent = `£${total.toFixed(2)}`;
  localStorage.setItem('maisonBrewCart', JSON.stringify(cart));
}

function removeCartItem(index) {
  cart.splice(index, 1);
  renderCart();
}
window.removeCartItem = removeCartItem;

addToCartButtons.forEach(button => {
  button.addEventListener('click', () => {
    const item = {
      name: button.dataset.name,
      price: parseFloat(button.dataset.price)
    };
    cart.push(item);
    renderCart();
  });
});

if (clearCartBtn) {
  clearCartBtn.addEventListener('click', () => {
    cart = [];
    localStorage.removeItem('maisonBrewCart');
    renderCart();
  });
}

renderCart();

const loyaltyForm = document.getElementById("loyaltyForm");

if (loyaltyForm) {
  loyaltyForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const loyaltyData = {
      name: document.getElementById("loyaltyName").value,
      email: document.getElementById("loyaltyEmail").value,
      phone: document.getElementById("loyaltyPhone").value,
      birthday: document.getElementById("loyaltyBirthday").value,
      favouriteDrink: document.getElementById("loyaltyDrink").value
    };

    let members = JSON.parse(localStorage.getItem("loyaltyMembers")) || [];
    members.push(loyaltyData);
    localStorage.setItem("loyaltyMembers", JSON.stringify(members));

    alert("Thank you for joining our loyalty program!");
    loyaltyForm.reset();
  });
}