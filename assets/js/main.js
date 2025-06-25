// Puedes añadir funcionalidad JavaScript aquí
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema de gestión educativa cargado');
    
    // Ejemplo de funcionalidad: Smooth scrolling para enlaces
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});