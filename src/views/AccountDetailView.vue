<!-- eslint-disable vue/no-v-model-argument -->
<template>
  <AppLayout>
    <!-- Back -->
    <div style="margin-bottom:20px;">
      <button
        @click="router.push('/accounts')"
        style="display:flex; align-items:center; gap:8px; padding:8px 16px; border-radius:10px;
               border:1px solid rgba(255,255,255,0.08); background:rgba(255,255,255,0.04);
               color:#94a3b8; font-size:13px; cursor:pointer; transition:all 0.2s ease;"
        @mouseenter="e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.16)'; e.currentTarget.style.color='#e2e8f0'; }"
        @mouseleave="e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; e.currentTarget.style.color='#94a3b8'; }"
      >
        ← Mening Banklarim
      </button>
    </div>

    <div v-if="loading" style="display:flex; justify-content:center; padding:80px;">
      <a-spin size="large" />
    </div>

    <div v-else-if="account" style="max-width:960px; margin:0 auto;">

      <!-- ═══ Account Header ═══ -->
      <div style="border-radius:24px; padding:28px; margin-bottom:20px; position:relative; overflow:hidden;
                  border:1px solid rgba(255,255,255,0.07); background:#080d1e;">
        <div style="position:absolute; top:0; left:0; right:0; height:4px;"
             :style="{ background: bankGradient(account.bankName) }"></div>
        <div style="position:absolute; top:-60px; right:-60px; width:200px; height:200px; border-radius:50%;
                    background:radial-gradient(circle,rgba(59,130,246,0.08),transparent); pointer-events:none;"></div>

        <div style="display:flex; flex-wrap:wrap; align-items:center; gap:16px; margin-top:8px;">
          <div style="width:56px; height:56px; border-radius:16px; display:flex; align-items:center; justify-content:center;
                      font-size:24px; flex-shrink:0;"
               :style="{ background: bankBgSoft(account.bankName) }">🏦</div>

          <div style="flex:1; min-width:150px;">
            <h2 style="margin:0 0 4px; font-size:20px; font-weight:800; color:#f1f5f9;">{{ account.bankName }}</h2>
            <div style="display:flex; align-items:center; gap:10px;">
              <span style="color:#475569; font-size:13px;">{{ accountTypeLabel(account.type) }}</span>
              <span style="width:4px; height:4px; border-radius:50%; background:#1e293b;"></span>
              <span style="font-size:11px; font-weight:700; padding:3px 10px; border-radius:20px;"
                    :style="account.blocked
                      ? { background:'rgba(239,68,68,0.12)', color:'#f87171', border:'1px solid rgba(239,68,68,0.2)' }
                      : { background:'rgba(34,197,94,0.1)', color:'#4ade80', border:'1px solid rgba(34,197,94,0.2)' }">
                {{ account.blocked ? '🔒 Bloklangan' : '✓ Faol' }}
              </span>
            </div>
          </div>

          <button
            @click="createCardModalVisible = true"
            :disabled="account.blocked"
            style="display:flex; align-items:center; gap:8px; padding:10px 20px; border-radius:12px; border:none;
                   background:linear-gradient(135deg,#3b82f6,#6366f1); color:white; font-size:13px; font-weight:600;
                   cursor:pointer; box-shadow:0 6px 16px rgba(99,102,241,0.3); transition:all 0.2s ease;"
            :style="account.blocked ? { opacity: 0.4, cursor: 'not-allowed' } : {}"
            @mouseenter="e => { if(!account.blocked) e.currentTarget.style.boxShadow='0 10px 24px rgba(99,102,241,0.5)'; }"
            @mouseleave="e => e.currentTarget.style.boxShadow='0 6px 16px rgba(99,102,241,0.3)'"
          >
            + Yangi Karta Ochish
          </button>
        </div>

        <!-- Stats -->
        <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-top:20px;">
          <div style="border-radius:14px; padding:14px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.04);">
            <p style="margin:0; color:#334155; font-size:11px; text-transform:uppercase; letter-spacing:0.7px; font-weight:600;">Kartalar</p>
            <p style="margin:6px 0 0; font-size:26px; font-weight:800; color:#60a5fa;">{{ account.cards?.length || 0 }}</p>
          </div>
          <div style="border-radius:14px; padding:14px; background:rgba(34,197,94,0.06); border:1px solid rgba(34,197,94,0.1);">
            <p style="margin:0; color:#16a34a; font-size:11px; text-transform:uppercase; letter-spacing:0.7px; font-weight:600;">Umumiy Balans</p>
            <p style="margin:6px 0 0; font-size:22px; font-weight:800; color:#4ade80;">${{ totalBalance.toLocaleString() }}</p>
          </div>
          <div style="border-radius:14px; padding:14px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.04);">
            <p style="margin:0; color:#334155; font-size:11px; text-transform:uppercase; letter-spacing:0.7px; font-weight:600;">Ochilgan Sana</p>
            <p style="margin:6px 0 0; font-size:13px; font-weight:600; color:#94a3b8;">{{ formatDate(account.createdDate) }}</p>
          </div>
        </div>
      </div>

      <!-- ═══ Cards Section ═══ -->
      <h3 style="margin:0 0 16px; font-size:15px; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:0.8px;">
        💳 Kartalar
      </h3>

      <!-- Empty -->
      <div v-if="!account.cards?.length"
           style="display:flex; flex-direction:column; align-items:center; justify-content:center;
                  padding:60px 20px; border-radius:20px; border:2px dashed rgba(255,255,255,0.06);
                  background:rgba(255,255,255,0.015);">
        <div style="font-size:36px; margin-bottom:12px;">💳</div>
        <p style="margin:0; color:#e2e8f0; font-size:15px; font-weight:600;">Hali karta yo'q</p>
        <p style="margin:8px 0 20px; color:#334155; font-size:13px;">Ushbu hisob uchun karta oching</p>
        <button
          @click="createCardModalVisible = true"
          style="padding:10px 22px; border-radius:12px; border:none;
                 background:linear-gradient(135deg,#3b82f6,#6366f1); color:white;
                 font-size:13px; font-weight:600; cursor:pointer;"
        >Karta Ochish</button>
      </div>

      <!-- Cards visual grid -->
      <div v-else>
        <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:16px; margin-bottom:16px;">
          <div
            v-for="card in account.cards"
            :key="card.id"
            style="border-radius:20px; overflow:hidden; position:relative; transition:all 0.25s ease;"
            :class="card.type === 'VISA' ? 'card-visa' : 'card-mastercard'"
            :style="card.blocked ? { filter:'grayscale(0.85)', opacity:0.7 } : {}"
            @mouseenter="e => { if(!card.blocked) e.currentTarget.style.transform='translateY(-6px) scale(1.01)'; }"
            @mouseleave="e => e.currentTarget.style.transform='none'"
          >
            <!-- Blocked overlay -->
            <div v-if="card.blocked"
                 style="position:absolute; inset:0; z-index:10; display:flex; align-items:center; justify-content:center;
                        background:rgba(0,0,0,0.55); backdrop-filter:blur(3px);">
              <div style="text-align:center;">
                <div style="font-size:28px;">🔒</div>
                <p style="margin:4px 0 0; color:#94a3b8; font-size:13px; font-weight:600;">Bloklangan</p>
              </div>
            </div>

            <!-- Shine effect -->
            <div style="position:absolute; top:-40%; left:-40%; width:80%; height:80%; border-radius:50%;
                        background:radial-gradient(circle,rgba(255,255,255,0.06),transparent); pointer-events:none;"></div>

            <div style="padding:22px; height:190px; display:flex; flex-direction:column; justify-content:space-between; position:relative;">
              <!-- Top row -->
              <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                  <p style="margin:0; color:rgba(255,255,255,0.4); font-size:10px; letter-spacing:1.5px; text-transform:uppercase;">NexaBank</p>
                  <p style="margin:3px 0 0; color:white; font-size:14px; font-weight:700;">{{ account.bankName }}</p>
                </div>
                <div style="text-align:right;">
                  <p style="margin:0; color:rgba(255,255,255,0.5); font-size:10px;">{{ card.currency }}</p>
                  <div v-if="card.type==='VISA'"
                       style="color:white; font-size:18px; font-weight:800; font-style:italic; margin-top:2px; letter-spacing:-1px;">
                    VISA
                  </div>
                  <div v-else style="display:flex; margin-top:4px;">
                    <div style="width:20px; height:20px; border-radius:50%; background:rgba(235,78,0,0.9);"></div>
                    <div style="width:20px; height:20px; border-radius:50%; background:rgba(255,179,0,0.85); margin-left:-8px;"></div>
                  </div>
                </div>
              </div>

              <!-- Chip -->
              <div>
                <div style="width:32px; height:24px; border-radius:5px; background:rgba(255,215,0,0.25);
                            border:1px solid rgba(255,215,0,0.2); margin-bottom:10px; display:flex;
                            align-items:center; justify-content:center;">
                  <div style="display:grid; grid-template-columns:1fr 1fr; gap:2px; width:18px;">
                    <div style="height:8px; background:rgba(255,215,0,0.4); border-radius:1px;"></div>
                    <div style="height:8px; background:rgba(255,215,0,0.4); border-radius:1px;"></div>
                    <div style="height:8px; background:rgba(255,215,0,0.4); border-radius:1px;"></div>
                    <div style="height:8px; background:rgba(255,215,0,0.4); border-radius:1px;"></div>
                  </div>
                </div>
                <p style="margin:0; color:rgba(255,255,255,0.85); font-family:monospace; font-size:14px; letter-spacing:2.5px; font-weight:500;">
                  {{ formatCardNumber(card.cardNumber) }}
                </p>
              </div>

              <!-- Bottom row -->
              <div style="display:flex; justify-content:space-between; align-items:flex-end;">
                <div>
                  <p style="margin:0; color:rgba(255,255,255,0.4); font-size:9px; text-transform:uppercase; letter-spacing:1px;">Muddati</p>
                  <p style="margin:3px 0 0; color:rgba(255,255,255,0.85); font-size:13px; font-weight:600;">{{ card.expirationDate }}</p>
                </div>
                <div style="text-align:right;">
                  <p style="margin:0; color:rgba(255,255,255,0.4); font-size:9px; text-transform:uppercase; letter-spacing:1px;">Balans</p>
                  <p style="margin:3px 0 0; color:white; font-size:16px; font-weight:800;">${{ Number(card.balance).toLocaleString() }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Card action rows -->
        <div style="border-radius:16px; overflow:hidden; border:1px solid rgba(255,255,255,0.06); background:#080d1e;">
          <div
            v-for="(card, i) in account.cards"
            :key="'act-'+card.id"
            style="display:flex; align-items:center; gap:12px; padding:14px 18px; transition:background 0.15s ease;"
            :style="{ borderBottom: i < account.cards.length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }"
            @mouseenter="e => e.currentTarget.style.background='rgba(255,255,255,0.02)'"
            @mouseleave="e => e.currentTarget.style.background='transparent'"
          >
            <div style="width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center;
                        font-size:14px; flex-shrink:0;"
                 :style="card.type==='VISA' ? { background:'rgba(59,130,246,0.12)' } : { background:'rgba(239,68,68,0.1)' }">
              💳
            </div>
            <div style="flex:1; min-width:0;">
              <p style="margin:0; color:#e2e8f0; font-size:13px; font-weight:600; font-family:monospace;">
                {{ formatCardNumber(card.cardNumber) }}
              </p>
              <p style="margin:2px 0 0; color:#334155; font-size:11px;">{{ card.type }} • Muddati: {{ card.expirationDate }}</p>
            </div>
            <p style="margin:0; color:#4ade80; font-size:14px; font-weight:700; flex-shrink:0;">${{ Number(card.balance).toLocaleString() }}</p>
            <div style="display:flex; gap:8px; flex-shrink:0;">
              <button
                v-if="!card.blocked"
                @click="toggleBlock(card, true)"
                :disabled="blockingCardId === card.id"
                style="padding:5px 12px; border-radius:8px; border:1px solid rgba(239,68,68,0.3);
                       background:rgba(239,68,68,0.08); color:#f87171; font-size:11px; font-weight:600;
                       cursor:pointer; transition:all 0.2s ease;"
                @mouseenter="e => e.currentTarget.style.background='rgba(239,68,68,0.18)'"
                @mouseleave="e => e.currentTarget.style.background='rgba(239,68,68,0.08)'"
              >Bloklash</button>
              <button
                v-else
                @click="toggleBlock(card, false)"
                :disabled="blockingCardId === card.id"
                style="padding:5px 12px; border-radius:8px; border:1px solid rgba(34,197,94,0.3);
                       background:rgba(34,197,94,0.08); color:#4ade80; font-size:11px; font-weight:600; cursor:pointer;"
              >Ochish</button>
              <button
                @click="goToTransfer(card.id)"
                style="padding:5px 14px; border-radius:8px; border:1px solid rgba(59,130,246,0.3);
                       background:rgba(59,130,246,0.08); color:#60a5fa; font-size:11px; font-weight:600;
                       cursor:pointer; transition:all 0.2s ease;"
                @mouseenter="e => e.currentTarget.style.background='rgba(59,130,246,0.18)'"
                @mouseleave="e => e.currentTarget.style.background='rgba(59,130,246,0.08)'"
              >💸 O'tkazish</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ Create Card Modal ═══ -->
    <a-modal v-model:open="createCardModalVisible" :footer="null" width="420px" style="top:80px;">
      <template #title>
        <div style="display:flex; align-items:center; gap:10px;">
          <div style="width:30px; height:30px; border-radius:8px; background:linear-gradient(135deg,#3b82f6,#6366f1);
                      display:flex; align-items:center; justify-content:center; font-size:14px;">💳</div>
          <span style="font-size:15px; font-weight:700; color:#e2e8f0;">Yangi Karta Ochish</span>
        </div>
      </template>

      <div style="padding:4px 0 8px;">
        <!-- Card type selection -->
        <p style="margin:0 0 12px; color:#94a3b8; font-size:13px; font-weight:500;">Karta turini tanlang</p>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px;">
          <div
            v-for="t in ['VISA','MASTERCARD']"
            :key="t"
            @click="cardForm.type = t"
            style="border-radius:16px; padding:20px; text-align:center; cursor:pointer; transition:all 0.2s ease;"
            :style="cardForm.type === t
              ? { border:'2px solid #3b82f6', background:'rgba(59,130,246,0.1)' }
              : { border:'2px solid rgba(255,255,255,0.07)', background:'rgba(255,255,255,0.02)' }"
          >
            <div v-if="t === 'VISA'"
                 style="font-size:22px; font-weight:800; font-style:italic; margin-bottom:6px;"
                 :style="{ color: cardForm.type === 'VISA' ? '#60a5fa' : '#334155' }">
              VISA
            </div>
            <div v-else style="display:flex; justify-content:center; margin-bottom:8px;">
              <div style="width:22px; height:22px; border-radius:50%;" :style="{ background: cardForm.type==='MASTERCARD' ? '#ef4444' : '#374151' }"></div>
              <div style="width:22px; height:22px; border-radius:50%; margin-left:-8px;" :style="{ background: cardForm.type==='MASTERCARD' ? '#f59e0b' : '#1f2937' }"></div>
            </div>
            <p style="margin:0; font-size:13px; font-weight:600;"
               :style="{ color: cardForm.type === t ? '#e2e8f0' : '#475569' }">{{ t }}</p>
          </div>
        </div>

        <p style="margin:0 0 8px; color:#94a3b8; font-size:13px; font-weight:500;">Valyuta</p>
        <div style="padding:12px 16px; border-radius:12px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08);
                    color:#e2e8f0; font-size:14px; margin-bottom:20px;">
          🇺🇸 USD — AQSh dollari
        </div>

        <div style="display:flex; justify-content:flex-end; gap:10px;">
          <button
            @click="createCardModalVisible = false"
            style="padding:9px 18px; border-radius:10px; border:1px solid rgba(255,255,255,0.1);
                   background:rgba(255,255,255,0.04); color:#94a3b8; font-size:13px; cursor:pointer;"
          >Bekor</button>
          <button
            @click="handleCreateCard"
            :disabled="creatingCard || !cardForm.type"
            style="padding:9px 20px; border-radius:10px; border:none;
                   background:linear-gradient(135deg,#3b82f6,#6366f1); color:white; font-size:13px;
                   font-weight:600; cursor:pointer; box-shadow:0 4px 12px rgba(99,102,241,0.3);
                   transition:all 0.2s ease;"
            :style="(!cardForm.type || creatingCard) ? { opacity:0.5, cursor:'not-allowed' } : {}"
          >
            {{ creatingCard ? '⏳ Ochilmoqda...' : 'Karta Ochish' }}
          </button>
        </div>
      </div>
    </a-modal>
  </AppLayout>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import AppLayout from '../components/AppLayout.vue'
import { accountApi, cardApi } from '../api/client'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const creatingCard = ref(false)
const blockingCardId = ref(null)
const createCardModalVisible = ref(false)
const account = ref(null)
const cardForm = reactive({ type: null, currency: 'USD' })

const totalBalance = computed(() =>
  (account.value?.cards || []).reduce((s, c) => s + Number(c.balance || 0), 0)
)

async function load() {
  loading.value = true
  try {
    const { data } = await accountApi.getAccount(route.params.id)
    account.value = data
  } catch {
    message.error('Hisob ma\'lumotlarini yuklashda xatolik')
  } finally {
    loading.value = false
  }
}

async function handleCreateCard() {
  if (!cardForm.type) { message.warning('Karta turini tanlang'); return }
  creatingCard.value = true
  try {
    const { data } = await cardApi.create({ accountId: route.params.id, ...cardForm })
    account.value.cards = [...(account.value.cards || []), data]
    createCardModalVisible.value = false
    cardForm.type = null
    message.success(`${data.type} karta muvaffaqiyatli ochildi!`)
  } catch (err) {
    message.error(err.response?.data?.message || 'Karta ochishda xatolik')
  } finally {
    creatingCard.value = false
  }
}

async function toggleBlock(card, block) {
  blockingCardId.value = card.id
  try {
    const { data } = block ? await cardApi.block(card.id) : await cardApi.unblock(card.id)
    const idx = account.value.cards.findIndex(c => c.id === card.id)
    if (idx !== -1) account.value.cards[idx] = data
    message.success(block ? 'Karta bloklandi' : 'Karta blokdan chiqarildi')
  } catch (err) {
    message.error(err.response?.data?.message || 'Xatolik')
  } finally {
    blockingCardId.value = null
  }
}

const goToTransfer = id => router.push(`/transfer?fromCard=${id}`)
const formatDate = d => d ? new Date(d).toLocaleDateString('uz-UZ', { year:'numeric', month:'long', day:'numeric' }) : '—'
const formatCardNumber = n => n ? n.replace(/(.{4})/g, '$1 ').trim() : '•••• •••• •••• ••••'
const accountTypeLabel = t => ({ CHECKING:'Joriy hisob', SAVINGS:"Jamg'arma", CREDIT:'Kredit' }[t] || t)

const bankColors = {
  'Kapitalbank':              '#1d4ed8,#3b82f6',
  "O'zbekiston Milliy Banki": '#065f46,#10b981',
  'Hamkorbank':               '#7c3aed,#a78bfa',
  'Ipoteka-bank':             '#b45309,#f59e0b',
  'TBC Bank':                 '#be185d,#ec4899',
  'Anorbank':                 '#dc2626,#f87171',
  'Asaka Bank':               '#0e7490,#22d3ee',
  'Aloqabank':                '#4338ca,#818cf8',
}
const bankGradient = n => `linear-gradient(135deg,${bankColors[n] || '#334155,#475569'})`
const bankBgSoft = n => {
  const c = bankColors[n]
  if (!c) return 'rgba(100,116,139,0.1)'
  const from = c.split(',')[0]
  const r = parseInt(from.slice(1,3),16), g = parseInt(from.slice(3,5),16), b = parseInt(from.slice(5,7),16)
  return `rgba(${r},${g},${b},0.15)`
}

onMounted(load)
</script>

<style scoped>
.card-visa {
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 40%, #1d4ed8 100%);
}
.card-mastercard {
  background: linear-gradient(135deg, #1c0a0a 0%, #7f1d1d 50%, #b91c1c 100%);
}
</style>
