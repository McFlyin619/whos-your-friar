<template>
	<div v-if="userItems" class="container mt-5">
		<base-modal
			:show="showEditForm"
			title="Are you sure you want to pick new players?"
			@close="closeForm"
		>
			<edit-player
				:userItems="userItems"
				@close="closeForm"
			></edit-player>
		</base-modal>
		<form
			v-if="!userItems[0].attributes.currentPlayers"
			@submit.prevent="savePlayers"
		>
			<div>
				<h1 v-if="!userItems[0].attributes.userTeam">Select a team</h1>
				<select
					v-if="!userItems[0].attributes.userTeam"
					v-model="team"
					class="form-select"
				>
					<option selected :value="null">Choose a team</option>
					<!-- <option :value="getTeams.NLWest[3]">{{ getTeams.NLWest[3].name }}</option> -->
					<option disabled>------AL West------</option>
					<option
						v-for="team in getTeams.ALWest"
						:key="team"
						:value="team"
					>
						{{ team.name }}
					</option>
					<option disabled>------AL East------</option>
					<option
						v-for="team in getTeams.ALEast"
						:key="team"
						:value="team"
					>
						{{ team.name }}
					</option>
					<option disabled>------AL Central------</option>
					<option
						v-for="team in getTeams.ALCentral"
						:key="team"
						:value="team"
					>
						{{ team.name }}
					</option>
					<option disabled>------NL West------</option>
					<option
						v-for="team in getTeams.NLWest"
						:key="team"
						:value="team"
					>
						{{ team.name }}
					</option>
					<option disabled>------NL East------</option>
					<option
						v-for="team in getTeams.NLEast"
						:key="team"
						:value="team"
					>
						{{ team.name }}
					</option>
					<option disabled>------NL Central------</option>
					<option
						v-for="team in getTeams.NLCentral"
						:key="team"
						:value="team"
					>
						{{ team.name }}
					</option>
				</select>
				<h1 v-if="gameStatus !== 'Live'" class="mt-3">
					You can only select players before or after a game
				</h1>
				<h1 v-else class="mt-3">Select Players</h1>
				<select
					:disabled="
						player2 !== null ||
						teamRoster === null ||
						gameStatus === 'Live'
					"
					v-model="player1"
					class="form-select mb-4"
				>
					<option selected :value="null">
						Choose a position player
					</option>
					<option
						v-for="player in positionRoster"
						:key="player"
						:value="player"
					>
						{{ player.person.fullName }}
					</option>
				</select>
				<select
					:disabled="player3 !== null"
					v-if="player1 !== null"
					v-model="player2"
					class="form-select mb-4"
				>
					<option selected :value="null">
						Choose a position player
					</option>
					<option
						v-for="player in positionRoster2"
						:key="player"
						:value="player"
					>
						{{ player.person.fullName }}
					</option>
				</select>
				<select
					v-if="player2 !== null"
					v-model="player3"
					class="form-select mb-4"
				>
					<option selected :value="null">
						Choose a position player
					</option>
					<option
						v-for="player in positionRoster3"
						:key="player"
						:value="player"
					>
						{{ player.person.fullName }}
					</option>
				</select>
				<!-- <select v-model="pitcher" class="form-select mb-4">
					<option selected :value="null">Choose a pitcher</option>
					<option v-for="player in pitcherRoster" :key="player" :value="player">{{ player.person.fullName }}</option>
				</select> -->
			</div>
			<div v-if="player3 !== null" class="mt-2">
				<button
					@click="savePlayers"
					:disabled="isLoading"
					class="btn sd-btn me-4"
				>
					<div v-show="isLoading">
						<i class="fa-solid fa-baseball fa-spin"></i>
						Loading...
					</div>
					<div v-show="!isLoading">Save</div>
				</button>
			</div>
		</form>

		<div v-else>
			<div class="">
				<div class="mt-5 mb-5 border-bottom-yellow mb-3 h1">
					My Players for
					<span class="color-sand">{{ currentWeekDate }}</span>
					<button
						v-if="editPlayer"
						@click="showEditForm = true"
						class="btn sd-btn float-end"
					>
						Edit players
					</button>
				</div>
			</div>
			<!-- <div v-if="playerEvents" class="row">
				<div class="col-md-5">
					<div v-for="player in userItems[0].attributes.currentPlayers" :key="player">
						<a
							role="button"
							@click="
								show === playerEvents[player.person.fullName]
									? (show = null)
									: (show = playerEvents[player.person.fullName])
							"
						>
							<p v-if="playerEvents[player.person.fullName].plays.s.length > 0" class="text-white">
								{{ playerEvents[player.person.fullName].name }}
								<span
									class="color-sand ms-1"
									:class="{
										'text-success': playerEvents[player.person.fullName].points > 0,
										'text-danger': playerEvents[player.person.fullName].points < 0
									}"
									>{{ playerEvents[player.person.fullName].points > 0 ? '+' : ''
									}}{{ playerEvents[player.person.fullName].points }}</span
								>
							</p>
						</a>
						<div v-if="show === playerEvents[player.person.fullName]">
							<div v-for="play in playerEvents[player.person.fullName].plays.s" :key="play">
								<h6>
									{{ play.result.event }}
									<span v-if="play.result.rbi > 0"> - RBI: {{ play.result.rbi }}</span>
								</h6>
							</div>
							<div v-for="player in playerEvents[player.person.fullName].plays.b" :key="player">
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
			</div> -->
			<div
				v-for="player in userItems[0].attributes.currentPlayers"
				:key="player"
			>
				<p class="text-white">
					{{ player.person.fullName }}
				</p>
			</div>
		</div>
		<div v-if="previousPlayers">
			<h2 class="mt-5 border-bottom-yellow mb-3">Previous players</h2>
			<div>
				<div v-for="(player, index) in previousPlayers" :key="player">
					<p class="text-white text-start">
						<span
							class="color-sand"
							v-if="index === 0 || index === 1 || index === 2"
							>Week 1</span
						>
						<span
							class="color-sand"
							v-if="index === 3 || index === 4 || index === 5"
							>Week 2</span
						>
						<span
							class="color-sand"
							v-if="index === 6 || index === 7 || index === 8"
							>Week 3</span
						>
						{{ player.person.fullName }}
					</p>
				</div>
			</div>
		</div>
		<!-- <div>
			<h2 class="mt-5 border-bottom-yellow mb-3">History</h2>
			<div class="row row-cols-1 row-cols-md-3 g-4">
				<div v-for="h in userItems[0].attributes.gameHistory" :key="h" class="col">
					<div class="card">
						<h5><h5>{{ h.date }}</h5></h5>
						<div class="card-body">
							<h5 class="card-title">{{ h.name }}</h5>
							<p class="card-text">
								<ul >
									<li v-for="p in h.plays.s" :key="p">{{ p.result.event }}</li>
								</ul>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div> -->
	</div>
</template>

<script>
import moment from 'moment';
import MLBStatsAPI from 'mlb-stats-api';
import CONFIG from '@/config/teams.json';
import EditPlayer from '@/components/user/EditPlayer.vue';
import Parse from 'parse';
export default {
	components: {
		EditPlayer,
	},
	props: ['playerEvents', 'editPlayer'],
	data() {
		return {
			api: new MLBStatsAPI(),
			positionRoster: null,
			positionRoster2: null,
			positionRoster3: null,
			pitcherRoster: null,
			player1: null,
			player2: null,
			player3: null,
			pitcher: null,
			teamRoster: null,
			team: null,
			isLoading: false,
			show: null,
			weekDate: 'May 01 - May 08',
			currentWeekDate: ' - ' + moment().add(7, 'd').format('MMM DD'),
			showEditForm: false,
		};
	},
	watch: {
		userItems() {
			this.team = this.userItems[0].attributes.userTeam;
			this.getRoster();
		},
		teamRoster(val) {
			if (val !== null) {
				setTimeout(() => {
					this.positionFilterRoster();
				}, 1000);
			}
		},
		player1(val) {
			this.positionFilterRoster(val, this.player2);
		},
		player2(val) {
			this.positionFilterRoster(this.player1, val);
		},
	},
	created() {
		// this.getRoster()
		this.getStandings();
	},
	computed: {
		getTeams() {
			return CONFIG.teams;
		},
		currentUser() {
			return this.$store.state.currentUser;
		},
		userItems() {
			if (this.currentUser && this.$store.state.standings) {
				// console.log(
				// 	this.$store.state.standings.filter((i) => i.attributes.userName === this.currentUser.username)
				// )
				return this.$store.state.standings.filter(
					(i) => i.attributes.userName === this.currentUser.username
				);
			} else {
				return null;
			}
		},
		userSelectedPlayersTotalPoints() {
			const players = Object.values(this.playerEvents)
				.filter((i) =>
					this.userItems[0].attributes.currentPlayers.some(
						(j) => i.name === j.person.fullName
					)
				)
				.map((i) => i.points);
			const points = players.reduce((a, b) => a + b, 0);
			return points;
		},
		previousPlayers() {
			if (
				this.userItems[0].attributes.previousPlayers &&
				this.userItems[0].attributes.currentPlayers
			) {
				return this.userItems[0].attributes.previousPlayers.filter(
					(i) =>
						!this.userItems[0].attributes.currentPlayers.some(
							(j) => i.person.id === j.person.id
						)
				);
			} else {
				return null;
			}
		},
		gameStatus() {
			return this.$store.state.gameStatus;
		},
	},
	methods: {
		closeForm() {
			this.getStandings();
			setTimeout(() => {
				this.$router.go();
			}, 500);
		},
		getStandings() {
			this.$store.dispatch('getStandings');
			// eslint-disable-next-line no-undef
			var queryF = new Parse.Query('PlayerData');
			queryF.equalTo('objectId', 'UNPypEjpTA');
			queryF.first().then((data) => {
				this.currentWeekDate =
					moment(data.attributes.weekStartDate).format('MMM DD') +
					' - ' +
					moment(data.attributes.weekStartDate)
						.add(7, 'd')
						.format('MMM DD');
			});
			this.getRoster();
		},
		async getRoster() {
			// Retrieves the team roster
			if (this.userItems && this.team !== null) {
				if (process.env.NODE_ENV !== 'production')
					console.log('retrieving roster');
				const response = await this.api.getTeamRoster({
					pathParams: {
						teamId: this.userItems[0].attributes.userTeam.id,
					},
				});
				this.teamRoster = response.data.roster;
			}
		},
		positionFilterRoster(player1, player2) {
			if (process.env.NODE_ENV !== 'production')
				console.log('filtering roster');
			var roster = '';
			if (!this.userItems[0].attributes.previousPlayers) {
				// console.log('run')
				roster = this.teamRoster;
			} else {
				roster = this.teamRoster.filter(
					(i) =>
						!this.userItems[0].attributes.previousPlayers.some(
							(j) => i.person.id === j.person.id
						)
				);
			}
			this.pitcherRoster = roster.filter((i) => i.position.code === '1');
			this.positionRoster = roster.filter((i) => i.position.code !== '1');
			if (player1)
				this.positionRoster2 = roster.filter(
					(i) => i.position.code !== '1' && i !== player1
				);
			if (player2) {
				this.positionRoster3 = roster.filter(
					(i) =>
						i.position.code !== '1' &&
						i !== player1 &&
						i !== player2
				);
			}
		},
		savePlayers() {
			this.isLoading = true;
			const players = [];
			players.push(this.player1);
			players.push(this.player2);
			players.push(this.player3);
			// players.push(this.pitcher)
			var previousPlayers = [];
			if (this.userItems[0].attributes.previousPlayers) {
				previousPlayers = [
					...this.userItems[0].attributes.previousPlayers,
				];
			}
			previousPlayers.push(this.player1);
			previousPlayers.push(this.player2);
			previousPlayers.push(this.player3);
			// previousPlayers.push(this.pitcher)
			const payload = {
				userId: this.userItems[0].attributes.userId,
				selectedPlayers: players,
				previousPlayers: previousPlayers,
				userTeam: this.team,
			};
			this.$store.dispatch('savePlayers', payload);
			setTimeout(() => {
				this.isLoading = false;
				this.getStandings();
			}, 2500);
		},
	},
};
</script>
