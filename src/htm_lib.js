function getNewCell(isActive, wasActive, isLearning, wasLearning) {
	return Module.ccall('jsGetNewCell', 'number', ['number', 'number', 'number', 'number'], [isActive, wasActive, isLearning, wasLearning]);
}

function getNewSynapse() {
	return Module.ccall('jsGetNewSynapse', 'number');
}

function isSynapseConnected(syn) {
	return Module.ccall('jsIsSynapseConnected', 'number', ['number'], [syn]);
}

function updateSynapseConnected(syn) {
	return Module.ccall('jsUpdateSynapseConnected', 'number', ['number'], [syn]);
}

function initSynapse(syn, inputSource, permanence) {
	return Module.ccall('initSynapse', 'number', ['number', 'number', 'number'], [syn, inputSource, permanence]);
}

function isSynapseActive(syn, connectedOnly) {
	return Module.ccall('isSynapseActive', 'number', ['number', 'number'], [syn, connectedOnly]);
}

function wasSynapseActive(syn, connectedOnly) {
	return Module.ccall('wasSynapseActive', 'number', ['number', 'number'], [syn, connectedOnly]);
}

function wasSynapseActiveFromLearning(syn) {
	return Module.ccall('wasSynapseActiveFromLearning', 'number', ['number'], [syn]);
}

function increaseSynapsePermanence(syn, amount) {
	return Module.ccall('increaseSynapsePermanence', 'number', ['number', 'number'], [syn, amount]);
}

function decreaseSynapsePermanence(syn, amount) {
	return Module.ccall('decreaseSynapsePermanence', 'number', ['number', 'number'], [syn, amount]);
}

function getNewSegment() {
	return Module.ccall('jsGetNewSegment', 'number');
}

function initSegment(seg, segActiveThreshold) {
	return Module.ccall('initSegment', 'number', ['number', 'number'], [seg, segActiveThreshold]);
}

function createSynapse(seg, inputSource, initPerm) {
	return Module.ccall('createSynapse', 'number', ['number', 'number', 'number'], [seg, inputSource, initPerm]);
}

function processSegment(seg) {
	return Module.ccall('processSegment', 'number', ['number'], [seg]);
}

function updateSegmentPermanences(seg, increase) {
	return Module.ccall('updateSegmentPermanences', 'number', ['number', 'number'], [seg, increase]);
}

function nextSegmentTimeStep(seg) {
	return Module.ccall('nextSegmentTimeStep', 'number', ['number'], [seg]);
}

function wasSegmentActiveFromLearning(seg) {
	return Module.ccall('wasSegmentActiveFromLearning', 'number', ['number'], [seg]);
}

function deleteSegment(seg) {
	return Module.ccall('deleteSegment', 'number', ['number'], [seg]);
}

function getSegmentInfo(seg) {
	var info = {
		numActiveConnectedSyns: Module.ccall('jsGetSegNumActiveConnectedSyns', 'number', ['number'], [seg]),
		numActiveAllSyns: Module.ccall('jsGetSegNumActiveAllSyns', 'number', ['number'], [seg]),
		isActive: Module.ccall('jsGetSegIsActive', 'number', ['number'], [seg]),
		numPrevActiveConnectedSyns: Module.ccall('jsGetSegNumPrevActiveConnectedSyns', 'number', ['number'], [seg]),
		wasActive: Module.ccall('jsGetSegWasActive', 'number', ['number'], [seg]),
		numSynapses: Module.ccall('jsGetSegNumSyns', 'number', ['number'], [seg])
	}
	return info;
}

function setCellWasActive(cell, wasActive) {
	return Module.ccall('jsSetCellWasActive', 'number', ['number', 'number'], [cell, wasActive]);
}

function setCellWasLearning(cell, wasLearning) {
	return Module.ccall('jsSetCellWasLearning', 'number', ['number', 'number'], [cell, wasLearning]);
}

function getCellWasActive(cell) {
	return Module.ccall('jsGetCellWasActive', 'number', ['number'], [cell]);
}

function getCellWasLearning(cell) {
	return Module.ccall('jsGetCellWasLearning', 'number', ['number'], [cell]);
}

function getCellIsActive(cell) {
	return Module.ccall('jsGetCellIsActive', 'number', ['number'], [cell]);
}

function getCellIsLearning(cell) {
	return Module.ccall('jsGetCellIsLearning', 'number', ['number'], [cell]);
}

// allocate and copy data to heap, return pointer
function allocateData(data) {
	if(!(data instanceof Uint8Array)) {
		data = new Uint8Array(data);
	}
	var buf = Module._malloc(data.length * 4);
	Module.HEAPU8.set(data, buf);
	return buf;
}

// set data at buf pointer to new data
function setData(buf, data) {
	if(!(data instanceof Uint8Array)) {
		data = new Uint8Array(data);
	}
	Module.HEAPU8.set(data, buf);
}

function getDataFloat(buf, length) {
	var data = [];
	for(var i=0; i<length; i++) {
		data.push(getFloatItemFromArray(buf, i));
	}
	return data;
}

function getData(buf, length) {
	return Module.HEAPU8.subarray(buf, buf + length);
}

function newRegionHardcoded(inputSizeX, inputSizeY, localityRadius,
    cellsPerCol, segActiveThreshold, newSynapseCount, inputData) {
	return Module.ccall('newRegionHardcoded', 'number', ['number', 'number', 'number', 'number', 'number', 'number', 'number'], [inputSizeX, inputSizeY, localityRadius, cellsPerCol, segActiveThreshold, newSynapseCount, inputData]);
}

function newRegion(inputSizeX, inputSizeY, colGridSizeX, colGridSizeY,
    pctInputPerCol, pctMinOverlap, localityRadius,
    pctLocalActivity, cellsPerCol, segActiveThreshold,
    newSynapseCount, inputData) {
	return Module.ccall('newRegion', 'number', ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'], [inputSizeX, inputSizeY, colGridSizeX, colGridSizeY,
    pctInputPerCol, pctMinOverlap, localityRadius,
    pctLocalActivity, cellsPerCol, segActiveThreshold,
    newSynapseCount, inputData]);
}

function getColumnFromRegion(region, columnNr) {
	return Module.ccall('jsGetColumnFromRegion', 'number', ['number', 'number'], [region, columnNr]);
}

function getCellFromColumn(column, cellNr) {
	return Module.ccall('jsGetCellFromColumn', 'number', ['number', 'number'], [column, cellNr]);
}

function getSegmentFromCell(cell, segNr) {
	return Module.ccall('jsGetSegmentFromCell', 'number', ['number', 'number'], [cell, segNr]);
}

function getSynapseFromSegment(seg, synNr) {
	return Module.ccall('jsGetSynapseFromSegment', 'number', ['number', 'number'], [seg, synNr]);
}

function getColumnIsActive(column) {
	return Module.ccall('jsGetColumnIsActive', 'number', ['number'], [column]);
}

function getCellNumSegments(cell) {
	return Module.ccall('jsGetCellNumSegments', 'number', ['number'], [cell]);
}

function getSynapseInputSource(syn) {
	return Module.ccall('jsGetSynapseInputSource', 'number', ['number'], [syn]);
}

function performSpatialPooling(region) {
	return Module.ccall('performSpatialPooling', 'number', ['number'], [region]);	
}

function performTemporalPooling(region) {
	return Module.ccall('performTemporalPooling', 'number', ['number'], [region]);	
}

function runOnce(region) {
	return Module.ccall('runOnce', 'number', ['number'], [region]);	
}

function deleteRegion(reg) {
	return Module.ccall('deleteRegion', 'number', ['number'], [reg]);
}

function getLastAccuracy(region, result) {
	return Module.ccall('getLastAccuracy', 'number', ['number', 'number'], [region, result]);
}

function getFloatItemFromArray(arr, item) {
	return Module.ccall('jsGetFloatItemFromArray', 'number', ['number', 'number'], [arr, item]);	
}

function setRegionTemporalLearning(region, value) {
	return Module.ccall('jsSetRegionTemporalLearning', 'number', ['number', 'number'], [region, value]);
}

function numRegionActiveColumns(reg) {
	return Module.ccall('numRegionActiveColumns', 'number', ['number'], [reg]);
}

function getRegionNumColumns(reg) {
	return Module.ccall('jsGetRegionNumColumns', 'number', ['number'], [reg]);
}

function getRegionInhibitionRadius(reg) {
	return Module.ccall('jsGetRegionInhibitionRadius', 'number', ['number'], [reg]);
}

function getColumnPredictions(region, outData) {
	return Module.ccall('getColumnPredictions', 'number', ['number', 'number'], [region, outData]);
}

function printArr(arr) {
	for(var i=0; i<arr.length;i++) {
		document.writeln(arr[i]);
	}
}

function setDataArr(ptr, item, value) {
	return Module.ccall('jsSetDataArr', 'number', ['number', 'number', 'number'], [ptr, item, value]);
}

function getRandomInt() {
  return Math.floor(Math.random() * 9999999) + 1;
}
