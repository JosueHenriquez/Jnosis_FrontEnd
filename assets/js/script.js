document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    const btnText = document.querySelector('.btn-text');
    const loader = document.getElementById('loader');
    
    // Mostrar/ocultar contraseña
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.querySelector('i').classList.toggle('fa-eye');
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });
    
    // Animación al enfocar inputs
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.querySelector('label').style.color = '#4361ee';
            this.parentElement.querySelector('.underline').style.width = '100%';
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.querySelector('label').style.color = '#6c757d';
                this.parentElement.querySelector('.underline').style.width = '0';
            }
        });
        
        // Validación en tiempo real
        input.addEventListener('input', function() {
            if (this.value) {
                this.parentElement.querySelector('label').classList.add('active');
            } else {
                this.parentElement.querySelector('label').classList.remove('active');
            }
        });
    });
    
    // Envío del formulario
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.querySelector('input[name="remember"]').checked;
        
        // Validación básica
        if (!username || !password) {
            showError('Por favor, completa todos los campos');
            return;
        }
        
        // Mostrar loader
        btnText.textContent = 'Procesando...';
        loader.classList.remove('hidden');
        loginBtn.disabled = true;
        
        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                mode: 'cors', // Importante para CORS
                credentials: 'include', // Para cookies/tokens
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            
            if (!response.ok) {
                throw new Error('Credenciales incorrectas');
            }
            
            const data = await response.json();
            
            
            // Simulación de éxito
            showSuccess('Inicio de sesión exitoso');
            console.log('Login exitoso', { username, password, rememberMe });
            
            // Redirección simulada
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
            
        } catch (error) {
            showError(error.message || 'Error al iniciar sesión');
        } finally {
            btnText.textContent = 'Iniciar Sesión';
            loader.classList.add('hidden');
            loginBtn.disabled = false;
        }
    });
    
    function showError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.color = '#f72585';
        errorElement.style.marginTop = '10px';
        errorElement.style.textAlign = 'center';
        errorElement.style.animation = 'fadeIn 0.3s ease-out';
        
        // Eliminar mensajes de error anteriores
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        loginForm.appendChild(errorElement);
        
        // Agitar el formulario para indicar error
        loginContainer.style.animation = 'shake 0.5s';
        setTimeout(() => {
            loginContainer.style.animation = '';
        }, 500);
    }
    
    function showSuccess(message) {
        const successElement = document.createElement('div');
        successElement.className = 'success-message';
        successElement.textContent = message;
        successElement.style.color = '#4cc9f0';
        successElement.style.marginTop = '10px';
        successElement.style.textAlign = 'center';
        successElement.style.animation = 'fadeIn 0.3s ease-out';
        
        // Eliminar mensajes anteriores
        const existingMessage = document.querySelector('.success-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        loginForm.appendChild(successElement);
    }
    
    // Agregar animación de shake
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
});