const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')
const app = express()
const port = process.env.PORT || 3000
// MLB API Import
const API = require('./src/api/MlbApi')

app.use(serveStatic(path.join(__dirname, 'dist')))

// Game Data
let schedule
let gameId
let gameStatus

app.get('/game-info', (req, res) => {
	res.json({
		schedule: schedule,
		gameId: gameId,
		gameStatus: gameStatus
	})
})

const currentSchedule = async () => {
	const response = await API.getSchedule()
	gameId = response.data.dates[0].games[0].gamePk
	schedule = response.data.dates[0]
	gameStatus = response.data.dates[0].games[0].status.detailedState
	if (response.data.dates[0].games[0].status.detailedState === 'Scheduled') setTimeout(currentSchedule, 1800000)
	if (response.data.dates[0].games[0].status.detailedState === 'Warmup') setTimeout(currentSchedule, 120000)
	if (response.data.dates[0].games[0].status.detailedState === 'In Progress') setTimeout(currentSchedule, 30000)
	if (response.data.dates[0].games[0].status.detailedState === 'Final') setTimeout(currentSchedule, 3600000)
}

currentSchedule()

app.listen(port, () => {
	console.log('Running')
})
