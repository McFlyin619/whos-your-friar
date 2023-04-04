import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'

import 'bootstrap'
import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import BaseLoader from '@/components/ui/BaseLoader.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import Parse from 'parse'
const app = createApp(App)

app.use(store)
app.use(router)

app.component('base-loader', BaseLoader)
app.component('base-modal', BaseModal)

app.mount('#app')
// eslint-disable-next-line no-undef
var client = new Parse.LiveQueryClient({
	applicationId: 'NpUNjfi37nXWf6TcBlVjEgbZkrfGlwQW7sPlAbph',
	serverURL: 'wss://' + 'mlbotl.b4a.io', // Example: 'wss://livequerytutorial.back4app.io'
	javascriptKey: '9TZO5xhE4Bg8lyrAG7maKvOPPa9DsB86HQZUGn27'
})
client.open()
