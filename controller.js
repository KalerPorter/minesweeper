
__w = 10
__h = 10
__m = 8
c = [];
//__t = "Jimmy"
//
function loadSample(){;
  var request = new XMLHttpRequest();
  request.open("GET", "SampleBoard.json", false);
  request.overrideMimeType("application/json");
  request.setRequestHeader("Content-Type", "x-www-form-urlencoded");
  request.send("");

  var jsonDoc = JSON.parse( request.response);

  __w = jsonDoc.b_width;
  __h = jsonDoc.b_height;
  __m = jsonDoc.b_mines;
  var loadInfo = document.getElementById('loadInfo');

  c = jsonDoc.b_cells;
  startPremade(jsonDoc.b_width, jsonDoc.b_height, jsonDoc.b_mines, jsonDoc.b_cells);
  var board = makeTable(__w, __h, c);
  addListeners(__w,__h,c);

  loadInfo.innerHTML = "Loaded game, set parameters: <br>Height set to " + __h + "<br>Width set to " + __w + "<br>Mines set to " + __m;
  document.getElementById('bombs').innerHTML = "Mines: " + __m;
//
}
function loadLocal(){
  if (localStorage._w === undefined){
    document.getElementById('loadSaveMsg').innerHTML = "Nothing to load";
  }
  __w = parseInt(localStorage._w);
  __h = parseInt(localStorage._h);
  __m = parseInt(localStorage._m);
  c = JSON.parse(localStorage._c);
  // startPremade(localStorage._w, localStorage._h, localStorage._m, JSON.parse(localStorage._c));
  startPremade(__w, __h, __m, c);
  var board = makeTable(__w, __h, c);
  checkStateOnLoad(c);
  addListeners(__w,__h,c);
  document.getElementById('bombs').innerHTML = "Mines: " + __m;

  // console.log("won: "+won+" end: " +gameOver);
  // console.log("loadLocal w: "+__w+" h: " +__h +" m: "+__m);
  redrawGrid(__w,__h,c);
  console.log("loadLocalAfterDraw w: "+__w+" h: " +__h +" m: "+__m);
  // storify.appendChild(c);
  // storify.appendChild({"w":10,"h":10,"m":8});

}

function saveLocal(){
  localStorage.clear();
  document.getElementById('loadSaveMsg').innerHTML = "";

  localStorage._w = __w;
  localStorage._h = __h;
  localStorage._m = __m;
  localStorage._c = JSON.stringify(c);

  console.log(localStorage);

  // storify.appendChild(c);
  // storify.appendChild({"w":10,"h":10,"m":8});

}

function controllerStart()
{
  //__t = document.getElementById('yourname').value
  console.log("ControllerStart w: "+ __w + " h:" + __h + " m:" + __m);
	c = start(__w, __h, __m);
	//demoUncoverAll(c);
	var board = makeTable(__w, __h, c);
  addListeners(__w,__h,c);
 document.getElementById('bombs').innerHTML = "Mines: " + __m;
}

function sizeUp(){
  if (__w < 50){
    __w += 1;
    __h += 1;
  }

  controllerStart();
}

function sizeDown(){
  if ((__w - 1) * (__h - 1) > __m + 5)
  {
    __w -= 1;
    __h -= 1;
  }
  controllerStart();
}

function bombsUp(){
  console.log("before inc m: " + __m);
  if (__w * __h > __m + 1){
    __m += 1;
  }
  console.log("after inc m: " + __m);
  controllerStart();
}

function bombsDown(){
  if (__m > 2){
    __m -= 1;

  }
  controllerStart();
}


function makeTable(x, y, grid)
{
  //var boardTable = document.getElementById("gamediv").createElement('table');
  document.getElementById('gamediv').innerHTML = "";
  var boardTable = document.createElement('table');
  boardTable.id = "boardTable";
  // boardTable.style.bgcolor = "#ffffff";

  document.getElementById('gamediv').appendChild(boardTable);



  //html = "<table id=\"tablegame\">";
  var counter = 0
  var j;
  var i;
  for (j = 0; j < y; j++)
  {
    var boardRow = document.createElement('tr');
    boardTable.appendChild(boardRow);
    for (i = 0; i < x; i++)
    {
      var boardCell = document.createElement('td');
      boardCell.class = "gameSquare";
      //
      //boardCell.xPos2 = i;
      //boardCell.yPos2 = j;

      boardRow.appendChild(boardCell);

      //boardCell.addEventListener("click", function(e){
                //console.log(e);
                //console.log(boardCell.xPos2);
                //cellClicked(boardCell2.xPos, boardCell2.yPos);
      //});

      var boardImg = document.createElement('img');

      boardCell.appendChild(boardImg);
      boardImg.src = getGameImage(grid[j*y+i]);
      boardImg.id = "gameSquare" + counter;
      boardImg.xPos2 = i;
      boardImg.yPos2 = j;
      boardImg.mousedOver = false;


      counter += 1;
      // html += "<td class=\"gameSquare\">"
      // html += "<img id = gameCell" + counter
      // html += " src = \""+getGameImage(grid[j*y+i])+"\">";
      // html += "</td>";
    }
    //html += "</tr>";
  }
  var msg = document.createElement('h3');
  msg.id = "msgBox";
  //msg.innerHTML = "CLICK A CELL, " + __t;
  // msg.style.position = 'relative';
  // msg.style.left = "0px";
  // setInterval(fadeRight, 100);
  document.getElementById('gamediv').appendChild(msg);
  return boardTable;
}

// function fadeRight()
// {
//   var box = document.getElementById('msgBox');
//   var l = parseInt(box.style.left);
//   if (l < 500){
//       l += 1;
//      box.style.left = l + 'px';
//   }
// }

function redrawGrid(x,y,grid)
{
  if (gameOver == true){
  	var boardTab = document.getElementById('boardTable');
  	if (won)
  		boardTab.style.backgroundColor = "green";
  	else
  		boardTab.style.backgroundColor = "red";
  }
  var bc;
  for (j = 0; j < y; j++)
  {
    for (i = 0; i < x; i++)
    {
      bc = getTd(j*x+i);
      bc.src = getGameImage(grid[j*y+i]);
    }
  }
}

function addListeners(x, y, grid)
{

  var bc;
  for (aj = 0; aj < y; aj++)
  {
    for (ai = 0; ai < x; ai++)
    {
      //console.log('listener '+ai+','+aj);
      var self = this;
      var bc = getTd(aj*x+ai);
      bc.addEventListener("click", function(e){
        cellClicked(grid, e.target.xPos2, e.target.yPos2);
        redrawGrid(x,y,grid);
        // document.getElementById('msgBox').innerHTML = "Clicked " + e.target.xPos2 + "," + e.target.yPos2;
        // document.getElementById('msgBox').style.color = "red";
        // document.getElementById('msgBox').style.left -= 30;

      });

      bc.addEventListener("mouseover", function(e){
                // e.srcElement.mousedOver = true;
                // console.log(e.srcElement);
                // e.srcElement.style.color = "red";
                // if (getGameImage(grid[e.srcElement.yPos2*y+e.srcElement.xPos2]) == "untouched.png")
                //   e.srcElement.src = "0.png";
      });

      bc.addEventListener("mouseleave", function(e){
                // e.srcElement.mousedOver = false;
      });

      bc.addEventListener("contextmenu", function(e){
                // e.srcElement.mousedOver = false;
        e.preventDefault();
        cellRightClicked(grid, e.target.xPos2, e.target.yPos2);
        redrawGrid(x,y,grid);
        return false;
      });
            // bc.addEventListener("mouseover", function(e){
      //           console.log(e.srcElement.xPos2, e.srcElement.yPos2);
      //           console.log(e);
      //           //cellClicked(self.xPos2, self.yPos2);
    }
  }
}

function getTd(num){
  return document.getElementById('gameSquare' + num);
}

function getGameImage(cell){
	if (cell.isFlagged)
		return "images/flag.png";
	else if (cell.isCovered)
		return "images/untouched.png";
	else if (cell.isMined)
		return "images/mine.png";

	else
		return "images/"+cell.adjMines+".png";
}
