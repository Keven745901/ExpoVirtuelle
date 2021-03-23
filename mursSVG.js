function NotationScientiqueToFloat(svgContent) {
  // transforme les valeurs écrite 10e-5 en float
  let count = 0;
  svgContent.forEach((element) => {
    if (element.includes("e")) {
      let eElem = element.split(",");
      if (eElem.length >= 2) {
        if (eElem[0].includes("e")) {
          eElem = parseFloat(eElem[0]);
          svgContent[count] = eElem + "," + element.split(",")[1];
        } else {
          if (element[1].includes("e")) {
            eElem = parseFloat(eElem[1]);
            svgContent[count] = element.split(",")[0] + "," + eElem;
          }
        }
      }
    }
    count++;
  });
  return svgContent;
}

function TransformeCoordonnees(rawCoordonnees) {
  let returnCoordonnees = [];
  if (rawCoordonnees !== undefined) {
    for (let i = 0; i < rawCoordonnees.length; i++) {
      switch (rawCoordonnees[i][0]) {
        case "M":
          returnCoordonnees.push({
            x: parseFloat(rawCoordonnees[i][1]),
            z: parseFloat(rawCoordonnees[i][2]),
          });
          break;
        case "H":
          returnCoordonnees.push({
            x: parseFloat(rawCoordonnees[i][1]),
            z: returnCoordonnees[i - 1].z,
          });
          break;
        case "L":
          returnCoordonnees.push({
            x: parseFloat(rawCoordonnees[i][1]),
            z: parseFloat(rawCoordonnees[i][2]),
          });
          break;
        case "V":
          returnCoordonnees.push({
            x: returnCoordonnees[i - 1].x,
            z: parseFloat(rawCoordonnees[i][1]),
          });
          break;
        case "Z":
          returnCoordonnees.push({
            x: parseFloat(returnCoordonnees[0].x),
            z: parseFloat(returnCoordonnees[0].z),
          });
          break;
        default:
          break;
      }
    }
  }
  console.log({ rawCoordonnees });
  console.log({ returnCoordonnees });
  return returnCoordonnees;
}

window.onload = function () {

  document.querySelector("#camera").addEventListener("raycaster-intersected",function(e){
        
    console.log('Player has collided with ', e.detail.body.el);
    console.log(e.detail.target.el); // Original entity (camera).
    
    console.log(e.detail.contact); // Stats about the collision (CANNON.ContactEquation).
    console.log(e.detail.contact.ni); // Normal (direction) of the collision (CANNON.Vec3).
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
            oeuvre.setAttribute("src", "assets/venus_de_milo.glb");
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
