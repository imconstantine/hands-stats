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

</script>

<template>
  <NuxtPage />
</template>
