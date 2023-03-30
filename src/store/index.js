/* eslint-disable no-undef */
import { createStore } from 'vuex'
import ENUM from '@/config/loading.js'
import MLBStatsAPI from 'mlb-stats-api'
const api = new MLBStatsAPI()

export default createStore({
	state: {
		// ==========APP INFO===================
		apiState: ENUM.INIT,
		errMessage: null,
		// ==========USER INFO===================
		token: null,
		tokenExpiration: false,
		didAutoLogout: false,
		currentUser: null,
		// ==========ALL USERS INFO===================
		standings: null,
		// ==========GAME INFO===================
		editPlayer: false,
		gameStatus: null,
		gameDate: null,
		gameTime: null,
		teamsPlaying: null,
		playerEvents: null,
		teamRoster: null,
		boxscore: null,
		gamePlayByPlay: null
	},
	mutations: {
		// ==========APP INFO===================
		setError (state, payload) {
			state.errMessage = payload
		},
		setApiState (state, payload) {
			state.apiState = payload
		},
		// ==========USER INFO===================
		setCurrentUser (state, payload) {
			state.currentUser = payload
		},
		setSessionToken (state, payload) {
			state.token = payload
		},
		setAutoLogout (state) {
			state.didAutoLogout = true
		},
		// ==========ALL USERS INFO===================
		setStandings (state, payload) {
			state.standings = payload
		},
		// ==========GAME INFO===================
		setEditPlayer (state, payload) {
			state.editPlayer = payload
		},
		setGameStatus (state, payload) {
			state.gameStatus = payload
		},
		setPlayerEvents (state, payload) {
			state.playerEvents = payload
		},
		setTeamsPlaying (state, payload) {
			state.teamsPlaying = payload
		},
		setTeamRoster (state, payload) {
			state.teamRoster = payload
		},
		setBoxscore (state, payload) {
			state.boxscore = payload
		},
		setGamePlayByPlay (state, payload) {
			state.gamePlayByPlay = payload
		},
		setGameDateTime (state, payload) {
			state.gameTime = payload.gameTime
			state.gameDate = payload.gameDate
		}
	},
	actions: {

		async createUser (context, payload) {
			context.commit('setError', null)
			context.commit('setApiState', ENUM.LOADING)
			let user = new Parse.User()
			user.set('username', payload.username)
			user.set('email', payload.email)
			user.set('password', payload.password)
			try {
				user = await user.save().then((user) => {
					var Class = Parse.Object.extend('Standings')
					const newUser = new Class()
					newUser.set('userName', user.attributes.username)
					newUser.set('userPoints', 0)
					newUser.set('userId', user.id)
					newUser.set('userTeam', payload.userTeam)
					newUser.set('currentPosition', payload.currentPosition)
					newUser.set('previousPosition', 1)
					newUser.set('gamePoints', 0)
					newUser.set('gamePointsSaved', false)
					newUser.set('currentPlayers', null)
					newUser.set('previousPlayers', undefined)

					newUser.save()
					// localStorage.setItem(
					// 	'Parse/NpUNjfi37nXWf6TcBlVjEgbZkrfGlwQW7sPlAbph/token',
					// 	user.attributes.sessionToken
					// )
					// context.commit('setCurrentUser', user.attributes)
					// context.commit('setSessionToken', user.attributes.sessionToken)
					// const expiresIn = 72000000
					// const expirationDate = new Date().getTime() + expiresIn

					// localStorage.setItem(
					// 	'Parse/NpUNjfi37nXWf6TcBlVjEgbZkrfGlwQW7sPlAbph/tokenExpiration',
					// 	expirationDate
					// )
					// timer = setTimeout(() => {
					// 	context.dispatch('autoLogout')
					// }, expiresIn)
				})
				// if (user !== null) {
				// 	await Parse.User.logIn(payload.username, payload.password).then((user) => {
				// 		var Class = Parse.Object.extend('Standings')
				// 		const newUser = new Class()
				// 		newUser.set('userName', user.attributes.username)
				// 		newUser.set('userPoints', 0)
				// 		newUser.set('userId', user.id)
				// 		newUser.set('userTeam', payload.userTeam)
				// 		newUser.set('currentPosition', payload.currentPosition)
				// 		newUser.set('previousPosition', 1)
				// 		newUser.set('gamePoints', 0)
				// 		newUser.set('currentPlayers', null)
				// 		newUser.set('previousPlayers', undefined)

				// 		newUser.save()
				// 		localStorage.setItem(
				// 			'Parse/NpUNjfi37nXWf6TcBlVjEgbZkrfGlwQW7sPlAbph/token',
				// 			user.attributes.sessionToken
				// 		)
				// 		context.commit('setCurrentUser', user.attributes)
				// 		context.commit('setSessionToken', user.attributes.sessionToken)
				// 		// const expiresIn = 72000000
				// 		// const expirationDate = new Date().getTime() + expiresIn

				// 		// localStorage.setItem(
				// 		// 	'Parse/NpUNjfi37nXWf6TcBlVjEgbZkrfGlwQW7sPlAbph/tokenExpiration',
				// 		// 	expirationDate
				// 		// )
				// 		// timer = setTimeout(() => {
				// 		// 	context.dispatch('autoLogout')
				// 		// }, expiresIn)
				// 	})
				// }
				// console.log(timer)
				context.commit('setApiState', ENUM.LOADED)
			} catch (err) {
				context.commit('setApiState', ENUM.ERROR)
				context.commit('setError', err.message)
				console.log(err.message)
			}
		},
		async login (context, payload) {
			context.commit('setApiState', ENUM.LOADING)
			try {
				await Parse.User.logIn(payload.username, payload.password).then((user) => {
					localStorage.setItem(
						'Parse/NpUNjfi37nXWf6TcBlVjEgbZkrfGlwQW7sPlAbph/token',
						user.attributes.sessionToken
					)
					context.commit('setCurrentUser', user.attributes)
					context.commit('setSessionToken', user.attributes.sessionToken)

					// const expiresIn = 7200000
					// const expirationDate = new Date().getTime() + expiresIn

					// localStorage.setItem(
					// 	'Parse/NpUNjfi37nXWf6TcBlVjEgbZkrfGlwQW7sPlAbph/tokenExpiration',
					// 	expirationDate
					// )
					// timer = setTimeout(() => {
					// 	context.dispatch('autoLogout')
					// }, expiresIn)
				})
				setTimeout(() => {
					context.commit('setApiState', ENUM.LOADED)
				}, 1000)
			} catch (err) {
				context.commit('setApiState', ENUM.ERROR)
				context.commit('setError', err.message)
				console.log(err.message)
			}
		},
		async getGameInfo (context, payload) {
			const response = await api.getSchedule({
				params: { sportId: 1, date: payload.date, teamId: payload.teamId }
			})
			if (response.data.dates[0] !== undefined) {
				// Checks for doubleheader and if the first game is completed
				if (response.data.dates[0].games[1] && response.data.dates[0].games[0].status.abstractGameCode === 'F') {
					const gameId = this.response.data.dates[0].games[1].gamePk
					const teams = this.response.data.dates[0].games[1].teams
					context.commit('setTeamsPlaying', teams)
					context.dispatch('getRoster', payload.teamId)
					context.dispatch('getBoxScore', gameId)
					const dateTime = {
						gameTime: moment(response.data.dates[0].games[1].gameDate).format('h:mm a'),
						gameDate: moment(response.data.dates[0].games[1].gameDate).format('MM DD YYYY')
					}
					context.commit('setGameDateTime', dateTime)

					if (response.data.dates[0].games[1].status.abstractGameCode === 'P') {
						if (process.env.NODE_ENV !== 'production') console.log('Pre Game 2')
						context.dispatch('pregame')
					}
					if (response.data.dates[0].games[1].status.detailedState === 'Warmup') {
						if (process.env.NODE_ENV !== 'production') console.log('Warm Up 2')
						context.dispatch('warmup')
					}
					if (response.data.dates[0].games[1].status.abstractGameCode === 'L') {
						if (process.env.NODE_ENV !== 'production') console.log('Live 2')
						context.dispatch('gameLive')
					}
					if (response.data.dates[0].games[1].status.abstractGameCode === 'F') {
						if (process.env.NODE_ENV !== 'production') console.log('Final 2')
						context.dispatch('gameFinal')
					}
				} else {
					// No doubleheader just one game
					const gameId = this.response.data.dates[0].games[0].gamePk
					const teams = this.response.data.dates[0].games[0].teams
					context.commit('setTeamsPlaying', teams)
					context.dispatch('getRoster', payload.teamId)
					context.dispatch('getBoxScore', gameId)
					const dateTime = {
						gameTime: moment(response.data.dates[0].games[0].gameDate).format('h:mm a'),
						gameDate: moment(response.data.dates[0].games[0].gameDate).format('MM DD YYYY')
					}
					context.commit('setGameDateTime', dateTime)
					if (response.data.dates[0].games[0].status.abstractGameCode === 'P') {
						if (process.env.NODE_ENV !== 'production') console.log('Pre Game 1')
						context.dispatch('pregame')
					}
					if (response.data.dates[0].games[0].status.detailedState === 'Warmup') {
						if (process.env.NODE_ENV !== 'production') console.log('Warm Up 1')
						context.dispatch('warmup')
					}
					if (response.data.dates[0].games[0].status.detailedState === 'In Progress') {
						if (process.env.NODE_ENV !== 'production') console.log('Live 1')
						context.dispatch('gameLive')
					}
					if (response.data.dates[0].games[0].status.abstractGameCode === 'F') {
						if (process.env.NODE_ENV !== 'production') console.log('Final 1')
						context.dispatch('gameFinal')
					}
				}
			} else {
				if (process.env.NODE_ENV !== 'production') console.log('No Games 1')
				context.dispatch('noGames')
			}
		},
		async pregame (context) {
			if (process.env.NODE_ENV !== 'production') console.log('Pregame 1')
			context.commit('setGameStatus', 'pregame')
			// eslint-disable-next-line no-undef
			var query = new Parse.Query('PlayerData')
			query.equalTo('objectId', 'UNPypEjpTA')
			query.first().then((data) => {
				if (data.attributes.allowEditPlayerSelection === true) context.commit('setEditPlayer', true)
				data.save()
			})
		},
		async warmup (context) {
			if (process.env.NODE_ENV !== 'production') console.log('Warm Up 1')
			context.commit('setGameStatus', 'warmup')
			var query = new Parse.Query('Standings')
			const users = await query.find()
			const usersFiltered = users.filter(
				(i) => i.attributes.userTeam.id === this.userItems[0].attributes.userTeam.id
			)
			for (const i in usersFiltered) {
				query.equalTo('objectId', usersFiltered[i].id)
				query.first().then((user) => {
					if (user) {
						user.set('gamePointsSaved', false)
						user.save()
					}
				})
			}
		},
		async gameLive (context) {
			if (process.env.NODE_ENV !== 'production') console.log('Game Currently Live 1')
			context.commit('setEditPlayer', false)
			context.commit('setGameStatus', 'live')
			// eslint-disable-next-line no-undef
			var query = new Parse.Query('PlayerData')
			query.equalTo('objectId', 'UNPypEjpTA')
			query.first().then((data) => {
				if (data.attributes.gameDataSaved === true) {
					data.set('gameDataSaved', false)
					data.set('allowEditPlayerSelection', false)
					data.save()
				}
			})
		},
		// async gameFinal (context) {
		// },
		async getRoster (context, teamId) {
			if (process.env.NODE_ENV !== 'production') console.log('retrieving roster')
			// Retrieves the team roster
			const response = await api.getTeamRoster({
				pathParams: { teamId: teamId }
			})
			context.commit('setTeamRoster', response.data.roster)
			context.commit('setApiState', ENUM.LOADED)
		},
		async getBoxScore (gameId) {
			if (process.env.NODE_ENV !== 'production') console.log('getting boxscore')
			const response = await api.getGameBoxscore({ pathParams: { gamePk: gameId } })
			context.commit('setBoxscore', response)
			context.dispatch('getGamePlayByPlay', gameId)
		},
		async getGamePlayByPlay (gameId) {
			if (process.env.NODE_ENV !== 'production') console.log('getting play by play events')
			// Retrieves all plays from selected game
			const response = await api.getGamePlayByPlay({
				pathParams: { gamePk: gameId }
			})
			context.commit('setGamePlayByPlay', response.data.allPlays)
			this.getPlayerEvents()
		},
		async getStandings (context) {
			var query = new Parse.Query('Standings')
			const data = await query.find()
			const users = []
			for (const i in data) {
				users.push(data[i])
			}

			context.commit('setStandings', users)
		},
		savePlayers (context, payload) {
			var query = new Parse.Query('Standings')
			query.equalTo('userId', payload.userId)
			query.first().then((user) => {
				user.set('currentPlayers', payload.selectedPlayers)
				user.set('previousPlayers', payload.previousPlayers)
				user.set('userTeam', payload.userTeam)
				user.save()
			})
		},
		tryLogin (context) {
			context.commit('setApiState', ENUM.LOADING)
			const sessionToken = localStorage.getItem('Parse/NpUNjfi37nXWf6TcBlVjEgbZkrfGlwQW7sPlAbph/token')
			const tokenExpiration = localStorage.getItem(
				'Parse/NpUNjfi37nXWf6TcBlVjEgbZkrfGlwQW7sPlAbph/tokenExpiration'
			)
			if (sessionToken) {
				Parse.User.become(sessionToken).then((user) => {
					context.commit('setSessionToken', user.attributes.sessionToken)
					context.commit('setCurrentUser', user.attributes)
				})
			}
			const expiresIn = +tokenExpiration - new Date().getTime()
			if (expiresIn > 0) {
				context.commit('setApiState', ENUM.LOADED)
				return
			}
			// timer = setTimeout(() => {
			// 	context.dispatch('autoLogout')
			// }, expiresIn)
			// yes
			setTimeout(() => {
				context.commit('setApiState', ENUM.LOADED)
			}, 1500)
		},
		logout (context) {
			context.commit('setApiState', ENUM.LOADING)
			Parse.User.logOut().then(() => {
				localStorage.removeItem('Parse/NpUNjfi37nXWf6TcBlVjEgbZkrfGlwQW7sPlAbph/token')
				localStorage.removeItem('Parse/NpUNjfi37nXWf6TcBlVjEgbZkrfGlwQW7sPlAbph/tokenExpiration')
				localStorage.removeItem('Parse/NpUNjfi37nXWf6TcBlVjEgbZkrfGlwQW7sPlAbph/currentUser')
				context.commit('setCurrentUser', null)
				context.commit('setSessionToken', null)
			})
			context.commit('setApiState', ENUM.LOADED)
		},
		autoLogout (context) {
			context.dispatch('logout')
			context.commit('setAutoLogout')
		}
	},
	modules: {}
})
