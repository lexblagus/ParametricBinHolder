const { execSync } = require('child_process');


const execOpenSCAD = '"/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD"';
const inputFilename = '../files/ParametricBinHolder.scad';
const dirOutput = `../exports`;
const dryRun = false;

const defaults = {
	namePrefix: 'Marfinite Bin Holder',
	thickness: 2,
	binChanferWidth: 10,
};

const templates = [
	{
		name: `${defaults.namePrefix} 1`,
		active: true,
		props: {
			binHeight: 50,
			binWidth: 102,
			binLength: 100,
			binLengthBackFloorOffset: 2.33,

			binChanferHeight: 7.5,
			binChanferHeightThickness: 2,
			binChanferLengthThickness: defaults.thickness,
			binChanferLengthInternal: 3.2,
			binChanferWidth: 10, // 44,

			screwHeadDiameter: 6.8,
			screwHeadHeight: 2.75,
			screwShankDiameter: 3.5,
			screwShankLength: 5,
			screwSpacing: 0.25, // extra space for the screw hole
			screwQuantity: [1, 2],
		}
	},
	{
		name: `${defaults.namePrefix} 3`,
		active: false,
		props: {
			binHeight: 75,
			binWidth: 105,
			binLength: 180,
			binLengthBackFloorOffset: 1.44,
			binChanferHeight: 5.55,
			binChanferHeightThickness: defaults.thickness,
			binChanferLengthThickness: defaults.thickness,
			binChanferLengthInternal: 3.44,
			binChanferWidth: defaults.binChanferWidth, // 105, // (105 / 3) * 2,
		}
	},
	{
		name: `${defaults.namePrefix} 4`,
		active: false,
		props: {
			binHeight: 95,
			binWidth: 130,
			binLength: 210,
			binLengthBackFloorOffset: 1.88,
			binChanferHeight: 6.11,
			binChanferHeightThickness: defaults.thickness,
			binChanferLengthThickness: defaults.thickness,
			binChanferLengthInternal: 3.88,
			binChanferWidth: defaults.binChanferWidth, // 130, // (130 / 3) * 2,
		}
	},
	{
		name: `${defaults.namePrefix} 5`,
		active: false,
		props: {
			binHeight: 120,
			binWidth: 155,
			binLength: 250,
			binLengthBackFloorOffset: 2.33,
			binChanferHeight: 6.66,
			binChanferHeightThickness: defaults.thickness,
			binChanferLengthThickness: defaults.thickness,
			binChanferLengthInternal: 4.33,
			binChanferWidth: defaults.binChanferWidth, // 155, // (155 / 3) * 2,
		}
	},
	{
		name: `${defaults.namePrefix} 6`,
		active: false,
		props: {
			binHeight: 150,
			binWidth: 185,
			binLength: 290,
			binLengthBackFloorOffset: 2.77,
			binChanferHeight: 7.22,
			binChanferHeightThickness: defaults.thickness,
			binChanferLengthThickness: defaults.thickness,
			binChanferLengthInternal: 4.77,
			binChanferWidth: defaults.binChanferWidth, // 185, // (185 / 3) * 2,
		}
	},
	{
		name: `${defaults.namePrefix} 7`,
		active: false,
		props: {
			binHeight: 175,
			binWidth: ( 220 / 2 ),
			binLength: 340,
			binLengthBackFloorOffset: 3.22,
			binChanferHeight: 7.77,
			binChanferHeightThickness: defaults.thickness,
			binChanferLengthThickness: defaults.thickness,
			binChanferLengthInternal: 5.22,
			binChanferWidth: defaults.binChanferWidth, // 220, // (220 / 3) * 2,
		}
	},
	{
		name: `${defaults.namePrefix} 7`,
		active: false,
		props: {
			binHeight: 175,
			binWidth: ( 410 / 3 ),
			binLength: 340,
			binLengthBackFloorOffset: 3.66,
			binChanferHeight: 8.33,
			binChanferHeightThickness: defaults.thickness,
			binChanferLengthThickness: defaults.thickness,
			binChanferLengthInternal: 5.66,
			binChanferWidth: defaults.binChanferWidth, // 410, // (410 / 3) * 2,
		}
	},
	{
		name: `${defaults.namePrefix} 8`,
		active: false,
		props: {
			binHeight: 190,
			binWidth: ( 315 / 2 ),
			binLength: 435,
			binLengthBackFloorOffset: 4.11,
			binChanferHeight: 8.88,
			binChanferHeightThickness: defaults.thickness,
			binChanferLengthThickness: defaults.thickness,
			binChanferLengthInternal: 6.11,
			binChanferWidth: defaults.binChanferWidth, // 315, // (315 / 3) * 2,
		}
	},
	{
		name: `${defaults.namePrefix} 8`,
		active: false,
		props: {
			binHeight: 210,
			binWidth: ( 265 / 2 ),
			binLength: 510,
			binLengthBackFloorOffset: 4.5,
			binChanferHeight: 9.44,
			binChanferHeightThickness: defaults.thickness,
			binChanferLengthThickness: defaults.thickness,
			binChanferLengthInternal: 6.55,
			binChanferWidth: defaults.binChanferWidth, // 265, // (265 / 3) * 2,
		}
	},
	{
		name: `${defaults.namePrefix} 9`,
		active: false,
		props: {
			binHeight: 230,
			binWidth: ( 390 / 2 ),
			binLength: 575,
			binLengthBackFloorOffset: 5,
			binChanferHeight: 10,
			binChanferHeightThickness: defaults.thickness,
			binChanferLengthThickness: defaults.thickness,
			binChanferLengthInternal: 7,
			binChanferWidth: defaults.binChanferWidth, // 390, // (390 / 3) * 2,
		}
	},
];


try{
	!dryRun && execSync(`rm -rf ${dirOutput}`);
	!dryRun && execSync(`mkdir ${dirOutput}`);
} catch (e){}


console.log('='.repeat(80));
console.log("Begin iterate variations", dryRun ? ' in dryrun mode' : '' );

templates.map(template => {
	if( template.active ){
		console.log('-'.repeat(80));
		
		const outputFilename = 
			`${dirOutput}/` + 
			`${template['name']}` + 
			`.stl`;
		console.log(`outputFilename = ${JSON.stringify(outputFilename)}`);
	
		let execThis = '';
		execThis += `${execOpenSCAD} `;
		execThis += `-o "${outputFilename}" `;

		// console.log(`template.props = ${JSON.stringify( template.props )}`);
		Object.keys(template['props']).map( prop => {
			const parameter = `-D ${prop}=${JSON.stringify(template['props'][prop])} `;
			console.log('\t', prop, template['props'][prop], parameter);
			execThis += parameter;
		});
		execThis += `"${inputFilename}" `;
		
		console.log(`execThis = ${execThis}`);
		!dryRun && execSync(execThis);
	}
});

console.log('='.repeat(80));
console.log('Done.');
