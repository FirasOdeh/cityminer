<html>
<head>
    <title>PixFort | Register</title>
</head>
<body>
<div class="container">
    <div class="row">
        <div class="col s12 m5">
            <div class="card">
                <div class="card-content">
                    <div class="text-center">
                        <img src="<?php echo base_url(); ?>imgs/new-account.svg" alt="">
                        <h5>Create your account</h5>
                        <p>Start using the service in just a few steps!</p>
                    </div>
                    <?php
                    echo "<div class='error_msg'>";
                    echo validation_errors();
                    echo "</div>";

                    echo form_open('register');
                    ?>
                    <?php
                    if (isset($message_display)) {
                        echo $message_display;}
                    ?>
                    <div class="input-field">
                        <input id="username" name="username" type="text" class="validate" value="">
                        <label for="username">Username</label>
                    </div>
                    <div class="input-field">
                        <input id="email" name="email_value" type="text" class="validate" value="">
                        <label for="email">Email</label>
                    </div>
                    <div class="input-field">
                        <input id="password" name="password" type="password" class="validate" value="">
                        <label for="password">Password</label>
                    </div>
                    <p>
                        <input name="accept" type="checkbox" id="accept" />
                        <label for="accept">I accept the Terms of Service.</label>
                    </p>
                    <br>
                    <button type="submit" class="waves-effect waves-light btn pix-full-width mdl-color-text--white pix-mdl-color-green" value="Login " name="submit">
                        Sign Up
                    </button>
                    <?php echo form_close(); ?>
                    <br>
                    <div class="text-center">
                        Already got an account? <a href="<?php echo base_url() ?>login">Sign in here</a>
                    </div>

                    <!--<hr>
            <a class="btn btn-default" href="<?php echo base_url() ?>login">For Login Click Here</a>-->
                </div>
            </div>
        </div>
    </div>
</div>

</body>
</html>