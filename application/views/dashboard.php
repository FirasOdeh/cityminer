<html>
<head>

    <title>Dashboard</title>
    <link rel="stylesheet" href="css/leaflet.css" />

</head>
<body>


<div id="site_options" class="grey lighten-3 z-depth-4">
    <div class="container dashboard_options">
        <div class="row">
            <div class="input-field col s12 m4">
                <select id="city">
                    <option value="" disabled selected>Choose a City</option>
                    <?php
                    foreach ($cities as $city){?>
                        <option value="<?php echo $city->label ?>"><?php echo $city->name ?></option>
                    <?php }
                    ?>
                    <option value="paris">Paris</option>

                </select>
                <label>City</label>
            </div>
            <div class="input-field col s12 m2">
                <select id="algo">
                    <option value="express" selected>Express</option>
                    <option value="energetics">Energetics</option>
                </select>
                <label>Algorithm</label>
            </div>
            <div class="input-field col s12 m1">
                <input placeholder="Placeholder" id="sigma" type="text" class="validate" value="1">
                <label for="sigma">Sigma</label>
            </div>
            <div class="input-field col s12 m1">
                <input placeholder="Placeholder" id="delta" type="text" class="validate" value="0.005">
                <label for="delta">Delta</label>
            </div>
            <div id="time_input" class="input-field col s12 m1">
                <input placeholder="Placeholder" id="time" type="text" class="validate" value="50">
                <label for="time">Time</label>
            </div>
            <div id="mincov_input" class="input-field col s12 m1 option_hide">
                <input placeholder="Placeholder" id="mincov" type="text" class="validate" value="0.8">
                <label for="mincov">MinCov</label>
            </div>
            <div class="input-field col s12 m2">
                <button type="submit" id="submitButton" class="waves-effect waves-light btn"><i class="material-icons left">play_circle_outline</i> Run</button>
            </div>
            <div class="col s1 m1">
                <div id="map_loading" class="preloader-wrapper loading_div small  active">
                    <div class="spinner-layer spinner-blue">
                        <div class="circle-clipper left">
                            <div class="circle"></div>
                        </div><div class="gap-patch">
                            <div class="circle"></div>
                        </div><div class="circle-clipper right">
                            <div class="circle"></div>
                        </div>
                    </div>

                    <div class="spinner-layer spinner-red">
                        <div class="circle-clipper left">
                            <div class="circle"></div>
                        </div><div class="gap-patch">
                            <div class="circle"></div>
                        </div><div class="circle-clipper right">
                            <div class="circle"></div>
                        </div>
                    </div>

                    <div class="spinner-layer spinner-yellow">
                        <div class="circle-clipper left">
                            <div class="circle"></div>
                        </div><div class="gap-patch">
                            <div class="circle"></div>
                        </div><div class="circle-clipper right">
                            <div class="circle"></div>
                        </div>
                    </div>

                    <div class="spinner-layer spinner-green">
                        <div class="circle-clipper left">
                            <div class="circle"></div>
                        </div><div class="gap-patch">
                            <div class="circle"></div>
                        </div><div class="circle-clipper right">
                            <div class="circle"></div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>
<div id="mainmap" style="width: 100%; height: 85vh;"></div>

<div class="col m4 s4 option_panel closed_option_panel">
    <div class="card">

        <div class="card-tabs">
            <ul class="tabs tabs-fixed-width">
                <li class="tab"><a class="waves-effect waves-blue" href="#or_Attributes">OR</a></li>
                <li class="tab"><a class="active waves-effect waves-blue" href="#and_Attributes">AND</a></li>
            </ul>
        </div>
        <div class="card-content grey lighten-4">
            <div id="and_Attributes">
                <form id="and_Attributes_form">
                    <p>
                        <input type="checkbox" id="test6" />
                        <label for="test6">Yellow</label>
                    </p>
                    <p>
                        <input type="checkbox" id="test7" />
                        <label for="test7">Yellow</label>
                    </p>
                    <p>
                        <input type="checkbox" id="test8" />
                        <label for="test8">Yellow</label>
                    </p>
                </form>
            </div>
            <div id="or_Attributes">
                <form id="or_Attributes_form"></form>
            </div>
        </div>
    </div>
</div>

<div class="col m4 s4 left_option_panel left_closed">
    <div class="card">

        <span class="card-title">Zones</span>

        <div class="card-content left-card-content grey lighten-4" id="left-card-content">
            <div id="and_Attributes2">
                <form id="zones_form">
                    <table id="zones_table" class="striped">
                        <thead>
                        <tr>

                            <th><input type="checkbox" name="check_all" id="check_all" /><label class="input_check" for="check_all"></label></th>
                            <th>Positive</th>
                            <th>Negative</th>
                        </tr>
                        </thead>

                        <tbody id="zones_table_body">
<!--                        <tr class="tooltipped" data-position="right" data-tooltip="test">-->
<!--                            <p class="checkbox">-->
<!--                            <td><input type="checkbox" name="asdasdsad" id="asdasdsad" /><label class="input_check" for="asdasdsad"></label></td>-->
<!--                            <td><label for="asdasdsad">Sport, Sport, Sport</label></td>-->
<!--                            <td><label for="asdasdsad">Food, Food, Food, Food</label></td>-->
<!--                            </p>-->
<!--                        </tr>-->


                        </tbody>
                    </table>

<!--                    <p class="checkbox tooltipped"  data-position="bottom" data-tooltip="'+value.characteristic.score+'">-->
<!--                        <div>-->
<!--                        <input type="checkbox" name="'+value.subgraph+'" id="zone_'+value.subgraph+'" />-->
<!--                        <label for="zone_'+value.subgraph+'">Sport</label>-->
<!--                        <label for="zone_'+value.subgraph+'2">Food</label>-->
<!--                        </div>-->
<!--                    <div>-->
<!--                        <input type="checkbox" name="'+value.subgraph+'" id="zone_'+value.subgraph+'" />-->
<!--                        <label for="zone_'+value.subgraph+'">Food</label>-->
<!--                        </div>-->
<!--                    </p>-->
<!--                    <p>-->
<!--                        <input type="checkbox" id="test6" />-->
<!--                        <label for="test6">Yellow</label>-->
<!--                    </p>-->
<!--                    <p>-->
<!--                        <input type="checkbox" id="test7" />-->
<!--                        <label for="test7">Yellow</label>-->
<!--                    </p>-->
<!--                    <p>-->
<!--                        <input type="checkbox" id="test8" />-->
<!--                        <label for="test8">Yellow</label>-->
<!--                    </p>-->
                </form>
            </div>
        </div>
    </div>
</div>

<div class="fixed-action-btn toggle_div toggle_div_closed">
    <a class="btn-floating btn-large blue darken-2 tooltipped" id="toggle_options" data-position="left" data-tooltip="Toggle Options">
        <i class="large material-icons">settings</i>
    </a>

</div>
<!-- Modal Structure -->
<div id="modal1" class="modal modal-fixed-footer">
    <div class="modal-content map_modal">
        <ul class="tabs" id="modal_tabs">
            <li class="tab"><a class="active waves-effect waves-blue" href="#stats">Statistics</a></li>
            <li class="tab"><a class="waves-effect waves-blue" href="#search_tab">Search a similar Place in another City</a></li>
        </ul>
        <div>
            <div id="stats">
                <div class="row">
                    <div class="col s12">
                        <p id="stats_content">A bunch of text</p>
                        <div id="container" style="width: 100%;">
                            <canvas id="canvas" style="width: 100%;"></canvas>
                        </div>
                    </div>
                </div>
            </div>
            <div id="search_tab">
                <div class="row">
                    <div class="col s12">
                        <div class="input-field col s12 m6">
                            <select id="s_city">
                                <option value="" disabled selected>Choose a City</option>
                                <?php
                                foreach ($cities as $city){?>
                                    <option value="<?php echo $city->label ?>"><?php echo $city->name ?></option>
                                <?php }
                                ?>
                            </select>
                            <label>City</label>
                        </div>
                        <div class="input-field col s12 m6">
                            <p class="range-field">
                                <input type="range" id="similarity_value" min="0" max="100" />
                            </p>
                        </div>
                        <div class="modal_map_div">
                            <div id="map2" style="width: 100%; height: 330px;"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="modal-footer">
        <a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat ">Close</a>
    </div>
</div>


<script src="<?php echo base_url(); ?>js/Chart.bundle.js"></script>
<script src="<?php echo base_url(); ?>js/utils.js"></script>



</body>
</html>