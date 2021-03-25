let listeCoordonnees = [];
let listePortes = [];
let listeEmplacements = [];
let cellulesEmplacements = [];
let gomme = false;
let porte = false;
let emplacement = false;
let oeuvre;

function GenererExpo(){
    let scene = document.querySelector("#scene");

    while(scene.childNodes.length > 16){
        scene.removeChild(scene.childNodes[scene.childNodes.length-1]);
    }


    let box;
    let lstmurshorizontal;
    let lstmursvertical;
    lstmurshorizontal=CreerMurHorizontal(listeCoordonnees);
    murshorizontal=creerListeMursHorizontal(lstmurshorizontal);
    murshorizontals=GenererMurHorizontal(murshorizontal);
    lstmursvertical=CreerMurVertical(listeCoordonnees);
    mursvertical=creerListeMursVerticaux(lstmursvertical);
    mursverticals=GenererMurVertical(mursvertical);

    listeEmplacements.forEach(element => {
        oeuvre = document.createElement("a-gltf-model");
        console.log(oeuvre);
        oeuvre.setAttribute("src", "../assets/venus_de_milo.glb");
        oeuvre.setAttribute("id", "oeuvre" + listeEmplacements.indexOf(element));
        oeuvre.setAttribute("position", {
            x: element.x,
            y: element.y,
            z: element.z
        });
        oeuvre.setAttribute("static-body", "");
        oeuvre.setAttribute("scale", {
            x: "0.01",
            y: "0.01",
            z: "0.01"
        });
        scene.appendChild(oeuvre);
    });

    listePortes.forEach(element => {
        box = document.createElement("a-box");
        box.setAttribute("id", "p" + listePortes.indexOf(element));
        box.setAttribute("position", {
            x: element.x,
            y: element.y,
            z: element.z
        });
        box.setAttribute("height", "1");
        box.setAttribute("static-body", "");
        box.setAttribute("color", "green");
        scene.appendChild(box);
    });
    //afficherListeEmplacements();
}

function EnleverEmplacement(cells, lst, event){
    let index = event.target.innerText-1;

    event.target.innerText = "";
    if(cells !== undefined && lst != undefined){
        lst.splice(index, 1);
        cells.splice(index, 1);

        for(let i = index; i < cells.length; i++){
            cells[i].innerText = cells[i].innerText - 1;
        }
    }
}

function MajListe(lst, portes, emplacements, x, z, event){
    if(lst !== undefined){
        let contenu = false;
        
        if(!event.shiftKey && !emplacement){
            //vérifie si la cible n'est pas déjà dans la liste
            lst.forEach(element => {
                if(element.x === x && element.z === z){
                    contenu = true;
                    
                    if(gomme || event.altKey)       //si la cible et contenu et l'outil gomme choisi
                    {
                        if(event.target.innerText !== ""){
                            EnleverEmplacement(cellulesEmplacements, emplacements, event);
                        }
                        else{
                            if(lst.indexOf(element) > -1)
                                lst.splice(lst.indexOf(element),1);
                        }
                        event.target.style.backgroundColor = "white";
                    }
                    else{
                        if(element.y === 0 && (event.ctrlKey || porte))     //si la cible et contenu et l'outil porte choisi
                        {
                            if(event.target.innerText !== ""){
                                EnleverEmplacement(cellulesEmplacements, emplacements, event);
                            }
                            lst.splice(lst.indexOf(element),1);
                            element.y = 1.5;
                            portes.push(element);
                            event.target.style.backgroundColor = "green";
                        }
                        else{
                            if(!event.ctrlKey && !porte){
                                if(event.target.innerText !== ""){
                                    EnleverEmplacement(cellulesEmplacements, emplacements, event);
                                }
                                element.y = 0;                          
                                event.target.style.backgroundColor = "red";
                            }
                        }
                    }
                }
            });

            emplacements.forEach(element => {
                if(gomme || event.altKey){
                    if(element.x === x && element.z === z){
                        EnleverEmplacement(cellulesEmplacements, emplacements, event);
                        event.target.style.backgroundColor = "white";
                    }
                }    
            });

            portes.forEach(element => {
                if(gomme || event.altKey){
                    if(element.x === x && element.z === z){
                        portes.splice(portes.indexOf(element),1);
                        event.target.style.backgroundColor = "white";
                    }
                }
            });

            if(!contenu && !gomme && !event.altKey){
                if(!porte && !event.ctrlKey)        //cas mur
                {
                    if(event.target.innerText !== ""){
                        EnleverEmplacement(cellulesEmplacements, emplacements, event);
                    }
                    
                    lst.push({
                        x: x,
                        y: 0,
                        z: z
                    });
                    console.log("aaaaa")
                    portes.forEach(element => {
                        if(element.x === x && element.z === z){
                            portes.splice(portes.indexOf(element),1);
                            event.target.style.backgroundColor = "white";
                        }
                    });
                    
                    event.target.style.backgroundColor = "red";
                }
                else        //cas porte
                {
                    if(event.target.innerText !== ""){
                        EnleverEmplacement(cellulesEmplacements, emplacements, event);
                    }

                    portes.push({
                        x: x,
                        y: 3.5,
                        z: z
                    });
                    event.target.style.backgroundColor = "green";
                    console.log(portes)
                }
            }
        }
        else        //cas emplacement d'oeuvre
        {
            if(event.target.style.backgroundColor === "" || event.target.style.backgroundColor === "white"){
                //NOMBRE D'EMPLACEMENT LIMITÉ A 20 POUR L'INSTANT
                if(emplacements !== undefined && emplacements.length <20){
                    emplacements.push({
                    x: x,
                    y: 0,
                    z: z
                });
                
                event.target.style.backgroundColor = "blue";
                event.target.innerHTML = "<div class='nbr_table'>" + listeEmplacements.length + "<div>";

                cellulesEmplacements.push(event.target);
                }
            }
        }
    }
    lst.sort((a, b) => (a.x > b.x) ? -1 : 1);
    lst.sort((a, b) => (a.z > b.z) ? 1 : -1);
}

function GetCoordonnees(event){
    if(event.buttons === 1 ||event.type === "mousedown"){
        if(event.target.cellIndex !== undefined && event.target.parentElement.rowIndex !== undefined){
            let x = event.target.cellIndex;
            let z = event.target.parentElement.rowIndex;
            MajListe(listeCoordonnees, listePortes, listeEmplacements, x, z, event);
        }  
    }  
}


function GenererTableau(){
    let tableau = document.querySelector("#table");
    tableau.innerHTML = "";
    let row;
    let d;
    for(let i=0; i<15; i++){
        row = document.createElement("tr");
        tableau.appendChild(row);
        for(let j=0; j<15; j++){
            d = document.createElement("td");
            row.appendChild(d);
        }
    }
}
//Fonction qui créer la liste comportant les listes qui contiennent les coordonnées pour faire les murs horizontaux
function CreerMurHorizontal(lstcoordonnees){
    let murs=[];
    let maxelement=lstcoordonnees[0];
    let minelement=lstcoordonnees[0];
    let index=0;
    let nouveaumur=true;
    let mur=[];

    lstcoordonnees.forEach(element => {
        
        if(nouveaumur)
        {
            mur.push(element);
            nouveaumur=false;
            
        }
        else
        {
            if(maxelement.z === element.z)
            {
                if(element.x == lstcoordonnees[index-1].x + 1 || element.x - 1 == lstcoordonnees[index-1].x)
                {
                    mur.push(element);       
                }
                else
                {
                    murs.push(mur);
                    mur=[];
                    mur.push(element);
                }
            }
            else
            {
                murs.push(mur);
                mur=[];
                mur.push(element);
                maxelement=element;
            }
        }
        index=index+1;
    });
    if(mur.length != 0) 
    {
        murs.push(mur);
    }
    return murs;
}

//Fonction qui créer la liste comportant les listes qui contiennent les coordonnées pour faire les murs verticaux
function CreerMurVertical(lstcoordonnees){
    lstcoordonnees.sort((a, b) => (a.z > b.z) ? -1 : 1);
    lstcoordonnees.sort((a, b) => (a.x > b.x) ? 1 : -1);
    let murs=[];
    let maxelement=lstcoordonnees[0];
    let minelement=lstcoordonnees[0];
    let index=0;
    let nouveaumur=true;
    let mur=[];

    lstcoordonnees.forEach(element => {
        
        if(nouveaumur)
        {
            mur.push(element);
            nouveaumur=false;
        }
        else
        {
            if(maxelement.x === element.x)
            {
                if(element.z == lstcoordonnees[index-1].z + 1 || element.z - 1 == lstcoordonnees[index-1].z)
                {
                    mur.push(element);                     
                }
                else
                {
                    murs.push(mur);
                    mur=[];
                    mur.push(element);
                }
            }
            else
            {
                murs.push(mur);
                mur=[];
                mur.push(element);
                maxelement=element;
            }
        }
        index=index+1;
    });
    if(mur.length !== 0) 
    {
        murs.push(mur);
    }
    return murs;
}
//Permet de générer les murs horizontaux avec la liste ne contenant que les murs horizontaux
function GenererMurHorizontal(murshorizontal)
{
    let maxelement;
    let minelement;
    let i;
    let lstmurshorizontal=[];
    let murav=false;
    let murap=false;
    let muravx;
    let murapx;
    let muravy;
    let murapy;
    let ecart;

    lstmurshorizontal=murshorizontal;
    index=lstmurshorizontal.length;
    i=0;
    ecart=0;

    while(i<index)
    {
        if(lstmurshorizontal !== undefined)
        {
            if(lstmurshorizontal[i].length == 1)
            {
                box = document.createElement("a-box");
                box.setAttribute("id", i);
                box.setAttribute("position", {
                    x: lstmurshorizontal[i][0].x,
                    y: 2,
                    z: lstmurshorizontal[i][0].z
                });
                box.setAttribute("width", 1)
                box.setAttribute("height", "4");
                box.setAttribute("color", "red");
                box.setAttribute("static-body", "");
                scene.appendChild(box);
                        
            }
            if(lstmurshorizontal[i].length > 1)
            {
                maxelement=lstmurshorizontal[i][0];
                minelement=lstmurshorizontal[i][0];
                lstmurshorizontal[i].forEach(element => {
                    if(maxelement.z === element.z)
                        {
                            if(maxelement.x < element.x)
                            {
                                maxelement=element;
                            }
                            if(minelement.x > element.x)
                            {
                                minelement=element;
                            }
                        }

                    });
                    box = document.createElement("a-box");
                        box.setAttribute("id", i);
                        let murx= ((maxelement.x + 1) - minelement.x);
                        box.setAttribute("position", {
                            x: minelement.x + (murx / 2) - 0.5,
                            y: 2,
                            z: minelement.z
                    });

                    box.setAttribute("width", murx)
                    box.setAttribute("height", "4");
                    box.setAttribute("color", "red");
                    box.setAttribute("static-body", "");
                    scene.appendChild(box);
                }
            }
        i++;
    }
}

//Permet de générer les murs horizontaux avec la liste ne contenant que les murs verticaux
function GenererMurVertical(mursvertical)
{
    let maxelement;
    let minelement;
    let i;
    let lstmursvertical=[];
    lstmursvertical=mursvertical;
    i=0;
    index=lstmursvertical.length;
    while(i<index)
    {
        if(lstmursvertical !== undefined)
        {
            if(lstmursvertical[i].length > 1)
            {
                maxelement=lstmursvertical[i][0];
                minelement=lstmursvertical[i][0];
                lstmursvertical[i].forEach(element => {
                    if(maxelement.x === element.x)
                        {
                            if(maxelement.z < element.z)
                            {
                                maxelement=element;
                            }
                            if(minelement.z > element.z)
                            {
                                minelement=element;
                            }
                        }

                    });
                    box = document.createElement("a-box");
                        box.setAttribute("id", i);
                        let murz= ((maxelement.z + 1) - minelement.z);
                        box.setAttribute("position", {
                            x: minelement.x,
                            y: 2,
                            z: minelement.z + (murz / 2) - 0.5
                    });
                    box.setAttribute("width", murz)
                    box.setAttribute("height", "4");
                    box.setAttribute("color", "red");
                    box.setAttribute("static-body", "");
                    box.setAttribute("rotation", "0 90 0")
                    scene.appendChild(box);
            }
            else if(lstmursvertical[i].length == 1)
            {
                box = document.createElement("a-box");
                box.setAttribute("id", i);
                box.setAttribute("position", {
                    x: lstmursvertical[i][0].x,
                    y: 2,
                    z: lstmursvertical[i][0].z
                });
                box.setAttribute("width", 1)
                box.setAttribute("height", "4");
                box.setAttribute("color", "red");
                box.setAttribute("static-body", "");
                scene.appendChild(box);
            }
            i++;
        }
    }      

}

//Permet de générer la liste ne comportant que les murs horizontaux
function creerListeMursHorizontal(lstmurshorizontal)
{
    i=0;
    j=0;
    nb=0;
    index=lstmurshorizontal.length;
    lstmurs=[];

    while(i<index)
    {
        if(lstmurshorizontal[i].length == 1)
        {
            while(j<index)
            {
                if(lstmurshorizontal[j].length == 1)
                {
                    if(lstmurshorizontal[i][0].x != lstmurshorizontal[j].x)
                    {
                        if(lstmurshorizontal[i][0].z == lstmurshorizontal[j][0].z)
                        { 
                            nb++;
                        }
                    }

                }
                else
                {
                    lstmurshorizontal[j].forEach(element => {
                        if(lstmurshorizontal[i][0].x != element.x)
                        {
                            if(lstmurshorizontal[i][0].z == element.z)
                            { 
                                nb++;
                            }
                        }
                    });
                }

                j++
            }
            if(nb > 2)
            {
                lstmurs.push(lstmurshorizontal[i]);
            }
        }
        else
        {
            lstmurs.push(lstmurshorizontal[i]);
        }
        j=0;
        nb=0;
        i++;
    }
    return lstmurs;
}

//Permet de générer la liste ne comportant que les murs verticaux
function creerListeMursVerticaux(lstmursvertical)
{
    i=0;
    j=0;
    nb=0;
    index=lstmursvertical.length;
    lstmurs=[];

    while(i<index)
    {
        if(lstmursvertical[i].length == 1)
        {
            while(j<index)
            {
                if(lstmursvertical[j].length == 1)
                {
                    if(lstmursvertical[i][0].z != lstmursvertical[j].z)
                    {
                        if(lstmursvertical[i][0].x == lstmursvertical[j][0].x)
                        { 
                            nb++;
                        }
                    }

                }
                else
                {
                    lstmursvertical[j].forEach(element => {
                        if(lstmursvertical[i][0].z != element.z)
                        {
                            if(lstmursvertical[i][0].x == element.x)
                            { 
                                nb++;
                            }
                        }
                    });
                }

                j++
            }
            if(nb > 2)
            {
                lstmurs.push(lstmursvertical[i]);
            }
        }
        else
        {
            lstmurs.push(lstmursvertical[i]);
        }
        j=0;
        nb=0;
        i++;
    }
    return lstmurs;
}

function modifierScale(scale)
{
    oeuvre.target.object3D.scale.x = scale;
    oeuvre.target.object3D.scale.y = scale;
    oeuvre.target.object3D.scale.z = scale;
}

function ajouterOeuvreAUnEmplacement(idoeuvre,nomoeuvre)
{
    listeEmplacements.forEach(element => {
        if( listeEmplacements.indexOf(element) == idoeuvre)
        {
            console.log(oeuvre);
        }
        
    });
}