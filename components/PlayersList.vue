<template>
  <div :class="{ block: !isMobile }" style="height: calc(100% - 10px)">
    <p class="menu-title">Perchiki</p>
    <el-menu
      ref="menuRef"
      :default-active="handsStore.pickedPlayer"
      class="el-menu-vertical-demo"
    >
      <el-menu-item v-for="player in handsStore.players" :index="player" @click="onClick(player)">
        <span>{{ player }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { useHandsStore } from '@/stores/hands';

const handsStore = useHandsStore();
const { isMobile } = useDevice();

function onClick(name: string) {
  handsStore.pickPlayer(name);
}

</script>

<style lang="scss">
.el-menu {
  border-right: 0;
}

.menu-title {
  margin: 0 0 8px 8px;
  font-size: 1rem;
  font-weight: 700;
  padding-top: 8px;
  line-height: 24px;
}

</style>