const express = require('express')
// var cors = require('cors')
const app = express()

// app.use(cors())

app.use('/', express.static(__dirname + '/wyf-ui/dist'))

let count = '1'

app.get('/count', (req, res) => {
	res.json({
		changed: count
	})
})

const background = function () {
	console.log('backgroung executed')
	setTimeout(background, 5000)
	count++
}

background()

app.listen(3000, () => {
	console.log(`MESS (Mongo Event Sourcing) listening at http://localhost:3000`)
})
