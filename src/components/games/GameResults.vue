<template>
	<div v-if="currentUser" class="container mt-5">
		<div v-if="gameStatus === 'no games'">
			<h1>No Games Today</h1>
		</div>
		<div v-if="(gameStatus === 'Scheduled' || gameStatus === 'Warmup' || gameStatus === 'Pre-Game') && userItems && boxscore && teamsPlaying">
			<h2 class="text-center">Scheduled first pitch at {{ gameTime }}</h2>
			<h4 class="text-center color-sand">
				From {{ boxscore.data.teams.home.team.venue.name }} in {{ boxscore.data.teams.home.team.locationName }}
			</h4>
			<div class="row mt-5 text-center">
				<div class="col-md d-flex justify-content-center">
					<h1>{{ boxscore.data.teams.home.team.abbreviation }}</h1>
					<h5 class="record align-self-center text-white ms-2">
						({{ teamsPlaying.home.leagueRecord.wins }} - {{ teamsPlaying.home.leagueRecord.losses }})
					</h5>
				</div>
				<h2 class="col-md text-white">VS</h2>
				<div class="col-md d-flex justify-content-center">
					<h1>{{ boxscore.data.teams.away.team.abbreviation }}</h1>
					<h5 class="record align-self-center text-white ms-2">
						({{ teamsPlaying.away.leagueRecord.wins }} - {{ teamsPlaying.away.leagueRecord.losses }})
					</h5>
				</div>
			</div>
			<div class="d-flex justify-content-center">
				<ul v-if="battingOrder !== null && teamRoster" class="list-group-flush">
					<li class="list-group-item bg-brown color-yellow" v-for="(id) in battingOrder" :key="id">
						<div>
							<span class="color-sand"> {{ id.battingOrder[0] }}. </span>
							{{ id.person.fullName }}
							<span class="text-white">
								{{ id.position.abbreviation }}
							</span>
							<span v-for="player in userItems[0].attributes.currentPlayers" :key="player">
								<i v-if="id.person.id === player.person.id" class="fa-solid fa-square-check text-success ms-2"></i>
							</span>
						</div>
						<div>
							<span class="ms-3 color-sand"
								>{{ id.seasonStats.batting.avg }} / {{ id.seasonStats.batting.obp }} /
								{{ id.seasonStats.batting.slg }}</span
							>
						</div>
					</li>
				</ul>
			</div>
		</div>
		<!-- <div
			v-if="
				live &&
				userItems &&
				boxscore &&
				teamRoster &&
				teamsPlaying &&
				playerEvents &&
				gamePlayByPlay &&
				battingOrder
			"
		>
			<h1 class="text-center mb-5">Live</h1>
			<div class="row mb-5 border-bottom-yellow text-center">
				<div class="col">
					<h2>
						{{ boxscore.data.teams.home.team.abbreviation }}
						<span class="text-white">{{ teamsPlaying.home.score }}</span>
					</h2>
				</div>
				<div class="col text-white">
					{{ gamePlayByPlay.slice(-1)[0].about.halfInning }} {{ gamePlayByPlay.slice(-1)[0].about.inning
					}}{{
						gamePlayByPlay.slice(-1)[0].about.inning === 1
							? 'st'
							: gamePlayByPlay.slice(-1)[0].about.inning === 2
							? 'nd'
							: gamePlayByPlay.slice(-1)[0].about.inning === 3
							? 'rd'
							: 'th'
					}}
				</div>
				<div class="col">
					<h2>
						{{ boxscore.data.teams.away.team.abbreviation }}
						<span class="text-white">{{ teamsPlaying.away.score }}</span>
					</h2>
				</div>
			</div>
			<div v-if="playerEvents">
				<div class="row">
					<div class="col-md-5">
						<div v-for="(player) in battingOrder" :key="player">
							<a
								role="button"
								@click="show === player.person.id ? (show = null) : (show = player.person.id)"
							>
								<p v-if="playerEvents[player.person.fullName]">
									<i v-if="show === player.person.id" class="fas fa-caret-down me-2 text-white"></i
									><i v-else class="fas fa-caret-right me-2"></i
									><span class="color-sand me-2">{{ player.battingOrder[0] }}. </span>
									<span :class="{ 'text-danger': playerEvents[player.person.fullName].points > 10 }"
										><i
											v-if="playerEvents[player.person.fullName].points > 10"
											class="fa-solid fa-fire text-danger"
										></i>
										{{ playerEvents[player.person.fullName].name }}
										<i
											v-if="playerEvents[player.person.fullName].points > 10"
											class="fa-solid fa-fire text-danger"
										></i
									></span>
									<span class="text-white ms-2">
										{{ player.position.abbreviation }}
									</span>
									<span
										class="color-sand ms-3"
										:class="{
											'text-success': playerEvents[player.person.fullName].points > 0,
											'text-danger': playerEvents[player.person.fullName].points < 0
										}"
										>{{ playerEvents[player.person.fullName].points > 0 ? '+' : ''
										}}{{ playerEvents[player.person.fullName].points }}</span
									>
								</p>
							</a>
							<div
								v-if="
									show === player.person.id &&
									playerEvents[player.person.fullName].id === player.person.id
								"
							>
								<div
									class="text-white ms-4"
									v-for="play in playerEvents[player.person.fullName].plays.s"
									:key="play"
								>
									<h6>
										<span class="color-sand"
											>{{ play.about.halfInning.toUpperCase() }} {{ play.about.inning }}</span
										>
										&#183; {{ play.result.event }}
										<span v-if="play.result.rbi > 0">
											- {{ play.result.rbi }} RBI{{ play.result.rbi > 1 ? "'s" : '' }}</span
										>
									</h6>
								</div>
								<div
									class="text-white ms-4"
									v-for="player in playerEvents[player.person.fullName].plays.b"
									:key="player"
								>
									<h6>{{ player }}</h6>
								</div>
							</div>
						</div>
					</div>
					<div class="col-md-5 text-center">
						<h4 class="color-sand">My Points</h4>
						<h1
							class="align-self-center"
							:class="{
								'text-success': userSelectedPlayersTotalPoints > 0,
								'text-danger': userSelectedPlayersTotalPoints < 0
							}"
						>
							{{ userSelectedPlayersTotalPoints > 0 ? '+' : '' }}{{ userSelectedPlayersTotalPoints }}
						</h1>
					</div>
				</div>
			</div>
			<div>
				<h1 class="mt-5 border-bottom-yellow">Plays</h1>
				<div v-for="play in gamePlayByPlay" :key="play">
					<h5 class="color-sand">
						{{ play.about.halfInning.toUpperCase() }} {{ play.about.inning
						}}{{
							play.about.inning === 1
								? 'st'
								: play.about.inning === 2
								? 'nd'
								: play.about.inning === 3
								? 'rd'
								: 'th'
						}}
					</h5>
					<h6 class="ms-3">{{ play.result.description }}</h6>
				</div>
			</div>
		</div> -->
		<div v-if="userItems && boxscore && teamsPlaying && playerEvents && gamePlayByPlay && (gameStatus === 'In Progress' || gameStatus === 'Final')">
			<game-plays :boxscore="boxscore" :battingOrder="battingOrder" :playerEvents="playerEvents" :gamePlayByPlay="gamePlayByPlay" :teamsPlaying="teamsPlaying" :userSelectedPlayersTotalPoints="userSelectedPlayersTotalPoints" :userItems="userItems" :gameStatus="gameStatus" :editPlayer="editPlayer"></game-plays>
		</div>
	</div>
</template>

<script>
// import moment from 'moment'
// import MLBStatsAPI from 'mlb-stats-api'
import GamePlays from './GamePlays.vue'
// import ENUM from '@/config/loading.js'

export default {
	name: 'Game Results',
	props: ['isAuth', 'currentUser', 'boxscore', 'battingOrder', 'playerEvents', 'teamsPlaying', 'gamePlayByPlay', 'teamRoster', 'gameTime', 'editPlayer'],
	emits: ['clearUserPlayers', 'saveUserPoints', 'events', 'editPlayerSelection', 'points', 'getInfo'],
	components: {
		GamePlays
	},
	data () {
		return {}
	},
	watch: {
		apiState (val) {
			if (val === 2) this.$emit('getInfo')
		}
	},
	created () {
		this.$store.dispatch('getStandings')
		this.$emit('getInfo')
	},
	computed: {
		apiState () {
			return this.$store.state.apiState
		},
		userItems () {
			if (this.currentUser && this.$store.state.standings) {
				return this.$store.state.standings.filter((i) => i.attributes.userName === this.currentUser.username)
			} else {
				return null
			}
		},
		userSelectedPlayersTotalPoints () {
			if (this.currentUser && this.playerEvents && this.$store.state.standings && this.userItems[0].attributes.currentPlayers) {
				const players = Object.values(this.playerEvents)
					.filter((i) =>
						this.userItems[0].attributes.currentPlayers.some((j) => i.name === j.person.fullName.split('.').join(''))
					)
					.map((i) => i.points)
				const points = players.reduce((a, b) => a + b, 0)
				this.$emit('points', points)
				return points
			} else {
				return null
			}
		},
		gameStatus () {
			return this.$store.state.gameStatus
		}
	},
	methods: {
	}
}
</script>

<style scoped>
.record {
	font-family: 'Graduate', cursive;
}
</style>
