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

function fetchCategories() {
  fetch('http://localhost:3001/api/categories', {
    headers: { 'Authorization': 'Bearer ' + accessToken }
  })
    .then(res => {
      if (res.status === 401 || res.status === 403) window.location.href = 'index.html';
      return res.json();
    })
    .then(categories => {
      const tbody = document.querySelector('#categoriesTable tbody');
      tbody.innerHTML = '';
      categories.forEach(category => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${category.category_name}</td>
          <td>${category.category_details}</td>
          <td>
            ${user.role === 'admin' ? `<button onclick="editCategory(${category.id_category})">Editar</button> <button onclick="deleteCategory(${category.id_category})">Eliminar</button>` : ''}
          </td>
        `;
        tbody.appendChild(tr);
      });
    });
}

if (user.role === 'admin') {
  document.getElementById('adminActions').style.display = 'block';
  document.getElementById('addCategoryBtn').onclick = function() {
    showCategoryForm();
  };
}

function showCategoryForm(category = {}) {
  const section = document.getElementById('categoryFormSection');
  section.style.display = 'block';
  section.innerHTML = `
    <form id="categoryForm">
      <input type="text" name="category_name" placeholder="Nombre" value="${category.category_name || ''}" required><br>
      <input type="text" name="category_details" placeholder="Detalles" value="${category.category_details || ''}" required><br>
      <button type="submit">${category.id_category ? 'Actualizar' : 'Agregar'} Categoría</button>
      <button type="button" onclick="hideCategoryForm()">Cancelar</button>
    </form>
    <div id="categoryFormError" style="color:#d9534f;text-align:center;"></div>
  `;
  document.getElementById('categoryForm').onsubmit = function(e) {
    e.preventDefault();
    const name = this.category_name.value.trim();
    const details = this.category_details.value.trim();
    if (!name || !details) {
      document.getElementById('categoryFormError').innerText = 'Por favor completa todos los campos requeridos.';
      return;
    }
    const formData = Object.fromEntries(new FormData(this));
    if (category.id_category) {
      fetch(`http://localhost:3001/api/categories/${category.id_category}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + accessToken },
        body: JSON.stringify(formData)
      }).then(() => { hideCategoryForm(); fetchCategories(); });
    } else {
      fetch('http://localhost:3001/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + accessToken },
        body: JSON.stringify(formData)
      }).then(() => { hideCategoryForm(); fetchCategories(); });
    }
  };
}

function hideCategoryForm() {
  const section = document.getElementById('categoryFormSection');
  section.style.display = 'none';
  section.innerHTML = '';
}

window.editCategory = function(id) {
  fetch(`http://localhost:3001/api/categories/${id}`, {
    headers: { 'Authorization': 'Bearer ' + accessToken }
  })
    .then(res => res.json())
    .then(category => showCategoryForm(category));
};

window.deleteCategory = function(id) {
  if (confirm('¿Eliminar esta categoría?')) {
    fetch(`http://localhost:3001/api/categories/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + accessToken }
    })
      .then(async res => {
        if (!res.ok) {
          const data = await res.json();
          alert(data.message || 'No se puede eliminar la categoría: está asignada a uno o más productos.');
          return;
        }
        fetchCategories();
      });
  }
};

fetchCategories();

document.getElementById('downloadCategoriesPdfBtn').onclick = function() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text('Listado de Categorías', 14, 14);
  doc.autoTable({
    html: '#categoriesTable',
    startY: 20,
    headStyles: { fillColor: [0, 123, 255] },
    styles: { font: 'helvetica', fontSize: 10 },
    theme: 'striped',
  });
  doc.save('categorias.pdf');
}; 