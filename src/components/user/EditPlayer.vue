<template>
	<div class="text-center">
		<button
			:disbaled="clicked"
			class="btn sd-btn"
			@click="removeCurrentSelections"
		>
			Yes
		</button>
	</div>
</template>

<script>
import Parse from 'parse';
export default {
	emits: ['close'],
	props: ['userItems'],
	data() {
		return {
			clicked: false,
		};
	},
	methods: {
		removeCurrentSelections() {
			this.clicked = true;
			// eslint-disable-next-line no-undef
			var query = new Parse.Query('Standings');
			query.equalTo('userId', this.userItems[0].attributes.userId);
			query.first().then((user) => {
				const removePrevious = user.attributes.previousPlayers;
				removePrevious.pop();
				removePrevious.pop();
				removePrevious.pop();
				user.set('currentPlayers', null);
				user.set('previousPlayers', removePrevious);
				user.save();
			});
			this.$emit('close');
		},
	},
};
</script>

<style scoped>
select {
	color: var(--sand) !important;
	border: 0.5px solid var(--yellow) !important;
	background-color: var(--brown) !important;
}

select:focus {
	border: 2px solid var(--yellow) !important;
	box-shadow: 0 1px 0 0 var(--yellow) !important;
	color: var(--sand) !important;
}

select:disabled {
	color: #856715 !important;
	border: 0.5px solid #856715 !important;
	background-color: rgb(12, 18, 24);
}
</style>
