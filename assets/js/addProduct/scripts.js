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



// Create a script element
var script = document.createElement("script");

// Set the source attribute to the jQuery CDN
script.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js";

// Define a callback function to execute when the script is loaded
script.onload = function () {
  // jQuery is now loaded and can be used safely
  console.log("jQuery loaded successfully");
  // Start using jQuery here...
};

// Append the script element to the document body
document.body.appendChild(script);

function accessCamera() {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(function (stream) {
      var videoElement = document.createElement("video");
      videoElement.srcObject = stream;
      videoElement.play();
    })
    .catch(function (error) {
      console.error("Error accessing camera:", error);
    });
}

// function handleFileSelect(event) {
//   const files = event.target.files;
//   const selectedFilesDiv = document.getElementById("selectedFiles");

//   for (let i = 0; i < files.length; i++) {
//     const fileName = files[i].name;

//     const fileWrapper = document.createElement("div");
//     fileWrapper.classList.add("file-wrapper");

//     const fileNameNode = document.createElement("div");
//     fileNameNode.classList.add("file-name");
//     fileNameNode.textContent = fileName;

//     const cancelButton = document.createElement("div");
//     cancelButton.classList.add("cancel-button");
//     cancelButton.textContent = "✖";
//     cancelButton.addEventListener("click", () => {
//       fileWrapper.remove();
//       event.target.value = "";
//     });

//     fileWrapper.appendChild(fileNameNode);
//     fileWrapper.appendChild(cancelButton);

//     selectedFilesDiv.appendChild(fileWrapper);
//   }
// }

// function submitForm() {
//   console.log("add button clicked");
//   const formData = new FormData();

//   formData.append("product_tittle", document.getElementById("title").value);
//   formData.append("product_price", document.getElementById("price").value);
//   formData.append("product_color1", document.getElementById("color").value);
//   formData.append(
//     "product_material",
//     document.getElementById("material").value
//   );
//   formData.append("product_brand", document.getElementById("brand").value);
//   formData.append("offers", document.getElementById("offers").value);
//   formData.append("category", document.getElementById("category").value);
//   formData.append("product_stock", document.getElementById("stock").value);
//   formData.append("product_size", document.getElementById("size").value);
//   formData.append(
//     "product_discription",
//     document.getElementById("description").value
//   );
//   let isFormDataEmpty = true;
//   formData.forEach((value) => {
//     if (value) {
//       isFormDataEmpty = false;
//     }
//   });

//   if (!isFormDataEmpty) {
//     console.log("formData:", formData);

//     const files = document.getElementById("fileInput").files;
//     console.log("FILES:", files);
//             fetch('https://minitgo.com/api/insert_products.php', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(Object.fromEntries(formData))
//             })
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 console.log('add button clicked 2');
//                 return response.json();
//             })
//             .then(data => {
//                 console.log('Response:', data);
//                 // Close the modal upon successful insertion
//                 $('#addProductModal').modal('hide');
//             })
//             .catch(error => {
//                 console.error('Error:', error);
//             });

//   } else {
//     console.log("Form data is empty. Skipping fetch request.");
//   }
// }

//   const fileList = [];
//   document.getElementById('fileInput').addEventListener('change', handleFileSelect);

//   function handleFileSelect(event) {
//       const selectedFiles = event.target.files;
//       for (let i = 0; i < selectedFiles.length; i++) {
//           fileList.push(selectedFiles[i]);
//       }
//       // Clear the file input to allow selecting the same file again
//       event.target.value = '';
//   }

//   const AddButton = document.getElementById('AddButton');
//   AddButton.addEventListener('click',  () => {
//       console.log("FILELIST:", fileList);

//   });

document.getElementById("category").addEventListener("change", function () {
  var category = this.value;
  if (category === "womens") {
    document.getElementById("subCategory").style.display = "block";
  } else {
    document.getElementById("subCategory").style.display = "none";
  }
});

function openAddProductModal() {
  var addProductModal = new bootstrap.Modal(
    document.getElementById("addProductModal")
  );
  addProductModal.show();
}

//  Shubham- Edit Product functionality starts here

function openEditModal(ID) {
  var editProductModal = new bootstrap.Modal(
    document.getElementById("editProductModal")
  );

  fetch("https://minitgo.com/api/fetch_products.php")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (data.status === false) {
        console.log(data.message);
      } else {
        const product = data.data.find((product) => product.id === ID);
        console.log("PRODUCT:", product);
        editProductModal._element.dataset.product = JSON.stringify(product);

        document.getElementById("typingResultCategoryEdit").innerText =
          product.category;
        document.getElementById("typingResultTitleEdit").innerText =
          product.product_tittle;
        document.getElementById("typingResultColorEdit").innerText =
          "| " + product.product_color1;
        const descriptionElement = document.getElementById(
          "typingResultDescriptionEdit"
        );
        const description = product.product_discription;
        if (description.length > 35) {
          descriptionElement.innerText = description.substring(0, 35) + "...";
        } else {
          descriptionElement.innerText = description;
        }
        document.getElementById("typingResultMaterialEdit").innerText =
          product.material;
        document.getElementById("typingResultBrandEdit").innerText =
          product.product_brand;
        document.getElementById("typingResultOffersEdit").innerText =
          product.offers + "%";

        const newBadgeElement = document.getElementById("NewBadge");
        console.log("NEW BADGE:", newBadgeElement);
        const productDate =
          product.date instanceof Date ? product.date : new Date(product.date);
        const currentDate = new Date();
        const timeDifference = Math.abs(
          currentDate.getTime() - productDate.getTime()
        );
        const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
        if (daysDifference <= 5) {
          newBadgeElement.style.display = "inline-block";
        } else {
          newBadgeElement.style.display = "none";
        }

        document.getElementById("typingResultPriceEdit").innerText =
          "₹" + product.product_price;
        document.getElementById("typingResultSizeEdit").innerText =
          "Size: " + product.product_size;
        document.getElementById("typingResultStockEdit").innerText =
          "InStock: " + product.product_stock;

        document.getElementById("titleEdit").value = product.product_tittle;
        document.getElementById("priceEdit").value = product.product_price;
        document.getElementById("colorEdit").value = product.product_color1;
        document.getElementById("materialEdit").value = product.material;
        document.getElementById("brandEdit").value = product.product_brand;
        document.getElementById("categoryEdit").value = product.category;
        document.getElementById("subcategoryEdit").value = product.subcategory;
        document.getElementById("sizeEdit").value = product.product_size;
        document.getElementById("descriptionEdit").value =
          product.product_discription;

        const stockSelect = document.getElementById("stockEdit");
        stockSelect.innerHTML = ""; // Clear existing options
        const stockValue = parseInt(product.product_stock);

        const defaultStock = document.createElement("option");
        defaultStock.value = stockValue.toString();
        defaultStock.textContent = stockValue.toString();
        defaultStock.selected = true;
        stockSelect.appendChild(defaultStock);

        const stockRanges = ["1-5", "5-10", "10-15", "15-20", "None"];
        for (let range of stockRanges) {
          const stockOption = document.createElement("option");
          if (range === "None") {
            stockOption.value = "0";
          } else {
            stockOption.value = range;
          }
          stockOption.textContent = range;
          stockSelect.appendChild(stockOption);
        }

        const offerSelect = document.getElementById("offersEdit");
        offerSelect.innerHTML = "";
        const offerValue = parseInt(product.offers);

        const defaultOffer = document.createElement("option");
        defaultOffer.value = offerValue.toString();
        defaultOffer.textContent = offerValue.toString() + "%";
        defaultOffer.selected = true;
        offerSelect.appendChild(defaultOffer);

        const offerRanges = ["50-60", "60-70", "70-80", "None"]; // Numeric ranges without percentage symbols
        for (let range of offerRanges) {
          const offerOption = document.createElement("option");
          if (range === "None") {
            offerOption.value = "0"; // Set value to 0 for "None"
            offerOption.textContent = range; // "None" without percentage symbol
          } else {
            offerOption.value = range;
            offerOption.textContent = range + "%"; // Append percentage symbol for other options
          }
          offerSelect.appendChild(offerOption);
        }

        const categorySelect = document.getElementById("categoryEdit");
        categorySelect.innerHTML = "";
        const categoryValue = product.category;

        const defaultCategory = document.createElement("option");
        defaultCategory.value = categoryValue.toString();
        defaultCategory.textContent = categoryValue.toString();
        defaultCategory.selected = true;
        categorySelect.appendChild(defaultCategory);

        const categoryRanges = ["Mens", "Womens", "Kids"];
        for (let range of categoryRanges) {
          const categoryOption = document.createElement("option");
          categoryOption.value = range;
          categoryOption.textContent = range;
          categorySelect.appendChild(categoryOption);
        }

        const previewContainer = document.getElementById(
          "previewContainerEdit"
        );
        previewContainer.innerHTML = generateCarouselHTML(product);

        editProductModal.show();
      }
    })
    .catch((error) => {
      console.error("Error fetching product details:", error);
    });
}

function generateCarouselHTML(product) {
  let carouselHTML = `<div id="carouselExampleControls" class="carousel slide " data-bs-ride="carousel" style="height: 100%; width: 100%;">
                            <div class="carousel-inner" style="height: 100%;">`;

  for (let i = 1; i <= 6; i++) {
    const productImage = product["product_image" + i];
    if (productImage) {
      carouselHTML += `<div class="carousel-item${
        i === 1 ? " active" : ""
      }" style="height: 100%;">
                                <img src="${productImage}" class="img-fluid fixed-size-image" alt="Product Image" style="height: 100%; width: 100%;">
                             </div>`;
    }
  }

  carouselHTML += `</div>
                      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                      </button>
                      <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                      </button>
                    </div>`;

  return carouselHTML;
}

// Edit Product functionality ends here

// Save the changes starts here

function SaveChanges() {
  var productString =
    document.getElementById("editProductModal").dataset.product;
  var product = JSON.parse(productString);

  // Get form input values
  var title = document.getElementById("titleEdit").value;
  var price = document.getElementById("priceEdit").value;
  var color = document.getElementById("colorEdit").value;
  var material = document.getElementById("materialEdit").value;
  var brand = document.getElementById("brandEdit").value;
  var offers = document.getElementById("offersEdit").value;
  var category = document.getElementById("categoryEdit").value;
  // var subcategory = document.getElementById("subcategoryEdit").value;
  var stock = document.getElementById("stockEdit").value;
  var size = document.getElementById("sizeEdit").value;
  var description = document.getElementById("descriptionEdit").value;

  var data = {
    id: product.id,
    product_id: product.product_id,
    product_name: product.product_name,
    category: category,
    offers: offers,
    client_id: product.client_id,
    client_name: product.client_name,
    product_discription: description,
    product_image1: product.product_image1,
    product_image2: product.product_image2,
    product_image3: product.product_image3,
    product_image4: product.product_image4,
    product_image5: product.product_image5,
    product_image6: product.product_image6,
    pcode: product.pcode,
    product_price: price,
    product_tittle: title,
    product_brand: brand,
    material: material,
    product_size: size,
    product_ratings: product.product_ratings,
    product_stock: stock,
    product_color1: color,
    product_color2: product.product_color2,
    product_color3: product.product_color3,
    product_color4: product.product_color4,
    similarity: product.similarity,
    cordinates: product.cordinates,
    user_id: product.user_id,
    user_name: product.user_name,
    date: product.date,
    time: product.time,
  };

  fetch("https://minitgo.com/api/update_products.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (data.status === true) {
        var editProductModal = document.getElementById("editProductModal");
        editProductModal.classList.remove("show"); // Remove the 'show' class to hide the modal
        document.body.classList.remove("modal-open"); // Remove modal-open class from the body
        var modalBackdrop = document.querySelector(".modal-backdrop");
        modalBackdrop.parentNode.removeChild(modalBackdrop); // Remove modal backdrop

        refreshPage();
      }
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

function refreshPage() {
  location.reload(); // Reload the page to reflect the changes
}















