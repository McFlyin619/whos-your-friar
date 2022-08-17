
const MLBStatsAPI = require('mlb-stats-api')
const api = new MLBStatsAPI()
const moment = require('moment')
moment().format()

const getSchedule = async () => {
	const response = await api.getSchedule({
		params: {
			sportId: 1,
			date: moment().format('YYYY-MM-DD'),
			teamId: 135
		}
	})
	return response
}
module.exports = { getSchedule }
