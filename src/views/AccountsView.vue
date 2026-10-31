<!-- eslint-disable vue/no-v-model-argument -->
<template>
  <AppLayout>
    <!-- Header -->
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:24px;">
      <div>
        <h2 style="margin:0; font-size:22px; font-weight:800; color:#f1f5f9;">Mening Banklarim</h2>
        <p style="margin:4px 0 0; color:#475569; font-size:13px;">Bank hisoblaringizni boshqaring</p>
      </div>
      <button
        @click="createModalVisible = true"
        style="display:flex; align-items:center; gap:8px; padding:10px 20px; border-radius:12px; border:none;
               background:linear-gradient(135deg,#3b82f6,#6366f1); color:white; font-size:14px; font-weight:600;
               cursor:pointer; box-shadow:0 8px 20px rgba(99,102,241,0.35); transition:all 0.2s ease;"
        @mouseenter="e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 12px 28px rgba(99,102,241,0.5)'; }"
        @mouseleave="e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 8px 20px rgba(99,102,241,0.35)'; }"
      >
        <span style="font-size:16px;">+</span> Yangi Hisob
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" style="display:flex; justify-content:center; padding:80px;">
      <a-spin size="large" />
    </div>

    <!-- Empty state -->
    <div v-else-if="accounts.length === 0"
         style="display:flex; flex-direction:column; align-items:center; justify-content:center;
                padding:80px 20px; border-radius:24px; border:2px dashed rgba(255,255,255,0.07);
                background:rgba(255,255,255,0.02);">
      <div style="width:72px; height:72px; border-radius:20px; display:flex; align-items:center; justify-content:center;
                  font-size:32px; background:rgba(59,130,246,0.1); border:1px solid rgba(59,130,246,0.2); margin-bottom:16px;">
        🏦
      </div>
      <p style="margin:0; color:#e2e8f0; font-size:16px; font-weight:600;">Hali hech qanday hisob yo'q</p>
      <p style="margin:8px 0 20px; color:#334155; font-size:14px;">Birinchi bank hisobingizni oching</p>
      <button
        @click="createModalVisible = true"
        style="padding:10px 24px; border-radius:12px; border:none; background:linear-gradient(135deg,#3b82f6,#6366f1);
               color:white; font-size:14px; font-weight:600; cursor:pointer;"
      >Hisob Ochish</button>
    </div>

    <!-- Accounts grid -->
    <div v-else style="display:grid; grid-template-columns:repeat(auto-fill, minmax(300px,1fr)); gap:16px;">
      <div
        v-for="account in accounts"
        :key="account.id"
        style="border-radius:20px; overflow:hidden; cursor:pointer; transition:all 0.25s ease;
               border:1px solid rgba(255,255,255,0.06); background:#080d1e;"
        @click="goToAccount(account.id)"
        @mouseenter="e => { e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.boxShadow='0 24px 48px rgba(0,0,0,0.5)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.12)'; }"
        @mouseleave="e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.borderColor='rgba(255,255,255,0.06)'; }"
      >
        <!-- Gradient top bar -->
        <div style="height:4px; width:100%;" :style="{ background: bankGradient(account.bankName) }"></div>

        <div style="padding:20px;">
          <!-- Bank name + status -->
          <div style="display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:16px;">
            <div style="display:flex; align-items:center; gap:12px;">
              <div style="width:44px; height:44px; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0;"
                   :style="{ background: bankBgSoft(account.bankName) }">
                🏦
              </div>
              <div>
                <p style="margin:0; font-size:15px; font-weight:700; color:#f1f5f9;">{{ account.bankName }}</p>
                <p style="margin:2px 0 0; font-size:12px; color:#475569; font-weight:500;">{{ accountTypeLabel(account.type) }}</p>
              </div>
            </div>
            <span style="font-size:11px; font-weight:700; padding:4px 10px; border-radius:20px;"
                  :style="account.blocked
                    ? { background:'rgba(239,68,68,0.12)', color:'#f87171', border:'1px solid rgba(239,68,68,0.2)' }
                    : { background:'rgba(34,197,94,0.1)', color:'#4ade80', border:'1px solid rgba(34,197,94,0.2)' }">
              {{ account.blocked ? '🔒 Bloklangan' : '✓ Faol' }}
            </span>
          </div>

          <!-- Stats -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:16px;">
            <div style="border-radius:12px; padding:12px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.04);">
              <p style="margin:0; color:#334155; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.6px;">Kartalar</p>
              <p style="margin:6px 0 0; font-size:22px; font-weight:800; color:#60a5fa;">{{ account.cards?.length || 0 }}</p>
            </div>
            <div style="border-radius:12px; padding:12px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.04);">
              <p style="margin:0; color:#334155; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.6px;">Ochilgan</p>
              <p style="margin:6px 0 0; font-size:13px; font-weight:600; color:#94a3b8;">{{ formatDate(account.createdDate) }}</p>
            </div>
          </div>

          <!-- Footer -->
          <div style="display:flex; align-items:center; justify-content:space-between; padding-top:14px; border-top:1px solid rgba(255,255,255,0.04);">
            <span style="color:#334155; font-size:12px;">Kartalarni ko'rish →</span>
            <button
              v-if="!account.blocked"
              @click.stop="blockAccount(account.id)"
              :disabled="blockingId === account.id"
              style="padding:5px 12px; border-radius:8px; border:1px solid rgba(239,68,68,0.3);
                     background:rgba(239,68,68,0.08); color:#f87171; font-size:11px; font-weight:600;
                     cursor:pointer; transition:all 0.2s ease;"
              @mouseenter="e => e.currentTarget.style.background='rgba(239,68,68,0.18)'"
              @mouseleave="e => e.currentTarget.style.background='rgba(239,68,68,0.08)'"
            >
              Bloklash
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ Create Account Modal ═══ -->
    <a-modal v-model:open="createModalVisible" :footer="null" :closable="true" width="480px"
             style="top:60px;">
      <template #title>
        <div style="display:flex; align-items:center; gap:10px;">
          <div style="width:32px; height:32px; border-radius:10px; background:linear-gradient(135deg,#3b82f6,#6366f1);
                      display:flex; align-items:center; justify-content:center; font-size:14px;">🏦</div>
          <span style="font-size:16px; font-weight:700; color:#e2e8f0;">Yangi Bank Hisobi Ochish</span>
        </div>
      </template>

      <a-form :model="createForm" layout="vertical" @finish="handleCreate" style="margin-top:20px;">
        <a-form-item name="bankName" :rules="[{required:true,message:'Bankni tanlang'}]">
          <template #label><span style="color:#94a3b8; font-size:13px; font-weight:500;">Bank nomi</span></template>
          <a-select v-model:value="createForm.bankName" placeholder="Bankni tanlang" size="large" show-search>
            <a-select-option v-for="b in banks" :key="b" :value="b">{{ b }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item name="type" :rules="[{required:true,message:'Hisob turini tanlang'}]">
          <template #label><span style="color:#94a3b8; font-size:13px; font-weight:500;">Hisob turi</span></template>
          <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:10px;">
            <div
              v-for="t in accountTypes"
              :key="t.value"
              @click="createForm.type = t.value"
              style="border-radius:12px; padding:12px 8px; text-align:center; cursor:pointer; transition:all 0.2s ease;
                     border:1.5px solid rgba(255,255,255,0.08);"
              :style="createForm.type === t.value
                ? { borderColor:'#3b82f6', background:'rgba(59,130,246,0.1)' }
                : { background:'transparent' }"
            >
              <div style="font-size:20px; margin-bottom:4px;">{{ t.icon }}</div>
              <p style="margin:0; font-size:12px; font-weight:600;"
                 :style="{ color: createForm.type === t.value ? '#60a5fa' : '#64748b' }">{{ t.label }}</p>
            </div>
          </div>
        </a-form-item>

        <a-form-item name="currency">
          <template #label><span style="color:#94a3b8; font-size:13px; font-weight:500;">Valyuta</span></template>
          <a-select v-model:value="createForm.currency" size="large">
            <a-select-option value="USD">🇺🇸 USD — AQSh dollari</a-select-option>
          </a-select>
        </a-form-item>

        <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:8px;">
          <button
            type="button"
            @click="createModalVisible = false"
            style="padding:9px 18px; border-radius:10px; border:1px solid rgba(255,255,255,0.1);
                   background:rgba(255,255,255,0.04); color:#94a3b8; font-size:13px; cursor:pointer;"
          >Bekor</button>
          <button
            type="button"
            @click="submitCreate"
            :disabled="creating"
            style="padding:9px 20px; border-radius:10px; border:none;
                   background:linear-gradient(135deg,#3b82f6,#6366f1); color:white; font-size:13px;
                   font-weight:600; cursor:pointer; box-shadow:0 4px 12px rgba(99,102,241,0.3);"
          >
            {{ creating ? '⏳ Ochilmoqda...' : 'Hisob Ochish' }}
          </button>
        </div>
      </a-form>
    </a-modal>
  </AppLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import AppLayout from '../components/AppLayout.vue'
import { accountApi } from '../api/client'

const router = useRouter()
const loading = ref(true)
const creating = ref(false)
const blockingId = ref(null)
const createModalVisible = ref(false)
const accounts = ref([])
const createFormRef = ref()

const banks = [
  'Kapitalbank', "O'zbekiston Milliy Banki", 'Hamkorbank', 'Ipoteka-bank',
  'Uzpromstroybank', 'Aloqabank', 'Asaka Bank', 'Orient Finance Bank',
  'TBC Bank', 'Anorbank', 'Davr Bank', 'InFinBank'
]

const accountTypes = [
  { value: 'CHECKING', label: 'Joriy', icon: '💳' },
  { value: 'SAVINGS',  label: "Jamg'arma", icon: '🏦' },
  { value: 'CREDIT',   label: 'Kredit', icon: '💰' }
]

const createForm = reactive({ bankName: undefined, type: undefined, currency: 'USD' })

async function load() {
  loading.value = true
  try {
    const { data } = await accountApi.getMyAccounts()
    accounts.value = data
  } catch {
    message.error('Hisoblarni yuklashda xatolik')
  } finally {
    loading.value = false
  }
}

function submitCreate() {
  if (!createForm.bankName) { message.warning('Bankni tanlang'); return }
  if (!createForm.type) { message.warning('Hisob turini tanlang'); return }
  handleCreate()
}

async function handleCreate() {
  creating.value = true
  try {
    const { data } = await accountApi.create(createForm)
    accounts.value.unshift(data)
    createModalVisible.value = false
    Object.assign(createForm, { bankName: undefined, type: undefined, currency: 'USD' })
    message.success(`${data.bankName} hisobi muvaffaqiyatli ochildi!`)
  } catch (err) {
    message.error(err.response?.data?.message || 'Hisob ochishda xatolik')
  } finally {
    creating.value = false
  }
}

function blockAccount(id) {
  Modal.confirm({
    title: 'Hisobni bloklash',
    content: 'Haqiqatan ham bu hisobni bloklashni xohlaysizmi?',
    okText: 'Bloklash', okType: 'danger', cancelText: 'Bekor',
    async onOk() {
      blockingId.value = id
      try {
        const { data } = await accountApi.block(id)
        const idx = accounts.value.findIndex(a => a.id === id)
        if (idx !== -1) accounts.value[idx] = data
        message.success('Hisob bloklandi')
      } catch (err) {
        message.error(err.response?.data?.message || 'Bloklashda xatolik')
      } finally { blockingId.value = null }
    }
  })
}

const goToAccount = id => router.push(`/accounts/${id}`)
const formatDate = d => d ? new Date(d).toLocaleDateString('uz-UZ', { month:'short', year:'numeric' }) : '—'
const accountTypeLabel = t => ({ CHECKING:'Joriy hisob', SAVINGS:"Jamg'arma", CREDIT:'Kredit' }[t] || t)

const bankColors = {
  'Kapitalbank':              { from:'#1d4ed8', to:'#3b82f6' },
  "O'zbekiston Milliy Banki": { from:'#065f46', to:'#10b981' },
  'Hamkorbank':               { from:'#7c3aed', to:'#a78bfa' },
  'Ipoteka-bank':             { from:'#b45309', to:'#f59e0b' },
  'TBC Bank':                 { from:'#be185d', to:'#ec4899' },
  'Anorbank':                 { from:'#dc2626', to:'#f87171' },
  'Asaka Bank':               { from:'#0e7490', to:'#22d3ee' },
  'Aloqabank':                { from:'#4338ca', to:'#818cf8' },
}
const bankGradient = n => {
  const c = bankColors[n]
  return c ? `linear-gradient(135deg,${c.from},${c.to})` : 'linear-gradient(135deg,#334155,#475569)'
}
const bankBgSoft = n => {
  const c = bankColors[n]
  return c ? `rgba(${hexToRgb(c.from)},0.15)` : 'rgba(100,116,139,0.1)'
}
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16)
  return `${r},${g},${b}`
}

onMounted(load)
</script>
