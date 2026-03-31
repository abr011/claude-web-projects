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
		"message": "",
		"cleared_input_value": "",
		"to_clear": "no",
		"input_key": "",
		"validation": "",
		"validate_with": "",
		"step": "5"
	},

	"client_name": {
		"status": "",
		"message": "",
		"cleared_input_value": "",
		"to_clear": "no",
		"input_key": "",
		"validation": "",
		"validate_with": "",
		"step": "5"
	},

	"me": {
		"status": "",
		"message": "",
		"cleared_input_value": "",
		"to_clear": "no",
		"input_key": "",
		"validation": "",
		"validate_with": "",
		"step": "5"
	},

	"amount": {
		"status": "",
		"message": "",
		"cleared_input_value": "",
		"to_clear": "no",
		"input_key": "#new_amount",
		"validation": /^[0-9]{3,9}$/,
		"validate_with": "",
		"step": "5"
	},


	"for_what": {
		"status": "",
		"message": "",
		"cleared_input_value": "",
		"to_clear": "no",
		"input_key": "#new_for_what",
		"validation": "",
		"validate_with": "",
		"step": "5"
	},

	"thanks": {
		"status": "",
		"message": "",
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

// Store loaded data
var clientsData = {};

function date_difference() {
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

// Fill client list from Firebase
function fill_client_list() {
	database.ref("about_client").once("value").then(function(snapshot) {
		$('.client_list .rows').empty();

		snapshot.forEach(function(child) {
			var client = { key: child.key, ...child.val() };

			// Skip archived clients
			if (client.archived) {
				return;
			}

			// Store client data for later use
			clientsData[client.key] = client;

			$('.client_list .rows').append(
				'<div class="client_list_item" data-client_id="' + client.key + '">' +
				'<div class="client_row">' +
				'<div class="client_info">' + client.client_name_id + '</div>' +
				'<button class="archive_client" data-client_id="' + client.key + '" title="Archivovat">×</button>' +
				'</div>' +
				'<span class="additional_info">' + client.client_address_street + ", " +
				client.client_address_town + ", IČ " + client.client_legal_id + '</span>' +
				'</div>'
			);
		});

		// Add archive button click handler
		$('.archive_client').off('click').on('click', function(e) {
			e.stopPropagation();
			var clientId = $(this).data('client_id');
			database.ref("about_client/" + clientId).update({archived: true}).then(function() {
				$('.client_list_item[data-client_id="' + clientId + '"]').fadeOut(300, function() {
					$(this).remove();
				});
			}).catch(function(error) {
				alert('Chyba: ' + error.message);
			});
		});

	}).catch(function(error) {
		console.error('Failed to load clients:', error);
	});
}

function get_proper_value(key) {
	if (list_of_form_fields[key].to_clear == "yes") {
		var cleared_value_to_pass = $(list_of_form_fields[key].input_key).val().replace(/[\s\v]+/g, "");
	} else {
		var cleared_value_to_pass = $(list_of_form_fields[key].input_key).val();
	}
	list_of_form_fields[key].cleared_input_value = cleared_value_to_pass;
}

// Load initial data from Firebase
function loadInitialData() {
	var lastInvoice = null;
	var myInfoData = null;

	// Load last invoice (get all, take last one)
	var invoicePromise = database.ref("invoice").once("value").then(function(snapshot) {
		var invoices = [];
		snapshot.forEach(function(child) {
			invoices.push({ key: child.key, ...child.val() });
		});
		lastInvoice = invoices.length > 0 ? invoices[invoices.length - 1] : null;
	});

	// Load my info
	var myInfoPromise = database.ref("about_me").limitToLast(1).once("value").then(function(snapshot) {
		snapshot.forEach(function(child) {
			myInfoData = child.val();
		});
	});

	// Load clients
	var clientsPromise = database.ref("about_client").once("value").then(function(snapshot) {
		snapshot.forEach(function(child) {
			clientsData[child.key] = { key: child.key, ...child.val() };
		});
	});

	Promise.all([invoicePromise, myInfoPromise, clientsPromise]).then(function() {
		// Process last invoice
		var current_year = moment().format('YYYY');
		var inv_number, inv_year;

		if (lastInvoice) {
			var inv_number_last = lastInvoice.invoice_number;
			var inv_year_last = lastInvoice.invoice_number_year;

			// Reset invoice number to 01 if year changed
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

			list_of_form_fields.client_key.cleared_input_value = lastInvoice.client_key;
			list_of_form_fields.client_name.cleared_input_value = lastInvoice.client_name;
			var amountVal = lastInvoice.amount;
			list_of_form_fields.amount.cleared_input_value = amountVal ? amountVal.toString().replace(/\s/g, '') : '';
			list_of_form_fields.for_what.cleared_input_value = lastInvoice.for_what;
			list_of_form_fields.thanks.cleared_input_value = lastInvoice.thanks;

			var last_invoice_number = inv_number_last + " " + inv_year_last + " je číslo poslední faktury";
			$('#invoice_number .additional_info').text(last_invoice_number);

			// Fill form with last invoice data
			$('#new_amount').val(list_of_form_fields.amount.cleared_input_value);
			$('#new_for_what').val(list_of_form_fields.for_what.cleared_input_value);
			$('#new_thanks').val(list_of_form_fields.thanks.cleared_input_value);

			// Load last client info
			var lastClient = clientsData[lastInvoice.client_key];
			if (lastClient) {
				var client_last = lastClient.client_name_id;
				var rest_of_client = lastClient.client_address_street + ", " +
					lastClient.client_address_town + ", IČ " + lastClient.client_legal_id;

				$('.client_info_selected').text(client_last);
				$('.client .additional_info').text(rest_of_client);
				$('#new_client_key').val(lastInvoice.client_key);
			}
		} else {
			// No invoices yet, start fresh
			inv_number = 1;
			inv_year = current_year;
		}

		if (inv_number < 10) {
			inv_number = "0" + inv_number;
		}

		list_of_form_fields.invoice_number.cleared_input_value = parseInt(inv_number);
		list_of_form_fields.invoice_number_year.cleared_input_value = inv_year;

		$('#new_invoice_number').val(inv_number);
		$('#new_invoice_number_year').val(inv_year);

		// Store my info for PDF generation
		if (myInfoData) {
			window.myInfo = {
				name: myInfoData.my_name,
				address_street: myInfoData.my_address_street,
				address_town: myInfoData.my_address_town,
				address_zip: myInfoData.my_address_zip,
				legal_id: myInfoData.my_legal_id,
				account_prefix: myInfoData.my_account_number_prefix,
				account_number: myInfoData.my_account_number,
				bank_code: myInfoData.my_bank_code
			};

			$('#about_me').html(
				'<div>' +
				'<p>' + myInfoData.my_name + ", " +
				myInfoData.my_address_street + ", " +
				myInfoData.my_address_town + ", " + myInfoData.my_address_zip + '</p>' +
				'<p class="break">' + "IČ " + myInfoData.my_legal_id + '</p>' +
				'<p>' + "č.ú. " + myInfoData.my_account_number_prefix + " " + myInfoData.my_account_number +
				" / " + myInfoData.my_bank_code + '</p>' +
				'</div>'
			);
		}

		// Load settings (filename format)
		database.ref("settings").once("value").then(function(settingsSnapshot) {
			var settings = settingsSnapshot.val() || {};
			if (settings.filename_format) {
				$('#filename-format-display').text(settings.filename_format);
			}
		});

	}).catch(function(error) {
		console.error('Failed to load initial data:', error);
	});
}

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

// Load initial data on document ready
$(document).ready(function() {
	loadInitialData();
	fill_client_list();
});

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

// Client list item click handler (use stored data)
$(document).on("click", ".client_list_item", function () {
	var key = $(this).data("client_id");
	var client = clientsData[key];

	if (client) {
		var clientName = client.client_name_id;
		var rest_of_client = client.client_address_street + ", " +
			client.client_address_town + ", IČ " + client.client_legal_id;

		$('.client_info_selected').text(clientName);
		$('.client .additional_info').text(rest_of_client);
		$('#new_client_key').val(key);

		list_of_form_fields.client_key.cleared_input_value = key;
		list_of_form_fields.client_name.cleared_input_value = clientName;

		$('.client_list').addClass('hidden');
		$('.client_info_selected').removeClass("focus");
	}
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


$('#confirm_invoice .button').on("click", function () {
	if ($(this).hasClass("disabled")) {
		return;
	}

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

	// Store as pending (will be saved to Firebase after PDF download)
	localStorage.setItem('invoicePending', JSON.stringify(invoiceData));

	// Open print page in background to generate PDF (stay on this page)
	window.open('invoice_to_print.html?save=true', '_blank');
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

// Change filename format via prompt
$('.change-format').on('click', function(e) {
	e.preventDefault();
	var currentFormat = $('#filename-format-display').text();
	var newFormat = prompt('Formát názvu PDF\n\nProměnné: {jmeno}, {cislo}, {rok}, {klient}', currentFormat);
	if (newFormat && newFormat !== currentFormat) {
		$('#filename-format-display').text(newFormat);
		database.ref("settings").update({ filename_format: newFormat }).catch(function(error) {
			console.error('Failed to save settings:', error);
		});
	}
});
