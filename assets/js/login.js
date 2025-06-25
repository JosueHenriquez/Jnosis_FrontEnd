document.addEventListener('DOMContentLoaded', function() {
    // Asegurar que los inputs no se salgan en móviles
    function adjustInputs() {
        const inputs = document.querySelectorAll('.input-container input');
        const cardWidth = document.querySelector('.login-card').offsetWidth;
        
        inputs.forEach(input => {
            input.style.maxWidth = (cardWidth - 60) + 'px';
        });
    }
    
    // Ejecutar al cargar y al redimensionar
    adjustInputs();
    window.addEventListener('resize', adjustInputs);
    
    // Resto del código existente...
    const inputs = document.querySelectorAll('.input-container input');
    
    inputs.forEach(input => {
        const icon = input.parentElement.querySelector('.input-icon');
        
        input.addEventListener('focus', function() {
            icon.style.color = '#89CFF0';
            input.parentElement.parentElement.querySelector('label').style.color = '#5D8AA8';
        });
        
        input.addEventListener('blur', function() {
            if (!input.value) {
                icon.style.color = '#aaa';
                input.parentElement.parentElement.querySelector('label').style.color = '#5D8AA8';
            }
        });
        
        input.addEventListener('input', function() {
            if (input.value) {
                icon.style.color = '#4CAF50';
            } else {
                icon.style.color = '#aaa';
            }
        });
    });
    
    const loginBtn = document.querySelector('.login-btn');
    const loginForm = document.querySelector('.login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const username = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            // Validación básica
            if (!username || !password) {
              alert("Por favor, completa todos los campos");
              return;
            }

            
          try {
            const request = await fetch("http://localhost:8080/api/auth/login", {
              method: "POST",
              mode: "cors", // Importante para CORS
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({ correo: username, contrasena: password }),
              credentials: "include", // Para cookies/tokens
            });

            //alert(JSON.stringify({correo:username, contrasena:password}))
            if (!request.ok) {
              throw new Error("Credenciales incorrectas");
            }

            const data = await request.text();

            // Simulación de éxito
            alert("Inicio de sesión exitoso");
            console.log("Login exitoso", { username, password, rememberMe });

            // Redirección simulada
            setTimeout(() => {
              window.location.href = "dashboard.html";
            }, 1500);
          } catch (error) {
            alert(error.message);
            alert(error.message || "Error al iniciar sesión");
          } finally {
            btnText.textContent = "Iniciar Sesión";
            loader.classList.add("hidden");
            loginBtn.disabled = false;
          }

        });
    }
});

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.querySelector('.toggle-password');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.replace('fa-eye-slash', 'fa-eye');
        toggleIcon.style.color = '#89CFF0';
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.replace('fa-eye', 'fa-eye-slash');
        toggleIcon.style.color = '#aaa';
    }
}






// Envío del formulario
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    
    const rememberMe = document.querySelector('input[name="remember"]').checked;

    

  });