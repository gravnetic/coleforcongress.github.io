$(function() {

    /* Stripe */
    Stripe.setPublishableKey('pk_live_2Hr2yN0PSWDpX8yAD8P6unAn');

    $('#payment-form').submit(function(event) {
        var $form = $(this);

        // All fields need a value
        var valid = true;
        $('#payment-form input[type="text"]:not(.amount), #payment-form select.state').each(function() {
            if (!$(this).val()) valid = false;
        });
        if (!valid) {
            $form.find('.payment-errors').text('Please fill out all fields.');
            return false;
        }
        // contribution limits
        if (+$('input[name="amount"]').val() > 5200 ||
            +$('input[name="amount"]').val() < 1) {
            $form.find('.payment-errors').text('Please enter an amount between $1 and $5,200.');
            return false;
        }

        // Disable the submit button to prevent repeated clicks
        //$('#donate-submit').prop('disabled', true);

        Stripe.card.createToken($form, stripeResponseHandler);

        // Prevent the form from submitting with the default action
        return false;
    });

    var stripeResponseHandler = function(status, response) {
        var $form = $('#payment-form');

        if (response.error) {
            // Show the errors on the form
            $form.find('.payment-errors').text(response.error.message);
            //$form.find('input[type="submit"]').prop('disabled', false);
        } else {
            // token contains id, last4, and card type
            var token = response.id;
            // Insert the token into the form so it gets submitted to the server
            $form.append($('<input type="hidden" name="stripeToken" />').val(token));
            // and submit
            $form.get(0).submit();
        }
    };

    /* Contribute button */
    document.getElementById('contribute').addEventListener('click', function(e) {
        $('body').addClass('contribute');
        $('html,body').animate({ scrollTop: 0 }, 0.4 * 1000);
        e.preventDefault();
    });

    $(document).keyup(function(e) {
        if (e.keyCode == 27) { $('body').removeClass('contribute'); }  // esc
    });

    $('#logo').click(function(e) {
        $('body').removeClass('contribute');
        e.preventDefault();
    });

    /* Contribute form */
    $('button.amount').click(setAmount);
    $('input.amount').focus(setAmount);
    $('input.amount').keyup(setAmount);
    $('input[name="fname"], input[name="lname"]').keyup(setName);
    function setAmount(e) {
        $('button.amount, input.amount').toggleClass('active', false);
        $(this).toggleClass('active');

        var amount = $(this).val();
        $('input[name="amount"]').val(amount);
        if (amount) {
            $('#payment-form input[type="submit"]').val('Donate $' + amount);
        } else {
            $('#payment-form input[type="submit"]').val('Donate');
        }
    }
    function setName(e) {
        var fname = $('input[name="fname"]').val();
        var lname = $('input[name="lname"]').val();
        $('input[name="name"]').val(fname + ' ' + lname);
    }
    $('input.cc-num').payment('formatCardNumber');
    $('input.amount, input.exp, input.zip').payment('restrictNumeric');

    /* Thank you message */
    if (window.location.hash === '#confirmed') {
        window.history.pushState(null, null, '#');
        $('body').addClass('thanks');
        setTimeout(function() {
            $('body').removeClass('thanks');
        }, 30000);
    }
});
