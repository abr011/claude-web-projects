// 📝 INVOICE FORM KOMPONENT - S DATEM VYSTAVENÍ
class InvoiceFormComponent {
    constructor(container) {
        this.container = container;
        this.isVisible = true;
        this.editingId = null;
    }
    
    getTemplate() {
        return `
            <section id="form-section" class="content-section active">
                <div class="section-header">
                    <div class="title-with-number">
                        <h2 class="section-title">
                            <span class="title-text">Nová faktura číslo</span>
                        </h2>
                        <input type="text" id="invoice-number" name="number" class="form-control invoice-number-input" required 
                               placeholder="12024">
                    </div>
                    <div class="supplier-summary" onclick="editSupplierInfo()" style="cursor: pointer;">
                        <div class="supplier-name" id="supplier-name">Vaše firma s.r.o.</div>
                        <div class="supplier-details" id="supplier-details">IČO: 12345678 | 123456789/0100</div>
                    </div>
                </div>
                
                <form id="invoice-form" class="invoice-form">
                    <div class="date-row">
                        <div class="form-group">
                            <label for="issue-date" class="form-label">
                                Datum vystavení
                            </label>
                            <div class="date-field-container">
                                <input type="text" 
                                       id="issue-date" 
                                       class="form-control form-control-short" 
                                       placeholder="dd.mm.rrrr" 
                                       onfocus="showCalendar('issue')"
                                       onblur="hideCalendarDelayed('issue')">
                                       
                                <div id="calendar-issue" class="calendar-popup">
                                    <div class="calendar-header">
                                        <button class="nav-button" onclick="changeCalendarMonth('issue', -1)">‹</button>
                                        <div class="month-year" id="month-display-issue">Srpen 2025</div>
                                        <button class="nav-button" onclick="changeCalendarMonth('issue', 1)">›</button>
                                    </div>
                                    
                                    <table class="calendar-table">
                                        <tr>
                                            <th>Po</th><th>Út</th><th>St</th><th>Čt</th><th>Pá</th><th>So</th><th>Ne</th>
                                        </tr>
                                        <tbody id="calendar-days-issue"></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="due-date" class="form-label">
                                Datum splatnosti
                            </label>
                            <div class="date-field-container">
                                <input type="text" 
                                       id="due-date" 
                                       class="form-control form-control-short" 
                                       placeholder="dd.mm.rrrr" 
                                       onfocus="showCalendar('due')"
                                       onblur="hideCalendarDelayed('due')">
                                       
                                <div id="calendar-due" class="calendar-popup">
                                    <div class="calendar-header">
                                        <button class="nav-button" onclick="changeCalendarMonth('due', -1)">‹</button>
                                        <div class="month-year" id="month-display-due">Srpen 2025</div>
                                        <button class="nav-button" onclick="changeCalendarMonth('due', 1)">›</button>
                                    </div>
                                    
                                    <table class="calendar-table">
                                        <tr>
                                            <th>Po</th><th>Út</th><th>St</th><th>Čt</th><th>Pá</th><th>So</th><th>Ne</th>
                                        </tr>
                                        <tbody id="calendar-days-due"></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Checkbox pro minulý měsíc -->
                    <div class="form-check mt-10">
                        <input type="checkbox" id="previous-month-check" class="form-check-input">
                        <label for="previous-month-check" class="form-check-label">
                            📆 Minulý měsíc (poslední den)
                        </label>
                    </div>

                    <div class="form-group">
                        <label for="client-select" class="form-label">
                            Klient
                        </label>
                        <div class="custom-dropdown" id="client-dropdown">
                            <div class="dropdown-selected" id="dropdown-selected">
                                <div class="client-main-line">Vyberte klienta</div>
                                <div class="client-sub-line"></div>
                                <div class="dropdown-arrow">▼</div>
                            </div>
                            <div class="dropdown-options" id="dropdown-options">
                                <!-- Klienti se načtou zde -->
                            </div>
                        </div>
                        <button type="button" id="add-new-client-btn" class="btn btn-outline btn-small" title="Přidat nového klienta">
                            ➕ Nový klient
                        </button>
                    </div>

                    <div class="form-group">
                        <label for="amount" class="form-label">
                            Částka
                        </label>
                        <div class="input-with-currency">
                            <input type="number" id="amount" name="amount" step="0.01" class="form-control form-control-short" required 
                                   placeholder="0.00">
                            <span class="currency-label">Kč</span>
                        </div>
                    </div>

                    <div class="form-grid">
                    </div>

                    <!-- Skrytá pole pro údaje klienta -->
                    <input type="hidden" id="client-name" name="clientName">
                    <input type="hidden" id="client-address" name="clientAddress">
                    <input type="hidden" id="client-ico" name="clientIco">
                    <input type="hidden" id="client-dic" name="clientDic">

                    <div class="form-group">
                        <label for="description" class="form-label">
                            Popis služeb
                        </label>
                        <textarea id="description" name="description" class="form-control description-wide" required 
                                  placeholder="Detailní popis poskytnutých služeb..."></textarea>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn btn-success btn-large" id="submit-btn">
                            💾 Uložit fakturu
                        </button>
                        <button type="button" class="btn btn-primary" id="preview-btn">
                            👁️ Náhled
                        </button>
                    </div>
                </form>
                
                <div id="invoice-preview-container" class="invoice-preview-container hidden">
                    <div class="preview-header">
                        <h3>👁️ Náhled faktury</h3>
                        <button type="button" class="btn btn-small btn-secondary" id="close-preview-btn">
                            ✕ Zavřít
                        </button>
                    </div>
                    <div class="invoice-preview">
                        <div class="preview-content">
                            <div class="invoice-header-preview">
                                <div class="company-info">
                                    <h2>FAKTURA</h2>
                                    <div id="preview-invoice-number"></div>
                                </div>
                                <div class="invoice-dates">
                                    <p><strong>Datum vystavení:</strong> <span id="preview-issue-date"></span></p>
                                    <p><strong>Datum splatnosti:</strong> <span id="preview-due-date"></span></p>
                                </div>
                            </div>
                            <div class="parties-info">
                                <div class="supplier-info">
                                    <h4>Dodavatel:</h4>
                                    <div class="company-details">
                                        <strong>Vaše firma s.r.o.</strong><br>
                                        IČO: 12345678<br>
                                        DIČ: CZ12345678<br>
                                        Hlavní ulice 123<br>
                                        110 00 Praha 1<br>
                                        Tel: +420 123 456 789<br>
                                        Email: info@vasefirma.cz
                                    </div>
                                </div>
                                <div class="client-info">
                                    <h4>Odběratel:</h4>
                                    <div id="preview-client-info"></div>
                                </div>
                            </div>
                            <div class="services-info">
                                <h4>Popis poskytnutých služeb:</h4>
                                <div id="preview-description"></div>
                                <div class="amount-summary">
                                    <table class="amount-table">
                                        <tr class="total-row">
                                            <td><strong>Celková částka:</strong></td>
                                            <td class="amount-value"><strong><span id="preview-total-amount"></span> Kč</strong></td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                            <div class="payment-info">
                                <div class="payment-details">
                                    <div class="payment-text">
                                        <p><strong>Způsob platby:</strong> Bankovní převod</p>
                                        <p><strong>Číslo účtu:</strong> <span id="preview-account"></span></p>
                                        <p><strong>Variabilní symbol:</strong> <span id="preview-variable-symbol"></span></p>
                                    </div>
                                    <div class="payment-qr">
                                        <img id="qr-code" src="" alt="QR kód pro platbu" style="width: 120px; height: 120px; border: 1px solid #ddd;">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- POPUP FORMULÁŘ PRO NOVÉHO KLIENTA -->
            <div id="new-client-modal" class="modal hidden">
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>➕ Přidat nového klienta</h3>
                        <button type="button" class="btn btn-small btn-secondary" id="close-client-modal">
                            ✕ Zavřít
                        </button>
                    </div>
                    
                    <form id="new-client-form" class="new-client-form">
                        <div class="form-group">
                            <label for="new-client-name" class="form-label">
                                <span class="label-icon">🏢</span>
                                Název / Jméno *
                            </label>
                            <input type="text" id="new-client-name" class="form-control" required 
                                   placeholder="např. ABC s.r.o. nebo Jan Novák">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">
                                <span class="label-icon">📍</span>
                                Adresa *
                            </label>
                            <div class="address-fields">
                                <input type="text" id="new-client-street" class="form-control mb-10" required 
                                       placeholder="Ulice a číslo popisné">
                                <div class="address-row">
                                    <input type="text" id="new-client-city" class="form-control" required 
                                           placeholder="Město">
                                    <input type="text" id="new-client-postal" class="form-control form-control-short" required 
                                           placeholder="PSČ">
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="new-client-ico" class="form-label">
                                    <span class="label-icon">🔢</span>
                                    IČO *
                                </label>
                                <input type="text" id="new-client-ico" class="form-control" required 
                                       placeholder="12345678" maxlength="8">
                            </div>
                            
                            <div class="form-group">
                                <label for="new-client-dic" class="form-label">
                                    <span class="label-icon">📋</span>
                                    DIČ
                                </label>
                                <input type="text" id="new-client-dic" class="form-control" 
                                       placeholder="CZ12345678" maxlength="12">
                            </div>
                        </div>
                        
                        <div class="modal-actions">
                            <button type="submit" class="btn btn-success">
                                💾 Uložit klienta
                            </button>
                            <button type="button" class="btn btn-secondary" id="cancel-client-modal">
                                ❌ Zrušit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
            <!-- MODAL PRO EDITACI DODAVATELE -->
            <div id="supplier-modal" class="modal hidden">
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>⚙️ Údaje dodavatele</h3>
                        <button type="button" class="btn btn-small btn-secondary" id="close-supplier-modal">
                            ✕ Zavřít
                        </button>
                    </div>
                    
                    <form id="supplier-form" class="new-client-form">
                        <div class="form-group">
                            <label for="supplier-name" class="form-label">
                                Název firmy *
                            </label>
                            <input type="text" id="supplier-name" class="form-control" required 
                                   placeholder="např. ABC s.r.o.">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">
                                Adresa *
                            </label>
                            <div class="address-fields">
                                <input type="text" id="supplier-street" class="form-control mb-10" required 
                                       placeholder="Ulice a číslo popisné">
                                <div class="address-row">
                                    <input type="text" id="supplier-city" class="form-control" required 
                                           placeholder="Město">
                                    <input type="text" id="supplier-postal" class="form-control form-control-short" required 
                                           placeholder="PSČ">
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="supplier-ico" class="form-label">
                                    IČO *
                                </label>
                                <input type="text" id="supplier-ico" class="form-control" required 
                                       placeholder="12345678" maxlength="8">
                            </div>
                            
                            <div class="form-group">
                                <label for="supplier-dic" class="form-label">
                                    DIČ
                                </label>
                                <input type="text" id="supplier-dic" class="form-control" 
                                       placeholder="CZ12345678" maxlength="12">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="supplier-account" class="form-label">
                                Bankovní účet *
                            </label>
                            <input type="text" id="supplier-account" class="form-control" required 
                                   placeholder="123456789/0100">
                        </div>
                        
                        <div class="modal-actions">
                            <button type="submit" class="btn btn-success">
                                💾 Uložit údaje
                            </button>
                            <button type="button" class="btn btn-secondary" id="cancel-supplier-modal">
                                ❌ Zrušit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }
    
    init() {
        this.container.innerHTML = this.getTemplate();
        this.section = this.container.querySelector('#form-section');
        this.form = this.container.querySelector('#invoice-form');
        this.previewContainer = this.container.querySelector('#invoice-preview-container');
        this.titleText = this.container.querySelector('.title-text');
        this.submitBtn = this.container.querySelector('#submit-btn');
        
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.container.querySelector('#preview-btn').addEventListener('click', () => this.showPreview());
        this.container.querySelector('#close-preview-btn').addEventListener('click', () => this.hidePreview());
        
        // Event listener pro automatickou aktualizaci data splatnosti
        this.container.querySelector('#issue-date').addEventListener('change', (e) => this.updateDueDateFromIssueDate(e));
        
        // Event listener pro checkbox minulý měsíc
        this.container.querySelector('#previous-month-check').addEventListener('change', (e) => this.handlePreviousMonthCheck(e));
        
        // Event listener pro vlastní dropdown
        this.container.querySelector('#dropdown-selected').addEventListener('click', (e) => this.toggleDropdown(e));
        this.container.querySelector('#add-new-client-btn').addEventListener('click', () => this.showNewClientModal());
        
        // Event listener pro modal nového klienta
        this.container.querySelector('#close-client-modal').addEventListener('click', () => this.hideNewClientModal());
        this.container.querySelector('#cancel-client-modal').addEventListener('click', () => this.hideNewClientModal());
        this.container.querySelector('#new-client-form').addEventListener('submit', (e) => this.handleNewClientSubmit(e));
        
        // Event listener pro modal dodavatele
        this.container.querySelector('#close-supplier-modal').addEventListener('click', () => this.hideSupplierModal());
        this.container.querySelector('#cancel-supplier-modal').addEventListener('click', () => this.hideSupplierModal());
        this.container.querySelector('#supplier-form').addEventListener('submit', (e) => this.handleSupplierSubmit(e));
        
        // Event listener pro zavření modalů kliknutím na overlay
        this.container.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target.closest('#new-client-modal')) this.hideNewClientModal();
                if (e.target.closest('#supplier-modal')) this.hideSupplierModal();
            });
        });
        
        // NOVÝ KALENDÁŘ - převzato z fungující verze
        window.calendarState = {
            issue: { year: 2025, month: 7 }, // 7 = Srpen (0-indexováno)
            due: { year: 2025, month: 7 }
        };
        
        window.monthNames = ['Leden','Únor','Březen','Duben','Květen','Červen','Červenec','Srpen','Září','Říjen','Listopad','Prosinec'];
        
        window.showCalendar = (type) => {
            document.getElementById(`calendar-${type}`).style.display = 'block';
            generateCalendarForField(type);
        };
        
        window.hideCalendarDelayed = (type) => {
            setTimeout(() => {
                document.getElementById(`calendar-${type}`).style.display = 'none';
            }, 200);
        };
        
        window.generateCalendarForField = (type) => {
            const state = window.calendarState[type];
            const today = new Date();
            const firstDay = new Date(state.year, state.month, 1);
            const daysInMonth = new Date(state.year, state.month + 1, 0).getDate();
            
            document.getElementById(`month-display-${type}`).textContent = `${window.monthNames[state.month]} ${state.year}`;
            
            let startDay = firstDay.getDay();
            startDay = startDay === 0 ? 6 : startDay - 1; // Pondělí = 0
            
            const tbody = document.getElementById(`calendar-days-${type}`);
            tbody.innerHTML = '';
            
            let date = 1;
            for (let week = 0; week < 6; week++) {
                const row = tbody.insertRow();
                
                for (let day = 0; day < 7; day++) {
                    const cell = row.insertCell();
                    
                    if (week === 0 && day < startDay) {
                        cell.textContent = '';
                        cell.className = 'other-month';
                    } else if (date > daysInMonth) {
                        cell.textContent = '';
                        cell.className = 'other-month';
                    } else {
                        cell.textContent = date;
                        
                        if (state.year === today.getFullYear() && 
                            state.month === today.getMonth() && 
                            date === today.getDate()) {
                            cell.className = 'today';
                        }
                        
                        const currentDate = date; // Capture pro closure
                        cell.onclick = function() {
                            const input = document.getElementById(`${type}-date`);
                            const selectedDate = new Date(state.year, state.month, currentDate);
                            
                            // Formátuj datum s českým stylem (šedivý rok)
                            const formatted = selectedDate.toLocaleDateString('cs-CZ', {
                                day: 'numeric', month: 'numeric', year: 'numeric'
                            });
                            const parts = formatted.split('.');
                            if (parts.length === 3) {
                                const dayMonth = `${parts[0]}.${parts[1]}.`;
                                const year = parts[2];
                                input.value = `${dayMonth}${year}`;
                            }
                            
                            document.getElementById(`calendar-${type}`).style.display = 'none';
                            
                            // Auto-aktualizace splatnosti
                            if (type === 'issue') {
                                const dueDate = new Date(selectedDate.getTime() + (14 * 24 * 60 * 60 * 1000));
                                const dueDateInput = document.getElementById('due-date');
                                if (dueDateInput) {
                                    const dueParts = dueDate.toLocaleDateString('cs-CZ', {
                                        day: 'numeric', month: 'numeric', year: 'numeric'
                                    }).split('.');
                                    if (dueParts.length === 3) {
                                        dueDateInput.value = `${dueParts[0]}.${dueParts[1]}.${dueParts[2]}`;
                                    }
                                }
                            }
                        };
                        
                        date++;
                    }
                }
                
                if (date > daysInMonth) break;
            }
        };
        
        window.changeCalendarMonth = (type, direction) => {
            const state = window.calendarState[type];
            state.month += direction;
            if (state.month > 11) {
                state.month = 0;
                state.year++;
            } else if (state.month < 0) {
                state.month = 11;
                state.year--;
            }
            generateCalendarForField(type);
        };
        
        // Zavři kalendář kliknutím mimo něj
        document.addEventListener('click', function(e) {
            const calendars = document.querySelectorAll('.calendar-popup');
            const inputs = document.querySelectorAll('#issue-date, #due-date');
            
            let clickedInside = false;
            [...calendars, ...inputs].forEach(element => {
                if (element.contains(e.target)) clickedInside = true;
            });
            
            if (!clickedInside) {
                calendars.forEach(cal => cal.style.display = 'none');
            }
        });
        
        // Automatické generování čísla faktury při načtení
        this.generateInvoiceNumber();
        
        this.setDefaultDates();
        this.loadClients();
        this.loadSupplierInfo();
        
        // Globální funkce pro editaci dodavatele
        window.editSupplierInfo = () => this.showSupplierModal();
        
        console.log('✅ InvoiceFormComponent inicializován');
    }
    
    onEvent(eventType, data) {
        switch(eventType) {
            case 'sectionChanged':
                this.handleSectionChange(data);
                break;
            case 'editingInvoiceChanged':
                if (data) {
                    this.loadInvoiceForEdit(data);
                } else {
                    this.clearForm();
                }
                break;
        }
    }
    
    handleSectionChange(section) {
        if (section === 'form') {
            this.show();
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
    
    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        
        // Získání dat z input elementů
        const issueDateText = this.container.querySelector('#issue-date').value;
        const dueDateText = this.container.querySelector('#due-date').value;
        
        const invoiceData = {
            number: this.container.querySelector('#invoice-number').value,
            issueDate: this.formatDateForBackend(issueDateText),
            clientName: formData.get('clientName'),
            clientAddress: formData.get('clientAddress'),
            clientIco: formData.get('clientIco'),
            clientDic: formData.get('clientDic'),
            amount: parseFloat(formData.get('amount')),
            description: formData.get('description'),
            dueDate: this.formatDateForBackend(dueDateText)
        };
        
        const errors = this.validateInvoiceData(invoiceData);
        if (errors.length > 0) {
            showNotification(errors.join(', '), 'error');
            return;
        }
        
        if (this.editingId) {
            invoiceData.id = this.editingId;
            AppState.updateInvoice(invoiceData);
        } else {
            AppState.addInvoice(invoiceData);
        }
        
        this.clearForm();
        this.hidePreview();
    }
    
    showPreview() {
        const formData = new FormData(this.form);
        
        // Získání dat z input elementů
        const issueDateText = this.container.querySelector('#issue-date').value;
        const dueDateText = this.container.querySelector('#due-date').value;
        
        const invoiceData = {
            number: formData.get('number') || 'Nevyplněno',
            issueDate: this.formatDateForBackend(issueDateText) || new Date().toISOString().split('T')[0],
            clientName: formData.get('clientName') || 'Nevybrán klient',
            clientAddress: formData.get('clientAddress') || '',
            amount: parseFloat(formData.get('amount')) || 0,
            description: formData.get('description') || 'Popis služeb',
            dueDate: this.formatDateForBackend(dueDateText) || new Date().toISOString().split('T')[0]
        };
        
        // Načti údaje dodavatele
        const supplier = this.getStoredSupplier();
        
        // Vyplnění náhledu
        this.container.querySelector('#preview-invoice-number').textContent = invoiceData.number;
        this.container.querySelector('#preview-issue-date').innerHTML = formatDate(invoiceData.issueDate, true);
        this.container.querySelector('#preview-due-date').innerHTML = formatDate(invoiceData.dueDate, true);
        
        // Aktualizuj údaje dodavatele v náhledu
        const supplierInfo = this.container.querySelector('.company-details');
        if (supplierInfo) {
            supplierInfo.innerHTML = `
                <strong>${supplier.name}</strong><br>
                IČO: ${supplier.ico}<br>
                ${supplier.dic ? `DIČ: ${supplier.dic}<br>` : ''}
                ${supplier.address}<br>
                Účet: ${supplier.account}
            `;
        }
        
        this.container.querySelector('#preview-client-info').innerHTML = 
            `<strong>${invoiceData.clientName}</strong><br>${invoiceData.clientAddress.replace(/\n/g, '<br>')}`;
        
        this.container.querySelector('#preview-description').textContent = invoiceData.description;
        
        // Jen celková částka
        this.container.querySelector('#preview-total-amount').textContent = invoiceData.amount.toFixed(2);
        this.container.querySelector('#preview-variable-symbol').textContent = 
            invoiceData.number.replace(/[^0-9]/g, '') || '123456';
        this.container.querySelector('#preview-account').textContent = supplier.account;
        
        // Generuj QR kód pro platbu
        this.generatePaymentQR(supplier.account, invoiceData.amount, invoiceData.number.replace(/[^0-9]/g, ''));
        
        this.previewContainer.classList.remove('hidden');
        this.previewContainer.scrollIntoView({ behavior: 'smooth' });
    }
    
    hidePreview() {
        this.previewContainer.classList.add('hidden');
    }
    
    clearForm() {
        this.form.reset();
        this.hidePreview();
        this.setDefaultDates();
        this.editingId = null;
        
        // Odznač checkbox a vymaž výběr klienta
        this.container.querySelector('#previous-month-check').checked = false;
        this.container.querySelector('#client-select').value = '';
        this.container.querySelector('#client-preview').classList.add('hidden');
        
        // Vygeneruj nové číslo faktury
        this.generateInvoiceNumber();
        
        this.titleText.textContent = 'Nová faktura';
        this.submitBtn.innerHTML = '💾 Uložit fakturu';
    }
    
    setDefaultDates() {
        const today = new Date();
        const dueDate = new Date(today.getTime() + (14 * 24 * 60 * 60 * 1000)); // +14 dní
        
        // Nastavení výchozích dat v českém formátu bez HTML
        this.container.querySelector('#issue-date').value = formatDate(today);
        this.container.querySelector('#due-date').value = formatDate(dueDate);
    }
    
    updateDueDateFromIssueDate(event) {
        const issueDate = this.parseDate(event.target.value);
        if (issueDate) {
            const dueDate = new Date(issueDate.getTime() + (14 * 24 * 60 * 60 * 1000)); // +14 dní od data vystavení
            this.container.querySelector('#due-date').value = formatDate(dueDate);
            
            console.log(`📅 Datum splatnosti automaticky nastaveno na: ${formatDate(dueDate)}`);
        }
    }
    
    handlePreviousMonthCheck(event) {
        const checkbox = event.target;
        const issueDateInput = this.container.querySelector('#issue-date');
        
        if (checkbox.checked) {
            // Vypočítej poslední den minulého měsíce
            const today = new Date();
            const lastDayPreviousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            
            // Nastav datum vystavení v českém formátu
            issueDateInput.value = formatDate(lastDayPreviousMonth);
            
            // Automaticky aktualizuj datum splatnosti
            const dueDate = new Date(lastDayPreviousMonth.getTime() + (14 * 24 * 60 * 60 * 1000));
            this.container.querySelector('#due-date').value = formatDate(dueDate);
            
            console.log(`📆 Nastaveno datum minulý měsíc: ${formatDate(lastDayPreviousMonth)}`);
            showNotification(`Datum nastaveno na poslední den minulého měsíce: ${formatDate(lastDayPreviousMonth)}`, 'info');
            
        } else {
            // Vrať na dnešní datum
            const today = new Date();
            issueDateInput.value = formatDate(today);
            
            const dueDate = new Date(today.getTime() + (14 * 24 * 60 * 60 * 1000));
            this.container.querySelector('#due-date').value = formatDate(dueDate);
            
            console.log(`📅 Vráceno na dnešní datum: ${formatDate(today)}`);
        }
    }
    
    generateInvoiceNumber() {
        // Pokud editujeme fakturu, negeneruj nové číslo
        if (this.editingId) {
            return;
        }
        
        const currentYear = new Date().getFullYear();
        const existingInvoices = AppState.invoices || [];
        
        // Najdi všechny faktury z aktuálního roku
        const currentYearInvoices = existingInvoices.filter(invoice => {
            const number = invoice.number.toString();
            // Kontrola jestli číslo obsahuje aktuální rok
            return number.includes(currentYear.toString());
        });
        
        // Najdi nejvyšší číslo
        let maxNumber = 0;
        currentYearInvoices.forEach(invoice => {
            const number = parseInt(invoice.number);
            if (!isNaN(number) && number > maxNumber) {
                maxNumber = number;
            }
        });
        
        // Generuj nové číslo: pořadové číslo + rok
        const nextSequence = currentYearInvoices.length + 1;
        const newInvoiceNumber = `${nextSequence}${currentYear}`;
        
        // Nastav do pole
        this.container.querySelector('#invoice-number').value = newInvoiceNumber;
        
        console.log(`🔢 Vygenerováno číslo faktury: ${newInvoiceNumber} (${nextSequence}. faktura v roce ${currentYear})`);
        
        return newInvoiceNumber;
    }
    
    loadClients() {
        const clients = this.getStoredClients();
        const dropdownOptions = this.container.querySelector('#dropdown-options');
        
        // Vymaž všechny možnosti
        dropdownOptions.innerHTML = '';
        
        // Přidej klienty do dropdownu
        clients.forEach(client => {
            const option = document.createElement('div');
            option.className = 'dropdown-option';
            option.innerHTML = `
                <div class="option-main-line">${client.name} (IČO: ${client.ico})</div>
                <div class="option-sub-line">${client.address.replace(/\n/g, ', ')}</div>
            `;
            option.addEventListener('click', () => this.selectClient(client));
            dropdownOptions.appendChild(option);
        });
        
        // Předvyplň posledního klienta (pokud existuje)
        if (clients.length > 0) {
            const lastClient = clients[clients.length - 1];
            this.selectClient(lastClient);
        }
        
        console.log(`📋 Načteno ${clients.length} klientů, předvyplněn poslední`);
    }
    
    toggleDropdown() {
        const selected = this.container.querySelector('#dropdown-selected');
        const options = this.container.querySelector('#dropdown-options');
        
        if (options.style.display === 'block') {
            options.style.display = 'none';
            selected.classList.remove('open');
        } else {
            options.style.display = 'block';
            selected.classList.add('open');
        }
    }
    
    selectClient(client) {
        const selected = this.container.querySelector('#dropdown-selected');
        const options = this.container.querySelector('#dropdown-options');
        
        // Aktualizuj zobrazený text
        selected.querySelector('.client-main-line').textContent = `${client.name} (IČO: ${client.ico})`;
        selected.querySelector('.client-sub-line').textContent = client.address.replace(/\n/g, ', ');
        
        // Zavři dropdown
        options.style.display = 'none';
        selected.classList.remove('open');
        
        // Vyplň skrytá pole
        this.container.querySelector('#client-name').value = client.name;
        this.container.querySelector('#client-address').value = client.address;
        this.container.querySelector('#client-ico').value = client.ico;
        this.container.querySelector('#client-dic').value = client.dic || '';
        
        // Náhled již není potřeba - všechno je v dropdownu
        
        console.log('👤 Klient vybrán:', client.name);
    }
    
    handleClientSelect(event) {
        const selectedValue = event.target.value;
        const clientPreview = this.container.querySelector('#client-preview');
        
        if (selectedValue) {
            try {
                const client = JSON.parse(selectedValue);
                
                // Vyplň skrytá pole
                this.container.querySelector('#client-name').value = client.name;
                this.container.querySelector('#client-address').value = client.address;
                this.container.querySelector('#client-ico').value = client.ico;
                this.container.querySelector('#client-dic').value = client.dic || '';
                
                // Zobraz náhled klienta
                this.container.querySelector('#preview-client-name').textContent = client.name;
                this.container.querySelector('#preview-client-address').textContent = client.address;
                this.container.querySelector('#preview-client-ico').textContent = client.ico;
                
                const dicWrapper = this.container.querySelector('#preview-client-dic-wrapper');
                if (client.dic) {
                    this.container.querySelector('#preview-client-dic').textContent = client.dic;
                    dicWrapper.classList.remove('hidden');
                } else {
                    dicWrapper.classList.add('hidden');
                }
                
                clientPreview.classList.remove('hidden');
                
                console.log('👤 Klient vybrán:', client.name);
                
            } catch (error) {
                console.error('❌ Chyba při načítání klienta:', error);
            }
        } else {
            // Skryj náhled a vymaž pole
            clientPreview.classList.add('hidden');
            this.container.querySelector('#client-name').value = '';
            this.container.querySelector('#client-address').value = '';
            this.container.querySelector('#client-ico').value = '';
            this.container.querySelector('#client-dic').value = '';
        }
    }
    
    showNewClientModal() {
        const modal = this.container.querySelector('#new-client-modal');
        modal.classList.remove('hidden');
        
        // Focus na první pole
        setTimeout(() => {
            this.container.querySelector('#new-client-name').focus();
        }, 100);
    }
    
    hideNewClientModal() {
        const modal = this.container.querySelector('#new-client-modal');
        modal.classList.add('hidden');
        
        // Vymaž formulář
        const form = this.container.querySelector('#new-client-form');
        form.reset();
    }
    
    handleNewClientSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        
        const clientData = {
            name: formData.get('name') || this.container.querySelector('#new-client-name').value,
            street: this.container.querySelector('#new-client-street').value,
            city: this.container.querySelector('#new-client-city').value,
            postal: this.container.querySelector('#new-client-postal').value,
            ico: this.container.querySelector('#new-client-ico').value,
            dic: this.container.querySelector('#new-client-dic').value
        };
        
        // Validace
        const errors = [];
        if (!clientData.name) errors.push('Název/jméno je povinné');
        if (!clientData.street) errors.push('Ulice je povinná');
        if (!clientData.city) errors.push('Město je povinné');
        if (!clientData.postal) errors.push('PSČ je povinné');
        if (!clientData.ico) errors.push('IČO je povinné');
        
        if (errors.length > 0) {
            showNotification(errors.join(', '), 'error');
            return;
        }
        
        // Sestavení adresy
        clientData.address = `${clientData.street}\n${clientData.postal} ${clientData.city}`;
        
        // Uložení klienta
        this.saveClient(clientData);
        
        // Zavření modalu
        this.hideNewClientModal();
        
        // Reload seznamu a automatický výběr nového klienta
        this.loadClients();
        
        const clientSelect = this.container.querySelector('#client-select');
        const newOption = Array.from(clientSelect.options).find(option => {
            if (option.value) {
                try {
                    const client = JSON.parse(option.value);
                    return client.name === clientData.name && client.ico === clientData.ico;
                } catch {
                    return false;
                }
            }
            return false;
        });
        
        if (newOption) {
            clientSelect.value = newOption.value;
            this.handleClientSelect({ target: clientSelect });
        }
        
        showNotification(`Klient ${clientData.name} byl úspěšně přidán!`, 'success');
    }
    
    // SPRÁVA ÚDAJŮ DODAVATELE
    loadSupplierInfo() {
        const supplier = this.getStoredSupplier();
        const nameEl = this.container.querySelector('.supplier-name');
        const detailsEl = this.container.querySelector('.supplier-details');
        
        if (nameEl) nameEl.textContent = supplier.name;
        if (detailsEl) detailsEl.textContent = `IČO: ${supplier.ico} | ${supplier.account}`;
    }
    
    getStoredSupplier() {
        try {
            const stored = localStorage.getItem('invoiceApp_supplier');
            return stored ? JSON.parse(stored) : {
                name: 'Vaše firma s.r.o.',
                street: 'Hlavní ulice 123',
                city: 'Praha 1',
                postal: '110 00',
                ico: '12345678',
                dic: 'CZ12345678',
                account: '123456789/0100'
            };
        } catch (error) {
            console.error('❌ Chyba při načítání údajů dodavatele:', error);
            return {
                name: 'Vaše firma s.r.o.',
                street: 'Hlavní ulice 123',
                city: 'Praha 1', 
                postal: '110 00',
                ico: '12345678',
                dic: 'CZ12345678',
                account: '123456789/0100'
            };
        }
    }
    
    showSupplierModal() {
        const modal = this.container.querySelector('#supplier-modal');
        const supplier = this.getStoredSupplier();
        
        // Předvyplň formulář
        this.container.querySelector('#supplier-form #supplier-name').value = supplier.name;
        this.container.querySelector('#supplier-form #supplier-street').value = supplier.street;
        this.container.querySelector('#supplier-form #supplier-city').value = supplier.city;
        this.container.querySelector('#supplier-form #supplier-postal').value = supplier.postal;
        this.container.querySelector('#supplier-form #supplier-ico').value = supplier.ico;
        this.container.querySelector('#supplier-form #supplier-dic').value = supplier.dic;
        this.container.querySelector('#supplier-form #supplier-account').value = supplier.account;
        
        modal.classList.remove('hidden');
        
        setTimeout(() => {
            this.container.querySelector('#supplier-form #supplier-name').focus();
        }, 100);
    }
    
    hideSupplierModal() {
        const modal = this.container.querySelector('#supplier-modal');
        modal.classList.add('hidden');
    }
    
    handleSupplierSubmit(e) {
        e.preventDefault();
        
        const supplierData = {
            name: this.container.querySelector('#supplier-form #supplier-name').value,
            street: this.container.querySelector('#supplier-form #supplier-street').value,
            city: this.container.querySelector('#supplier-form #supplier-city').value,
            postal: this.container.querySelector('#supplier-form #supplier-postal').value,
            ico: this.container.querySelector('#supplier-form #supplier-ico').value,
            dic: this.container.querySelector('#supplier-form #supplier-dic').value,
            account: this.container.querySelector('#supplier-form #supplier-account').value
        };
        
        // Validace
        const errors = [];
        if (!supplierData.name) errors.push('Název firmy je povinný');
        if (!supplierData.street) errors.push('Ulice je povinná');
        if (!supplierData.city) errors.push('Město je povinné');
        if (!supplierData.postal) errors.push('PSČ je povinné');
        if (!supplierData.ico) errors.push('IČO je povinné');
        if (!supplierData.account) errors.push('Bankovní účet je povinný');
        
        if (errors.length > 0) {
            showNotification(errors.join(', '), 'error');
            return;
        }
        
        // Sestavení adresy
        supplierData.address = `${supplierData.street}\n${supplierData.postal} ${supplierData.city}`;
        
        // Uložení
        localStorage.setItem('invoiceApp_supplier', JSON.stringify(supplierData));
        
        // Aktualizace zobrazení
        this.loadSupplierInfo();
        
        this.hideSupplierModal();
        showNotification('Údaje dodavatele byly uloženy!', 'success');
    }
    
    generatePaymentQR(account, amount, variableSymbol) {
        // SPD QR kód podle českého standardu
        const qrString = `SPD*1.0*ACC:${account}*AM:${amount.toFixed(2)}*CC:CZK*VS:${variableSymbol}`;
        
        // Použij QR.js API pro generování
        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(qrString)}`;
        
        const qrImg = this.container.querySelector('#qr-code');
        if (qrImg) {
            qrImg.src = qrApiUrl;
        }
        
        console.log(`💳 QR kód vygenerován: ${qrString}`);
    }
    
    saveClient(clientData) {
        const clients = this.getStoredClients();
        
        // Zkontroluj jestli klient už neexistuje (podle IČO)
        const existingIndex = clients.findIndex(c => c.ico === clientData.ico);
        
        if (existingIndex >= 0) {
            // Aktualizuj existujícího klienta
            clients[existingIndex] = clientData;
            console.log('✏️ Klient aktualizován:', clientData.name);
        } else {
            // Přidej nového klienta
            clients.push(clientData);
            console.log('👤 Nový klient uložen:', clientData.name);
        }
        
        // Ulož do localStorage
        localStorage.setItem('invoiceApp_clients', JSON.stringify(clients));
    }
    
    getStoredClients() {
        try {
            const stored = localStorage.getItem('invoiceApp_clients');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('❌ Chyba při načítání klientů:', error);
            return [];
        }
    }
    
    loadInvoiceForEdit(invoice) {
        // Základní údaje faktury
        this.container.querySelector('#invoice-number').value = invoice.number;
        this.container.querySelector('#issue-date').value = invoice.issueDate ? formatDate(invoice.issueDate) : formatDate(invoice.createdAt);
        this.container.querySelector('#amount').value = invoice.amount;
        this.container.querySelector('#description').value = invoice.description;
        this.container.querySelector('#due-date').value = formatDate(invoice.dueDate);
        
        // Načtení klienta
        if (invoice.clientName) {
            // Vyplň skrytá pole
            this.container.querySelector('#client-name').value = invoice.clientName;
            this.container.querySelector('#client-address').value = invoice.clientAddress || '';
            this.container.querySelector('#client-ico').value = invoice.clientIco || '';
            this.container.querySelector('#client-dic').value = invoice.clientDic || '';
            
            // Pokus o nalezení klienta v dropdownu
            const clientSelect = this.container.querySelector('#client-select');
            let clientFound = false;
            
            for (let option of clientSelect.options) {
                if (option.value) {
                    try {
                        const client = JSON.parse(option.value);
                        if (client.name === invoice.clientName) {
                            clientSelect.value = option.value;
                            this.handleClientSelect({ target: clientSelect });
                            clientFound = true;
                            break;
                        }
                    } catch (error) {
                        continue;
                    }
                }
            }
            
            // Pokud klient není v dropdownu, vytvoř "dočasný náhled"
            if (!clientFound) {
                const clientPreview = this.container.querySelector('#client-preview');
                this.container.querySelector('#preview-client-name').textContent = invoice.clientName;
                this.container.querySelector('#preview-client-address').textContent = invoice.clientAddress || '';
                this.container.querySelector('#preview-client-ico').textContent = invoice.clientIco || 'N/A';
                
                const dicWrapper = this.container.querySelector('#preview-client-dic-wrapper');
                if (invoice.clientDic) {
                    this.container.querySelector('#preview-client-dic').textContent = invoice.clientDic;
                    dicWrapper.classList.remove('hidden');
                } else {
                    dicWrapper.classList.add('hidden');
                }
                
                clientPreview.classList.remove('hidden');
            }
        }
        
        this.editingId = invoice.id;
        
        this.titleText.textContent = `Upravit fakturu ${invoice.number}`;
        this.submitBtn.innerHTML = '✏️ Aktualizovat fakturu';
        
        this.hidePreview();
        showNotification(`Faktura ${invoice.number} načtena pro úpravu`, 'info');
    }
    
    // Funkce pro parsování českého formátu data (dd.mm.yyyy)
    parseDate(dateString) {
        if (!dateString) return null;
        
        const parts = dateString.split('.');
        if (parts.length !== 3) return null;
        
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // měsíce jsou 0-indexované
        const year = parseInt(parts[2], 10);
        
        const date = new Date(year, month, day);
        
        // Kontrola validity data
        if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
            return null;
        }
        
        return date;
    }
    
    // Převod českého formátu na ISO formát pro backend
    formatDateForBackend(dateString) {
        const date = this.parseDate(dateString);
        return date ? date.toISOString().split('T')[0] : dateString;
    }
    
    // Zobrazení vlastního kalendáře
    showDatePicker(dateFieldId) {
        console.log(`📅 Začínám otevírání kalendáře pro ${dateFieldId}`);
        
        const calendar = this.container.querySelector(`#${dateFieldId}-calendar`);
        const visibleField = this.container.querySelector(`#${dateFieldId}`);
        
        if (!calendar) {
            console.error('❌ Kalendář element nenalezen:', `#${dateFieldId}-calendar`);
            return;
        }
        
        if (!visibleField) {
            console.error('❌ Pole pro datum nenalezeno:', `#${dateFieldId}`);
            return;
        }
        
        console.log(`📅 Otevírám vlastní kalendář pro ${dateFieldId}`);
        
        // Skryj všechny ostatní kalendáře
        this.hideAllCalendars();
        
        // Získej aktuální datum z pole nebo použij dnešní
        let currentDate = new Date();
        const currentText = visibleField.textContent.trim();
        if (currentText && !currentText.includes('klik pro kalendář')) {
            const parsed = this.parseDate(currentText);
            if (parsed) currentDate = parsed;
        }
        
        console.log('📅 Vytvářím kalendář s datem:', currentDate);
        
        // Vytvořit kalendář
        this.createCalendar(calendar, currentDate, (selectedDate) => {
            console.log('📅 Datum vybráno:', selectedDate);
            visibleField.innerHTML = formatDate(selectedDate, true);
            
            // Pokud se mění datum vystavení, automaticky aktualizuj splatnost
            if (dateFieldId === 'issue-date') {
                const dueDate = new Date(selectedDate.getTime() + (14 * 24 * 60 * 60 * 1000));
                this.container.querySelector('#due-date').innerHTML = formatDate(dueDate, true);
                console.log('📅 Automaticky aktualizováno datum splatnosti');
            }
            
            this.hideCalendar(calendar);
        });
        
        // Zobraz kalendář
        calendar.classList.remove('hidden');
        console.log('📅 Kalendář zobrazen (třída hidden odebrána)');
        
        // Test - pokud se kalendář pořád nezobrazuje, vytvoř jednoduchý
        setTimeout(() => {
            if (calendar.innerHTML.trim() === '') {
                console.log('🔧 Kalendář je prázdný, vytvářím záložní verzi');
                calendar.innerHTML = `
                    <div style="padding: 20px; background: white; border: 2px solid #007bff; border-radius: 8px;">
                        <h4>📅 Rychlý výběr data</h4>
                        <button type="button" onclick="this.parentElement.parentElement.style.display='none'; 
                                document.querySelector('#${dateFieldId}').innerHTML=formatDate(new Date(), true)">
                            Dnes
                        </button>
                        <button type="button" onclick="this.parentElement.parentElement.style.display='none'">
                            Zavřít
                        </button>
                    </div>
                `;
            }
        }, 200);
    }
    
    // JEDNODUCHÁ metoda kalendáře
    simpleCalendar(dateFieldId) {
        console.log('📅 SIMPLE CALENDAR pro:', dateFieldId);
        
        const field = this.container.querySelector(`#${dateFieldId}`);
        const calendar = this.container.querySelector(`#${dateFieldId}-calendar`);
        
        if (!field || !calendar) {
            console.error('❌ Elementy nenalezeny:', !!field, !!calendar);
            return;
        }
        
        // Skryj všechny kalendáře
        this.container.querySelectorAll('.custom-calendar').forEach(cal => {
            cal.classList.add('hidden');
        });
        
        // Vytvoř jednoduchý kalendář
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        calendar.innerHTML = `
            <div style="padding: 15px; background: white; border: 2px solid #007bff; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                <h4 style="margin: 0 0 10px 0; color: #007bff;">📅 Výběr data</h4>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <button type="button" onclick="document.querySelector('#${dateFieldId}').innerHTML=formatDate(new Date(${yesterday.getTime()}), true); this.closest('.custom-calendar').classList.add('hidden');" 
                            style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">
                        Včera (${yesterday.toLocaleDateString('cs-CZ')})
                    </button>
                    <button type="button" onclick="document.querySelector('#${dateFieldId}').innerHTML=formatDate(new Date(${today.getTime()}), true); this.closest('.custom-calendar').classList.add('hidden');" 
                            style="padding: 8px; border: 1px solid #007bff; border-radius: 4px; cursor: pointer; background: #e3f2fd;">
                        Dnes (${today.toLocaleDateString('cs-CZ')})
                    </button>
                    <button type="button" onclick="document.querySelector('#${dateFieldId}').innerHTML=formatDate(new Date(${tomorrow.getTime()}), true); this.closest('.custom-calendar').classList.add('hidden');" 
                            style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">
                        Zítra (${tomorrow.toLocaleDateString('cs-CZ')})
                    </button>
                    <button type="button" onclick="this.closest('.custom-calendar').classList.add('hidden');" 
                            style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; background: #f5f5f5; margin-top: 5px;">
                        Zavřít
                    </button>
                </div>
            </div>
        `;
        
        // Zobraz kalendář
        calendar.classList.remove('hidden');
        console.log('📅 Jednoduchý kalendář zobrazen!');
    }
    
    createCalendar(container, currentDate, onDateSelect) {
        const today = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        const monthNames = [
            'Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen',
            'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'
        ];
        
        const dayNames = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];
        
        container.innerHTML = `
            <div class="calendar-header">
                <button type="button" class="calendar-nav-btn" id="prev-month">←</button>
                <div class="calendar-month-year">${monthNames[month]} ${year}</div>
                <button type="button" class="calendar-nav-btn" id="next-month">→</button>
            </div>
            <div class="calendar-grid">
                ${dayNames.map(day => `<div class="calendar-day-header">${day}</div>`).join('')}
                <div id="calendar-days"></div>
            </div>
            <div class="calendar-actions">
                <button type="button" class="calendar-btn secondary" id="calendar-cancel">Zrušit</button>
                <button type="button" class="calendar-btn primary" id="calendar-today">Dnes</button>
            </div>
        `;
        
        // Generuj dny
        this.generateCalendarDays(container, year, month, today, currentDate, onDateSelect);
        
        // Event listenery
        container.querySelector('#prev-month').addEventListener('click', () => {
            const newDate = new Date(year, month - 1, 1);
            this.createCalendar(container, newDate, onDateSelect);
        });
        
        container.querySelector('#next-month').addEventListener('click', () => {
            const newDate = new Date(year, month + 1, 1);
            this.createCalendar(container, newDate, onDateSelect);
        });
        
        container.querySelector('#calendar-today').addEventListener('click', () => {
            onDateSelect(today);
        });
        
        container.querySelector('#calendar-cancel').addEventListener('click', () => {
            this.hideCalendar(container);
        });
    }
    
    generateCalendarDays(container, year, month, today, currentDate, onDateSelect) {
        const daysContainer = container.querySelector('#calendar-days');
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        
        // Začni v pondělí (1 = pondělí, 0 = neděle -> převedeme na 6)
        const dayOfWeek = (firstDay.getDay() + 6) % 7;
        startDate.setDate(startDate.getDate() - dayOfWeek);
        
        let html = '';
        for (let i = 0; i < 42; i++) { // 6 týdnů × 7 dní
            const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
            const isCurrentMonth = date.getMonth() === month;
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = date.toDateString() === currentDate.toDateString();
            
            const classes = ['calendar-day'];
            if (!isCurrentMonth) classes.push('other-month');
            if (isToday) classes.push('today');
            if (isSelected) classes.push('selected');
            
            html += `<div class="${classes.join(' ')}" data-date="${date.toISOString().split('T')[0]}">
                ${date.getDate()}
            </div>`;
        }
        
        daysContainer.innerHTML = html;
        
        // Event listenery pro dny
        daysContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('calendar-day')) {
                const dateStr = e.target.dataset.date;
                const selectedDate = new Date(dateStr);
                onDateSelect(selectedDate);
            }
        });
    }
    
    hideCalendar(calendar) {
        calendar.classList.add('hidden');
    }
    
    hideAllCalendars() {
        const calendars = this.container.querySelectorAll('.custom-calendar');
        calendars.forEach(calendar => calendar.classList.add('hidden'));
    }
    
    validateInvoiceData(data) {
        const errors = [];
        
        if (!data.number || data.number.trim() === '') {
            errors.push('Číslo faktury je povinné');
        }
        
        if (!data.issueDate) {
            errors.push('Datum vystavení je povinné');
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
        
        // Kontrola dat
        if (data.issueDate && data.dueDate) {
            const issueDate = new Date(data.issueDate);
            const dueDate = new Date(data.dueDate);
            
            if (dueDate < issueDate) {
                errors.push('Datum splatnosti nemůže být před datem vystavení');
            }
        }
        
        return errors;
    }
}

// Registrace do window objektu
window.InvoiceFormComponent = InvoiceFormComponent;
console.log('📦 InvoiceFormComponent načten');