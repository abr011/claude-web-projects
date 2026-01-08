/* ==========================================================================
   Shared Validation Functions
   ========================================================================== */

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
};


function get_proper_value(key) {

	if (list_of_form_fields[key].to_clear == "yes") {
		var cleared_value_to_pass = $(list_of_form_fields[key].input_key).val().replace(/[\s\v]+/g, "");

	} else {
		var cleared_value_to_pass = $(list_of_form_fields[key].input_key).val();
	}

	list_of_form_fields[key].cleared_input_value = cleared_value_to_pass; //takze ukladam spravnou hosnotu z input dfieldu

};


function to_enable_button() {

	if ((list_of_form_fields.my_legal_id.status == ok) && (list_of_form_fields.my_account_number.status == ok) &&
		(list_of_form_fields.my_bank_code.status == ok)) {
		$("#confirm_form .button").removeClass("disabled");

	} else {
		$("#confirm_form .button").addClass("disabled");

	}

	// step2

	if ((list_of_form_fields.my_name.status == ok)
		&& (list_of_form_fields.my_address_street.status == ok)
		/*&& (list_of_form_fields.my_address_town.status == ok)*/
		&& (list_of_form_fields.my_address_zip.status == ok)) {

		$("#confirm_about_me .button").removeClass("disabled");

	} else {
		$("#confirm_about_me .button").addClass("disabled");
	}
}

function what_is_wrong(step_number) {
	Object.keys(list_of_form_fields).forEach(function (key) { // abych pri nacteni stranky zjistil status poli

		if ((list_of_form_fields[key].status == nok)) {

			if (list_of_form_fields[key].validate_with == "") {

				var message = list_of_form_fields[key].message;

			} else {

				var other_one = list_of_form_fields[key].validate_with;
				var status_other_one = list_of_form_fields[other_one].status;

				if ((list_of_form_fields[key].status == nok) &&
					(status_other_one == nok)) {

					var message = bank_message_both_nok;
					bank_message_displayed = "yes";
				}

				if ((list_of_form_fields[key].status == nok) &&
					(status_other_one == ok)) {

					var message = list_of_form_fields[key].message;
				}

				if ((list_of_form_fields[key].status == ok) &&
					(status_other_one == nok)) {

					var message = other_one.message;
				}

			}

			if (list_of_form_fields[key].step == step_number) {
				$(list_of_form_fields[key].input_key).siblings("span").removeClass("hidden");
				$(list_of_form_fields[key].input_key).siblings("span").html(message);
				$(list_of_form_fields[key].input_key).addClass("field_is_wrong");
			}
		}
	});
}

