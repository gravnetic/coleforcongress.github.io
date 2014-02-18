$(function() {

    /* Legacy contribution form redirect */
    if (window.location.hash === '#contribute') {
        window.location = '/contribute';
    }

    /* Email validation */
    $('input.zip').payment('restrictNumeric');

});

Array.prototype.move = function(from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};
