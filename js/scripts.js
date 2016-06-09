$(function(){
    // make slides responsive
    var sliderHeight;
    setSlideHeight();
    $(window).on('resize', setSlideHeight);
    // utility function to set height of carousal
    function setSlideHeight(){
        switch($('p.container.copyrights').outerWidth()){
            case 1170: sliderHeight = 563; break;
            case 970: sliderHeight = 463; break;
            case 750: default: sliderHeight = 375; break;
        }
        $('.slide-div').width($('.slider-section').width()).height(sliderHeight);
    }
});