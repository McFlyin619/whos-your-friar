import { createRouter, createWebHashHistory } from 'vue-router'
import LoginPage from '@/components/auth/LoginPage.vue'
import UserSelections from '@/components/user/UserSelections.vue'
import UserStandings from '@/components/user/UserStandings.vue'
import GameResults from '@/components/games/GameResults.vue'
import VersionHistory from '@/components/VersionHistory.vue'
import store from '@/store/index.js'

const routes = [
	{
		redirect: '/login'
	},
	{
		path: '/login',
		name: 'Auth',
		component: LoginPage
	},
	{
		path: '/profile',
		name: 'Profile',
		component: UserSelections,
		meta: { requiresAuth: true }
	},
	{
		path: '/game-results',
		name: 'Results',
		component: GameResults,
		meta: { requiresAuth: true }
	},
	{
		path: '/standings',
		name: 'Standings',
		component: UserStandings,
		meta: { requiresAuth: true }
	},
	{
		path: '/v-history',
		name: 'Versions',
		component: VersionHistory
	}
]

const router = createRouter({
	history: createWebHashHistory(),
	routes
})

router.beforeEach(function (to, _, next) {
	setTimeout(() => {
		if (to.meta.requiresAuth && store.state.token === null) {
			next('/login')
		} else if (to.meta.requiresUnauth && store.state.token) {
			next('/')
		} else {
			next()
		}
	}, 100)
})

export default router
