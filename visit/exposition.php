<?php 

if(isset($_GET['id'])){
    $servername = "localhost:3306";
    $username = "root"; //"user";
    $password = "root"; //"tBr78n_4";
    $dbname = "db_expo_virtuelle"; //db_expos3d";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
        }
        
        $sql = "SELECT nom, codeExposition FROM exposition WHERE idExposition = $_GET[id]";
        
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
        // output data of each row
        if($row = $result->fetch_assoc()) {
            $json = $row['codeExposition'];
        }
    }
    $conn->close();
}
?>

<html>
    <header>
        <!-- Scripts -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/5.0.0/js/bootstrap.min.js"></script>

        <script src="https://aframe.io/releases/1.0.0/aframe.min.js"> </script>
        <script src="https://cdn.jsdelivr.net/gh/donmccurdy/aframe-extras@v6.1.0/dist/aframe-extras.min.js"></script>
        <script src="https://cdn.rawgit.com/donmccurdy/aframe-physics-system/v4.0.1/dist/aframe-physics-system.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/snap.svg/0.4.1/snap.svg-min.js"></script>
        <script src="https://unpkg.com/aframe-look-at-component@0.8.0/dist/aframe-look-at-component.min.js"></script> 
    </header>

    <body>
    <a-scene id="scene" cursor="rayOrigin: cursor" embedded>
        <a-entity id="camera" position="0 1.6 0">
            <a-entity camera wasd-controls="acceleration: 300;" look-controls="pointerLockEnabled: true" kinematic-body="radius:0.5">
                <a-cursor raycaster="interval: 500" id="cursor" geometry="primitive: ring; radiusInner: 0.001; radiusOuter: 0.005" material="color: #000000; shader: flat"></a-cursor>
            </a-entity>
        </a-entity>

        <!--<a-box color="blue" id="b1" width="1.5" depth="1" height="3" static-body>
            <a-plane id="e1" visible="false" text="value: Hello WorldHello WorldHello WorldHello WorldHello WorldHello WorldHello WorldHello WorldHello WorldHello WorldHello WorldHello WorldHello WorldHello WorldHello WorldHello WorldHello WorldHello WorldHello WorldHello WorldHello WorldHello WorldHello WorldHello WorldHello WorldHello World; font: mozillavr; baseline: bottom; align:center; anchor: center" position="-2 1 0" width="2" height="2" shadow="receive: false" look-at="[camera]" color="red">
            </a-plane>
        </a-box>-->
        <a-grid material="src:https://cdn.jsdelivr.net/gh/donmccurdy/aframe-extras@v1.16.3/assets/grid.png; repeat: 500 500" width="500" height="500" position="0 0 0" static-body rotation="-90 0 0"></a-grid>
        <a-sky src="../assets/26229014269_dac746757d_k.jpg" position="0 1800 0"></a-sky>
        
    </a-scene>
    </body>
</html>

<script>
    let json = <?php echo $json; ?>;
    console.log({json});
    let scene = document.querySelector("#scene");
    json.murs.forEach(mur => {
        let box = document.createElement("a-box");
        box.setAttribute("id", mur.id);
        box.setAttribute("position", {
            x : mur.position.x,
            y : mur.position.y,
            z : mur.position.z
        });
        box.setAttribute("rotation", {
            x : mur.rotation.x,
            y : mur.rotation.y,
            z : mur.rotation.z
        });
        box.setAttribute("height", mur.height);
        box.setAttribute("width", mur.width);
        box.setAttribute("depth", mur.depth);
        box.setAttribute("static-body", "");
        box.setAttribute("color", mur.color);
        scene.appendChild(box);
    });
    json.cylindres.forEach(cylindre => {
        let cyl = document.createElement("a-cylinder");
        cyl.setAttribute("height", cylindre.height);
        cyl.setAttribute("radius", cylindre.radius);
        cyl.setAttribute("color", cylindre.color);
        cyl.setAttribute("shadow", "");
        cyl.setAttribute("geometry", {
            segmentsRadial: 6,
        });
        cyl.setAttribute("static-body", "");
        cyl.setAttribute("position", {
            x: cylindre.position.x,
            y: cylindre.position.y,
            z: cylindre.position.z,
        });
        scene.appendChild(cyl);
    });
    json.oeuvres.forEach(item => {
        let oeuvre = document.createElement("a-gltf-model");
        oeuvre.setAttribute("id", item.id);
        oeuvre.setAttribute("static-body", "");
        oeuvre.setAttribute("scale", {
            x: item.scale.x,
            y: item.scale.y,
            z: item.scale.z
        });
        oeuvre.setAttribute("position", {
            x: item.position.x,
            y: item.position.y,
            z: item.position.z
        });
        oeuvre.setAttribute("rotation", {
            x: item.rotation.x,
            y: item.rotation.y,
            z: item.rotation.z
        });
        oeuvre.setAttribute("src", item.src);
        scene.appendChild(oeuvre);
    });
</script>