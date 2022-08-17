<template>
	<div>
		<h1 v-if="gameStatus === 'Final'" class="text-center mb-5">Final</h1>
		<h1 v-if="gameStatus === 'In Progress'" class="text-center mb-5">Live</h1>
		<div class="row mb-5 border-bottom-yellow text-center">
			<div class="col">
				<h2>
					{{ boxscore.data.teams.home.team.abbreviation }}
					<span class="text-white">{{ teamsPlaying.home.score }}</span>
				</h2>
			</div>
			<div v-if="gameStatus === 'In Progress' " class="col text-white">
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
					<div v-for="player in battingOrder" :key="player">
						<a role="button" @click="show === player.person.id ? (show = null) : (show = player.person.id)">
							<p v-if="playerEvents[player.person.fullName.split('.').join('')]">
								<i v-if="show === player.person.id" class="fas fa-caret-down me-2 text-white"></i>
								<i v-else class="fas fa-caret-right me-2"></i>
								<span class="color-sand me-2"> {{ player.battingOrder[0] }}. </span>
								<span :class="{ 'text-danger': playerEvents[player.person.fullName.split('.').join('')].points > 10 }"
									><i
										v-if="playerEvents[player.person.fullName.split('.').join('')].points > 10"
										class="fa-solid fa-fire text-danger"
									></i>
									{{ playerEvents[player.person.fullName.split('.').join('')].name }}
									<i
										v-if="playerEvents[player.person.fullName.split('.').join('')].points > 10"
										class="fa-solid fa-fire text-danger"
									></i
								></span>
								<span class="text-white ms-2">
									{{ player.position.abbreviation }}
								</span>
								<span
									class="color-sand ms-3"
									:class="{
										'text-success': playerEvents[player.person.fullName.split('.').join('')].points > 0
									}"
									>{{ playerEvents[player.person.fullName.split('.').join('')].points > 0 ? '+' : ''
									}}{{ playerEvents[player.person.fullName.split('.').join('')].points }}</span>
									<span v-for="curr in userItems[0].attributes.currentPlayers" :key="curr">
										<i v-if="curr.person.id === player.person.id && !editPlayer" class="fa-solid fa-square-check text-success ms-2"></i>
									</span>
							</p>
						</a>
						<div
							v-if="show === player.person.id && playerEvents[player.person.fullName.split('.').join('')].id === player.person.id"
						>
							<div
								class="text-white ms-4"
								v-for="play in playerEvents[player.person.fullName.split('.').join('')].plays.s"
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
								v-for="player in playerEvents[player.person.fullName.split('.').join('')].plays.b"
								:key="player"
							>
								<h6>{{ player }}</h6>
							</div>
						</div>
					</div>
				</div>
				<div v-if="!editPlayer" class="col-md-5 text-center">
					<h4 class="color-sand">My Points</h4>
					<h1
						class="align-self-center"
						:class="{
							'text-success': userSelectedPlayersTotalPoints > 0,
							'text-danger': userSelectedPlayersTotalPoints < 0
						}"
					>
						{{ userSelectedPlayersTotalPoints > 0 ? '+' : '' }}{{ userSelectedPlayersTotalPoints !== null ? userSelectedPlayersTotalPoints : 0}}
					</h1>
				</div>
			</div>
		</div>
		<div v-if="gameStatus === 'In Progress'">
			<h1 class="mt-5 border-bottom-yellow">Plays</h1>
			<div v-for="play in gamePlayByPlay.slice().reverse()" :key="play">
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
	</div>
</template>

<script>
export default {
	props: ['boxscore', 'battingOrder', 'playerEvents', 'teamsPlaying', 'userSelectedPlayersTotalPoints', 'userItems', 'gameStatus', 'gamePlayByPlay', 'editPlayer'],
	data () {
		return {
			show: null
		}
	}
}
</script>
