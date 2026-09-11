document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
  const navToggle = document.querySelector('.nav-mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navbar = document.querySelector('.navbar');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
  }

  // Navbar Scroll Effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Passes Data
  const passes = [
    { id: 'single', name: 'Single Pass', price: '₹199' },
    { id: 'couple', name: 'Couple Pass', price: '₹349' },
    { id: 'combo5', name: '5 Combo Pass', price: '₹799' },
    { id: 'combo10', name: '10 Mega Combo Pass', price: '₹1499' }
  ];

  // Pass Selection Logic
  const passCards = document.querySelectorAll('.pass-card');
  const ticketSelect = document.getElementById('ticket-type');

  if (passCards.length > 0 && ticketSelect) {
    // Populate select options
    ticketSelect.innerHTML = '<option value="" disabled selected>Select your pass</option>';
    passes.forEach(pass => {
      const option = document.createElement('option');
      option.value = `${pass.name} — ${pass.price}`;
      option.textContent = `${pass.name} — ${pass.price}`;
      ticketSelect.appendChild(option);
    });

    // Handle card clicks
    passCards.forEach(card => {
      card.addEventListener('click', () => {
        // Remove active class from all
        passCards.forEach(c => c.classList.remove('active'));
        // Add active class to clicked
        card.classList.add('active');
        
        // Update select value
        const passId = card.getAttribute('data-pass-id');
        const selectedPass = passes.find(p => p.id === passId);
        if (selectedPass) {
          ticketSelect.value = `${selectedPass.name} — ${selectedPass.price}`;
        }
        
        // Scroll to form smoothly
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  // Form Validation and Submission
  const contactForm = document.getElementById('pass-form');
  const formMessage = document.getElementById('form-message');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const ig = document.getElementById('ig').value.trim();
      const ticket = document.getElementById('ticket-type').value;

      let isValid = true;
      let errorMsg = '';

      if (!name) {
        isValid = false;
        errorMsg = 'Name is required.';
      } else if (!phone || !/^\+?[0-9\s\-]{10,15}$/.test(phone)) {
        isValid = false;
        errorMsg = 'Please enter a valid phone number.';
      } else if (!ig) {
        isValid = false;
        errorMsg = 'Instagram / Facebook ID is required.';
      } else if (!ticket) {
        isValid = false;
        errorMsg = 'Please select a ticket type.';
      }

      if (!isValid) {
        formMessage.textContent = errorMsg;
        formMessage.style.borderColor = 'red';
        formMessage.classList.add('active');
        return;
      }

      submitBtn.textContent = 'Processing...';
      submitBtn.disabled = true;
      formMessage.classList.remove('active');

      const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzdryD4GYBnKy-qpxAbEql5xD-rdmFvW4QYvxPtSdHuYFHgFJ_vFlQCnm7qfGhBQ_6N/exec';
      const payload = {
        name: name,
        phone: phone,
        socialId: ig,
        ticketType: ticket
      };

      try {
        await fetch(SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        formMessage.innerHTML = `<strong>REQUEST RECEIVED.</strong><br>Thank you, ${name}. We'll get back to you shortly regarding your pass.`;
        formMessage.style.borderColor = 'var(--accent-primary)';
        formMessage.classList.add('active');
        contactForm.reset();
        
        passCards.forEach(c => c.classList.remove('active'));
      } catch (error) {
        formMessage.textContent = 'An error occurred while submitting the form. Please try again.';
        formMessage.style.borderColor = 'red';
        formMessage.classList.add('active');
      } finally {
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  }

  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      // Close all
      faqItems.forEach(i => i.classList.remove('active'));
      // Open clicked if it wasn't active
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // Scroll Animations (Intersection Observer)
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // observer.unobserve(entry.target); // keep observing or not? usually unobserve after first view
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-up').forEach(el => {
    observer.observe(el);
  });
});
