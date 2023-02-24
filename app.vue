<script setup>
import { useHandsStore } from './stores/hands';

const handsStore = useHandsStore();
const db = useSupabaseClient();
const user = useSupabaseUser();

useSupabaseAuthClient().auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN') {
    handsStore.pickPlayer(session.user.user_metadata.name || '')

    const { data } = await db.from('users').select();
    handsStore.setPlayers(data.map(item => item.name));
  }
});

if (process.client) {
  console.log('name', user.value.user_metadata.name)
  handsStore.pickPlayer(user.value.user_metadata.name || '')
}
</script>

<template>
  <NuxtPage />
</template>
