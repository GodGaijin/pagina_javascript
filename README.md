# Sistema de Inventario

Este es un sistema completo de inventario con backend en Node.js/Express/SQLite y frontend en HTML5/JS, con autenticación JWT, roles de usuario/admin, auditoría de acciones y una interfaz moderna en español.

---

## Características Principales

- **Autenticación JWT** (login, registro, refresh)
- **Roles:** usuario y administrador (analista)
- **CRUD** para productos, distribuidores y categorías
- **Auditoría:** registro de todas las acciones de creación, edición y borrado (solo visible para admins)
- **Base de datos SQLite** local, con claves foráneas y restricciones
- **Frontend moderno** en español, validaciones y mensajes.
- **Descarga de PDF:** cada módulo de productos, categorías y distribuidores permite descargar la tabla completa como PDF.
- **Zona horaria:** todos los registros de auditoría se muestran en hora de Venezuela (America/Caracas)
- **Restricciones:** no se pueden eliminar distribuidores/categorías asignados a productos
- **Contraseñas seguras:** mínimo una letra, un número y un carácter especial
- **Registro de admin:** requiere código especial oculto

---

## Instalación

1. Descarga o clona el repositorio.
2. Abre una terminal en la carpeta raíz del proyecto (`pagina javascript`).
3. Instala las dependencias del backend ejecutando:
   ```
   npm install
   ```
   Esto instalará:
   - **express**: Framework web para Node.js
   - **sqlite3**: Driver para base de datos SQLite
   - **jsonwebtoken**: Manejo de JWT para autenticación
   - **bcryptjs**: Encriptación de contraseñas
   - **cors**: Middleware para CORS
   - **dotenv**: Variables de entorno

4. **Dependencias del frontend**  
   No es necesario instalar dependencias adicionales.
   Para la descarga de PDF, se usan las siguientes librerías vía CDN (ya incluidas en los archivos HTML correspondientes):
   - [jsPDF](https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js)
   - [jsPDF-AutoTable](https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js)

5. Inicia el servidor desde la raíz del proyecto:
   ```
   node app.js
   ```
   El archivo de base de datos se creará automáticamente.

---

## Estructura del Proyecto

- **backend/**: Lógica del servidor, modelos, controladores, rutas, middlewares y base de datos.
- **frontend/**: Archivos HTML, JS y CSS para la interfaz de usuario.

---

## Endpoints de la API

- `POST /api/auth/register` — Registrar usuario (requiere código para admin)
- `POST /api/auth/login` — Iniciar sesión
- `POST /api/auth/refresh` — Refrescar tokens

- `GET /api/products` — Listar productos (autenticado)
- `POST /api/products` — Crear producto (solo admin)
- `PUT /api/products/:id` — Editar producto (solo admin)
- `DELETE /api/products/:id` — Eliminar producto (solo admin)

- `GET /api/distributors` — Listar distribuidores (autenticado)
- `POST /api/distributors` — Crear distribuidor (solo admin)
- `PUT /api/distributors/:id` — Editar distribuidor (solo admin)
- `DELETE /api/distributors/:id` — Eliminar distribuidor (solo admin, solo si no está asignado a productos)

- `GET /api/categories` — Listar categorías (autenticado)
- `POST /api/categories` — Crear categoría (solo admin)
- `PUT /api/categories/:id` — Editar categoría (solo admin)
- `DELETE /api/categories/:id` — Eliminar categoría (solo admin, solo si no está asignada a productos)

- `GET /api/audits` — Ver auditoría (solo admin)

---

## Uso de la Página Web

1. Abre `frontend/index.html` en tu navegador.
2. **Registro:**  
   - Completa usuario y contraseña (debe tener al menos una letra, un número y un carácter especial).
   - Selecciona el rol:  
     - **Usuario:** solo visualiza información.  
     - **Administrador:** requiere ingresar el código especial en el campo oculto.
3. **Inicio de sesión:**  
   - Ingresa tus credenciales y accede al menú principal.
4. **Menú principal (`main.html`):**  
   - Acceso a productos, categorías, distribuidores y, si eres admin, al módulo de auditoría.
   - El botón "Auditoría" solo aparece para administradores.
5. **CRUDs:**  
   - **Productos:**  
     - Formulario con todos los campos requeridos.  
     - Selección de distribuidor y categoría mediante listas desplegables.  
     - Precio siempre en Bs, con dos decimales.
     - Botón para descargar la tabla de productos como PDF (incluye todos los datos visibles).
   - **Categorías y Distribuidores:**  
     - Solo pueden eliminarse si no están asignados a productos.
     - Botón para descargar la tabla de categorías o distribuidores como PDF (incluye todos los datos visibles).
   - **Acciones de edición y borrado** solo visibles para admins.
6. **Datos del Comercio:**  
   - Accesible desde el menú principal para todos los usuarios.
   - Muestra los datos del comercio (Nombre, RIF, Ubicación, Descripción) en formato vertical (una fila por campo).
   - Solo los administradores pueden editar estos datos.
7. **Auditoría (`audits.html`):**  
   - Solo visible para admins.  
   - Muestra usuario, acción, entidad, ID y fecha/hora (en hora de Venezuela).
   - Acceso desde el menú principal.
8. **Cerrar sesión:**  
   - Usa el botón "Cerrar Sesión" para salir del sistema.

---

## Validaciones y Seguridad

- **Contraseña:**  
  - Debe contener al menos una letra, un número y un carácter especial (validado en frontend y backend).
- **Registro de admin:**  
  - Requiere el código especial (campo oculto tipo password).
- **Tokens:**  
  - El frontend maneja automáticamente los tokens de acceso y refresco.
- **Restricciones:**  
  - No se pueden eliminar distribuidores/categorías asignados a productos (mensaje amigable).
- **Auditoría:**  
  - Todas las acciones de creación, edición y borrado quedan registradas con usuario, acción, entidad, ID y timestamp.
  - Los timestamps se almacenan en UTC y se muestran en hora de Venezuela.

---

## Archivos Principales del Frontend

- `index.html` — Login y registro
- `main.html` — Menú principal
- `products.html` — CRUD de productos
- `categories.html` — CRUD de categorías
- `distributors.html` — CRUD de distribuidores
- `audits.html` — Auditoría (solo admin)
- `js/` — Lógica de cada módulo (productos.js, categories.js, distributors.js, main.js, index.js, audits.js)
- `css/styles.css` — Estilos modernos y responsivos

---

## Otras secciones

### Descarga de PDF

En los módulos de **productos**, **categorías** y **distribuidores** encontrarás un botón "Descargar PDF" que te permite exportar toda la tabla actual a un archivo PDF profesional, usando jsPDF y jsPDF-AutoTable. El PDF incluye todas las filas y columnas visibles, con formato y título.

### Datos del Comercio

En la sección "Datos del Comercio" puedes consultar la información principal del comercio (Nombre, RIF, Ubicación, Descripción) en formato vertical. Solo los administradores pueden editar estos datos.

---