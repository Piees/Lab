/****
 * BoardEvent representerer en hendelse sendt fra brettet (Board)
 * En BoardEvent objekt inneholder hendelsestype og tilhørende 
 * detaljer.
 */
 
var BoardEvent = function(type, details) {
    ////////////////////////////////////////////////
    // Representasjon
    //
	this.type = type;
	this.details = details;
}