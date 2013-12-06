$(function() {
    document.getElementById('contribute').addEventListener('click', function(e) {
        $('body').addClass('contribute');
        $('html,body').animate({ scrollTop: 0 }, 0.4 * 1000);
        e.preventDefault();
    });
    $(document).keyup(function(e) {
        if (e.keyCode == 27) { $('body').removeClass('contribute'); }   // esc
    });
});