// Check if in edit mode
var urlParams = new URLSearchParams(window.location.search);
var isEditMode = urlParams.get('edit') === 'true';

// Show edit mode elements if in edit mode
if (isEditMode) {
	$(document).ready(function() {
		$('.edit-mode').removeClass('hidden');
		$('.new-mode-text').addClass('hidden');

		// Load existing data from Firebase
		var aboutMeRef = firebase.database().ref('about_me');
		aboutMeRef.limitToLast(1).once('child_added', function(snapshot) {
			$('#new_my_legal_id').val(snapshot.child('my_legal_id').val());
			$('#new_my_account_number_prefix').val(snapshot.child('my_account_number_prefix').val());
			$('#new_my_account_number').val(snapshot.child('my_account_number').val());
			$('#new_my_bank_code').val(snapshot.child('my_bank_code').val());
			$('#new_my_name').val(snapshot.child('my_name').val());
			$('#new_my_address_street').val(snapshot.child('my_address_street').val());
			$('#new_my_address_town').val(snapshot.child('my_address_town').val());
			$('#new_my_address_zip').val(snapshot.child('my_address_zip').val());

			// Trigger validation for all fields
			$('input').each(function() {
				var key = this.id.replace("new_", "");
				if (list_of_form_fields[key]) {
					get_proper_value(key);
					input_status(list_of_form_fields[key], list_of_form_fields[key].cleared_input_value);
				}
			});
		});
	});
}

var list_of_form_fields = {

	"my_legal_id": {
		"status": "",
		"message": "Prosím upravte tak, aby IČ mělo 8 číslic.",
		"cleared_input_value": "",
		"to_clear": "yes",
		"input_key": "#new_my_legal_id",
		"validation": /^[0-9]{8}$/,
		"validate_with": "",
		"step": "1"
	},

	"my_account_number_prefix": {
		"status": "",
		"message": "",
		"cleared_input_value": "",
		"to_clear": "yes",
		"input_key": "#new_my_account_number_prefix",
		"validation": /^[0-9]{0,6}$/,
		"validate_with": "",
		"step": "1"
	},

	"my_account_number": {
		"status": "",
		"message": "Prosím upravte tak, aby č. ú. mělo alespoň 2 a max 10 číslic.",
		"cleared_input_value": "",
		"to_clear": "yes",
		"input_key": "#new_my_account_number",
		"validation": /^[0-9]{2,10}$/,
		"validate_with": "my_bank_code",
		"step": "1"
	},

	"my_bank_code": {
		"status": "",
		"message": "Prosím upravte tak, aby kód banky měl 4 číslice.",
		"cleared_input_value": "",
		"to_clear": "yes",
		"input_key": "#new_my_bank_code",
		"validation": /^[0-9]{4}$/,
		"validate_with": "my_account_number",
		"step": "1"
	},

	"my_name": {
		"status": "",
		"message": "Prosím upravte tak, aby název měl alespoň jedno písmeno.",
		"cleared_input_value": "",
		"to_clear": "no",
		"input_key": "#new_my_name",
		"validation": /[A-Za-z0-9]+/,
		"validate_with": "",
		"step": "2"
	},

	"my_address_street": {
		"status": "",
		"message": "Prosím upravte tak, aby adresa měla alespoň jedno písmeno.",
		"cleared_input_value": "",
		"to_clear": "no",
		"input_key": "#new_my_address_street",
		"validation": /[A-Za-z0-9]+/,
		"validate_with": "",
		"step": "2"
	},

	"my_address_town": {
		"status": "",
		"message": "Prosím upravte tak, aby obec měla alespoň jedno písmeno.", // neni to nepovinny?
		"cleared_input_value": "",
		"to_clear": "no",
		"input_key": "#new_my_address_town",
		"validation": /[A-Za-z0-9]+/,
		"validate_with": "",
		"step": "2"
	},

	"my_address_zip": {
		"status": "",
		"message": "Prosím upravte tak, aby PSČ mělo 5 číslic.",
		"cleared_input_value": "",
		"to_clear": "yes",
		"input_key": "#new_my_address_zip",
		"validation": /^[0-9]{5}$/,
		"validate_with": "",
		"step": "2"
	},
}


// ok, nok defined in firebase-config.js

var bank_message_both_nok = "Upravte tak, aby č. ú. mělo 2 - 10 číslic. Kód banky tak, aby měl číslice 4.";
var bank_message_displayed = "no";


Object.keys(list_of_form_fields).forEach(function (key) { // abych pri nacteni stranky zjistil status poli

	var value_to_pass = list_of_form_fields[key];

	get_proper_value(key); // abych pri nacteni stranky zjistil spravny hodnoty (ocisteny)

	var cleared_value_to_pass = list_of_form_fields[key].cleared_input_value;

	input_status(value_to_pass, cleared_value_to_pass);

})


$('input').keyup(function () {

	var key = this.id.replace("new_", "");
	var key_to_pass = list_of_form_fields[key];

	get_proper_value(key);

	var cleared_value_to_pass = list_of_form_fields[key].cleared_input_value;

	input_status(key_to_pass, cleared_value_to_pass);

});


// step1 confirm button


$('#confirm_form .button').on("click", function () {

	if ($(this).hasClass("disabled")) {
		what_is_wrong(1);

	} else {
		$('.step1').addClass(animationOutLeft).one(animationEnd,
			function () {
				$('.step1').removeClass(animationOutLeft);
				$('.step1').addClass("hidden");
			});

		$('.step2').removeClass("hidden").one(animationEnd, function () {

			$('.step2').removeClass("initial_position");
		});

		$('.step2').addClass(animationInRight);

	}
});


// confirm button step2

$('#confirm_about_me .button').on("click", function () {
	if ($(this).hasClass("disabled")) {
		what_is_wrong(2);

	} else {
		var about_me_Ref = firebase.database().ref('about_me');
		var new_about_me_Ref = about_me_Ref.push();
		new_about_me_Ref.set({
			'my_legal_id': list_of_form_fields.my_legal_id.cleared_input_value,
			'my_account_number_prefix': list_of_form_fields.my_account_number_prefix.cleared_input_value,
			'my_account_number': list_of_form_fields.my_account_number.cleared_input_value,
			'my_bank_code': list_of_form_fields.my_bank_code.cleared_input_value,

			'my_name': list_of_form_fields.my_name.cleared_input_value,
			'my_address_street': list_of_form_fields.my_address_street.cleared_input_value,
			'my_address_town': list_of_form_fields.my_address_town.cleared_input_value,
			'my_address_zip': list_of_form_fields.my_address_zip.cleared_input_value,
		})

		// Redirect based on mode
		if (isEditMode) {
			window.location.href = "index.html";
		} else {
			window.location.href = "client_info.html";
		}

	}

});
