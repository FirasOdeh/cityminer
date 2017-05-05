var mymap = L.map('mainmap').setView([45.754, 4.842], 13);
//var mymap = L.map('mainmap').setView([43.296353, 5.370505], 13);

//var mymap = L.map('mainmap').setView([51.505, -0.09], 13);

attribution = mymap.attributionControl;

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    id: 'mapbox.streets'
}).addTo(mymap);
attribution.setPrefix('CityMiner Project © 2017');



var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(mymap);
}



// Global variable for city areas data
var city_data = {};
var city_data2 = {};

//mymap.on('click', onMapClick);

jQuery(document).ready(function($){
    $('.modal').modal();


    $('#toggle_options').click(function(){
        $('.left_option_panel').toggleClass('left_closed');
        $('.option_panel').toggleClass('closed_option_panel');
        if($('.option_panel').hasClass('closed_option_panel')){
            $('.left_option_panel').addClass('left_closed');
        }
    });


    var win_h = $(window).height();
    var nav_h = $('#site_nav').height();
    var options_h = $('#site_options').height();
    var map_h = win_h - nav_h - options_h;
    $('#mainmap').css('height', map_h);


    var map2 = L.map('map2').setView([45.754, 4.842], 13);
    var origin_city = null;
    window.destination_city = null;
    $('#similarity_value').change(function(){
        var similarity_value = $(this).val();
        clearMap2(map2);
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            id: 'mapbox.streets'
        }).addTo(map2);
        if(origin_city){
            $.each(origin_city.patterns, function (k, z) {
                if(similarity_check(destination_city.characteristic.positiveAttributes, z.characteristic.positiveAttributes, similarity_value)){
                    var zone = new L.LayerGroup();
                    var zone_color = "#34bf49";
                    L.geoJson(z['zone'], {
                        color: zone_color,
                        fillColor: zone_color,
                        weight: 1,
                        fillOpacity: 0.3
                    }).addTo(map2);
                }
            });
        }else{
            Materialize.toast('Please select a City!', 4000);
        }
    });
    $('#s_city').change(function(){

        map2.invalidateSize();
        attribution = map2.attributionControl;
        attribution.setPrefix('CityMiner Project © 2017');
        clearMap2(map2);

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            id: 'mapbox.streets'
        }).addTo(map2);
        var similarity_value = $('#similarity_value').val();
        $.ajax({
            url: "controller/areas",
            data: {
                "city": $('#s_city').val(),
                "algo": $('#algo').val(),
                "sigma": $('#sigma').val(),
                "delta": $('#delta').val(),
                "time": $('#time').val(),
                "mincov": $('#mincov').val(),
            },
            cache: false,
            type: "GET",
            success: function (response) {
                city_data2 = {};
                var g_lat = 0;
                var g_lng = 0;
                var num = 0;
                $.each(response, function (key, value) {
                    city_data2[value.id] = value.geo;
                    $.each(value.geo, function (key1, point) {
                        var p = [];
                        g_lat += point.lat;
                        g_lng += point.lng;
                        num++;
                    });
                });
                g_lat = g_lat / num;
                g_lng = g_lng / num;
                map2.setView([g_lat, g_lng], 11.5);
            },
            error: function (xhr) {

            }
        });
        $.ajax({
            url: "controller/execute",
            data: {
                "city": $('#s_city').val(),
                "algo": $('#algo').val(),
                "sigma": $('#sigma').val(),
                "delta": $('#delta').val(),
                "time": $('#time').val(),
                "mincov": $('#mincov').val(),
            },
            cache: false,
            type: "GET",
            success: function (response) {
                var result_patterns = response.patterns;
                $.each(result_patterns, function (key, value) {
                    var poly;
                    var zone = new L.LayerGroup();
                    $.each(value.subgraph, function (k, area) {

                        var points = [];
                        $.each(city_data2[area], function (key1, point) {
                            var p = [];
                            p.push(point.lat);
                            p.push(point.lng);
                            points.push(p);
                        });
                        poly = L.polygon(points).addTo(zone);
                    });
                    value['zone'] = unify(zone.getLayers());

                });
                origin_city = response;
                $('#similarity_value').change();
            },
            error: function (xhr) {
                console.log("erre");
            }
        });
    });
    $('#city').change(function(){
        if($('#city').val()) {
            clearMap();
            L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
                maxZoom: 18,
                id: 'mapbox.streets'
            }).addTo(mymap);
            $('.left_option_panel').addClass('left_closed');
            $('.option_panel').addClass('closed_option_panel');
            $.ajax({
                url: "controller/areas",
                data: {
                    "city": $('#city').val(),
                    "algo": $('#algo').val(),
                    "sigma": $('#sigma').val(),
                    "delta": $('#delta').val(),
                    "time": $('#time').val(),
                    "mincov": $('#mincov').val(),
                },
                cache: false,
                type: "GET",
                success: function (response) {
                    city_data = {};
                    var g_lat = 0;
                    var g_lng = 0;
                    var num = 0;
                    $.each(response, function (key, value) {
                        var points = [];
                        city_data[value.id] = value.geo;
                        $.each(value.geo, function (key1, point) {
                            var p = [];
                            p.push(point.lat);
                            p.push(point.lng);
                            g_lat += point.lat;
                            g_lng += point.lng;
                            num++;
                            points.push(p);
                        });
                        L.polygon(points, {
                            color: '#00ad45',
                            fillColor: '#34bf49',
                            weight: 2,
                            fillOpacity: 0.3
                        }).on('click', onMapClick).addTo(mymap);
                    });
                    g_lat = g_lat / num;
                    g_lng = g_lng / num;
                    mymap.setView([g_lat, g_lng], 11.5);
                    $('.toggle_div').addClass('toggle_div_closed');
                },
                error: function (xhr) {

                }
            });
        }else{
            Materialize.toast('Please select a City!', 4000); // 4000 is the duration of the toast
        }
    });



});

var ctx = document.getElementById("canvas").getContext("2d");
$('button#submitButton').click( function() {

    if($('#city').val()) {
        $('#map_loading').show();
        clearMap();
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            id: 'mapbox.streets'
        }).addTo(mymap);
        //$('.option_panel').css('right','-365px');
        $('.option_panel').addClass('closed_option_panel');

        var att_arr = {};
        $.ajax({
            url: "controller/execute",
            data: {
                "city": $('#city').val(),
                "algo": $('#algo').val(),
                "sigma": $('#sigma').val(),
                "delta": $('#delta').val(),
                "time": $('#time').val(),
                "mincov": $('#mincov').val()
            },
            cache: false,
            type: "GET",
            success: function (response) {
                var result_patterns = response.patterns;
                $.each(result_patterns, function (key, value) {
                    var poly;
                    var zone = new L.LayerGroup();
                    $.each(value.subgraph, function (k, area) {
                        var points = [];
                        $.each(city_data[area], function (key1, point) {
                            var p = [];
                            p.push(point.lat);
                            p.push(point.lng);
                            points.push(p);
                        });
                        poly = L.polygon(points).addTo(zone);

                        //poly.addTo(temp_zone);
                    });
                    $.each(value.characteristic.positiveAttributes, function (k, att) {
                        if(att_arr[att]){
                            att_arr[att]++;
                        }else{
                            att_arr[att] = 1;
                        }
                    });
                    value['zone'] = unify(zone.getLayers());

                });

                // Sort the attributes by occurrence
                var att_arr2= [];
                $.each(att_arr, function (key, value) {
                    att_arr2.push({name: key, val: att_arr[key]});
                });
                var res = att_arr2.sort(function(a, b) {
                    return parseFloat(b.val) - parseFloat(a.val);
                });

                $('.toggle_div').removeClass('toggle_div_closed');
                // Create Attributes sidebar list
                $('#and_Attributes_form, #or_Attributes_form').html('');
                $.each(res, function (key, value) {
                    $('#and_Attributes_form').append('<p class="checkbox">'+
                        '<input type="checkbox" name="'+value.name+'" id="and_'+value.name+'" />'+
                        '<label for="and_'+value.name+'">'+value.name+' ('+value.val+')</label>'+
                        '</p>');
                    $('#or_Attributes_form').append('<p>'+
                        '<input type="checkbox" name="'+value.name+'" id="or_'+value.name+'" />'+
                        '<label for="or_'+value.name+'">'+value.name+' ('+value.val+')</label>'+
                        '</p>');
                });
                $('#map_loading').hide();
                //$('.option_panel').css('right','13px');
                $('.option_panel').removeClass('closed_option_panel');


                $('#and_Attributes_form input').change(function() {
                    var pAttributes = [];
                    $.each($('#and_Attributes_form').serializeArray(), function (i, field) {
                        pAttributes.push(field.name);
                    });
                    //$('.left_option_panel').css('left','13px');
                    $('.left_option_panel').removeClass('left_closed');
                    $('.toggle_div').removeClass('toggle_div_closed');

                    setTimeout(function() {
                        clearMap();
                        var rand_color = getRandomColor();
                        var sorted_patterns = result_patterns.sort(function(a, b) {
                            return parseFloat(b.characteristic.score) - parseFloat(a.characteristic.score);
                        });
                        if(pAttributes.length>0){

                            $('#zones_table_body').html('');
                            var num = 0;
                            var zones_group = [];
                            //console.log(sorted_patterns);
                            $.each(sorted_patterns, function (key, value) {
                                //if(!eq_arrays(pAttributes,value.characteristic.positiveAttributes)){return true;}
                                if(!pAttributes.containsAll(value.characteristic.positiveAttributes)){return true;}
                                // $('#zones_form').append('<p class="checkbox tooltipped"  data-position="bottom" data-tooltip="'+value.characteristic.score+'">'+
                                //     '<div>'+
                                //     '<input type="checkbox" name="'+value.subgraph+'" id="zone_'+value.subgraph+'" />'+
                                //     '<label for="zone_'+value.subgraph+'">asd'+value.characteristic.positiveAttributes+'</label>'+
                                //     '</div>'+
                                //     '<div>'+
                                //     '<input type="checkbox" name="'+value.subgraph+'" id="zone_'+value.subgraph+'" />'+
                                //     '<label for="zone_'+value.subgraph+'">'+value.characteristic.positiveAttributes+'</label>'+
                                //     '</div>'+
                                //     '</p>');
                                $('#zones_table_body').append('<tr class="tooltipped" data-position="right" data-tooltip="Score = '+value.characteristic.score+'">'+
                                    '<p class="checkbox">'+
                                    '<td><input type="checkbox" name="'+value.subgraph+'" id="zone_'+value.subgraph+'" /><label class="input_check" for="zone_'+value.subgraph+'"></label></td>'+
                                    '<td><label for="zone_'+value.subgraph+'">'+value.characteristic.positiveAttributes+'</label></td>'+
                                    '<td><label for="zone_'+value.subgraph+'">'+value.characteristic.negativeAttributes+'</label></td></p></tr>');
                                document.getElementById("check_all").checked = false;
                                if(num==0) {
                                    zones_group = zones_group.concat(value.subgraph);
                                }
                                if(num==0||cover_check(zones_group, value.subgraph)) {
                                    zones_group = zones_group.concat(value.subgraph);
                                    var zone = new L.LayerGroup();
                                    var zone_color = get_zone_color(value.characteristic.score);
                                    L.geoJson(value['zone'], {
                                        color: zone_color,
                                        fillColor: zone_color,
                                        weight: 1,
                                        fillOpacity: 0.3
                                    }).on('click', function (e) {
                                        $('#stats_content').html("Positive Attributes for this Zone: " + value.characteristic.positiveAttributes);
                                        $('#modal1').modal('open');
                                        window.destination_city = value;
                                        console.log(destination_city);
                                        console.log("asdasdsadsadsadasd");
                                        $('#modal_tabs').tabs('select_tab', 'stats');
                                        if(window.myBar){
                                            window.myBar = window.myBar.clear();
                                            window.myBar.destroy();
                                        }
                                        $.ajax({
                                            url: "controller/statistics",
                                            data: {
                                                "city": $('#city').val(),
                                                "zone": value.subgraph,
                                            },
                                            cache: false,
                                            type: "GET",
                                            success: function (response) {
                                                var labels = [];
                                                var attrs_vals = [];
                                                var sum_vals = [];
                                                var total_zone = 0;
                                                var total_sum = 0;
                                                $.each(response.attributes, function (k, v) {
                                                    total_zone+=v;
                                                });
                                                $.each(response.sums, function (k, v) {
                                                    total_sum+=v;
                                                });
                                                $.each(response.attributes, function (k, v) {
                                                    labels.push(k);
                                                    attrs_vals.push(v/total_zone);
                                                });
                                                $.each(response.sums, function (k, v) {
                                                    sum_vals.push(v/total_sum);
                                                });

                                                var color = Chart.helpers.color;
                                                var barChartData = {
                                                    labels: labels,
                                                    datasets: [{
                                                        label: 'Zone',
                                                        backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
                                                        borderColor: window.chartColors.red,
                                                        borderWidth: 1,
                                                        data: attrs_vals
                                                    }, {
                                                        label: 'City',
                                                        backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
                                                        borderColor: window.chartColors.blue,
                                                        borderWidth: 1,
                                                        data: sum_vals
                                                    }]

                                                };

                                                window.myBar = new Chart(ctx, {
                                                    type: 'bar',
                                                    data: barChartData,
                                                    options: {
                                                        responsive: true,
                                                        legend: {
                                                            position: 'top',
                                                        },
                                                        title: {
                                                            display: true,
                                                            text: 'Zone Attributes Statistics'
                                                        }
                                                    }
                                                });
                                            },
                                            error: function (xhr) {
                                                console.log(xhr);
                                            }
                                        });
                                    }).addTo(mymap);
                                    num++;
                                }
                            });
                        }
                        $('.tooltipped').tooltip({delay: 100});
                        $('#check_all').change(function() {
                            var x = document.getElementById("check_all").checked;
                            if(x){
                                $('#zones_form input').each(function() {
                                    this.checked = true;
                                });
                            }else{
                                $('#zones_form input').each(function() {
                                    this.checked = false;
                                });
                            }
                        });
                        $('#zones_form input').change(function() {
                            var pAttributes2 = [];
                            $.each($('#zones_form ').serializeArray(), function (i, field) {
                                if(field.name!='check_all'){
                                    pAttributes2.push(field.name);
                                }
                            });
                            console.log(pAttributes2);
                            clearMap();
                            var rand_color = getRandomColor();
                            var zone = new L.LayerGroup();
                            $.each(pAttributes2, function (i,ch) {
                                $.each(sorted_patterns , function (key, value) {
                                    if(ch==value.subgraph){
                                        var zone_color = get_zone_color(value.characteristic.score);
                                        L.geoJson(value['zone'], {
                                            color: zone_color,
                                            fillColor: zone_color,
                                            weight: 1,
                                            fillOpacity: 0.3
                                        }).on('click', function (e) {
                                            $('#stats_content').html("Positive Attributes for this Zone: " + value.characteristic.positiveAttributes);
                                            $('#modal1').modal('open');
                                            destination_city = value;
                                            $('#modal_tabs').tabs('select_tab', 'stats');
                                            if(window.myBar){
                                                window.myBar = window.myBar.clear();
                                                window.myBar.destroy();
                                            }
                                            $.ajax({
                                                url: "controller/statistics",
                                                data: {
                                                    "city": $('#city').val(),
                                                    "zone": value.subgraph,
                                                },
                                                cache: false,
                                                type: "GET",
                                                success: function (response) {
                                                    var labels = [];
                                                    var attrs_vals = [];
                                                    var sum_vals = [];
                                                    var total_zone = 0;
                                                    var total_sum = 0;
                                                    $.each(response.attributes, function (k, v) {
                                                        total_zone+=v;
                                                    });
                                                    $.each(response.sums, function (k, v) {
                                                        total_sum+=v;
                                                    });
                                                    $.each(response.attributes, function (k, v) {
                                                        labels.push(k);
                                                        attrs_vals.push(v/total_zone);
                                                    });
                                                    $.each(response.sums, function (k, v) {
                                                        sum_vals.push(v/total_sum);
                                                    });
                                                    console.log(response);
                                                    console.log(total_zone);
                                                    console.log(attrs_vals);
                                                    console.log(sum_vals);
                                                    var color = Chart.helpers.color;
                                                    var barChartData = {
                                                        labels: labels,
                                                        datasets: [{
                                                            label: 'Zone',
                                                            backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
                                                            borderColor: window.chartColors.red,
                                                            borderWidth: 1,
                                                            data: attrs_vals
                                                        }, {
                                                            label: 'City',
                                                            backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
                                                            borderColor: window.chartColors.blue,
                                                            borderWidth: 1,
                                                            data: sum_vals
                                                        }]

                                                    };

                                                    window.myBar = new Chart(ctx, {
                                                        type: 'bar',
                                                        data: barChartData,
                                                        options: {
                                                            responsive: true,
                                                            legend: {
                                                                position: 'top',
                                                            },
                                                            title: {
                                                                display: true,
                                                                text: 'Zone Attributes Statistics'
                                                            }
                                                        }
                                                    });
                                                },
                                                error: function (xhr) {
                                                    console.log(xhr);
                                                }
                                            });

                                        }).addTo(mymap);
                                        return false;
                                    }
                                });
                            });

                        });
                    }, 0);
                });


                $('#or_Attributes_form input').change(function() {
                    var pAttributes = [];
                    $.each($('#or_Attributes_form').serializeArray(), function (i, field) {
                        pAttributes.push(field.name);
                    });
                    //$('.left_option_panel').css('left','13px');
                    $('.left_option_panel').removeClass('left_closed');
                    setTimeout(function() {
                        clearMap();
                        var rand_color = getRandomColor();
                        var sorted_patterns = result_patterns.sort(function(a, b) {
                            return parseFloat(b.characteristic.score) - parseFloat(a.characteristic.score);
                        });
                        $('#zones_table_body').html('');
                        var num = 0;
                        var zones_group = [];
                        $.each(sorted_patterns , function (key, value) {

                            if(!value.characteristic.positiveAttributes.containsAny(pAttributes)){return true;}
                            // $('#zones_form').append('<p class="checkbox tooltipped"  data-position="bottom" data-tooltip="'+value.characteristic.score+'">'+
                            //     '<input type="checkbox" name="'+value.subgraph+'" id="zone_'+value.subgraph+'" />'+
                            //     '<label for="zone_'+value.subgraph+'">'+value.characteristic.positiveAttributes+'</label>'+
                            //     '</p>');
                            $('#zones_table_body').append('<tr class="tooltipped" data-position="right" data-tooltip="Score = '+value.characteristic.score+'">'+
                                '<p class="checkbox">'+
                                '<td><input type="checkbox" name="'+value.subgraph+'" id="zone_'+value.subgraph+'" /><label class="input_check" for="zone_'+value.subgraph+'"></label></td>'+
                                '<td><label for="zone_'+value.subgraph+'">'+value.characteristic.positiveAttributes+'</label></td>'+
                                '<td><label for="zone_'+value.subgraph+'">'+value.characteristic.negativeAttributes+'</label></td></p></tr>');
                            document.getElementById("check_all").checked = false;
                            if(num==0) {
                                zones_group = zones_group.concat(value.subgraph);
                            }
                            if(num==0||cover_check(zones_group, value.subgraph)) {
                                zones_group = zones_group.concat(value.subgraph);
                                var zone = new L.LayerGroup();
                                var zone_color = get_zone_color(value.characteristic.score);
                                L.geoJson(value['zone'], {
                                    color: zone_color,
                                    fillColor: zone_color,
                                    weight: 1,
                                    fillOpacity: 0.3
                                }).on('click', function (e) {
                                    $('#stats_content').html("Positive Attributes for this Zone: " + value.characteristic.positiveAttributes);
                                    $('#modal1').modal('open');
                                    destination_city = value;
                                    $('#modal_tabs').tabs('select_tab', 'stats');
                                    if(window.myBar){
                                        window.myBar = window.myBar.clear();
                                        window.myBar.destroy();
                                    }
                                    $.ajax({
                                        url: "controller/statistics",
                                        data: {
                                            "city": $('#city').val(),
                                            "zone": value.subgraph,
                                        },
                                        cache: false,
                                        type: "GET",
                                        success: function (response) {
                                            var labels = [];
                                            var attrs_vals = [];
                                            var sum_vals = [];
                                            var total_zone = 0;
                                            var total_sum = 0;
                                            $.each(response.attributes, function (k, v) {
                                                total_zone+=v;
                                            });
                                            $.each(response.sums, function (k, v) {
                                                total_sum+=v;
                                            });
                                            $.each(response.attributes, function (k, v) {
                                                labels.push(k);
                                                attrs_vals.push(v/total_zone);
                                            });
                                            $.each(response.sums, function (k, v) {
                                                sum_vals.push(v/total_sum);
                                            });

                                            var color = Chart.helpers.color;
                                            var barChartData = {
                                                labels: labels,
                                                datasets: [{
                                                    label: 'Zone',
                                                    backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
                                                    borderColor: window.chartColors.red,
                                                    borderWidth: 1,
                                                    data: attrs_vals
                                                }, {
                                                    label: 'City',
                                                    backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
                                                    borderColor: window.chartColors.blue,
                                                    borderWidth: 1,
                                                    data: sum_vals
                                                }]

                                            };

                                            window.myBar = new Chart(ctx, {
                                                type: 'bar',
                                                data: barChartData,
                                                options: {
                                                    responsive: true,
                                                    legend: {
                                                        position: 'top',
                                                    },
                                                    title: {
                                                        display: true,
                                                        text: 'Zone Attributes Statistics'
                                                    }
                                                }
                                            });
                                        },
                                        error: function (xhr) {
                                            console.log(xhr);
                                        }
                                    });
                                }).addTo(mymap);
                                num++;
                            }
                        });
                        $('.tooltipped').tooltip({delay: 100});
                        $('#check_all').change(function() {
                            var x = document.getElementById("check_all").checked;
                            if(x){
                                $('#zones_form input').each(function() {
                                    this.checked = true;
                                });
                            }else{
                                $('#zones_form input').each(function() {
                                    this.checked = false;
                                });
                            }
                        });
                        $('#zones_form input').change(function() {
                            var pAttributes2 = [];
                            $.each($('#zones_form ').serializeArray(), function (i, field) {
                                if(field.name!='check_all'){
                                    pAttributes2.push(field.name);
                                }
                            });
                            clearMap();
                            var rand_color = getRandomColor();
                            var zone = new L.LayerGroup();
                            var el_val = $(this).attr('name');
                            //console.log(pAttributes2);
                            $.each(pAttributes2, function (i,ch) {
                                //console.log(ch);
                                $.each(sorted_patterns , function (key, value) {
                                    //console.log(value.subgraph);
                                    //if(pAttributes2.indexOf(value.subgraph)>-1){
                                    if(ch==value.subgraph){
                                        var zone_color = get_zone_color(value.characteristic.score);
                                        L.geoJson(value['zone'], {
                                            color: zone_color,
                                            fillColor: zone_color,
                                            weight: 1,
                                            fillOpacity: 0.3
                                        }).on('click', function (e) {

                                            $('#stats_content').html("Positive Attributes for this Zone: " + value.characteristic.positiveAttributes);
                                            $('#modal1').modal('open');
                                            destination_city = value;
                                            $('#modal_tabs').tabs('select_tab', 'stats');
                                            if(window.myBar){
                                                window.myBar = window.myBar.clear();
                                                window.myBar.destroy();
                                            }
                                            $.ajax({
                                                url: "controller/statistics",
                                                data: {
                                                    "city": $('#city').val(),
                                                    "zone": value.subgraph,
                                                },
                                                cache: false,
                                                type: "GET",
                                                success: function (response) {
                                                    var labels = [];
                                                    var attrs_vals = [];
                                                    var sum_vals = [];
                                                    var total_zone = 0;
                                                    var total_sum = 0;
                                                    $.each(response.attributes, function (k, v) {
                                                        total_zone+=v;
                                                    });
                                                    $.each(response.sums, function (k, v) {
                                                        total_sum+=v;
                                                    });
                                                    $.each(response.attributes, function (k, v) {
                                                        labels.push(k);
                                                        attrs_vals.push(v/total_zone);
                                                    });
                                                    $.each(response.sums, function (k, v) {
                                                        sum_vals.push(v/total_sum);
                                                    });

                                                    var color = Chart.helpers.color;
                                                    var barChartData = {
                                                        labels: labels,
                                                        datasets: [{
                                                            label: 'Zone',
                                                            backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
                                                            borderColor: window.chartColors.red,
                                                            borderWidth: 1,
                                                            data: attrs_vals
                                                        }, {
                                                            label: 'City',
                                                            backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
                                                            borderColor: window.chartColors.blue,
                                                            borderWidth: 1,
                                                            data: sum_vals
                                                        }]

                                                    };

                                                    window.myBar = new Chart(ctx, {
                                                        type: 'bar',
                                                        data: barChartData,
                                                        options: {
                                                            responsive: true,
                                                            legend: {
                                                                position: 'top',
                                                            },
                                                            title: {
                                                                display: true,
                                                                text: 'Zone Attributes Statistics'
                                                            }
                                                        }
                                                    });
                                                },
                                                error: function (xhr) {
                                                    console.log(xhr);
                                                }
                                            });

                                        }).addTo(mymap);
                                        return false;
                                    }
                                });
                            });

                        });
                    }, 0);
                });


                //L.geoJson(unify(global_zone.getLayers())).addTo(mymap);

            },
            error: function (xhr) {

            }
        });
    }else{
        Materialize.toast('Please select a City!', 4000); // 4000 is the duration of the toast
    }
});



function eq_arrays(arr1, arr2){
    return  $(arr1).not(arr2).length === 0 && $(arr2).not(arr1).length === 0;
}

Array.prototype.containsAll = function(arr) {
    return this.every(function (v) {
        return arr.indexOf(v) >= 0
    })
};

Array.prototype.containsAny = function(arr) {
    return this.some(function (v) {
        return arr.indexOf(v) >= 0
    })
};

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

function cover_check(group, zone) {
    var size = zone.length;
    var diff = zone.diff(group);
    if(diff){
        var diff_size = diff.length;
        //console.log(diff_size/size);
        if((diff_size/size)>=0.8){
            return true;
        }
    }
    return false;
}

function similarity_check(zone1, zone2, val) {
    if(zone1.length==0||zone2.length==0)return false;
    val = val/100;
    var size = zone1.length;
    var intersection = intersect(zone1, zone2);
    var intersection_size = intersection.length;
    if((intersection_size /size)>=val){
        return true;
    }
    return false;
}

function intersect(a, b) {
    var t;
    if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
    return a.filter(function (e) {
        return b.indexOf(e) > -1;
    });
}

function get_zone_color(score){
    if(score>=0.015){
        return "#34bf49";
    }
    if(score>=0.008){
        return "#feba02";
    }
    return "#ff0000";

}

function clearMap() {
    for(i in mymap._layers) {
        if(mymap._layers[i]._path != undefined) {
            try {
                mymap.removeLayer(mymap._layers[i]);
            }
            catch(e) {
                console.log("problem with " + e + mymap._layers[i]);
            }
        }
    }
}

function clearMap2(map2){
    for(i in map2._layers) {
        if(map2._layers[i]._path != undefined) {
            try {
                map2.removeLayer(map2._layers[i]);
            }
            catch(e) {
                console.log("problem with " + e + map2._layers[i]);
            }
        }
    }
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function unify(polyList) {
    for (var i = 0; i < polyList.length; ++i) {
        if (i == 0) {
            var unionTemp = polyList[i].toGeoJSON();
        } else {
            unionTemp = turf.union(unionTemp, polyList[i].toGeoJSON());
        }
    }
    return unionTemp;
}

function processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];

    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {

            var tarr = [];
            for (var j=0; j<headers.length; j++) {
                tarr.push(headers[j]+":"+data[j]);
            }
            lines.push(tarr);
        }
    }
    //console.log(lines);
    return lines;
}