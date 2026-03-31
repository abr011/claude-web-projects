// Check if in edit mode
var urlParams = new URLSearchParams(window.location.search);
var isEditMode = urlParams.get('edit') === 'true';

// Animation classes
var animationInRight = "bounce_In_Right";
var animationOutLeft = "bounce_Out_Left";
var animationEnd = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";

// Status symbols
var ok = "&#127867;";
var nok = " ";

// Show edit mode elements if in edit mode
if (isEditMode) {
	$(document).ready(function() {
		$('.edit-mode').removeClass('hidden');
		$('.new-mode-text').addClass('hidden');

		// Load existing data from Firebase
		database.ref("about_me").limitToLast(1).once("child_added").then(function(snapshot) {
			var myInfo = snapshot.val();
			if (myInfo) {
				$('#new_my_legal_id').val(myInfo.my_legal_id || '');
				$('#new_my_account_number_prefix').val(myInfo.my_account_number_prefix || '');
				$('#new_my_account_number').val(myInfo.my_account_number || '');
				$('#new_my_bank_code').val(myInfo.my_bank_code || '');
				$('#new_my_name').val(myInfo.my_name || '');
				$('#new_my_address_street').val(myInfo.my_address_street || '');
				$('#new_my_address_town').val(myInfo.my_address_town || '');
				$('#new_my_address_zip').val(myInfo.my_address_zip || '');

				// Trigger validation for all fields
				$('input').each(function() {
					var key = this.id.replace("new_", "");
					if (list_of_form_fields[key]) {
						get_proper_value(key);
						input_status(list_of_form_fields[key], list_of_form_fields[key].cleared_input_value);
					}
				});
			}
		}).catch(function(error) {
			console.error('Failed to load my info:', error);
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
		"message": "Prosím upravte tak, aby obec měla alespoň jedno písmeno.",
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


var bank_message_both_nok = "Upravte tak, aby č. ú. mělo 2 - 10 číslic. Kód banky tak, aby měl číslice 4.";
var bank_message_displayed = "no";


Object.keys(list_of_form_fields).forEach(function (key) {
	var value_to_pass = list_of_form_fields[key];
	get_proper_value(key);
	var cleared_value_to_pass = list_of_form_fields[key].cleared_input_value;
	input_status(value_to_pass, cleared_value_to_pass);
})

function get_proper_value(key) {
	if (list_of_form_fields[key].to_clear == "yes") {
		var cleared_value_to_pass = $(list_of_form_fields[key].input_key).val().replace(/[\s\v]+/g, "");
	} else {
		var cleared_value_to_pass = $(list_of_form_fields[key].input_key).val();
	}
	list_of_form_fields[key].cleared_input_value = cleared_value_to_pass;
}

function input_status(input_name, cleared_input) {
	if ((input_name.validation.test(cleared_input))) {
		input_name.status = ok;
		$(input_name.input_key).siblings("span").addClass("hidden");
		$(input_name.input_key).removeClass("field_is_wrong");

		if (bank_message_displayed == "yes") {
			bank_message_displayed == "";
			what_is_wrong(1);
		}
	} else {
		input_name.status = nok;
	}

	if (input_name.validate_with == "") {
		$(input_name.input_key).parent().siblings(".status").html(input_name.status);
	} else {
		var status_compared = list_of_form_fields[input_name.validate_with].status;
		if ((input_name.status == ok) && (status_compared == ok)) {
			var combined_status = ok;
		} else {
			var combined_status = nok;
		}
		$(input_name.input_key).parent().siblings(".status").html(combined_status);
	}
	to_enable_button();
}

function to_enable_button() {
	if ((list_of_form_fields.my_account_number_prefix.cleared_input_value == "")) {
		var status_prefix = ok;
	} else {
		var status_prefix = list_of_form_fields.my_account_number_prefix.status;
	}

	if ((list_of_form_fields.my_legal_id.status == ok) &&
		(list_of_form_fields.my_account_number.status == ok) &&
		(list_of_form_fields.my_bank_code.status == ok) &&
		(status_prefix == ok)) {
		$("#confirm_form .button").removeClass("disabled");
	} else {
		$("#confirm_form .button").addClass("disabled");
	}

	if ((list_of_form_fields.my_name.status == ok) &&
		(list_of_form_fields.my_address_town.status == ok) &&
		(list_of_form_fields.my_address_zip.status == ok)) {
		$("#confirm_about_me .button").removeClass("disabled");
	} else {
		$("#confirm_about_me .button").addClass("disabled");
	}
}

function what_is_wrong(step_number) {
	Object.keys(list_of_form_fields).forEach(function (key) {
		if ((list_of_form_fields[key].status == nok)) {
			if (list_of_form_fields[key].validate_with == "") {
				var message = list_of_form_fields[key].message;
			} else {
				var other_one = list_of_form_fields[key].validate_with;
				var status_other_one = list_of_form_fields[other_one].status;

				if ((list_of_form_fields[key].status == nok) && (status_other_one == nok)) {
					var message = bank_message_both_nok;
					bank_message_displayed = "yes";
				}
				if ((list_of_form_fields[key].status == nok) && (status_other_one == ok)) {
					var message = list_of_form_fields[key].message;
				}
				if ((list_of_form_fields[key].status == ok) && (status_other_one == nok)) {
					var message = other_one.message;
				}
			}

			if (list_of_form_fields[key].step == step_number) {
				$(list_of_form_fields[key].input_key).siblings("span").removeClass("hidden");
				$(list_of_form_fields[key].input_key).siblings("span").text(message);
				$(list_of_form_fields[key].input_key).addClass("field_is_wrong");
			}
		}
	});
}

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
		var data = {
			my_legal_id: list_of_form_fields.my_legal_id.cleared_input_value,
			my_account_number_prefix: list_of_form_fields.my_account_number_prefix.cleared_input_value,
			my_account_number: list_of_form_fields.my_account_number.cleared_input_value,
			my_bank_code: list_of_form_fields.my_bank_code.cleared_input_value,
			my_name: list_of_form_fields.my_name.cleared_input_value,
			my_address_street: list_of_form_fields.my_address_street.cleared_input_value,
			my_address_town: list_of_form_fields.my_address_town.cleared_input_value,
			my_address_zip: list_of_form_fields.my_address_zip.cleared_input_value,
		};

		var savePromise;
		if (isEditMode) {
			// Update existing record: find the key first
			savePromise = database.ref("about_me").limitToLast(1).once("child_added").then(function(snapshot) {
				return database.ref("about_me/" + snapshot.key).update(data);
			});
		} else {
			// Create new entry
			savePromise = database.ref("about_me").push(data);
		}

		savePromise.then(function() {
			// Redirect based on mode
			if (isEditMode) {
				window.location.href = "index.html";
			} else {
				window.location.href = "client_info.html";
			}
		}).catch(function(error) {
			alert('Chyba při ukládání: ' + error.message);
		});
	}
});
