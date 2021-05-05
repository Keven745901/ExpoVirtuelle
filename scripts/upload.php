<?php
    if(isset($_FILES['file']))
    { 
        $dossier = '../models/';
        $fichier = basename($_FILES['file']['name']);
        if(move_uploaded_file($_FILES['file']['tmp_name'], $dossier . $fichier))
        {
            $servername = "localhost:3306";
            $username = "root"; //"user";
            $password = "root"; //"tBr78n_4";
            $dbname = "db_expo_virtuelle"; //db_expos3d";

            $conn = new mysqli($servername, $username, $password, $dbname);

            if ($conn->connect_error) {
                die("Connection failed: " . $conn->connect_error);
              }
              
              $sql = "INSERT INTO oeuvre (nom, description, url)
              VALUES ('$fichier', 'desc', '" . $dossier . $fichier . "')";
              
              if ($conn->query($sql) === TRUE) {
                echo "New record created successfully";
              } else {
                echo "Error: " . $sql . "<br>" . $conn->error;
              }

            $conn->close();
        }
        else
        {
            
        }
    }

?>