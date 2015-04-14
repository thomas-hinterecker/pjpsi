<!doctype html>
<html>
    <head>
        <title>Psychology Experiment - Error</title>
        <link rel=stylesheet href="<?php echo $BASE; ?>/static/css/bootstrap.min.css" type="text/css">
        <link rel=stylesheet href="<?php echo $BASE; ?>/static/css/style.css" type="text/css">
    </head>
    <body>
        <div id="container-error">

            <div id="error">
                <h1>Sorry, there was an error</h1>
                <hr>

                <div class="alert alert-danger">

                    <?php if ($errornum): ?>
                        
                            <?php if ($errornum==1008): ?>
                                
                                    <p>Sorry, our records indicate that you have attempted to complete this study, but quit before finishing.</p>
                                    <p>Because this is a Psychology experiment, you can only complete this study once.</p>

                            <?php endif; ?>
                            <?php if ($errornum==1010): ?>

                                    <p>Sorry, our records indicate that you have already completed (or attempted to complete) this study.</p>
                                    <p>Because this is a Psychology experiment, you can only complete this study once.</p>

                            <?php endif; ?>
                        
                        <?php else: ?>
                            <p>Sorry, there was an unexpected error in our processing of your study.<p>
                        

                    <?php endif; ?>

                        <p>
                            If you feel that you have reached this page in error, please email
                            <a href="mailto:<?php echo $contact_address; ?>"><?php echo $contact_address; ?></a>
                            and send the following information:
                        </p>
                        <p>
                            Error: #<?php echo $errornum; ?><br>
Unique Id: #<?php echo $uniqueId; ?><br>
                        </p>

                </div>

                <hr>
                <h3>Our sincere apologies!</h3>
            </div>
        </div>
    </body>
</html>