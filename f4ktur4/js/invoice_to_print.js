// Format amount - space only for 10000+
function formatAmountWithSpans(amount) {
	var num = parseInt(String(amount).replace(/\s/g, ''), 10);

	if (num < 10000) {
		return String(num);
	}

	var str = String(num);
	var parts = [];
	while (str.length > 3) {
		parts.unshift(str.slice(-3));
		str = str.slice(0, -3);
	}
	if (str.length > 0) {
		parts.unshift(str);
	}

	return parts.map(function(part, index) {
		if (index < parts.length - 1) {
			return "<span class='amount-thousands'>" + part + "</span>";
		}
		return part;
	}).join('');
}

// Track when all data is loaded
var dataReadyPromise;

// Check for preview data in localStorage first (invoicePending from save button, invoicePreview from preview link)
var previewData = localStorage.getItem('invoicePending') || localStorage.getItem('invoicePreview');

if (previewData) {
	var data = JSON.parse(previewData);

	var inv_number = String(data.invoice_number).padStart(2, '0');
	var pure_invoice_number = inv_number + data.invoice_number_year;

	$('#invoice_number').html("Faktura č. <span class='inv-nn'>" + inv_number + "</span><span class='inv-yyyy'>" + data.invoice_number_year + "</span>");

	$('#date .date_to_send').html(data.date_to_send);
	$('.date_issued').html(data.date_issued);

	var amountClean = String(data.amount).replace(/\s/g, '');
	var amountFormatted = formatAmountWithSpans(amountClean);
	$('#amount .total_amount').html(amountFormatted + " Kč");

	$('#for_what .for_what').html(data.for_what);
	$('#thanks .thanks').html(data.thanks);

	// Load client and my info from Firebase, track with promises
	var clientPromise = Promise.resolve();
	if (data.client_key) {
		clientPromise = database.ref("about_client").child(data.client_key).once('value').then(function (snapshot) {
			var val = snapshot.val();
			if (!val) return;
			var client_tax_id = val.client_tax_id;
			if (client_tax_id && client_tax_id !== "") {
				client_tax_id = ", DIČ CZ" + client_tax_id;
			} else {
				client_tax_id = "";
			}

			var client = val.client_name_id + ", " + val.client_address_street + ", " +
				val.client_address_town + ", " + val.client_address_zip;
			var client_legal_id = "IČ " + val.client_legal_id + client_tax_id;

			$('#client .name').html(client);
			$('#client .legal_id').html(client_legal_id);
		});
	}

	var myInfoPromise = database.ref("about_me").limitToLast(1).once("value").then(function (snapshot) {
		snapshot.forEach(function(child) {
			var val = child.val();
			var prefix = val.my_account_number_prefix;
			if (prefix && prefix !== "") {
				prefix = prefix + " – ";
			} else {
				prefix = "";
			}

			var my_account = prefix + val.my_account_number + " / " + val.my_bank_code;
			var me = val.my_name + ", " + val.my_address_street + ", " +
				val.my_address_town + ", " + val.my_address_zip;
			var my_legal_id = "IČ " + val.my_legal_id;

			$('#me .name').html(me);
			$('#me .legal_id').html(my_legal_id);
			$('#account_number .my_account_number').html(my_account);

			// QR code
			var pure_amount = data.amount.replace(/\s/g, '');
			var url = '<img src="https://api.paylibo.com/paylibo/generator/czech/image?accountNumber=' +
				val.my_account_number + '&bankCode=' + val.my_bank_code +
				'&amount=' + pure_amount + '&currency=CZK&vs=' + pure_invoice_number + '">';
			$('.qr').html(url);
		});
	});

	dataReadyPromise = Promise.all([clientPromise, myInfoPromise]);

} else {
	// Fallback: load from Firebase (viewing saved invoice)
	dataReadyPromise = new Promise(function(resolve) {
		database.ref("invoice").limitToLast(1).once("value").then(function(invoiceSnapshot) {
			var lastInvoice = null;
			invoiceSnapshot.forEach(function(child) {
				lastInvoice = child.val();
			});
			if (!lastInvoice) { resolve(); return; }

			var inv_number = String(lastInvoice.invoice_number).padStart(2, '0');
			var invoice_number_year = lastInvoice.invoice_number_year;
			var pure_invoice_number = inv_number + invoice_number_year;
			var for_what = lastInvoice.for_what;
			var pure_amount = lastInvoice.amount;
			var amount = formatAmountWithSpans(pure_amount) + " Kč";
			var date_to_send = lastInvoice.date_to_send;
			var date_issued = lastInvoice.date_issued;
			var thanks = lastInvoice.thanks;

			database.ref("about_client").child(lastInvoice.client_key).once('value').then(function (clientSnapshot) {
				var cval = clientSnapshot.val();
				var client_tax_id = cval.client_tax_id;
				if (client_tax_id && client_tax_id !== "") {
					client_tax_id = ", DIČ CZ" + client_tax_id;
				} else {
					client_tax_id = "";
				}

				var client = cval.client_name_id + ", " + cval.client_address_street + ", " +
					cval.client_address_town + ", " + cval.client_address_zip;
				var client_legal_id = "IČ " + cval.client_legal_id + client_tax_id;

				database.ref("about_me").limitToLast(1).once("value").then(function (meSnapshot) {
					meSnapshot.forEach(function(child) {
						var mval = child.val();
						var prefix = mval.my_account_number_prefix;
						if (prefix && prefix !== "") {
							prefix = prefix + " – ";
						} else {
							prefix = "";
						}

						var my_account = prefix + mval.my_account_number + " / " + mval.my_bank_code;
						var me = mval.my_name + ", " + mval.my_address_street + ", " +
							mval.my_address_town + ", " + mval.my_address_zip;
						var my_legal_id = "IČ " + mval.my_legal_id;

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

						var url = '<img src="https://api.paylibo.com/paylibo/generator/czech/image?accountNumber=' +
							mval.my_account_number + '&bankCode=' + mval.my_bank_code +
							'&amount=' + pure_amount + '&currency=CZK&vs=' + pure_invoice_number + '">';
						$('.qr').html(url);
					});
					resolve();
				});
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

	function normalize(str) {
		return str.toLowerCase()
			.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '');
	}

	var format = data.filename_format || 'fa-{jmeno}-{cislo}-{rok}-{klient}';

	return format
		.replace('{jmeno}', normalize(myName))
		.replace('{cislo}', invNum)
		.replace('{rok}', year)
		.replace('{klient}', normalize(clientName));
}

// Template toggle
$('.toggle-btn').on('click', function() {
	var template = $(this).data('template');
	var currentPage = window.location.pathname.split('/').pop();

	if (template !== currentPage) {
		window.location.href = template;
	}
});

// Save PDF function
function savePdf() {
	var filename = generateFilename() + '.pdf';

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

		var pendingData = localStorage.getItem('invoicePending');
		if (pendingData) {
			saveInvoiceToFirebase(JSON.parse(pendingData));
		} else {
			localStorage.removeItem('invoicePreview');
		}
	});
}

// Save PDF button
$('.save-btn').on('click', function() {
	savePdf();
});

// Save invoice to Firebase with automatic retry
function saveInvoiceToFirebase(data) {
	if (!data) return;

	database.ref('invoice').push({
		amount: data.amount,
		client_key: data.client_key,
		client_name: data.client_name,
		date_issued: data.date_issued,
		date_to_send: data.date_to_send,
		for_what: data.for_what,
		invoice_number: data.invoice_number,
		invoice_number_year: data.invoice_number_year,
		thanks: data.thanks
	}).then(function() {
		localStorage.removeItem('invoicePending');
		console.log('Invoice saved to Firebase');
	}).catch(function(error) {
		console.log('Save failed, retrying in 5s...', error);
		setTimeout(function() {
			saveInvoiceToFirebase(data);
		}, 5000);
	});
}

// Auto-save PDF if ?save=true — wait for all data to load first
if (window.location.search.indexOf('save=true') !== -1) {
	dataReadyPromise.then(function() {
		savePdf();
	});
}
