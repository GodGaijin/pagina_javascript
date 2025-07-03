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
if (!user || user.role !== 'admin') window.location.href = 'index.html';

function fetchAudits() {
  fetch('http://localhost:3001/api/audits', {
    headers: { 'Authorization': 'Bearer ' + accessToken }
  })
    .then(res => {
      if (!res.ok) throw new Error('No autorizado');
      return res.json();
    })
    .then(audits => {
      const tbody = document.querySelector('#auditsTable tbody');
      tbody.innerHTML = '';
      audits.forEach(audit => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${audit.username}</td>
          <td>${audit.action}</td>
          <td>${audit.entity}</td>
          <td>${audit.entity_id}</td>
          <td>${new Date(audit.timestamp + 'Z').toLocaleString('es-VE', { timeZone: 'America/Caracas' })}</td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(err => {
      document.getElementById('auditError').innerText = 'No autorizado o error al cargar auditoría.';
    });
}

fetchAudits(); 