async function validar (){
  try {
    const response = await fetch("http://localhost:8080/api/auth/validate", {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      document.body.style.display = "block"; // ✅ Mostrar contenido
    } else {
      window.location.href = "login.html"; // ❌ Redirigir si no hay sesión
    }
  } catch (err) {
    console.error("Error validando sesión:", err);
    window.location.href = "login.html";
  }
}

validar();