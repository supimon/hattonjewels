$(function(){
    // lookup table
    var lookupTable = {
                        sliderHeight: {xs:375, sm:375, md:463, lg:563},
                        sliderProdCount: {xs:2, sm:3, md:5, lg:5},
                        filteredProdInsertAfterElement: {xs:1, sm:2, md:3, lg:4},
                        productSliders: $('.products-slider-section').length ? resetSliders(true) : ''
                    },
        screenSize; // indicates current screenSize
    makeResponsiveAdjustments();
    $(window).on('resize', makeResponsiveAdjustments);
    // make responsive adjustments to page elements
    function makeResponsiveAdjustments(){
        getscreenSize();
        $('.slider-section').length ? adjustSliderHeight(): '';
        lookupTable.productSliders ? populateSliderProducts(null): '';
    }
    // utility function to get width of screen
    function getscreenSize(){
        switch($('p.container.copyrights').outerWidth()){
            case 1170: screenSize = "lg"; break;
            case 970: screenSize = "md"; break;
            case 750: screenSize = $("body").width() != 750 ? "sm": "xs"; break;
            default: screenSize = "xs"; break;
        }
    }
    // make home page slides responsive
    function adjustSliderHeight(){
        $('.slider-section .slide-div').width($('.slider-section').width()).height(lookupTable.sliderHeight[screenSize]);
    }
    // populate slides
    function populateSliderProducts(id){
        if(id == null) {
            if($('.products-slider-section .carousel-inner')) $('.products-slider-section .carousel-inner').empty();
            lookupTable.productSliders = resetSliders(false);
            $('.products-slider-section > div').each(function(i){
                getSingleSliderProd($(this).attr('id'), true);
            });
        }
        else getSingleSliderProd(id, false);
    }
    // utility function to initialise slider objects
    function resetSliders(firstTime){
        var tempObj = {};
        $('.products-slider-section > div').each(function(i){
            var that = this, thatID = $(that).attr('id');
            tempObj[thatID] = {currentSlide:1 , path: $(that).attr('data-productPath'), dataExists:[false]};
            firstTime ? $(this).on('slid.bs.carousel', function(){
                lookupTable.productSliders[thatID].currentSlide = $('#'+thatID+' .item.active').index() + 1;
                if(!lookupTable.productSliders[thatID].dataExists[lookupTable.productSliders[thatID].currentSlide])
                    getSingleSliderProd(thatID, false);
            }) : '';
        });
        return tempObj;
    }
    // utility function to get products for a single slider
    function getSingleSliderProd(id, reloaded){
        $.get(lookupTable.productSliders[id].path, function(data){
            // on initial load prepare total slides
            if(reloaded) {
                var totalSlides = $(data).find('totalProducts').text()/lookupTable.sliderProdCount[screenSize],
                    prodDiv = '';
                for(var j = 0; j < lookupTable.sliderProdCount[screenSize]; j++){
                    prodDiv += '<div class="col-md-2 col-sm-4 col-xs-6 text-center"><div class="product">'+
                        '<h3 class="prod-title"></h3><p class="prod-price"></p>' +
                        '</div></div>';
                }
                var active , holderDiv;
                for(var j = 0; j < totalSlides; j++){
                    active = j==0 ? 'active' : '';
                    holderDiv = '<div class="item '+ active +'"><div class="slide-div"><div class="row">'+ prodDiv +
                        '</div></div></div>';
                    $('#'+id+' .carousel-inner').append(holderDiv);
                }
                // set height and instantiate carousel on the next tick due to race condition
                setTimeout(function(){
                    adjustSliderHeight();
                    $('.carousel').carousel('pause');
                }, 0);
            }
            // prepare individual slide
            var prodArr = $(data).find('product'),
                prodDivArr = $($('#'+id+' .item')[lookupTable.productSliders[id].currentSlide-1])
                    .find('.product'),
                firstSlide = (lookupTable.productSliders[id].currentSlide-1) * lookupTable.sliderProdCount[screenSize];
            prodDivArr.each(function(i){
                    $(this).css({'background-image':"url('"+ $(prodArr[firstSlide+i]).attr("imgURL") +"')"})
                        .children(".prod-title").text($(prodArr[firstSlide+i]).text()).end()
                        .children(".prod-price").text($(prodArr[firstSlide+i]).attr("price"));
            });
            // to avoid redundant AJAX calls for products
            lookupTable.productSliders[id].dataExists[lookupTable.productSliders[id].currentSlide] = true;
        });
    }
    // sliders
    if($('.filter-section').length) {
        $("#cut-slider")
            .slider({id: "cutSlider", min: 0, max: 10, range: true, value: [0, 2], tooltip: "hide"});
        $("#polish-slider")
            .slider({id: "polishSlider", min: 0, max: 10, range: true, value: [0, 2], tooltip: "hide"});
        $("#symmetry-slider")
            .slider({id: "symmetrySlider", min: 0, max: 10, range: true, value: [0, 2], tooltip: "hide"});
        $("#caret-slider")
            .slider({id: "caretSlider", min: 0.10, max: 30.00, range: true, value: [4.50, 20.50], tooltip: "always"});
        $("#clarity-slider")
            .slider({id: "claritySlider", min: 0, max: 10, range: true, value: [0, 2], tooltip: "hide"});
        $("#color-slider")
            .slider({id: "colorSlider", min: 0, max: 11, range: true, value: [2, 5], tooltip: "hide"});
        $("#price-slider")
            .slider({id: "priceSlider", min: 200, max: 2500, range: true, value: [500, 1000], tooltip: "always"});
    }
    // handle filtered product details view
    $('.filtered-product-section .product').parent().on('click', function(){
        $('.filtered-product-details').remove();
        $('.filtered-product-section .product.active').removeClass('active');
        $(this).children().addClass('active');
        var i = (lookupTable.filteredProdInsertAfterElement[screenSize] -
            $(this).index()%lookupTable.filteredProdInsertAfterElement[screenSize]) +
            $(this).index(),
            elem = '<div class="col-xs-12 filtered-product-details">'+
                '<div><span class="close-prod-details">Close <i class="fa fa-times" aria-hidden="true"></i></span>' +
                '<div class="clearfix"></div></div>'+
                '<div class="col-sm-6 prod-gallery"></div>' +
                '<div class="col-sm-4 prod-details">' +
                    '<h2 class="prod-details-title">'+ $(this).children().children('.prod-title').text() +'</h2>' +
                    '<h3 class="prod-sub-title">'+ $(this).children().children('.sub-heading').text() +'</h3>' +
                    '<p class="prod-description">'+ $(this).children().children('.description').text() +'</p>' +
                '</div>' +
                '<div class="col-sm-2 price-select text-right">' +
                '<p class="price">'+ $(this).children().children('.prod-price').text() +'</p>' +
                '<a class="btn btn-default select-btn">Select</a>' +
                '</div>' +
                '</div>';
        $(".filtered-product-section .row > div:nth-child(" + (i) + ")").length ?
        $(".filtered-product-section .row > div:nth-child(" + (i) + ")").after(elem):
            $(".filtered-product-section .row > div:last-child").after(elem);
        $('.close-prod-details').on('click', function(){
            $('.filtered-product-section .product.active').removeClass('active');
            $('.filtered-product-details').remove();
        });
    });
});