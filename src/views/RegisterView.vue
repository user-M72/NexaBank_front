<!-- eslint-disable vue/no-v-model-argument -->
<template>
  <div style="min-height:100vh; background:#060b18; display:flex; align-items:center; justify-content:center; padding:20px; position:relative; overflow:hidden;">

    <!-- Background orbs -->
    <div style="position:fixed; inset:0; pointer-events:none; z-index:0;">
      <div style="position:absolute; top:-15%; right:-10%; width:600px; height:600px; border-radius:50%;
                  background:radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%);
                  animation:pulse 9s ease-in-out infinite;"></div>
      <div style="position:absolute; bottom:-15%; left:-5%; width:700px; height:700px; border-radius:50%;
                  background:radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%);
                  animation:pulse 11s ease-in-out infinite 1.5s;"></div>
      <div style="position:absolute; inset:0; background-image: linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px); background-size: 50px 50px;"></div>
    </div>

    <div style="position:relative; z-index:1; width:100%; max-width:520px;">

      <!-- Logo -->
      <div style="text-align:center; margin-bottom:32px;">
        <div style="display:inline-flex; align-items:center; justify-content:center;
                    width:64px; height:64px; border-radius:20px; margin-bottom:16px;
                    background:linear-gradient(135deg, #3b82f6, #6366f1);
                    box-shadow: 0 16px 48px rgba(99,102,241,0.5);">
          <span style="color:white; font-weight:800; font-size:24px;">N</span>
        </div>
        <h1 style="font-size:28px; font-weight:800; margin:0 0 6px;
                   background:linear-gradient(135deg,#60a5fa,#a78bfa);
                   -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;">
          NexaBank
        </h1>
        <p style="color:#64748b; font-size:14px; margin:0;">Yangi hisob yarating va bank xizmatlaridan foydalaning</p>
      </div>

      <!-- Card -->
      <div style="background:rgba(255,255,255,0.04); backdrop-filter:blur(24px);
                  border:1px solid rgba(255,255,255,0.08); border-radius:24px;
                  padding:36px; box-shadow:0 32px 64px rgba(0,0,0,0.5);">

        <a-form :model="form" :rules="rules" ref="formRef" layout="vertical" @finish="handleRegister">

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
            <a-form-item name="firstName" style="margin-bottom:0;">
              <template #label><span style="color:#94a3b8; font-size:13px; font-weight:500;">Ism</span></template>
              <a-input v-model:value="form.firstName" placeholder="Ismingiz" size="large" style="height:48px;" />
            </a-form-item>
            <a-form-item name="lastName" style="margin-bottom:0;">
              <template #label><span style="color:#94a3b8; font-size:13px; font-weight:500;">Familiya</span></template>
              <a-input v-model:value="form.lastName" placeholder="Familiyangiz" size="large" style="height:48px;" />
            </a-form-item>
          </div>

          <a-form-item name="username" style="margin-top:16px;">
            <template #label><span style="color:#94a3b8; font-size:13px; font-weight:500;">Foydalanuvchi nomi</span></template>
            <a-input v-model:value="form.username" placeholder="@username" size="large" style="height:48px;" />
          </a-form-item>

          <a-form-item name="email">
            <template #label><span style="color:#94a3b8; font-size:13px; font-weight:500;">Email manzil</span></template>
            <a-input v-model:value="form.email" placeholder="email@example.com" size="large" style="height:48px;" />
          </a-form-item>

          <a-form-item name="password" style="margin-bottom:24px;">
            <template #label><span style="color:#94a3b8; font-size:13px; font-weight:500;">Parol</span></template>
            <a-input-password v-model:value="form.password" placeholder="Kamida 8 ta belgi" size="large" style="height:48px;" />
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
              style="width:100%; height:52px; border:none; border-radius:14px; cursor:pointer;
                     font-size:16px; font-weight:700; color:white; letter-spacing:0.3px;
                     background:linear-gradient(135deg, #3b82f6, #6366f1);
                     box-shadow: 0 8px 24px rgba(99,102,241,0.4);
                     transition:all 0.2s ease; outline:none;"
              @mouseenter="e => { e.target.style.transform='translateY(-2px)'; e.target.style.boxShadow='0 12px 32px rgba(99,102,241,0.6)'; }"
              @mouseleave="e => { e.target.style.transform='translateY(0)'; e.target.style.boxShadow='0 8px 24px rgba(99,102,241,0.4)'; }"
            >
              <span v-if="loading">⏳ Ro'yxatdan o'tilmoqda...</span>
              <span v-else>Ro'yxatdan o'tish →</span>
            </button>
          </a-form-item>
        </a-form>

        <div style="display:flex; align-items:center; gap:16px; margin:24px 0;">
          <div style="flex:1; height:1px; background:rgba(255,255,255,0.07);"></div>
          <span style="color:#334155; font-size:12px;">yoki</span>
          <div style="flex:1; height:1px; background:rgba(255,255,255,0.07);"></div>
        </div>

        <div style="text-align:center;">
          <span style="color:#64748b; font-size:14px;">Hisobingiz bormi? </span>
          <router-link to="/login" style="color:#60a5fa; font-size:14px; font-weight:600; text-decoration:none;">
            Kirish →
          </router-link>
        </div>
      </div>

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

const form = reactive({ firstName: '', lastName: '', username: '', email: '', password: '' })
const rules = {
  firstName: [{ required: true, message: 'Ismni kiriting' }],
  lastName:  [{ required: true, message: 'Familiyani kiriting' }],
  username:  [{ required: true, message: 'Foydalanuvchi nomini kiriting' }, { min: 3, message: 'Kamida 3 ta belgi' }],
  email:     [{ required: true, message: 'Emailni kiriting' }, { type: 'email', message: 'Email noto\'g\'ri formatda' }],
  password:  [{ required: true, message: 'Parolni kiriting' }, { min: 8, message: 'Kamida 8 ta belgi' }]
}

async function handleRegister() {
  loading.value = true
  errorMsg.value = ''
  try {
    await authStore.register(form)
    await authStore.fetchUser()
    message.success('Muvaffaqiyatli ro\'yxatdan o\'tdingiz!')
    router.push('/profile')
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'Ro\'yxatdan o\'tishda xatolik yuz berdi'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.2); opacity: 1; }
}
</style>
