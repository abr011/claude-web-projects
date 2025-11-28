// 🧭 NAVIGATION KOMPONENT - BEZ STYLŮ
class NavigationComponent {
    constructor(container) {
        this.container = container;
        this.currentSection = 'form';
    }
    
    getTemplate() {
        return `
            <nav class="app-navigation">
                <button class="nav-btn active" data-section="form">
                    <span class="nav-icon">📝</span>
                    <span class="nav-text">Vytvořit fakturu</span>
                </button>
                <button class="nav-btn" data-section="list">
                    <span class="nav-icon">📋</span>
                    <span class="nav-text">Seznam faktur</span>
                </button>
            </nav>
        `;
    }
    
    init() {
        this.container.innerHTML = this.getTemplate();
        this.navButtons = this.container.querySelectorAll('.nav-btn');
        
        this.navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleNavClick(e));
        });
        
        console.log('✅ NavigationComponent inicializován');
    }
    
    handleNavClick(event) {
        const section = event.currentTarget.dataset.section;
        this.setActiveSection(section);
        AppState.changeSection(section);
    }
    
    setActiveSection(section) {
        this.navButtons.forEach(btn => btn.classList.remove('active'));
        const activeBtn = this.container.querySelector(`[data-section="${section}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        this.currentSection = section;
    }
    
    onEvent(eventType, data) {
        if (eventType === 'sectionChanged' && data !== this.currentSection) {
            this.setActiveSection(data);
        }
        if (eventType === 'editingInvoiceChanged' && data && this.currentSection !== 'form') {
            this.setActiveSection('form');
        }
    }
}

// Registrace do window objektu
window.NavigationComponent = NavigationComponent;
console.log('📦 NavigationComponent načten');