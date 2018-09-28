<template>
  <div id="app">
      <div class="admin-container">
        <Sidebar :navItems="nav"/>
        <div id="right-panel" class="right-panel">
          <Header/>
          <div class="content pb-0">
              <transition enter-active-class="animated fadeIn">
                <router-view></router-view>
              </transition>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import nav from './nav'
import Sidebar from './components/Sidebar.vue'


export default {
  data () {
    return {
      nav: nav.items,
      color: '#43a5f5',
      size: '100px',
      loaded: true
    }
  },
  components: {
    Sidebar
  },
  computed: {
    name(){
      return this.$route.name
    },
    list() {
      return this.$route.matched
    }
  }
}
</script>

<style lang="scss">
@import url('./assets/css/font-awesome.min.css');
@import url('./assets/css/themify-icons.css');
@import url('./assets/css/pe-icon-7-filled.css');
@import "./assets/scss/style";

button{
    cursor: pointer;
}
</style>
