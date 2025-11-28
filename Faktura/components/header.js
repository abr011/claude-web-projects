// 📋 HEADER KOMPONENT - BEZ STYLŮ
class HeaderComponent {
    constructor(container) {
        this.container = container;
    }
    
    getTemplate() {
        return `
            <header class="app-header">
                <div class="header-content" onclick="AppState.changeSection('form')" style="cursor: pointer;">
                    <div class="header-text">
                        <h1 class="header-title">Vystavování faktur</h1>
                    </div>
                </div>
                <div class="header-stats" onclick="AppState.changeSection('list')" style="cursor: pointer;">
                    <div class="stat-summary">
                        <span id="stats-summary">0 faktur za 0 Kč</span>
                    </div>
                </div>
            </header>
        `;
    }
    
    init() {
        this.container.innerHTML = this.getTemplate();
        this.statsSummaryEl = document.getElementById('stats-summary');
        console.log('✅ HeaderComponent inicializován');
    }
    
    onEvent(eventType, data) {
        if (eventType === 'statsUpdated') {
            this.updateStats(data.totalCount, data.totalAmount);
        }
    }
    
    updateStats(totalCount, totalAmount) {
        if (this.statsSummaryEl) {
            this.statsSummaryEl.textContent = `${totalCount} faktur za ${formatCurrency(totalAmount)}`;
        }
    }
}

// Registrace do window objektu
window.HeaderComponent = HeaderComponent;
console.log('📦 HeaderComponent načten');