    let listeCoordonnees = [];
    let listeEmplacements = [];
    let cellulesEmplacements = [];
    let gomme = false;
    let porte = false;
    let emplacement = false;
    
    window.onload = function () {
        
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
            cellulesEmplacements = [];
            GenererTableau();
        };
        document.querySelector("#btngenerer").onclick = GenererExpo;
        document.querySelector("#camera").addEventListener("collide",function(e){
            //console.log('Player has collided with ', e.detail.body.el);
            //console.log(e.detail.target.el); // Original entity (camera).
            
            //console.log(e.detail.contact); // Stats about the collision (CANNON.ContactEquation).
            //console.log(e.detail.contact.ni); // Normal (direction) of the collision (CANNON.Vec3).
        });
        
        
        document.querySelector("#scene").addEventListener("loaded",function(e){
            console.log("SCENE LOADED")
        });
        
        document.querySelector("#scene").addEventListener("click",function(e){
            console.log(e)
        });

        document.querySelector("#camera").addEventListener("collide",function(e){
            //console.log('Player has collided with ', e.detail.body.el);
            //console.log(e.detail.target.el); // Original entity (camera).
            
            //console.log(e.detail.contact); // Stats about the collision (CANNON.ContactEquation).
            //console.log(e.detail.contact.ni); // Normal (direction) of the collision (CANNON.Vec3).
        });
    }

    function GenererExpo(){
        //console.log({listeCoordonnees});
        let scene = document.querySelector("#scene");
        
        
        //permet de supprimer toutes les box de la scène
        while(scene.childNodes.length > 12){
            scene.removeChild(scene.childNodes[scene.childNodes.length-1]);
        }

        let box;
        let oeuvre;
        //version Kévin
        /* 
        let maxelement=listeCoordonnees[0];
        let minelement=listeCoordonnees[0];

        listeCoordonnees.forEach(element => {
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
        maxelement.x=maxelement.x+1;
        box = document.createElement("a-box");
            box.setAttribute("id", 1);
            box.setAttribute("position", {
                x: minelement.x,
                y: 0,
                z: minelement.z
        });
        let murx=(maxelement.x - minelement.x);
        console.log(murx);
        box.setAttribute("width", murx)
        box.setAttribute("height", "4");
        box.setAttribute("color", "red");
        scene.appendChild(box);

        console.log("max x : " + maxelement.x);
        console.log("max y : " + maxelement.z);
        console.log("min x : " + minelement.x);
        console.log("min y : " + minelement.z);
        */
        
        listeCoordonnees.forEach(element => {
            box = document.createElement("a-box");
            box.setAttribute("id", listeCoordonnees.indexOf(element));
            box.setAttribute("position", {
                x: element.x,
                y: element.y,
                z: element.z
            });
            if(element.y === 1.5){
                box.setAttribute("height", "1");
            }
            else{
                box.setAttribute("height", "4");
                box.setAttribute("repeat", "1 4");
            }
            box.setAttribute("static-body", "");
            box.setAttribute("color", "red");
            scene.appendChild(box);
        });

        listeEmplacements.forEach(element => {
            console.log("a");
            oeuvre = document.createElement("a-gltf-model");
            oeuvre.setAttribute("src", "assets/venus_de_milo.glb");
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

    function MajListe(lst, emplacements, x,z){
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

                                element.y = 1.5;
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
                        
                        event.target.style.backgroundColor = "red";
                    }
                    else        //cas porte
                    {
                        if(event.target.innerText !== ""){
                            EnleverEmplacement(cellulesEmplacements, emplacements, event);
                        }

                        lst.push({
                            x: x,
                            y: 1.5,
                            z: z
                        });
                        event.target.style.backgroundColor = "green";
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
                    event.target.innerText = listeEmplacements.length;

                    cellulesEmplacements.push(event.target);
                    }
                }
            }
        }
    }
    
    function GetCoordonnees(event){
        if(event.buttons === 1 || event.type === "mousedown"){
            if(event.target.cellIndex !== undefined && event.target.parentElement.rowIndex !== undefined){
                let x = event.target.cellIndex;
                let z = event.target.parentElement.rowIndex;
                MajListe(listeCoordonnees, listeEmplacements, x,z);
            }  
        }  
    }

    function GenererTableau(){
        let tableau = document.querySelector("#table");
        tableau.innerHTML = "";
        let row;
        let d;
        for(let i=0; i<25; i++){
            row = document.createElement("tr");
            tableau.appendChild(row);
            for(let j=0; j<40; j++){
                data = document.createElement("td");
                row.appendChild(data);
            }
        }
    }
