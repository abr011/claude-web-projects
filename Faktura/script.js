// 🏗️ KOMPONENTOVÝ SYSTÉM PRO FAKTURAČNÍ APLIKACI

console.log('📦 Načítám komponentový systém...');

// 📊 GLOBÁLNÍ STAV APLIKACE
window.AppState = {
    invoices: [], // Všechny faktury
    archivedInvoices: [], // Archivované faktury
    currentSection: 'form', // Aktivní sekce (form/list)
    editingInvoice: null, // Editovaná faktura
    components: {}, // Reference na komponenty
    
    // Přidání nové faktury
    addInvoice(invoiceData) {
        const invoice = {
            id: Date.now(), // Jednoduchý ID systém
            ...invoiceData,
            createdAt: new Date().toISOString(),
            status: 'draft' // Výchozí stav: koncept
        };
        
        this.invoices.push(invoice);
        this.saveToStorage();
        this.updateStats();
        this.notifyComponents('invoiceAdded', invoice);
        
        console.log('💾 Faktura přidána:', invoice);
        showNotification('Faktura byla úspěšně vytvořena!', 'success');
        
        return invoice;
    },
    
    // Aktualizace faktury
    updateInvoice(updatedData) {  
        const index = this.invoices.findIndex(inv => inv.id === updatedData.id);
        if (index !== -1) {
            this.invoices[index] = { ...this.invoices[index], ...updatedData };
            this.saveToStorage();
            this.updateStats();
            this.notifyComponents('invoiceUpdated', this.invoices[index]);
            
            console.log('✏️ Faktura aktualizována:', this.invoices[index]);
            showNotification('Faktura byla aktualizována!', 'success');
            
            return this.invoices[index];
        }
        return null;
    },
    
    // Archivace faktury
    archiveInvoice(invoiceId) {
        const index = this.invoices.findIndex(inv => inv.id === invoiceId);
        if (index !== -1) {
            const archived = this.invoices.splice(index, 1)[0];
            archived.archivedAt = new Date().toISOString();
            this.archivedInvoices.push(archived);
            this.saveToStorage();
            this.updateStats();
            this.notifyComponents('invoiceArchived', archived);
            
            console.log('📦 Faktura archivována:', archived);
            showNotification('Faktura byla archivována!', 'info');
            
            return archived;
        }
        return null;
    },

    // Smazání faktury
    deleteInvoice(invoiceId) {
        const index = this.invoices.findIndex(inv => inv.id === invoiceId);
        if (index !== -1) {
            const deleted = this.invoices.splice(index, 1)[0];
            this.saveToStorage();
            this.updateStats();
            this.notifyComponents('invoiceDeleted', deleted);
            
            console.log('🗑️ Faktura smazána:', deleted);
            showNotification('Faktura byla smazána!', 'info');
            
            return deleted;
        }
        return null;
    },
    
    // Změna stavu faktury
    changeInvoiceStatus(invoiceId) {
        const invoice = this.invoices.find(inv => inv.id === invoiceId);
        if (!invoice) return null;
        
        const statuses = ['draft', 'sent', 'paid'];
        const statusNames = {
            'draft': 'Koncept',
            'sent': 'Odesláno', 
            'paid': 'Zaplaceno'
        };
        
        const currentIndex = statuses.indexOf(invoice.status);
        const nextIndex = (currentIndex + 1) % statuses.length;
        const newStatus = statuses[nextIndex];
        
        invoice.status = newStatus;
        this.saveToStorage();
        this.updateStats();
        this.notifyComponents('invoiceStatusChanged', invoice);
        
        console.log(`🔄 Stav faktury změněn na: ${newStatus}`);
        showNotification(`Stav faktury změněn na: ${statusNames[newStatus]}`, 'info');
        
        return invoice;
    },
    
    // Změna aktivní sekce
    changeSection(section) {
        this.currentSection = section;
        this.notifyComponents('sectionChanged', section);
        console.log(`🧭 Sekce změněna na: ${section}`);
    },
    
    // Nastavení editace faktury
    setEditingInvoice(invoice) {
        this.editingInvoice = invoice;
        this.notifyComponents('editingInvoiceChanged', invoice);
    },
    
    // Uložení do localStorage
    saveToStorage() {
        try {
            const data = {
                invoices: this.invoices,
                archivedInvoices: this.archivedInvoices
            };
            localStorage.setItem('invoiceApp_data', JSON.stringify(data));
            console.log('💾 Data uložena do localStorage');
        } catch (error) {
            console.error('❌ Chyba při ukládání:', error);
            showNotification('Chyba při ukládání dat!', 'error');
        }
    },
    
    // Načtení z localStorage
    loadFromStorage() {
        try {
            const saved = localStorage.getItem('invoiceApp_data');
            if (saved) {
                const data = JSON.parse(saved);
                
                // Zpětná kompatibilita se starým formátem
                if (Array.isArray(data)) {
                    this.invoices = data;
                    this.archivedInvoices = [];
                } else {
                    this.invoices = data.invoices || [];
                    this.archivedInvoices = data.archivedInvoices || [];
                }
                
                this.updateStats();
                console.log('📂 Data načtena:', this.invoices.length, 'faktur,', this.archivedInvoices.length, 'archivovaných');
            }
        } catch (error) {
            console.error('❌ Chyba při načítání:', error);
            showNotification('Chyba při načítání dat!', 'error');
        }
    },
    
    // Aktualizace statistik
    updateStats() {
        const totalCount = this.invoices.length;
        const totalAmount = this.invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
        
        this.notifyComponents('statsUpdated', { totalCount, totalAmount });
    },
    
    // Získání faktury podle ID
    getInvoice(id) {
        return this.invoices.find(inv => inv.id === id);
    },
    
    // Filtrování faktur
    filterInvoices(status = '', search = '') {
        let invoicesToFilter = this.invoices;
        
        // Pokud filtrujeme archivované, použij archiv
        if (status === 'archived') {
            invoicesToFilter = this.archivedInvoices;
        }
        
        return invoicesToFilter.filter(invoice => {
            const matchesStatus = !status || status === 'archived' || invoice.status === status;
            const matchesSearch = !search || 
                invoice.clientName.toLowerCase().includes(search.toLowerCase()) ||
                invoice.number.toLowerCase().includes(search.toLowerCase());
            
            return matchesStatus && matchesSearch;
        });
    },
    
    // Notifikace komponentů o změnách
    notifyComponents(event, data) {
        Object.values(this.components).forEach(component => {
            if (component && typeof component.onEvent === 'function') {
                component.onEvent(event, data);
            }
        });
    },
    
    // Registrace komponentu
    registerComponent(name, component) {
        this.components[name] = component;
        console.log(`📦 Komponent '${name}' registrován`);
    },
    
    // Přidání testovacích dat
    addTestData() {
        console.log('📝 Přidávám ukázkové faktury...');
        
        this.addInvoice({
            number: 'F2024001',
            clientName: 'ABC s.r.o.',
            clientAddress: 'Pražská 456\n120 00 Praha 2',
            amount: 25000,
            description: 'Vývoj webové aplikace pro správu faktur',
            dueDate: '2024-09-15'
        });
        
        this.addInvoice({
            number: 'F2024002', 
            clientName: 'XYZ spol. s r.o.',
            clientAddress: 'Brněnská 789\n602 00 Brno',
            amount: 15500,
            description: 'Konzultační služby IT a návrh systému',
            dueDate: '2024-09-20'
        });
        
        // Změna stavu u první faktury
        if (this.invoices.length > 0) {
            this.invoices[0].status = 'sent';
            this.saveToStorage();
            this.updateStats();
        }
    }
};

// 🏗️ KOMPONENTOVÝ SYSTÉM
window.ComponentSystem = {
    // Vytvoření komponentu
    async createComponent(componentName, containerId) {
        console.log(`🔨 Vytvářím komponent '${componentName}' v kontejneru '#${containerId}'`);
        
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`❌ Kontejner '#${containerId}' neexistuje!`);
        }
        
        // Kontrola existence komponentu v globálním scope
        const ComponentClass = window[this.getComponentClassName(componentName)];
        if (!ComponentClass) {
            throw new Error(`❌ Komponent '${componentName}' není definován! Hledám třídu: ${this.getComponentClassName(componentName)}`);
        }
        
        try {
            // Vytvoření instance komponentu
            const component = new ComponentClass(container);
            
            // Registrace komponentu do AppState
            AppState.registerComponent(componentName, component);
            
            // Inicializace komponentu
            if (typeof component.init === 'function') {
                await component.init();
            }
            
            console.log(`✅ Komponent '${componentName}' úspěšně vytvořen`);
            return component;
            
        } catch (error) {
            console.error(`❌ Chyba při vytváření komponentu '${componentName}':`, error);
            throw error;
        }
    },
    
    // Získání názvu třídy komponentu
    getComponentClassName(componentName) {
        // Převod z kebab-case na PascalCase
        // např: invoice-form -> InvoiceFormComponent
        return componentName
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join('') + 'Component';
    }
};

// 🔔 NOTIFIKAČNÍ SYSTÉM
window.showNotification = function(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    const container = document.getElementById('notifications-container');
    if (container) {
        container.appendChild(notification);
        
        // Automatické odstranění
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideInRight 0.3s ease-out reverse';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, duration);
    }
};

// 🛠️ UTILITY FUNKCE
window.formatCurrency = function(amount) {
    return new Intl.NumberFormat('cs-CZ', {
        style: 'currency',
        currency: 'CZK'
    }).format(amount);
};

window.formatDate = function(dateInput, withStyling = false) {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    const formatted = date.toLocaleDateString('cs-CZ', {
        day: 'numeric',
        month: 'numeric', 
        year: 'numeric'
    });
    
    if (withStyling) {
        // Rozdělí datum na den.měsíc a rok s jiným přístupem
        const parts = formatted.split('.');
        if (parts.length === 3) {
            const dayMonth = `${parts[0]}.${parts[1]}.`;
            const year = parts[2];
            return `${dayMonth}<span style="color: #888888;">${year}</span>`;
        }
    }
    
    return formatted;
};

window.validateInvoiceData = function(data) {
    const errors = [];
    
    if (!data.number || data.number.trim() === '') {
        errors.push('Číslo faktury je povinné');
    }
    
    if (!data.clientName || data.clientName.trim() === '') {
        errors.push('Název klienta je povinný');
    }
    
    if (!data.clientAddress || data.clientAddress.trim() === '') {
        errors.push('Adresa klienta je povinná');
    }
    
    if (!data.amount || data.amount <= 0) {
        errors.push('Částka musí být větší než 0');
    }
    
    if (!data.description || data.description.trim() === '') {
        errors.push('Popis služeb je povinný');
    }
    
    if (!data.dueDate) {
        errors.push('Datum splatnosti je povinné');
    }
    
    return errors;
};

// 🌍 GLOBÁLNÍ FUNKCE (pro onclick handlery v komponentech)
window.editInvoice = function(id) {
    console.log('✏️ Editace faktury s ID:', id, 'typ:', typeof id);
    const numericId = typeof id === 'string' ? parseInt(id) : id;
    const invoice = AppState.getInvoice(numericId);
    if (invoice) {
        console.log('✏️ Faktura nalezena:', invoice);
        AppState.setEditingInvoice(invoice);
        AppState.changeSection('form');
    } else {
        console.error('❌ Faktura s ID', numericId, 'nenalezena');
        console.log('Dostupné faktury:', AppState.invoices.map(inv => ({id: inv.id, number: inv.number})));
    }
};

window.archiveInvoice = function(id) {
    const invoice = AppState.getInvoice(id);
    if (!invoice) return;
    
    AppState.archiveInvoice(id);
};

window.changeInvoiceStatus = function(id) {
    AppState.changeInvoiceStatus(id);
};

// Uložení dat před zavřením stránky
window.addEventListener('beforeunload', function() {
    AppState.saveToStorage();
    console.log('💾 Data uložena před zavřením');
});

console.log('✅ Komponentový systém načten');
console.log('📦 AppState je k dispozici:', typeof window.AppState);