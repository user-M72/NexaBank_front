<!-- eslint-disable vue/no-v-model-argument -->
<template>
  <div style="min-height:100vh; background:#060b18; display:flex; align-items:center; justify-content:center; padding:20px; position:relative; overflow:hidden;">

    <!-- Animated background orbs -->
    <div style="position:fixed; inset:0; pointer-events:none; overflow:hidden; z-index:0;">
      <div style="position:absolute; top:-20%; left:-10%; width:600px; height:600px; border-radius:50%;
                  background:radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%);
                  animation: pulse 8s ease-in-out infinite;"></div>
      <div style="position:absolute; bottom:-20%; right:-10%; width:700px; height:700px; border-radius:50%;
                  background:radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%);
                  animation: pulse 10s ease-in-out infinite 2s;"></div>
      <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:400px; height:400px; border-radius:50%;
                  background:radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%);"></div>
      <!-- Grid pattern -->
      <div style="position:absolute; inset:0; background-image: linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px); background-size: 50px 50px;"></div>
    </div>

    <div style="position:relative; z-index:1; width:100%; max-width:440px;">

      <!-- Logo -->
      <div style="text-align:center; margin-bottom:40px;">
        <div style="display:inline-flex; align-items:center; justify-content:center;
                    width:72px; height:72px; border-radius:22px; margin-bottom:20px;
                    background:linear-gradient(135deg, #3b82f6, #6366f1);
                    box-shadow: 0 20px 60px rgba(99,102,241,0.5);">
          <span style="color:white; font-weight:800; font-size:28px;">N</span>
        </div>
        <h1 style="font-size:32px; font-weight:800; margin:0 0 8px;
                   background:linear-gradient(135deg,#60a5fa,#a78bfa);
                   -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;">
          NexaBank
        </h1>
        <p style="color:#64748b; font-size:15px; margin:0;">Xush kelibsiz! Hisobingizga kiring</p>
      </div>

      <!-- Card -->
      <div style="background:rgba(255,255,255,0.04); backdrop-filter:blur(24px);
                  border:1px solid rgba(255,255,255,0.08); border-radius:24px;
                  padding:36px; box-shadow:0 32px 64px rgba(0,0,0,0.5);">

        <a-form :model="form" :rules="rules" ref="formRef" layout="vertical" @finish="handleLogin">

          <a-form-item name="username" style="margin-bottom:20px;">
            <template #label>
              <span style="color:#94a3b8; font-size:13px; font-weight:500;">Foydalanuvchi nomi</span>
            </template>
            <a-input
              v-model:value="form.username"
              placeholder="username"
              size="large"
              style="height:52px; font-size:15px;"
            >
              <template #prefix>
                <span style="color:#475569; margin-right:4px;">👤</span>
              </template>
            </a-input>
          </a-form-item>

          <a-form-item name="password" style="margin-bottom:24px;">
            <template #label>
              <span style="color:#94a3b8; font-size:13px; font-weight:500;">Parol</span>
            </template>
            <a-input-password
              v-model:value="form.password"
              placeholder="Parolni kiriting"
              size="large"
              style="height:52px; font-size:15px;"
            >
              <template #prefix>
                <span style="color:#475569; margin-right:4px;">🔒</span>
              </template>
            </a-input-password>
          </a-form-item>

          <!-- Error -->
          <div v-if="errorMsg" style="background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.25);
                                       border-radius:12px; padding:12px 16px; margin-bottom:20px; display:flex; align-items:center; gap:8px;">
            <span>⚠️</span>
            <span style="color:#f87171; font-size:14px;">{{ errorMsg }}</span>
          </div>

          <a-form-item style="margin-bottom:0;">
            <button
              type="submit"
              :disabled="loading"
              @click="formRef?.submit()"
              style="width:100%; height:52px; border:none; border-radius:14px; cursor:pointer;
                     font-size:16px; font-weight:700; color:white; letter-spacing:0.3px;
                     background:linear-gradient(135deg, #3b82f6, #6366f1);
                     box-shadow: 0 8px 24px rgba(99,102,241,0.4);
                     transition:all 0.2s ease; outline:none;"
              @mouseenter="e => { e.target.style.transform='translateY(-2px)'; e.target.style.boxShadow='0 12px 32px rgba(99,102,241,0.6)'; }"
              @mouseleave="e => { e.target.style.transform='translateY(0)'; e.target.style.boxShadow='0 8px 24px rgba(99,102,241,0.4)'; }"
            >
              <span v-if="loading">⏳ Kirilmoqda...</span>
              <span v-else>Kirish →</span>
            </button>
          </a-form-item>
        </a-form>

        <!-- Divider -->
        <div style="display:flex; align-items:center; gap:16px; margin:24px 0;">
          <div style="flex:1; height:1px; background:rgba(255,255,255,0.07);"></div>
          <span style="color:#334155; font-size:12px;">yoki</span>
          <div style="flex:1; height:1px; background:rgba(255,255,255,0.07);"></div>
        </div>

        <div style="text-align:center;">
          <span style="color:#64748b; font-size:14px;">Hisobingiz yo'qmi? </span>
          <router-link to="/register" style="color:#60a5fa; font-size:14px; font-weight:600; text-decoration:none;">
            Ro'yxatdan o'ting →
          </router-link>
        </div>
      </div>

      <!-- Footer -->
      <p style="text-align:center; margin-top:24px; color:#1e3a5f; font-size:12px;">
        © 2025 NexaBank. Barcha huquqlar himoyalangan.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { message } from 'ant-design-vue'

const router = useRouter()
const authStore = useAuthStore()
const formRef = ref()
const loading = ref(false)
const errorMsg = ref('')

const form = reactive({ username: '', password: '' })
const rules = {
  username: [{ required: true, message: 'Foydalanuvchi nomini kiriting' }],
  password: [{ required: true, message: 'Parolni kiriting' }]
}

async function handleLogin() {
  loading.value = true
  errorMsg.value = ''
  try {
    await authStore.login(form)
    await authStore.fetchUser()
    message.success('Tizimga xush kelibsiz!')
    router.push('/profile')
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'Login yoki parol noto\'g\'ri'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.15); opacity: 1; }
}
</style>
