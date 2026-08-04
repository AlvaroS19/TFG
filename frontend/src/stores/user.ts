// src/stores/user.ts
import { defineStore } from 'pinia'
import { useDocument } from 'vuefire'
import { doc }         from 'firebase/firestore'
import { firebaseDb, firebaseAuth } from '../firebase'

export const useUserStore = defineStore('user', {
  state: () => ({
    email:     '' as string,
    xp:        0  as number,
    missions:  [] as Array<{ id:string; title:string; done:boolean }>
  }),
  actions: {
    bindUserData() {
      const u = firebaseAuth.currentUser
      if (u) {
        const userDoc = useDocument(doc(firebaseDb, 'users', u.uid))
        userDoc.value && (this.email = userDoc.value.email)
      }
    },
    addXp(amount:number) {
      this.xp += amount
    },
    completeMission(id:string) {
      const m = this.missions.find(x=> x.id===id)
      if(m) m.done = true
    }
  }
})
