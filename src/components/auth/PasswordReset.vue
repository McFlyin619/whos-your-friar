<template>
	<div>
		<div v-if="!success">
			<div class="form-floating mb-3 mt-3">
				<input v-model="email" type="text" class="form-control" placeholder="Username or Email" />
				<label>Enter your email to reset your password</label>
			</div>
			<button :disabled="isLoading" class="btn sd-btn-dark me-4">
				<div v-show="isLoading">
					<i class="fa-solid fa-baseball fa-spin"></i>
					Loading...
				</div>
				<div v-show="!isLoading" @click="resetEmail">Reset Password</div>
			</button>
			<p>Oops need to login?<a role="button" class="ms-1 link" @click="$emit('resetForm')">Go back</a></p>
		</div>
		<div v-else>
			<h4>Email sent!</h4>
		</div>
	</div>
</template>
<script>
// eslint-disable-next-line no-undef
Parse.initialize('NpUNjfi37nXWf6TcBlVjEgbZkrfGlwQW7sPlAbph', '9TZO5xhE4Bg8lyrAG7maKvOPPa9DsB86HQZUGn27');
// eslint-disable-next-line no-undef
Parse.serverURL = 'https://mlbotl.b4a.io/';
export default {
	emits: ['resetForm'],
	data() {
		return {
			email: null,
			isLoading: false,
			success: false,
		};
	},
	methods: {
		resetEmail() {
			this.isLoading = true;
			// eslint-disable-next-line no-undef
			Parse.User.requestPasswordReset(this.email)
				.then(() => {
					this.success = true;
					this.isLoading = false;
					console.log('Password reset request was sent successfully');
				})
				.catch((error) => {
					console.log('The login failed with error: ' + error.code + ' ' + error.message);
				});
		},
	},
};
</script>
