<template>
  <div class="overflow-hidden w-screen h-screen">
    <router-view />
  </div>
</template>

<style>
/* También bloqueamos el body desde aquí */
html,
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  max-width: 100vw;
  max-height: 100vh;
}
</style>
