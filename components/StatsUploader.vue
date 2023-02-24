<template>
  <div class="upload-wrapper">
    <el-upload
      accept=".csv"
      :auto-upload="false"
      :show-file-list="false"
      :on-change="onChange"
    >
      <template #trigger>
        <el-button plain bg>Open CSV</el-button>
      </template>
    </el-upload>
    <el-button v-if="isMobile" text bg @click="perchikiDrawer = true">Perchiki</el-button>
    <el-button text bg :icon="SwitchButton" @click="signOut">Sign out</el-button>
  </div>
  <client-only>
      <el-drawer
        ref="drawerRef"
        v-model="drawer"
        title="Hands"
        :before-close="clearHands"
        :size="drawerSize"
        :direction="drawerDirection"
      >
        <div class="hands-list">
          <ul v-infinite-scroll="() => 2" class="infinite-list" style="overflow: auto">
            <li v-for="item, i in parsedHands" :key="i" class="infinite-list-item">
            <span v-for="card in item.hand" v-html="card.value + card.suit"></span>
          </li>
          </ul>
          <el-button type="success" :loading="loading" @click="uploadHands">Upload hands</el-button>
        </div>
      </el-drawer>
      <el-drawer
        v-model="perchikiDrawer"
        size="50%"
        direction="ttb"
      >
        <players-list />
      </el-drawer>
    </client-only>
</template>

<script setup lang="ts">
import { FormInstance, UploadFile } from 'element-plus';
import { SwitchButton } from '@element-plus/icons-vue'
import { parseHands, type Hand } from '@/utils/hands';
import { useHandsStore } from '~~/stores/hands';

const db = useSupabaseClient();
const client = useSupabaseAuthClient();
const user = useSupabaseUser();
const handsStore = useHandsStore();
const router = useRouter();

const loading = ref(false);
const drawerDirection = ref('rtl');
const drawerSize = ref('30%');
const drawer = ref(false);
const perchikiDrawer = ref(false);
const drawerRef = ref<FormInstance>();
const parsedHands = useState<Hand[]>('parsed-hands', () => []);

const { isMobile } = useDevice();

if (isMobile) {
  drawerDirection.value = 'btt';
  drawerSize.value = '80%';
}

async function onChange(file: UploadFile) {
  const hands = await parseHands(file.raw);
  parsedHands.value.push(...hands);
  drawer.value = true
}

async function signOut() {
  await client.auth.signOut();
  await router.push('/signin');
}

async function uploadHands() {
  loading.value = true;
  const hands = parsedHands.value.map(hand => ({
    hand: hand.hand.reduce((acc, val) => acc += `${val.value}${val.suit}` , ''),
    at: hand.at
  }));

  const { data: affectedRows, error } = await db.rpc('hands_batch_insert', { hands, userid: user.value?.id });
  drawer.value = false;

  if (error) {
    ElNotification({
      position: 'bottom-left',
      title: 'Error!',
      message: 'Something happened..',
      type: 'error',
    })
    clearHands();
    loading.value = false;
    return
  }

  if (affectedRows) {
    ElNotification({
      position: 'bottom-left',
      title: 'Done!',
      message: `${affectedRows} hands are saved now`,
      type: 'success',
    })
    handsStore.pickPlayer(user.value.user_metadata.name);
  } else {
    ElNotification({
      position: 'bottom-left',
      title: 'Hmm',
      message: `Seems like these hands are already saved, бро`,
      type: 'info',
    })
  }

  clearHands();
  loading.value = false;
}

function clearHands() {
  parsedHands.value = []
  drawer.value = false
}


</script>

<style scoped>
.hands-list {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.upload-wrapper {
  width: calc(100% - 40px);
  height: 100%;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}
.infinite-list {
  height: calc(100% - 50px);
  padding: 0;
  margin: 0;
  list-style: none;
}
.infinite-list .infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: var(--el-color-primary-light-9);
  margin: 10px 0;
  color: var(--el-color-primary);
}
.infinite-list .infinite-list-item + .list-item {
  margin-top: 10px;
}
</style>