//var mymap = L.map('mainmap').setView([45.754, 4.842], 13);
var mymap = L.map('mainmap').setView([43.296353, 5.370505], 13);

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
    $('#modal1').modal('open');

    var win_h = $(window).height();
    var nav_h = $('#site_nav').height();
    var options_h = $('#site_options').height();
    var map_h = win_h - nav_h - options_h;
    $('#mainmap').css('height', map_h);


    // $.ajax({
    //     type: "POST",
    //     //url: "http://localhost/cityminer/data/algorithms/graphMaker/marseille.csv",
    //     url: "http://localhost/cityminer/data/algorithms/graphMaker/nice.csv",
    //     dataType: "text",
    //     success: function(data) {
    //         console.log("OK");
    //         var lines = processData(data);
    //         var num = 0;
    //         $.each(lines, function (key, value) {
    //             num++;
    //             //console.log(value);
    //             //L.marker([value[1], value[2]]).addTo(mymap);
    //             var res1 = value[1].split(":");
    //             var res2 = value[2].split(":");
    //             //console.log(res1);
    //             //console.log(res2);
    //             // L.marker([res1[0], res2[0]]).addTo(mymap);
    //              L.marker([res1[1], res2[1]]).addTo(mymap);
    //             // L.polygon([
    //             //     [res1[0], res2[0]],
    //             //     [res1[0], res2[1]],
    //             // ]).addTo(mymap);
    //         });
    //         console.log("num = "+ num);
    //     },
    //     error: function (xhr) {
    //         console.log("error");
    //     }
    // });

    var map2 = L.map('map2').setView([45.754, 4.842], 13);
    $('#s_city').change(function(){

        map2.invalidateSize();
        attribution = map2.attributionControl;
        attribution.setPrefix('CityMiner Project © 2017');
        clearMap2();

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            id: 'mapbox.streets'
        }).addTo(map2);

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
                console.log(response);
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
                // var sorted_patterns = response.patterns.sort(function(a, b) {
                //     return parseFloat(b.characteristic.score) - parseFloat(a.characteristic.score);
                // });
                var result_patterns = response.patterns;
                var global_zone = new L.LayerGroup();
                $.each(result_patterns, function (key, value) {
                    //var rand_color = getRandomColor();
                    var poly;
                    var zone = new L.LayerGroup();
                    //var temp_zone = new L.LayerGroup();
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
                    // if(key==0){
                    //     global_zone = temp_zone;
                    // }
                    // var intersection = turf.intersect(unify(global_zone.getLayers()), unify(zone.getLayers()));
                    // //console.log(intersection);
                    //
                    // if(intersection==undefined) {
                    //     console.log(intersection);
                    //     global_zone = L.geoJson(turf.union(global_zone.getLayers(), temp_zone.getLayers()));
                    //
                    //
                    //     //L.geoJson(unify(global_zone.getLayers())).addTo(mymap);
                    // }


                    value['zone'] = unify(zone.getLayers());
                    // var zoneUnion = L.geoJson(unify(zone.getLayers()), {
                    //     color: rand_color,
                    //     fillColor: rand_color,
                    //     weight: 1,
                    //     fillOpacity: 0.5
                    // }).on('click', function (e) {
                    //     popup
                    //         .setLatLng(e.latlng)
                    //         .setContent("Positive Attributes for this Zone: " + value.characteristic.positiveAttributes)
                    //         .openOn(mymap);
                    // }).addTo(mymap);
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
                                    '<td><label for="zone_'+value.subgraph+'">'+value.characteristic.positiveAttributes+'</label></td></p></tr>');
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
                                '<td><label for="zone_'+value.subgraph+'">'+value.characteristic.positiveAttributes+'</label></td></p></tr>');
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

function clearMap2(){
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