<template>
  <div>
    <logo />
    <h1 class="title">heimdall.js-UI</h1>
    <h1>
      <menu-icon />
      {{ $t('hello') }}
      <apple-icon />
    </h1>
    <h2 class="subtitle">heimdall.js management UI</h2>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import MenuIcon from 'vue-material-design-icons/Menu.vue'
import AppleIcon from 'vue-material-design-icons/Apple.vue'
import Logo from '~/components/Logo.vue'

export default Vue.extend({
  layout: 'dashboard',
  components: {
    Logo,
    AppleIcon,
    MenuIcon
  },
  meta: {
    page: 'index'
  }
})
</script>

<style></style>
