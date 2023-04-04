<template>
	<div v-if="standings && userItems" class="container">
		<div class="mt-5">
			<div>
				<h1>Standings</h1>
				<h6>{{ standings.length }} players</h6>
			</div>
			<!-- <h1>Select a team</h1>
			<select v-model="team" class="form-select">
				<option selected :value="null">Choose a team</option>
				<option :value="getTeams.NLWest[3]">{{ getTeams.NLWest[3].name }}</option>
				<option disabled>------AL West------</option>
				<option v-for="team in getTeams.ALWest" :key="team" :value="team">{{ team.name }}</option>
				<option disabled>------AL East------</option>
				<option v-for="team in getTeams.ALEast" :key="team" :value="team">{{ team.name }}</option>
				<option disabled>------AL Central------</option>
				<option v-for="team in getTeams.ALCentral" :key="team" :value="team">{{ team.name }}</option>
				<option disabled>------NL West------</option>
				<option v-for="team in getTeams.NLWest" :key="team" :value="team">{{ team.name }}</option>
				<option disabled>------NL East------</option>
				<option v-for="team in getTeams.NLEast" :key="team" :value="team">{{ team.name }}</option>
				<option disabled>------NL Central------</option>
				<option v-for="team in getTeams.NLCentral" :key="team" :value="team">{{ team.name }}</option>
			</select> -->
			<div v-if="gameStatus === 'Live'" class="table-responsive">
				<table class="table color-yellow text-center mt-5">
					<thead>
						<tr class="">
							<th
								class="text-start"
								scope="col"
								@click="
									show === null
										? (show = 'all')
										: (show = null)
								"
							>
								<i
									v-if="show === 'all'"
									class="fas fa-caret-down me-2 text-white"
								></i>
								<i
									v-else
									class="fas fa-caret-right color-sand me-2"
								></i
								>Pos
							</th>
							<th class="text-start" scope="col">Change</th>
							<th scope="col"></th>
							<th class="text-start" scope="col">User</th>
							<th class="text-center" scope="col">Game Points</th>
							<th class="text-center" scope="col">
								Total Points
							</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="(user, index) in getCurrentPoints"
							:key="user"
							:class="{
								'text-primary':
									page === 1
										? index + 1 === 1
										: (page - 1) * perPage + (index + 1) ===
										  1,
								'text-info':
									page === 1
										? index + 1 === 2
										: (page - 1) * perPage + (index + 1) ===
										  2,
								'text-white':
									page === 1
										? index + 1 === 3
										: (page - 1) * perPage + (index + 1) ===
										  3,
								'user-standing':
									currentUser.username ===
									user.user.attributes.userName,
							}"
							role="button"
							@click="
								show === null
									? (show = user.user)
									: (show = null)
							"
						>
							<td class="color-yellow text-start">
								<i
									v-if="show === user.user || show === 'all'"
									class="fas fa-caret-down me-2 text-white"
								></i>
								<i
									v-else
									class="fas fa-caret-right color-sand me-2"
								></i>
								{{
									page === 1
										? index + 1
										: (page - 1) * perPage + (index + 1)
								}}
							</td>
							<td class="text-start">
								<span
									class="ms-2 text-danger d-flex"
									v-if="
										(page === 1
											? index + 1
											: (page - 1) * perPage +
											  (index + 1)) >
										user.user.attributes.currentPosition
									"
								>
									<i
										class="fa-solid fa-caret-down align-self-center"
									></i>
									{{
										(page === 1
											? index + 1
											: (page - 1) * perPage +
											  (index + 1)) -
										user.user.attributes.currentPosition
									}}
								</span>
								<span
									class="ms-2 text-success d-flex"
									v-if="
										(page === 1
											? index + 1
											: (page - 1) * perPage +
											  (index + 1)) <
										user.user.attributes.currentPosition
									"
								>
									<i
										class="fa-solid fa-caret-up align-self-center"
									></i>
									{{
										user.user.attributes.currentPosition -
										(page === 1
											? index + 1
											: (page - 1) * perPage +
											  (index + 1))
									}}
								</span>
								<span
									class="color-sand"
									v-if="
										(page === 1
											? index + 1
											: (page - 1) * perPage +
											  (index + 1)) ===
										user.user.attributes.currentPosition
									"
									><i class="fa-solid fa-minus"></i
								></span>
							</td>
							<td></td>
							<td class="text-start">
								<i
									v-if="
										(page === 1
											? index + 1
											: (page - 1) * perPage +
											  (index + 1)) < 4
									"
									class="fa-solid fa-star"
								></i>
								{{ user.user.attributes.userName }}
								<span
									data-bs-toggle="tooltip"
									data-bs-placement="top"
									title="This is an original player"
									v-if="user.user.attributes.favPlayerNumber"
									class="yellow-circle-border text-white favNum"
									>{{
										numbers.numbers[
											user.user.attributes.favPlayerNumber
										]
									}}</span
								>
								<i
									v-if="
										(page === 1
											? index + 1
											: (page - 1) * perPage +
											  (index + 1)) < 4
									"
									class="fa-solid fa-star ms-2"
								></i>
								<div
									v-if="
										!editPlayerSelection &&
										user.user.attributes.currentPlayers !==
											null &&
										(show === user.user || show === 'all')
									"
								>
									<div
										class="color-sand ms-2"
										v-for="players in user.players"
										:key="players"
									>
										{{ players.name }} &#183;
										<span class="text-success"
											>{{ players.points > 0 ? '+' : ''
											}}{{ players.points }}</span
										>
									</div>
								</div>
							</td>
							<td class="text-center text-success">
								{{ user.gamePoints > 0 ? '+' : ''
								}}{{ user.gamePoints }}
							</td>
							<td class="text-center text-success">
								{{ user.total > 0 ? '+' : '' }}{{ user.total }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div v-else class="table-responsive">
				<table class="table color-yellow text-center mt-5">
					<thead>
						<tr class="">
							<th
								role="button"
								class="text-start"
								scope="col"
								@click="
									show === null
										? (show = 'all')
										: (show = null)
								"
							>
								<i
									v-if="show === 'all'"
									class="fas fa-caret-down me-2 text-white"
								></i>
								<i
									v-else
									class="fas fa-caret-right color-sand me-2"
								></i>
								Pos
							</th>
							<th class="text-start" scope="col">Change</th>
							<th scope="col"></th>
							<th class="text-start" scope="col">User</th>
							<th class="text-center" scope="col">Game Points</th>
							<th class="text-center" scope="col">
								Total Points
							</th>
							<!-- <th scope="col">Current Players</th> -->
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="user in pagedStandings"
							:key="user"
							:class="{
								'text-primary':
									user.attributes.currentPosition === 1,
								'text-info':
									user.attributes.currentPosition === 2,
								'text-white':
									user.attributes.currentPosition === 3,
								'user-standing':
									currentUser.username ===
									user.attributes.userName,
							}"
							role="button"
							@click="
								show === null ? (show = user) : (show = null)
							"
						>
							<td class="color-yellow text-start">
								<i
									v-if="show === user || show === 'all'"
									class="fas fa-caret-down me-2 text-white"
								></i>
								<i
									v-else
									class="fas fa-caret-right color-sand me-2"
								></i>
								{{ user.attributes.currentPosition }}
							</td>
							<td class="text-start">
								<span
									class="ms-2 text-danger d-flex"
									v-if="
										user.attributes.currentPosition >
										user.attributes.previousPosition
									"
								>
									<i
										class="fa-solid fa-caret-down align-self-center"
									></i>
									{{
										user.attributes.currentPosition -
										user.attributes.previousPosition
									}}
								</span>
								<span
									class="ms-2 text-success d-flex"
									v-if="
										user.attributes.currentPosition <
										user.attributes.previousPosition
									"
								>
									<i
										class="fa-solid fa-caret-up align-self-center"
									></i>
									{{
										user.attributes.previousPosition -
										user.attributes.currentPosition
									}}
								</span>
								<span
									class="color-sand"
									v-if="
										user.attributes.currentPosition ===
										user.attributes.previousPosition
									"
									><i class="fa-solid fa-minus"></i
								></span>
							</td>
							<td></td>
							<td class="text-start">
								<i
									v-if="user.attributes.currentPosition < 4"
									class="fa-solid fa-star me-2"
								></i>
								<!-- <i v-if="user.attributes.currentPosition === standings.length" class="fa-solid fa-dumpster text-secondary"></i> -->
								{{ user.attributes.userName }}
								<span
									data-bs-toggle="tooltip"
									data-bs-placement="top"
									title="This is an original player"
									v-if="user.attributes.favPlayerNumber"
									class="yellow-circle-border text-white favNum"
									>{{
										numbers.numbers[
											user.attributes.favPlayerNumber
										]
									}}</span
								>
								<i
									v-if="user.attributes.currentPosition < 4"
									class="fa-solid fa-star ms-2"
								></i>
								<div
									v-if="
										!editPlayerSelection &&
										user.attributes.currentPlayers !==
											null &&
										(show === user || show === 'all')
									"
								>
									<div
										class="color-sand ms-2"
										v-for="players in user.attributes
											.currentPlayers"
										:key="players"
									>
										{{ players.person.fullName }}
									</div>
								</div>
							</td>
							<td class="text-center text-success">
								<span v-if="gameStatus === 'Final'"
									>{{
										user.attributes.gamePoints > 0
											? '+'
											: ''
									}}{{ user.attributes.gamePoints }}</span
								>
								<span v-else>0</span>
							</td>
							<td class="text-center text-success">
								{{ user.attributes.userPoints > 0 ? '+' : ''
								}}{{ user.attributes.userPoints }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="d-flex justify-content-between">
				<div>
					<i
						role="button"
						v-show="page !== 1"
						@click="pageDown"
						class="fa-solid fa-square-caret-left fa-2x"
					></i>
				</div>
				<div>
					<i
						role="button"
						v-show="page !== Math.ceil(standings.length / perPage)"
						@click="pageUp"
						class="fa-solid fa-square-caret-right fa-2x"
					></i>
				</div>
			</div>
			<small class="text-white"
				>***Click a players name to view thier selected players. Viewing
				other players selections will be available when this weeks first
				game starts.
			</small>
		</div>
	</div>
</template>

<script>
import NUM from '@/config/playerNumbers.json';
import CONFIG from '@/config/teams.json';
import Parse from 'parse';
export default {
	props: ['editPlayer', 'currentUser', 'points'],
	emits: ['getInfo', 'currentStandings'],
	data() {
		return {
			numbers: NUM,
			team: null,
			show: null,
			editPlayerSelection: false,
			perPage: 20,
			page: 1,
		};
	},
	created() {
		this.getStandings();
		this.getEditPlayer();
		this.$emit('getInfo');
	},
	watch: {
		apiState(val) {
			if (val === 2) this.$emit('getInfo');
		},
	},
	computed: {
		apiState() {
			return this.$store.state.apiState;
		},
		gameStatus() {
			return this.$store.state.gameStatus;
		},
		getTeams() {
			return CONFIG.teams;
		},
		userItems() {
			if (this.currentUser && this.$store.state.standings) {
				return this.$store.state.standings.filter(
					(i) => i.attributes.userName === this.currentUser.username
				);
			} else {
				return null;
			}
		},
		playerEvents() {
			return this.$store.state.playerEvents;
		},
		standings() {
			if (this.currentUser && this.$store.state.standings) {
				const order = this.$store.state.standings.filter(
					(i) =>
						i.attributes.userTeam.id ===
						(this.team !== null
							? this.team.id
							: this.userItems[0].attributes.userTeam.id)
				);
				return order.sort(
					(a, b) =>
						a.attributes.currentPosition -
						b.attributes.currentPosition
				);
				// 	.sort((a, b) => b.attributes.userPoints - a.attributes.userPoints)
				// return order.sort((a, b) => {
				// 	if (b.attributes.userPoints === a.attributes.userPoints) {
				// 		return b.attributes.gamePoints - a.attributes.gamePoints
				// 	}
				// })
			} else {
				return null;
			}
		},
		pagedStandings() {
			return this.standings.slice(
				(this.page - 1) * this.perPage,
				this.page * this.perPage
			);
		},
		getCurrentPoints() {
			const usersPoints = [];
			if (this.standings.length > 0 && this.playerEvents) {
				for (const user in this.standings) {
					if (
						this.standings[user].attributes.currentPlayers !== null
					) {
						const players = Object.values(this.playerEvents).filter(
							(playerEvents) =>
								this.standings[
									user
								].attributes.currentPlayers.some(
									(player) =>
										playerEvents.name ===
										player.person.fullName
											.split('.')
											.join('')
								)
						);

						// calculates total points from players
						const gamePoints = players
							.map((i) => i.points)
							.reduce((a, b) => a + b, 0);

						const points = {
							user: this.standings[user],
							players: players,
							gamePoints: gamePoints,
							total:
								this.standings[user].attributes.userPoints +
								gamePoints,
						};
						usersPoints.push(points);
					} else {
						const points = {
							user: this.standings[user],
							players: null,
							gamePoints: 0,
							total:
								this.standings[user].attributes.userPoints + 0,
						};
						usersPoints.push(points);
					}
				}
				const standings = usersPoints
					.sort((a, b) => b.total - a.total)
					.sort((a, b) => {
						if (b.total === a.total) {
							return b.gamePoints - a.gamePoints;
						}
					})
					.sort((a, b) => {
						if (b.players === null) return 1;
						if (a.players === null) return 1;
					})
					.slice(
						(this.page - 1) * this.perPage,
						this.page * this.perPage
					);
				// this.$emit('currentStandings', standings)
				return standings;
			} else {
				return null;
			}
		},
	},
	methods: {
		pageUp() {
			// console.log('pageUp')
			if (this.page !== Math.ceil(this.standings.length / this.perPage)) {
				this.page += 1;
			}
		},
		pageDown() {
			if (this.page !== 1) {
				this.page -= 1;
			}
		},
		getStandings() {
			this.$store.dispatch('getStandings');
		},
		getEditPlayer() {
			// eslint-disable-next-line no-undef
			var queryG = new Parse.Query('PlayerData');
			queryG.equalTo('objectId', 'UNPypEjpTA');
			queryG.first().then((data) => {
				if (data.attributes.allowEditPlayerSelection === true)
					this.editPlayerSelection = true;
			});
		},
	},
};
</script>

<style scoped>
.user {
	font-family: 'Aktiv-Grotesk';
}

.fonty {
	font-family: 'Aktiv-Grotesk';
}

.favNum {
	font-size: 0.8rem;
}
</style>
