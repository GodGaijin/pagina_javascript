function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

const accessToken = localStorage.getItem('accessToken');
if (!accessToken) window.location.href = 'index.html';
const user = parseJwt(accessToken);

function fetchProducts() {
  fetch('http://localhost:3001/api/products', {
    headers: { 'Authorization': 'Bearer ' + accessToken }
  })
    .then(res => {
      if (res.status === 401 || res.status === 403) window.location.href = 'index.html';
      return res.json();
    })
    .then(products => {
      const tbody = document.querySelector('#productsTable tbody');
      tbody.innerHTML = '';
      products.forEach(product => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${product.product_name}</td>
          <td>${product.serial_number}</td>
          <td>${product.product_details}</td>
          <td>${parseFloat(product.price).toFixed(2)}</td>
          <td>${product.amount}</td>
          <td>${product.commerce_name}</td>
          <td>${product.category_name}</td>
          <td>
            ${user.role === 'admin' ? `<button onclick="editProduct(${product.id})">Editar</button> <button onclick="deleteProduct(${product.id})">Eliminar</button>` : ''}
          </td>
        `;
        tbody.appendChild(tr);
      });
    });
}

let distributorsList = [];
let categoriesList = [];

function fetchDistributorsForProductForm(callback) {
  fetch('http://localhost:3001/api/distributors', {
    headers: { 'Authorization': 'Bearer ' + accessToken }
  })
    .then(res => res.json())
    .then(distributors => {
      distributorsList = distributors;
      if (callback) callback();
    });
}

function fetchCategoriesForProductForm(callback) {
  fetch('http://localhost:3001/api/categories', {
    headers: { 'Authorization': 'Bearer ' + accessToken }
  })
    .then(res => res.json())
    .then(categories => {
      categoriesList = categories;
      if (callback) callback();
    });
}

if (user.role === 'admin') {
  document.getElementById('adminActions').style.display = 'block';
  document.getElementById('addProductBtn').onclick = function() {
    fetchDistributorsForProductForm(() => fetchCategoriesForProductForm(() => showProductForm()));
  };
}

function showProductForm(product = {}) {
  const section = document.getElementById('productFormSection');
  section.style.display = 'block';
  let commerceOptions = distributorsList.map(d => `<option value="${d.id}" ${product.id_commerce == d.id ? 'selected' : ''}>${d.commerce_name}</option>`).join('');
  let categoryOptions = categoriesList.map(c => `<option value="${c.id_category}" ${product.id_category == c.id_category ? 'selected' : ''}>${c.category_name}</option>`).join('');
  section.innerHTML = `
    <form id="productForm">
      <input type="text" name="product_name" placeholder="Nombre" value="${product.product_name || ''}" required><br>
      <input type="text" name="serial_number" placeholder="Serie" value="${product.serial_number || ''}" required><br>
      <input type="text" name="product_details" placeholder="Detalles" value="${product.product_details || ''}"><br>
      <div class='price-group'>
        <input type="number" name="price" placeholder="Precio" value="${product.price || ''}" required step="0.01" min="0">
        <span>Bs</span>
      </div>
      <br>
      <input type="number" name="amount" placeholder="Cantidad" value="${product.amount || ''}" required><br>
      <select name="id_commerce" id="commerceSelect" required><option value="">Selecciona Comercio</option>${commerceOptions}</select><br>
      <select name="id_category" id="categorySelect" required><option value="">Selecciona Categoría</option>${categoryOptions}</select><br>
      <button type="submit">${product.id ? 'Actualizar' : 'Agregar'} Producto</button>
      <button type="button" onclick="hideProductForm()">Cancelar</button>
    </form>
    <div id="productFormError" style="color:#d9534f;text-align:center;"></div>
  `;
  document.getElementById('productForm').onsubmit = function(e) {
    e.preventDefault();
    const commerce = document.getElementById('commerceSelect').value;
    const category = document.getElementById('categorySelect').value;
    const name = this.product_name.value.trim();
    const serial = this.serial_number.value.trim();
    const price = this.price.value.trim();
    const amount = this.amount.value.trim();
    if (!name || !serial || !price || !amount || !commerce || !category) {
      document.getElementById('productFormError').innerText = 'Por favor completa todos los campos requeridos.';
      return;
    }
    const formData = Object.fromEntries(new FormData(this));
    formData.id_commerce = parseInt(formData.id_commerce);
    formData.id_category = parseInt(formData.id_category);
    if (product.id) {
      fetch(`http://localhost:3001/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + accessToken },
        body: JSON.stringify(formData)
      }).then(() => { hideProductForm(); fetchProducts(); });
    } else {
      fetch('http://localhost:3001/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + accessToken },
        body: JSON.stringify(formData)
      }).then(() => { hideProductForm(); fetchProducts(); });
    }
  };
}

function hideProductForm() {
  const section = document.getElementById('productFormSection');
  section.style.display = 'none';
  section.innerHTML = '';
}

window.editProduct = function(id) {
  fetch(`http://localhost:3001/api/products/${id}`, {
    headers: { 'Authorization': 'Bearer ' + accessToken }
  })
    .then(res => res.json())
    .then(product => fetchDistributorsForProductForm(() => fetchCategoriesForProductForm(() => showProductForm(product))));
};

window.deleteProduct = function(id) {
  if (confirm('¿Eliminar este producto?')) {
    fetch(`http://localhost:3001/api/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + accessToken }
    }).then(() => fetchProducts());
  }
};

fetchProducts();

document.getElementById('downloadProductsPdfBtn').onclick = function() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text('Listado de Productos', 14, 14);
  doc.autoTable({
    html: '#productsTable',
    startY: 20,
    headStyles: { fillColor: [0, 123, 255] },
    styles: { font: 'helvetica', fontSize: 10 },
    theme: 'striped',
  });
  doc.save('productos.pdf');
};
