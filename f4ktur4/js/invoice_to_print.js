// Check authentication
checkAuth();

// Format amount - space only for 10000+
function formatAmountWithSpans(amount) {
	var num = parseInt(String(amount).replace(/\s/g, ''), 10);

	// Pro čísla menší než 10000 - bez mezery
	if (num < 10000) {
		return String(num);
	}

	// Pro čísla 10000+ - rozdělit po tisících
	var str = String(num);
	var parts = [];
	while (str.length > 3) {
		parts.unshift(str.slice(-3));
		str = str.slice(0, -3);
	}
	if (str.length > 0) {
		parts.unshift(str);
	}

	// Spojit s mezerou (CSS margin)
	return parts.map(function(part, index) {
		if (index < parts.length - 1) {
			return "<span class='amount-thousands'>" + part + "</span>";
		}
		return part;
	}).join('');
}

// Check for preview data in localStorage first (invoicePending from save button, invoicePreview from preview link)
var previewData = localStorage.getItem('invoicePending') || localStorage.getItem('invoicePreview');

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

// Generate filename based on format template
function generateFilename() {
	var previewData = localStorage.getItem('invoicePending') || localStorage.getItem('invoicePreview');
	var data = previewData ? JSON.parse(previewData) : {};

	var myName = $('#me .name').text().split(',')[0] || 'ales-brom';
	var invNum = String(data.invoice_number || '01').padStart(2, '0');
	var year = String(data.invoice_number_year || new Date().getFullYear()).slice(-2);
	var clientName = data.client_name || $('#client .name').text().split(',')[0] || 'klient';

	// Normalize: remove diacritics, lowercase, replace spaces with dashes
	function normalize(str) {
		return str.toLowerCase()
			.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '');
	}

	// Get format template or use default
	var format = data.filename_format || 'fa-{jmeno}-{cislo}-{rok}-{klient}';

	// Replace placeholders with actual values
	return format
		.replace('{jmeno}', normalize(myName))
		.replace('{cislo}', invNum)
		.replace('{rok}', year)
		.replace('{klient}', normalize(clientName));
}

// Template toggle - switch between templates while preserving sessionStorage
$('.toggle-btn').on('click', function() {
	var template = $(this).data('template');
	var currentPage = window.location.pathname.split('/').pop();

	if (template !== currentPage) {
		window.location.href = template;
	}
});

// Save PDF button
$('.save-btn').on('click', function() {
	var filename = generateFilename() + '.pdf';

	// Hide non-print elements during PDF generation
	$('.template-toggle, .buttons').hide();

	var element = document.getElementById('invoice-content');
	var opt = {
		margin: [10, 10, 10, 10],
		filename: filename,
		image: { type: 'jpeg', quality: 0.98 },
		html2canvas: { scale: 2, useCORS: true },
		jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
	};

	html2pdf().set(opt).from(element).save().then(function() {
		$('.template-toggle, .buttons').show();

		// Save to Firebase (with retry on failure)
		var pendingData = localStorage.getItem('invoicePending');
		if (pendingData) {
			saveInvoiceToFirebase(JSON.parse(pendingData));
		} else {
			// Preview mode - clear preview data
			localStorage.removeItem('invoicePreview');
		}
	});
});

// Save invoice to Firebase with automatic retry
function saveInvoiceToFirebase(data) {
	if (!data) return;

	firebase.database().ref('invoice').push().set({
		'amount': data.amount,
		'client_key': data.client_key,
		'client_name': data.client_name,
		'date_issued': data.date_issued,
		'date_to_send': data.date_to_send,
		'for_what': data.for_what,
		'invoice_number': data.invoice_number,
		'invoice_number_year': data.invoice_number_year,
		'thanks': data.thanks
	}).then(function() {
		// Success - clear localStorage
		localStorage.removeItem('invoicePending');
		console.log('Invoice saved to Firebase');
	}).catch(function(error) {
		// Failed - retry in 5 seconds
		console.log('Save failed, retrying in 5s...', error);
		setTimeout(function() {
			saveInvoiceToFirebase(data);
		}, 5000);
	});
}

// Auto-save PDF if ?save=true parameter is present
if (window.location.search.indexOf('save=true') !== -1) {
	// Trigger immediately - data is in localStorage
	$('.save-btn').trigger('click');
}
