<html>
<head>

    <title>Dashboard</title>
    <link rel="stylesheet" href="css/leaflet.css" />

</head>
<body>
<div class="container">
    <div class="row">
        <div class="col s12 m12">
            <h4 class="pix-page-title">Admin</h4>
            <div class="card">
                <ul class="tabs pix_page_tabs">
                    <li class="tab"><a href="#Export" class="waves-effect waves-blue">Cities</a></li>
                    <li class="tab"><a href="#FTP" class="waves-effect waves-blue">Options</a></li>
                </ul>
                <div class="card-content">
                    <div id="Export" class="col s12">
                        <h5><strong>Add city</strong></h5>
                        <div>
                            <div class="input-field col s3">
                                <select>
                                    <option value="foursquare" selected>Foursquare</option>
                                    <option value="google">Google</option>
                                </select>
                                <label>Source</label>
                            </div>

                            <div class="col s5">
                                <div class="row">
                                    <div class="input-field col s12">
                                        <i class="material-icons prefix">location_on</i>
                                        <input type="text" id="autocomplete-input" class="autocomplete">
                                        <label for="autocomplete-input">Address</label>
                                    </div>
                                </div>
                            </div>

                            <div class="input-field col s2">
                                <input type="text" id="scope_input" value="5">
                                <label>Scope (Km)</label>

                            </div>
                            <div class="input-field col s2">
                                <button type="submit" id="import_btn" class="waves-effect waves-light btn"> Import </button>
                            </div>
                        </div>
                        <div id="adminmap" style="width: 100%; height: 75vh;"></div>
                        <br><br>
                        <br><br>
                        <table>
                            <thead>
                            <tr>
                                <th data-field="name">Name</th>
                                <th data-field="price">Number of Places</th>
                                <th data-field="id"></th>
                            </tr>
                            </thead>

                            <tbody>
                            <?php
                                foreach ($cities as $city){?>
                                    <tr>
                                        <td><?php echo $city->name ?></td>
                                        <td><?php echo $city->places_number ?></td>
                                        <td><a class="btn-floating waves-effect grey lighten-3 " data-position="left" data-delay="0" id="del_'.$pk->id.'">
                                                <i class="material-icons grey-text darken-3-text delete-city-btn" data-city_id="<?php echo $city->id ?>">delete</i>
                                            </a></td>
                                    </tr>
                                <?php }
                            ?>

                            </tbody>
                        </table>
                        <br><br>
                    </div>
                    <div id="FTP" class="col s12">
                        <div class="col m6  offset-m3">
                            <div class="text-center">
                            </div>
                            <div class="text-center">
                                FTP Typically there is a one-to-one relationship between a URL string and its corresponding controller class/method
                            </div>
                            <br>

                            <div class="input-field">
                                <input class="validate" type="text" id="AW_AUTHCODE" name="AW_AUTHCODE" value="">
                                <label for="AW_AUTHCODE">FTP Host</label>
                            </div>
                            <div class="input-field">
                                <input class="validate" type="text" id="AW_AUTHCODE" name="AW_AUTHCODE" value="">
                                <label for="AW_AUTHCODE">FTP Host</label>
                            </div>
                            <div class="input-field">
                                <input class="validate" type="text" id="AW_AUTHCODE" name="AW_AUTHCODE" value="">
                                <label for="AW_AUTHCODE">FTP Host</label>
                            </div>
                            <div class="input-field">
                                <input class="validate" type="text" id="AW_AUTHCODE" name="AW_AUTHCODE" value="">
                                <label for="AW_AUTHCODE">FTP Host</label>
                            </div>
                            <br>
                            <button type="submit" class="waves-effect waves-light btn pix-full-width mdl-color-text--white pix-mdl-color-green" value="Login " name="save_config">
                                Publish Project
                            </button>
                            <br><br>
                            <div class="text-center grey-text text-lighten-1">
                                *The .zip file includes all the html files, images and javascript files
                            </div>
                            <br>
                        </div>


                    </div>
                    <div class="clearfix"></div>
                </div>
            </div>
        </div>
    </div>
</div> <!-- /container -->


</body>
<script type="text/javascript" src="<?php echo base_url(); ?>js/admin.js"></script>
</html>