<!DOCTYPE html>
<html lang="en">
    <head>
        <link rel="stylesheet" href="lib/codemirror/lib/codemirror.css">
        <link rel="stylesheet" href="lib/codemirror/addon/hint/show-hint.css">
        <link rel="stylesheet" href="lib/codemirror/theme/cobalt.css"></script>
    <link href="bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
</head>

<body>

    <div class="container-fluid">

        <div class="row">
            <div class="col-8">

                <div class="row">
                    <div class="col-12">
                        // editor
                                        <form action="index.php" method="post">
                    <select name="archivo">                        
                        <option value="si_if">si (if)</option>
                        <option value="osi">osi (if else)</option>
                        <option value="si_sino_if_else">si sino (if else)</option>
                        <option value="escribir">escribir.lat</option>
                        <option value="poner">poner.lat</option>
                        <option value="mientras__while">mientras (while)</option>
                        <option value="repetir">repetir</option>
                        <option value="desde">desde</option>

                    </select>

                    <input type="submit" value="Cargar ejemplo">
                </form>

                <?php
                $archivo = $_POST['archivo'];

                $archivo_lat = $archivo . '.lat';
                $archivo_html = $archivo . '.html';
                $archivo_php = $archivo . '.php';


                $codigo = file_get_contents("codigo_latino/" . $archivo_lat);


               
                
                ?>

                <form action="index.php" method="post">
                    <main>
                        <article>
                            <p>
                                <textarea id="editor-latino" name="c"><?php echo $codigo; ?></textarea>
                            </p>

                        </article>
                    </main>
                    
                </form>  
                    </div>                    
                    <div class="col-12">
                        
                        <pre>
<?php

                                    
                            $ejecutar = ($codigo != "" ) ? " latino ./codigo_latino/$archivo_lat " : "latino -a";

                            

echo shell_exec($ejecutar);
                            //  echo var_dump($_POST);
                            ?>
                        </pre>
                        <br>
                        <br>
                        <br>
                        <br>
                        <br>
                        <br>
                        <br>
                        <br>
                        <br>
                        <br>
                        <br>
                        <br>
                        <br>
                        <br>
                        <br>
                    </div>                    
                </div>

            </div>
            <div class="col-4">
                // ayuda
                <iframe 
                    src="http://manual.lenguaje-latino.org/<?php echo $archivo_html; ?>"
                    frameborder="0"
                    height="100%"
                    width="100%"
                    ></iframe>
            </div>
        </div>




    </div>
    


































        







    <script src="lib/codemirror/lib/codemirror.js"></script>
    <script src="lib/codemirror/mode/latino/latino.js"></script>
    <script src="lib/codemirror/addon/hint/show-hint.js"></script>
    <script src="lib/codemirror/addon/hint/latino-hint.js"></script>
    <script src="js/config.js"></script>

    <script src="bootstrap/js/bootstrap.min.js" type="text/javascript"></script>


</body>
</html>
