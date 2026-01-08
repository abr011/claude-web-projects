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
