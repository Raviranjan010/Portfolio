let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');

    function revealOnScroll() {
        serviceCards.forEach(card => {
            const cardPosition = card.getBoundingClientRect().top;
            const viewportHeight = window.innerHeight;

            if (cardPosition < viewportHeight * 0.8) {
                card.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check
});

function toggleEffect(element) {
    element.classList.toggle('clicked');
}

function addGlowEffect(element) {
    document.querySelectorAll('.service-card.glow-effect').forEach(card => {
        card.classList.remove('glow-effect');
    });

    element.classList.add('glow-effect');

    setTimeout(() => {
        element.classList.remove('glow-effect');
    }, 1500); // Adjust the duration as needed
}

document.addEventListener('DOMContentLoaded', function() {
    const educationCards = document.querySelectorAll('.education-card');

    educationCards.forEach(card => {
        card.addEventListener('click', () => {
            educationCards.forEach(c => c.classList.remove('clicked'));
            card.classList.add('clicked');
        });
    });
});

document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.classList.add('hover');
    });

    card.addEventListener('mouseleave', () => {
        card.classList.remove('hover');
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const educationButton = document.querySelector('#education-button');

    educationButton.addEventListener('click', () => {
        document.querySelector('#education').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

function addBouncyEffect(card) {
    card.style.transition = 'transform 0.3s ease-in-out';
    card.style.transform = 'scale(1.05)';
    setTimeout(() => {
        card.style.transform = 'scale(1)';
    }, 300);
}

document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('click', () => addBouncyEffect(card));
});



document.addEventListener('DOMContentLoaded', function () {
    const links = document.querySelectorAll('a.scroll-link');

    links.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        });
    });
});



document.querySelector('a[href="#services"]').addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
        top: document.querySelector('.services').offsetTop - document.querySelector('header').offsetHeight,
        behavior: 'smooth'
    });
});



document.addEventListener('DOMContentLoaded', function () {
    const menuIcon = document.getElementById('menu-icon');
    const navbar = document.querySelector('.navbar');

    menuIcon.addEventListener('click', function () {
        navbar.classList.toggle('show');
    });
});
