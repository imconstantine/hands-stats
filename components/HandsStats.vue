<template>
  <div v-loading="loading" class="block stats-wrapper">
    <div class="player-info">
      <h1 style="margin: 0 0 20px 0">{{ handsStore.pickedPlayer }}</h1>
      <el-row class="statistics" justify="space-between">
        <el-col :span="6">
          <div class="statistic-card">
            <el-statistic :value="counter">
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  Hands overall
                  <el-tooltip
                    effect="dark"
                    content="Number of player's hands"
                    placement="top"
                  >
                    <el-icon style="margin-left: 4px" :size="12">
                      <Warning />
                    </el-icon>
                  </el-tooltip>
                </div>
              </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="statistic-card">
            <el-statistic :value="0" :formatter="() => `${maxHand}`">
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  Top hand
                  <el-tooltip
                    effect="dark"
                    content="The most frequent hand"
                    placement="top"
                  >
                    <el-icon style="margin-left: 4px" :size="12">
                      <Warning />
                    </el-icon>
                  </el-tooltip>
                </div>
              </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="statistic-card">
            <el-statistic :value="0" :formatter="() => ''">
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  Status perchika
                </div>
              </template>
              <template #suffix>
                <el-tag type="danger">Пидорас</el-tag>
              </template>
            </el-statistic>
          </div>
        </el-col>
      </el-row>
    </div>
    <client-only>
      <v-chart class="chart" :option="option" theme="purple-passion" autoresize />
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { use, registerTheme } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { HeatmapChart } from 'echarts/charts';
import {
  TooltipComponent,
  GridComponent,
  SingleAxisComponent,
  VisualMapComponent,
} from 'echarts/components';
import VChart from 'vue-echarts';
import { Warning } from '@element-plus/icons-vue'
import purplePassion from '@/utils/purple-passion.json';
import { useHandsStore } from '@/stores/hands';

registerTheme('purple-passion', purplePassion);
use([
  CanvasRenderer,
  HeatmapChart,
  TooltipComponent,
  GridComponent,
  SingleAxisComponent,
  VisualMapComponent
]);

const db = useSupabaseClient();
const user = useSupabaseUser();
const handsStore = useHandsStore();

handsStore.$onAction(async ({ name, after }) => {
  if (!['pickPlayer'].includes(name)) {
    return
  }
  after(async (result) => {
    await fetchHands();
  })
})

const handsArray = ref([]);
const maxCount = ref(0);
const maxHand = ref('-');
const counter = ref(0);
const loading = ref(false)

async function fetchHands() {
  if (process.client) {
    loading.value = true;
    const { data } = await db.rpc('get_hands', { name: handsStore.pickedPlayer });

    handsArray.value.splice(0, handsArray.value.length);
    maxCount.value = 0;
    maxHand.value = '-';
    counter.value = 0;

    for (let [key, value] of Object.entries(data)) {
      counter.value += value;
      if (key[2] === 'o') {
        handsArray.value.push({ value: [key[0], key[1], value], label: key[1] + key[0] + key[2] })
        if (maxCount.value < <number>value) {
          maxCount.value = value;
          maxHand.value = key[1] + key[0] + key[2]
        }
      } else {
        handsArray.value.push({ value: [key[0], key[1], value], label: key })
        if (maxCount.value < <number>value) {
          maxCount.value = value;
          maxHand.value = key
        }
      }
      
    }

    loading.value = false;
  }
}

const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
const option = ref({
  tooltip: {
    position: 'bottom',
    formatter: ({ data }: any) => `<b>${data.label}:</b> ${data.value[2]}`
  },
  grid: {
    height: '80%',
    width: '94%',
    left: '3%',
    top: '0%'
  },
  xAxis: {
    type: 'category',
    data: ranks,
    show: false,
    position: 'top',
    splitArea: {
      show: true
    }
  },
  yAxis: {
    type: 'category',
    data: ranks,
    show: false,
    inverse: true,
    splitArea: {
      show: true
    }
  },
  visualMap: {
    min: 0,
    max: maxCount,
    calculable: true,
    orient: 'horizontal',
    left: 'center',
    bottom: '0%',
    textStyle: {
      color: 'white'
    }
  },
  series: [
    {
      type: 'heatmap',
      data: handsArray.value,
      label: {
        position: 'bottom',
        normal: {
          show: true,
          formatter: (param: any) => `${param.data.label}`
        }
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.8)'
        }
      }
    }
  ]
});

</script>

<style scoped lang="scss">

.stats-wrapper {
  height: calc(100% - 10px);
}

.player-info {
  height: 250px;
  padding: 3% 0 0 0;
  margin: 0 3%;
}
.chart {
  height: calc(100vh - 80px - 300px);
  border-radius: 5px;
}

:global(h2#card-usage ~ .example .example-showcase) {
  background-color: var(--el-fill-color) !important;
}

.el-statistic {
  --el-statistic-content-font-size: 28px;
}

$breakpoint-tablet: 768px;
.statistic-card {
  @media (max-width: $breakpoint-tablet) {
    padding: 5px;
    margin-bottom: 10px;
  }

  height: 100%;
  padding: 20px;
  border-radius: 4px;
  background-color: var(--el-bg-color-overlay);
  box-shadow: 0px 0px 20px 2px rgba(0,0,0,0.4);
}

</style>