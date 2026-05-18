
<template>
  <div class="login-container">
    <div class="login-box">
      <h1>TeamPlan360</h1>
      <p class="subtitle">团队工作计划与报告系统</p>
      
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" />
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input 
            v-model="loginForm.password" 
            type="password" 
            placeholder="请输入密码"
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleLogin" :loading="loading" style="width: 100%">
            登录
          </el-button>
        </el-form-item>
      </el-form>
      
      <div v-if="showDemoCredentials" class="demo-credentials">
        <el-divider>演示账号</el-divider>
        <p><strong>部门经理:</strong> manager / manager123</p>
        <p><strong>普通员工:</strong> employee / employee123</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { ElMessage } from 'element-plus'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const loginForm = ref({
      username: '',
      password: ''
    })
    
    const loading = ref(false)
    const loginFormRef = ref()
    const showDemoCredentials = import.meta.env.DEV
    
    const rules = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
      ]
    }
    
    const handleLogin = async () => {
      if (!loginFormRef.value) return
      
      await loginFormRef.value.validate(async (valid) => {
        if (valid) {
          loading.value = true
          try {
            await authStore.login(loginForm.value.username, loginForm.value.password)
            ElMessage.success('登录成功')
            
            if (authStore.isManager) {
              router.push('/manager')
            } else {
              router.push('/employee')
            }
          } catch (error) {
            ElMessage.error(error)
          } finally {
            loading.value = false
          }
        }
      })
    }
    
    return {
      loginForm,
      rules,
      loading,
      loginFormRef,
      showDemoCredentials,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 400px;
  max-width: 90%;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 10px;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
}

.demo-credentials {
  margin-top: 30px;
  text-align: center;
  color: #666;
  font-size: 14px;
}

.demo-credentials p {
  margin: 5px 0;
}
</style>
