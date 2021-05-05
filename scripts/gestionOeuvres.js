let listeModels = {};
let jsonOeuvres;
let lastClickedTextbox;
function chargerOeuvres(noEmplacement) {
  lastClickedTextbox = noEmplacement;
  let xhr = new XMLHttpRequest();
  let divRecherche = document.querySelector("#divrechercheOeuvres");
  if (jsonOeuvres === undefined) {
    xhr.open("GET", "../scripts/getoeuvres.php");
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        jsonOeuvres = JSON.parse(xhr.responseText);
        console.log(jsonOeuvres);
        divRecherche.innerHTML = "";
        jsonOeuvres.forEach((oeuvre) => {
          divRecherche.innerHTML =
            divRecherche.innerHTML +
            "<span onclick='ajouterOeuvresToExpo(`" +
            oeuvre.url +
            "`)'>" +
            oeuvre.nom +
            "</span>";
        });
      } else if (xhr.readyState == 4 && xhr.status != 200) {
        alert(
          " Il y a une erreur lors de la reception des images \n Code erreur: " +
            xhr.status +
            "\n veuillez réessayer ultérieurement"
        );
      }
    };
    xhr.send(null);
  } else {
  }
}

function remplacerNumerosParModels(emplacements) {
  let scene = document.querySelector("#scene");
  for (let i = 0; i < scene.children.length; i++) {
    if (
      scene.children[i].tagName.toUpperCase() === "A-TEXT"
    ) {
      console.log(scene.children[i]);
      scene.children[i].remove();
      i = i - 1;
    }
  }
  for (key in listeModels) {
    console.log({emplacements})
    let oeuvre = document.createElement("a-gltf-model");
    oeuvre.setAttribute("src", listeModels[key]);
    oeuvre.setAttribute(
      "id",
      "oeuvre" + emplacements.indexOf(emplacements[key - 1])
    );
    oeuvre.setAttribute("position", {
      x: emplacements[key - 1].x,
      y: emplacements[key - 1].y,
      z: emplacements[key - 1].z,
    });
    oeuvre.setAttribute("static-body", "");
    oeuvre.setAttribute("scale", {
      x: "1",
      y: "1",
      z: "1",
    });
    scene.appendChild(oeuvre);
  }
}

function ajouterOeuvresToExpo(url) {
  console.log({ lastClickedTextbox });
  if (listeModels !== undefined) {
    listeModels[lastClickedTextbox] = url;
  }
  console.log({ listeModels });
}

function filtrageOeuvres() {
  let divRecherche = document.querySelector("#divrechercheOeuvres");
  let recherche;
  if (
    document.activeElement.tagName.toUpperCase() === "INPUT" &&
    document.activeElement.getAttribute("type").toUpperCase() === "TEXT"
  ) {
    recherche = document.activeElement.value;
  } else {
    recherche = "";
  }

  for(let i = 0; i < divRecherche.children.length; i++){
    if (divRecherche.children[i].innerText.toUpperCase().includes(recherche.toUpperCase())) {
      divRecherche.children[i].style.display = "block";
    }
    else{
      divRecherche.children[i].style.display = "none";
    }
  }
}

function resetFiltrage(){
  if (
    document.activeElement.tagName.toUpperCase() === "INPUT" &&
    document.activeElement.getAttribute("type").toUpperCase() === "TEXT"
  ){
    if(document.activeElement.value === ""){
      let divRecherche = document.querySelector("#divrechercheOeuvres");
      for(let i = 0; i < divRecherche.children.length; i++){
          divRecherche.children[i].style.display = "block";
      }
    }
  }
}

function ajouterControleOeuvre(lst) {
  let divTextboxs = document.querySelector("#divControlesOeuvres");
  divTextboxs.innerHTML = "";
  lst.forEach((emplacement) => {
    console.log(lst.indexOf(emplacement) + 1)
    let textbox = document.createElement("input");
    textbox.setAttribute("type", "text");
    textbox.setAttribute(
      "onclick",
      "chargerOeuvres(" +
        parseInt(lst.indexOf(emplacement) + 1) +
        "), resetFiltrage()"
    );
    textbox.setAttribute("oninput", "filtrageOeuvres()");
    divTextboxs.innerHTML =
      divTextboxs.innerHTML +
      "Emplacement n°" +
      parseInt(lst.indexOf(emplacement) + 1);
    divTextboxs.appendChild(textbox);
    divTextboxs.innerHTML = divTextboxs.innerHTML + "<br />";
  });
}
