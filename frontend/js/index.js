document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const res = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (res.ok) {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    window.location.href = 'main.html';
  } else {
    document.getElementById('message').innerText = data.message || 'Error al iniciar sesión';
  }
});

document.getElementById('showRegister').onclick = function() {
  document.getElementById('registerSection').style.display = 'block';
  document.getElementById('loginForm').style.display = 'none';
};
document.getElementById('backToLogin').onclick = function() {
  document.getElementById('registerSection').style.display = 'none';
  document.getElementById('loginForm').style.display = 'block';
};
document.getElementById('registerForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const username = document.getElementById('regUsername').value;
  const password = document.getElementById('regPassword').value;
  const role = document.getElementById('regRole').value;
  const adminCode = document.getElementById('adminCode').value;
  // Validación de contraseña en frontend
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/;
  if (!passwordRegex.test(password)) {
    document.getElementById('message').innerText = 'La contraseña debe contener al menos una letra, un número y un caracter especial.';
    return;
  }
  if (role === 'admin' && adminCode !== '10052019') {
    document.getElementById('message').innerText = 'Código de administrador incorrecto.';
    return;
  }
  const res = await fetch('http://localhost:3001/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, role, adminCode })
  });
  const data = await res.json();
  if (res.ok) {
    document.getElementById('message').innerText = '¡Registro exitoso! Por favor inicia sesión.';
    document.getElementById('registerSection').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
  } else {
    document.getElementById('message').innerText = data.message || 'Error al registrarse';
  }
}); 