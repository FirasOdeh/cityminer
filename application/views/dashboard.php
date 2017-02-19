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
                    <option value="Barcelona">Barcelona</option>
                </select>
                <label>City</label>
            </div>
            <div class="input-field col s12 m4">
                <button type="submit" id="submitButton" class="waves-effect waves-light btn"><i class="material-icons left">map</i>Display</button>
            </div>
        </div>
    </div>
</div>
<div id="mainmap" style="width: 100%; height: 85vh;"></div>


</body>
</html>