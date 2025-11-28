// 🚀 OSOBNÍ WEB - INTERAKTIVITA

console.log('🌟 Osobní web Aleše Broma načten');

// Smooth scrolling pro navigační odkazy
document.addEventListener('DOMContentLoaded', function() {
    // Aktivní sekce v navigaci
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Observer pro aktivní sekci
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-100px 0px -50% 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Odstranit aktivní třídu ze všech odkazů
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Přidat aktivní třídu k odpovídajícímu odkazu
                const activeLink = document.querySelector(`a[href="#${entry.target.id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);
    
    // Sledovat všechny sekce
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Animace při scrollování
    const animatedElements = document.querySelectorAll('.skill-category, .project-card');
    
    const animationObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.2
    });
    
    // Nastavit počáteční stav a spustit observer
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.8s ease-out';
        animationObserver.observe(element);
    });
    
    // Rychlé kontaktní tlačítko (floating)
    if (window.innerWidth > 768) {
        createFloatingContactButton();
    }
});

// Vytvoření plovoucího kontaktního tlačítka
function createFloatingContactButton() {
    const button = document.createElement('div');
    button.className = 'floating-contact';
    button.innerHTML = '💬';
    button.title = 'Rychlý kontakt';
    
    // Styling
    Object.assign(button.style, {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '60px',
        height: '60px',
        backgroundColor: '#667eea',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
        transition: 'all 0.3s ease',
        zIndex: '1000'
    });
    
    // Hover efekt
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.boxShadow = '0 8px 30px rgba(102, 126, 234, 0.5)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.3)';
    });
    
    // Klik - scroll k kontaktu
    button.addEventListener('click', function() {
        document.getElementById('contact').scrollIntoView({ 
            behavior: 'smooth' 
        });
    });
    
    document.body.appendChild(button);
}

// Aktivní navigační odkaz
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: #667eea !important;
    }
    
    .nav-link.active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(style);

// Typ writer efekt pro hlavní nadpis (volitelný)
function typeWriterEffect() {
    const nameElement = document.querySelector('.name');
    const originalText = nameElement.textContent;
    nameElement.textContent = '';
    
    let i = 0;
    function typeChar() {
        if (i < originalText.length) {
            nameElement.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeChar, 100);
        }
    }
    
    setTimeout(typeChar, 500);
}

// Spustit typewriter efekt po načtení (volitelné - zakomentováno)
// window.addEventListener('load', typeWriterEffect);

// Jednoduché analytics (optional)
console.log('📊 Stránka zobrazena:', new Date().toLocaleString('cs-CZ'));

// Performance tip: lazy loading obrázků (až budou přidány)
document.addEventListener('DOMContentLoaded', function() {
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
});