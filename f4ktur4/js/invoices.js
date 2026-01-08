// Check authentication
checkAuth();

// Load all invoices from Firebase
var invoicesRef = firebase.database().ref("invoice");

invoicesRef.on('value', function(snapshot) {
    var invoices = [];

    snapshot.forEach(function(childSnapshot) {
        invoices.push({
            key: childSnapshot.key,
            data: childSnapshot.val()
        });
    });

    // Sort by invoice number (newest first)
    invoices.sort(function(a, b) {
        var aNum = parseInt(a.data.invoice_number_year + String(a.data.invoice_number).padStart(2, '0'));
        var bNum = parseInt(b.data.invoice_number_year + String(b.data.invoice_number).padStart(2, '0'));
        return bNum - aNum;
    });

    renderInvoices(invoices);
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

    invoices.forEach(function(invoice) {
        var data = invoice.data;
        var isArchived = data.archived === true;
        var invNumber = String(data.invoice_number).padStart(2, '0');
        var amount = formatAmount(data.amount);
        var clientName = data.client_name || 'Neznámý klient';

        // Header: number year + client name
        var headerText = invNumber + ' ' + data.invoice_number_year + ' — ' + clientName;

        // Info line: amount, date
        var infoLine = amount + ' Kč, ' + data.date_issued;

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
    var invoiceRef = firebase.database().ref("invoice").child(key);

    invoiceRef.once('value').then(function(snapshot) {
        var data = snapshot.val();

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
    });
}

// Archive invoice
$(document).on('click', '.invoice-item .archive', function() {
    var key = $(this).data('key');
    var item = $(this).closest('.invoice-item');
    var invoiceNumber = item.find('.item-header').text();

    if (confirm('Archivovat fakturu ' + invoiceNumber + '?')) {
        firebase.database().ref("invoice").child(key).update({ archived: true })
            .catch(function(error) {
                alert('Chyba: ' + error.message);
            });
    }
});

// Reactivate invoice
$(document).on('click', '.invoice-item .reactivate', function() {
    var key = $(this).data('key');

    firebase.database().ref("invoice").child(key).update({ archived: false })
        .catch(function(error) {
            alert('Chyba: ' + error.message);
        });
});
