// Main Public Frontend JavaScript
document.addEventListener('DOMContentLoaded', () => {
  // Sticky Navbar shadow on scroll
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElem = document.querySelector(targetId);
        if (targetElem) {
          e.preventDefault();
          targetElem.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Client-side quick feedback for consultation form if SweetAlert2 is present
  const consultForm = document.getElementById('consultationForm');
  if (consultForm && typeof Swal !== 'undefined') {
    // Already handled or standard submit
  }
});

