<?php
    if(isset($_POST['json']))
    { 
        $servername = "localhost:3306";
        $username = "root"; //"user";
        $password = "root"; //"tBr78n_4";
        $dbname = "db_expo_virtuelle"; //db_expos3d";

        $conn = new mysqli($servername, $username, $password, $dbname);

        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
            }
            
            $sql = "INSERT INTO exposition (nom, codeExposition) VALUES ('expotest', '" . $_POST['json'] . "')";
            
            if ($conn->query($sql) === TRUE) {
            echo "New record created successfully";
            } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
            }

            $conn->close();
    }

?>