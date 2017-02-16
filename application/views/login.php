<html>
<head>

    <title>Login</title>

</head>
<body>
<br><br>
<div class="container">
    <div class="row">
        <?php
        if (isset($logout_message)) {
            echo "<div class='message'>";
            echo $logout_message;
            echo "</div>";
        }
        ?>

        <?php
        if (isset($message_display)) {
            echo "<div class='message'>";
            echo $message_display;
            echo "</div>";
        }
        ?>
        <div class="col s12 m5">
            <div class="card">
                <div class="card-content">
                    <div class="text-center">
                        <img src="<?php echo base_url(); ?>imgs/new-account.svg" alt="">
                        <h4>Welcome Back!</h4>
                        <br>
                    </div>
                    <?php echo form_open('login'); ?>
                    <?php

                    if (isset($error_message)) {
                        echo $error_message;
                    }
                    echo validation_errors();
                    ?>
                    <div class="input-field">
                        <input id="username" name="username" type="text" class="validate" value="">
                        <label for="username">Username</label>
                    </div>
                    <div class="input-field">
                        <input name="password" type="password" id="password" class="validate" value="">
                        <label for="password">Password</label>
                    </div>
                    <p>
                        <input name="remember" type="checkbox" id="remember" />
                        <label for="remember">Remember me</label>
                    </p>
                    <br>

                    <button type="submit" class="waves-effect waves-light btn pix-full-width mdl-color-text--white pix-mdl-color-green" value="Login " name="submit">
                        Login
                    </button>
                    <!--<input type="submit" value="Login " name="submit" class="btn btn-primary"/>-->
                    <?php echo form_close(); ?>
                    <br>
                    <div class="text-center">
                        New here? <a href="<?php echo base_url() ?>register">Create a new account</a>
                    </div>
                    <!--<hr>
                    <a class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect pix-full-width" href="<?php echo base_url() ?>register">To SignUp Click Here</a>-->
                </div>
            </div>
        </div>
    </div>
</div> <!-- /container -->
</body>
</html>