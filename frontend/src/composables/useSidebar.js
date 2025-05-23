import { ref } from 'vue'

export const isSidebarOpen = ref(false)

export function toggleSidebar(state = true) {
  isSidebarOpen.value = state
}
