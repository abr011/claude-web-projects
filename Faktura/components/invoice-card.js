// 🃏 INVOICE CARD KOMPONENT
class InvoiceCardComponent {
    constructor(invoice) {
        this.invoice = invoice;
    }
    
    render() {
        const statusInfo = this.getStatusInfo(this.invoice.status);
        
        return `
            <div class="invoice-item" data-id="${this.invoice.id}">
                <div class="invoice-info">
                    <h3>Faktura ${this.invoice.number}</h3>
                    <p><strong>Klient:</strong> ${this.invoice.clientName}</p>
                    <p><strong>Částka:</strong> ${formatCurrency(this.invoice.amount)}</p>
                    <p><strong>Splatnost:</strong> ${formatDate(this.invoice.dueDate, true)}</p>
                    <p><strong>Vytvořeno:</strong> ${formatDate(this.invoice.createdAt, true)}</p>
                    <span class="badge ${statusInfo.class}">${statusInfo.text}</span>
                </div>
                <div class="invoice-actions">
                    ${this.invoice.archivedAt ? '' : `
                        <button class="btn btn-primary btn-small" onclick="editInvoice(${this.invoice.id})">
                            ✏️ Upravit
                        </button>
                        <button class="btn btn-secondary btn-small" onclick="changeInvoiceStatus(${this.invoice.id})">
                            🔄 Změnit stav
                        </button>
                        <button class="btn btn-danger btn-small" onclick="archiveInvoice(${this.invoice.id})">
                            📦 Archivovat
                        </button>
                    `}
                    ${this.invoice.archivedAt ? `
                        <span style="color: #636e72; font-style: italic;">Archivováno ${formatDate(this.invoice.archivedAt, true)}</span>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    getStatusInfo(status) {
        const statusMap = {
            'draft': { text: 'Koncept', class: 'badge-draft' },
            'sent': { text: 'Odesláno', class: 'badge-sent' },
            'paid': { text: 'Zaplaceno', class: 'badge-paid' },
            'archived': { text: 'Archivováno', class: 'badge-archived' }
        };
        
        // Pro archivované faktury
        if (this.invoice.archivedAt) {
            return { text: 'Archivováno', class: 'badge-archived' };
        }
        
        return statusMap[status] || { text: status, class: 'badge-draft' };
    }
}
window.InvoiceCardComponent = InvoiceCardComponent;
console.log('📦 InvoiceCardComponent načten');