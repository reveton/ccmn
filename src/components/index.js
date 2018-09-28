import Vue from 'vue'
import vSelect from 'vue-select'

//Components
import AnimateNumber from './widgets/AnimateNumber.vue'

//Importing Custom Components
import SidebarCollapse from './sidebar/SidebarCollapse.vue';
import CardTemplate from './widgets/CardTemplate.vue'


// Table
import Vuetable from 'vuetable-2'
Vue.use(Vuetable)

// Registered Components
Vue.component( 'sidebar-collapse', SidebarCollapse )
Vue.component( 'card', CardTemplate )
Vue.component( 'v-select', vSelect )
Vue.component( 'basix-counter', AnimateNumber )

export {
  SidebarCollapse,
  CardTemplate,
  AnimateNumber
}
