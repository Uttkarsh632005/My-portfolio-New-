/* ======================= PORTFOLIO SCRIPT ======================= */
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
        burger.classList.toggle('toggle');
    });
    
    // Close nav when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
            }
        });
    });

    // Section Scroll Animation
    const sections = document.querySelectorAll('.section');
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
});

/* ======================= CANVAS SCRIPT ======================= */
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;
let mouse = { x: null, y: null, radius: (canvas.height / 110) * (canvas.width / 110) };

window.addEventListener('mousemove', e => { mouse.x = e.x; mouse.y = e.y; });
window.addEventListener('mouseout', () => { mouse.x = undefined; mouse.y = undefined; });
window.addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    mouse.radius = (canvas.height / 110) * (canvas.width / 110);
    init();
});

class Particle {
    constructor(x, y, dirX, dirY, size, color) {
        this.x = x; this.y = y; this.dirX = dirX; this.dirY = dirY;
        this.size = size; this.color = color;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = 'rgba(100, 255, 218, 0.5)';
        ctx.fill();
    }
    update() {
        if (this.x > canvas.width || this.x < 0) this.dirX = -this.dirX;
        if (this.y > canvas.height || this.y < 0) this.dirY = -this.dirY;
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 3;
            if (mouse.x > this.x && this.x > this.size * 10) this.x -= 3;
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 3;
            if (mouse.y > this.y && this.y > this.size * 10) this.y -= 3;
        }
        this.x += this.dirX;
        this.y += this.dirY;
        this.draw();
    }
}

function init() {
    particlesArray = [];
    let numParticles = (canvas.height * canvas.width) / 9000;
    for (let i = 0; i < numParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let dirX = (Math.random() * 0.4) - 0.2;
        let dirY = (Math.random() * 0.4) - 0.2;
        particlesArray.push(new Particle(x, y, dirX, dirY, size));
    }
}

function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width / 9) * (canvas.height / 9)) {
                opacityValue = 1 - (distance / 20000);
                ctx.strokeStyle = 'rgba(140, 158, 255,' + opacityValue + ')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

init();
animate();
