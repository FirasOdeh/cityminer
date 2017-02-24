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
                <input placeholder="Placeholder" id="segma" type="text" class="validate" value="1">
                <label for="segma">Segma</label>
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
            <div class="input-field col s12 m3">
                <button type="submit" id="submitButton" class="waves-effect waves-light btn"><i class="material-icons left">play_circle_outline</i> Run</button>
            </div>
        </div>
    </div>
</div>
<div id="mainmap" style="width: 100%; height: 85vh;"></div>


</body>
</html>