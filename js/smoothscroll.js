$(document).ready(function () {

    var scrollLink = $('.scrolling');

    // Smooth scrolling
    scrollLink.click(function (e) {
        e.preventDefault();
        $('body,html').animate({
            scrollTop: $(this.hash).offset().top
        }, 200);
    });
})