const express = require('express')
// var cors = require('cors')
const serveStatic = require('serve-static')
const path = require('path')
const app = express()
const port = process.env.PORT || 3000
// app.use(cors())

app.use(serveStatic(path.join(__dirname, 'dist')))

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

app.listen(port, () => {
	console.log('MESS (Mongo Event Sourcing) listening at http://localhost:3000')
})
