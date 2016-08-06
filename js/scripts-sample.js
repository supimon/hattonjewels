var sliderResultObj = {}; // final config object for AJAX search
$(function(){
    var filterSectionHeight, // expanded filter section height reference
        // various markups for preparing the filters
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
        // a hypothetical config table for ease of configuration changes
        lookupTable = {
                        filterMarkups: {
                            "regular": fullValueFilterMarkup,
                            "min-max": minMaxFilterMarkup,
                            "radio-type": metalFilterMarkup,
                            "label-type": labelFilterMarkup,
                            "shape-filter": shapeFilterMarkup
                        },
                        // this object needs to be created from the backend. a sample is shown below
                        filterSliders: {
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
    // upon load, make responsive adjustments
    makeResponsiveAdjustments();
    // on further resize, make responsive adjustments
    $(window).on('resize', makeResponsiveAdjustments);
    // utility function to make responsive adjustments to page elements
    function makeResponsiveAdjustments(){
        if($('.filter-section').length){ 
            $('.filter-section').height('auto');
            filterSectionHeight = $('.filter-section').height();
        }
    }
    // filter sliders
    if($('.filter-section').length) {
        for (sliderKey in lookupTable.filterSliders) {
            if (lookupTable.filterSliders[sliderKey].type != "shape-filter") {
                $($('.slider-filters .row')
                    .append(lookupTable.filterMarkups[lookupTable.filterSliders[sliderKey].type])
                    .children()[$('.slider-filters .row').children().length - 1])
                    .children('.filter-title').text(lookupTable.filterSliders[sliderKey].label)
                    .end()
                    .children('.filter-holder').attr('id', lookupTable.filterSliders[sliderKey].obj.id + 'Input');
            } else {
                $($('.filter-holder')
                    .prepend(lookupTable.filterMarkups[lookupTable.filterSliders[sliderKey].type]).children()[0])
                    .children('h3').text(lookupTable.filterSliders[sliderKey].label)
                    .end()
                    .attr('id', lookupTable.filterSliders[sliderKey].obj.id + 'Input');
                lookupTable.filterSliders[sliderKey].obj.values.forEach(function (item, i) {
                    $('#' + lookupTable.filterSliders[sliderKey].obj.id + 'Input')
                        .append('<div class="single-filter" style="background-image: url(' + "'" + item.imgPath + "'" + ')">' +
                            '<i class="fa fa-check-circle" aria-hidden="true"></i><h4>' + item.name + '</h4>' +
                            '</div>');
                });
            }

            switch (lookupTable.filterSliders[sliderKey].type) {
                case "min-max":
                    $('#' + lookupTable.filterSliders[sliderKey].obj.id + 'Input').parent().find('.min-label')
                        .text(lookupTable.filterSliders[sliderKey].obj.min);
                    $('#' + lookupTable.filterSliders[sliderKey].obj.id + 'Input').parent().find('.max-label')
                        .text(lookupTable.filterSliders[sliderKey].obj.max);
                    break;
                case "radio-type":
                    lookupTable.filterSliders[sliderKey].obj.values.forEach(function (item, i) {
                        $('#' + lookupTable.filterSliders[sliderKey].obj.id + 'Input .list-inline')
                            .append('<li><span class="outer-circle ' + item.toString().toLowerCase() + '">' +
                                '<span class="inner-circle ' + item.toString().toLowerCase() + '"></span></span><br/>' +
                                item + '</li>');
                    });
                    break;
                case "label-type":
                    lookupTable.filterSliders[sliderKey].obj.values.forEach(function (item, i) {
                        $('#' + lookupTable.filterSliders[sliderKey].obj.id + 'Input .list-inline')
                            .append('<li>' + item + '</li>');
                    });
                    break;
            }
        }
        for (sliderKey in lookupTable.filterSliders) {
            if (lookupTable.filterSliders[sliderKey].type == "regular" ||
                lookupTable.filterSliders[sliderKey].type == "min-max")
                lookupTable.filterSliders[sliderKey].sliderObj =
                    $('#' + lookupTable.filterSliders[sliderKey].obj.id + 'Input')
                        .slider(lookupTable.filterSliders[sliderKey].obj);
        }
        filterSectionHeight = $('.filter-section').height(); // get filter holder height after the filters get initialised
        $('.filter-section .metal-filter, .filter-section .label-filter').each(function () {
            var $allItems = $(this).find('li');
            $allItems.on('click', function () {
                $allItems.removeClass('active');
                $(this).addClass('active');
            });
        });
        $('.filter-section .category-filters, .filter-section .shape-filters').each(function () {
            var $allItems = $(this).children('.single-filter');
            $allItems.on('click', function () {
                $allItems.removeClass('active');
                $(this).addClass('active');
            });
        });
        // set initial values for filters
        $($('.filter-section .metal-filter ul li')[0]).trigger('click');
        $($('.filter-section .label-filter ul li')[0]).trigger('click');
        $('.filter-section .shape-filters').each(function () {
            $($(this).find('.single-filter')[0]).trigger('click');
        });
        // handle filter search
        $('.reset-search-holder .search').on('click', function () {
            prepareFilterOptionsObj();
            // write the AJAX call here
        });
        // expand collapse filters
        $('.collapse-expand .btn').on('click', function () {
            var that = this;

            $('.filter-section').hasClass('expanded') ?
                $('.filter-section').animate({height: '0px'}, 500, function () {
                    $('.filter-section').removeClass('expanded');
                    $(that).children().removeClass('fa-angle-up').addClass('fa-angle-down');
                }) :
                $('.filter-section').animate({height: filterSectionHeight + 'px'}, 500, function () {
                    $('.filter-section').addClass('expanded');
                    $(that).children().removeClass('fa-angle-down').addClass('fa-angle-up');
                });
        });
    }
    // utility function for preparing the AJAX filter options object
    function prepareFilterOptionsObj(){
        for (sliderKey in lookupTable.filterSliders) {
            sliderResultObj[sliderKey] = [];
            if (lookupTable.filterSliders[sliderKey].type == "regular") {
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
            } else if (lookupTable.filterSliders[sliderKey].type == "radio-type" ||
                lookupTable.filterSliders[sliderKey].type == "label-type") {
                sliderResultObj[sliderKey].push(
                    lookupTable.filterSliders[sliderKey]
                        .obj.values[$('#' + lookupTable.filterSliders[sliderKey].obj.id + 'Input ul')
                        .children('.active').index()]);
            } else if (lookupTable.filterSliders[sliderKey].type == "shape-filter") {
                sliderResultObj[sliderKey]
                    .push($('#' + lookupTable.filterSliders[sliderKey].obj.id + 'Input .single-filter.active h4').text());
            } else {
                sliderResultObj[sliderKey] = lookupTable.filterSliders[sliderKey].sliderObj.slider('getValue');
            }
            console.log(sliderKey + " : " + sliderResultObj[sliderKey]);
        }
    }
});