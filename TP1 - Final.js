/********************************************************************************************
AUTHOR: Alice Dorion et Nahuel Londono
DATE: 05 Novembre 2017
PROGRAM'S NAME: labyrinthe.js
PROGRAM'S DESCRIPTION: Génére un labyrinthe de facon aléatoire puis produit un tracé de la
solution en couleur rouge.

*Note*: Ce programme ne fait aucune validation d'input
*********************************************************************************************/

//Retourne les coordonnées d'une cellule dans une grille
var coordonneesCell = function(cellule, nx){
    var coordCell = Array(2);
    coordCell[0] = cellule%nx;
    coordCell[1] = Math.floor(cellule/nx);
    
    return coordCell;
};

//Crée un tableau contenant des chiffres entiers de 0 à  n-1 éléments
var iota = function(n){ 
    var tab = Array(n);
    
    for(var i=0;i<n;i++)
        tab[i]=i;
    
    return tab;
};

//Vérifie si un tableau (tab) contient la valeur (x) et retourne un booléen
var contient = function(tab,x){
    var bool = false;
    
    for(var i=0; i<tab.length; i++){
        if(tab[i] == x){
            bool = true;
            break;
        }
    }
    return bool;
};

//Retourne un tableau contenant les valeurs de (tab) et (x).
var ajouter = function(tab,x){
    
    var tabPlusX = tab;
    
    if (contient(tab, x) == false)
        tabPlusX.push(x);
    
    return tabPlusX;
};

//Retourne un nouveau tableau identique à (tab), sans la valeur (x)
var retirer = function(tab,x){
    
    var tabSansX = tab;

    if(contient(tab,x)){
        for(var i=0; i<tab.length; i++){
            if(tab[i]==x)
                tabSansX.splice(i, 1);
        }
    }
    return tabSansX;
};


var pledgeGauche = function(ajustement,compteur){
    fd(ajustement);
    lt(90);
    compteur++;

    return compteur;
};

var pledgeDroite = function(prochain,compteur){
    rt(90);
    fd(prochain);
    compteur--;
    
    return compteur;
};

//Retourne un tableau contenant les numéros des cellules voisines d'une cellule ayant comme cordonnées (x,y)
var voisins = function(x, y, nx, ny){
    
    var num = nx*y+x;
    var tab = [];

    if(y>0)
        tab.push(num-nx);
    if(x>0)
        tab.push(num-1);
    if(y<ny-1)
        tab.push(num+nx);
    if(x<nx-1)
        tab.push(num+1);

    return tab;
};

//Retourne le numéro du mur d'un coté (Nord,Est,Sud,Ouest) d'une cellule selon ses coordonnées (x,y)
var numDuMur = function(x,y,nx,cote){
    
    var num = 0;
    
    if(cote == 'N') 
        num = x+y*nx;
    else if(cote == 'E')
        num = 1+x+y*(nx+1);
    else if(cote == 'S')
        num = x+(y+1)*nx;
    else if(cote == 'O')
        num = x+y*(nx+1);

    return num;
};

//Génère les murs d'un labyrinthe de format (nx) par (ny)
var genererLaby = function(nx, ny){
    
    var nbCell = nx*ny; //Nombre de cellules dans la grille
    var mursH = iota(nx*(ny+1)-1);  //Ensemble initial de numéros des murs horizontaux (La porte de sortie est le dernier mur horizontal et donc on fait (-1))
    mursH = retirer(mursH,0);  //Porte d'entrée du labyrinthe
    var mursV = iota((nx+1)*ny); //Ensemble initial de numéros des murs verticaux
    
    var cellV; //Cellules voisines de randomCell
    var vDansCave; //Voisins de randomCell qui se trouvent dans cave
    var voisin; //Une cellule parmi cellV lors du tri.
    
    //Coordonnées d'une cellule de vDansCave
    var coordV;
    var coordVx; 
    var coordVy;
    
    var randomCell = Math.floor(Math.random()*nbCell);	//Numéro d'une cellule aléatoire dans la grille
    
    //Coordonnées de randomCell
    var coordC = coordonneesCell(randomCell, nx);
    var coordCx = coordC[0];
    var coordCy = coordC[1];
    
    //État initial de cave et celui de front
    var cave =[randomCell];
    var front = voisins(coordCx,coordCy,nx,ny);
    
    /* À chaque itération, choisir une cellule parmi front; la retirer de front, et l'ajouter a cave; insérer ses voisins dans front; 
    	éliminer aléatoirement un mur qui separait la cellule de la cavite.*/
    for (var nbElementsCave=1; nbElementsCave<nbCell; nbElementsCave++){
            randomCell = front[Math.floor(Math.random()*front.length)];
            
            front = retirer(front, randomCell);
            cave = ajouter(cave, randomCell);
            
            coordC = coordonneesCell(randomCell, nx);
            coordCx = coordC[0];
            coordCy = coordC[1];

            cellV = voisins(coordCx, coordCy, nx, ny); 
            
            vDansCave = [];
        
            //Trier cellV: ajouter les voisins à front s'ils ne sont pas dans cave; les ajouter à vDansCave sinon.
            for(var i = 0; i < cellV.length; i++ ){
                voisin = cellV[i];
                if(contient(cave, voisin))
                    vDansCave.push(voisin);
                
                else
                    front = ajouter(front, voisin);
            }
            
            //Choix aléatoire d'un voisin de randomCell faisant partie de la cavité pour retirer un mur
            
            coordV= coordonneesCell(vDansCave[Math.floor(Math.random()*vDansCave.length)], nx);
            coordVx= coordV[0];
            coordVy= coordV[1];
            
        //Retirer le mur qui sépare le voisin choisi de randomCell
            if(coordCx == coordVx){
                //Le voisin choisi est dans la même colonne que randomCell
                if (coordCy == coordVy+1)//mur Nord
                    mursH = retirer(mursH, randomCell);
                else //Mur Sud
                    mursH = retirer(mursH, randomCell+nx);
            }
            else{ //Le voisin est à gauche ou à droite de randomCell
                if(coordCx == coordVx-1) //mur Ouest
                    mursV = retirer(mursV, coordVx+coordVy*(nx+1));
                else //Mur Est
                    mursV = retirer(mursV, coordVx+1+coordVy*(nx+1));
            }
            
        }
    var murs = [mursH, mursV];
    return murs;
};

//Effectue le tracé des murs du labyrinthe
var dessinerLaby = function(mursH, mursV, nx, ny, pas){
    
    var x0 = -nx*pas/2;	    //Position initiale en x
    var y0 = ny*pas/2;		// Position initiale en y
    var nbMursV = mursV.length; //Nombre de murs verticaux
    var nbMursH = mursH.length; //Nombre de murs horizontaux
    var murIndv;    //Mur individuel à dessiner
    
    //Dessin des murs verticaux
    for(var i=0; i<nbMursV; i++){
        murIndv = mursV[i];
        pu();
        mv(x0 + murIndv%(nx+1)*pas, y0 + Math.floor(murIndv/(nx+1))*-pas);
        pd();
        bk(pas);
    }
    
    //Dessin des murs horizontaux
    rt(90);	
    for(var i=0; i<nbMursH; i++){
       murIndv = mursH[i];
       pu();
       mv(x0+(murIndv % nx)*pas, y0+Math.floor(murIndv/nx)*(-pas));
       pd();
       fd(pas);
    }
    rt(90);
};

//FONCTIONS PRINCIPALES//
var laby = function(nx, ny, pas){
    var murs = genererLaby(nx, ny);
    var mursH = murs[0];
    var mursV = murs[1];
    dessinerLaby(mursH, mursV, nx, ny, pas);
};

//Génère et desinne un labyrinthe, puis trace le trajet de sa solution à l'aide de l'algorithme de Pledge 
var labySol = function(nx, ny, pas){
    
    //Génère les murs du labyrinthe
    var murs = genererLaby(nx, ny);
    var mursH = murs[0];
    var mursV = murs[1];
    
    //Dessine le labyrinthe
    dessinerLaby(murs[0], murs[1], nx, ny, pas);
    
    //Ferme l'entree du labyrinthe
    mursH.push(0);
    
    //Coin supérieur gauche du labyrinthe
    var x0 = -nx*pas/2;	    
    var y0 = ny*pas/2;
    
    var compteur = 0;
    var ajustement = 0.6*pas; //Unite pour avancer a l'interieur d'une cellule
    var prochain = 0.4*pas; //Unite pour avancer lors de passages d'une cellule a l'autre
    var orientation = 0; // 0, 1, 2, 3 designent Sud, Est, Nord, Ouest.
    
    //Tracé rouge
    setpc(1,0,0);
    
    //Positionner la tortue à la position intiale pour le tracé de la solution
    pu();
    mv(x0+0.2*pas, y0+0.2*pas);
    pd();
    fd(prochain); //Entrer dans le labyrinthe
    
    //Coordonnées de la cellule actuelle (départ=(0,0))
    var x = 0;
    var y = 0;
    
    //Tant qu'on n'est pas sorti du labyrinthe, avancer selon l'algorithme de Pledge:
    do{      
        //Si le compteur est 0, avancer tant qu'il n'y a pas d'obstacle
        if (compteur == 0){
            
            if(contient(mursH, numDuMur(x,y,nx,'S'))){ //s'il y a un obstacle, tourner a gauche.
                compteur = pledgeGauche(ajustement,compteur);
            }
            else{ //S'il n'y a pas d'obstacle, avancer vers la prochaine cellule en direction Sud
                fd(pas);
                y++;
            }
        }
        
        else{ //Si le compteur n'est pas 0, longer les murs
            
            orientation = compteur%4;
            
            if(orientation == 1){ //Est
            //S'il n'y a pas de mur à droite, tourner
                if (!contient(mursH, numDuMur(x,y,nx,'S'))){
                    compteur = pledgeDroite(prochain,compteur);
                    y++;
                    continue;
                }
            }
            else if (orientation == 2){//Nord
                if(!contient(mursV, numDuMur(x,y,nx,'E'))){
                    compteur = pledgeDroite(prochain,compteur);
                    x++;
                    continue;
                }
            }
            else if (orientation == 3){ //Ouest
                if(!contient(mursH, numDuMur(x,y,nx,'N'))){
                    compteur = pledgeDroite(prochain,compteur);
                    y--;
                    continue;
                }
            }
            else { //Sud et compteur != 0
                if(!contient(mursV, numDuMur(x,y,nx,'O'))){
                    compteur = pledgeDroite(prochain,compteur);
                    x--;
                    continue;
                }
            }
            //Sinon, il y a un mur a droite; la longer.
           compteur = pledgeGauche(ajustement,compteur);
        }
    }while(y<ny);
};

//Tests unitaires de la fonction (coordonneesCell)
var testCoordonneesCell = function(){
    assert(coordonneesCell(0, 8) == "0,0");
    assert(coordonneesCell(8, 8) == "0,1");
    assert(coordonneesCell(23, 8) == "7,2");
    assert(coordonneesCell(4, 1) == "0,4");
    
};

//Tests unitaires de la fonction (numDuMur)
var testNumDuMur = function(){
    assert(numDuMur(5, 1, 8, 'N') == 13);
    assert(numDuMur(7, 2, 8, 'E') == 26);
    assert(numDuMur(0, 0, 1, 'S') == 1);
    assert(numDuMur(3, 2, 8, 'O') == 21);
    assert(numDuMur(1, 1, 2, 'A') == undefined);
};

//Tests unitaires de la fonction (iota) 
var testIota = function()	{
    assert(iota(5) == "0,1,2,3,4");
    assert(iota(0) == "");
    assert(iota(6).length === 6);
};

//Tests unitaires de la fonction (contient)
var testContient = function(){
    assert(contient([9,2,5], 2));
    assert(!contient([9,2,5], 4));
    assert(!contient([], "a"));
    assert(contient(["a","b","c"], "a"));
    assert(!contient([1, 2, 3], ""));
};

//Tests unitaires de la fonction (ajouter)
var testAjouter = function(){ 
    assert(ajouter([9,2,5], 2) == "9,2,5");
    assert(ajouter([9,2,5], 4) == "9,2,5,4");
    assert(ajouter([], 3) == "3");
};

//Tests unitaires de la fonction (retirer)
var testRetirer = function() {
    assert(retirer([9,2,5], 2) == "9,5");
    assert(retirer([9,2,5], 4) == "9,2,5");
    assert(retirer([], 4) == ""); 
};

//Tests unitaires de la fonction (voisins)
var testVoisins = function() {
    assert(voisins(3,1,8,4) == "3,10,19,12");
    assert(voisins(7,2,8,4) == "15,22,31");
    assert(voisins(0,0,8,4) == "8,1");
    assert(voisins(0,3,8,4) == "16,25");
    assert(voisins(7,0,8,4) == "6,15");
    assert(voisins(7,3,8,4) == "23,30");
    assert(voisins(0,1,1,2) == "0");
    assert(voisins(0,0,1,1) == "");
};

//Tests unitaires des fonctions du programme
var tests = function(){
    testCoordonneesCell();
    testNumDuMur();
    testIota();
    testContient();
    testAjouter();
    testRetirer();
    testVoisins();
};

labySol(8, 4, 20);
tests();
    