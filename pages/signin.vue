<template>
  <div class="container">
    <el-card>
      <el-form
        ref="ruleFormRef"
        :model="form"
        :rules="rules"
        :disabled="loading"
        @submit.prevent="submitForm"
        label-width="0px"
      >
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <h3>Sign in</h3>
          <el-button text @click="navigateTo('/signup')">Sign up..</el-button>
        </div>
        <el-form-item prop="login">
          <el-input v-model="form.login" placeholder="Login" label="Login"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            label="Password"
            placeholder="Password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item> 
          <el-button style="width: 100%" :loading="loading" @click="submitForm">Sign in</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { FormInstance, FormRules } from 'element-plus';

const client = useSupabaseAuthClient();
const user = useSupabaseUser();
const router = useRouter();

const ruleFormRef = ref<FormInstance>()
const loading = ref(false)

watchEffect(() => {
  if (user.value) {
    navigateTo('/')
  }
})

const form = reactive({
  login: '',
  password: '',
})

const rules = reactive<FormRules>({
  login: [
    { required: true, message: 'Please input Login', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please input Password', trigger: 'blur' },
    { min: 6, message: 'Min 6', trigger: 'blur' }
  ],
});

const submitForm = async () => {
  if (!ruleFormRef.value || loading.value) {
    return;
  }

  ruleFormRef.value.validate(async (valid) => {
    if (!valid) {
     return; 
    }
    
    loading.value = true;

    const { data, error } = await client.auth.signInWithPassword({
      email: form.login + '@hands.com',
      password: form.password
    })

    if (error) {
      ElNotification({
        title: 'Error',
        message: 'This is an error message',
        type: 'error',
      })
      loading.value = false;
      return
    }

    await router.push('/');
    
    loading.value = false;
  })
}

</script>

<style lang="scss">
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>