function startPremade(width_in, height_in, mines_in, grid_in){
	width = width_in;
	height = height_in;
	mines = mines_in;
	gameOver = false;
	won = false;
	console.log("Loaded this board:");

	printGrid(grid_in);
}

function start(width_in, height_in, mines_in){
	width = width_in;
	height = height_in;
	mines = mines_in;
	gameOver = false;
	won = false;
	cells = makeGrid(width, height);
	initializeGrid(cells, true, mines);
	printGrid(cells);
	return cells;
}

function Cell(){
	this.isCovered = true;
	this.isFlagged = false;
	this.isMined = false;
	this.adjMines = 0;
}

function initializeGrid(grid, random, mineCount){

	minesOnBoard = 0
	//mark mines randomly
	if (random === true){
		while (minesOnBoard < mineCount)
		{
			rand = Math.floor((Math.random()*width*height))
			if (grid[rand].isMined == false){
				grid[rand].isMined = true;
				minesOnBoard += 1;
			}
		}

		//NEED A SORT HERE
	}
	//or not
	else{
		grid[0].isMined = true;
		grid[78].isMined = true;
		grid[40].isMined = true;
		grid[6].isMined = true;
		grid[28].isMined = true;
		grid[34].isMined = true;
		grid[20].isMined = true;
		grid[21].isMined = true;
		grid[23].isMined = true;
		grid[90].isMined = true;
		grid[99].isMined = true;
	}

	//every mine increases all the adjacent cell's adjMines count. boundary checking galore
	for(j = 0; j < height; j++){
		for (i = 0; i < width; i++){
			if (grid[ind(i,j)].isMined){
				if (j > 0){
					if (i > 0)
						grid[ind(i-1,j-1)].adjMines += 1;
					grid[ind(i,j-1)].adjMines += 1;
					if (i < width-1)
						grid[ind(i+1,j-1)].adjMines += 1;
				}

				if (i > 0)
					grid[ind(i-1,j)].adjMines += 1;
				if (i < width-1)
					grid[ind(i+1,j)].adjMines += 1;

				if (j<width-1)
				{
					if (i>0)
						grid[ind(i-1,j+1)].adjMines += 1;
					grid[ind(i,j+1)].adjMines += 1;
					if (i<width-1)
						grid[ind(i+1,j+1)].adjMines += 1;
				}
			}
		}
	}
	return grid;
}

function cellClicked( grid, cx, cy)
{
	console.log("clicked " + cx + "," + cy);

	if (gameOver == false && grid[ind(cx,cy)].isFlagged == false){

		//failstate
		if (grid[ind(cx,cy)].isMined){
			gameOver = true;
			won = false;
			for(j = 0; j < height; j++){
				for (i = 0; i < width; i++){
					if (grid[ind(i,j)].isMined)
					{
						grid[ind(i,j)].isCovered = false;
					}
				}
			}
		}
		else if (grid[ind(cx,cy)].isCovered)
		{
			softUncover(grid, cx, cy);
			if (checkWinState(grid)){
				gameOver = true;
				won = true;
				for(j = 0; j < height; j++){
					for (i = 0; i < width; i++){
						if (grid[ind(i,j)].isCovered)
							grid[ind(i,j)].isFlagged = true;
					}
				}
			}
		}


	}
	return grid;
}

function cellRightClicked (grid, cx, cy)
{
	if (gameOver)
		return grid;
	if (grid[ind(cx,cy)].isCovered)
		grid[ind(cx,cy)].isFlagged = !grid[ind(cx,cy)].isFlagged;
	return grid;
}

function checkStateOnLoad(grid){
	allGoodUncovered = true;
	for(j = 0; j < height; j++){
		for (i = 0; i < width; i++){
			cur = grid[ind(i,j)];

			//instantly move to failed state if there's an uncovered mine
			if (cur.isMined == true && cur.isCovered == false){
				won = false;
				gameOver = true;
				return;
			}

			//wait until we've seen all pieces until this brings us to a non-ended state
			if (cur.isMined == false && cur.isCovered == true)
				allGoodUncovered = false;
		}
	}

	if (allGoodUncovered){
		won = true;
		gameOver = true;
	}
	else
		gameOver = false;
}

function checkWinState(grid){
	for(j = 0; j < height; j++){
		for (i = 0; i < width; i++){
			if (grid[ind(i,j)].isMined == false && grid[ind(i,j)].isCovered == true)
				return false;
		}
	}
	return true;
}

function demoUncoverAll(grid){
	for (j = 0; j < height; j++){
		for (i = 0; i < width; i++){
			grid[ind(i,j)].isCovered = false;
		}
	}
	return grid;
}

function makeGrid(inwidth, inheight){
	var grid = new Array();
	for (i = 0; i < inwidth*inheight; i++){
		grid.push(new Cell());
	}
	return grid;
}

function printGrid(grid){
	printString = "";
	for(j = 0; j < height; j++){
		for (i = 0; i < width; i++){
			if (grid[ind(i,j)].isMined === true)
				printString += "X";
			else
				printString += grid[ind(i,j)].adjMines;
		}
		printString += "\n";
	}
	console.log(printString);
}

function uncover(grid, x, y){
	if (grid[ind(x,y)].isMined == true){
		for(i = 0; i < width*height; i++){
			grid[i].isCovered = false;
		}
		gameOver = true;
		won = false;
	}
	else{
		grid[ind(x,y)].isCovered = false;

		//if adjMines is 0, also uncover adjacent 0 squares
		// if (grid[ind(x,y)].adjMines == 0)
		// {

		// }
	}


}

//
function softUncover(grid, i, j){
	var wasCovered = false;
	if (grid[ind(i,j)].isCovered == true){
		wasCovered = true;
	}
	grid[ind(i,j)].isCovered = false;
	grid[ind(i,j)].isFlagged = false;

	//recursively call softUncover on all adjacent cells
	//only do this if this cell was just uncovered to prevent endless calling
	if (grid[ind(i,j)].adjMines == 0 && wasCovered == true){
		if (j > 0){
			if (i > 0)
				softUncover(grid, i-1, j-1);
			softUncover(grid, i, j-1);
			if (i < width-1)
				softUncover(grid, i+1, j-1);
		}

		if (i > 0)
			softUncover(grid, i-1, j);
		if (i < width-1)
			softUncover(grid, i+1, j);

		if (j<width-1)
		{
			if (i>0)
				softUncover(grid, i-1, j+1);
			softUncover(grid, i, j+1);
			if (i<width-1)
				softUncover(grid, i+1, j+1);
		}
	}
	return grid;
}

function ind(x,y){
	return y*width+x;
}
