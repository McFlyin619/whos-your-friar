<template>
	<div
		v-if="isAuth && apiState !== 3 ? $router.push('/game-results') : ''"
	></div>
	<div v-else class="container mt-5">
		<form v-show="loginForm && !resetForm" @submit.prevent="login">
			<h1 v-if="newUser">Thanks for signing up... Please Login</h1>
			<h1 v-else>LOGIN</h1>
			<div class="form-floating mb-3 mt-3">
				<input
					v-model="logUsername"
					type="text"
					class="form-control"
					placeholder="Username or Email"
				/>
				<label>Username or Email</label>
			</div>
			<div class="form-floating">
				<input
					v-model="logPassword"
					type="password"
					class="form-control"
					placeholder="Password"
				/>
				<label>Password</label>
			</div>
			<div
				v-if="!!errMessage"
				class="alert alert-danger d-flex align-items-center mt-3"
				role="alert"
			>
				<i class="fas fa-exclamation-triangle me-4"></i>{{ errMessage }}
			</div>
			<div class="mt-5 mb-4">
				<button :disabled="isLoading" class="btn sd-btn-dark me-4">
					<div v-show="isLoading">
						<i class="fa-solid fa-baseball fa-spin"></i>
						Loading...
					</div>
					<div v-show="!isLoading">Login</div>
				</button>
			</div>
			<p>
				Don't have an account?<a
					role="button"
					class="ms-1 link"
					@click="loginForm = false"
					>Create account here</a
				>
			</p>
			<p>
				Forgot your password?<a
					role="button"
					class="ms-1 link"
					@click="resetForm = true"
					>Reset it here</a
				>
			</p>
		</form>
		<form v-show="!loginForm && !resetForm" @submit.prevent="createUser">
			<h1>CREATE ACCOUNT</h1>
			<div class="form-floating mb-3 mt-3">
				<input
					v-model="username"
					type="text"
					:class="{
						'is-invalid': validity.username === '2',
						'is-valid': validity.username === '1',
					}"
					class="form-control"
					@keyup="
						username === ''
							? (validity.username = '2')
							: (validity.username = '1')
					"
					placeholder="Username"
				/>
				<label>Username</label>
			</div>
			<div class="form-floating mb-3">
				<input
					v-model="email"
					type="email"
					:class="{
						'is-invalid': validity.email === '2',
						'is-valid': validity.email === '1',
					}"
					class="form-control"
					@keyup="
						!emailCheck()
							? (validity.email = '2')
							: (validity.email = '1')
					"
					placeholder="name@example.com"
				/>
				<label>Email address</label>
			</div>
			<div class="form-floating mb-3">
				<input
					v-model="password"
					type="password"
					:class="{
						'is-invalid': validity.password === '2',
						'is-valid': validity.password === '1',
					}"
					class="form-control"
					@keyup="
						password === ' ' || password === ''
							? (validity.password = '2')
							: (validity.password = '1')
					"
					placeholder="Password"
				/>
				<label>Password</label>
			</div>
			<div class="form-floating">
				<select
					:class="{
						'is-invalid': validity.team === '2',
						'is-valid': validity.team === '1',
					}"
					v-model="team"
					class="form-select"
					@click="
						team === null
							? (validity.password = '2')
							: (validity.password = '1')
					"
				>
					<option selected :value="null">Choose a team</option>
					<option selected :value="getTeams.NLWest[3]">
						{{ getTeams.NLWest[3].name }}
					</option>
					<!-- <option disabled>------AL West------</option>
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
					<option v-for="team in getTeams.NLCentral" :key="team" :value="team">{{ team.name }}</option> -->
				</select>
			</div>
			<div
				v-if="!!errMessage"
				class="alert alert-danger d-flex align-items-center mt-3"
				role="alert"
			>
				<i class="fas fa-exclamation-triangle me-4"></i>{{ errMessage }}
			</div>
			<div class="mt-5 mb-4">
				<button :disabled="isLoading" class="btn sd-btn-dark me-4">
					<div v-show="isLoading">
						<i class="fa-solid fa-baseball fa-spin"></i>
						Loading...
					</div>
					<div v-show="!isLoading">Create account</div>
				</button>
			</div>
			<p>
				Have an account?<a
					class="ms-1 link"
					role="button"
					@click="loginForm = true"
					>Login here</a
				>
			</p>
			<p>
				Forgot your password?<a
					role="button"
					class="ms-1 link"
					@click="resetForm = true"
					>Reset it here</a
				>
			</p>
		</form>
		<password-reset
			v-if="resetForm"
			@resetForm="resetForm = false"
		></password-reset>
	</div>
</template>

<script>
import PasswordReset from '@/components/auth/PasswordReset.vue';
import CONFIG from '@/config/teams.json';
import Parse from 'parse';
export default {
	components: {
		PasswordReset,
	},
	emits: ['close'],
	data() {
		return {
			logUsername: null,
			logPassword: null,
			username: null,
			email: null,
			password: null,
			validity: {
				username: '0',
				email: '0',
				password: '0',
				team: '0',
			},
			formValid: false,
			isLoading: false,
			errMessage: null,
			loginForm: true,
			team: null,
			newUser: false,
			resetForm: false,
		};
	},
	watch: {
		errorMessage(val) {
			if (val !== null) {
				this.errMessage = val;
			}
		},
	},
	computed: {
		getTeams() {
			return CONFIG.teams;
		},
		isAuth() {
			return !!this.$store.state.token;
		},
		errorMessage() {
			return this.$store.state.errMessage;
		},
		apiState() {
			return this.$store.state.apiState;
		},
	},
	methods: {
		async login() {
			try {
				const payload = {
					username: this.logUsername,
					password: this.logPassword,
				};
				this.$store.dispatch('login', payload);
				// if (this.apiState !== 3) {
				// 	console.log(this.errMessage)
				// 	setTimeout(() => {
				// 		this.$router.push('/profile')
				// 	}, 2000)
				// }
			} catch (err) {
				console.log(err.message);
			}
		},
		async createUser() {
			// eslint-disable-next-line no-undef
			var query = new Parse.Query('Standings');
			const users = await query.find();

			// const padres = {
			// 	id: 135,
			// 	leagueId: 104,
			// 	league: 'National League',
			// 	divisionId: 203,
			// 	division: 'National League West',
			// 	name: 'San Diego Padres'
			// }
			this.validateForm();
			if (this.formValid) {
				this.isLoading = true;
				try {
					const payload = {
						username: this.username,
						email: this.email,
						password: this.password,
						userTeam: this.team,
						currentPosition: users.length + 1,
					};
					this.$store.dispatch('createUser', payload);
				} catch (err) {
					console.log(err.message);
				}
				this.isLoading = false;
				this.newUser = true;
				this.loginForm = true;
				// setTimeout(() => {
				// 	this.$router.go()
				// }, 1000)
			}
		},
		validateForm() {
			if (this.username === null || this.username === '')
				this.validity.username = '2';
			else this.validity.username = '1';
			if (this.email === null || this.email === '')
				this.validity.email = '2';
			else this.validity.email = '1';
			if (this.password === null || this.password === '')
				this.validity.password = '2';
			else this.validity.password = '1';
			if (this.team === null || this.team === '')
				this.validity.team = '2';
			else this.validity.team = '1';
			if (
				this.validity.username === '1' &&
				this.validity.email === '1' &&
				this.validity.password === '1' &&
				this.validity.team === '1'
			)
				this.formValid = true;
		},
		emailCheck() {
			return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
				this.email
			);
		},
		handleError() {
			this.error = null;
		},
		// signupComplete() {
		// 	this.$router.go();
		// },
	},
};
</script>
