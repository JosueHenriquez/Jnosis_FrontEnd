// Configuración base de la API
const API_URL = 'http://localhost:8080/api'; // Ajusta según tu endpoint
const HEADERS = {
    'Content-Type': 'application/json',
    'Accept' : 'application/json',
    'Authorization': 'Bearer token' // Si usas autenticación
};

// Elementos del DOM
const tableBody = document.querySelector('#data-table tbody');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const addBtn = document.getElementById('add-btn');

// ==================== FUNCIONES PARA CONSUMIR LA API ====================

// Obtener todos los registros
async function fetchUsers() {
    try {
        const response = await fetch(`${API_URL}/usuarios`, {
            method: 'GET',
            mode: "cors", // Importante para CORS
            headers: HEADERS,
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        showAlert('Error al cargar datos', 'error');
        return [];
    }
}

// Crear nuevo registro
async function createUser(userData) {
    try {
        const response = await fetch(`${API_URL}/ingresarUsuario`, {
            method: 'POST',
            mode: "cors", // Importante para CORS
            headers: HEADERS,
            body: JSON.stringify(userData),
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error al crear usuario:', error);
        throw error;
    }
}

// Actualizar registro
async function updateUser(id, userData) {
    try {
        const response = await fetch(`${API_URL}/modificarUsuario/${id}`, {
            method: 'PUT',
            mode : "cors", // Importante para CORS
            headers: HEADERS,
            body: JSON.stringify(userData),
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        throw error;
    }
}

// Eliminar registro
async function deleteUser(id) {
    try {
        const response = await fetch(`${API_URL}/eliminarusuario/${id}`, {
            method: 'DELETE',
            mode : "cors", // Importante para CORS
            headers: HEADERS,
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        return true;
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        throw error;
    }
}

// ==================== MANEJO DE LA INTERFAZ ====================

// Cargar datos en la tabla
async function loadTableData() {
    try {
        const users = await fetchUsers();
        renderTable(users);
    } catch (error) {
        console.error('Error:', error);
    }
}

function renderTable(users) {
    tableBody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td class="hidden">${user.id}</td>
            <td>${user.nombre}</td>
            <td>${user.apellido}</td>
            <td>${user.idGrupoExpo}</td>
            <td>${user.idRol}</td>
            <td>${user.correo}</td>
            <td>${user.idCargo}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" data-id="${user.id}">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-delete" data-id="${user.id}">
                        <i class="fas fa-trash-alt"></i> Eliminar
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });

    // Agregar eventos a los botones
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', handleEdit);
    });
    
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', handleDelete);
    });
}

// Función de búsqueda
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    
    fetchUsers().then(users => {
        const filteredUsers = users.filter(user => 
            user.nombre.toLowerCase().includes(searchTerm) ||
            user.apellido.toLowerCase().includes(searchTerm) ||
            user.correo.toLowerCase().includes(searchTerm)
        );
        renderTable(filteredUsers);
    });
}

// ==================== MANEJO DE EVENTOS ====================

// Nuevo registro
addBtn.addEventListener('click', () => {
    openModal('new');
});

// Editar registro
async function handleEdit(e) {
    const userId = e.target.getAttribute('data-id');
    try {
        const response = await fetch(`${API_URL}/usuarios/${userId}`, {
            method: 'GET',
            headers: HEADERS
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const userData = await response.json();
        openModal('edit', userData);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        showAlert('Error al cargar datos del usuario', 'error');
    }
}

// Eliminar registro
async function handleDelete(e) {
    const userId = e.target.getAttribute('data-id');
    
    if (confirm('¿Estás seguro de eliminar este registro?')) {
        try {
            const success = await deleteUser(userId);
            if (success) {
                showAlert('Registro eliminado correctamente', 'success');
                loadTableData();
            }
        } catch (error) {
            showAlert('Error al eliminar el registro', 'error');
        }
    }
}

// ==================== MODAL PARA FORMULARIO ====================

function openModal(action, userData = null) {
    // Implementación básica (puedes usar un modal de Bootstrap o similar)
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    
    modal.innerHTML = `
        <div class="modal-content">
            <h2>${action === 'new' ? 'Nuevo Usuario' : 'Editar Usuario'}</h2>
            <form id="user-form">
                <input type="hidden" id="user-id" value="${userData?.id || ''}">
                
                <div class="form-group">
                    <label for="nombre">Nombre</label>
                    <input type="text" id="nombre" value="${userData?.nombre || ''}" required>
                </div>
                
                <!-- Agrega todos los campos necesarios aquí -->
                
                <div class="form-actions">
                    <button type="button" class="btn-cancel">Cancelar</button>
                    <button type="submit" class="btn-submit">Guardar</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Manejar envío del formulario
    document.getElementById('user-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            // Agrega todos los campos del formulario
        };
        
        try {
            if (action === 'new') {
                await createUser(formData);
                showAlert('Usuario creado correctamente', 'success');
            } else {
                await updateUser(userData.id, formData);
                showAlert('Usuario actualizado correctamente', 'success');
            }
            
            loadTableData();
            document.body.removeChild(modal);
        } catch (error) {
            showAlert('Error al guardar los datos', 'error');
        }
    });
    
    // Cerrar modal
    modal.querySelector('.btn-cancel').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}

// ==================== UTILIDADES ====================

function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        document.body.removeChild(alert);
    }, 3000);
}

// Inicializar
document.addEventListener('DOMContentLoaded', loadTableData);