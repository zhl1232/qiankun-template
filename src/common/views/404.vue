<template>
  <div class="error-404">
    <img src="../assets/images/error-404.png" alt="404" />
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const props = defineProps({
  timeout: {
    type: Number,
    default: 3
  }
})

onMounted(() => {
  setTimeout(() => {
    router.push('/')
  }, props.timeout * 1000)
})
</script>

<style scoped lang="scss">
.error-404 {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: var(--body-background);
}
</style>
