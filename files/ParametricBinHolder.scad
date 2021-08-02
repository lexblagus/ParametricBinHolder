/*
————————————————————————————————————————————————————————————————————————————————
CONFIG
————————————————————————————————————————————————————————————————————————————————
*/

// bin measurements (draw technincal image)
binHeight = 52;
binWidth = 102;
binLength = 93;
binLengthBackFloorOffset = 2.2; // should be angle. 0 for straight.

// Chanfer of the bin
binChanferHeight = 7.5;
binChanferHeightThickness = 2.3;
binChanferLengthThickness = 3;
binChanferLengthInternal = 6.5 - binChanferLengthThickness;
binChanferWidth = 10; // 70; // should be minor than binWidth

// Holes
screwHeadDiameter = 6.8;
screwHeadHeight = 2.5; // 0 for flat, > 0 for conical head
screwShankDiameter = 3.3;
screwShankLength = 0;
screwSpacing = 0.25; // extra space for the screw hole
screwQuantity = [1, 1];

// Misc
$fn=360 / 10;
renderTransp = 1;
renderColorPolygon = "blue";
renderColorHoles = "red";
// bleedOffset = 0.25; // tolerance

// Auto-calculated, minor measurements
originX = 0;
originY = 0;
baseHeight = binHeight / 4;
supportChanferHoleLengthAdditional = binChanferLengthThickness * 1;
supportChanferTeethSafeLengthIncrease = 0.25;
supportChanferTeethLengthOffset = 5; // should be angle. 0 for straight.
supportBaseLength = binLength / 3;




/*
————————————————————————————————————————————————————————————————————————————————
MODULES
————————————————————————————————————————————————————————————————————————————————
*/

module start(){
	echo("Script start");

	// Axis indexes
	xA = originX;
	xB = xA;

	xC = xA + binChanferLengthThickness + supportChanferHoleLengthAdditional;
	xD = xC;
	xF = xC + binChanferLengthInternal - supportChanferTeethSafeLengthIncrease;
	xE = xF - ( ( binChanferLengthInternal - supportChanferTeethSafeLengthIncrease ) / 2);
	xG = xF + binLengthBackFloorOffset;
	xH = xG + supportBaseLength;
	xI = xH;
	xJ = xH - (baseHeight / 2);

	yA = originY;
	yJ = yA;
	yH = yA + baseHeight;
	yG = yH;
	yI = yA + yH - (baseHeight / 2);
	yD = yA + baseHeight + binHeight - binChanferHeightThickness;
	yE = yD;
	yB = yD - binChanferHeight - binChanferHeightThickness;
	yC = yB;
	yF = yC + ( (yD - yC) / 2 ); // 
	echo("Axis indexes generated");

	// drawing vector
	dv = [
		[xA, yA],
		[xB, yB],
		[xC, yC],
		[xD, yD],
		[xE, yE],
		[xF, yF],
		[xG, yG],
		[xH, yH],
		[xI, yI],
		[xJ, yJ],
	];
	echo("Drawing vector done");


	// screw holes
	sxA = originX;
	sxB = sxA + screwShankLength;
	sxC = sxB + screwHeadHeight;
	sxD = xG;

	screwQuantityHorizontal = screwQuantity[0] > 0 ? screwQuantity[0] : 0;
	holeHorizontalSpacing = binChanferWidth / (screwQuantityHorizontal + 1);

	holeVerticalOrigin = yG;
	holeVerticalEnd = yB;
	screwQuantityVertical = screwQuantity[1] > 0 ? screwQuantity[1] : 0;
	holeVerticalSpacing = ( holeVerticalEnd - holeVerticalOrigin ) / (screwQuantityVertical + 1);


	difference(){
		monoblock(binChanferWidth, dv);

		for (
			iH = [0 : screwQuantityHorizontal - 1]
		){
			for (
				jV = [0 : screwQuantityVertical - 1]
			){
				translate([
					0,
					holeVerticalOrigin + ( holeVerticalSpacing * (jV + 1) ),
					holeHorizontalSpacing * (iH + 1)
				]){
					rotate([0, 90, 0]){
						// Hole (to be modulerized)
						union(){
							color(renderColorHoles, renderTransp) cylinder(
								h = screwShankLength,
								r = ( screwShankDiameter / 2 ) + screwSpacing,
								center = false
							);
							translate([
								0, 0, screwShankLength
							]){
								color(renderColorHoles, renderTransp) cylinder(
									h = screwHeadHeight,
									r1 = ( screwShankDiameter / 2 ) + screwSpacing,
									r2 = ( screwHeadDiameter / 2) + screwSpacing,
									center = false
								);
							}
							translate([
								0, 0, screwShankLength + screwHeadHeight
							]){
								color(renderColorHoles, renderTransp) cylinder(
									h = xG - xA,
									r = ( screwHeadDiameter / 2) + screwSpacing,
									center = false
								);
							}
						}
						echo("Polygon drilled");
					}
				}
			}
		}
	}
}

module monoblock(h, dv){
	linear_extrude(
		height = h
	) {
		color(renderColorPolygon, renderTransp) polygon(dv);
		echo("Polygon 2D");
	}
	echo("Polygon extruded");
}



/*
————————————————————————————————————————————————————————————————————————————————
BOOTSTRAP
————————————————————————————————————————————————————————————————————————————————
*/
start();
