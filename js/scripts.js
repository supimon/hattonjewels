$(function(){
    // lookup table
    var screenSize, // indicates current screenSize
        filterSectionHeight, // captures the expanded filter section height
        sliderResultObj = {}, // for AJAX search
        shapeFilterMarkup = '<div class="shape-filters text-center">' +
            '<h3></h3></div>',
        minMaxFilterMarkup = '<div class="col-sm-6 col-md-4 single-slider-filter">' +
            '<h3 class="filter-title"></h3>'+
            '<input class="filter-holder" id="" type="text"/>'+
            '<div class="twoTicks-slider-label-container">'+
            '<div class="min-label"></div>'+
            '<div class="max-label"></div>'+
            '</div></div>',
        fullValueFilterMarkup =  '<div class="col-sm-6 col-md-4 single-slider-filter">' +
            '<h3 class="filter-title"></h3>'+
            '<input class="filter-holder" id="" type="text"/>'+
            '</div>',
        labelFilterMarkup = '<div class="col-sm-6 col-md-4 single-slider-filter">'+
            '<h3 class="filter-title"></h3>'+
            '<div class="filter-holder label-filter" id="">'+
            '<ul class="list-inline"></ul>'+
            '</div></div>',
        metalFilterMarkup = '<div class="col-sm-6 col-md-4 single-slider-filter">'+
            '<h3 class="filter-title"></h3>'+
            '<div class="filter-holder metal-filter" id="">'+
            '<ul class="list-inline">'+
            '</ul>'+
            '</div></div>',
        lookupTable = {
                        sliderHeight: {xs:375, sm:375, md:463, lg:563},
                        sliderProdCount: {xs:2, sm:3, md:5, lg:5},
                        filteredProdInsertAfterElement: {xs:1, sm:2, md:3, lg:4},
                        productSliders: $('.products-slider-section').length ? resetSliders(true) : '',
                        filterMarkups: {
                            "regular": fullValueFilterMarkup,
                            "min-max": minMaxFilterMarkup,
                            "radio-type": metalFilterMarkup,
                            "label-type": labelFilterMarkup,
                            "shape-filter": shapeFilterMarkup
                        },
                        filterSliders: {
                            // slider name and id has to be unique
                            shapeFilter: {
                                obj: {
                                    id: "shapeFilter",
                                    values: [
                                        {name: "All", imgPath: "assets/unique-ring-category.png"},
                                        {name: "Brilliant", imgPath: "assets/unique-ring-category.png"},
                                        {name: "Asscher", imgPath: "assets/unique-ring-category.png"},
                                        {name: "Cushion", imgPath: "assets/unique-ring-category.png"},
                                        {name: "Oval", imgPath: "assets/unique-ring-category.png"},
                                        {name: "Emerald", imgPath: "assets/unique-ring-category.png"},
                                        {name: "Radiant", imgPath: "assets/unique-ring-category.png"},
                                        {name: "Pear", imgPath: "assets/unique-ring-category.png"},
                                        {name: "Marquise", imgPath: "assets/unique-ring-category.png"},
                                        {name: "Princess", imgPath: "assets/unique-ring-category.png"},
                                        {name: "Heart", imgPath: "assets/unique-ring-category.png"}
                                    ]
                                },
                                label: "Select a Shape",
                                type: "shape-filter",
                                sliderObj: ''
                            },
                            categoryFilter: {
                                obj: {
                                    id: "categoryFilter",
                                    values: [
                                        {name: "All", imgPath: "assets/unique-ring-category.png"},
                                        {name: "Solitaire", imgPath: "assets/unique-ring-category.png"},
                                        {name: "Pave", imgPath: "assets/unique-ring-category.png"},
                                        {name: "Channel Set", imgPath: "assets/unique-ring-category.png"},
                                        {name: "Side-Stone", imgPath: "assets/unique-ring-category.png"},
                                        {name: "Three-Stone", imgPath: "assets/unique-ring-category.png"},
                                        {name: "Tension", imgPath: "assets/unique-ring-category.png"},
                                        {name: "Halo", imgPath: "assets/unique-ring-category.png"},
                                        {name: "Vintage", imgPath: "assets/unique-ring-category.png"},
                                        {name: "Bridal Set", imgPath: "assets/unique-ring-category.png"},
                                        {name: "Unique", imgPath: "assets/unique-ring-category.png"}
                                    ]
                                },
                                label: "Select a Category",
                                type: "shape-filter",
                                sliderObj: ''
                            },
                            cutSlider: {
                                obj: {
                                    id: "cutSlider",
                                    min: 0, max: 4, range: true, value: [0, 4], step: 1,
                                    tooltip: "hide",
                                    ticks: [0, 1, 2, 3, 4],
                                    ticks_labels: ["Excellent", "Very Good", "Good", "Fair"]
                                },
                                label: "Cut",
                                type: "regular",
                                sliderObj: ''
                            },
                            polishSlider:{
                                obj: {
                                    id: "polishSlider",
                                    min: 0, max: 4, range: true, value: [0, 4], step: 1,
                                    tooltip: "hide",
                                    ticks: [0, 1, 2, 3, 4],
                                    ticks_labels: ["Excellent", "Very Good", "Good", "Fair"]
                                },
                                label: "Polish",
                                type: "regular",
                                sliderObj: ''
                            },
                            symmetrySlider:{
                                obj: {
                                    id: "symmetrySlider",
                                    min: 0, max: 4, range: true, value: [0, 4], step: 1,
                                    tooltip: "hide",
                                    ticks: [0, 1, 2, 3, 4],
                                    ticks_labels: ["Excellent", "Very Good", "Good", "Fair"]
                                },
                                label: "Symmetry",
                                type: "regular",
                                sliderObj: ''
                            },
                            caretSlider: {
                                obj: {
                                    id: "caretSlider",
                                    min: 0.10, max: 30.00, range: true, value: [0.10, 30.00], step: 0.1,
                                    tooltip: "always"
                                },
                                label: "Caret",
                                type: "min-max",
                                sliderObj: ''
                            },
                            claritySlider: {
                                obj: {
                                    id: "claritySlider",
                                    min: 0, max: 10, range: true, value: [0, 10], step: 1,
                                    tooltip: "hide",
                                    ticks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                                    ticks_labels: ["D", "E", "F", "G", "H", "I", "J", "K", "L", "M"]
                                },
                                label: "Clarity",
                                type: "regular",
                                sliderObj: ''
                            },
                            colorSlider: {
                                obj: {
                                    id: "colorSlider", min: 0, max: 9, range: true, value: [0, 9], step: 1,
                                    tooltip: "hide",
                                    ticks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                                    ticks_labels: ["IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "SI3", "I1"]
                                },
                                label: "Color",
                                type: "regular",
                                sliderObj: ''
                            },
                            priceSlider: {
                                obj: {
                                    id: "priceSlider",
                                    min: 200, max: 2500, range: true, value: [200, 2500], step: 1,
                                    tooltip: "always"
                                },
                                label: "Price",
                                type: "min-max",
                                sliderObj: ''
                            },
                            metalFilter: {
                                obj: {
                                    id: "metalFilter",
                                    values: ["Yellow", "Rose", "Platinum", "White"]
                                },
                                label: "Select a Metal",
                                type: "radio-type",
                                sliderObj: ''
                            },
                            certificateFilter: {
                                obj: {
                                    id: "certificateFilter",
                                    values: ["Any", "GIA", "HRD", "IGI", "Other", "None"]
                                },
                                label: "Certificate",
                                type: "label-type",
                                sliderObj: ''
                            }
                        }
                     };

    makeResponsiveAdjustments();
    $(window).on('resize', makeResponsiveAdjustments);
    // make responsive adjustments to page elements
    function makeResponsiveAdjustments(){
        getscreenSize();
        $('.slider-section').length ? adjustSliderHeight(): '';
        lookupTable.productSliders ? populateSliderProducts(null): '';
        $('.filter-section').height('auto');
        filterSectionHeight = $('.filter-section').height();
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
    // filter sliders
    for(sliderKey in lookupTable.filterSliders){
        if(lookupTable.filterSliders[sliderKey].type != "shape-filter"){
            $($('.slider-filters .row')
                .append(lookupTable.filterMarkups[lookupTable.filterSliders[sliderKey].type])
                .children()[$('.slider-filters .row').children().length-1])
                .children('.filter-title').text(lookupTable.filterSliders[sliderKey].label)
                .end()
                .children('.filter-holder').attr('id', lookupTable.filterSliders[sliderKey].obj.id+'Input');
        }else{
            $($('.filter-holder')
                .prepend(lookupTable.filterMarkups[lookupTable.filterSliders[sliderKey].type]).children()[0])
                .children('h3').text(lookupTable.filterSliders[sliderKey].label)
                .end()
                .attr('id', lookupTable.filterSliders[sliderKey].obj.id+'Input');
            lookupTable.filterSliders[sliderKey].obj.values.forEach(function(item, i){
                $('#'+lookupTable.filterSliders[sliderKey].obj.id+'Input')
                    .append('<div class="single-filter" style="background-image: url('+ "'" + item.imgPath+ "'" +')">'+
                            '<i class="fa fa-check-circle" aria-hidden="true"></i><h4>'+ item.name +'</h4>'+
                            '</div>');
            });
        }

        switch(lookupTable.filterSliders[sliderKey].type){
            case "min-max":
                $('#'+lookupTable.filterSliders[sliderKey].obj.id+'Input').parent().find('.min-label')
                    .text(lookupTable.filterSliders[sliderKey].obj.min);
                $('#'+lookupTable.filterSliders[sliderKey].obj.id+'Input').parent().find('.max-label')
                    .text(lookupTable.filterSliders[sliderKey].obj.max);
                break;
            case "radio-type":
                lookupTable.filterSliders[sliderKey].obj.values.forEach(function(item, i){
                    $('#'+lookupTable.filterSliders[sliderKey].obj.id+'Input .list-inline')
                        .append('<li><span class="outer-circle '+ item.toString().toLowerCase() +'">' +
                            '<span class="inner-circle '+ item.toString().toLowerCase() +'"></span></span><br/>' +
                            item+'</li>');
                });
                break;
            case "label-type":
                lookupTable.filterSliders[sliderKey].obj.values.forEach(function(item, i){
                    $('#'+lookupTable.filterSliders[sliderKey].obj.id+'Input .list-inline')
                        .append('<li>'+item+'</li>');
                });
                break;
        }
    }
    for(sliderKey in lookupTable.filterSliders){
        if(lookupTable.filterSliders[sliderKey].type == "regular" ||
            lookupTable.filterSliders[sliderKey].type == "min-max")
            lookupTable.filterSliders[sliderKey].sliderObj =
                $('#'+lookupTable.filterSliders[sliderKey].obj.id+'Input')
                    .slider(lookupTable.filterSliders[sliderKey].obj);
    }
    filterSectionHeight = $('.filter-section').height(); // get filter holder height after the filters get initialised
    $('.filter-section .metal-filter, .filter-section .label-filter').each(function(){
        var $allItems = $(this).find('li');
        $allItems.on('click', function(){
            $allItems.removeClass('active');
            $(this).addClass('active');
        });
    });
    $('.filter-section .category-filters, .filter-section .shape-filters').each(function(){
        var $allItems = $(this).children('.single-filter');
        $allItems.on('click', function(){
            $allItems.removeClass('active');
            $(this).addClass('active');
        });
    });
    // set initial values for filters
    $($('.filter-section .metal-filter ul li')[0]).trigger('click');
    $($('.filter-section .label-filter ul li')[0]).trigger('click');
    $('.filter-section .shape-filters').each(function(){
        $($(this).find('.single-filter')[0]).trigger('click');
    });
    // handle filter search
    $('.reset-search-holder .search').on('click', function(){
        for(sliderKey in lookupTable.filterSliders) {
            sliderResultObj[sliderKey] = [];
            if(lookupTable.filterSliders[sliderKey].type == "regular"){
                var lowerLimit = lookupTable.filterSliders[sliderKey].sliderObj.slider('getValue')[0],
                    upperLimit = lookupTable.filterSliders[sliderKey].sliderObj.slider('getValue')[1];
                if ((upperLimit - lowerLimit) == 0) {
                    sliderResultObj[sliderKey].push(lookupTable.filterSliders[sliderKey]
                        .obj.ticks_labels[lookupTable.filterSliders[sliderKey].sliderObj.slider('getValue')[1] - 1]);
                } else {
                    for (var k = lowerLimit; k < upperLimit; k++) {
                        sliderResultObj[sliderKey].push(lookupTable.filterSliders[sliderKey].obj.ticks_labels[k]);
                    }
                }
            }else if(lookupTable.filterSliders[sliderKey].type == "radio-type" ||
                lookupTable.filterSliders[sliderKey].type == "label-type"){
                sliderResultObj[sliderKey].push(
                    lookupTable.filterSliders[sliderKey]
                        .obj.values[$('#'+lookupTable.filterSliders[sliderKey].obj.id+'Input ul')
                        .children('.active').index()]);
            }else if(lookupTable.filterSliders[sliderKey].type == "shape-filter"){
                sliderResultObj[sliderKey]
                    .push($('#'+lookupTable.filterSliders[sliderKey].obj.id+'Input .single-filter.active h4').text());
            }else{
                sliderResultObj[sliderKey] = lookupTable.filterSliders[sliderKey].sliderObj.slider('getValue');
            }
            // write the AJAX call here
            console.log(sliderKey + " : " + sliderResultObj[sliderKey]);
        }
    });
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
    // expand collapse filters
    $('.collapse-expand .btn').on('click', function(){
        var that = this;

        $('.filter-section').hasClass('expanded') ?
            $('.filter-section').animate({height: '0px'}, 500, function(){
                $('.filter-section').removeClass('expanded');
                $(that).children().removeClass('fa-angle-up').addClass('fa-angle-down');
            }) :
            $('.filter-section').animate({height: filterSectionHeight+'px'}, 500, function(){
                $('.filter-section').addClass('expanded');
                $(that).children().removeClass('fa-angle-down').addClass('fa-angle-up');
            });
    });
});