const fs = require('fs')
const filePath = 'raw.txt'
var rawData
var splitData = []
var teamData = []
var summaries = []
var summaryHeader = ["Team Number", "Level 2 Start", "Auton Total", "Auton Hatches", "Auton Cargo", "TeleOp Total", "TeleOp CargoShip Total", "TeleOp CargoShip Hatches", "TeleOp CargoShip Cargo", "TeleOp Rocket Total", "TeleOp Rocket Hatches", "TeleOp Rocket Cargo", "Level 3 Climb", "Level 2 Climb", 'TeleOp Trends']


fs.readFile(filePath, 'utf8', (err, content) => {
	rawData = content.split('\r\n')

	for(var i = 0; i < rawData.length; i++){
		splitData[i] = rawData[i].split('\t')
	}

	for(var i = 1; i < splitData.length - 1; i++) {
		if(teamData[splitData[i][0]] == null) teamData[splitData[i][0]] = []
		var tn = splitData[i][0]
		teamData[tn].push(splitData[i])
	}

	console.log(teamData)

	for(var tn = 0; tn < teamData.length; tn++) {
		var numOfGamesForTeam;
		if(teamData[tn] != null){
			numOfGamesForTeam = teamData[tn].length
			var tempSummary = []
			tempSummary[0] = tn

			//level 2 Start
			var lvl2StartCounter = 0
			for(var c = 0; c < numOfGamesForTeam; c++){
				if(teamData[tn][c][3] == '"""Level 2"""'){
					lvl2StartCounter++
				}
			}
			tempSummary[1] = round(lvl2StartCounter / numOfGamesForTeam)

			//Auton hatch
			var autonHatch = 0
			for(var c = 0; c < numOfGamesForTeam; c++) {
				autonHatch += parseInt(teamData[tn][c][4])
			}
			tempSummary[3] = round(autonHatch / numOfGamesForTeam)

			//Auton cargo
			var autonCargo = 0
			for(var c = 0; c < numOfGamesForTeam; c++) {
				autonCargo += parseInt(teamData[tn][c][5])
			}
			tempSummary[4] = round(autonCargo / numOfGamesForTeam)

			tempSummary[2] = tempSummary[3] + tempSummary[4]

			//CargoShip Hatches
			var hatches = 0
			for(var c = 0; c < numOfGamesForTeam; c++) {
				hatches += parseInt(teamData[tn][c][6])
			}
			tempSummary[7] = round(hatches / numOfGamesForTeam)

			//CargoShip CargoShip
			var cargo = 0
			for(var c = 0; c < numOfGamesForTeam; c++) {
				cargo += parseInt(teamData[tn][c][7])
			}
			tempSummary[8] = round(cargo / numOfGamesForTeam)

			tempSummary[6] = tempSummary[7] + tempSummary[8]

			//Rocket hatches
			var rHatches = 0
			for(var c = 0; c < numOfGamesForTeam; c++) {
				rHatches += parseInt(teamData[tn][c][8])
			}
			tempSummary[10] = round(rHatches / numOfGamesForTeam)

			//Rocket hatches
			var rCargo = 0
			for(var c = 0; c < numOfGamesForTeam; c++) {
				rCargo += parseInt(teamData[tn][c][9])
			}
			tempSummary[11] = round(rCargo / numOfGamesForTeam)

			tempSummary[9] = tempSummary[10] + tempSummary[11]

			tempSummary[5] = tempSummary[6] + tempSummary[9]

			var lvl3Climb = 0
			var succ3 = 0
			var lvl2Climb = 0
			var succ2 = 0
			for(var c = 0; c < numOfGamesForTeam; c++) {
				if(teamData[tn][c][10] == '"""Level 3"""') {
					lvl3Climb++
					if(teamData[tn][c][11] == 'TRUE'){
						console.log('succccc')
						succ3++
					}
				}
				if(teamData[tn][c][10] == '"""Level 2"""') {
					lvl2Climb++
					if(teamData[tn][c][11] == 'TRUE'){
						succ2++
					}
				}
			}
			tempSummary[12] = round(succ3 / lvl3Climb)
			tempSummary[13] = round(succ2 / lvl2Climb)

			tempSummary[14] = ''
			for(var c = 0; c < numOfGamesForTeam; c++){
				tempSummary[14] += parseInt(tempSummary[5]) + '|'
			}
			tempSummary[14] = tempSummary[14].substring(0, tempSummary[14].length - 1)

			console.log(tempSummary)

			summaries.push(tempSummary)
		}
	}

	var finalSummaryData = summaryHeader + '\n'
	for(var i = 0; i < summaries.length; i++) {
		finalSummaryData += summaries[i] + '\n'
	}

	fs.unlink('UsefulSummaries.csv', (err) => {
		fs.writeFile('UsefulSummaries.csv', finalSummaryData, (err) => {
			console.log('done')
		})
	})
})

function round(x) {
	return Math.round(10*x)/10
}
