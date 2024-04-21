const socket = io();
let form = document.getElementById("add-product-form");
function addProduct() {
  form.style.display = "block";
}

function addProductToTable(event) {
  event.preventDefault(); 
  let title = document.getElementById("title").value.trim();
  let code = document.getElementById("code").value.trim();
  let price = document.getElementById("price").value.trim();
  let stock = document.getElementById("stock").value.trim();
  let category = document.getElementById("category").value.trim();

  if ((isNaN(parseFloat(price)) || parseFloat(price) < 0) && (isNaN(parseInt(stock)) || parseInt(stock) < 0)) {
    Swal.fire({
      title: "Error",
      text: "Price and stock must be valid non-negative numbers",
      icon: "error",
      toast: true,
      position: "center",
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      stopKeyDownPropagation: true,
      confirmButtonColor: '#FA8072',
      confirmButtonAriaLabel: 'Ok'
    });
    return;
  }

  if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
    Swal.fire({
      title: "Error",
      text: "Price must be a valid numberic value",
      icon: "error",
      toast: true,
      position: "center",
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      stopKeyDownPropagation: true,
      confirmButtonColor: '#FA8072',
      confirmButtonAriaLabel: 'Ok'
    });
    return;
  }

  if (isNaN(parseInt(stock)) || parseFloat(stock) < 0) {
    Swal.fire({
      title: "Error",
      text: "Stock must be a valid numberic value",
      icon: "error",
      toast: true,
      position: "center",
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      stopKeyDownPropagation: true,
      confirmButtonColor: '#FA8072',
      confirmButtonAriaLabel: 'Ok'
    });
    return;
  }
  
 
  
  if (title === "" || code === "" || price === "" || stock === "" || category === "") {
    Swal.fire({
      title: "Error",
      text: "All fields must be filled out",
      icon: "error",
      toast: true,
      position: "center",
      allowOutsideClick: false,
      allowEscapeKey: false ,
      allowEnterKey :false ,
      stopKeyDownPropagation :true,
      confirmButtonColor:'#FA8072',
      confirmButtonAriaLabel:'Ok'
      
    });
    return; 
  }

  const tableRows = document.querySelectorAll('#real-time-products-table tbody tr');
  for (let row of tableRows) {
    let rowCode = row.cells[2].textContent; 
    if (rowCode === code) { // Check if a product with the same code already exists
      Swal.fire({
        title: "Error",
        text: "A product with the same code already exists",
        icon: "error",
        toast: true,
        position: "center",
        allowOutsideClick: false,
        allowEscapeKey: false ,
        allowEnterKey :false ,
        stopKeyDownPropagation :true,
        confirmButtonColor:'#FA8072',
        confirmButtonAriaLabel:'Ok'

      });
      document.getElementById("title").value = "";
      document.getElementById("description").value = "";
      document.getElementById("code").value = "";
      document.getElementById("price").value = "";
      document.getElementById("stock").value = "";
      document.getElementById("category").value = "";
      return; 
    }
  }


  let body = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    code: document.getElementById("code").value,
    stock: document.getElementById("stock").value,
    category: document.getElementById("category").value
  };

  fetch('/products', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(result => result.json())
  .then(result => {
    if (result.status === 'error') {
      throw new Error(result.error);
    }
    socket.emit('productsList', result.payload);
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("code").value = "";
    document.getElementById("price").value = "";
    document.getElementById("stock").value = "";
    document.getElementById("category").value = "";
    
    form.style.display = "none";
    Swal.fire({
      title: "Product",
      text: "Product added successfully!",
      icon: "success",
      toast: true,
      position: "center",
      allowOutsideClick: false,
      allowEscapeKey: false ,
      allowEnterKey :false ,
      stopKeyDownPropagation :true,
      confirmButtonColor:'#90EE90',
      confirmButtonAriaLabel:'Ok'
    });
  })
  .catch(err => {
    console.error('Error:', err);
    alert('Error: ' + err.message);
  });
}

function deleteProduct(pid) {

  fetch(`/products/${pid}`, {
    method: 'DELETE',
  })
    .then(result => {
      if (result.status === 204) {
        socket.emit('deletedProduct');
        Swal.fire({
          title: "Deleted!",
          text: "The product has been deleted.",
          icon: "success",
          toast: true,
          position: "center",
          allowOutsideClick: false,
          allowEscapeKey: false ,
          allowEnterKey :false ,
          stopKeyDownPropagation :true,
          confirmButtonColor:'#90EE90',
          confirmButtonAriaLabel:'Ok'
        });
      } else {
        console.error("Error deleting product:", result.statusText);
        Swal.fire({
          title: "Error",
          text: "An error occurred while deleting the product.",
          icon: "error",
          toast: true,
          position: "center",
          allowOutsideClick: false,
          allowEscapeKey: false ,
          allowEnterKey :false ,
          stopKeyDownPropagation :true,
          confirmButtonColor:'#FA8072',
          confirmButtonAriaLabel:'Ok'
        });
      }
    })
    .catch(error => {
      console.error("Error deleting product:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while deleting the product.",
        icon: "error",
        toast: true,
        position: "center",
        allowOutsideClick: false,
        allowEscapeKey: false ,
        allowEnterKey :false ,
        stopKeyDownPropagation :true,
        confirmButtonColor:'#FA8072',
        confirmButtonAriaLabel:'Ok'
      });
    });
}

socket.on("updateProducts",(data) =>{
  let table= document.getElementById("real-time-products-table");
  let HTMLTable=`
  <thead>
    <tr>
      <th scope="col">Title</th>
      <th scope="col">Description</th>
      <th scope="col">Code</th>
      <th scope="col">Price</th>
      <th scope="col">Stock</th>
      <th scope="col">Category</th>
    </tr>
  </thead>`

  data.forEach(element => {

    HTMLTable += `
    <tr>
          <td>${element.title}</td>
          <td>${element.description}</td>
          <td>${element.code}</td>
          <td>${element.price}</td>
          <td>${element.stock}</td> 
          <td>${element.category}</td>
          <td>
            <div class="btn-group" role="group" aria-label="Product Actions">
              <button class="btn btn-outline-danger" id="delete-product-button" data-product-id="delete-${element.id}" type="button" data-bs-toggle="tooltip" onclick="deleteProduct((${element.id}))" data-bs-placement="top" title="Delete">
                <i class="fas fa-trash"></i>
              </button>
            </td>
            <td>
              <button class="btn btn-outline-primary" id="add-product-button" data-product-id="add-${element.id}" type="button" data-bs-toggle="tooltip" onclick="addProduct()" data-bs-placement="top" title="Add">
                <i class="fas fa-plus"></i>
              </button>
            </td>
          </div>
        </tr>
    `
  });

table.innerHTML=HTMLTable;
})

document.getElementById("newProductForm").addEventListener("submit", addProductToTable);