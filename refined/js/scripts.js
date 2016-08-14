$(function(){
    var screenSize, // indicates current screenSize
        lastUpdatedBlogCol = 0, // to evenly distribute blog items in columns
        blogItemsArr = [], // total blog items(containers) on the page
        // a hypothetical config table for ease of configuration changes
        lookupTable = {
            sliderHeight: {xs: 375, sm: 375, md: 463, lg: 563}, // product sliders height configurations
            sliderProdCount: {xs: 2, sm: 3, md: 5, lg: 5}, // product count within the sliders
            filteredProdInsertAfterElement: {xs: 1, sm: 2, md: 3, lg: 4}, // position to insert the details view
            filteredProductsPerPage: 12,
            selectedSettingID: '',
            productSliders: $('.products-slider-section').length ? resetSliders(true) : '',
            filteredProducts: {path: 'xml/products-sample.xml/'}
        }
    // upon load, make responsive adjustments
    makeResponsiveAdjustments();
    // on further resize, make responsive adjustments
    $(window).on('resize', makeResponsiveAdjustments);
    // utility function to make responsive adjustments to page elements
    function makeResponsiveAdjustments(){
        getscreenSize();
        $('.slider-section').length ? adjustSliderHeight(): '';
        lookupTable.productSliders ? populateSliderProducts(null): '';
        if($('.col-filtered-blog-section').length) prepareBlogCols(true);
        if($('.contact-content-section').length)
            $('.contact-content-section .book').height($('.contact-content-section .bg-img').height());
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
    // quick details, pagination, filtered products population, settings continue action
    if($('.filtered-product-section').length){
        // quick details overlay on each product
        $('.filtered-product-section .row').on('mouseover', function(e){
                if($(e.target).hasClass('product')||$($(e.target).parents()).hasClass('product')) {
                    var $prodDiv;
                    if ($(e.target).hasClass('product')) $prodDiv = $(e.target);
                    else if ($($(e.target).parents()).hasClass('product')) $prodDiv = $($(e.target).parents('product'));
                    if(!$prodDiv.hasClass('active')) $prodDiv.children('p.overlay-p').show();
                }
            })
            .on('mouseout click', function(e){
                if($(e.target).hasClass('product')||$($(e.target).parents()).hasClass('product')) {
                    var $prodDiv;
                    if ($(e.target).hasClass('product')) $prodDiv = $(e.target);
                    else if ($($(e.target).parents()).hasClass('product')) $prodDiv = $($(e.target).parents('product'));
                    $prodDiv.children('p.overlay-p').hide();
                }
            });
        // AJAX call to populate the filtered products after initial page load
        $.post(lookupTable.filteredProducts.path, sliderResultObj, function( data ) {
            var remainder = $(data).find('totalProducts').text() % lookupTable.filteredProductsPerPage,
                pages = parseInt($(data).find('totalProducts').text()/lookupTable.filteredProductsPerPage),
                totalPages = remainder == 0 ? pages : pages + 1;
            // populate page numbers
            for(var k = 0; k <= totalPages+1; k++){
                k == 0 ? $('.filtered-product-section .pagination')
                    .append('<li><a href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>')
                    : k == (totalPages+1) ? $('.filtered-product-section .pagination')
                    .append('<li><a href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>') :
                    $('.filtered-product-section .pagination').append('<li><a href="#">'+ k +'</a></li>');
            }
            populateFilteredProducts(data);
            // subsequent AJAX filtered products population based on pagination
            $('.filtered-product-section .pagination li a').on('click', function(e){
                e.preventDefault();
                var pageNum = $(this).text();
                prepareFilterOptionsObj();
                $.post(lookupTable.filteredProducts.path, sliderResultObj, function( data ) {
                    $('.filtered-product-section .row').empty();
                    populateFilteredProducts(data);
                    bindProductEvents();
                });
            });
            bindProductEvents();
        });
        // byo settings continue action
        $('.filtered-product-section.byo .settings-continue').on('click', function(e){
            // grab the lookuptable.selectedSettingID and submit the data to new page
        });
    }
    // utility function to populate the filtered products
    function populateFilteredProducts(data){
        var filteredProdArr = $(data).find('product');
        filteredProdArr.each(function(i){
            if(i < 12){
                var temp = '<div class="col-lg-3 col-md-4 col-sm-6 text-center">' +
                    '<div class="product" id="'+ $(filteredProdArr[i]).children('id').text() +'">' +
                    '<h3 class="prod-title">'+ $(filteredProdArr[i]).children('name').text() +'</h3>' +
                    '<p class="prod-price">'+ $(filteredProdArr[i]).children('price').text() +'</p>' +
                    '<h4 class="sub-heading">'+ $(filteredProdArr[i]).children('subheading').text() +'</h4>' +
                    '<p class="description">'+ $(filteredProdArr[i]).children('description').text() +'</p>' +
                    '<img class="prod-thumbnail main" src="'+
                    $($(filteredProdArr[i]).children('imgURL')[0]).text() +'" />' +
                    '<img class="prod-thumbnail" src="'+
                    $($(filteredProdArr[i]).children('imgURL')[1]).text() +'" />' +
                    '<img class="prod-thumbnail" src="'+
                    $($(filteredProdArr[i]).children('imgURL')[2]).text() +'" />' +
                    '<img class="prod-thumbnail" src="'+
                    $($(filteredProdArr[i]).children('imgURL')[3]).text() +'" />' +
                    '<p class="overlay-p">Quick View</p>' +
                    '</div></div>';
                $('.filtered-product-section .row').append(temp);
            }
        });
    }
    // bind events to newly populated filtered products to show the details view
    function bindProductEvents(){
        // handle filtered product details view
        $('.filtered-product-section .product').parent().on('click', function(e) {
            if($(e.target).hasClass('product')||$($(e.target).parents()).hasClass('product')){
                // clear any previously selected setting
                lookupTable.selectedSettingID = '';
                $('.filtered-product-section .settings-continue').attr('disabled', true).addClass('disabled');
                // clear any previously selected product
                $('.filtered-product-details').remove();
                $('.filtered-product-section .product.active').removeClass('active');
                $(this).children().addClass('active');
                // get the position to insert the details view on each screen
                var i = (lookupTable.filteredProdInsertAfterElement[screenSize] -
                        $(this).index() % lookupTable.filteredProdInsertAfterElement[screenSize]) +
                        $(this).index(),
                    // prepare the details view markup
                    temp = $(this).parents().hasClass('byo') ?
                            '<a class="btn btn-default select-btn">Select</a>' :
                            '<a class="btn btn-default cart-btn">Add to Cart</a>' +
                            '<a class="btn btn-default view-btn">View Details</a>',
                    elem = '<div class="col-xs-12 filtered-product-details">' +
                            '<div><span class="close-prod-details">Close ' +
                            '<i class="fa fa-times" aria-hidden="true"></i></span>' +
                            '<div class="clearfix"></div></div>' +
                            '<div class="col-sm-6 prod-gallery"></div>' +
                            '<div class="col-sm-4 prod-details">' +
                            '<h2 class="prod-details-title">' +
                            $(this).children().children('.prod-title').text() + '</h2>' +
                            '<h3 class="prod-sub-title">' +
                            $(this).children().children('.sub-heading').text() + '</h3>' +
                            '<p class="prod-description">' +
                            $(this).children().children('.description').text() + '</p>' +
                            '</div>' +
                            '<div class="col-sm-2 price-select text-right">' +
                            '<p class="price">' + $(this).children().children('.prod-price').text() + '</p>' + temp +
                            '</div></div>';
                // insert details view
                $(".filtered-product-section .row > div:nth-child(" + (i) + ")").length ?
                    $(".filtered-product-section .row > div:nth-child(" + (i) + ")").after(elem) :
                    $(".filtered-product-section .row > div:last-child").after(elem);
                // close details view
                $('.close-prod-details').on('click', function () {
                    $('.filtered-product-section .product.active').removeClass('active');
                    $('.filtered-product-details').remove();
                    // reset the selected setting
                    lookupTable.selectedSettingID = '';
                    $('.filtered-product-section .settings-continue').attr('disabled', true).addClass('disabled');
                });
                // select a setting
                $('.filtered-product-details .select-btn').on('click', function () {
                    lookupTable.selectedSettingID = $(".filtered-product-section .row .product.active").attr('id');
                    $('.filtered-product-section .settings-continue').attr('disabled', false).removeClass('disabled');
                });
            }
        });
    }
    // handle file upload
    if($('#fileUploadZone').length){
        var myDropzone = new Dropzone("form#fileUploadZone", {
        url: "/file/post",
        clickable: "#clickable-area",
        maxFilesize: 10,
        autoProcessQueue: false,
        addRemoveLinks: true,
        previewsContainer: ".previews-container",
        thumbnailWidth: 80,
        thumbnailHeight: 80
    });
    }
    // handle select tag substitutes
    if($('form .select-replace').length){
        $('form .select-replace ul.dropdown-menu li').on('click', function(){
            var text = $(this).text();
            $(this).parents('.select-replace').children('.btn-main').text(text);
            $('#'+$(this).parent().attr('data-id')).value = text;
        });
    }
    // handle blog items display
    if($('.col-filtered-blog-section').length){
        $('.hidden-blog-items-holder .single-blog').each(function(){ blogItemsArr.push($(this)); });
        prepareBlogCols(true);
    }
    // utility function to help populate blog items
    function arrangeBlogItems(blogItems){
        var noOfCols = lookupTable.filteredProdInsertAfterElement[screenSize];
        for(var i = 0; i < blogItems.length; i++){
            $($('.col-filtered-blog-holder .row > div')[lastUpdatedBlogCol]).append(blogItems[i]);
            lastUpdatedBlogCol = ((lastUpdatedBlogCol + 1) > (noOfCols - 1)) ? 0 : lastUpdatedBlogCol + 1 ;
        }
    }
    // utility function to prepare blog item columns for various screen sizes
    function prepareBlogCols(clearAll){
        if(clearAll){
            $('.col-filtered-blog-holder .single-blog').appendTo($('.hidden-blog-items-holder'));
            $('.copyrights').after($('.tweet-box'));
            $('.col-filtered-blog-holder .row').empty();
        }
        var noOfCols = lookupTable.filteredProdInsertAfterElement[screenSize];
        for(var i = 0; i < noOfCols; i++){
            $('.col-filtered-blog-holder .row').append($('<div class="col-sm-6 col-md-4 col-lg-3">'));
        }
        $($('.col-filtered-blog-holder .row > div')[$('.col-filtered-blog-holder .row > div').length - 1])
            .append($('.tweet-box'));
        arrangeBlogItems(blogItemsArr);
    }
    // equal height for columns in contact page
    if($('.contact-content-section').length) {
        $('.contact-content-section .book').height($('.contact-content-section .bg-img').height());
    }
});