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
if (!user) window.location.href = 'index.html';

let ownCommerce = null;

function fetchOwnCommerce() {
  fetch('http://localhost:3001/api/own-commerce', {
    headers: { 'Authorization': 'Bearer ' + accessToken }
  })
    .then(res => res.json())
    .then(data => {
      ownCommerce = data;
      renderOwnCommerceTable();
    })
    .catch(() => {
      document.getElementById('ownCommerceError').innerText = 'Error al cargar los datos del comercio.';
    });
}

function renderOwnCommerceTable() {
  const tbody = document.querySelector('#ownCommerceTable tbody');
  tbody.innerHTML = '';
  if (!ownCommerce) return;
  const fields = [
    { label: 'Nombre', value: ownCommerce.name || '' },
    { label: 'RIF', value: ownCommerce.rif || '' },
    { label: 'Ubicación', value: ownCommerce.location || '' },
    { label: 'Descripción', value: ownCommerce.description || '' }
  ];
  fields.forEach(f => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<th style='text-align:left;'>${f.label}</th><td>${f.value}</td>`;
    tbody.appendChild(tr);
  });
}

function showOwnCommerceForm() {
  const section = document.getElementById('ownCommerceFormSection');
  section.style.display = 'block';
  section.innerHTML = `
    <form id="ownCommerceForm">
      <input type="text" name="name" placeholder="Nombre" value="${ownCommerce && ownCommerce.name ? ownCommerce.name : ''}" required><br>
      <input type="text" name="rif" placeholder="RIF" value="${ownCommerce && ownCommerce.rif ? ownCommerce.rif : ''}" required><br>
      <input type="text" name="location" placeholder="Ubicación" value="${ownCommerce && ownCommerce.location ? ownCommerce.location : ''}" required><br>
      <input type="text" name="description" placeholder="Descripción (opcional)" value="${ownCommerce && ownCommerce.description ? ownCommerce.description : ''}"><br>
      <button type="submit">Guardar</button>
      <button type="button" id="cancelEditOwnCommerce">Cancelar</button>
    </form>
  `;
  document.getElementById('cancelEditOwnCommerce').onclick = function() {
    section.style.display = 'none';
  };
  document.getElementById('ownCommerceForm').onsubmit = function(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name').trim(),
      rif: formData.get('rif').trim(),
      location: formData.get('location').trim(),
      description: formData.get('description').trim()
    };
    if (!data.name || !data.rif || !data.location) {
      document.getElementById('ownCommerceError').innerText = 'Nombre, RIF y Ubicación son obligatorios.';
      return;
    }
    fetch('http://localhost:3001/api/own-commerce', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(resp => {
        if (resp && resp.success) {
          section.style.display = 'none';
          fetchOwnCommerce();
          document.getElementById('ownCommerceError').innerText = '';
        } else {
          document.getElementById('ownCommerceError').innerText = resp.message || 'Error al guardar.';
        }
      })
      .catch(() => {
        document.getElementById('ownCommerceError').innerText = 'Error al guardar.';
      });
  };
}

if (user.role === 'admin') {
  document.getElementById('adminActions').style.display = '';
  document.getElementById('editOwnCommerceBtn').onclick = function() {
    showOwnCommerceForm();
  };
}

fetchOwnCommerce(); 