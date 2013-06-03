/*
 * Additional functions that will be exposed to Javascript.
 * We need them as Emscripten cannot easiliy pass structs as arguments to functions
 */

#include <stdlib.h>

#include "Region.h"

Cell* jsGetNewCell(int isActive, int wasActive, int isLearning, int wasLearning) {
	Cell* cell = malloc(sizeof(Cell));
	cell->isActive = isActive;
	cell->wasActive = wasActive;
	cell->isLearning = isLearning;
	cell->wasLearning = wasLearning;

	return cell;
}

Synapse* jsGetNewSynapse() {
	Synapse* syn = malloc(sizeof(Synapse));
	return syn;
}

bool jsIsSynapseConnected(Synapse* syn) {
	return (syn->permanence >= CONNECTED_PERM);
}

void jsUpdateSynapseConnected(Synapse* syn) {
	syn->isConnected = (syn->permanence >= CONNECTED_PERM);
}

Segment* jsGetNewSegment() {
	Segment* seg = malloc(sizeof(Segment));
	return seg;
}

int jsGetSegNumActiveConnectedSyns(Segment* seg) {
	return seg->numActiveConnectedSyns;
}

int jsGetSegNumActiveAllSyns(Segment* seg) {
	return seg->numActiveAllSyns;
}

int jsGetSegNumSyns(Segment* seg) {
	return seg->numSynapses;
}

bool jsGetSegIsActive(Segment* seg) {
	return seg->isActive;
}

int jsGetSegNumPrevActiveConnectedSyns(Segment* seg) {
	return seg->numPrevActiveConnectedSyns;
}

bool jsGetSegWasActive(Segment* seg) {
	return seg->wasActive;
}

void jsSetCellWasActive(Cell* cell, bool wasActive) {
	cell->wasActive = wasActive;
}

void jsSetCellWasLearning(Cell* cell, bool wasLearning) {
	cell->wasLearning = wasLearning;
}

bool jsGetCellWasActive(Cell* cell) {
	return cell->wasActive;
}

bool jsGetCellWasLearning(Cell* cell) {
	return cell->wasLearning;
}

bool jsGetCellIsActive(Cell* cell) {
	return cell->isActive;
}

bool jsGetCellIsLearning(Cell* cell) {
	return cell->isLearning;
}

Column* jsGetColumnFromRegion(Region* region, int columnNr) {
	 return &region->columns[columnNr];
}

Cell* jsGetCellFromColumn(Column* column, int cellNr) {
	 return &column->cells[cellNr];
}

Segment* jsGetSegmentFromCell(Cell* cell, int segNr) {
	 return &cell->segments[segNr];
}

Synapse* jsGetSynapseFromSegment(Segment* seg, int synNr) {
	 return &seg->synapses[synNr];
}

bool jsGetColumnIsActive(Column* column) {
	return column->isActive;
}

int jsGetCellNumSegments(Cell* cell) {
	return cell->numSegments;
}

Cell* jsGetSynapseInputSource(Synapse* syn) {
	return syn->inputSource;
}

float jsGetFloatItemFromArray(float* arr, int itemNr) {
	return arr[itemNr];
}

void jsSetRegionTemporalLearning(Region* region, bool value) {
	region->temporalLearning = value;
}

int jsGetRegionNumColumns(Region* region) {
	return region->numCols;
}

void jsSetDataArr(char* ptr, int item, int value) {
	ptr[item] = value;
}

float jsGetRegionInhibitionRadius(Region* region) {
  return region->inhibitionRadius;
}