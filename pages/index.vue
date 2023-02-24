<template>
  <div class="common-layout">
    <el-container>
      <el-header class="block" style="height: 60px">
        <stats-uploader />
      </el-header>
      <el-container>
        <el-aside width="300px" v-if="!isMobile">
          <players-list />
        </el-aside>
        <el-main>
          <hands-stats />
        </el-main>
      </el-container>
    </el-container>
    
  </div>
</template>

<script setup lang="ts">

definePageMeta({ middleware: ["auth"] });

const { isMobile } = useDevice();

</script>

<style scoped>



</style>