// Hamburger Navigation Toggle
$(document).ready(function() {
    var hamburgerBtn = $('#hamburgerBtn');
    var navMenu = $('#navMenu');

    hamburgerBtn.on('click', function(e) {
        e.stopPropagation();
        $(this).toggleClass('active');
        navMenu.toggleClass('open');
    });

    // Close menu when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.hamburger-nav').length) {
            hamburgerBtn.removeClass('active');
            navMenu.removeClass('open');
        }
    });

    // Close menu when clicking a link
    navMenu.find('a').on('click', function() {
        hamburgerBtn.removeClass('active');
        navMenu.removeClass('open');
    });
});
