<template>
  <div>

  </div>
</template>
<script>
const bol = new Boolean({})
console.log('bol', bol)
export default {
  mounted() {
    this.$api.test({
      params: {
        userId: 'TWPAAS1200002299235'
      },
      onSuccess: res => {
        console.log('res', res)
      }
    })
  }
}
</script>