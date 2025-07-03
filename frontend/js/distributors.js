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

function fetchDistributors() {
  fetch('http://localhost:3001/api/distributors', {
    headers: { 'Authorization': 'Bearer ' + accessToken }
  })
    .then(res => {
      if (res.status === 401 || res.status === 403) window.location.href = 'index.html';
      return res.json();
    })
    .then(distributors => {
      const tbody = document.querySelector('#distributorsTable tbody');
      tbody.innerHTML = '';
      distributors.forEach(distributor => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${distributor.commerce_name}</td>
          <td>${distributor.location}</td>
          <td>
            ${user.role === 'admin' ? `<button onclick="editDistributor(${distributor.id})">Editar</button> <button onclick="deleteDistributor(${distributor.id})">Eliminar</button>` : ''}
          </td>
        `;
        tbody.appendChild(tr);
      });
    });
}

if (user.role === 'admin') {
  document.getElementById('adminActions').style.display = 'block';
  document.getElementById('addDistributorBtn').onclick = function() {
    showDistributorForm();
  };
}

function showDistributorForm(distributor = {}) {
  const section = document.getElementById('distributorFormSection');
  section.style.display = 'block';
  section.innerHTML = `
    <form id="distributorForm">
      <input type="text" name="commerce_name" placeholder="Comercio" value="${distributor.commerce_name || ''}" required><br>
      <input type="text" name="location" placeholder="Ubicación" value="${distributor.location || ''}" required><br>
      <button type="submit">${distributor.id ? 'Actualizar' : 'Agregar'} Distribuidor</button>
      <button type="button" onclick="hideDistributorForm()">Cancelar</button>
    </form>
    <div id="distributorFormError" style="color:#d9534f;text-align:center;"></div>
  `;
  document.getElementById('distributorForm').onsubmit = function(e) {
    e.preventDefault();
    const name = this.commerce_name.value.trim();
    const location = this.location.value.trim();
    if (!name || !location) {
      document.getElementById('distributorFormError').innerText = 'Por favor completa todos los campos requeridos.';
      return;
    }
    const formData = Object.fromEntries(new FormData(this));
    if (distributor.id) {
      fetch(`http://localhost:3001/api/distributors/${distributor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + accessToken },
        body: JSON.stringify(formData)
      }).then(() => { hideDistributorForm(); fetchDistributors(); });
    } else {
      fetch('http://localhost:3001/api/distributors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + accessToken },
        body: JSON.stringify(formData)
      }).then(() => { hideDistributorForm(); fetchDistributors(); });
    }
  };
}

function hideDistributorForm() {
  const section = document.getElementById('distributorFormSection');
  section.style.display = 'none';
  section.innerHTML = '';
}

window.editDistributor = function(id) {
  fetch(`http://localhost:3001/api/distributors/${id}`, {
    headers: { 'Authorization': 'Bearer ' + accessToken }
  })
    .then(res => res.json())
    .then(distributor => showDistributorForm(distributor));
};

window.deleteDistributor = function(id) {
  if (confirm('¿Eliminar este distribuidor?')) {
    fetch(`http://localhost:3001/api/distributors/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + accessToken }
    })
      .then(async res => {
        if (!res.ok) {
          const data = await res.json();
          alert(data.message || 'No se puede eliminar el distribuidor: está asignado a uno o más productos.');
          return;
        }
        fetchDistributors();
      });
  }
};

fetchDistributors();

document.getElementById('downloadDistributorsPdfBtn').onclick = function() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text('Listado de Distribuidores', 14, 14);
  doc.autoTable({
    html: '#distributorsTable',
    startY: 20,
    headStyles: { fillColor: [0, 123, 255] },
    styles: { font: 'helvetica', fontSize: 10 },
    theme: 'striped',
  });
  doc.save('distribuidores.pdf');
}; 