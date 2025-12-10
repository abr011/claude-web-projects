// 📋 INVOICE LIST KOMPONENT
class InvoiceListComponent {
    constructor(container) {
        this.container = container;
        this.isVisible = false;
    }
    
    getTemplate() {
        return `
            <section id="list-section" class="content-section">
                <div class="section-header">
                    <h2 class="section-title">
                        <span class="title-icon">📋</span>
                        Seznam faktur
                    </h2>
                    <div class="section-controls">
                        <select id="status-filter" class="form-control form-select">
                            <option value="">Všechny stavy</option>
                            <option value="draft">Koncept</option>
                            <option value="sent">Odesláno</option>
                            <option value="paid">Zaplaceno</option>
                            <option value="archived">Archivováno</option>
                        </select>
                        <input type="text" id="search-input" class="form-control" placeholder="Hledat podle klienta...">
                    </div>
                </div>
                <div id="invoices-container" class="invoices-container"></div>
            </section>
        `;
    }
    
    init() {
        this.container.innerHTML = this.getTemplate();
        this.section = this.container.querySelector('#list-section');
        this.invoicesContainer = this.container.querySelector('#invoices-container');
        this.statusFilter = this.container.querySelector('#status-filter');
        this.searchInput = this.container.querySelector('#search-input');
        
        this.statusFilter.addEventListener('change', () => this.renderInvoices());
        this.searchInput.addEventListener('input', () => this.renderInvoices());
        
        console.log('✅ InvoiceListComponent inicializován');
    }
    
    onEvent(eventType, data) {
        switch(eventType) {
            case 'sectionChanged':
                this.handleSectionChange(data);
                break;
            case 'invoiceAdded':
            case 'invoiceUpdated':
            case 'invoiceDeleted':
            case 'invoiceArchived':
            case 'invoiceStatusChanged':
                if (this.isVisible) {
                    this.renderInvoices();
                }
                break;
        }
    }
    
    handleSectionChange(section) {
        if (section === 'list') {
            this.show();
            this.renderInvoices();
        } else {
            this.hide();
        }
    }
    
    show() {
        this.section.classList.add('active');
        this.isVisible = true;
    }
    
    hide() {
        this.section.classList.remove('active');
        this.isVisible = false;
    }
    
    renderInvoices() {
        if (!this.isVisible) return;
        
        const statusFilter = this.statusFilter.value;
        const searchTerm = this.searchInput.value;
        const filteredInvoices = AppState.filterInvoices(statusFilter, searchTerm);
        
        if (filteredInvoices.length === 0) {
            this.renderEmptyState();
            return;
        }
        
        const invoicesHTML = filteredInvoices
            .map(invoice => {
                const cardComponent = new InvoiceCardComponent(invoice);
                return cardComponent.render();
            })
            .join('');
        
        this.invoicesContainer.innerHTML = invoicesHTML;
    }
    
    renderEmptyState() {
        this.invoicesContainer.innerHTML = `
            <div class="empty-state">
                <h3>📭 Žádné faktury nenalezeny</h3>
                <p>Zatím nemáte žádné faktury nebo neodpovídají filtru.</p>
                <button class="btn btn-primary" onclick="AppState.changeSection('form')">
                    📝 Vytvořit první fakturu
                </button>
            </div>
        `;
    }
}
window.InvoiceListComponent = InvoiceListComponent;
console.log('📦 InvoiceListComponent načten');