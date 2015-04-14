<!doctype html>
<!-- 

-->
<html>
    <head>
        <title>Psychology Experiment - Informed Consent Form</title>
        <link rel=stylesheet href="<?php echo $BASE; ?>/static/css/bootstrap.min.css" type="text/css">
        <link rel=stylesheet href="<?php echo $BASE; ?>/static/css/style.css" type="text/css">
        <script type="text/javascript">
            function onexit() {
                window.location.href = '<?php echo $BASE; ?>';
            }
        </script>
    </head>
    <body>
        <div id="container-consent">
            <div id="consent">
                <h1>We need your consent to proceed</h1>
                <hr>
                <div class="legal well">
                    <p>
                        You have been invited to take part in a study of inferences and probabilities. The study is designed to investigate how people respond to certain inferences. It will be conducted by Thomas Hinterecker who is the principal investigator, at the Department of Psychology, Experimental Psychology and Cognitive Science, Justus Liebig University (JLU) of Giessen, Germany.
                    </p>
                    <p>
                        If you agree to be in this study, you will be asked to read inferences and assertions presented on a computer display and make judgments about them. Participation in this study will take about twenty minutes to complete, and you will receive £1.7 for your participation.
                    </p>
                    <p>
                        <!--When you complete the study, a thorough verbal and written explanation of it will be
                        provided. -->In addition, by agreeing to participate, you understand you must be 18 years or older to participate.
                    </p>
                    <p>
                        There are no known risks associated with your participation in this research beyond those of everyday life. Although you will receive no direct benefits, this research may help the investigator understand how people make certain inferences.
                    </p>
                    <p>
                        Confidentiality of your research records will be strictly maintained. We assign code numbers to each participant so that data is never directly linked to individual identity, and we are interested in group results rather than the responses of particular individuals. The anonymous data are kept in our laboratory and are only viewed by the investigators. These data files are kept on our computer indefinitely.
                    </p>
                    <p>
                        Taking part in this study is voluntary. Not taking part or withdrawing after the study has begun will result in no loss of services from JLU to which you are otherwise entitled.
                    </p>
                    <p>
                        If there is anything about the study or your participation that is unclear or that you do not understand, if you have questions or wish to report a research-related problem, you may contact Thomas Hinterecker, thomas.hinterecker@psychol.uni-giessen.de.
                    </p>

                    <p>
                        Please print a copy of this consent document to keep.
                    </p>

                    <button type="button" class="btn btn-default btn-sm" onClick="window.print();">
                    <span class="glyphicon glyphicon-print"></span> Print a copy of this
                    </button>
                </div>

                <hr>
                <h4>Do you understand and consent to these terms?</h4>
                <br>

                <center>
                    <button type="button" class="btn btn-primary btn-lg" onClick="window.location='<?php echo $BASE; ?>/exp/<?php echo $uniqueId; ?>'">
                    <span class="glyphicon glyphicon-ok"></span> I agree 
                    </button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <button type="button" class="btn btn-danger btn-lg" onClick="onexit()">
                    <span class="glyphicon glyphicon-ban-circle"></span> No thanks, I do not want to do this study
                    </button
                </center>

            </div>
        </div>
    </body>
</html>

