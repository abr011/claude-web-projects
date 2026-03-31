// Store clients for name lookup
var clientsMap = {};

// Load clients first, then invoices
function loadData() {
    database.ref("about_client").once("value").then(function(clientSnapshot) {
        clientSnapshot.forEach(function(child) {
            clientsMap[child.key] = child.val().client_name_id;
        });

        return database.ref("invoice").once("value");
    }).then(function(invSnapshot) {
        var invoices = [];
        invSnapshot.forEach(function(child) {
            invoices.push({ key: child.key, ...child.val() });
        });
        // Sort newest first (by key descending)
        invoices.reverse();
        renderInvoices(invoices);
    }).catch(function(error) {
        console.error('Failed to load data:', error);
        alert('Nepodařilo se načíst data: ' + error.message);
    });
}

// Initial load
$(document).ready(function() {
    loadData();
});

function renderInvoices(invoices) {
    var container = $('#invoicesList');
    var emptyMessage = $('#emptyMessage');

    container.empty();

    if (invoices.length === 0) {
        emptyMessage.removeClass('hidden');
        return;
    }

    emptyMessage.addClass('hidden');

    var currentYear = null;

    invoices.forEach(function(invoice) {
        var isArchived = invoice.archived === true;
        var invNumber = String(invoice.invoice_number).padStart(2, '0');
        var amount = formatAmount(invoice.amount);
        var year = invoice.invoice_number_year;

        // Get client name from stored value or lookup from clients map
        var clientName = invoice.client_name || clientsMap[invoice.client_key] || 'Neznámý klient';

        // Add year divider if year changed
        if (year !== currentYear) {
            currentYear = year;
            container.append('<div class="year-divider">' + year + '</div>');
        }

        // Header: number + client name
        var headerText = invNumber + ' — ' + clientName;

        // Info line: amount, date
        var infoLine = amount + ' Kč, ' + invoice.date_issued;

        var html = '<div class="invoice-item' + (isArchived ? ' archived' : '') + '" data-key="' + invoice.key + '">' +
            '<div class="item-header">' + headerText + '</div>' +
            '<div class="item-row">' +
                '<div class="item-info">' + infoLine + '</div>' +
                '<div class="item-actions">';

        if (isArchived) {
            html += '<button class="action-btn reactivate" data-key="' + invoice.key + '">Obnovit</button>';
        } else {
            html += '<a href="#" class="action-link view-bezna" data-key="' + invoice.key + '">Běžná</a>' +
                '<a href="#" class="action-link view-nova" data-key="' + invoice.key + '">Pro nového klienta</a>' +
                '<a href="index.html?edit=' + invoice.key + '" class="action-link edit">Upravit</a>' +
                '<button class="action-btn archive" data-key="' + invoice.key + '">Archivovat</button>';
        }

        html += '</div></div></div>';

        container.append(html);
    });
}

function formatAmount(amount) {
    var num = String(amount).replace(/\s/g, '');
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

// Store invoices data for preview lookups
var invoicesData = {};

// Update invoicesData when loading
function loadInvoicesData() {
    database.ref("invoice").once("value").then(function(snapshot) {
        snapshot.forEach(function(child) {
            invoicesData[child.key] = { key: child.key, ...child.val() };
        });
    }).catch(function(error) {
        console.error('Failed to load invoices data:', error);
    });
}
loadInvoicesData();

// View invoice - load into sessionStorage and navigate
$(document).on('click', '.view-bezna', function(e) {
    e.preventDefault();
    var key = $(this).data('key');
    loadInvoiceAndNavigate(key, 'invoice_to_print.html');
});

$(document).on('click', '.view-nova', function(e) {
    e.preventDefault();
    var key = $(this).data('key');
    loadInvoiceAndNavigate(key, 'invoice_to_print3.html');
});

function loadInvoiceAndNavigate(key, targetPage) {
    var data = invoicesData[key];

    if (!data) {
        alert('Faktura nenalezena');
        return;
    }

    // Format for preview
    var previewData = {
        invoice_number: data.invoice_number,
        invoice_number_year: data.invoice_number_year,
        date_issued: data.date_issued,
        date_to_send: data.date_to_send,
        amount: data.amount,
        for_what: data.for_what,
        thanks: data.thanks,
        client_key: data.client_key
    };

    sessionStorage.setItem('invoicePreview', JSON.stringify(previewData));
    window.location.href = targetPage;
}

// Archive invoice
$(document).on('click', '.invoice-item .archive', function() {
    var key = $(this).data('key');
    var item = $(this).closest('.invoice-item');
    var invoiceNumber = item.find('.item-header').text();

    if (confirm('Archivovat fakturu ' + invoiceNumber + '?')) {
        database.ref("invoice/" + key).update({archived: true}).then(function() {
            loadData(); // Reload list
        }).catch(function(error) {
            alert('Chyba: ' + error.message);
        });
    }
});

// Reactivate invoice
$(document).on('click', '.invoice-item .reactivate', function() {
    var key = $(this).data('key');

    database.ref("invoice/" + key).update({archived: false}).then(function() {
        loadData(); // Reload list
    }).catch(function(error) {
        alert('Chyba: ' + error.message);
    });
});
