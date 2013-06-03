/**
 * Test the Synapse structure used within the HTM Region.
 */
function testSynapse() {
	console.log("testSynapse()...\n");

	var cell = HTM.getNewCell(true, false, true, false);
	var syn = HTM.getNewSynapse();
	HTM.initSynapse(syn, cell, 2000);
	HTM.updateSynapseConnected(syn);

	var ia = HTM.isSynapseActive(syn, true);
	var wa = HTM.wasSynapseActive(syn, false);
	var wal = HTM.wasSynapseActiveFromLearning(syn);

	if(!ia) console.log("Failed: isSynapseActive1 expected true, got false.");
	if(wa) console.log("Failed: wasSynapseActive expected false, got true.");
	if(wal) console.log("Failed: wasSynapseActiveFromLearning expected false, got true.");

	HTM.decreaseSynapsePermanence(syn, 0);

	HTM.updateSynapseConnected(syn);

	ia = HTM.isSynapseActive(syn, true);
	var ian = HTM.isSynapseActive(syn, false);

	if(ia) console.log("Failed: isSynapseActive2 expected false, got true.");
	if(!ian) console.log("Failed: isSynapseActive3 expected true, got false.");

	HTM.free(syn);
	HTM.free(cell);

	console.log("OK");
}


/**
 * Test the Segment structure used within the HTM Region.
 */
function testSegment() {
  console.log("testSegment()...\n");

  var cell1 = HTM.getNewCell(true, false, false, false);
  var cell2 = HTM.getNewCell(true, false, false, false);

  var seg = HTM.getNewSegment();
  HTM.initSegment(seg, 2);

  var conPerm = 2000;
  var conInc = 150;

  HTM.createSynapse(seg, cell1, conPerm);
  HTM.createSynapse(seg, cell2, conPerm - conInc);

  HTM.processSegment(seg);

  var segInfo = HTM.getSegmentInfo(seg);

  /*Test that simple processSegment counts synapses and sets isActive*/
  if(segInfo.numActiveConnectedSyns != 1) {
    console.log("Failed: processSegment1 expected 1 active connected synapse, got %i\n",
        segInfo.numActiveConnectedSyns);
  }
  if(segInfo.numActiveAllSyns != 2) {
    console.log("Failed: processSegment1 expected 2 active total synapses, got %i\n",
        segInfo.numActiveAllSyns);
  }
  if(segInfo.isActive) {
    console.log("Failed: processSegment1 expected isActive to be false, got true\n");
  }

  /*increase perms, now segment should be active */
  HTM.updateSegmentPermanences(seg, true);
  HTM.nextSegmentTimeStep(seg);
  HTM.processSegment(seg);

  segInfo = HTM.getSegmentInfo(seg);

  if(segInfo.numPrevActiveConnectedSyns != 1) {
    console.log("Failed: processSegment2 expected 1 prevActive connected synapse, got %i\n",
        segInfo.numPrevActiveConnectedSyns);
  }
  if(segInfo.numActiveConnectedSyns != 2) {
    console.log("Failed: processSegment2 expected 2 active connected synapses, got %i\n",
        segInfo.numActiveConnectedSyns);
  }
  if(segInfo.numActiveAllSyns != 2) {
    console.log("Failed: processSegment2 expected 2 active total synapses, got %i\n",
        segInfo.numActiveAllSyns);
  }
  if(!segInfo.isActive) {
    console.log("Failed: processSegment2 expected isActive to be true, got false\n");
  }
  if(segInfo.wasActive) {
    console.log("Failed: processSegment2 expected wasActive to be false, got true\n");
  }

  /*wasSynapseActive && wasLearning*/
  HTM.nextSegmentTimeStep(seg);
  HTM.setCellWasActive(cell1, true);
  HTM.setCellWasActive(cell2, true);
  HTM.setCellWasLearning(cell2, true);

  var wal = HTM.wasSegmentActiveFromLearning(seg);
  if(wal) {
    console.log("Failed: wasSegmentActiveFromLearning1 expected false, got true\n");
  }

  HTM.setCellWasLearning(cell1, true);

  wal = HTM.wasSegmentActiveFromLearning(seg);
  if(!wal) {
    console.log("Failed: wasSegmentActiveFromLearning2 expected true, got false\n");
  }

  HTM.deleteSegment(seg);
  HTM.free(seg);
  HTM.free(cell1);
  HTM.free(cell2);

  console.log("OK\n");
}


/**
 * Very simple test of the HTM Region for correctness.  This test
 * creates a very small region (2 columns) to test very basic
 * connection functionality within the Region.
 */
function testRegion1() {
  console.log("testRegion1()...\n");

  var data = HTM.allocateData([1, 0]);

  var region = HTM.newRegionHardcoded(2,1, 0, 1, 1,1, data);
  var column0 = HTM.getColumnFromRegion(region, 0);
  var column1 = HTM.getColumnFromRegion(region, 1);
  var cell0 = HTM.getCellFromColumn(column0, 0);
  var cell1 = HTM.getCellFromColumn(column1, 0);

  HTM.performSpatialPooling(region);

  /*at this point we expect column0 to be active and col1 to be inactive*/
  if(!HTM.getColumnIsActive(column0))
    console.log("Failed: spatialPooling1 expect col0 to be active, got inactive.\n");
  if(HTM.getColumnIsActive(column1))
    console.log("Failed: spatialPooling1 expect col1 to be inactive, got active.\n");

  HTM.performTemporalPooling(region);

  /*at this point we expect cell0 to be active+learning, cell1 to be inactive*/
  if(!HTM.getCellIsActive(cell0))
    console.log("Failed: temporalPooling1 expect cell0 to be active, got inactive.\n");
  if(!HTM.getCellIsLearning(cell0))
    console.log("Failed: temporalPooling1 expect cell0 to be learning, got false.\n");
  if(HTM.getCellIsActive(cell1))
    console.log("Failed: temporalPooling1 expect cell1 to be inactive, got active.\n");

  /*we expect cell1 to have a new segment with a synapse to cell0*/
  HTM.setData(data, [0, 1]);
  HTM.runOnce(region);


  if(HTM.getCellNumSegments(cell1)!=1) {
    console.log("Failed: runOnce2 expect cell1.numSegments to be 1, got %i\n",
        HTM.getCellNumSegments(cell1));
  }
  else {
  	var segment0 = HTM.getSegmentFromCell(cell1, 0);
  	var nsyn = HTM.getSegmentInfo(segment0).numSynapses;
    if(nsyn!=1)
      console.log("Failed: runOnce2 expect cell0.seg0.numSyn to be 1, got %i.\n", nsyn);
    else {
      var syn = HTM.getSynapseFromSegment(segment0, 0);
      var inputSource = HTM.getSynapseInputSource(syn);

      if(inputSource != cell0)
        console.log("Failed: runOnce2 expect cell1.seg0.syn0 to connect to cell0.\n");
    }
  }

  HTM.deleteRegion(region);
  HTM.free(region);
  HTM.free(data);

  console.log("OK\n");
}


/**
 * This test creates a hardcoded Region of size 250x1 and feeds in data that
 * has 10% (25) elements active.  We then repeat the same sequence 10 times to
 * try to teach the region to learn the full sequence.
 */
function testRegion2() {
  console.log("testRegion2()...\n");

  var accPtr = HTM.malloc(2 * 32);
  var dataPtr = HTM.malloc(250 * 8);
  var region = HTM.newRegionHardcoded(250, 1, 0, 1, 3, 4, dataPtr);
  var data = new Uint8Array(250);

  /*create a sequence of length 10.  repeat it 10 times and check region accuracy. */
  var i,j,k;
  for(k=0; k<10; ++k) {
    for(i=0; i<10; ++i) {
      for(j=0; j<250; ++j) /*reset all data to 0*/
        data[j] = 0;
      for(j=0; j<25; ++j) /*assign next set of 25 to 1's*/
        data[(i*25)+j] = 1;

      HTM.setData(dataPtr, data);
      
      HTM.runOnce(region);


      HTM.getLastAccuracy(region, accPtr);
      var acc = HTM.getDataFloat(accPtr, 2);

      if(k>1 || (k==1 && i>=1)) {
        /*after 1 full sequence presented, we expect 100% accuracy*/
        if(acc[0]!=1.0 && acc[1]!=1.0) {
          console.log("Failed: testRegion2 expect 100% acc (%i %i), got %f, %f\n",
              k, i, acc[0],acc[1]);
        }
      }
      else {
        /*before that we expect 0% accuracy*/
        if(acc[0]!=0.0 && acc[1]!=0.0) {
          console.log("Failed: testRegion2 expect 0% acc (%i %i), got %f, %f\n",
              k, i, acc[0],acc[1]);
        }
      }
    }
  }

  HTM.deleteRegion(region);
  HTM.free(accPtr);
  HTM.free(region);
  HTM.free(data);

  console.log("OK\n");
}

/**
 * This test creates a Region of size 32x32 columns that accepts a larger
 * input of size 128x128.  Each input has a 128x128 sparse bit representation with about
 * 5% of the bits active.  This example is much closer to a Region that works on
 * real world sized data.  It tests the ability of the spatial pooler to produce a
 * sparse represenation in a 32x32 column grid from a much larger 128x128 input array.
 */
function testRegion3() {
  console.log("testRegion3()...\n");

  var DEBUG = true;

  var i,j,k;
  var iters = 0;
  var dataSize = 16384;

  var accPtr = Module._malloc(2 * 32); //floats
  var dataPtr = Module._malloc(dataSize); //chars

  var inputSizeX = 128; /*input data is size 10x10*/
  var inputSizeY = 128;
  var colGridSizeX = 32;/*region's column grid is size 5x5*/
  var colGridSizeY = 32;
  var pctInputPerCol = 0.01; /*each column connects to 1% random input bits*/
  var pctMinOverlap = 0.07;  /*8% (13) of column bits at minimum to be active*/
  var localityRadius = 0;      /*columns can connect anywhere within input*/
  var pctLocalActivity = 0.5;/*half of columns within radius inhibited*/
  var cellsPerCol = 4;
  var segActiveThreshold = 10;
  var newSynapseCount = 10;

  var outDataPtr = HTM.malloc(colGridSizeX * colGridSizeY); //chars

  var region = HTM.newRegion(inputSizeX, inputSizeY, colGridSizeX, colGridSizeY,
        pctInputPerCol, pctMinOverlap, localityRadius, pctLocalActivity, cellsPerCol,
        segActiveThreshold, newSynapseCount, dataPtr);

  HTM.setRegionTemporalLearning(region, true);

  var i,j,k;
  for(k=0; k<10; ++k) {
      for(i=0; i<10; ++i) {
        iters++;
        /*data will contain a 128x128 bit representation*/
        for(j=0; j<dataSize; ++j) /*reset all data to 0*/
          HTM.setDataArr(dataPtr, j, 0);
        for(j=0; j<dataSize/10; ++j) /*assign next 10% set to 1's*/
          HTM.setDataArr(dataPtr, (i*(dataSize/10))+j, 1);
        

        HTM.runOnce(region);

        HTM.getLastAccuracy(region, accPtr);
        var acc = HTM.getDataFloat(accPtr, 2);
        if(DEBUG)
          console.log("\nAcc: %f  %f", acc[0], acc[1]);
        var nc = HTM.numRegionActiveColumns(region);
      if(DEBUG)
        console.log(" nc:%d", nc);

      /*Get the current column predictions.  outData is size 32x32 to match the
       * column grid.  each value represents whether the column is predicted to
       * happen soon.  a value of 1 indicates the column is predicted to be active
       * in t+1, value of 2 for t+2, etc.  value of 0 indicates column is not
       * being predicted any time soon. */
      HTM.getColumnPredictions(region, outDataPtr);
      var outData = HTM.getData(outDataPtr, colGridSizeX * colGridSizeY);
      var p,n1=0, n2=0, n3=0;
      for(p=0,q=HTM.getRegionNumColumns(region); p<q; ++p) {
        n1 += outData[p]==1 ? 1 : 0;
        n2 += outData[p]==2 ? 1 : 0;
        n3 += outData[p]==3 ? 1 : 0;
      }
      if(DEBUG)
        console.log(" np:%i %i %i", n1, n2, n3);
      }
      if(DEBUG)
        console.log("\n");
  }
  if(DEBUG)
    console.log("total iters = %i\n", iters);



  HTM.deleteRegion(region);
  HTM.free(accPtr);
  HTM.free(region);
  HTM.free(dataPtr);
  HTM.free(outDataPtr);

  console.log("OK\n");
}

/**
 * This test creates a hardcoded Region of size 250x1 and feeds in data that
 * has 10% (25) elements active.  We then repeat the same sequence 10 times to
 * try to teach the region to learn the full sequence.  From there we wish to
 * introduce an "anomaly", that is an input that is not expected.  We detect this
 * by examining the prediction accuracy value.  Smaller accuracy indicates a larger
 * anomaly.  For this test we consider accuracy values <30% to be large anomalies, while
 * values 30%-70% are 'possible' anomalies.
 */
function testRegionAnomalyDetection() {
  console.log("testRegionAnomalyDetection()...\n");

  var accPtr = HTM.malloc(2 * 32); //floats
  var dataPtr = HTM.malloc(250); //chars

  var region = HTM.newRegionHardcoded(250,1, 0, 1, 3, 4, dataPtr);

  /*create a sequence of length 10.  repeat it 10 times and check region accuracy. */
  var i,j,k;
  for(k=0; k<11; ++k) {
    /*on final iteration, disable learning and detect anomalies in inference*/
    if(k==10) HTM.setRegionTemporalLearning(region, false);

    for(i=0; i<10; ++i) {
      for(j=0; j<250; ++j) /*reset all data to 0*/
        HTM.setDataArr(dataPtr, j, 0);
      for(j=0; j<25; ++j) /*assign next set of 25 to 1's*/
        HTM.setDataArr(dataPtr, (i*25)+j, 1);

      /* introduce unexpected/anomalous inputs randomly on last iteration */
      if(k >= 10 && HTM.getRandomInt() % 4 == 0) {
        for(j=0; j<250; ++j) /*reset all data to 0*/
          HTM.setDataArr(dataPtr, j, 0);
        for(j=0; j<25; ++j) { /*randomly assign set of 25 to 1's*/
          var ri = HTM.getRandomInt() % 10;
          HTM.setDataArr(dataPtr, (ri*25)+j, 1);
        }
      }

      HTM.runOnce(region);

      HTM.getLastAccuracy(region, accPtr);
      var acc = HTM.getDataFloat(accPtr, 2);

      if(k>1 || (k==1 && i>=1)) {
        /*check for prediction accuracy <30% to be consider 'anomaly'*/
        if(acc[0]<0.3 && acc[1]<0.3) {
          console.log("Anomaly Detected (<0.3 accuracy)! Input (%i %i) produced: %f, %f\n",
              k, i, acc[0],acc[1]);
        }/*console.log("k%i i%i:  aAcc=%f  pAcc=%f\n", k, i, acc[0], acc[1]);*/
        else if(acc[0]<0.7 && acc[1]<0.7) {
          console.log("Possible Anomaly Detected (<0.7 accuracy). Input (%i %i) produced: %f, %f\n",
              k, i, acc[0],acc[1]);
        }
      }
    }
  }

  HTM.deleteRegion(region);
  HTM.free(region);
  HTM.free(accPtr);
  HTM.free(dataPtr);

  console.log("OK\n");
}

/**
 * This test creates a small Region of size 5x5 that is connected to an
 * input of size 10x10.  The input has 10% (10) elements active per time
 * step.
 */
function testRegionSpatialPooling1() {
  console.log("testRegionSpatialPooling1()...\n");

  var DEBUG = true;

  var inputSizeX = 10; /*input data is size 10x10*/
  var inputSizeY = 10;
  var colGridSizeX = 5;/*region's column grid is size 5x5*/
  var colGridSizeY = 5;
  var pctInputPerCol = 0.05; /*each column connects to 5 random input bits*/
  var pctMinOverlap = 0.2;   /*20% (1) of column bits at minimum to be active*/
  var localityRadius = 0;      /*columns can connect anywhere within input*/
  var pctLocalActivity = 1;  /*half of columns within radius inhibited*/
  var cellsPerCol = 1; /*last 3 params only relevant when temporal learning enabled*/
  var segActiveThreshold = 1;
  var newSynapseCount = 1;

  var accPtr = HTM.malloc(2 * 32); //floats
  var dataPtr = HTM.malloc(100);

  var region = HTM.newRegion(inputSizeX, inputSizeY, colGridSizeX, colGridSizeY,
      pctInputPerCol, pctMinOverlap, localityRadius, pctLocalActivity, cellsPerCol,
      segActiveThreshold, newSynapseCount, dataPtr);
  HTM.setRegionTemporalLearning(region, false);

  /*create a sequence of length 10.  repeat it 10 times and check region accuracy. */
  var i,j,k;
  for(k=0; k<10; ++k) {
    for(i=0; i<10; ++i) {
      for(j=0; j<100; ++j) /*reset all data to 0*/
        HTM.setDataArr(dataPtr, j, 0);
      for(j=0; j<10; ++j) /*assign next set of 10 to 1's*/
        HTM.setDataArr(dataPtr, (i*10)+j, 1);

      HTM.runOnce(region);

      var nc = HTM.numRegionActiveColumns(region);
      if(DEBUG)
        console.log(" %d", nc);
    }
    if(DEBUG)
      console.log("   rad=%f\n", HTM.getRegionInhibitionRadius(region));
  }

  HTM.deleteRegion(region);
  HTM.free(region);
  HTM.free(accPtr);
  HTM.free(dataPtr);

  console.log("OK\n");
}

function runTests() {
  //testSynapse();
  //testSegment();
  //testRegion1();
  //testRegion2();
  //testRegion3();
  testRegionAnomalyDetection();
  //testRegionSpatialPooling1();
}
runTests();
