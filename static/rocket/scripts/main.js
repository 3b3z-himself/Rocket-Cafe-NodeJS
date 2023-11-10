document.addEventListener("DOMContentLoaded", function () {
  //   const categoriesButtons = document.querySelectorAll(".categories-lst button");
    const menuElements = document.querySelectorAll(".menu-element");
    const guestsInput = document.querySelector(".reserved-guests span");
    const tableInput = document.querySelector(".reserved-table span");
    const paymentMethods = document.querySelectorAll(".payment-method");
  
  
    const categoryButtons = document.querySelectorAll(".categories-lst button");
    const subcategories = {
      Drinks: [
        "Hot Coffee",
        "Hot Chocolate",
        "Hot Drinks",
        "Iced Coffee",
        "Milkshakes",
        "Smoothies",
        "Fresh Juice",
        "Soft Drink",
        "Soda",
      ],
      Desserts: [],
      Foods: ["Pasta", "Burger", "Syrian", "Chicken", "Sandwich"],
    };
  
    categoryButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const category = this.querySelector(".h4").textContent;
  
        // Hide all menu elements and subcategories by default
        menuElements.forEach((element) => {
          element.style.display = "none";
        });
        const subcategoryDiv = document.querySelector(".sub.categories-lst");
        subcategoryDiv.style.display = "none";
  
        // Show subcategories for the selected category
        if (category in subcategories) {
          const subcategoryButtons = subcategoryDiv.querySelectorAll("button");
  
          // Remove existing subcategory buttons
          subcategoryButtons.forEach((subButton) => {
            subButton.remove();
          });
  
          // Generate and add subcategory buttons
          subcategories[category].forEach((subCategory) => {
            const subButton = document.createElement("button");
            subButton.innerHTML = `
              <!--<svg></svg>-->
              <h6 class="h4">${subCategory}</h6>
            `;
            subButton.addEventListener("click", function () {
              const subCategory = this.querySelector(".h4").textContent;
  
              // Show menu elements matching category and subcategory
              menuElements.forEach((element) => {
                const dataCategory = element.getAttribute("data-category");
                const dataSubCategory = element.getAttribute("data-subcategory");
                if (category === "All" || dataCategory === category) {
                  if (subCategory === "All" || dataSubCategory === subCategory) {
                    element.style.display = "block";
                  } else {
                    element.style.display = "none";
                  }
                } else {
                  element.style.display = "none";
                }
              });
  
            // Update active subcategory button
            subcategoryDiv.querySelectorAll("button").forEach((subBtn) => {
              if (subBtn == this) {
                console.log('HEHEHE')
                subBtn.classList.add("active");
              } else {
                console.log(this.innerHTML)
                subBtn.classList.remove("active");
              }
            });
  
            });
            subcategoryDiv.appendChild(subButton);
          });
  
          // Show the subcategory section
          subcategoryDiv.style.display = "flex";
        }
  
        // Show menu elements matching category
        menuElements.forEach((element) => {
          const dataCategory = element.getAttribute("data-category");
          if (category === "All" || dataCategory === category) {
            element.style.display = "block";
          }
        });
  
        // Update active category button
        categoryButtons.forEach((btn) => {
          if (btn === button) {
            btn.classList.add("active");
          } else {
            btn.classList.remove("active");
          }
        });
      });
    });
  
  
    const trolley = document.querySelector(".trolley");
    const addChartButtons = document.querySelectorAll(".add-chart");
  
    const orderData = {
      orderedItems: [],
      bill: 0,
      discount: 0,
      // orderID: parseInt(document.querySelector('.order-num').textContent),
      // table: parseInt(document.querySelector('.reserved-table-num').textContent),
      // guests: parseInt(document.querySelector('.reserved-guests-num').textContent),
      orderID: null,
      table: null,
      guests: null,
      branchLocation: "El-Ma3had El-Deeny",
      paymentMethod: "Cash",
    };
  
    function addOrderedElement(item) {
      const orderedElement = document.createElement("div");
      orderedElement.classList.add("ordered-element");
  
      orderedElement.innerHTML = `
            <div>
              <img src="${item.image}">
              <div class="text-data">
                <h2 class="element-name h2">${item.name}</h2>
                <p class="element-desc p">${item.description}</p>
                <h4 class="price">${item.price}</h4>
              </div>
            </div>
            <div class="quantity-control">
              <button class="add">+</button>
              <h5 class="quantity">${item.quantity}</h5>
              <button class="minus">-</button>
            </div>
          `;
  
      trolley.appendChild(orderedElement);
      trolley.scrollTo(0, document.body.scrollHeight);
    }
  
    function findOrderedItemByName(name) {
      return orderData.orderedItems.find((item) => item.name === name);
    }
  
    function markMenuElementAsAdded(name) {
      const menuElement = Array.from(menuElements).find(
        (el) => el.querySelector(".element-name").textContent === name
      );
      if (menuElement) {
        menuElement.classList.add("added");
      }
    }
  
    function updateBill() {
      const subtotalValue = orderData.orderedItems.reduce(
        (total, item) => total + parseFloat(item.price) * item.quantity,
        0
      );
      subtotalValue.toFixed(2)
      // const serviceChargeValue = (subtotalValue * 0.05).toFixed(2);
      const serviceChargeValue = 0;
  
      const totalValue = (subtotalValue + parseFloat(serviceChargeValue)).toFixed(
        2
      );
  
  
      document.querySelector(".subtotal-amount").textContent =
        subtotalValue.toFixed(2) + " LE";
      document.querySelector(".service-charge-amount").textContent =
        serviceChargeValue + " LE";
  
      console.log(orderData.discount)
      let discount_amount;
  
      if (orderData.discount_type == 'percentage'){
        discount_amount = (orderData.discount / 100) * totalValue;
        document.querySelector('#discount-v h4').textContent = 'DISCOUNT ' + orderData.discount + '%';
      }
      else {
        discount_amount = orderData.discount;
        document.querySelector('#discount-v h4').textContent = 'DISCOUNT ' + orderData.discount + ' LE';
      }
  
      document.querySelector('.discount-amount').textContent = '-'+discount_amount.toFixed(2)+' LE';
  
  
      document.querySelector(".total-amount").textContent = (totalValue - discount_amount).toFixed(2) + " LE";
      orderData.priceAfterDiscount = (totalValue - discount_amount).toFixed(2)
      orderData.bill = totalValue - discount_amount;
    }
  
    menuElements.forEach((button) => {
      button.addEventListener("click", function () {
        // const menuElement = this.closest(".menu-element");
        const menuElement = this;
        this.classList.add("added");
        const itemName = menuElement.querySelector(".element-name").textContent;
        const itemDescription = menuElement.querySelector(".element-desc").textContent;
        const itemPrice = menuElement.querySelector(".price").textContent;
        const category = menuElement.dataset.category;
        const itemImage = menuElement.querySelector("img").src;
        const existingItem = findOrderedItemByName(itemName);
  
        if (existingItem) {
          console.log("Already added")
          // existingItem.quantity++;
          // const quantityElement = trolley.querySelector(
          //   `.ordered-element .element-name:contains('${itemName}') + .quantity-control .quantity`
          // );
          // quantityElement.textContent = existingItem.quantity;
        } else {
          const item = {
            name: itemName,
            description: itemDescription,
            price: itemPrice,
            quantity: 1,
            category: category,
            image: itemImage,
          };
          const itemForBill = {
            name: itemName,
            price: itemPrice,
            quantity: 1,
          };
          orderData.orderedItems.push(itemForBill);
          addOrderedElement(item);
          markMenuElementAsAdded(itemName);
        }
  
        updateBill();
        console.log(orderData);
      });
    });
  
    trolley.addEventListener("click", function (e) {
      if (e.target.classList.contains("add")) {
        const nameElement = e.target
          .closest(".ordered-element")
          .querySelector(".element-name");
        const name = nameElement.textContent;
        const orderedItem = findOrderedItemByName(name);
  
        if (orderedItem) {
          orderedItem.quantity++;
          const quantityElement = e.target.nextElementSibling;
          quantityElement.textContent = orderedItem.quantity;
          orderData.bill += parseFloat(orderedItem.price);
  
          updateBill();
        }
      } else if (e.target.classList.contains("minus")) {
        const nameElement = e.target
          .closest(".ordered-element")
          .querySelector(".element-name");
        const name = nameElement.textContent;
        const orderedItem = findOrderedItemByName(name);
  
        if (orderedItem && orderedItem.quantity > 0) {
          orderedItem.quantity--;
          const quantityElement = e.target.previousElementSibling;
          quantityElement.textContent = orderedItem.quantity;
          orderData.bill -= parseFloat(orderedItem.price);
  
          if (orderedItem.quantity === 0) {
            const orderedElement = e.target.closest(".ordered-element");
            trolley.removeChild(orderedElement);
  
            const menuElement = Array.from(menuElements).find(
              (el) => el.querySelector(".element-name").textContent === name
            );
            if (menuElement) {
              menuElement.classList.remove("added");
            }
  
            const index = orderData.orderedItems.indexOf(orderedItem);
            if (index !== -1) {
              orderData.orderedItems.splice(index, 1);
            }
  
            updateBill();
          }
  
          updateBill();
        }
      }
  
      console.log(orderData);
    });
  
    paymentMethods.forEach((method) => {
      method.addEventListener("click", function () {
        // Disable all payment methods
        paymentMethods.forEach((method) => {
          // method.classList.remove("active");
          // method.classList.add("disabled");
        });
  
        if (this.querySelector("h4").textContent === "Cash") {
          this.classList.add("active");
          this.classList.remove("disabled"); // Enable the "Cash" method
          orderData.paymentMethod = "Cash"; // Set the payment method to "Cash"
        }
  
        console.log(orderData);
      });
    });
  
  
  
    function validateVoucher() {
      const voucherKey = document.querySelector('input[name="voucher_key"]').value;
  
      // Send a POST request to the Flask route with the voucher key
      fetch('/rocket/validate-voucher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ voucher_key: voucherKey }),
      })
        .then(response => response.json())
        .then(data => {
          if (data) {
            if (data.min_charge <= orderData.bill){
              console.log("min charge exceeded");
              if (data.type === "percentage") {
                // Apply a percentage discount to the bill (data.amount is the percentage)
                const percentageDiscount = data.amount;
                orderData.discount = percentageDiscount
                orderData.discount_type = 'percentage';
                document.querySelector('#discount-v').style.display = 'flex';
                updateBill();
                console.log(orderData);
              } else if (data.type === "fixed") {
                // Apply a fixed amount discount to the bill (data.amount is the fixed amount)
                const fixedDiscount = data.amount;
                orderData.discount = fixedDiscount
                orderData.discount_type = 'fixed';
                document.querySelector('#discount-v').style.display = 'flex';
                updateBill();
                console.log(orderData);
              }
              document.querySelector('#voucher_form').style.display = "none";
              document.querySelector('#remove_voucher').style.display = "inline";
            } else {
              document.querySelector('.invalid-feedback').textContent = 'You have to exceed the min charge ' + data.min_charge + ' LE to use this voucher.';
              document.querySelector('#voucher_form').classList.add('invalid');
            }
  
            }
            else{
  
              document.querySelector('.invalid-feedback').textContent = 'Invalid voucher code';
              document.querySelector('#voucher_form').classList.add('invalid');
            }
  
        })
        .catch(error => {
          // Handle any errors, e.g., network issues or server errors
        });
    }
  
    document.getElementById("validate_voucher").addEventListener("click", validateVoucher);
    function removeVoucher(){
      orderData.discount = 0;
      updateBill();
      console.log(orderData);
      document.querySelector('#remove_voucher').style.display = "none";
      document.querySelector('#voucher_form').style.display = "none";
      document.querySelector('#discount-v').style.display = "none";
      document.querySelector('#voucher_form input').value = "";
      document.querySelector('.invalid-feedback').textContent = "";
      document.querySelector('#voucher_form').classList.remove('invalid');
      document.querySelector('#voucher_box').style.display = "inline";
  
    }
    document.getElementById("remove_voucher").addEventListener("click", removeVoucher);
  
    updateBill();
  
    const sendOrderButton = document.getElementById("sendOrder");
    const orderModal = document.getElementById("orderModal");
    const orderIDSpan = document.getElementById("orderID");
    const placementTimeSpan = document.getElementById("placementTime");
    const paymentMethodSpan = document.getElementById("paymentMethod");
    const branchLocationSpan = document.getElementById("branchLocation");
    const totalBillSpan = document.getElementById("totalBill");
    const newOrderButton = document.getElementById("newOrder");
    const printReceiptButton = document.getElementById("printReceipt");
  
    // Function to show the modal with data
    function showModal(
      orderID,
      placementTime,
      paymentMethod,
      branchLocation,
      totalBill
    ) {
      orderIDSpan.textContent = orderID;
      placementTimeSpan.textContent = placementTime;
      paymentMethodSpan.textContent = paymentMethod;
      branchLocationSpan.textContent = branchLocation;
      totalBillSpan.textContent = totalBill;
      document.querySelector(".modal-content").style.display = "none";
      orderModal.style.display = "flex";
      setTimeout(function () {
          document.querySelector(".modal-content.flying").style.display = "none";
          document.querySelector(".modal-content").style.display = "flex";
        }, 3000);
      }
  
    // Function to hide the modal
    function hideModal() {
      orderModal.style.display = "none";
    }
  
    sendOrderButton.addEventListener("click", () => {
      // Replace these variables with your actual data
      fetch('/rocket/receive_order', {
        method: 'POST',
        body: JSON.stringify({order: orderData}),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      setTimeout(function () {
        window.location.href = "/rocket/phone-num";
      }, 500);
  
      // document.querySelector(".modal-content.flying").style.display = "inline";
      // const orderID = orderData.orderID;
      // const placementTime = new Date().toLocaleString();
      // const paymentMethod = orderData.paymentMethod;
      // const branchLocation = orderData.branchLocation;
      // const totalBill = orderData.priceAfterDiscount;
      // showModal(orderID, placementTime, paymentMethod, branchLocation, totalBill);
  
      // setTimeout(function () {
      //   window.location.href = "/rocket/kickoff";
      // }, 15000);
  
    });
  
    newOrderButton.addEventListener("click", hideModal);
    printReceiptButton.addEventListener("click", () => {
      // Handle printing the receipt here
      window.print();
    });
  
    document.querySelector('#voucher_box').addEventListener("click", function () {
      document.querySelector('#voucher_form').style.display = "flex";
      document.querySelector('#voucher_box').style.display = "none";
    });
  
  
  
  });
  
  
  