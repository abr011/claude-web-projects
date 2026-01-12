// Check authentication before loading page
checkAuth();

var list_of_form_fields = {

	"invoice_number": {
		"status": "",
		"message": "",
		"cleared_input_value": "",
		"to_clear": "yes",
		"input_key": "#new_invoice_number",
		"validation": /^[A-z0-9]{2}$/,
		"validate_with": "",
		"step": "5"
	},

	"invoice_number_year": {
		"status": "",
		"message": "",
		"cleared_input_value": "",
		"to_clear": "no",
		"input_key": "#new_invoice_number_year",
		"validation": /^[A-z0-9]{4}$/,
		"validate_with": "",
		"step": "5"
	},

	"date_issued": {
		"status": "",
		"message": "Prosím upravte tak, aby název měl alespoň jedno písmeno.",
		"cleared_input_value": "",
		"to_clear": "no",
		"input_key": "#new_date_issued",
		"validation": "",
		"validate_with": "",
		"step": "5"
	},

	"date_to_send": {
		"status": "",
		"message": "Prosím upravte tak, aby adresa měla alespoň jedno písmeno.",
		"cleared_input_value": "",
		"to_clear": "no",
		"input_key": "#new_date_to_send",
		"validation": "",
		"validate_with": "",
		"step": "5"
	},

	"client_key": {
		"status": "",
		"message": "", // NEPOVINNY
		"cleared_input_value": "",
		"to_clear": "no",
		"input_key": "",
		"validation": "",
		"validate_with": "",
		"step": "5"
	},

	"client_name": {
		"status": "",
		"message": "", // NEPOVINNY
		"cleared_input_value": "",
		"to_clear": "no",
		"input_key": "",
		"validation": "",
		"validate_with": "",
		"step": "5"
	},

	"me": {
		"status": "",
		"message": "", // NEPOVINNY
		"cleared_input_value": "",
		"to_clear": "no",
		"input_key": "",
		"validation": "",
		"validate_with": "",
		"step": "5"
	},

	"amount": {
		"status": "",
		"message": "", // NEPOVINNY
		"cleared_input_value": "",
		"to_clear": "no",
		"input_key": "#new_amount",
		"validation": /^[0-9]{3,9}$/,
		"validate_with": "",
		"step": "5"
	},


	"for_what": {
		"status": "",
		"message": "", // NEPOVINNY
		"cleared_input_value": "",
		"to_clear": "no",
		"input_key": "#new_for_what",
		"validation": "",
		"validate_with": "",
		"step": "5"
	},

	"thanks": {
		"status": "",
		"message": "", // NEPOVINNY
		"cleared_input_value": "",
		"to_clear": "no",
		"input_key": "#new_thanks",
		"validation": "",
		"validate_with": "",
		"step": "5"
	},
};

var ok = "&#127867;";
var nok = " ";

function date_difference() {
	// Text inputs use Czech format D. M. YYYY
	var a = moment(list_of_form_fields.date_issued.cleared_input_value, "D. M. YYYY");
	var b = moment(list_of_form_fields.date_to_send.cleared_input_value, "D. M. YYYY");

	var difference = b.diff(a, 'days');

	if (b < a) {

		$('#date_to_send .additional_info').text("Ajaj, splatnost je dřív než datum vystavení");
		$('#date_to_send .additional_info').addClass("error");


	} else {

		var text = difference + " dní po vystavení"
		$('#date_to_send .additional_info').text(text);
		$('#date_to_send .additional_info').removeClass("error");
	}
}

// plni seznam klientu
function fill_client_list() {

	var ak = firebaseDatabase.ref("about_client");
	var query = ak.orderByKey();

	query.once("value").then(function (snapshot) {

		snapshot.forEach(function (childSnapshot) {

			var key = childSnapshot.key;
			var childData = childSnapshot.val();

			// Skip archived clients
			if (childData.archived) {
				return;
			}

			$('.client_list .rows').append(
				'<div class="client_list_item" data-client_id="' + key + '">' +
				'<div class="client_row">' +
				'<div class="client_info">' + childData.client_name_id + '</div>' +
				'<button class="archive_client" data-client_id="' + key + '" title="Archivovat">×</button>' +
				'</div>' +
				'<span class="additional_info">' + childData.client_address_street + ", " +
				childData.client_address_town + ", IČ " + childData.client_legal_id + '</span>' +
				'</div>'
			);

		});

		// Add archive button click handler
		$('.archive_client').on('click', function(e) {
			e.stopPropagation();
			var clientId = $(this).data('client_id');
			firebaseDatabase.ref("about_client/" + clientId).update({
				archived: true
			}).then(function() {
				// Remove from list
				$('.client_list_item[data-client_id="' + clientId + '"]').fadeOut(300, function() {
					$(this).remove();
				});
			});
		});

	});
}

function get_proper_value(key) {
	if (list_of_form_fields[key].to_clear == "yes") {
		var cleared_value_to_pass = $(list_of_form_fields[key].input_key).val().replace(/[\s\v]+/g, "");

	} else {
		var cleared_value_to_pass = $(list_of_form_fields[key].input_key).val();
	}

	list_of_form_fields[key].cleared_input_value = cleared_value_to_pass; //takze ukladam spravnou hosnotu z input dfieldu
}


// TODO dopsat


function readLastInvoiceFromFirebase(connection) {
    var invoiceRef = connection.ref("invoice");
    var faktura = {
        'key': '',
        'client': '',
        'me': '',
        'number': 0,
        'year': 0,
        'date_issued': '',
        'date_to_send': '',
        'amount': 0,
        'for_what': '',
        'thanks': '',
        }

    invoiceRef.limitToLast(1).on('child_added', function (snapshot) {
        faktura.key = snapshot.key; //
        faktura.client = snapshot.child("client_key").val(); //
        faktura.me = snapshot.child("my_key").val(); //
        faktura.number = snapshot.child("invoice_number").val()
        faktura.year = snapshot.child("invoice_number_year").val();
        faktura.date_issued = snapshot.child("date_issued").val(); //
        faktura.date_to_send = snapshot.child("date_to_send").val(); //
        faktura.amount = snapshot.child("amount").val();
        faktura.for_what = snapshot.child("for_what").val();
        faktura.thanks = snapshot.child("thanks").val();

    });

    return faktura; 
}


// TODO dopsat

function renderLastInvoiceToForm(invoice) {
  
    var number = invoice.number;
    if (number < 10) {
        number = "0" + number;
    }
  
    $('#new_invoice_number').val(number);
    $('#new_invoice_number_year').val(invoice.year);
    $('#new_amount').val(invoice.amount);
    $('#new_for_what').val(invoice.for_what);
    $('#new_thanks').val(invoice.thanks);
}


// Firebase database is now initialized in firebase-config.js
var firebaseDatabase = database;

// pak nahradit ten spodek co je nize za
/*
var lastInvoice = readLastInvoiceFromFirebase(firebaseDatabase);
renderLastInvoiceToForm(lastInvoice);
*/

// tohle plni data z posledni faktury

var invoiceRef = firebaseDatabase.ref("invoice");
invoiceRef.limitToLast(1).on('child_added', function (snapshot) {
    var key = snapshot.key;
    var client = snapshot.child("client_key").val();
    var me = snapshot.child("my_key").val();
    var inv_number_last = snapshot.child("invoice_number").val();
    var inv_year_last = snapshot.child("invoice_number_year").val();
    var current_year = moment().format('YYYY');

    // Reset invoice number to 01 if year changed
    var inv_number;
    var inv_year;
    if (inv_year_last != current_year) {
        inv_number = 1;
        inv_year = current_year;
    } else {
        inv_number = (1 * inv_number_last) + 1;
        inv_year = inv_year_last;
    }

    // Parse as integer first to avoid "007" when db already has "07"
    var inv_number_last_int = parseInt(inv_number_last, 10);
    if (inv_number_last_int < 10) {
        inv_number_last = "0" + inv_number_last_int;
    }

    if (inv_number < 10) {
        inv_number = "0" + inv_number;
    }

    list_of_form_fields.invoice_number.cleared_input_value = parseInt(inv_number);
    list_of_form_fields.invoice_number_year.cleared_input_value = inv_year;
    list_of_form_fields.client_key.cleared_input_value = client;
    list_of_form_fields.client_name.cleared_input_value = snapshot.child("client_name").val();
    list_of_form_fields.me.cleared_input_value = me;
    // No space - CSS letter-spacing will provide visual separation
    var amountVal = snapshot.child("amount").val();
    list_of_form_fields.amount.cleared_input_value = amountVal ? amountVal.toString().replace(/\s/g, '') : '';
    list_of_form_fields.for_what.cleared_input_value = snapshot.child("for_what").val();
    list_of_form_fields.thanks.cleared_input_value = snapshot.child("thanks").val();

    var last_invoice_number = inv_number_last + " " + snapshot.child("invoice_number_year").val() + " je číslo poslední faktury"


    $('#new_invoice_number').val(inv_number);
    $('#new_invoice_number_year').val(list_of_form_fields.invoice_number_year.cleared_input_value);
    $('#invoice_number .additional_info').text(last_invoice_number);
    $('#new_amount').val(list_of_form_fields.amount.cleared_input_value);
    $('#new_for_what').val(list_of_form_fields.for_what.cleared_input_value);
    $('#new_thanks').val(list_of_form_fields.thanks.cleared_input_value);


    var last_invoice_client = firebaseDatabase.ref("about_client");
    last_invoice_client.orderByKey().equalTo(client).on("child_added", function (snapshot) {

        var client_last = snapshot.child("client_name_id").val();
        var rest_of_client = snapshot.child("client_address_street").val() + ", " + snapshot.child("client_address_town").val() + ", IČ " + snapshot.child("client_legal_id").val();

        //    $('.client_info_a').text(client_last);
        //    $('.client span.additional_info_a').text(rest_of_client);

        $('.client_info_selected').text(client_last);
        $('.client .additional_info').text(rest_of_client);
        $('#new_client_key').val(key);
    });

    var last_invoice_me = firebaseDatabase.ref("about_me");

    last_invoice_me.limitToLast(1).on("child_added", function (snapshot) {
        // Store my info for PDF generation
        window.myInfo = {
            name: snapshot.child("my_name").val(),
            address_street: snapshot.child("my_address_street").val(),
            address_town: snapshot.child("my_address_town").val(),
            address_zip: snapshot.child("my_address_zip").val(),
            legal_id: snapshot.child("my_legal_id").val(),
            account_prefix: snapshot.child("my_account_number_prefix").val(),
            account_number: snapshot.child("my_account_number").val(),
            bank_code: snapshot.child("my_bank_code").val()
        };

        $('#about_me').html(
            '<div data-about_me_id="' + key + '">' +
            '<p>' + snapshot.child("my_name").val() + ", " +
            snapshot.child("my_address_street").val() + ", " +
            snapshot.child("my_address_town").val() + ", " + snapshot.child("my_address_zip").val() + '</p>' +
            '<p class="break">' + "IČ " + snapshot.child("my_legal_id").val() + '</p>' +
            '<p>' + "č.ú. " + snapshot.child("my_account_number_prefix").val() + " " + snapshot.child("my_account_number").val() +
            " / " + snapshot.child("my_bank_code").val() + '</p>' +

            '</div>'
        );

    });
});


// Date handling with flatpickr
moment.locale('cs');

// Initialize flatpickr on date inputs
var dateIssuedPicker = flatpickr("#new_date_issued", {
	locale: "cs",
	dateFormat: "j. n. Y",
	defaultDate: new Date(),
	onChange: function(selectedDates, dateStr) {
		list_of_form_fields.date_issued.cleared_input_value = dateStr;
		$('#date_issued_today').prop('checked', false);
		$('#date_issued_last_month').prop('checked', false);
		date_difference();
	}
});

var dateToSendPicker = flatpickr("#new_date_to_send", {
	locale: "cs",
	dateFormat: "j. n. Y",
	defaultDate: moment().add(14, 'days').toDate(),
	onChange: function(selectedDates, dateStr) {
		list_of_form_fields.date_to_send.cleared_input_value = dateStr;
		date_difference();
	}
});

// Update form field values AFTER setting the inputs
list_of_form_fields.date_issued.cleared_input_value = $('#new_date_issued').val();
list_of_form_fields.date_to_send.cleared_input_value = $('#new_date_to_send').val();

$('#date_issued_today').prop('checked', true);
$('#date_issued_last_month').prop('checked', false);

date_difference();
fill_client_list();

// Native date input change handler
$("#new_date_issued").on("change", function () {
    list_of_form_fields.date_issued.cleared_input_value = $('#new_date_issued').val();
    $('#date_issued_today').prop('checked', false);
    $('#date_issued_last_month').prop('checked', false);
    date_difference();
});




$('#date_issued_today').on("click", function () {
	if (document.getElementById('date_issued_today').checked) {
		$('#date_issued_last_month').prop('checked', false);

		dateIssuedPicker.setDate(new Date(), true);
		dateToSendPicker.setDate(moment().add(14, 'days').toDate(), true);

		list_of_form_fields.date_issued.cleared_input_value = $('#new_date_issued').val();
		list_of_form_fields.date_to_send.cleared_input_value = $('#new_date_to_send').val();

	} else {
		$('#date_issued_today').prop('checked', true);
	}
	date_difference();
});

$('#date_issued_last_month').on("click", function () {

	if (document.getElementById('date_issued_last_month').checked) {
		$('#date_issued_today').prop('checked', false);

		var date_issued = moment().subtract(1, 'months').endOf('month').toDate();
		dateIssuedPicker.setDate(date_issued, true);
		list_of_form_fields.date_issued.cleared_input_value = $('#new_date_issued').val();

		var date_to_send = moment().subtract(1, 'months').endOf('month').add(14, 'days').toDate();
		dateToSendPicker.setDate(date_to_send, true);
		list_of_form_fields.date_to_send.cleared_input_value = $('#new_date_to_send').val();

	} else {
		$('#date_issued_last_month').prop('checked', true);
	}

	date_difference();
});

// Native date input change handler for date_to_send
$("#new_date_to_send").on("change", function () {
	list_of_form_fields.date_to_send.cleared_input_value = $('#new_date_to_send').val();
	date_difference();
});

$('.client_info_selected').on("click", function (e) {
	e.stopPropagation();
	$('.client_list').removeClass("hidden");
	$('.client_info_selected').addClass("focus");
});

// Close client list on close button click
$('.close_client_list').on("click", function (e) {
	e.stopPropagation();
	$('.client_list').addClass("hidden");
	$('.client_info_selected').removeClass("focus");
});

// Close client list on click outside
$(document).on("mousedown", function (e) {
	if ($('.client_list').hasClass('hidden')) return;
	if (!$(e.target).closest('.client_list').length && !$(e.target).closest('.client_info_selected').length) {
		$('.client_list').addClass("hidden");
		$('.client_info_selected').removeClass("focus");
	}
});

// Client list item click handler (use event delegation for dynamically added items)
$(document).on("click", ".client_list_item", function () {

		var key = ($(this).data("client_id"));

		var ref = firebaseDatabase.ref("about_client").child(key);


		ref.once("value")
			.then(function (snapshot) {
				var key = snapshot.key;
				var client = snapshot.child("client_name_id").val();
				var rest_of_client = snapshot.child("client_address_street").val() + ", " +
					snapshot.child("client_address_town").val() + ", IČ " + snapshot.child("client_legal_id").val();


				$('.client_info_selected').text(client);
				$('.client .additional_info').text(rest_of_client);
				$('#new_client_key').val(key);

				list_of_form_fields.client_key.cleared_input_value = key;
				list_of_form_fields.client_name.cleared_input_value = client;

				$('.client_list').addClass('hidden');
				$('.client_info_selected').removeClass("focus");
			});
});

$('input').focusin(function () {

	$('.client_info_selected').removeClass("focus");

});

$('input').keyup(function () {
	var key = this.id.replace("new_", "");
	var key_to_pass = list_of_form_fields[key];
	$('.client_info_a').removeClass("focus");
	get_proper_value(key);
});

// Format amount with spans for thousands (10000+)
function formatAmountWithSpans(amount) {
	var num = parseInt(String(amount).replace(/\s/g, ''), 10);
	if (num < 10000) return String(num);
	var str = String(num);
	var parts = [];
	while (str.length > 3) {
		parts.unshift(str.slice(-3));
		str = str.slice(0, -3);
	}
	if (str.length > 0) parts.unshift(str);
	return parts.map(function(part, index) {
		if (index < parts.length - 1) {
			return "<span class='amount-thousands'>" + part + "</span>";
		}
		return part;
	}).join('');
}

// Generate filename based on format template
function generatePdfFilename(data) {
	var myInfo = window.myInfo || {};
	var myName = myInfo.name || 'ales-brom';
	var invNum = String(data.invoice_number).padStart(2, '0');
	var year = String(data.invoice_number_year).slice(-2);
	var clientName = data.client_name || 'klient';

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
		localStorage.removeItem('invoicePending');
		console.log('Invoice saved to Firebase');
	}).catch(function(error) {
		console.log('Save failed, retrying in 5s...', error);
		setTimeout(function() {
			saveInvoiceToFirebase(data);
		}, 5000);
	});
}

$('#confirm_invoice .button').on("click", function () {
	if ($(this).hasClass("disabled")) {
		return;
	}

	$('#confirm_invoice .button').addClass("disabled");

	// Get current form values
	get_proper_value('invoice_number');
	get_proper_value('invoice_number_year');
	get_proper_value('amount');
	get_proper_value('for_what');
	get_proper_value('thanks');

	var invoiceData = {
		invoice_number: list_of_form_fields.invoice_number.cleared_input_value,
		invoice_number_year: list_of_form_fields.invoice_number_year.cleared_input_value,
		amount: list_of_form_fields.amount.cleared_input_value,
		date_issued: list_of_form_fields.date_issued.cleared_input_value,
		date_to_send: list_of_form_fields.date_to_send.cleared_input_value,
		for_what: list_of_form_fields.for_what.cleared_input_value,
		thanks: list_of_form_fields.thanks.cleared_input_value,
		client_key: list_of_form_fields.client_key.cleared_input_value,
		client_name: $('.client_info_selected').text(),
		filename_format: $('#filename-format-display').text() || 'fa-{jmeno}-{cislo}-{rok}-{klient}'
	};

	// Store for retry if needed
	localStorage.setItem('invoicePending', JSON.stringify(invoiceData));

	// Populate hidden print template
	var $tpl = $('#print-template');
	var invNum = String(invoiceData.invoice_number).padStart(2, '0');
	var myInfo = window.myInfo || {};

	// My info
	var myFullName = myInfo.name + ', ' + myInfo.address_street + ', ' + myInfo.address_town + ', ' + myInfo.address_zip;
	var myAccount = (myInfo.account_prefix ? myInfo.account_prefix + ' – ' : '') + myInfo.account_number + ' / ' + myInfo.bank_code;

	$tpl.find('#print_invoice_number').html("Faktura č. <span class='inv-nn'>" + invNum + "</span><span class='inv-yyyy'>" + invoiceData.invoice_number_year + "</span>");
	$tpl.find('#me .name').html(myFullName);
	$tpl.find('#me .legal_id').html('IČ ' + myInfo.legal_id);
	$tpl.find('#account_number .my_account_number').html(myAccount);

	// Invoice data
	$tpl.find('#print_for_what .for_what').html(invoiceData.for_what);
	$tpl.find('#date .date_to_send').html(invoiceData.date_to_send);
	$tpl.find('#date .date_issued').html(invoiceData.date_issued);
	$tpl.find('#print_amount .total_amount').html(formatAmountWithSpans(invoiceData.amount) + ' Kč');

	// Client info
	var clientInfo = $('.client .additional_info').text();
	var clientAddress = clientInfo.split(', IČ')[0] || '';
	var clientLegalId = clientInfo.split('IČ ')[1] || '';
	$tpl.find('#client .name').html(invoiceData.client_name + ', ' + clientAddress);
	$tpl.find('#client .legal_id').html('IČ ' + clientLegalId);

	// Thanks
	$tpl.find('#print_thanks .thanks').html(invoiceData.thanks);

	// Generate QR code URL
	var pureAmount = String(invoiceData.amount).replace(/\s/g, '');
	var vs = invNum + invoiceData.invoice_number_year;
	if (myInfo.account_number && myInfo.bank_code) {
		var qrUrl = '<img src="https://api.paylibo.com/paylibo/generator/czech/image?accountNumber=' + myInfo.account_number + '&bankCode=' + myInfo.bank_code + '&amount=' + pureAmount + '&currency=CZK&vs=' + vs + '">';
		$tpl.find('.qr').html(qrUrl);
	}

	// Generate PDF
	var filename = generatePdfFilename(invoiceData) + '.pdf';
	var element = document.getElementById('invoice-content');

	// Temporarily show the template for rendering
	$tpl.css('left', '0');

	var opt = {
		margin: [10, 10, 10, 10],
		filename: filename,
		image: { type: 'jpeg', quality: 0.98 },
		html2canvas: { scale: 2, useCORS: true },
		jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
	};

	html2pdf().set(opt).from(element).save().then(function() {
		// Hide template again
		$tpl.css('left', '-9999px');

		// Save to Firebase
		saveInvoiceToFirebase(invoiceData);

		// Reset form for next invoice
		var nextInvoiceNum = parseInt(invoiceData.invoice_number) + 1;
		$('#new_invoice_number').val(String(nextInvoiceNum).padStart(2, '0'));

		// Reset dates to today + 14 days
		dateIssuedPicker.setDate(new Date(), true);
		dateToSendPicker.setDate(moment().add(14, 'days').toDate(), true);

		// Update last invoice number hint
		$('#invoice_number .additional_info').text(invNum + ' ' + invoiceData.invoice_number_year + ' je číslo poslední faktury');

		// Re-enable button
		$('#confirm_invoice .button').removeClass("disabled");
	});
});

// Preview links - save form data to localStorage before opening
$('.link[href*="invoice_to_print"]').on("click", function (e) {
	e.preventDefault();
	var targetUrl = $(this).attr('href');

	// Get current form values
	get_proper_value('invoice_number');
	get_proper_value('invoice_number_year');
	get_proper_value('amount');
	get_proper_value('for_what');
	get_proper_value('thanks');

	// Dates are already in Czech format D. M. YYYY
	var dateIssued = list_of_form_fields.date_issued.cleared_input_value;
	var dateToSend = list_of_form_fields.date_to_send.cleared_input_value;

	var previewData = {
		invoice_number: list_of_form_fields.invoice_number.cleared_input_value,
		invoice_number_year: list_of_form_fields.invoice_number_year.cleared_input_value,
		date_issued: dateIssued,
		date_to_send: dateToSend,
		amount: list_of_form_fields.amount.cleared_input_value,
		for_what: list_of_form_fields.for_what.cleared_input_value,
		thanks: list_of_form_fields.thanks.cleared_input_value,
		client_key: list_of_form_fields.client_key.cleared_input_value,
		client_name: $('.client_info_selected').text(),
		client_address: $('.client .additional_info').text(),
		filename_format: $('#filename-format-display').text() || 'fa-{jmeno}-{cislo}-{rok}-{klient}'
	};

	localStorage.setItem('invoicePreview', JSON.stringify(previewData));
	window.location.href = targetUrl;
});

// Filename format handling
var DEFAULT_FILENAME_FORMAT = 'fa-{jmeno}-{cislo}-{rok}-{klient}';

// Load filename format from Firebase
var settingsRef = firebase.database().ref('settings/filename_format');
settingsRef.once('value').then(function(snapshot) {
	var format = snapshot.val();
	if (format) {
		$('#filename-format-display').text(format);
	}
});

// Change filename format via prompt
$('.change-format').on('click', function(e) {
	e.preventDefault();
	var currentFormat = $('#filename-format-display').text();
	var newFormat = prompt('Formát názvu PDF\n\nProměnné: {jmeno}, {cislo}, {rok}, {klient}', currentFormat);
	if (newFormat && newFormat !== currentFormat) {
		$('#filename-format-display').text(newFormat);
		firebase.database().ref('settings').update({
			filename_format: newFormat
		});
	}
});
