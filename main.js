import { auth, database } from './firebase-config.js';  // Import the auth and database instances
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { ref, push, set } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

// Modal functionality
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const forgotPasswordModal = document.getElementById('forgot-password-modal');
const closeButtons = document.querySelectorAll('.close-modal');
const switchToRegister = document.getElementById('switch-to-register');
const switchToLogin = document.getElementById('switch-to-login');
const forgotPassword = document.getElementById('forgot-password');
const backToLogin = document.getElementById('back-to-login');

// Open modals
loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'flex';
});

registerBtn.addEventListener('click', () => {
    registerModal.style.display = 'flex';
});

// Close modals
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        loginModal.style.display = 'none';
        registerModal.style.display = 'none';
        forgotPasswordModal.style.display = 'none';
    });
});

// Switch between modals
switchToRegister.addEventListener('click', () => {
    loginModal.style.display = 'none';
    registerModal.style.display = 'flex';
});

switchToLogin.addEventListener('click', () => {
    registerModal.style.display = 'none';
    loginModal.style.display = 'flex';
});

forgotPassword.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.style.display = 'none';
    forgotPasswordModal.style.display = 'flex';
});

backToLogin.addEventListener('click', () => {
    forgotPasswordModal.style.display = 'none';
    loginModal.style.display = 'flex';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === loginModal) loginModal.style.display = 'none';
    if (e.target === registerModal) registerModal.style.display = 'none';
    if (e.target === forgotPasswordModal) forgotPasswordModal.style.display = 'none';
});

// Form submissions with Firebase Authentication
const loginForm = document.querySelector('.login-form');
const registerForm = document.querySelector('.register-form');
const forgotPasswordForm = document.querySelector('.forgot-password-form');
const appointmentForm = document.getElementById('appointment-form');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm.querySelector('input[type="email"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            alert('Login successful!');
            loginModal.style.display = 'none';
        })
        .catch((error) => {
            alert('Login failed: ' + error.message);
        });
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = registerForm.querySelector('input[type="email"]').value;
    const password = registerForm.querySelector('#register-password').value;
    const confirmPassword = registerForm.querySelector('#register-confirm-password').value;

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
            alert('Registration successful!');
            registerModal.style.display = 'none';
        })
        .catch((error) => {
            alert('Registration failed: ' + error.message);
        });
});

forgotPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = forgotPasswordForm.querySelector('input[type="email"]').value;

    sendPasswordResetEmail(auth, email)
        .then(() => {
            alert('Password reset email sent!');
            forgotPasswordModal.style.display = 'none';
        })
        .catch((error) => {
            alert('Error: ' + error.message);
        });
});

// Appointment Form Submission to Firebase Realtime Database
appointmentForm.addEventListener('submit', (e) => {
    e.preventDefault();  // Prevent form submission

    // Collecting form data
    const fullName = appointmentForm.querySelector('#name').value.trim() || null;  // Trim to remove extra spaces
    const email = appointmentForm.querySelector('#email').value.trim() || null;
    const phone = appointmentForm.querySelector('#phone').value.trim() || null;
    const date = appointmentForm.querySelector('#date').value || null;
    const time = appointmentForm.querySelector('#time').value || null;
    const barber = appointmentForm.querySelector('#barber').value || null;  // Barber name
    const service = appointmentForm.querySelector('#service').value || null;  // Service name

    // Payment method (radio buttons)
    const paymentMethod = appointmentForm.querySelector('input[name="payment"]:checked')?.value || null;

    // Special Requests (optional)
    const specialRequests = appointmentForm.querySelector('#notes').value.trim() || null;

    // Check for missing required fields and alert the user
    if (!fullName || !email || !phone || !date || !time || !barber || !service || !paymentMethod) {
        alert('Please fill out all required fields.');
        return;
    }

    // Data to be saved to Firebase
    const appointmentData = {
        fullName,
        email,
        phone,
        date,
        time,
        barber,
        service,
        paymentMethod,
        specialRequests,
        createdAt: new Date().toISOString(),  // Timestamp of when the appointment is created
    };

    // Debug log to check data being sent
    console.log('Appointment Data:', appointmentData);

    // Firebase Realtime Database reference
    const appointmentsRef = ref(database, 'appointments');

    // Pushing appointment data to Firebase
    push(appointmentsRef, appointmentData)
        .then(() => {
            alert('Your appointment has been booked successfully!');
            appointmentForm.reset();  // Clear the form after successful submission
        })
        .catch((error) => {
            console.error('Error booking appointment:', error);
            alert('Error booking appointment: ' + error.message);
        });
});


// Testimonial slider functionality
const testimonials = document.querySelectorAll('.testimonial');
const dots = document.querySelectorAll('.slider-dot');
let currentTestimonial = 0;

function showTestimonial(index) {
    testimonials.forEach(t => t.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    testimonials[index].classList.add('active');
    dots[index].classList.add('active');
    currentTestimonial = index;
}

dots.forEach(dot => {
    dot.addEventListener('click', () => {
        const index = parseInt(dot.getAttribute('data-index'));
        showTestimonial(index);
    });
});

setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
}, 5000);

// Date validation for booking
const dateInput = document.getElementById('date');
const today = new Date();
const formattedToday = today.toISOString().split('T')[0];
dateInput.setAttribute('min', formattedToday);

// Mobile menu toggle
const mobileMenu = document.querySelector('.mobile-menu');
const navMenu = document.querySelector('nav ul');

mobileMenu.addEventListener('click', () => {
    navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 576) {
        navMenu.style.display = 'flex';
    } else {
        navMenu.style.display = 'none';
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });

            if (window.innerWidth <= 576) {
                navMenu.style.display = 'none';
            }
        }
    });
});
