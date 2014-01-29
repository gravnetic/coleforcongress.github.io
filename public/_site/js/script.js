$(function() {

    /* Stripe */
    /* live: */ Stripe.setPublishableKey('pk_live_2Hr2yN0PSWDpX8yAD8P6unAn');
    /* test:    Stripe.setPublishableKey('pk_test_oZNDQkoLhkuZj9inYl6GlR6M'); */

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

        // Disable the submit button to prevent repeated click
        $('#donate-submit').attr('disabled', 'disabled');

        Stripe.card.createToken($form, stripeResponseHandler);

        // Prevent the form from submitting with the default action
        return false;
    });

    var stripeResponseHandler = function(status, response) {
        var $form = $('#payment-form');

        if (response.error) {
            // Show the errors on the form
            $form.find('.payment-errors').text(response.error.message);
            $('#donate-submit').attr('disabled', null);
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
    $('#contribute-badge').on('click', function(e) {
        $('body').addClass('contribute');
        $('html,body').animate({ scrollTop: 0 }, 0.4 * 1000);
        e.preventDefault();
    });

    $(document).keyup(function(e) {
        if (e.keyCode == 27) { $('body').removeClass('contribute'); }  // esc
    });

    /* Contribute form */

    /* Formatting */
    $('input.cc-num').payment('formatCardNumber');
    $('input.exp').payment('formatCardExpiry');
    $('input.amount, input.zip').payment('restrictNumeric');

    /* Handlers */
    $('button.amount').click(setAmount);
    $('input.amount').keyup(setAmount);
    $('input.amount').focus(setAmount);
    $('input[name="fname"], input[name="lname"]').keyup(setName);
    $('input[name="fname"], input[name="lname"]').focus(setName);
    $('input.exp').keyup(setExp);
    $('input.exp').focus(setExp);

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

    function setExp(e) {
        var exp = $(this).val().split(' / ');
        $('input.expiry.month').val(exp[0]|| '');
        $('input.expiry.year').val(exp[1] || '');
    }

    /* Thank you message */
    if (window.location.hash === '#confirmed') {
        window.history.pushState(null, null, '#');
        $('body').addClass('thanks');
        setTimeout(function() {
            $('body').removeClass('thanks');
        }, 30000);
    }

    if (window.location.hash === '#contribute') {
        $('#contribute-badge')[0].click();
    }

    // OFA form
    $('#ofa-form').submit(function(e) {
        var url = 'https://docs.google.com/forms/d/1D4JzBTraFEkehoZNIMZTtjkCHvbSCCHvXfubAn9Yvy4/formResponse';
        var data = $(this).serialize();
        try { // We know this will return a cross-domain error
            $.ajax({
                type: 'POST',
                url: url,
                data: data,
                complete: function() {
                    $('#ofa-overlay').addClass('thanks');
                    $('html,body').animate({ scrollTop: 0 }, 0.4 * 1000);
                }
            });
        } catch(e) {}
        return false;
    });
});

Array.prototype.move = function(from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};
