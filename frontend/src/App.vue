<template>
  <div class="app-wrapper relative w-screen h-screen overflow-hidden bg-[#0A1A2F] text-[#F5F0E1]">
    <transition name="fade-slide" mode="out-in">
      <router-view />
    </transition>

    <div id="notifications" class="absolute top-4 right-4 z-50" />
  </div>
</template>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh;
  background-color: #0A1A2F;
  overflow-x: hidden; /* solo bloquea scroll lateral */
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>