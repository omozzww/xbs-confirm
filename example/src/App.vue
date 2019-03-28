<template>
  <div id="app">
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted () {
    this.$xbs.confirm.show({
      onCancel: () => {},
      onConfirm: () => {}
    })
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
