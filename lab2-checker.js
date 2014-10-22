/**
 * Checker representerer en spillebrikke på brettet.
 * Checker kan være rød eller svart.
 * En Checker kan også være en konge, vanligvis 
 * representert med at to brikker legges opp på
 * hverandre. 
 * I denne modellen for dambrett er en konge representer
 * med en boolsk verdi til variabelen isKing.
 *  
 */
 
var Checker = function(color, isKing) {
    ////////////////////////////////////////////////
    // Representasjon
    //
	if (color != "red" && color != "black") {
		alert('color must be one of "red" or "black"');
	}

	this.color = color;			
	this.isKing = isKing;			
	this.row;
	this.col;

	////////////////////////////////////////////////
	// Felles (public) metoder
	//

	this.toString = function(){			
		var name = this.color;
		if (this.isKing) name = name.toUpperCase();
		return name;
	}
}