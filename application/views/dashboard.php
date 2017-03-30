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
                    <option value="barcelona">Barcelona</option>
                    <option value="paris">Paris</option>
                    <option value="whashington">Whashington</option>
                    <option value="new_york">New York</option>
                    <option value="los_angeles">Los Angeles</option>
                    <option value="san_francisco">San Francisco</option>
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
                <input placeholder="Placeholder" id="time" type="text" class="validate" value="200">
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

<div class="col m4 s4 option_panel">
<div class="card">

    <div class="card-tabs">
        <ul class="tabs tabs-fixed-width">
            <li class="tab"><a class="active waves-effect waves-blue" href="#or_Attributes">OR</a></li>
            <li class="tab"><a class="waves-effect waves-blue" href="#and_Attributes">AND</a></li>
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
                        <p id="">A bunch of text</p>
                        <div class="input-field col s12 m4">
                            <select id="city">
                                <option value="" disabled selected>Choose a City</option>
                                <option value="barcelona">Barcelona</option>
                                <option value="paris">Paris</option>
                                <option value="whashington">Whashington</option>
                                <option value="new_york">New York</option>
                                <option value="los_angeles">Los Angeles</option>
                                <option value="san_francisco">San Francisco</option>
                            </select>
                            <label>City</label>
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