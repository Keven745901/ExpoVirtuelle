<?php
    $servername = "localhost:3306";
    $username = "root"; //"user";
    $password = "root"; //"tBr78n_4";
    $dbname = "db_expo_virtuelle"; //db_expos3d";
    $oeuvres = [];

    //si erreur faire la requête :
    //ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';  
    
    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
      }
      
      $sql = "SELECT idOeuvre, nom, description, url FROM oeuvre";
      
      $result = $conn->query($sql);

      if ($result->num_rows > 0) {
        // output data of each row
        while($row = $result->fetch_assoc()) {
            $oeuvres[] = $row;
        }
      }

    $conn->close();
    exit(json_encode($oeuvres));
?>