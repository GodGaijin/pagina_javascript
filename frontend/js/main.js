function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

const accessToken = localStorage.getItem('accessToken');
if (!accessToken) {
  window.location.href = 'index.html';
}
const user = parseJwt(accessToken);
if (user) {
  document.getElementById('welcomeMsg').innerText = `¡Hola, ${user.username} (${user.role === 'admin' ? 'administrador' : 'usuario'})!`;
  if (user.role === 'admin') {
    document.getElementById('auditBtn').style.display = '';
    document.getElementById('auditBtn').onclick = function() {
      location.href = 'audits.html';
    };
  }
}
document.getElementById('logoutBtn').onclick = function() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  window.location.href = 'index.html';
}; 