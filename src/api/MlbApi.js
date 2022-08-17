
const MLBStatsAPI = require('mlb-stats-api')
const api = new MLBStatsAPI()
const moment = require('moment')
moment().format()

const getSchedule = async () => {
	let date = moment().subtract(7, 'hours').format('YYYY-MM-DD')
	if (process.env.NODE_ENV === 'staging') {
		date = moment().format('YYYY-MM-DD')
	}
	const response = await api.getSchedule({
		params: {
			sportId: 1,
			date: date,
			teamId: 135
		}
	})
	return response
}
module.exports = { getSchedule }
