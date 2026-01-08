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
        var invNumber = String(data.invoice_number).padStart(2, '0');
        var amount = formatAmount(data.amount);

        var html = '<div class="invoice-item" data-key="' + invoice.key + '">' +
            '<div class="invoice-main">' +
                '<div class="invoice-number">' + invNumber + ' ' + data.invoice_number_year + '</div>' +
                '<div class="invoice-details">' +
                    '<span class="invoice-client">' + (data.client_name || 'Neznamy klient') + '</span>' +
                    '<span class="invoice-amount">' + amount + ' Kc</span>' +
                    '<span class="invoice-date">' + data.date_issued + '</span>' +
                '</div>' +
            '</div>' +
            '<div class="invoice-actions">' +
                '<a href="#" class="action-link view-bezna" data-key="' + invoice.key + '">Bezna</a>' +
                '<a href="#" class="action-link view-nova" data-key="' + invoice.key + '">Pro noveho klienta</a>' +
                '<a href="index.html?edit=' + invoice.key + '" class="action-link edit">Upravit</a>' +
                '<button class="action-btn delete" data-key="' + invoice.key + '">Smazat</button>' +
            '</div>' +
        '</div>';

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

// Delete invoice
$(document).on('click', '.delete', function() {
    var key = $(this).data('key');
    var item = $(this).closest('.invoice-item');
    var invoiceNumber = item.find('.invoice-number').text();

    if (confirm('Opravdu smazat fakturu ' + invoiceNumber + '?')) {
        firebase.database().ref("invoice").child(key).remove()
            .then(function() {
                item.fadeOut(300, function() {
                    $(this).remove();
                    // Check if list is empty
                    if ($('.invoice-item').length === 0) {
                        $('#emptyMessage').removeClass('hidden');
                    }
                });
            })
            .catch(function(error) {
                alert('Chyba pri mazani: ' + error.message);
            });
    }
});
