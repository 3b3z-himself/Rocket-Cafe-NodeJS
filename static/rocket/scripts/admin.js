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
  Desserts: ["Desserts"],
  Foods: ["Pasta", "Burger", "Syrian", "Chicken", "Sandwich"],
};

function update_subcategories(select) {
  const dishSubcategorySelect = document.querySelector('select[name="sub-dish-category"]');
  const selectedCategory = select.value;

  // Clear the existing options
  dishSubcategorySelect.innerHTML = '';

  // Populate the subcategories based on the selected category
  subcategories[selectedCategory].forEach((subcategory) => {
      const option = document.createElement('option');
      option.value = subcategory;
      option.text = subcategory;
      dishSubcategorySelect.appendChild(option);
  });

  // Show the subcategory dropdown if a category is selected
  if (selectedCategory !== '-') {
      document.querySelector('label[for="sub-dish-category"]').style.display = 'flex';
  } else {
      document.querySelector('label[for="sub-dish-category"]').style.display = 'none';
  }
}

function updateStatus(selectElement) {
  const selectedStatus = selectElement.value;
  // selectElement.classList.remove('.waiting');
  // selectElement.classList.remove('.done');
  // selectElement.classList.remove('.active');
  // selectElement.classList.remove('.canceled');
  // selectElement.classList.add(selectedStatus);
  fetch('/rocket/update_table', {
    method: 'POST',
    body: JSON.stringify({ tableID: selectElement.getAttribute('tableID'), status: selectedStatus, bill: selectElement.getAttribute('bill') }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  alert(`Order status updated to ${selectedStatus}`);
  window.location.reload();
  window.location.reload();

  window.location.reload();

  window.location.reload();

}

function remove_dish(element) {
  console.log(element.getAttribute('nameToDelete'));
  fetch('/rocket/remove-dish', {
    method: 'POST',
    body: JSON.stringify({ name: element.getAttribute('nameToDelete')}),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

function moveToDashboard(dashboardType) {
  console.log('Moving to ' + dashboardType + ' dashboard');

  // Hide all dashboards
  document.querySelectorAll('.dashboard').forEach(dash => {
      dash.style.display = 'none';
  });

  // Remove 'active' class from all buttons
  document.querySelectorAll('.dashboard-btn, .table-btn, .dishes-btn, .vouchers-btn').forEach(btn => {
      btn.classList.remove('active');
      // document.querySelector('.table-btn img').src = "../static/images/ui images/pink table.png";
  });

  // Set the 'active' class to the appropriate button
  const activeButton = document.querySelector('.' + dashboardType + '-btn');
  if (activeButton) {
      activeButton.classList.add('active');
  }

  // Show/hide specific dashboard based on the dashboardType
  if (dashboardType === 'table') {
      document.querySelector('.table-dashboard').style.display = 'inline';
      document.querySelector('.table-btn img').src = "../static/images/ui images/table.png";
  } else if (dashboardType === 'dishes') {
      document.querySelector('.dishes-dashboard').style.display = 'inline';
  } else if (dashboardType === 'vouchers') {
      document.querySelector('.voucher-creator.dashboard').style.display = 'inline';
  } else {
      document.querySelector('.dashboard.main').style.display = 'inline';
  }

  // Reset the 'active' class on the dishes button if it exists
  if (dashboardType !== 'dishes') {
      const dishesBtn = document.querySelector('.dishes-btn');
      if (dishesBtn) {
          dishesBtn.classList.remove('active');
      }
  }

  // Reset the 'active' class on the vouchers button if it exists
  if (dashboardType !== 'vouchers') {
      const vouchersBtn = document.querySelector('.vouchers-btn');
      if (vouchersBtn) {
          vouchersBtn.classList.remove('active');
      }
  }
}



function add_table()
{
    fetch('/rocket/add_table', {
      method: 'POST',
      body: JSON.stringify("Add a new table"),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      location.reload();
    });
    location.reload();

}

function remove_table(button)
{
    fetch('/rocket/delete_table', {
      method: 'POST',
      body: JSON.stringify({TableID: button.parentElement.getAttribute('tableID')}),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      location.reload();
    });
    location.reload();

}


function moveToFixedVoucher(){
console.log('Moving to fixed voucher');
document.querySelector('.voucherChooseCards').style.display = 'none';
document.querySelector('.voucher-generator').style.display = 'flex';
document.querySelector('.fixed_voucher').style.display = 'flex';
}

function moveToPercentageVoucher(){
console.log('Moving to percentage voucher');
document.querySelector('.voucherChooseCards').style.display = 'none';
document.querySelector('.voucher-generator').style.display = 'flex';
document.querySelector('.percentage_voucher').style.display = 'flex';
}

function moveToDefaultVoucher(){
document.querySelector('.voucherChooseCards').style.display = 'flex';
document.querySelector('.voucher-generator').style.display = 'none';
document.querySelector('.percentage_voucher').style.display = 'none';
document.querySelector('.fixed_voucher').style.display = 'none';

}


function delete_voucher(element){
console.log('Deleting voucher');
fetch('/rocket/delete-voucher', {
  method: 'POST',
  body: JSON.stringify({ voucherKey: element.getAttribute('voucherKey') }),
  headers: {
    'Content-Type': 'application/json',
  },
})
alert(`Deleting voucher ${element.getAttribute('voucherKey')}`);
window.location.reload();
window.location.reload();
window.location.reload();
window.location.reload();
}
