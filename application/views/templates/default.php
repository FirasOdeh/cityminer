<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="<?php echo base_url(); ?>core/images/favicon.ico">

    <!--    <link rel="stylesheet" type="text/css" href="--><?php //echo base_url(); ?><!--css/bootstrap.css">-->
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <!--	<link rel="stylesheet" type="text/css" href="--><?php //echo base_url(); ?><!--css/material.css">-->

    <link rel="stylesheet" type="text/css" href="<?php echo base_url(); ?>css/materialize.css">

    <link rel="stylesheet" type="text/css" href="<?php echo base_url(); ?>css/custom.css">
    <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet">

</head>
<body>


<nav>
    <div class="nav-wrapper  z-depth-0">
        <div class="container">
            <a href="<?php echo base_url() ?>" class="brand-logo page-logo">
                CityMiner
            </a>
            <a href="#" data-activates="mobile-demo" class="button-collapse"><i class="material-icons grey-text text-darken-1">menu</i></a>

            <ul class="right hide-on-med-and-down">
                <?php if (isset($not_logged)) { ?>
                    <li><a href="<?php echo base_url() ?>login">Login</a></li>
                <?php }else{ ?>
                    <li><a class="dropdown-button" href="#!" data-activates="dropdown1" data-beloworigin="true">Firas<i class="material-icons right">arrow_drop_down</i></a></li>
                <?php } ?>
            </ul>
            <ul class="side-nav" id="mobile-demo">
                <li><a href="sass.html">Dashboard</a></li>
                <li><a href="badges.html">Components</a></li>
                <li><a href="collapsible.html">Javascript</a></li>
                <li><a href="<?php echo base_url() ?>logout">logout</a></li>
            </ul>
        </div>
    </div>
</nav>

<ul id="dropdown1" class="dropdown-content">
    <li><a href="#!">Settings</a></li>
    <li class="divider"></li>
    <li><a href="<?php echo base_url() ?>logout">Logout</a></li>
</ul>

<?php echo $body; ?>

<script type="text/javascript" src="<?php echo base_url(); ?>js/jquery-1.11.2.js"></script>
<!--<script type="text/javascript" src="--><?php //echo base_url(); ?><!--js/bootstrap.js"></script>-->
<!--<script type="text/javascript" src="--><?php //echo base_url(); ?><!--js/material.min.js"></script>-->
<script type="text/javascript" src="<?php echo base_url(); ?>js/materialize.min.js"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>js/custom.js"></script>
</body>
</html>