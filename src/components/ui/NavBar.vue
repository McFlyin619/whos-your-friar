<template>
	<div>
		<nav class="navbar navbar-expand-lg navbar-dark px-5 py-3">
			<div class="container-fluid">
				<a class="navbar-brand me-2" href="#"><i class="fa-solid fa-check text-warning"></i> Who's Your Friar?</a>
				<span class="me-5">
						v2.4
				</span>
				<button
					class="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarText"
					aria-controls="navbarText"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span class="navbar-toggler-icon"></span>
				</button>
				<div class="collapse navbar-collapse" id="navbarText">
					<ul class="navbar-nav me-auto mb-2 mb-lg-0">
						<li v-if="!isAuth" class="nav-item">
							<router-link class="nav-link" to="/">Login</router-link>
						</li>
						<li v-if="isAuth" class="nav-item">
							<router-link  class="nav-link" to="/game-results"><i class="fas fa-baseball-ball"></i> Today's Game</router-link>
						</li>
						<li v-if="isAuth" class="nav-item">
							<router-link class="nav-link" to="/standings"><i class="fas fa-list-ol"></i> Standings</router-link>
						</li>
						<li class="nav-item">
							<a @click="showScoring = !showScoring" :class="{'router-link-active-to': showScoring === true }" class="nav-link" role="button" data-bs-toggle="tooltip" data-bs-placement="bottom" title="How to play Who's Your Friar"><i class="far fa-question-circle"></i> How to</a>
						</li>
						<li class="nav-item ms-5" v-if="userItems">
							<router-link v-if="!userItems[0].attributes.currentPlayers" class="nav-link sd-btn" to="/profile">Make Your Picks Now!</router-link>
						</li>
					</ul>
					<span>
						<ul v-if="isAuth" class="navbar-nav me-5 mb-2 mb-lg-0">
							<li class="nav-item dropdown position-relative">
								<a
									class="nav-link dropdown-toggle"
									id="navbarDropdown"
									role="button"
									data-bs-toggle="dropdown"
									aria-expanded="false"
								>
									<!-- <span
										class="position-absolute top-50 start-0 translate-middle p-1 bg-yellow border border-yellow rounded-circle"
									></span> -->
									<span v-if="getUserPoints" class="badge bg-yellow color-brown">{{
										getUserPoints[0].attributes.userPoints
									}}</span>
									{{ currentUser.username }} <span v-if="currentUser.favPlayerNumber" class="yellow-circle-border" v-html="numbers.numbers[currentUser.favPlayerNumber]"></span>
								</a>
								<ul
									class="dropdown-menu dropdown-menu-dark border-yellow mt-3"
									aria-labelledby="navbarDropdown"
									style="background-color: #2f241d"
								>
									<li>
										<router-link class="dropdown-item" to="/profile">My Profile</router-link>
									</li>
									<!-- <li>
										<a class="dropdown-item" href="#"
											>Notifications
											<span class="badge bg-yellow color-brown">5</span>
										</a>
									</li> -->
									<li><hr class="dropdown-divider" /></li>
									<li>
										<a class="dropdown-item" href="#" @click="logout">Log Out</a>
									</li>
								</ul>
							</li>
						</ul>
					</span>
				</div>
			</div>
		</nav>
		<Transition>
			<div v-show="showScoring" class="alert alert-warning mt-2 alert-dismissible m-3" role="alert">
				<button @click="showScoring = false" type="button" class="btn-close" aria-label="Close"></button>
				<h3 class="alert-heading">How to...</h3>
				<p>
					Click on "Make Your Picks" in the navigation menu and select your players for the week. Once you have selected your players, they are unavailable to pick until the round is over ( every 4 weeks ). Every Sunday (after the game if there is one), your weekly players are reset and you may choose new players. You may choose players at any time during the week, but if you miss games you miss points.
				</p>
				<h5>Scoring...</h5>
				<ul>
					<li>
						<b>Walk:</b> 1 point
					</li>
					<li>
						<b>Single:</b> 1 point
					</li>
					<li>
						<b>Double:</b> 2 points
					</li>
					<li>
						<b>Triple:</b> 3 points
					</li>
					<li>
						<b>Homerun:</b> 5 points
					</li>
					<li>
						<b>RBI:</b> 2 points
					</li>
					<li>
						<b>Run scored:</b> 2 points
					</li>
					<li>
						<b>Stolen base:</b> 2 points
					</li>
				</ul>
				<h5>Tiebreakers...</h5>
				<p>If players are tied for points, then the player with more game points gets the higher position. If players have the same amount of points and game points, then the player who had the higher position the previous game will have the higher position.</p>
				<hr />
				<p class="mb-0">Have fun! If you have any questions/comments or the website is having a problem shoot an email to obrien.mcquade@gmail.com</p>
			</div>
		</Transition>
	</div>
</template>

<script>
import NUM from '@/config/playerNumbers.json'
export default {
	props: ['userItems'],
	data () {
		return {
			showScoring: false,
			numbers: NUM,
			currentPlayers: this.userItems ? this.userItems[0].attributes.currentPlayers : null
		}
	},
	computed: {
		isAuth () {
			return !!this.$store.state.token
		},
		currentUser () {
			return this.$store.state.currentUser
		},
		getUserPoints () {
			if (this.currentUser && this.$store.state.standings) {
				return this.$store.state.standings.filter((i) => i.attributes.userName === this.currentUser.username)
			} else {
				return null
			}
		}
		// selectedPlayers () {
		// 	if (this.userItems[0].attributes.currentPlayers === null) {
		// 		return true
		// 	} else {
		// 		return false
		// 	}
		// }
	},
	methods: {
		selectedPlayers () {
			if (this.userItems[0].attributes.currentPlayers === null) {
				return true
			} else {
				return false
			}
		},
		closeScoring () {
			setTimeout(() => {
				this.showScoring = false
			}, 500)
		},
		logout () {
			this.$store.dispatch('logout')
		}
	}
}
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
