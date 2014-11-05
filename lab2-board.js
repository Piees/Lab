/**
 * Klasse "Board" representerer en tilstand for en dambrett.
 * Dambrett er en kvadratisk tabell (array) av et visst antall mindre kvadrater.
 * Vanlig størrelse for en dambrett er 8x8 kvadradrater, men klassen "Board"
 * kan representere dambrett av vilkårlig størrelse (ikke uendelig).
 *
 * Hvert kvadrat på dambrettet kan enten inneholde en brikke, representert
 * med klassen "Checker", eller være tom.
 *
 * Hvert kvadrat kan identifiseres med en rad og en kolonne, som er nummerert
 * fra 0 til "size-1" (det totale antallet subtrahert 1).
 *
 * Kvadratet [0,0] er i det venstre øverste hjørne på dambrettet.
 * Rader er nummerert nedover, og kolonner er nummerert til høyre.
 *
 * Kvadratet [0,0] er hvit og hvite og svarte kvadrater alternerer over hver
 * rad og hver kolonne.
 *
 * Dambrett kan forandres, - brikker kan legges til og fjernes, samt de kan
 * flyttes (størrelsen til dambrettet kan ikke forandres under utførelsen
 * av programmet).
 *
 * "Board" er i stand til å sende tre typer hendelser, - henholdsvis "add",
 * "remove" og "move"
 *
 * Hendelses parameter i alle tre tilfeller er av typen "BoardEvent".
 */

// Definerer en klasse i JavaScript.
// Klassen har følgende datafelt:
// 		boardSize (tall)
//		square (tabell)
// 		doCheckRep (sant eller usant)
// Klassen har følgende metoder:
//		checkRep
//		isValidLocation(row, col)
//		isEmptyLocation(row, col)
//
//
var Board = function(size) {
    ////////////////////////////////////////////////
    // Representasjon
    //

    // "boardSize" er antall kvadrater på en side av dambrettet (8 er vanlig)
    this.boardSize = size;

    // "square" er en todimensjonell tabell som representerer dambrettet
    // "square[row][col]" er brikken ("Checker") i kvadraten eller null, hvis kvadraten er tom
    this.square = new Array(this.boardSize);
    // make an empty checkerboard
    for (var i=0; i<=this.boardSize; i++){
		this.square[i] = [];
	}

	// hvis "true" så en representasjons-uavhengig kontroll er mulig
    this.doCheckRep = true;

    this.checkRep = function() {
        if (this.doCheckRep) {
            for (var r in this.square) {
                for (var c in this.square[r]) {
                    if (this.square[r][c]) {
                    	checker = this.square[r][c];
                    	assertTrue(checker.row == r && checker.col == c, "Board representation invariant broken, at " + r + "," + c + "!=" + checker.row + "," + checker.col);
                    }
                }
            }
        }
    }

    /*
	 * Tester om rad og kolonne identifiserer et kvadrat.
     * @throws Genererer Feil hvis enten rad eller kolonne
     * ligger utenfor området [0,size-1]
     */
    this.isValidLocation = function(row, col) {
        if (row >= this.boardSize || col >= this.boardSize) {
        	alert("square [" + row + "," + col + "] is not found " + " in this " + size + "x" + size + " board");
        	return false;
        }
        return true;
    }

    /*
	 * Tester om kvadratet i posisjonen [row,col] er tomt.
     * @throws  Genererer feil hvis kvadratet er IKKE tomt.
     */
    this.isEmptyLocation = function(row, col) {
        if (this.getCheckerAt(row, col)) {
            alert("square [" + row + "," + col + "] is not empty");
            return false;
        }
        return true;
    }

    function assertTrue(f, s){
        if (!f) {
        	alert(s);
        }
    }

    ////////////////////////////////////////////////
    // Metoder som kan brukes av andre klasser (public methods)
    //

    /**
     * board.size er antall av kvadrater på hver side av dambrettet
     */
    this.size = function() {
        return this.boardSize;
    }

    /**
     * Få en brikke som finnes på kvardratet [row,column], eller null
     * hvis kvadratet er tomt. Kravet er at row,column < size
     */
    this.getCheckerAt = function(row, col){
        if (this.isValidLocation(row,col)){
	        return this.square[row][col];
	    }
    }

    /**
     * Få koordinater til en brikke (rad og kolonne) hvis det finnes
     * på brettet, eller null hvis brikken ikke finnes på brettet.
     */
    this.getLocationOf  = function(checker){
    	return {row:checker.row, col:checker.col};
    }

    /**
     * Få en liste med alle brikkene på brettet
     */
    this.getAllCheckers = function(){
    	var results = [];
        for (var r in this.square) {
            for (var c in this.square[r]) {
                if (this.square[r][c]) {
                	results.push(this.square[r][c]);
                }
            }
        }

    	return results;
    }

	/**
     * Legg til en ny brikke på brettet. Det kreves at brikken er ikke på
     * på brettet fra før, og (row,col) må være et tomt kvadrat.
	 */
	this.add = function(checker, row, col){
		if (this.isEmptyLocation(row,col)){

			var details = {checker:checker, row:row, col:col};

			checker.row = row;
			checker.col = col;

			this.square[row][col] = checker;

			// representasjons-uavhengig kontroll bør være tilfredstillt her,
			// før man starter å sende ut hendelser
			this.checkRep();

			this.dispatchBoardEvent("add", details);
		}
	}

	/**
	 * Flytte en brikke fra et kvadrat til et annet kvadrat på brettet.
	 * Det kreves at brikken finnes på brettet og at (toRow,toCol)
     * er et korrekt tomt kvadrat.
	 */
	this.moveTo = function(checker, toRow, toCol){
		if (this.isEmptyLocation(toRow,toCol)){

			var details = {checker:checker, toRow:toRow, toCol:toCol, fromRow:checker.row, fromCol:checker.col};

			delete this.square[checker.row][checker.col];
			this.square[toRow][toCol] = checker;

			if (this.canBeKing(checker, toRow, toCol)){
				this.promote(checker);
			}

			checker.row = toRow;
			checker.col = toCol;

			// representasjons-uavhengig kontroll bør være tilfredstillt her,
			// før man starter å sende ut hendelser
			this.checkRep();

			this.dispatchBoardEvent("move", details);
		}
	}

	/**
	 * Fjern en brikke fra dette brettet. Det kreves at brikken finnes
	 * på bordet.
	 */
	this.remove = function(checker) {
		var details = {checker:checker, row:checker.row, col:checker.col};

		delete this.square[checker.row][checker.col];

		this.checkRep();

		this.dispatchBoardEvent("remove", details);
	}

	/**
	 * Fjern en brikke som befinner seg på en spesifikk posisjon på brettet fra brettet.
     * Det kreves at brikken finnes på brettet.
	 */
	this.removeAt = function(row, col) {
		if (!this.square[row][col]){
			alert("no checker at " + r + "," + c);

		} else {
			var details = {checker:this.square[row][col], row:row, col:col};

			delete this.square[row][col];

			this.checkRep();

			this.dispatchBoardEvent("remove", details);
		}
	}


	/**
	 * Fjerne alle brikkene fra brettet.
	 */
	this.clear = function() {
        for (var r in this.square) {
            for (var c in this.square[r]) {
                if (this.square[r][c]) {
                	this.removeAt(r, c);
                }
            }
        }
	}

	/**
	 * Gjør en brikke til "konge"-brikken
	 */
	this.promote = function(checker) {
		checker.isKing = true;
		this.dispatchBoardEvent("promote", {checker:checker});
	}


    ////////////////////////////////////////////////
    // Grensesnitt som "fanger opp" grensesnitt (events listening interface).
    //

	this.allHandlers = new Array();

	/**
     * Send ut en ny hendelse til alle hendelses "listeners" av den spesifiserte typen
	 */
	this.dispatchBoardEvent = function(type, details){
		var newEvent = new BoardEvent(type, details);

		if (this.allHandlers[type]){
			for (var i in this.allHandlers[type]){
				this.allHandlers[type][i](newEvent);
			}
		}
	}

	/**
 	 * Legge til en ny "listener" av den spesifiserte typen
	 * Parameter "handler" må være en funksjon med en parameter som er en "event objekt"
	 */
	this.addEventListener = function(eventType, handler){
		if (!this.allHandlers[eventType])
			this.allHandlers[eventType] = [];
		this.allHandlers[eventType].push(handler);
	}


    ////////////////////////////////////////////////
    // Verktøy
    //

	/**
	 * Forbereder et nytt brett med standard innstillinger
	 */
	this.prepareNewGame = function(){
		this.checkRep();

		this.clear();

		//red above, black below
		for (var i=0; i<this.boardSize; i++){
			var chkRed = new Checker("red", false);
			var chkBlack = new Checker("black", false);

			this.add(chkRed, (1 - i%2), i);
			this.add(chkBlack , (this.boardSize - 1 - i%2), i);
		}
	}

	/**
	 * Finn en tilfeldig brikke
	 * Returner en "checker" objekt
	 */
	this.getRandomChecker = function(){
		var allCheckers = this.getAllCheckers();
		if (allCheckers){
			return allCheckers[Math.floor(Math.random() * allCheckers.length)];
		}
	}

	/**
	 * Finn en tilfelding ikke-"konge" brikke
	 * Return en "checker" objekt
	 */
	this.getRandomNonKing = function(){
		var allCheckers = this.getAllCheckers();
		var allNonKings = [];
		for (var i in allCheckers){
			if (!allCheckers[i].isKing){
				allNonKings.push(allCheckers[i]);
			}
		}

		if (allNonKings){
			return allNonKings[Math.floor(Math.random() * allNonKings.length)];
		}
	}

	/**
	 * Finn en tilfelding tomt kvadrat
	 * Returnerer {row, col}
	 */
	this.getRandomEmptyLocation = function(){
		var availLocs = [];
        for (var r = 0; r < this.boardSize; ++r) {
            for (var c = 0; c < this.boardSize; ++c) {
                if ((!this.square[r][c]) /*&& (((this.square["row"]%2 == 0) && (this.square["col"]%2 == 1)) || ((this.square["row"]%2 == 1) && (this.square["col"]%2 == 0)))*/) {
                	availLocs.push({row:r, col:c});
                }
            }
        }

		if (availLocs){
			return availLocs[Math.floor(Math.random() * availLocs.length)];
		}
	}

	/**
	 * Sjekke om en brikke kan bli konge på den spesifiserte posisjonen
	 */
	this.canBeKing = function(checker, row, col){
		if (checker.color == "red"){
			return row == this.boardSize - 1;
		} else {
			return row == 0;
		}
	}

    /**.
	 * Få en string representasjon for brettet som en flerlinje matrise.
	 *
     */
    this.toString = function() {
    	var result = "";
        for (var r = 0; r < this.boardSize; ++r) {
            for (var c = 0; c < this.boardSize; ++c) {
                var checker = this.square[r][c];
                if (checker) {
                	result += checker.toString().charAt(0) + " ";
                }else {
                	result += "_ ";
                }
            }
            result += "<br/>";
        }
        return result.toString();
    }
    //holder siste move
    this.lastMove = function(){
      var lMove;
      return lMove[0] + lMove[1];
    }
}
