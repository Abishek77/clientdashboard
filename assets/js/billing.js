// dashboard.js

function getDbUserFromLocalStorage() {
  const dbUserJSON = localStorage.getItem('dbUser');
  if (dbUserJSON) {
      return JSON.parse(dbUserJSON);
  } else {
      return null;
  }
}

function createUserName(dbUser) {
  if (dbUser && dbUser.first_name && dbUser.last_name) {
      return `${dbUser.first_name} ${dbUser.last_name}`;
  } else {
      return 'User';
  }
}

function onPageLoad() {
  const dbUser = getDbUserFromLocalStorage();

  if (dbUser) {
      console.log('User data retrieved:', dbUser);
      const userNameElement = document.getElementById('userName');

      if (userNameElement) {
          const userName = createUserName(dbUser);
          userNameElement.textContent = userName;
      }

  } else {
      window.location.href = 'sign-in.html';
      console.log('No user found');
  }
}

// Call onPageLoad function when the page is loaded
onPageLoad()
// billing.js











const form = document.getElementById("product_code_searchbar");
const input = document.getElementById("product_code_input");
const products_section = document.getElementById("products_section");
const items_section = document.getElementById("items_section");

let checkoutProducts = [];

form.addEventListener("submit", function (event) {
  event.preventDefault();
  let product_codes = input.value?.trim();

  if (product_codes === "") {
    return;
  }

  product_codes = product_codes.split(",").map((code) => code.trim());

  fetch(`https://minitgo.com/api/fetch_products.php`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      const filteredProducts = data.data.filter((product) => {
        return product_codes.includes(product.pcode);
      });
      displayProducts(filteredProducts);
    })
    .catch((error) => console.error("Error:", error));
});

function onAddToCheckout(productId) {
  fetch(`https://minitgo.com/api/fetch_products.php`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      const products = data.data;
      const productToAdd = products.find(
        (product) => product.product_id === productId
      );
      if (productToAdd) {
        const existingProductIndex = checkoutProducts.findIndex(
          (product) => product.product_id === productId
        );
        if (existingProductIndex !== -1) {
          checkoutProducts[existingProductIndex].quantity++;
        } else {
          productToAdd.quantity = 1;
          checkoutProducts.push(productToAdd);
        }
        console.log("CHECKOUT PRODUCTS", checkoutProducts);
        updateCheckoutProductCount(); 
      } else {
        console.log("Product not found");
      }
    })
    .catch((error) => console.error("Error:", error));
}

function updateCheckoutProductCount() {
  const totalQuantity = checkoutProducts.reduce(
    (total, product) => total + product.quantity,
    0
  );

  items_section.innerHTML = `
    <span>Bill Items ${totalQuantity}</span>
    <button
      class="btn btn-primary my-auto"
      data-bs-toggle="modal"
      data-bs-target="#billingModal"
    >
      Send bill
    </button>
  `;
}

const quantityInput = document.getElementById("quantity");

function updateQuantityField() {
  if (quantityInput) {
    const totalQuantity = checkoutProducts.reduce(
      (total, product) => total + product.quantity,
      0
    );
    quantityInput.value = totalQuantity; 
  }
}
function displayCheckoutProducts() {
  const productCardsContainer = document.getElementById("productCards");
  productCardsContainer.innerHTML = ""; 

  checkoutProducts.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add(
      "form-group",
      "border",
      "rounded-2",
      "px-2",
      "d-flex",
      "gap-3",
      "align-items-center"
    );
    productCard.style.height = "120px";

    productCard.innerHTML = `
      <div style="width: 90px;height: 90px;" class=" border rounded-2">
        <img src="${product.product_image1}" alt="Product Image" class="w-100 h-100">
      </div>
      <div class="w-100 d-flex  "style="height:90px ">
        <div class="d-flex   w-100 justify-content-between align-items-center px-2 pt-1">
          <div>
            <div>Title: ${product.product_tittle}</div>
            <div>Price: ${product.product_price}</div>
            <button class="btn btn-danger px-2 py-1 mt-1" onclick="removeFromCheckout('${product.product_id}')">Delete</button>
          </div>
         
         
            <div class="d-flex border rounded-2">
              <button class="border rounded-2 px-2"  style="font-size: 14px;" onclick="increaseQuantity('${product.product_id}')">+</button>
              <div style="width: 50px;" class="d-flex align-items-center justify-content-center">${product.quantity}</div>
              <button class="border rounded-2 px-2 "  style="font-size: 14px;" onclick="decreaseQuantity('${product.product_id}')">-</button>
            </div>
          

        </div>
      </div>
    `;

    productCardsContainer.appendChild(productCard);
  });
}

function increaseQuantity(productId) {
  const productIndex = checkoutProducts.findIndex(
    (product) => product.product_id === productId
  );
  if (productIndex !== -1) {
    checkoutProducts[productIndex].quantity++;
    updateCheckoutProductCount();
    updateQuantityField();
    displayCheckoutProducts();
  }
}

function decreaseQuantity(productId) {
  const productIndex = checkoutProducts.findIndex(
    (product) => product.product_id === productId
  );
  if (productIndex !== -1) {
    if (checkoutProducts[productIndex].quantity > 1) {
      checkoutProducts[productIndex].quantity--;
      updateCheckoutProductCount();
      updateQuantityField();
      displayCheckoutProducts();
    }
  }
}

function removeFromCheckout(productId) {
  const productIndex = checkoutProducts.findIndex(
    (product) => product.product_id === productId
  );
  if (productIndex !== -1) {
    checkoutProducts.splice(productIndex, 1);
    updateCheckoutProductCount();
    updateQuantityField();
    displayCheckoutProducts();
  }
}






// Send confiremed bill code starts here

function sendConfirmedBill() {
  const fullName = document.getElementById("full_name").value;
  const whatsAppNumber = document.getElementById("whatsapp_number").value;

  const productsToSend = checkoutProducts.map(product => {
    const totalAmount = product.quantity * product.product_price;
    return {
      product_id: product.product_id,
      pcode: product.pcode,
      product_tittle: product.product_tittle,
      product_color1: product.product_color1,
      quantity: product.quantity,
      totalAmount:totalAmount,
      size: product.product_size
    };
  });

  const confirmedBill = {
    fullName: fullName,
    whatsAppNumber: whatsAppNumber,
    products: productsToSend
  };

  console.log("CONFIREMD BILL DETAILS:",confirmedBill);
}

// Event listener for Send Confirmed Bill button
document.getElementById("sendConfirmedBillBtn").addEventListener("click", sendConfirmedBill);

// Send confirmed bill code ends here





// Event listener to execute the function when the modal is shown
document
  .getElementById("billingModal")
  .addEventListener("shown.bs.modal", function () {
    updateQuantityField(); 
    displayCheckoutProducts();
  });

function displayProducts(products) {
  products_section.innerHTML = "";
  let products_html = "";

  products.forEach((product) => {
    products_html += "<div class='col-xl-3 col-md-6 mb-xl-0 mb-4 my-2'>";
    products_html +=
      "<div class='card card-blog card-plain rounded rounded-2 shadow shadow-2 p-3'>";
    products_html += "<div class='position-relative'>";
    products_html +=
      "<a class='d-block border border-radius-xl d-flex justify-content-center  mx-1'>";
    products_html +=
      "<img src='" +
      product.product_image1 +
      "' alt='img-blur-shadow' class='img-fluid fixed-size-image border-radius-xl p-1'>"; 
    products_html += "</a>";
    products_html += "</div>";
    products_html += "<div class='card-body px-1 pb-0'>";
    products_html +=
      "<p class='text-gradient text-dark mb-2 text-sm'>" +
      product.category +
      "</p>";
    products_html += "<a href='javascript:;'>";
    products_html += "<h5>" + product.product_tittle + "</h5>";
    products_html += "</a>";
    products_html += "<h5>" + product.product_price + "</h5>"; 
    products_html +=
      "<p class='mb-4 text-sm'>" + product.product_discription + "</p>";
    products_html +=
      "<div class='d-flex align-items-center justify-content-between'>";
    products_html +=
      "<button type='button' class='btn btn-outline-primary btn-sm mb-0'>Edit</button>";
    products_html +=
      "<button type='button' class='btn btn-outline-primary btn-sm mb-0' onclick='onAddToCheckout(\"" +
      product.product_id +
      "\")'>Add to Checkout</button>";
    products_html += "</div>";
    products_html += "</div>";
    products_html += "</div>";
    products_html += "</div>";
  });

  products_section.innerHTML = products_html;
}

function onEdit() {
  return;
}
