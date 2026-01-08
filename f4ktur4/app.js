(function() {

    const config = {
        apiKey: "AIzaSyDrqihmPtjDnEgm2j0rGhR1-QbiIWCmldo",
        authDomain: "invoice-71a47.firebaseapp.com",
        databaseURL: "https://invoice-71a47.firebaseio.com",
        projectId: "invoice-71a47",
        storageBucket: "invoice-71a47.appspot.com",
        messagingSenderId: "845423691647"
    };

    firebase.initializeApp(config);

    var database = firebase.database();

    var firebaseRef = firebase.database().ref();

    var animationInRight = "animated bounceInRight";
    var animationOutLeft = "animated bounceOutLeft";
    var animationShake = "animated shake";
    var animationFadeInDown = "animated slideInDown"
    var animationEnd = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";


    if (view == "my_info") {



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
                "validation": /[A-z0-9]{1,}/,
                "validate_with": "",
                "step": "2"
            },

            "my_address_street": {
                "status": "",
                "message": "Prosím upravte tak, aby adresa měla alespoň jedno písmeno.",
                "cleared_input_value": "",
                "to_clear": "no",
                "input_key": "#new_my_address_street",
                "validation": /[A-z0-9]{1,}/,
                "validate_with": "",
                "step": "2"
            },

            "my_address_town": {
                "status": "",
                "message": "Prosím upravte tak, aby obec měla alespoň jedno písmeno.", // neni to nepovinny?
                "cleared_input_value": "",
                "to_clear": "no",
                "input_key": "#new_my_address_town",
                "validation": /[A-z0-9]{1,}/,
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


        var ok = "&#127867;";
        var nok = " ";

        var bank_message_both_nok = "Upravte tak, aby č. ú. mělo 2 &#8212 10 číslic. Kód banky tak, aby měl číslice 4.";
        var bank_message_displayed = "no";


        Object.keys(list_of_form_fields).forEach(function(key) { // abych pri nacteni stranky zjistil status poli

            var value_to_pass = list_of_form_fields[key];

            get_proper_value(key); // abych pri nacteni stranky zjistil spravny hodnoty (ocisteny)

            var cleared_value_to_pass = list_of_form_fields[key].cleared_input_value;

            input_status(value_to_pass, cleared_value_to_pass);

        });


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

        $('input').keyup(function() {

            var key = this.id.replace("new_", "");
            var key_to_pass = list_of_form_fields[key];

            get_proper_value(key);

            var cleared_value_to_pass = list_of_form_fields[key].cleared_input_value;

            input_status(key_to_pass, cleared_value_to_pass);

        });

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
                (list_of_form_fields.my_bank_code.status == ok))

            {
                $("#confirm_form .button").removeClass("disabled");

            } else {

                $("#confirm_form .button").addClass("disabled");

            };

            // step2

            if ((list_of_form_fields.my_name.status == ok) && (list_of_form_fields.my_address_street.status == ok)
                /*&&
                                   (list_of_form_fields.my_address_town.status == ok)*/
                && (list_of_form_fields.my_address_zip.status == ok)) {

                $("#confirm_about_me .button").removeClass("disabled");

            } else {

                $("#confirm_about_me .button").addClass("disabled");

            };
        };

        function what_is_wrong(step_number) {

            Object.keys(list_of_form_fields).forEach(function(key) { // abych pri nacteni stranky zjistil status poli

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

                    };


                    if (list_of_form_fields[key].step == step_number) {

                        $(list_of_form_fields[key].input_key).siblings("span").removeClass("hidden");
                        $(list_of_form_fields[key].input_key).siblings("span").html(message);
                        $(list_of_form_fields[key].input_key).addClass("field_is_wrong");

                    }

                };
            });
        };



        // step1 confirm button



        $('#confirm_form .button').on("click", function() {


            if ($(this).hasClass("disabled")) {

                what_is_wrong(1);

            } else {
                /*

                var content = "Omlouváme se, nepodařilo se nám dotáhnout data z rejstříku. :-(" + "<br>" + "Vyplňte prosím údaje ručně. "
                $('#status_bar')
                    .removeClass("hidden")
                    .addClass("problem")
                    .html(content);

*/
                $('.step1').addClass(animationOutLeft).one(animationEnd,
                    function() {

                        $('.step1').removeClass(animationOutLeft);
                        $('.step1').addClass("hidden");

                    });

                $('.step2').removeClass("hidden").one(animationEnd, function() {

                    $('.step2').removeClass("initial_position");
                });

                $('.step2').addClass(animationInRight);

            }
        });


        // confirm button step2

        $('#confirm_about_me .button').on("click", function() {

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

                window.location.href = "client_info.html";

            }

        });

    }

    //////////////////////////////////////////////////////////////////////////////////////

    if (view == "client_info") {


        var list_of_form_fields = {

            "client_legal_id": {
                "status": "",
                "message": "Prosím upravte tak, aby IČO mělo 8 číslic.",
                "cleared_input_value": "",
                "to_clear": "yes",
                "input_key": "#new_client_legal_id",
                "validation": /^[0-9]{8}$/,
                "validate_with": "",
                "step": "1"
            },

            "client_tax_id": {
                "status": "",
                "message": "Prosím upravte tak, aby DIČ mělo alespoň 8 číslic.", // jenze je to nepovinny, takze jenom kdyz do toho neco napsal
                "cleared_input_value": "",
                "to_clear": "yes",
                "input_key": "#new_client_tax_id",
                "validation": /^[0-9]{8,10}$/,
                "validate_with": "",
                "step": "1"
            },

            "client_name": {
                "status": "",
                "message": "Prosím upravte tak, aby název měl alespoň jedno písmeno.",
                "cleared_input_value": "",
                "to_clear": "no",
                "input_key": "#new_client_name",
                "validation": /[A-z0-9]{1,}/,
                "validate_with": "",
                "step": "2"
            },

            "client_address_street": {
                "status": "",
                "message": "Prosím upravte tak, aby adresa měla alespoň jedno písmeno.",
                "cleared_input_value": "",
                "to_clear": "no",
                "input_key": "#new_client_address_street",
                "validation": /[A-z0-9]{1,}/,
                "validate_with": "",
                "step": "2"
            },

            "client_address_town": {
                "status": "",
                "message": "Prosím upravte tak, aby obec měla alespoň jedno písmeno.", // neni to nepovinny? vyhodim to z enablovani tlacitka
                "cleared_input_value": "",
                "to_clear": "no",
                "input_key": "#new_client_address_town",
                "validation": /[A-z0-9]{1,}/,
                "validate_with": "",
                "step": "2"
            },

            "client_address_zip": {
                "status": "",
                "message": "Prosím upravte tak, aby PSČ mělo 5 číslic.",
                "cleared_input_value": "",
                "to_clear": "yes",
                "input_key": "#new_client_address_zip",
                "validation": /^[0-9]{5}$/,
                "validate_with": "",
                "step": "2"
            },
        };

        var ok = "&#127867;";
        var nok = " ";

        var bank_message_both_nok = "Prosím upravte tak, aby č. ú. mělo alespoň 2 a max 10 číslic. Kód banky tak, aby měl číslice 4.";
        var bank_message_displayed = "no";


        Object.keys(list_of_form_fields).forEach(function(key) { // abych pri nacteni stranky zjistil status poli

            var value_to_pass = list_of_form_fields[key];


            get_proper_value(key); // abych pri nacteni stranky zjistil spravny hodnoty (ocisteny)

            var cleared_value_to_pass = list_of_form_fields[key].cleared_input_value;

            input_status(value_to_pass, cleared_value_to_pass);

        });


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

        $('input').keyup(function() {

            var key = this.id.replace("new_", "");
            var key_to_pass = list_of_form_fields[key];

            get_proper_value(key);

            var cleared_value_to_pass = list_of_form_fields[key].cleared_input_value;

            input_status(key_to_pass, cleared_value_to_pass);

        });

        function get_proper_value(key) {

            if (list_of_form_fields[key].to_clear == "yes") {

                var cleared_value_to_pass = $(list_of_form_fields[key].input_key).val().replace(/[\s\v]+/g, "");

            } else {

                var cleared_value_to_pass = $(list_of_form_fields[key].input_key).val();
            }

            list_of_form_fields[key].cleared_input_value = cleared_value_to_pass; //takze ukladam spravnou hosnotu z input dfieldu

        };


        function to_enable_button() {

            // nakej cek to je no -- nepovinny policko

            if ((list_of_form_fields.client_tax_id.cleared_input_value == "")) {

                var status_not_required = ok;

            } else {

                var status_not_required = list_of_form_fields.client_tax_id.status;

            }
            //
            if ((list_of_form_fields.client_legal_id.status == ok) && (status_not_required == ok)) {

                $("#confirm_form .button").removeClass("disabled");

            } else {

                $("#confirm_form .button").addClass("disabled");

            };

            // step2

            if ((list_of_form_fields.client_name.status == ok) && /*(list_of_form_fields.client_address_street.status == ok) &&*/
                (list_of_form_fields.client_address_town.status == ok) && (list_of_form_fields.client_address_zip.status == ok)) {

                $("#confirm_about_client .button").removeClass("disabled");

            } else {

                $("#confirm_about_client .button").addClass("disabled");

            };
        };

        function what_is_wrong(step_number) {

            Object.keys(list_of_form_fields).forEach(function(key) { // abych pri nacteni stranky zjistil status poli

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

                    };

                    if (list_of_form_fields[key].step == step_number) {

                        $(list_of_form_fields[key].input_key).siblings("span").removeClass("hidden");
                        $(list_of_form_fields[key].input_key).siblings("span").text(message);
                        $(list_of_form_fields[key].input_key).addClass("field_is_wrong");

                    }

                    if ((list_of_form_fields[key].step == step_number) && (list_of_form_fields.client_tax_id.cleared_input_value == "")) {
                        // nepovinne policko
                        $(list_of_form_fields.client_tax_id.input_key).siblings("span").addClass("hidden");
                        $(list_of_form_fields.client_tax_id.input_key).siblings("span").text();
                        $(list_of_form_fields[key].input_key).removeClass("field_is_wrong");

                    }
                };
            });

        };

        // spinner


        $('.loader_start').on("click", function() {

            $( ".full" ).removeClass("hidden");

            
            timeoutID = window.setTimeout(slowAlert, 2000);

                function slowAlert() {
                    console.log("ahoj")
                    $( ".full" ).addClass("hidden");

                    }

        });

        // step1 confirm button

        $('#confirm_form .button').on("click", function() {


            if ($(this).hasClass("disabled")) {

                what_is_wrong(1);

            } else {
                /*

                var content = "Omlouváme se, nepodařilo se nám dotáhnout data z rejstříku. :-(" + "<br>" + "Vyplňte prosím údaje ručně. "
                $('#status_bar')
                    .removeClass("hidden")
                    .addClass("problem")
                    .html(content);

                            
*/
                $('.step1').addClass(animationOutLeft).one(animationEnd,
                    function() {

                        $('.step1').removeClass(animationOutLeft);
                        $('.step1').addClass("hidden");

                    });


                $('.step2').removeClass("hidden").one(animationEnd, function() {

                    $('.step2').removeClass("initial_position");

                });

                $('.step2').addClass(animationInRight);

            }
        });

        // confirm button step2

        $('#confirm_about_client .button').on("click", function() {

            if ($(this).hasClass("disabled")) {

                what_is_wrong(2);

            } else {

                var about_client_Ref = firebase.database().ref('about_client');
                var new_about_client_Ref = about_client_Ref.push();
                new_about_client_Ref.set({
                    'client_legal_id': list_of_form_fields.client_legal_id.cleared_input_value,
                    'client_tax_id': list_of_form_fields.client_tax_id.cleared_input_value,
                    'client_name_id': list_of_form_fields.client_name.cleared_input_value,
                    'client_address_street': list_of_form_fields.client_address_street.cleared_input_value,
                    'client_address_town': list_of_form_fields.client_address_town.cleared_input_value,
                    'client_address_zip': list_of_form_fields.client_address_zip.cleared_input_value,
                })

                window.location.href = "invoice.html";

            }

        });
    }

    /////////////////////////////////////////////////////

    if (view == "invoice") {


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

        // tohle plni data z posledni faktury

        var invoiceRef = firebase.database().ref("invoice");
        invoiceRef.limitToLast(1).on('child_added', function(snapshot) {

            var key = snapshot.key;
            var client = snapshot.child("client_key").val();
            var me = snapshot.child("my_key").val();


            var inv_number_last = snapshot.child("invoice_number").val()

            console.log(inv_number_last, inv_number_last.length)

            if (inv_number_last < 10) {

            console.log(inv_number_last, inv_number_last.length)

                inv_number_last = "0" + inv_number_last;
            }

            var inv_number = (1 * (snapshot.child("invoice_number").val()) + 1);

            console.log(inv_number, inv_number.length)


            if (inv_number < 10) {

                inv_number = "0" + inv_number;
            }


            list_of_form_fields.invoice_number.cleared_input_value = (1 * (snapshot.child("invoice_number").val()) + 1);
            list_of_form_fields.invoice_number_year.cleared_input_value = snapshot.child("invoice_number_year").val();
            
            list_of_form_fields.client_key.cleared_input_value = client;
            list_of_form_fields.client_name.cleared_input_value = snapshot.child("client_name").val();
            list_of_form_fields.me.cleared_input_value = me;

            list_of_form_fields.amount.cleared_input_value = snapshot.child("amount").val();
            list_of_form_fields.for_what.cleared_input_value = snapshot.child("for_what").val();
            list_of_form_fields.thanks.cleared_input_value = snapshot.child("thanks").val();

            last_invoice_number = inv_number_last + " " +
                snapshot.child("invoice_number_year").val() + " je číslo poslední faktury" 


            $('#new_invoice_number').val(inv_number);
            $('#new_invoice_number_year').val(list_of_form_fields.invoice_number_year.cleared_input_value);
            $('#invoice_number .additional_info').text(last_invoice_number);


            $('#new_amount').val(list_of_form_fields.amount.cleared_input_value);
            $('#new_for_what').val(list_of_form_fields.for_what.cleared_input_value);
            $('#new_thanks').val(list_of_form_fields.thanks.cleared_input_value);




            var last_invoice_client = firebase.database().ref("about_client");

            last_invoice_client.orderByKey().equalTo(client).on("child_added", function(snapshot) {


                var client_last = snapshot.child("client_name_id").val();
                var rest_of_client = snapshot.child("client_address_street").val() + ", " +
                    snapshot.child("client_address_town").val() + ", IČ " + snapshot.child("client_legal_id").val();



            //    $('.client_info_a').text(client_last);
            //    $('.client span.additional_info_a').text(rest_of_client);

                $('.client_info_selected').text(client_last);
                $('.client .additional_info').text(rest_of_client);
                $('#new_client_key').val(key);


            });

            var last_invoice_me = firebase.database().ref("about_me");

            last_invoice_me.limitToLast(1).on("child_added", function(snapshot) {


                //   var me_last = snapshot.child("my_name").val();
                //   var rest_of_me = snapshot.child("my_address_street").val() + ", " +
                //      snapshot.child("my_address_town").val() + ", IČ " + snapshot.child("my_legal_id").val();


                $('#about_me').html(
                    '<div data-about_me_id="' + key + '">' +
                    '<p>' +  snapshot.child("my_name").val() + ", " +
                    snapshot.child("my_address_street").val() + ", " +
                    snapshot.child("my_address_town").val() + ", " + snapshot.child("my_address_zip").val() + '</p>' +
                    '<p class="break">' + "IČ " + snapshot.child("my_legal_id").val() + '</p>' +
                    '<p>' + "č.ú. " + snapshot.child("my_account_number_prefix").val() + " " + snapshot.child("my_account_number").val() +
                    " / " + snapshot.child("my_bank_code").val() + '</p>' + 

                    '</div>'
                );

            });

        });


        // todle je vo datumech a jejich predvyplneni


        $.datepicker.setDefaults( $.datepicker.regional[ "fr" ] );
        moment.locale('cs');

        document.getElementById("new_date_issued").value = moment().format('l');
        document.getElementById("new_date_to_send").value = moment().add(14, 'days').format('l');

        list_of_form_fields.date_issued.cleared_input_value = $('#new_date_issued').val();
        list_of_form_fields.date_to_send.cleared_input_value = $('#new_date_to_send').val();

        $('#date_issued_today').prop('checked', true);
        $('#date_issued_last_month').prop('checked', false);

        date_difference();


        function date_difference() {

            var a = moment(list_of_form_fields.date_issued.cleared_input_value, "DD-MM-YYYY");
            var b = moment(list_of_form_fields.date_to_send.cleared_input_value, "DD-MM-YYYY");

            var difference = b.diff(a, 'days');

            if (b < a) {

                $('#date_to_send .additional_info').text("Ajaj, splatnost je dřív než datum vystavení");
                $('#date_to_send .additional_info').addClass("error");
                

            } else {

                var text =  difference + " dní po vystavení"
                $('#date_to_send .additional_info').text(text);
                $('#date_to_send .additional_info').removeClass("error");
                //$(list_of_form_fields[key].input_key).siblings("span")
            }
        };


        $("#new_date_issued").datepicker({ //nefunguje zobrazeni data z policka do kalendare

            onSelect: function() {
                var dateObject = $(this).datepicker('getDate');
                document.getElementById("new_date_issued").value = moment(dateObject).format('l');
                list_of_form_fields.date_issued.cleared_input_value = $('#new_date_issued').val();


                $('#date_issued_today').prop('checked', false);
                $('#date_issued_last_month').prop('checked', false);

                //var date_to_send = moment(dateObject).add(14, 'days').format('l');
                //document.getElementById("new_date_to_send").value = date_to_send;
                //list_of_form_fields.date_to_send.cleared_input_value = $('#new_date_to_send').val();

                date_difference();

            }
        });

        $('#date_issued_today').on("click", function() {


            if (document.getElementById('date_issued_today').checked) {
                $('#date_issued_last_month').prop('checked', false);

                document.getElementById("new_date_issued").value = moment().format('l');
                document.getElementById("new_date_to_send").value = moment().add(14, 'days').format('l');

                list_of_form_fields.date_issued.cleared_input_value = $('#new_date_issued').val();
                list_of_form_fields.date_to_send.cleared_input_value = $('#new_date_to_send').val();

            } else {
                $('#date_issued_today').prop('checked', true);
            }
            date_difference();

        });

        $('#date_issued_last_month').on("click", function() {

            if (document.getElementById('date_issued_last_month').checked) {
                $('#date_issued_today').prop('checked', false);

                var date_issued = moment(date_issued).subtract(1, 'months').endOf('month').format('l');
                document.getElementById("new_date_issued").value = date_issued;
                list_of_form_fields.date_issued.cleared_input_value = $('#new_date_issued').val();

                var date_to_send = moment(date_to_send).subtract(1, 'months').endOf('month').add(14, 'days').format('l');
                document.getElementById("new_date_to_send").value = date_to_send;
                list_of_form_fields.date_to_send.cleared_input_value = $('#new_date_to_send').val();

            } else {
                $('#date_issued_last_month').prop('checked', true);
            }


            date_difference();

        });



        $("#new_date_to_send").datepicker({
            onSelect: function() {


                var original_date = list_of_form_fields.date_to_send.cleared_input_value

                var dateObject = $(this).datepicker('getDate');
                document.getElementById("new_date_to_send").value = moment(dateObject).format('l');
                list_of_form_fields.date_to_send.cleared_input_value = $('#new_date_to_send').val();


                date_difference();

            }
        });


        // plni seznam klientu


        function fill_client_list() {

            var ak = firebase.database().ref("about_client");
            var query = ak.orderByKey();

            query.once("value").then(function(snapshot) {

                snapshot.forEach(function(childSnapshot) {

                    var key = childSnapshot.key;
                    var childData = childSnapshot.val();


                    $('.client_list .rows').append(
                        '<div class="client_list_item"  data-client_id="' + key + '">' +
                        
                        '<div class="client_info">' + childData.client_name_id + '</div>' +
                        '<span class="additional_info">' + childData.client_address_street + ", " +
                        childData.client_address_town + ", IČ " + childData.client_legal_id + '</span>' + '</div>'

                    );

                });

            });
        };

        fill_client_list();


    //    $('.client_info_a').on("click", function() {

    //        $('.select_client_list').removeClass("hidden");

    //        $('.client_info_a').addClass("focus");

        $('.client_info_selected').on("click", function() {

            $('.client_list').removeClass("hidden");

            $('.client_info_selected').addClass("focus");
                

            $('.client_list_item').on("click", function() {

                var key = ($(this).data("client_id"));

                var ref = firebase.database().ref("about_client").child(key);


                ref.once("value")
                    .then(function(snapshot) {
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
                    });

            });


        });

        $('input').focusin(function() {

            $('.client_info_selected').removeClass("focus");

        });
        $('input').keyup(function() {

            var key = this.id.replace("new_", "");
            var key_to_pass = list_of_form_fields[key];

            $('.client_info_a').removeClass("focus");


            get_proper_value(key);

        });

        function get_proper_value(key) {

            if (list_of_form_fields[key].to_clear == "yes") {

                var cleared_value_to_pass = $(list_of_form_fields[key].input_key).val().replace(/[\s\v]+/g, "");

            } else {

                var cleared_value_to_pass = $(list_of_form_fields[key].input_key).val();
            }

            list_of_form_fields[key].cleared_input_value = cleared_value_to_pass; //takze ukladam spravnou hosnotu z input dfieldu

        };

        $('#confirm_invoice .button').on("click", function() {

            if ($(this).hasClass("disabled")) {

                

            } else {

                $('#confirm_invoice .button').addClass("disabled")
            
            var invoice_Ref = firebase.database().ref('invoice');
                var new_invoice_Ref = invoice_Ref.push();
                new_invoice_Ref.set({
                    'amount': list_of_form_fields.amount.cleared_input_value,

                    'client_key': list_of_form_fields.client_key.cleared_input_value,
                    'client_name': list_of_form_fields.client_name.cleared_input_value,

                    'date_issued': list_of_form_fields.date_issued.cleared_input_value,
                    'date_to_send': list_of_form_fields.date_to_send.cleared_input_value,

                    'for_what': list_of_form_fields.for_what.cleared_input_value,
                    'invoice_number': list_of_form_fields.invoice_number.cleared_input_value,
                    'invoice_number_year': list_of_form_fields.invoice_number_year.cleared_input_value,

                    'my_key': list_of_form_fields.me.cleared_input_value,
                    'thanks': list_of_form_fields.thanks.cleared_input_value,
                })

                window.location.href = "invoice_to_print.html";

            }

        });

        

    };

/////////////////////////////////////////////////////////


 if (view == "preview") {





        var invoiceRef = firebase.database().ref("invoice"); 

        invoiceRef.limitToLast(1).on('child_added', function(snapshot) {

            //cislo faktury

            var inv_number = snapshot.val().invoice_number

                console.log(inv_number)
                console.log(inv_number.length)
                


            if (inv_number < 10) {

                inv_number = "0"+ inv_number

            }


            //

            
            var invoice_number = "Faktura č. " + inv_number
            var invoice_number_year = snapshot.val().invoice_number_year;
            var pure_invoice_number = inv_number + invoice_number_year;
            var for_what = snapshot.val().for_what;
            var amount = snapshot.val().amount + " Kč";
            var pure_amount = snapshot.val().amount;
            var date_to_send = snapshot.val().date_to_send;
            var date_issued = snapshot.val().date_issued;
            var thanks = snapshot.val().thanks;

            var clientref = firebase.database().ref("about_client").child(snapshot.val().client_key);

            clientref.once('value')
                .then(function(snapshot) {

                //cislo faktury

                var client_tax_id = snapshot.val().client_tax_id;

                if (client_tax_id !== "") {
                    client_tax_id = ", DIČ " + snapshot.val().client_tax_id;
                }
                
                //

                var client = snapshot.val().client_name_id + ", " + snapshot.val().client_address_street + ", " + 
                    snapshot.val().client_address_town + ",  " + snapshot.val().client_address_zip;                
                var client_legal_id = "IČ " + snapshot.val().client_legal_id + client_tax_id;

console.log(date_to_send);
 

            var myRef = firebase.database().ref("about_me");

            myRef.limitToLast(1).on('child_added', function(snapshot) {

                //cislo faktury

                var prefix = snapshot.val().my_account_number_prefix;

                if (prefix !== "") {
                    prefix = prefix + " – ";
                }

                //
            
            var my_account = prefix + snapshot.val().my_account_number + " / " +
                snapshot.val().my_bank_code;

            var me = snapshot.val().my_name + ", " + snapshot.val().my_address_street + ", " + 
            snapshot.val().my_address_town + ",  " + snapshot.val().my_address_zip;

            var my_legal_id = "IČ " + snapshot.val().my_legal_id

            

            $('#invoice_number').html(
                invoice_number + '<span class="pseudospace">' + invoice_number_year + '</span>'

                );


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

// QR kod

            var a = moment(date_to_send, "DD-MM-YYYY").format('YYYY-MM-DD');
            var url = '<img src="' + "https://api.paylibo.com/paylibo/generator/czech/" + "image?accountNumber=" + snapshot.val().my_account_number + "&bankCode=" + snapshot.val().my_bank_code
            + "&amount=" + pure_amount + "&currency=CZK&vs=" + pure_invoice_number + '">';
            //datum poresit formaty

            
            console.log(url);

            
            
            $('.qr').html(url);

       }); 

              }); 

             });

    };

}());

/*

                    date_issued = $('#new_date_issued').val();
                    date_to_send = $('#new_date_to_send').val();
                    amount = "";
                    client_name = $('#new_client').val();
                    client_key = $('#new_client_key').val();
                    for_what = "";


                    // tohle je pro prvni prubeh, kdyz jeste neni zadna faktura

                    var clientRef = firebase.database().ref("about_client");
                    clientRef.limitToLast(1).on('child_added', function(snapshot) {

                        var key = snapshot.key;
                        var client = snapshot.child("client_name").val();
                        var rest_of_client = snapshot.child("client_address_street").val() + ", " +
                            snapshot.child("client_address_town").val() + ", IČ " + snapshot.child("client_legal_id").val();
                        var me = snapshot.child("my_key").val();


                        $('#new_client').val(client);
                        $('.client .additional_info').text(rest_of_client);
                        $('#new_client_key').val(key);


                        // tohle plni data z posledni faktury

                        var invoiceRef = firebase.database().ref("invoice");
                        invoiceRef.limitToLast(1).on('child_added', function(snapshot) {

                            var key = snapshot.key;
                            var client = snapshot.child("client_key").val();
                            var me = snapshot.child("my_key").val();

                            invoice_number = (1 * (snapshot.child("invoice_number").val()) + 1);
                            invoice_number_year = snapshot.child("invoice_number_year").val();
                            thanks = snapshot.child("thanks").val();

                            document.getElementById("new_invoice_number").value = invoice_number; //doplnit ty debilni podminky


                            document.getElementById("new_invoice_number_year").value = snapshot.child("invoice_number_year").val();

                            last_invoice_number = "Poslední faktura měla číslo " + snapshot.child("invoice_number").val() +
                                snapshot.child("invoice_number_year").val()

                            $('#invoice_number .additional_info').text(last_invoice_number);

                            document.getElementById("new_thanks").value = snapshot.child("thanks").val();


                            var last_client = firebase.database().ref("about_client");
                            var ref = last_client.child(client);
                            //


                            ref.once("value")
                                .then(function(snapshot) {

                                    var key = snapshot.key;
                                    var client = snapshot.child("client_name_id").val();
                                    var rest_of_client = snapshot.child("client_address_street").val() + ", " +
                                        snapshot.child("client_address_town").val() + ", IČ " + snapshot.child("client_legal_id").val();


                                    $('#new_client').val(client);
                                    $('.client .additional_info').text(rest_of_client);
                                    $('#new_client_key').val(key);
                                });


                            // tohle plni seznam klientu pro dropdown

                            var a = firebase.database().ref("about_client");
                            var query = a.orderByKey();



                            query.once("value")
                                .then(function(snapshot) {
                                    snapshot.forEach(function(childSnapshot) {
                                        // key will be "ada" the first time and "alan" the second time
                                        var key = childSnapshot.key;
                                        // childData will be the actual contents of the child
                                        var childData = childSnapshot.val();

                                        $('.client_list').append(
                                            '<div class="a" data-client_id="' + key + '">' +
                                            '<p>' + childData.client_name_id + '</p>' +
                                            '<p>' + childData.client_address_street + ", " +
                                            childData.client_address_town + ", IČ " + childData.client_legal_id + '</p>' +
                                            '</div>'
                                        );
                                    });

                                    // todle vybira klienta z dropdownu

                                    $('.select_another_client').on("click", function() {

                                        $('.select_client_list').toggleClass('hidden');

                                    });

                                    $('.client_list div').on("click", function() {

                                        var key = ($(this).data("client_id"));
                                        var ref = a.child(key);

                                        ref.once("value")
                                            .then(function(snapshot) {
                                                var key = snapshot.key;
                                                var client = snapshot.child("client_name_id").val();
                                                var rest_of_client = snapshot.child("client_address_street").val() + ", " +
                                                    snapshot.child("client_address_town").val() + ", IČ " + snapshot.child("client_legal_id").val();


                                                $('#new_client').val(client);
                                                $('.client .additional_info').text(rest_of_client);
                                                $('#new_client_key').val(key);

                                                $('.select_client_list').toggleClass('hidden');
                                            });



                                    });
                                });


                            // todle vyplnuje me jako dodavatele, i kdyz to bere posledniho 

                            var query = firebase.database().ref("about_me").orderByKey();

                            query.once("value")
                                .then(function(snapshot) {
                                    snapshot.forEach(function(childSnapshot) {
                                        // key will be "ada" the first time and "alan" the second time
                                        var key = childSnapshot.key;
                                        // childData will be the actual contents of the child
                                        var childData = childSnapshot.val();


                                        $('#about_me').append(
                                            '<div data-about_me_id="' + key + '">' +
                                            '<p>' + '<strong>' + childData.about_me_id + '</strong>' + '</p>' +
                                            '<p>' + childData.my_address_street + '</p>' +
                                            '<p>' + childData.my_address_town + ", " + childData.my_address_zip + '</p>' +
                                            '<p class="break">' + "IČ " + childData.my_legal_id + '</p>' +
                                            '<p>' + "č.ú. " + childData.my_account_number_prefix + " " + childData.my_account_number +
                                            " / " + childData.my_bank_code + '</p>' +

                                            '</div>'
                                        );
                                    });
                                });

                            // todle je vo datumech a jejich predvyplneni

                            // aby to fungovalo
                            $.datepicker.setDefaults($.datepicker.regional["cs"]);
                            moment.locale('cs');

                            // predvyplneni datumu

                            document.getElementById("new_date_issued").value = moment().format('l');
                            document.getElementById("new_date_to_send").value = moment().add(14, 'days').format('l');


                            // naplneni DB z dat, ktery jsou predvyplneny 




                            console.log(invoice_number, date_issued, date_to_send, client_name, client_key)


                            document.getElementById("new_invoice_number").onblur = function() {
                                invoice_number = $('#new_invoice_number').val();

                                $('#invoice_number .status').removeClass('unchecked');
                                $('#invoice_number .status').addClass('checked');

                            };

                            document.getElementById("new_invoice_number_year").onblur = function() {
                                invoice_number_year = $('#new_invoice_number_year').val();

                                $('#invoice_number .status').removeClass('unchecked');
                                $('#invoice_number .status').addClass('checked');

                            };

                            // issue date

                            $("#new_date_issued").datepicker({
                                onSelect: function() {
                                    var dateObject = $(this).datepicker('getDate');
                                    document.getElementById("new_date_issued").value = moment(dateObject).format('l');
                                    date_issued = $('#new_date_issued').val();

                                    $('#date_issued .status').removeClass('unchecked');
                                    $('#date_issued .status').addClass('checked');

                                }
                            });

                            document.getElementById("new_date_issued").onblur = function() {
                                date_issued = $('#new_date_issued').val();

                                $('#date_issued .status').removeClass('unchecked');
                                $('#date_issued .status').addClass('checked');

                            };

                            // date to send

                            $("#new_date_to_send").datepicker({
                                onSelect: function() {
                                    var dateObject = $(this).datepicker('getDate');
                                    document.getElementById("new_date_to_send").value = moment(dateObject).format('l');
                                    date_to_send = $('#new_date_to_send').val();

                                    $('#date_to_send .status').removeClass('unchecked');
                                    $('#date_to_send .status').addClass('checked');


                                }
                            });

                            document.getElementById("new_date_to_send").onblur = function() {
                                date_to_send = $('#new_date_to_send').val();

                                $('#date_to_send .status').removeClass('unchecked');
                                $('#date_to_send .status').addClass('checked');

                            };

                            //

                            document.getElementById("new_amount").onblur = function() {
                                amount = $('#new_amount').val();

                                $('#amount .status').removeClass('unchecked');
                                $('#amount .status').addClass('checked');
                            };

                            document.getElementById("new_client").onblur = function() {
                                client_name = $('#new_client').val();
                                client_key = $('#new_client_key').val();
                            };


                            document.getElementById("new_for_what").onblur = function() {
                                for_what = $('#new_for_what').val();

                                $('#for_what .status').removeClass('unchecked');
                                $('#for_what .status').addClass('checked');
                            };

                            document.getElementById("new_thanks").onblur = function() {
                                thanks = $('#new_thanks').val();

                                $('#thanks .status').removeClass('unchecked');
                                $('#thanks .status').addClass('checked');
                            };

                            $('#confirm_invoice').on("click", function() {

                                client_name = $('#new_client').val();
                                client_key = $('#new_client_key').val();

                                var about_invoice_Ref = firebase.database().ref('invoice');
                                var new_about_invoice_Ref = about_invoice_Ref.push();
                                new_about_invoice_Ref.set({

                                    'invoice_number': invoice_number,
                                    'invoice_number_year': invoice_number_year,
                                    'date_issued': date_issued,
                                    'date_to_send': date_to_send,
                                    'amount': amount,
                                    'client_name': client_name,
                                    'client_key': client_key,
                                    'for_what': for_what,
                                    'thanks': thanks,

                                });

                            });
                        });
                    });

                };};



                if (view == "preview") {

                    var invoiceRef = firebase.database().ref("invoice"); // tohle je pro prvni prubeh, kdyz jeste neni zadna faktura

                    invoiceRef.limitToLast(1).on('child_added', function(snapshot) {


                        var invoice_number = "Faktura č. " + snapshot.val().invoice_number;
                        var for_what = snapshot.val().for_what;
                        var amount = snapshot.val().amount + " Kč";
                        var date_to_send = snapshot.val().date_to_send;
                        var date_issued = snapshot.val().date_issued;
                        var thanks = snapshot.val().thanks;

                        var akey = snapshot.val().client_key;

                        var clientref = firebase.database().ref("about_client").child(akey);

                        clientref.once('value')
                            .then(function(snapshot) {

                                var client_name = snapshot.val().client_name_id;
                                var client_address_street = snapshot.val().client_address_street;
                                var client_town = snapshot.val().client_address_town + "  " +
                                    snapshot.val().client_address_zip;

                                var client_legal_id = "IČ " + snapshot.val().client_legal_id;


                                var myRef = firebase.database().ref("about_me");

                                myRef.limitToLast(1).on('child_added', function(snapshot) {

                                    var my_name = snapshot.val().about_me_id;
                                    var my_address_street = snapshot.val().my_address_street
                                    var my_town = snapshot.val().my_address_town + "  " +
                                        snapshot.val().my_address_zip;

                                    var my_legal_id = "IČ " + snapshot.val().my_legal_id;


                                    var my_account = snapshot.val().my_account_number_prefix + snapshot.val().my_account_number + " / " +
                                        snapshot.val().my_bank_code;
                                    // ... kdyz je prefix prazdnej, nezobrazovat pomlcku



                                    $('#invoice_number').html(invoice_number);


                                    $('#me .name').html(my_name);
                                    $('#me .address_street').html(my_address_street);
                                    $('#me .address_town').html(my_town);
                                    $('#me .legal_id span').html(my_legal_id);

                                    $('#client .name').html(client_name);
                                    $('#client .address_street').html(client_address_street);
                                    $('#client .address_town').html(client_town);
                                    $('#client .legal_id span').html(client_legal_id);

                                    $('#for_what .for_what').html(for_what);
                                    $('#amount .total_amount').html(amount);

                                    $('#date .date_to_send').html(date_to_send);
                                    $('#date .date_issued').html(date_issued);

                                    $('#account_number .my_account_number').html(my_account);

                                    $('#thanks .thanks').html(thanks);

                                });

                            });

                
        
                        }); 
};
   */
