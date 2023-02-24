import { defineStore } from "pinia";

export const useHandsStore = defineStore("hands", () => {
  const players = ref([]);
  const pickedPlayer = ref('');

  function pickPlayer(player: string) {
    pickedPlayer.value = player;
  }

  function setPlayers(newPlayers: string) {
    players.value = [...newPlayers];
  }

  function toggleUpdateMap() {
  }

  return {
    toggleUpdateMap,
    pickedPlayer,
    players,
    setPlayers,
    pickPlayer
  };
});
