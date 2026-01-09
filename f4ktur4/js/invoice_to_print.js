// Check authentication
checkAuth();

// Store PDF filename parts
var pdfFilenameParts = {
    myName: '',
    invoiceNumber: '',
    year: '',
    clientName: ''
};

// Build filename: fa-ales-brom-1-25-martin.pdf
function buildPdfFilename() {
    var parts = [];
    parts.push('fa');
    if (pdfFilenameParts.myName) {
        parts.push(pdfFilenameParts.myName.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
    }
    parts.push(pdfFilenameParts.invoiceNumber);
    parts.push(pdfFilenameParts.year.slice(-2)); // Last 2 digits of year
    if (pdfFilenameParts.clientName) {
        parts.push(pdfFilenameParts.clientName.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9-]/g, ''));
    }
    return parts.join('-') + '.pdf';
}

// Save & Print button handler
$('#savePrintBtn').on('click', function() {
    var previewData = sessionStorage.getItem('invoicePreview');
    var btn = $(this);

    btn.prop('disabled', true).addClass('saving');
    btn.find('p').html('Ukládám...');

    // Function to generate PDF
    function generatePDF() {
        btn.find('p').html('Generuji PDF...');

        // Hide buttons for PDF
        $('.print-buttons').hide();

        var element = document.body;
        var opt = {
            margin: [10, 10, 10, 10],
            filename: buildPdfFilename(),
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save().then(function() {
            // Show buttons again
            $('.print-buttons').show();
            btn.find('p').html('Hotovo');
            btn.removeClass('saving').addClass('done');
        });
    }

    if (!previewData) {
        // Already saved, just generate PDF
        generatePDF();
        return;
    }

    var data = JSON.parse(previewData);
    pdfFilenameParts.invoiceNumber = String(data.invoice_number);
    pdfFilenameParts.year = String(data.invoice_number_year);
    pdfFilenameParts.clientName = data.client_name || '';

    // Get my_key and my_name from about_me and save invoice
    firebase.database().ref("about_me").limitToLast(1).once('child_added').then(function(snapshot) {
        var myKey = snapshot.key;
        pdfFilenameParts.myName = snapshot.val().my_name || '';

        // Save invoice
        var invoiceRef = firebase.database().ref('invoice').push();
        return invoiceRef.set({
            'amount': data.amount,
            'client_key': data.client_key,
            'client_name': data.client_name,
            'date_issued': data.date_issued,
            'date_to_send': data.date_to_send,
            'for_what': data.for_what,
            'invoice_number': data.invoice_number,
            'invoice_number_year': data.invoice_number_year,
            'my_key': myKey,
            'thanks': data.thanks
        });
    }).then(function() {
        // Clear preview data
        sessionStorage.removeItem('invoicePreview');
        // Generate PDF
        generatePDF();
    }).catch(function(error) {
        alert('Chyba při ukládání: ' + error.message);
        btn.prop('disabled', false).removeClass('saving');
        btn.find('p').html('Uložit a vytisknout<br><span>a poslat klientovi</span>');
    });
});

// Format amount with CSS margin for thousands separator
function formatAmountWithSpans(amount) {
	var num = String(amount).replace(/\s/g, '');
	var parts = [];
	while (num.length > 3) {
		parts.unshift(num.slice(-3));
		num = num.slice(0, -3);
	}
	if (num.length > 0) {
		parts.unshift(num);
	}
	if (parts.length === 1) {
		return parts[0];
	}
	return parts.map(function(part, index) {
		if (index < parts.length - 1) {
			return "<span class='amount-thousands'>" + part + "</span>";
		}
		return part;
	}).join('');
}

// Check for preview data in sessionStorage first
var previewData = sessionStorage.getItem('invoicePreview');

if (previewData) {
	// Use data from form (preview mode)
	var data = JSON.parse(previewData);

	// Format invoice number (NN YYYY format)
	var inv_number = String(data.invoice_number).padStart(2, '0');
	var pure_invoice_number = inv_number + data.invoice_number_year;

	// Set invoice number with spacing between NN and YYYY
	$('#invoice_number').html("Faktura č. <span class='inv-nn'>" + inv_number + "</span><span class='inv-yyyy'>" + data.invoice_number_year + "</span>");

	// Set dates
	$('#date .date_to_send').html(data.date_to_send);
	$('.date_issued').html(data.date_issued);

	// Set amount with CSS spacing for thousands
	var amountClean = String(data.amount).replace(/\s/g, '');
	var amountFormatted = formatAmountWithSpans(amountClean);
	$('#amount .total_amount').html(amountFormatted + " Kč");

	// Set work description
	$('#for_what .for_what').html(data.for_what);

	// Set thanks
	$('#thanks .thanks').html(data.thanks);

	// Get client data from Firebase using client_key
	if (data.client_key) {
		var clientRef = firebase.database().ref("about_client").child(data.client_key);
		clientRef.once('value').then(function (snapshot) {
			var client_tax_id = snapshot.val().client_tax_id;
			if (client_tax_id && client_tax_id !== "") {
				client_tax_id = ", DIČ CZ" + snapshot.val().client_tax_id;
			} else {
				client_tax_id = "";
			}

			var client = snapshot.val().client_name_id + ", " + snapshot.val().client_address_street + ", " +
				snapshot.val().client_address_town + ", " + snapshot.val().client_address_zip;
			var client_legal_id = "IČ " + snapshot.val().client_legal_id + client_tax_id;

			$('#client .name').html(client);
			$('#client .legal_id').html(client_legal_id);
		});
	}

	// Get my info from Firebase
	var myRef = firebase.database().ref("about_me");
	myRef.limitToLast(1).on('child_added', function (snapshot) {
		var prefix = snapshot.val().my_account_number_prefix;
		if (prefix && prefix !== "") {
			prefix = prefix + " – ";
		} else {
			prefix = "";
		}

		var my_account = prefix + snapshot.val().my_account_number + " / " + snapshot.val().my_bank_code;
		var me = snapshot.val().my_name + ", " + snapshot.val().my_address_street + ", " +
			snapshot.val().my_address_town + ", " + snapshot.val().my_address_zip;
		var my_legal_id = "IČ " + snapshot.val().my_legal_id;

		$('#me .name').html(me);
		$('#me .legal_id').html(my_legal_id);
		$('#account_number .my_account_number').html(my_account);

		// QR code
		var pure_amount = data.amount.replace(/\s/g, '');
		var url = '<img src="https://api.paylibo.com/paylibo/generator/czech/image?accountNumber=' +
			snapshot.val().my_account_number + '&bankCode=' + snapshot.val().my_bank_code +
			'&amount=' + pure_amount + '&currency=CZK&vs=' + pure_invoice_number + '">';
		$('.qr').html(url);
	});

	// Clear sessionStorage after use (optional - keep for back button)
	// sessionStorage.removeItem('invoicePreview');

} else {
	// Fallback: load from Firebase (viewing saved invoice)
	var invoiceRef = firebase.database().ref("invoice");

	invoiceRef.limitToLast(1).on('child_added', function (snapshot) {
		// Format invoice number (NNYYYY format with letterspacing)
		var inv_number = String(snapshot.val().invoice_number).padStart(2, '0');
		var invoice_number_year = snapshot.val().invoice_number_year;
		var pure_invoice_number = inv_number + invoice_number_year;
		var for_what = snapshot.val().for_what;
		var pure_amount = snapshot.val().amount;
		var amount = formatAmountWithSpans(pure_amount) + " Kč";
		var date_to_send = snapshot.val().date_to_send;
		var date_issued = snapshot.val().date_issued;
		var thanks = snapshot.val().thanks;

		var clientref = firebase.database().ref("about_client").child(snapshot.val().client_key);

		clientref.once('value').then(function (snapshot) {
			var client_tax_id = snapshot.val().client_tax_id;

			if (client_tax_id !== "") {
				client_tax_id = ", DIČ CZ" + snapshot.val().client_tax_id;
			}

			var client = snapshot.val().client_name_id + ", " + snapshot.val().client_address_street + ", " +
				snapshot.val().client_address_town + ", " + snapshot.val().client_address_zip;
			var client_legal_id = "IČ " + snapshot.val().client_legal_id + client_tax_id;

			var myRef = firebase.database().ref("about_me");

			myRef.limitToLast(1).on('child_added', function (snapshot) {
				var prefix = snapshot.val().my_account_number_prefix;

				if (prefix !== "") {
					prefix = prefix + " – ";
				}

				var my_account = prefix + snapshot.val().my_account_number + " / " +
					snapshot.val().my_bank_code;

				var me = snapshot.val().my_name + ", " + snapshot.val().my_address_street + ", " +
					snapshot.val().my_address_town + ", " + snapshot.val().my_address_zip;

				var my_legal_id = "IČ " + snapshot.val().my_legal_id;

				$('#invoice_number').html("Faktura č. <span class='inv-nn'>" + inv_number + "</span><span class='inv-yyyy'>" + invoice_number_year + "</span>");

				$('#me .name').html(me);
				$('#me .legal_id').html(my_legal_id);

				$('#client .name').html(client);
				$('#client .legal_id').html(client_legal_id);

				$('#for_what .for_what').html(for_what);
				$('#amount .total_amount').html(amount);

				$('#date .date_to_send').html(date_to_send);
				$('.date_issued').html(date_issued);

				$('#account_number .my_account_number').html(my_account);

				$('#thanks .thanks').html(thanks);

				// QR code
				var a = moment(date_to_send, "DD-MM-YYYY").format('YYYY-MM-DD');
				var url = '<img src="https://api.paylibo.com/paylibo/generator/czech/image?accountNumber=' +
					snapshot.val().my_account_number + '&bankCode=' + snapshot.val().my_bank_code +
					'&amount=' + pure_amount + '&currency=CZK&vs=' + pure_invoice_number + '">';

				$('.qr').html(url);
			});
		});
	});
}
