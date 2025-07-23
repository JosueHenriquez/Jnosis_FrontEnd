const API_URL = "http://localhost:8080/api"; // Endpoint

document.addEventListener("DOMContentLoaded", function () {
  // Toggle sidebar en móviles
  const sidebarToggle = document.createElement("button");
  sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>';
  sidebarToggle.className = "sidebar-toggle";
  document.querySelector(".top-bar").prepend(sidebarToggle);

  sidebarToggle.addEventListener("click", function () {
    document.querySelector(".sidebar").classList.toggle("active");
  });

  // Simular carga de datos
  simulateDataLoading();

  // Inicializar tooltips
  initTooltips();

  // Configurar eventos de checkboxes
  setupTaskCheckboxes();
});

document.getElementById("btnLogout").addEventListener("click", async () => {
  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  window.location.href = "login.html";
});


function simulateDataLoading() {
  // Simular carga de estadísticas con animación
  const stats = document.querySelectorAll(".stat-info h3");
  stats.forEach((stat) => {
    const target = parseInt(stat.textContent);
    let current = 0;
    const increment = target / 20;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        clearInterval(timer);
        stat.textContent = target;
      } else {
        stat.textContent = Math.floor(current);
      }
    }, 50);
  });

  // Simular carga de barras de progreso
  const progressBars = document.querySelectorAll(".progress");
  progressBars.forEach((bar) => {
    const width = bar.style.width;
    bar.style.width = "0";
    setTimeout(() => {
      bar.style.width = width;
    }, 300);
  });
}

function initTooltips() {
  // Agregar tooltips a los iconos del sidebar cuando está colapsado
  const sidebar = document.querySelector(".sidebar");
  const navItems = document.querySelectorAll(".sidebar-nav li a");

  navItems.forEach((item) => {
    const tooltip = document.createElement("span");
    tooltip.className = "tooltip";
    tooltip.textContent = item.querySelector("span").textContent;
    item.appendChild(tooltip);
  });

  // Verificar si el sidebar está colapsado
  function checkSidebar() {
    if (sidebar.classList.contains("active") || window.innerWidth <= 992) {
      navItems.forEach((item) => {
        item.querySelector(".tooltip").style.visibility = "visible";
      });
    } else {
      navItems.forEach((item) => {
        item.querySelector(".tooltip").style.visibility = "hidden";
      });
    }
  }

  checkSidebar();
  window.addEventListener("resize", checkSidebar);
}

function setupTaskCheckboxes() {
  const checkboxes = document.querySelectorAll(
    '.task-check input[type="checkbox"]'
  );

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const taskItem = this.closest(".task-item");
      if (this.checked) {
        taskItem.style.opacity = "0.7";
      } else {
        taskItem.style.opacity = "1";
      }
    });
  });
}
