module.exports = function homeHead() {
    return `
<head>
    <!-- (start) META TAGS -------------------------------------------------------------------------------------------------->

        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        
        <title>Placeholder Framework</title>
        <meta name="description" content="This is a Placeholder Framework page.">

        <meta name="author" content="placeholder-framework">

        <link rel="icon" type="image/x-icon" href="/public/favicon.ico">

        <meta name="theme-color" content="#712cf9">
        
    <!-- (end) META TAGS ---------------------------------------------------------------------------------------------------->

    

    <!-- (start) EXTERNAL STYLES -------------------------------------------------------------------------------------------->

        <!-- (bootstrap styles) -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
            
        <!-- (bootstrap icons) -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" integrity="sha384-tViUnnbYAV00FLIhhi3v/dWt3Jxw4gZQcNoSCxCIFNJVCx7/D55/wXsrNIRANwdD" crossorigin="anonymous">

    <!-- (end) EXTERNAL STYLES ---------------------------------------------------------------------------------------------->



    <!-- (start) EXTERNAL SCRIPTS ------------------------------------------------------------------------------------------->

        <!-- (bootstrap javascript) -->
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>

    <!-- (end) EXTERNAL SCRIPTS --------------------------------------------------------------------------------------------->



    <!-- (start) LOCAL SCRIPTS ---------------------------------------------------------------------------------------------->

        <!-- (bootstrap color modes) -->
        <script type="text/javascript" src="/public/scripts/color-modes.js"></script>

    <!-- (end) LOCAL SCRIPTS ------------------------------------------------------------------------------------------------>
    

    
    <!-- (start) LOCAL STYLES ----------------------------------------------------------------------------------------------->

        <!-- (root style) -->
        <link rel="stylesheet" href="/public/styles/root.css">

    <!-- (end) LOCAL STYLES ------------------------------------------------------------------------------------------------->
</head>
    `;
};
  