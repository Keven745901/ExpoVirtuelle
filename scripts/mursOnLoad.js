window.onload = function () {
 
    let raycasterOnOeuvre;

    GenererTableau();
    document.querySelector("#table").onmouseover = GetCoordonnees;
    document.querySelector("#table").onmousedown = GetCoordonnees;
    document.querySelector("#chkgomme").onclick = function(event) {
        if(event.target.checked){
            gomme = true;
            porte = false;
            emplacement = false;
            document.querySelector("#chkporte").checked = false;
            document.querySelector("#chkemplacement").checked = false;
        }
        else{
            gomme = false;
        } 
    };
    document.querySelector("#chkemplacement").onclick = function(event) {
        if(event.target.checked){
            emplacement = true;
            porte = false;
            gomme = false;
            document.querySelector("#chkporte").checked = false;
            document.querySelector("#chkgomme").checked = false;
        }
        else{
            emplacement = false;
        } 
    };
    document.querySelector("#chkporte").onclick = function(event) {
        if(event.target.checked){
            porte = true;
            gomme = false;
            emplacement = false;
            document.querySelector("#chkgomme").checked = false;
            document.querySelector("#chkemplacement").checked = false;
        }
        else{
            porte = false;
        } 
    };
    document.querySelector("#btnvider").onclick = function(){
        listeCoordonnees = [];
        listeEmplacements = [];
        listePortes = [];
        cellulesEmplacements = [];
        GenererTableau();
    };
    document.querySelector("#btngenerer").onclick = function(){
        document.querySelector("#upload").value = "";
        GenererExpo();
    }
    
    document.querySelector("#camera").addEventListener("raycaster-intersected",function(e){
        
        //console.log('Player has collided with ', e.detail.body.el);
        //console.log(e.detail.target.el); // Original entity (camera).
        
        //console.log(e.detail.contact); // Stats about the collision (CANNON.ContactEquation).
        //console.log(e.detail.contact.ni); // Normal (direction) of the collision (CANNON.Vec3).
    });
    
    
    document.querySelector("#scene").addEventListener("loaded",function(e){
        console.log("SCENE LOADED")
    });
    
    document.querySelector("#scene").addEventListener("click",function(e){
        if(e.target.id.includes("oeuvre"))
        {
            oeuvre=e;
            document.querySelector("#posx").value = e.target.object3D.position.x;
            document.querySelector("#posy").value = e.target.object3D.position.y;
            document.querySelector("#posz").value = e.target.object3D.position.z;
            document.querySelector("#rotx").value = e.target.object3D.rotation.x;
            document.querySelector("#roty").value = e.target.object3D.rotation.y;
            document.querySelector("#rotz").value = e.target.object3D.rotation.z;
            document.querySelector("#scal").value = e.target.object3D.scale.x;
            console.log(e);
        }
        

    });




    document
      .querySelector("#cursor")
      .addEventListener("raycaster-intersection", function (e) {
        /* console.log(e.detail.els[0])
        if (e.detail.els[0].id === "b1") {
          document.querySelector("#e1").setAttribute("visible", true);
          raycasterOnOeuvre = true;
          let audio = new Audio('.mp3');
          audio.play();
        }
        if (raycasterOnOeuvre && e.detail.els[0].id === "e1"){
          document.querySelector("#e1").setAttribute("visible", true);
          raycasterOnOeuvre = false;
        } */
      });
  
    document
      .querySelector("#camera")
      .addEventListener("raycaster-intersection-cleared", function (e) {
        /* console.log(e);
        document.querySelector("#e1").setAttribute("visible", false); */
      });
  
    document.querySelector("#upload").onchange = function () {
      let reader = new FileReader();
      let file = document.querySelector("#upload").files[0];
      if (file.name.split(".").pop() === "svg") {
        reader.readAsText(file, "UTF-8");
        reader.onload = function (event) {
          if (window.DOMParser) {
            let walls = [];
            let cylindres = [];
            let listeEmplacements = [];
            let content = event.target.result;
  
            let parser = new DOMParser();
            let xmlDoc = parser.parseFromString(content, "text/xml");
            let gTag = xmlDoc.getElementsByTagName("g");
  
            listeCoordonnees = [];
            listeEmplacements = [];
            listePortes = [];
            cellulesEmplacements = [];
            GenererTableau();
            
            //let regex = /[a-zA-Z]/g;
            let scene = document.querySelector("#scene");
            while (scene.childNodes.length > 16) {
              scene.removeChild(scene.childNodes[scene.childNodes.length - 1]);
            }
            for (let k = 0; k < gTag.length; k++) {
              let paths = gTag[k].getElementsByTagName("path");
              for (let i = 0; i < paths.length; i++) {
                let path = paths[i].attributes["d"].value.split(" ");
  
                //modifie coords : notation scientifique -> float, coordonées relatives -> absolute, lettres -> nombres
                let coords = NotationScientiqueToFloat(path);
                coords = Snap.path.toAbsolute(coords);
                coords = TransformeCoordonnees(coords);
                //
  
                for (let j = 0; j < coords.length - 1; j++) {
                  let ancienNormeX;
                  let ancienNormeZ;
  
                  //if(!regex.test(path[j]) && !regex.test(path[j+1])){
                  let startX = coords[j].x;
                  let startZ = coords[j].z;
                  let endX = coords[j + 1].x;
                  let endZ = coords[j + 1].z;
  
                  let vecteur = {
                    x: endX - startX,
                    z: endZ - startZ,
                  };
                  let vecteurHorizontal = {
                    x: endX - startX,
                    z: 0,
                  };
                  let produitScalaire =
                    vecteur.x * vecteurHorizontal.x +
                    vecteur.z * vecteurHorizontal.z;
  
                  let normeV = Math.sqrt(
                    Math.pow(vecteur.x, 2) + Math.pow(vecteur.z, 2)
                  );
  
                  let rotation;
                  let angle;
                  let cos;
                  let wall = document.createElement("a-box");
                  if (vecteur.x === 0) {
                    wall.setAttribute("rotation", {
                      x: 0,
                      y: 90,
                      z: 0,
                    });
                  } else {
                    if (vecteur.z === 0) {
                      wall.setAttribute("rotation", {
                        x: 0,
                        y: 0,
                        z: 0,
                      });
                    } else {
                      let normeVH = Math.sqrt(
                        Math.pow(vecteurHorizontal.x, 2) +
                          Math.pow(vecteurHorizontal.z, 2)
                      );
  
                      cos = produitScalaire / (normeV * normeVH);
  
                      angle = Math.acos(cos) * (180 / Math.PI);
                      wall.setAttribute("rotation", {
                        x: 0,
                        y:
                          (vecteur.x > 0 && vecteur.z > 0) ||
                          (vecteur.x < 0 && vecteur.z < 0)
                            ? -angle
                            : angle,
                        z: 0,
                      });
                    }
                  }
                  console.log({ normeV });
                  wall.setAttribute("width", normeV);
                  wall.setAttribute("depth", 0.5);
                  wall.setAttribute("shadow", "");
  
                  let posY = 1.5;
  
                  // k = 0 -> mur
                  // k = 1 -> porte
                  // k = 2 -> emplacement oeuvre
                  switch (k) {
                    case 0:
                      wall.setAttribute("height", "3");
                      wall.setAttribute("static-body", "");
                      wall.setAttribute("color", "#443733");
                      break;
                    case 1:
                      wall.setAttribute("height", "0.5");
                      wall.setAttribute("color", "#221510");
                      posY = 2.75;
                      break;
                    default:
                      wall.setAttribute("height", "3");
                      wall.setAttribute("static-body", "");
                      wall.setAttribute("color", "#443733");
                  }
  
                  let posX = parseFloat(startX) + (endX - startX) / 2;
                  let posZ = parseFloat(startZ) + (endZ - startZ) / 2;
  
                  wall.setAttribute("position", {
                    x: posX,
                    y: posY,
                    z: posZ,
                  });
                  walls.push(wall);
  
                  //if (angle > 25 && angle < 65) {
                  //1 cylindre au début du premier mur, 1 cylindre à chaque fin de mur
  
                  if (j === 0) {
                    let cylindre = document.createElement("a-cylinder");
                    cylindre.setAttribute("height", 3.005);
                    cylindre.setAttribute("radius", 0.41);
                    cylindre.setAttribute("color", "#221510");
                    cylindre.setAttribute("shadow", "");
                    cylindre.setAttribute("geometry", "segmentsRadial: 6");
                    cylindre.setAttribute("static-body", "");
                    cylindre.setAttribute("position", {
                      x: startX,
                      y: 1.5,
                      z: startZ,
                    });
  
                    cylindres.push(cylindre);
                  }
  
                  let cylindre = document.createElement("a-cylinder");
                  cylindre.setAttribute("height", 3.005);
                  cylindre.setAttribute("radius", 0.41);
                  cylindre.setAttribute("color", "#221510");
                  cylindre.setAttribute("shadow", "");
                  cylindre.setAttribute("geometry", "segmentsRadial: 6");
                  cylindre.setAttribute("static-body", "");
                  cylindre.setAttribute("position", {
                    x: endX,
                    y: 1.5,
                    z: endZ,
                  });
  
                  cylindres.push(cylindre);
                  //}
                }
              }
            }
            if (gTag[2] !== undefined) {
              let emps = gTag[2].getElementsByTagName("ellipse");
              for (let l = 0; l < emps.length; l++) {
                listeEmplacements.push({
                  x: emps[l].attributes["cx"].value,
                  y: 0,
                  z: emps[l].attributes["cy"].value,
                });
              }
            }
  
            scene = document.querySelector("#scene");
            for (let m = 0; m < walls.length; m++) {
              walls[m].setAttribute("id", "mur" + m);
              scene.appendChild(walls[m]);
            }
            for (let m = 0; m < cylindres.length; m++) {
              cylindres[m].setAttribute("id", "cylindre" + m);
              scene.appendChild(cylindres[m]);
            }
            for (let m = 0; m < listeEmplacements.length; m++) {
              oeuvre = document.createElement("a-gltf-model");
              oeuvre.setAttribute("src", "../assets/venus_de_milo.glb");
              oeuvre.setAttribute("id", "oeuvre" + m);
              oeuvre.setAttribute("position", {
                x: listeEmplacements[m].x,
                y: listeEmplacements[m].y,
                z: listeEmplacements[m].z,
              });
              oeuvre.setAttribute("static-body", "");
              oeuvre.setAttribute("scale", {
                x: "0.01",
                y: "0.01",
                z: "0.01",
              });
              scene.appendChild(oeuvre);
            }
          }
        };
        reader.onerror = function (event) {
          alert("Erreur lors de la lecture du fichier");
        };
      } else {
        alert("Le fichier envoyé doit être un fichier SVG");
      }
    };
  };