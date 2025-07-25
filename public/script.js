// Mobile menu toggle
document.getElementById('menu-btn')?.addEventListener('click', function () {
  const menu = document.getElementById('mobile-menu');
  menu?.classList.toggle('hidden');
});

// CV Download
document.querySelector('a[download]')?.addEventListener('click', function (e) {
  console.log('CV downloaded');

  fetch(this.href)
    .then(response => {
      if (!response.ok) {
        throw new Error('File not found');
      }
    })
    .catch(error => {
      alert('CV file not available: ' + error.message);
      e.preventDefault();
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });

      const mobileMenu = document.getElementById('mobile-menu');
      if (!mobileMenu?.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
      }
    }
  });
});

// Contact form submission
document.getElementById('contact-form')?.addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();
  const responseMsg = document.getElementById('response-msg');

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, subject, message })
    });

    const data = await res.json();
    if (res.ok) {
      responseMsg.textContent = '✅ ' + data.message;
      responseMsg.classList.remove('text-red-500');
      responseMsg.classList.add('text-green-400');
      this.reset(); // Reset only on success
    } else {
      responseMsg.textContent = '❌ ' + (data.error || 'Something went wrong.');
      responseMsg.classList.remove('text-green-400');
      responseMsg.classList.add('text-red-500');
    }
  } catch (error) {
    responseMsg.textContent = '❌ Network error.';
    responseMsg.classList.add('text-red-500');
  }
});
