<!-- eslint-disable vue/no-v-model-argument -->
<template>
  <AppLayout>
    <!-- Loading -->
    <div v-if="loading" style="display:flex; justify-content:center; align-items:center; height:400px;">
      <a-spin size="large" />
    </div>

    <div v-else-if="profile" style="max-width:900px; margin:0 auto;">

      <!-- ═══ Profile Hero Card ═══ -->
      <div style="border-radius:24px; padding:32px; margin-bottom:20px; position:relative; overflow:hidden;
                  background:linear-gradient(135deg, #0d1526 0%, #0f1e3d 50%, #0d1a3a 100%);
                  border:1px solid rgba(255,255,255,0.07); box-shadow:0 20px 60px rgba(0,0,0,0.4);">

        <!-- BG decoration -->
        <div style="position:absolute; top:-40px; right:-40px; width:250px; height:250px; border-radius:50%;
                    background:radial-gradient(circle,rgba(139,92,246,0.12),transparent); pointer-events:none;"></div>
        <div style="position:absolute; bottom:-60px; left:100px; width:300px; height:300px; border-radius:50%;
                    background:radial-gradient(circle,rgba(59,130,246,0.07),transparent); pointer-events:none;"></div>

        <div style="position:relative; display:flex; flex-wrap:wrap; align-items:center; gap:20px;">
          <!-- Avatar -->
          <div style="width:80px; height:80px; border-radius:20px; display:flex; align-items:center; justify-content:center;
                      font-size:28px; font-weight:800; color:white; flex-shrink:0;
                      background:linear-gradient(135deg,#3b82f6,#8b5cf6);
                      box-shadow:0 12px 32px rgba(99,102,241,0.4);">
            {{ initials }}
          </div>

          <div style="flex:1; min-width:200px;">
            <h2 style="margin:0 0 4px; font-size:24px; font-weight:800; color:#f1f5f9;">
              {{ profile.firstName }} {{ profile.lastName }}
            </h2>
            <p style="margin:0; color:#60a5fa; font-size:14px; font-weight:500;">@{{ profile.username }}</p>
            <p style="margin:4px 0 0; color:#475569; font-size:13px;">{{ profile.email }}</p>
          </div>

          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button
              @click="editModalVisible = true"
              style="padding:9px 18px; border-radius:12px; border:1px solid rgba(255,255,255,0.1);
                     background:rgba(255,255,255,0.06); color:#94a3b8; font-size:13px; font-weight:500;
                     cursor:pointer; transition:all 0.2s ease;"
              @mouseenter="e => { e.currentTarget.style.borderColor='#3b82f6'; e.currentTarget.style.color='#60a5fa'; }"
              @mouseleave="e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; e.currentTarget.style.color='#94a3b8'; }"
            >✏️ Tahrirlash</button>
            <button
              @click="pwdModalVisible = true"
              style="padding:9px 18px; border-radius:12px; border:1px solid rgba(255,255,255,0.1);
                     background:rgba(255,255,255,0.06); color:#94a3b8; font-size:13px; font-weight:500;
                     cursor:pointer; transition:all 0.2s ease;"
              @mouseenter="e => { e.currentTarget.style.borderColor='#6366f1'; e.currentTarget.style.color='#a78bfa'; }"
              @mouseleave="e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; e.currentTarget.style.color='#94a3b8'; }"
            >🔒 Parol</button>
          </div>
        </div>

        <!-- Stats row -->
        <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-top:24px; position:relative;">
          <div style="border-radius:16px; padding:16px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.06);">
            <p style="margin:0; color:#475569; font-size:11px; text-transform:uppercase; letter-spacing:0.8px; font-weight:600;">Ro'yxatdan</p>
            <p style="margin:6px 0 0; color:#94a3b8; font-size:13px; font-weight:600;">{{ formatDate(profile.createDate) }}</p>
          </div>
          <div style="border-radius:16px; padding:16px; background:rgba(59,130,246,0.08); border:1px solid rgba(59,130,246,0.15);">
            <p style="margin:0; color:#3b82f6; font-size:11px; text-transform:uppercase; letter-spacing:0.8px; font-weight:600;">Banklar</p>
            <p style="margin:6px 0 0; font-size:28px; font-weight:800; color:#60a5fa;">{{ accountCount }}</p>
          </div>
          <div style="border-radius:16px; padding:16px; background:rgba(139,92,246,0.08); border:1px solid rgba(139,92,246,0.15);">
            <p style="margin:0; color:#8b5cf6; font-size:11px; text-transform:uppercase; letter-spacing:0.8px; font-weight:600;">Kartalar</p>
            <p style="margin:6px 0 0; font-size:28px; font-weight:800; color:#a78bfa;">{{ cardCount }}</p>
          </div>
        </div>
      </div>

      <!-- ═══ Quick Actions ═══ -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:20px;">
        <router-link to="/accounts" style="text-decoration:none;">
          <div style="border-radius:20px; padding:20px; border:1px solid rgba(255,255,255,0.06);
                      background:linear-gradient(135deg,rgba(29,78,216,0.15),rgba(59,130,246,0.08));
                      cursor:pointer; transition:all 0.25s ease; display:flex; align-items:center; gap:16px;"
               @mouseenter="e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 20px 40px rgba(29,78,216,0.25)'; }"
               @mouseleave="e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }">
            <div style="width:48px; height:48px; border-radius:14px; display:flex; align-items:center; justify-content:center;
                        font-size:22px; background:linear-gradient(135deg,#1d4ed8,#3b82f6);
                        box-shadow:0 8px 20px rgba(59,130,246,0.3); flex-shrink:0;">🏦</div>
            <div>
              <p style="margin:0; color:#e2e8f0; font-size:15px; font-weight:700;">Mening Banklarim</p>
              <p style="margin:3px 0 0; color:#475569; font-size:12px;">Hisob va kartalarni boshqaring</p>
            </div>
            <span style="margin-left:auto; color:#334155; font-size:20px;">›</span>
          </div>
        </router-link>

        <router-link to="/transfer" style="text-decoration:none;">
          <div style="border-radius:20px; padding:20px; border:1px solid rgba(255,255,255,0.06);
                      background:linear-gradient(135deg,rgba(124,58,237,0.15),rgba(139,92,246,0.08));
                      cursor:pointer; transition:all 0.25s ease; display:flex; align-items:center; gap:16px;"
               @mouseenter="e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 20px 40px rgba(124,58,237,0.25)'; }"
               @mouseleave="e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }">
            <div style="width:48px; height:48px; border-radius:14px; display:flex; align-items:center; justify-content:center;
                        font-size:22px; background:linear-gradient(135deg,#7c3aed,#8b5cf6);
                        box-shadow:0 8px 20px rgba(139,92,246,0.3); flex-shrink:0;">💸</div>
            <div>
              <p style="margin:0; color:#e2e8f0; font-size:15px; font-weight:700;">Pul O'tkazish</p>
              <p style="margin:3px 0 0; color:#475569; font-size:12px;">Boshqa foydalanuvchiga o'tkazing</p>
            </div>
            <span style="margin-left:auto; color:#334155; font-size:20px;">›</span>
          </div>
        </router-link>
      </div>

      <!-- ═══ Recent Transactions ═══ -->
      <div style="border-radius:20px; border:1px solid rgba(255,255,255,0.06); overflow:hidden; background:#080d1e;">
        <div style="padding:18px 24px; border-bottom:1px solid rgba(255,255,255,0.05); display:flex; align-items:center; justify-content:space-between;">
          <h3 style="margin:0; font-size:15px; font-weight:700; color:#e2e8f0;">So'nggi Tranzaksiyalar</h3>
          <router-link to="/transfer" style="color:#60a5fa; font-size:13px; font-weight:500; text-decoration:none;">Hammasini ko'rish →</router-link>
        </div>

        <!-- Empty -->
        <div v-if="transactions.length === 0" style="text-align:center; padding:48px 20px;">
          <p style="font-size:36px; margin:0 0 12px;">📭</p>
          <p style="color:#334155; font-size:14px; margin:0;">Tranzaksiyalar hali yo'q</p>
        </div>

        <!-- List -->
        <div v-else>
          <div
            v-for="tx in transactions.slice(0,5)"
            :key="tx.id"
            style="display:flex; align-items:center; gap:14px; padding:14px 24px;
                   border-bottom:1px solid rgba(255,255,255,0.03); transition:background 0.15s ease;"
            @mouseenter="e => e.currentTarget.style.background='rgba(255,255,255,0.02)'"
            @mouseleave="e => e.currentTarget.style.background='transparent'"
          >
            <div style="width:40px; height:40px; border-radius:12px; display:flex; align-items:center; justify-content:center;
                        font-size:18px; flex-shrink:0;"
                 :style="{ background: tx.type==='DEPOSIT' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.1)' }">
              {{ tx.type === 'DEPOSIT' ? '⬇️' : tx.type === 'TRANSFER' ? '↔️' : '⬆️' }}
            </div>
            <div style="flex:1; min-width:0;">
              <p style="margin:0; color:#e2e8f0; font-size:14px; font-weight:600;">{{ txLabel(tx) }}</p>
              <p style="margin:2px 0 0; color:#334155; font-size:12px;">{{ formatDate(tx.createdDate) }}</p>
            </div>
            <div style="text-align:right;">
              <p style="margin:0; font-size:15px; font-weight:700;"
                 :style="{ color: tx.type==='DEPOSIT' ? '#22c55e' : '#f87171' }">
                {{ tx.type==='DEPOSIT' ? '+' : '-' }}${{ Number(tx.amount).toLocaleString() }}
              </p>
              <span style="font-size:10px; padding:2px 8px; border-radius:6px; font-weight:600;"
                    :style="statusStyle(tx.status)">
                {{ statusLabel(tx.status) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ Edit Profile Modal ═══ -->
    <a-modal v-model:open="editModalVisible" title="Profilni Tahrirlash" :footer="null" width="480px">
      <a-form :model="editForm" layout="vertical" @finish="handleUpdateProfile" style="margin-top:16px;">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
          <a-form-item name="firstName" :rules="[{required:true}]">
            <template #label><span style="color:#94a3b8; font-size:13px;">Ism</span></template>
            <a-input v-model:value="editForm.firstName" size="large" />
          </a-form-item>
          <a-form-item name="lastName" :rules="[{required:true}]">
            <template #label><span style="color:#94a3b8; font-size:13px;">Familiya</span></template>
            <a-input v-model:value="editForm.lastName" size="large" />
          </a-form-item>
        </div>
        <a-form-item name="username" :rules="[{required:true}]">
          <template #label><span style="color:#94a3b8; font-size:13px;">Foydalanuvchi nomi</span></template>
          <a-input v-model:value="editForm.username" size="large" />
        </a-form-item>
        <a-form-item name="email" :rules="[{required:true},{type:'email'}]">
          <template #label><span style="color:#94a3b8; font-size:13px;">Email</span></template>
          <a-input v-model:value="editForm.email" size="large" />
        </a-form-item>
        <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:4px;">
          <a-button @click="editModalVisible=false">Bekor</a-button>
          <a-button type="primary" html-type="submit" :loading="saving">Saqlash</a-button>
        </div>
      </a-form>
    </a-modal>

    <!-- ═══ Change Password Modal ═══ -->
    <a-modal v-model:open="pwdModalVisible" title="Parolni O'zgartirish" :footer="null" width="440px">
      <a-form :model="pwdForm" layout="vertical" @finish="handleChangePassword" style="margin-top:16px;">
        <a-form-item name="currentPassword" :rules="[{required:true}]">
          <template #label><span style="color:#94a3b8; font-size:13px;">Joriy parol</span></template>
          <a-input-password v-model:value="pwdForm.currentPassword" size="large" />
        </a-form-item>
        <a-form-item name="newPassword" :rules="[{required:true},{min:8,message:'Kamida 8 belgi'}]">
          <template #label><span style="color:#94a3b8; font-size:13px;">Yangi parol</span></template>
          <a-input-password v-model:value="pwdForm.newPassword" size="large" />
        </a-form-item>
        <a-form-item name="confirmPassword" :rules="[{required:true}]">
          <template #label><span style="color:#94a3b8; font-size:13px;">Yangi parolni tasdiqlang</span></template>
          <a-input-password v-model:value="pwdForm.confirmPassword" size="large" />
        </a-form-item>
        <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:4px;">
          <a-button @click="pwdModalVisible=false">Bekor</a-button>
          <a-button type="primary" html-type="submit" :loading="saving">O'zgartirish</a-button>
        </div>
      </a-form>
    </a-modal>
  </AppLayout>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import AppLayout from '../components/AppLayout.vue'
import { useAuthStore } from '../stores/auth'
import { userApi, accountApi, transactionApi } from '../api/client'

const authStore = useAuthStore()
const loading = ref(true)
const saving = ref(false)
const profile = ref(null)
const accountCount = ref(0)
const cardCount = ref(0)
const transactions = ref([])
const editModalVisible = ref(false)
const pwdModalVisible = ref(false)

const editForm = reactive({ firstName:'', lastName:'', username:'', email:'' })
const pwdForm = reactive({ currentPassword:'', newPassword:'', confirmPassword:'' })

const initials = computed(() => {
  if (!profile.value) return 'N'
  return (profile.value.firstName?.[0] || '') + (profile.value.lastName?.[0] || '')
})

async function load() {
  loading.value = true
  try {
    const [pRes, aRes, tRes] = await Promise.all([
      userApi.getMe(),
      accountApi.getMyAccounts(),
      transactionApi.getHistory()
    ])
    profile.value = pRes.data
    authStore.user = pRes.data
    Object.assign(editForm, { firstName: pRes.data.firstName, lastName: pRes.data.lastName, username: pRes.data.username, email: pRes.data.email })
    accountCount.value = aRes.data.length
    cardCount.value = aRes.data.reduce((s, a) => s + (a.cards?.length || 0), 0)
    transactions.value = tRes.data || []
  } catch {
    message.error('Ma\'lumotlarni yuklashda xatolik')
  } finally {
    loading.value = false
  }
}

async function handleUpdateProfile() {
  saving.value = true
  try {
    const { data } = await userApi.updateMe(editForm)
    profile.value = { ...profile.value, ...data }
    authStore.user = profile.value
    message.success('Profil muvaffaqiyatli yangilandi!')
    editModalVisible.value = false
  } catch (err) {
    message.error(err.response?.data?.message || 'Xatolik')
  } finally { saving.value = false }
}

async function handleChangePassword() {
  saving.value = true
  try {
    await userApi.changePassword(pwdForm)
    message.success('Parol muvaffaqiyatli o\'zgartirildi!')
    pwdModalVisible.value = false
    Object.assign(pwdForm, { currentPassword:'', newPassword:'', confirmPassword:'' })
  } catch (err) {
    message.error(err.response?.data?.message || 'Xatolik')
  } finally { saving.value = false }
}

const formatDate = d => d ? new Date(d).toLocaleDateString('uz-UZ', { year:'numeric', month:'short', day:'numeric' }) : '—'
const txLabel = tx => ({ DEPOSIT:"Hisob to'ldirish", TRANSFER:"Pul o'tkazma", WITHDRAWAL:'Yechib olish' }[tx.type] || tx.type)
const statusLabel = s => ({ SUCCESS:'Bajarildi', FAILED:'Xato', PENDING:'Kutilmoqda', CANCELLED:'Bekor' }[s] || s)
const statusStyle = s => ({
  SUCCESS: { background:'rgba(34,197,94,0.15)', color:'#22c55e' },
  FAILED:  { background:'rgba(239,68,68,0.15)', color:'#f87171' },
  PENDING: { background:'rgba(59,130,246,0.15)', color:'#60a5fa' },
  CANCELLED: { background:'rgba(100,116,139,0.15)', color:'#64748b' }
}[s] || { background:'rgba(100,116,139,0.15)', color:'#64748b' })

onMounted(load)
</script>
