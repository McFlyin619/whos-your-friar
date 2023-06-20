<template>
	<footer class="">
		<ul class="nav justify-content-center border-bottom pb-3 mb-3">
			<li class="nav-item">
				<router-link to="/game-results" class="nav-link px-2"
					>Today's Game</router-link
				>
			</li>
			<!-- <li class="nav-item"><a href="#" class="nav-link px-2 text-muted">How To</a></li> -->
			<li class="nav-item">
				<router-link to="/v-history" class="nav-link px-2"
					>Version History</router-link
				>
			</li>
			<!-- <li class="nav-item"><a href="#" class="nav-link px-2 text-muted">FAQs</a></li>
			<li class="nav-item"><a href="#" class="nav-link px-2 text-muted">About</a></li> -->
		</ul>
		<p class="text-center text-muted">
			© {{ year }}
			<a class="stacware" href="https://stacware.com/">Stacware</a>
		</p>
	</footer>
</template>

<script>
import moment from 'moment';
export default {
	data() {
		return {
			year: moment().format('YYYY'),
		};
	},
};
</script>

<style scoped>
footer {
	/* position: fixed;*/
	/* bottom: 0; */
	/* left: 0; */
	/* width: 100%; */
	background-color: #2f241d;
	height: 100px;
}

a {
	text-decoration: none;
	color: #6c757d;
}

a:hover {
	color: #ffc425;
}
</style>
