$(function() {
    if (window.location.hash === '#contribute') {
        window.location = '/contribute';
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

    /* Thank you message */
    if (window.location.hash === '#confirmed') {
        window.history.pushState(null, null, '#');
        $('body').addClass('thanks');
        setTimeout(function() {
            $('body').removeClass('thanks');
        }, 30000);
    }

    /* Email validation */
    $('input.zip').payment('restrictNumeric');
});

Array.prototype.move = function(from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};
