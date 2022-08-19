<template>
		<div class="grid-container">
			<div class="wrapper ">
				<base-loader v-if="isLoading"></base-loader>
				<nav-bar v-if="userItems" :userItems="userItems"></nav-bar>
					<div v-if="isAuth" class="container">
						<!-- <button v-if="userItems[0].attributes.userName === 'McFlyin'" @click="clearWeeklyPlayers"> clear weekly players</button> -->
						<!-- <button v-if="userItems[0].attributes.userName === 'McFlyin'" @click="saveUserPoints">save history</button> -->
						<div class="row row-cols-1 row-cols-md-5 g-2 mb-4 mt-2">
							<div class="col text-center">
								<a target="_blank" href="https://shareasale.com/r.cfm?b=1396852&amp;u=3344587&amp;m=90184&amp;urllink=&amp;afftrack="><img class="ad-img" src="https://static.shareasale.com/image/90184/logolandscape_clipped_rev_1_170x2xSquar.jpg" border="0" alt="757 Sports Collectibles" /></a>
							</div>
							<div class="col border-yellow user-standing">
								<div v-if="isLoading" class="d-flex justify-content-center">
									<div class="spinner-border" role="status">
										<span class="visually-hidden">Loading...</span>
									</div>

								</div>
								<div v-else class="score">
									<div class="row justify-content-center">Top Players</div>
									<div class="row justify-content-md-center text-white d-block" v-for="(p, index) in topPlayers" :key="p"><span class="color-sand">{{ index + 1 }}.</span> {{p}}</div>
								</div>
							</div>
							<div class="col border-yellow user-standing">
								<div v-if="isLoading" class="d-flex justify-content-center">
									<div class="spinner-border" role="status">
										<span class="visually-hidden">Loading...</span>
									</div>
								</div>
								<div v-else-if="userItems" class="score">
									<div class="row justify-content-center">My Stats</div>
									<div class="row justify-content-between">
										<div class="col-auto color-sand">Position</div>
										<div class="col-auto text-white">#{{ gameStatus === 'Live' ? currentUserPosition : userItems[0].attributes.currentPosition }} / {{ standings.length }}</div>
									</div>
									<div class="row justify-content-between">
										<div class="col-auto color-sand">Total Points</div>
										<div class="col-auto text-success">{{ userItems && gameStatus === 'Live' ? (userItems[0].attributes.userPoints + userSelectedPlayersTotalPoints) : userItems[0].attributes.userPoints }}</div>
									</div>
									<div class="row justify-content-between">
										<div class="col-auto color-sand">Game Points</div>
										<div class="col-auto text-success">{{ gameStatus === 'Live' || gameStatus === 'Final' ? userSelectedPlayersTotalPoints : 0 }}</div>
									</div>
								</div>
							</div>
							<div class="col border-yellow user-standing">
								<div v-if="isLoading" class="d-flex justify-content-center">
									<div class="spinner-border" role="status">
										<span class="visually-hidden">Loading...</span>
									</div>
								</div>
								<div v-else-if="!gameHistory || editPlayer" class="score">
									<div class="row justify-content-center">No History Available</div>
								</div>
								<div v-else-if="!editPlayer" class="score">
									<div class="row justify-content-center d-block"><span class="text-white-50 me-0">{{ historyDate }}</span> Game Stats</div>
									<div v-for="p in userHistory" :key="p" class="row justify-content-between">
										<div role="button" @click="showPlays === null ? showPlays = p.name : showPlays = null" class="col-auto color-sand">
											<i v-if="showPlays === p.name" class="fas fa-caret-down me-2 text-white"></i>
											<i v-else class="fas fa-caret-right me-2"></i>
											{{ p.name }}
										</div>
										<div class="col-auto" :class="{'text-success': p.points > 0, 'text-white': p.points === 0}">+{{ p.points}}</div>
										<div v-show="showPlays === p.name">
											<div
												class="text-white ms-5"
												v-for="play in p.plays.s"
												:key="play"
											>
												<p class="mb-0">
													<small class="color-sand"
														>{{ play.about.halfInning.toUpperCase() }} {{ play.about.inning }}</small
													>
													&#183; <small>{{ play.result.event }}</small>
													<small v-if="play.result.rbi > 0">
														- {{ play.result.rbi }} RBI{{ play.result.rbi > 1 ? "'s" : '' }}</small
													>
												</p>
											</div>
										</div>
									</div>
									<!-- <div class="row justify-content-between">
										<div class="col-auto color-sand">Total Points</div>
										<div class="col-auto text-success">{{ userItems && gameState === 'live' ? (userItems[0].attributes.userPoints + userSelectedPlayersTotalPoints) : userItems[0].attributes.userPoints }}</div>
									</div>
									<div class="row justify-content-between">
										<div class="col-auto color-sand">Game Points</div>
										<div class="col-auto text-success">{{ gameState === 'live' || gameState === 'final' ? userSelectedPlayersTotalPoints : 0 }}</div>
									</div> -->
								</div>
							</div>
							<div class="col border-yellow user-standing">
								<div v-if="isLoading" class="d-flex justify-content-center">
									<div class="spinner-border" role="status">
										<span class="visually-hidden">Loading...</span>
									</div>
								</div>
								<div v-else-if="tomorrowsBoxscore !== null && tomorrowsGameInfo !== null">
									<div class="score" v-if="tomorrowsGameInfo === 'No Game'">No Game Tomorrow</div>
									<div v-else class="score">
										<div class="row justify-content-center time me-1">
											Tomorrow {{ tomorrowsGameTime}}
										</div>
										<div class="row mt-3 d-flex justify-content-between">
											<div class="col text-white team">{{ tomorrowsBoxscore.data.teams.away.team.abbreviation }}</div>
											<div class="col align-self-center text-end color-sand"> {{ tomorrowsGameInfo.teams.away.leagueRecord.wins }} - {{ tomorrowsGameInfo.teams.away.leagueRecord.losses }}</div>
										</div>
										<div class="row d-flex justify-content-between">
											<div class="col text-white team">{{ tomorrowsBoxscore.data.teams.home.team.abbreviation }}</div>
											<div class="col align-self-center color-sand text-end"> {{ tomorrowsGameInfo.teams.home.leagueRecord.wins }} - {{ tomorrowsGameInfo.teams.home.leagueRecord.losses }}</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="text-center">
							<h4 class="font-grad"><span class="text-white">Champion</span> sugarcanechop</h4>
						</div>
					</div>
					<router-view
						:isAuth="isAuth"
						:currentUser="currentUser"
						:editPlayer="editPlayer"
						:loadGameInfo="loadGameInfo"
						:points="points"
						@getInfo="getInfo"
						@clearUserPlayers="clearWeeklyPlayers"
						@editPlayerSelection="setEditPlayerSelection"
						@loadGameInfo="setLoadGameInfo"
						@points="setPoints"
						@events="playerEvents"
						@currentStandings="currentStandings"
						:boxscore="boxscore"
						:battingOrder="battingOrder"
						:playerEvents="playerEvents"
						:gamePlayByPlay="gamePlayByPlay"
						:teamsPlaying="teamsPlaying"
						:userSelectedPlayersTotalPoints="userSelectedPlayersTotalPoints"
						:userItems="userItems"
						:gameStatus="gameStatus"
						:gameTime="gameTime"
						:teamRoster="teamRoster"
					></router-view>
			</div>
			<footer-bar class="mt-5"></footer-bar>
		</div>
</template>

<script>
import moment from 'moment'
import NavBar from '@/components/ui/NavBar.vue'
import FooterBar from '@/components/ui/FooterBar.vue'
import MLBStatsAPI from 'mlb-stats-api'
import ENUM from '@/config/loading.js'
import axios from 'axios'

// Initialize Parse
// eslint-disable-next-line no-undef
Parse.initialize('NpUNjfi37nXWf6TcBlVjEgbZkrfGlwQW7sPlAbph', '9TZO5xhE4Bg8lyrAG7maKvOPPa9DsB86HQZUGn27')
// eslint-disable-next-line no-undef
Parse.serverURL = 'https://mlbotl.b4a.io/'
export default {
	components: {
		NavBar,
		FooterBar
	},
	data () {
		return {
			api: new MLBStatsAPI(),
			// convertedDate: null,
			tomorrow: moment().add(1, 'd').format('YYYY-MM-DD'),
			teamRoster: null,
			playerEvents: null,
			gameId: null,
			gameDate: null,
			gamePlayByPlay: null,
			teamsPlaying: null,
			playerPoints: null,
			boxscore: null,
			battingOrder: null,
			currentWeekDate: null,
			editPlayerSelection: false,
			gameTime: null,
			date: null,
			isLoading: false,
			editPlayer: false,
			loadGameInfo: false,
			points: null,
			tomorrowsGameInfo: null,
			tomorrowsBoxscore: null,
			tomorrowsGameTime: null,
			currentUserPosition: null,
			currentUserStandings: null,
			historyDate: null,
			gameHistory: null,
			usersHistory: null,
			showPlays: null,
			pointsSaved: false,
			gameStatus: null,
			schedule: null
		}
	},
	watch: {
		apiState (val) {
			if (val === 1) {
				this.isLoading = true
			} else {
				this.isLoading = false
			}
		},
		isAuth (val) {
			if (val === true) this.$store.dispatch('getStandings'); this.getEdit()
		}
		// userItems (val) {
		// 	if (val !== null) {
		// 		this.getInfo()
		// 	}
		// }
	},
	created () {
		this.$store.dispatch('tryLogin')
		// this.convertedDate = moment().format('YYYY-MM-DD')
		// this.$store.dispatch('getStandings')
		// if (this.isAuth) {
		// 	this.getEdit()
		// }
		// this.getInfo()
		this.$store.dispatch('test')
		this.loadGameData()
	// 	setTimeout(() => {
	// 		this.getInfo()
	// 	}, 500)
	},
	computed: {
		convertedDate () {
			return moment().format('YYYY-MM-DD')
		},
		apiState () {
			return this.$store.state.apiState
		},
		isAuth () {
			return !!this.$store.state.token
		},
		isGameDataSaved () {
			return this.$store.state.gameDataSaved
		},
		currentUser () {
			return this.$store.state.currentUser
		},
		standings () {
			return this.$store.state.standings
		},
		champion () {
			return this.$store.state.standings.filter(i => i.attributes.winner === 'yes')
		},
		userItems () {
			if (this.currentUser && this.$store.state.standings) {
				return this.$store.state.standings.filter((i) => i.attributes.userName === this.currentUser.username)
			} else {
				return null
			}
		},
		userSelectedPlayersTotalPoints () {
			if (this.currentUser && this.playerEvents && this.$store.state.standings) {
				if (this.userItems[0].attributes.currentPlayers) {
					const players = Object.values(this.playerEvents)
						.filter((i) =>
							this.userItems[0].attributes.currentPlayers.some((j) => i.name.split('.').join('') === j.person.fullName.split('.').join(''))
						)
						.map((i) => i.points)
					const points = players.reduce((a, b) => a + b, 0)
					this.$emit('points', points)
					return points
				} else {
					return null
				}
			} else {
				return null
			}
		},
		// gameStatus () {
		// 	return this.$store.state.gameStatus
		// },
		topPlayers () {
			if (this.$store.state.standings && this.gameStatus !== 'Live') {
				return this.standings.filter((i) => i.attributes.currentPosition <= 3 && i.attributes.currentPosition !== 0).sort((a, b) => a.attributes.currentPosition - b.attributes.currentPosition).map(i => i.attributes.userName)
			} else if (this.$store.state.standings && this.gameStatus === 'Live') {
				this.currentStandings()
				if (this.currentUserStandings !== null) return this.currentUserStandings.filter((ele, i) => (i + 1) <= 3).sort((a, b) => a - b).map(i => i.user.attributes.userName); else return null
			} else {
				return null
			}
		},
		userHistory () {
			if (this.userItems[0]) {
				if (this.userItems[0].attributes.currentPlayers !== null && this.gameHistory !== null) {
					// var game = this.gameHistory
					// if (this.gameStatus === 'final') game = this.playerEvents
					const players = Object.values(this.gameHistory).filter((playerEvents) =>
						this.userItems[0].attributes.currentPlayers.some(
							(player) => playerEvents.name.split('.').join('') === player.person.fullName.split('.').join('')
						)
					)
					return players
				} else {
					return null
				}
			} else {
				return null
			}
		}
	},
	methods: {
		async loadGameData () {
			const result = await axios.get(`${process.env.VUE_APP_APIURL}game-info`)
			console.log(result.data.schedule)
			console.log(result.data.gameId)
			console.log(result.data.gameStatus)
			console.log(result.data.pointsSaved)
			console.log(moment().format('YYYY-MM-DD HH:mm'))
			this.schedule = result.data.schedule
			this.gameId = result.data.gameId
			this.gameStatus = result.data.gameStatus
			this.pointsSaved = result.data.pointsSaved
			this.$store.commit('setGameStatus', result.data.gameStatus)
			this.getInfo()
			if (result.data.gameStatus === 'Scheduled') setTimeout(this.loadGameData, 1800000)
			if (result.data.gameStatus === 'Warmup') setTimeout(this.loadGameData, 120000)
			if (result.data.gameStatus === 'Pre-Game') setTimeout(this.loadGameData, 120000)
			if (result.data.gameStatus === 'Live') setTimeout(this.loadGameData, 30000)
			if (result.data.gameStatus === 'Final') setTimeout(this.loadGameData, 3600000)
		},
		async getHistory () {
			const yesterdaysGameDate = moment().subtract(1, 'days').format('MM-DD-YYYY')
			// var currentGameDate = yesterdaysGameDate
			// if (this.gameStatus === 'final') currentGameDate = this.gameDate
			// console.log(yesterdaysGameDate + 1)
			// eslint-disable-next-line no-undef
			var query = new Parse.Query('History')
			query.equalTo('gameDate', yesterdaysGameDate)
			query.first().then((game) => {
				// console.log(game)
				if (game) {
					this.historyDate = game.attributes.gameDate
					this.gameHistory = game.attributes.gameHistory
				}
			})
		},
		currentStandings () {
			const usersPoints = []
			if (this.standings.length > 0 && this.playerEvents) {
				for (const user in this.standings) {
					if (this.standings[user].attributes.currentPlayers !== null) {
						const players = Object.values(this.playerEvents).filter((playerEvents) =>
							this.standings[user].attributes.currentPlayers.some(
								(player) => playerEvents.name.split('.').join('') === player.person.fullName.split('.').join('')
							)
						)

						// calculates total points from players
						const gamePoints = players.map((i, e) => i.points).reduce((a, b) => a + b, 0)

						const points = {
							user: this.standings[user],
							players: players,
							gamePoints: gamePoints,
							total: this.standings[user].attributes.userPoints + gamePoints
						}
						usersPoints.push(points)
					} else {
						const points = {
							user: this.standings[user],
							players: null,
							gamePoints: 0,
							total: this.standings[user].attributes.userPoints + 0
						}
						usersPoints.push(points)
					}
				}
				const standings = usersPoints.sort((a, b) => b.total - a.total).sort((a, b) => {
					if (b.total === a.total) {
						return b.gamePoints - a.gamePoints
					}
				}).sort((a, b) => {
					if (b.players === null) return 1
					if (a.players === null) return 1
				})
				let pos
				standings.forEach((ele, index) => {
					if (ele.user.attributes.userName === this.currentUser.username) {
						pos = index + 1
					}
				})
				this.currentUserStandings = standings
				this.currentUserPosition = pos
			}
		},
		async tomorrowsGame () {
			if (this.userItems && this.userItems[0].attributes.userTeam !== undefined) {
				const response = await this.api.getSchedule({
					params: {
						sportId: 1,
						date: this.date !== null ? this.date : this.tomorrow,
						teamId: this.userItems[0].attributes.userTeam.id
					}
				})
				if (response.data.dates[0] !== undefined) {
					const boxResponse = await this.api.getGameBoxscore({ pathParams: { gamePk: response.data.dates[0].games[0].gamePk } })
					this.tomorrowsBoxscore = boxResponse
					this.tomorrowsGameTime = moment(response.data.dates[0].games[0].gameDate).format('h:mm a')
					this.tomorrowsGameInfo = response.data.dates[0].games[0]
				} else {
					this.tomorrowsGameInfo = 'No Game'
					this.tomorrowsBoxscore = 'No Game'
				}
			}
		},
		async getInfo () {
			this.tomorrowsGame()
			if (process.env.NODE_ENV !== 'production') console.log('getInfo')
			if (this.userItems && this.userItems[0].attributes.userTeam !== undefined) {
				// const response = await this.api.getSchedule({
				// 	params: {
				// 		sportId: 1,
				// 		date: this.date !== null ? this.date : this.convertedDate,
				// 		teamId: this.userItems[0].attributes.userTeam.id
				// 	}
				// })
				// console.log(response.data.dates[0].games[0].status)
				if (this.schedule !== undefined) {
					// If there is a double header it checks for a second game and if the first game is done
					if (
						this.schedule.games[1] &&
						this.gameStatus === 'Final'
					) {
						this.gameId = this.schedule.games[1].gamePk

						this.teamsPlaying = this.schedule.games[1].teams

						this.gameTime = moment(this.schedule.games[1].gameDate).format('h:mm a')
						this.gameDate = moment(this.schedule.games[1].gameDate).format('MM DD YYYY')

						this.getRoster()
						this.getBoxScore()

						// loads all necessary items for pre game
						if (this.gameStatus === 'Scheduled') {
							if (process.env.NODE_ENV !== 'production') console.log('Pre-Game dd')
							// this.$store.commit('setGameStatus', 'pregame')
							// eslint-disable-next-line no-undef
							var queryG = new Parse.Query('PlayerData')
							queryG.equalTo('objectId', 'UNPypEjpTA')
							queryG.first().then((data) => {
								// console.log(moment(data.attributes.monthStartDate).diff(moment(), 'days'))
								if (data.attributes.allowEditPlayerSelection === true) this.editPlayerSelection = true
								data.set('gameDataSaved', false)
								data.save()
							})
							// eslint-disable-next-line no-undef
							var queryH1 = new Parse.Query('Standings')
							const users = await queryH1.find()
							const usersFiltered = users.filter(
								(i) => i.attributes.userTeam.id === this.userItems[0].attributes.userTeam.id
							)
							for (const i in usersFiltered) {
								// eslint-disable-next-line no-undef
								var queryV = new Parse.Query('Standings')
								queryV.equalTo('objectId', usersFiltered[i].id)
								queryV.first().then((user) => {
									if (user) {
										user.set('gamePointsSaved', false)
										user.save()
									}
								})
							}
							// eslint-disable-next-line no-undef
							var queryJ = new Parse.Query('PlayerData')
							queryJ.equalTo('objectId', 'UNPypEjpTA')
							queryJ.first().then((data) => {
								data.set('gameDataSaved', false)
								data.save()
							})
						}
						if (this.gameStatus === 'Warmup') {
							if (process.env.NODE_ENV !== 'production') console.log('Warm Up dd')
							// this.$store.commit('setGameStatus', 'warmup')
							this.pointsSaved = false
						}
						if (this.gameStatus === 'Live') {
							if (process.env.NODE_ENV !== 'production') console.log('Game Currently Live dd')
							this.editPlayerSelection = false
							// this.$store.commit('setGameStatus', 'live')
							// this.live = true
						}

						if (this.gameStatus === 'Final') {
							this.editPlayerSelection = false
							if (process.env.NODE_ENV !== 'production') console.log('GameOver 1')
							if (this.pointsSaved === false) {
								this.saveUserPoints()
							}
							// this.$store.commit('setGameStatus', 'final')
							// eslint-disable-next-line no-undef
							// var queryJ1 = new Parse.Query('PlayerData')
							// queryJ1.equalTo('objectId', 'UNPypEjpTA')
							// queryJ1.first().then((data) => {
							// 	if (data.attributes.gameDataSaved === false) {
							// 		data.set('allowEditPlayerSelection', false)
							// 		setTimeout(() => {
							// 			this.saveUserPoints()
							// 		}, 1000)
							// 		this.currentWeekDate = data.attributes.weekStartDate
							// 		// data.set('gameDataSaved', true)
							// 		data.save()
							// 	}
							// if (data.attributes.gameDataSaved === false) {
							// 	data.set('allowEditPlayerSelection', false)
							// 	this.saveUserPoints()
							// 	this.currentWeekDate = data.attributes.weekStartDate
							// 	if (moment(this.currentWeekDate).from(moment()) === '8 days ago') {
							// 		setTimeout(() => {
							// 			this.clearWeeklyPlayers()
							// 			data.set('allowEditPlayerSelection', true)
							// 		}, 3000)
							// 	}
							// 	data.save()
							// }
							// }
						}
					} else {
						// this is the for an day with 1 game - will be used the most
						// this.gameId = response.games[0].gamePk
						this.teamsPlaying = this.schedule.games[0].teams
						this.gameTime = moment(this.schedule.games[0].gameDate).format('h:mm a')
						this.gameDate = moment(this.schedule.games[0].gameDate).format('MM-DD-YYYY')
						this.getRoster()
						this.getBoxScore()
						// console.log(response.data.dates[0].games[0].status)
						if (this.gameStatus === 'Scheduled') {
							if (process.env.NODE_ENV !== 'production') console.log('Pre-Game 1')
							// this.$store.commit('setGameStatus', 'pregame')
							// eslint-disable-next-line no-undef
							var queryG1 = new Parse.Query('PlayerData')
							queryG1.equalTo('objectId', 'UNPypEjpTA')
							queryG1.first().then((data) => {
								// console.log(moment(data.attributes.monthStartDate).diff(moment(), 'days'))
								if (data.attributes.allowEditPlayerSelection === true) this.editPlayerSelection = true
								data.save()
							})
						}
						if (this.gameStatus === 'Warmup') {
							if (process.env.NODE_ENV !== 'production') console.log('Warm Up 1')
							// this.$store.commit('setGameStatus', 'warmup')
							this.pointsSaved = false
						}
						if (this.gameStatus === 'Live') {
							if (process.env.NODE_ENV !== 'production') console.log('Game Currently Live 1')
							this.editPlayerSelection = false
							this.pointsSaved = false
							// this.$store.commit('setGameStatus', 'live')
							// eslint-disable-next-line no-undef
							var queryH = new Parse.Query('Standings')
							const users = await queryH.find()
							const usersFiltered = users.filter(
								(i) => i.attributes.userTeam.id === this.userItems[0].attributes.userTeam.id
							)
							for (const i in usersFiltered) {
								// eslint-disable-next-line no-undef
								var queryV1 = new Parse.Query('Standings')
								queryV1.equalTo('objectId', usersFiltered[i].id)
								queryV1.first().then((user) => {
									if (user) {
										user.set('gamePointsSaved', false)
										user.save()
									}
								})
							}
							// eslint-disable-next-line no-undef
							var queryJ1111 = new Parse.Query('PlayerData')
							queryJ1111.equalTo('objectId', 'UNPypEjpTA')
							queryJ1111.first().then((data) => {
								if (data.attributes.gameDataSaved === true) {
									data.set('gameDataSaved', false)
								}
								data.set('allowEditPlayerSelection', false)
								data.set('editPlayerSelection', false)
								data.save()
							})
							// this.live = true
						}
						if (this.gameStatus === 'Final') {
							this.editPlayerSelection = false
							if (process.env.NODE_ENV !== 'production') console.log('GameOver 1')
							// this.$store.commit('setGameStatus', 'final')
							// this.final = true
							// eslint-disable-next-line no-undef
							// var queryK = new Parse.Query('Standings')
							// const users = await queryK.find()
							// const usersFiltered = users.filter(
							// 	(i) => i.attributes.userTeam.id === this.userItems[0].attributes.userTeam.id
							// )
							// if (usersFiltered[0].attributes.gamePointsSaved === false && this.userItems[0].attributes.userName === 'McFlyin') {
							// 	this.saveUserPoints()
							// }
							// eslint-disable-next-line no-undef
							var queryJ11 = new Parse.Query('PlayerData')
							queryJ11.equalTo('objectId', 'UNPypEjpTA')
							queryJ11.first().then((data) => {
								if (data.attributes.gameDataSaved === false) {
									data.set('allowEditPlayerSelection', false)
									setTimeout(() => {
										this.saveUserPoints()
									}, 500)
									this.currentWeekDate = data.attributes.weekStartDate
									// data.set('gameDataSaved', true)
									data.save()
								}
							})
						}
					}
				} else {
					console.log('No Games Today 1')
					this.$store.commit('setGameStatus', 'no games')
					// this.noGames = true
					// eslint-disable-next-line no-undef
					var queryN = new Parse.Query('PlayerData')
					queryN.equalTo('objectId', 'UNPypEjpTA')
					queryN.first().then((data) => {
						if (data.attributes.allowEditPlayerSelection === true) this.editPlayerSelection = true
					})
				}
			}
			this.getHistory()
		},
		async getRoster () {
			if (process.env.NODE_ENV !== 'production') console.log('retrieving roster')
			// Retrieves the team roster
			const response = await this.api.getTeamRoster({
				pathParams: { teamId: this.userItems[0].attributes.userTeam.id }
			})
			this.teamRoster = response.data.roster
			this.$store.commit('setApiState', ENUM.LOADED)
		},
		async getBoxScore () {
			if (process.env.NODE_ENV !== 'production') console.log('getting boxscore')
			const response = await this.api.getGameBoxscore({ pathParams: { gamePk: this.gameId } })
			this.boxscore = response
			this.getGamePlayByPlay()
		},
		async getGamePlayByPlay () {
			if (process.env.NODE_ENV !== 'production') console.log('getting play by play events')
			// Retrieves all plays from selected game
			const response = await this.api.getGamePlayByPlay({
				pathParams: { gamePk: this.gameId }
			})
			this.gamePlayByPlay = response.data.allPlays
			this.getPlayerEvents()
		},
		async getPlayerEvents () {
			if (process.env.NODE_ENV !== 'production') console.log('displaying player events')
			if (this.boxscore) {
				var order = []
				if (this.boxscore.data.teams.away.team.id === this.userItems[0].attributes.userTeam.id) {
					order = this.boxscore.data.teams.away.players
					this.battingOrder = Object.values(order)
						.filter((i) => i.battingOrder)
						.sort((a, b) => {
							return parseInt(a.battingOrder) - parseInt(b.battingOrder)
						})
				}
				if (this.boxscore.data.teams.home.team.id === this.userItems[0].attributes.userTeam.id) {
					order = this.boxscore.data.teams.home.players
					this.battingOrder = Object.values(order)
						.filter((i) => i.battingOrder)
						.sort((a, b) => {
							return parseInt(a.battingOrder) - parseInt(b.battingOrder)
						})
				}
			}
			// sets roster
			const roster = this.teamRoster
			// creates new array by adding all the plays to an object with the player based on the teams roster
			this.playerEvents = roster.reduce((obj, curr) => {
				// gets baserunning stats for stealing only
				const runners = []

				const baserunners = this.gamePlayByPlay.map((i) => i.runners)

				for (const i in baserunners) {
					var found = false

					for (const j in baserunners[i]) {
						if (
							baserunners[i][j].details.eventType.includes('stolen') ||
							baserunners[i][j].details.rbi === true
						) {
							found = true
						}

						if (found) runners.push(baserunners[i][j])
					}
				}
				const stats = this.gamePlayByPlay.filter((i) => i.matchup.batter.id === curr.person.id)

				if (stats) {
					// points
					var count = 0
					// adds baserunning stats to the correct player
					const steal = runners.filter(
						(i) => i.details.runner.id === curr.person.id && i.details.eventType.includes('stolen')
					)

					const run = runners.filter((i) => i.details.runner.id === curr.person.id && i.details.rbi === true)

					var br = []
					// adds points for a stolen base
					if (steal.length > 0) {
						for (const i in steal) {
							count += 2
							br.push(steal[i].details.event)
						}
					}
					// add points for run scored
					if (run.length > 0) {
						for (const i in run) {
							count += 2
							br.push('1 run ' + run[i].movement.end + 'd')
						}
					}
					// calculates points based on results
					for (const i in stats) {
						if (stats[i].result.eventType === 'walk') count += 1
						if (stats[i].result.eventType === 'single') count += 1
						if (stats[i].result.eventType === 'double') count += 2
						if (stats[i].result.eventType === 'triple') count += 3
						if (stats[i].result.eventType === 'home_run') count += 5
						if (stats[i].result.rbi) count += stats[i].result.rbi * 2
					}
				}
				// constructs object to be displayed
				obj[curr.person.fullName.split('.').join('')] = {
					id: curr.person.id,
					name: curr.person.fullName.split('.').join(''),
					plays: {
						s: stats,
						b: br
					},
					points: count
				}
				return obj
			}, {})
			this.$store.commit('setPlayerEvents', this.playerEvents)
		},
		async sleep (ms) {
			return new Promise(resolve => setTimeout(resolve, ms))
		},
		async saveHistory () {
			if (process.env.NODE_ENV !== 'production') console.log('saving game history 1')
			const events = this.playerEvents
			// console.log(events)
			// eslint-disable-next-line no-undef
			var Class = Parse.Object.extend('History')
			const gameHistory = new Class()
			gameHistory.set('gameHistory', events)
			gameHistory.set('gameDate', this.gameDate)
			gameHistory.save()
		},
		async saveUserPoints () {
			// eslint-disable-next-line no-undef
			var queryJ11 = new Parse.Query('PlayerData')
			queryJ11.equalTo('objectId', 'UNPypEjpTA')
			queryJ11.first().then((data) => {
				if (data.attributes.gameDataSaved === false) {
					data.set('allowEditPlayerSelection', false)
					data.set('gameDataSaved', true)
					data.save()
				}
			})
			const response = await this.api.getSchedule({
				params: {
					sportId: 1,
					date: this.date !== null ? this.date : this.convertedDate,
					teamId: this.userItems[0].attributes.userTeam.id
				}
			})
			if (response.data.dates[0].games[0].status.abstractGameCode === 'F') {
				if (process.env.NODE_ENV !== 'production') console.log('saving user points 1')
				// eslint-disable-next-line no-undef
				var query = new Parse.Query('Standings')
				const users = await query.find()
				const usersFiltered = users.filter(
					(i) => i.attributes.userTeam.id === this.userItems[0].attributes.userTeam.id && i.attributes.currentPlayers !== null
				)
				for (const i in usersFiltered) {
					if (usersFiltered[i].attributes.currentPlayers) {
						// gets users selected players plays only
						const players = Object.values(this.playerEvents).filter((playerEvents) =>
							usersFiltered[i].attributes.currentPlayers.some(
								(player) => playerEvents.name === player.person.fullName.split('.').join('')
							)
						)
						// calculates total points from players
						const points = players.map((i) => i.points).reduce((a, b) => a + b, 0)
						// creates a new object of the users selected players plays, points, and the date of the game for searching later
						// const history = players.map((a) => {
						// 	return {
						// 		...a,
						// 		date: this.gameDate
						// 	}
						// })
						// saves user points, current position, and the history
						// eslint-disable-next-line no-undef
						var queryU = new Parse.Query('Standings')
						queryU.equalTo('objectId', usersFiltered[i].id)
						queryU.first().then((us) => {
							// console.log(us.attributes)
							// if (us.attributes.gameHistory !== undefined) {
							// 	var newHistory = us.attributes.gameHistory
							// 	newHistory.push(history)
							// } else {
							// 	newHistory = history
							// }
							us.set('userPoints', points + us.attributes.userPoints)
							us.set('gamePoints', points)
							us.set('previousPosition', us.attributes.currentPosition)
							us.set('gamePointsSaved', true)
							// us.set('gameHistory', newHistory)
							us.save()
						})
					}
				}
				// eslint-disable-next-line no-undef
				// var queryJ11 = new Parse.Query('PlayerData')
				// queryJ11.equalTo('objectId', 'UNPypEjpTA')
				// queryJ11.first().then((data) => {
				// 	if (data.attributes.gameDataSaved === false) {
				// 		data.set('gameDataSaved', true)
				// 		// if (moment(this.currentWeekDate).from(moment()) === '8 days ago') {
				// 		// 	setTimeout(() => {
				// 		// 		this.clearWeeklyPlayers()
				// 		// 		data.set('allowEditPlayerSelection', true)
				// 		// 	}, 3000)
				// 		// }
				// 		data.save()
				// 	}
				// })
				this.saveHistory()
				await this.sleep(800)
				this.setUserPositions()
				this.pointsSaved = true
			}
		},
		async setUserPositions () {
			// eslint-disable-next-line no-undef
			var query = new Parse.Query('Standings')
			// retrieves users by total points after game points have been saved - the users new order
			const data = await query.find()
			// console.log(data)
			//  creates a new array sorted by points and filtered by team/game to grab the index for new user standings
			const dataMap = data
				.filter((i) => i.attributes.userTeam.id === this.userItems[0].attributes.userTeam.id)
				.sort((a, b) => b.attributes.userPoints - a.attributes.userPoints)
			const dataMap2 = dataMap.sort((a, b) => {
				if (b.attributes.userPoints === a.attributes.userPoints) {
					return b.attributes.gamePoints - a.attributes.gamePoints
				}
			})
			const dataMap3 = dataMap2.sort((a, b) => {
				if (b.attributes.gamePoints === a.attributes.gamePoints) {
					return a.attributes.previousPosition - b.attributes.previousPosition
				}
			})
			const dataMap4 = dataMap3.sort((a, b) => {
				if (b.attributes.currentPlayers === null) return 1
				if (a.attributes.currentPlayers === null) return 1
			})
			// console.log(dataMap4)
			dataMap4.forEach((element, index) => {
				// console.log(element.attributes.userName + ' ' + index)
				// eslint-disable-next-line no-undef
				var query1 = new Parse.Query('Standings')
				query1.equalTo('objectId', element.id)
				query1.first().then((u) => {
					// console.log(u.attributes.userName + ' ' + (index + 1))
					const pos = dataMap.findIndex((i) => {
						return i.id === u.id
					})
					console.log(pos + ' ' + element.attributes.userName)
					console.log(index + ' ' + element.attributes.userName)
					u.set('currentPosition', (pos + 1))
					u.save()
				})
			})
		},
		setPoints (val) {
			this.points = val
		},
		getEdit () {
			if (process.env.NODE_ENV !== 'production') console.log('get edit 1')
			// eslint-disable-next-line no-undef
			var queryN = new Parse.Query('PlayerData')
			queryN.equalTo('objectId', 'UNPypEjpTA')
			queryN.first().then((data) => {
				if (data.attributes.allowEditPlayerSelection === true) this.setEditPlayerSelection(true)
				else this.setEditPlayerSelection(false)
			})
		},
		setLoadGameInfo () {
			this.loadGameInfo = true
		},
		setEditPlayerSelection (val) {
			this.editPlayer = val
		},
		async clearWeeklyPlayers () {
			if (process.env.NODE_ENV !== 'production') console.log('clearing weekly player selections 1')
			// var today = moment()
			const newDate = moment().format('YYYY-MM-DD')
			// eslint-disable-next-line no-undef
			var queryF = new Parse.Query('PlayerData')
			queryF.equalTo('objectId', 'UNPypEjpTA')
			queryF.first().then((data) => {
				data.set('weekStartDate', newDate)
				data.save()
			})
			// eslint-disable-next-line no-undef
			var query = new Parse.Query('Standings')
			const users = await query.find()
			for (const i in users) {
				if (users[i].attributes.currentPlayers) {
					// eslint-disable-next-line no-undef
					var queryU = new Parse.Query('Standings')
					queryU.equalTo('objectId', users[i].id)
					queryU.first().then((user) => {
						if (user) {
							user.set('currentPlayers', null)
							user.save()
						}
					})
				}
			}
		}
	}
}
</script>

<style scoped>
.bounce-enter-active {
  animation: bounce-in 1.5s;
}
.bounce-leave-active {
  animation: bounce-in 1.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.55);
  }
  100% {
    transform: scale(1);
  }
}

.score {
	padding:10px;
	min-height: 10vh;
}

.border-yellow {
	border-radius: 5px;
}

.team {
	font-size: 1.25rem;
}

.ad-img {
	max-width:100%;
	max-height:100%;
	border-radius: 5px
}
</style>
