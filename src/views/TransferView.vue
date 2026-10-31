<!-- eslint-disable vue/no-v-model-argument -->
<template>
  <AppLayout>
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Header -->
      <div>
        <h2 class="text-xl font-bold text-slate-100">Pul O'tkazish</h2>
        <p class="text-slate-500 text-sm mt-0.5">Kartangizdan boshqa kartaga pul o'tkazing</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <!-- Transfer form -->
        <div class="lg:col-span-3">
          <div class="rounded-2xl p-6 border border-slate-700/50" style="background:#0f172a">
            <h3 class="font-semibold text-slate-200 mb-5">O'tkazma Ma'lumotlari</h3>

            <a-form :model="form" layout="vertical" @finish="handleTransfer" ref="formRef">
              <!-- From card -->
              <a-form-item label="Qaysi kartadan" name="fromCardId" :rules="[{required:true,message:'Kartani tanlang'}]">
                <a-select
                  v-model:value="form.fromCardId"
                  placeholder="O'z kartangizni tanlang"
                  size="large"
                  :loading="loadingCards"
                  @change="onFromCardChange"
                >
                  <a-select-option
                    v-for="card in myCards"
                    :key="card.id"
                    :value="card.id"
                    :disabled="card.blocked"
                  >
                    <div class="flex items-center justify-between gap-3 py-1">
                      <div class="flex items-center gap-2">
                        <span class="text-sm">💳</span>
                        <div>
                          <span class="font-mono text-xs">{{ formatCardShort(card.cardNumber) }}</span>
                          <span class="text-slate-400 text-xs ml-2">{{ card.type }}</span>
                          <a-tag v-if="card.blocked" color="error" class="text-xs ml-1">Bloklangan</a-tag>
                        </div>
                      </div>
                      <span class="text-green-400 text-xs font-semibold">${{ Number(card.balance).toLocaleString() }}</span>
                    </div>
                  </a-select-option>
                </a-select>
              </a-form-item>

              <!-- Selected card preview -->
              <div v-if="selectedCard" class="mb-5 rounded-xl p-3 border border-slate-700/30"
                   style="background:rgba(59,130,246,0.05)">
                <div class="flex items-center justify-between">
                  <span class="text-slate-400 text-xs">Mavjud balans</span>
                  <span class="text-green-400 font-bold">${{ Number(selectedCard.balance).toLocaleString() }}</span>
                </div>
              </div>

              <!-- To card -->
              <a-form-item
                label="Qaysi kartaga (Card ID)"
                name="toCardId"
                :rules="[{required:true,message:'Karta ID kiriting'},{validator:validateUUID}]"
              >
                <a-input
                  v-model:value="form.toCardId"
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  size="large"
                />
                <template #help>
                  <span class="text-slate-600 text-xs">Qabul qiluvchining karta UUID raqami</span>
                </template>
              </a-form-item>

              <!-- Amount -->
              <a-form-item
                label="Miqdor (USD)"
                name="amount"
                :rules="[{required:true,message:'Miqdor kiriting'},{validator:validateAmount}]"
              >
                <a-input-number
                  v-model:value="form.amount"
                  :min="0.01"
                  :precision="2"
                  placeholder="0.00"
                  size="large"
                  style="width:100%"
                  :formatter="v => `$ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="v => v.replace(/\$\s?|(,*)/g, '')"
                />
              </a-form-item>

              <!-- Description -->
              <a-form-item label="Izoh (ixtiyoriy)" name="description">
                <a-textarea
                  v-model:value="form.description"
                  placeholder="O'tkazma maqsadini kiriting..."
                  :rows="3"
                  :maxlength="200"
                  show-count
                />
              </a-form-item>

              <!-- Error -->
              <a-alert v-if="errorMsg" :message="errorMsg" type="error" show-icon class="mb-4"
                       closable @close="errorMsg = ''" />

              <a-button
                type="primary"
                html-type="submit"
                size="large"
                block
                :loading="sending"
                :disabled="!form.fromCardId || !form.toCardId || !form.amount"
                style="height:48px; font-weight:600; background:linear-gradient(135deg,#7c3aed,#8b5cf6); border:none"
              >
                💸 Pul O'tkazish
              </a-button>
            </a-form>
          </div>
        </div>

        <!-- History + quick deposit -->
        <div class="lg:col-span-2 space-y-4">
          <!-- Quick deposit -->
          <div class="rounded-2xl p-5 border border-slate-700/50" style="background:#0f172a">
            <h3 class="font-semibold text-slate-200 mb-4">Hisob To'ldirish</h3>
            <a-form :model="depositForm" layout="vertical" @finish="handleDeposit">
              <a-form-item label="Karta" name="cardId" :rules="[{required:true}]">
                <a-select v-model:value="depositForm.cardId" placeholder="Kartani tanlang" :loading="loadingCards">
                  <a-select-option v-for="card in myCards" :key="card.id" :value="card.id" :disabled="card.blocked">
                    {{ formatCardShort(card.cardNumber) }} — ${{ Number(card.balance).toLocaleString() }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="Miqdor" name="amount" :rules="[{required:true}]">
                <a-input-number
                  v-model:value="depositForm.amount"
                  :min="1"
                  style="width:100%"
                  :formatter="v => `$ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="v => v.replace(/\$\s?|(,*)/g, '')"
                />
              </a-form-item>
              <a-button type="default" html-type="submit" block :loading="depositing"
                        style="border-color:#22c55e; color:#22c55e">
                ⬇️ To'ldirish
              </a-button>
            </a-form>
          </div>

          <!-- Transaction count badge -->
          <div class="rounded-2xl p-4 border border-slate-700/50" style="background:#0f172a">
            <p class="text-slate-500 text-xs">Jami tranzaksiyalar</p>
            <p class="text-3xl font-bold text-blue-400 mt-1">{{ transactions.length }}</p>
          </div>
        </div>
      </div>

      <!-- Transaction history -->
      <div class="rounded-2xl border border-slate-700/50 overflow-hidden" style="background:#0f172a">
        <div class="px-6 py-4 border-b border-slate-800">
          <h3 class="font-semibold text-slate-200">Tranzaksiyalar Tarixi</h3>
        </div>

        <div v-if="loadingTx" class="flex justify-center py-10">
          <a-spin />
        </div>
        <div v-else-if="transactions.length === 0" class="text-center py-12">
          <p class="text-3xl mb-3">📭</p>
          <p class="text-slate-500">Tranzaksiyalar yo'q</p>
        </div>
        <div v-else>
          <div
            v-for="tx in transactions"
            :key="tx.id"
            class="flex items-center gap-4 px-6 py-4 border-b border-slate-800/50 last:border-0 hover:bg-slate-800/20 transition-colors"
          >
            <!-- Icon -->
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                 :style="txBg(tx)">
              {{ txIcon(tx) }}
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <p class="text-slate-200 text-sm font-medium">{{ txLabel(tx) }}</p>
              <p class="text-slate-500 text-xs mt-0.5 truncate">{{ tx.description || '—' }}</p>
              <p class="text-slate-600 text-xs">{{ formatDateTime(tx.createdDate) }}</p>
            </div>

            <!-- Amount + status -->
            <div class="text-right flex-shrink-0">
              <p class="font-bold" :class="tx.type === 'DEPOSIT' ? 'text-green-400' : 'text-orange-400'">
                {{ tx.type === 'DEPOSIT' ? '+' : '-' }}${{ Number(tx.amount).toLocaleString() }}
              </p>
              <a-tag :color="statusColor(tx.status)" class="text-xs mt-1">{{ statusLabel(tx.status) }}</a-tag>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success modal -->
    <a-modal
      v-model:open="successModalVisible"
      :footer="null"
      :closable="false"
      centered
      width="380px"
    >
      <div class="text-center py-4">
        <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl"
             style="background:rgba(34,197,94,0.15)">✅</div>
        <h3 class="text-xl font-bold text-slate-100 mb-2">O'tkazma Muvaffaqiyatli!</h3>
        <p class="text-slate-400 text-sm mb-1">
          <span class="text-white font-semibold">${{ lastAmount }}</span> muvaffaqiyatli o'tkazildi
        </p>
        <p class="text-slate-500 text-xs mb-6">{{ formatDateTime(new Date().toISOString()) }}</p>
        <a-button type="primary" block @click="successModalVisible = false">Yopish</a-button>
      </div>
    </a-modal>
  </AppLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import AppLayout from '../components/AppLayout.vue'
import { cardApi, transactionApi } from '../api/client'

const route = useRoute()

const loadingCards = ref(true)
const loadingTx = ref(true)
const sending = ref(false)
const depositing = ref(false)
const successModalVisible = ref(false)
const errorMsg = ref('')
const lastAmount = ref(0)

const myCards = ref([])
const transactions = ref([])

const form = reactive({ fromCardId: null, toCardId: '', amount: null, description: '' })
const depositForm = reactive({ cardId: null, amount: null })

const selectedCard = computed(() => myCards.value.find(c => c.id === form.fromCardId))

const onFromCardChange = () => {}

// UUID validation
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const validateUUID = (_, val) =>
  !val || uuidRegex.test(val)
    ? Promise.resolve()
    : Promise.reject('To\'g\'ri UUID formatini kiriting')

const validateAmount = (_, val) => {
  if (!val || val <= 0) return Promise.reject('0 dan katta miqdor kiriting')
  if (selectedCard.value && val > Number(selectedCard.value.balance))
    return Promise.reject('Kartada yetarli mablag\' yo\'q')
  return Promise.resolve()
}

async function loadCards() {
  loadingCards.value = true
  try {
    const { data } = await cardApi.getMyCards()
    myCards.value = data
    // Pre-select card from query param
    if (route.query.fromCard) {
      form.fromCardId = route.query.fromCard
    }
  } catch {
    message.error('Kartalarni yuklashda xatolik')
  } finally {
    loadingCards.value = false
  }
}

async function loadTransactions() {
  loadingTx.value = true
  try {
    const { data } = await transactionApi.getHistory()
    transactions.value = data || []
  } catch {
    message.error('Tranzaksiyalarni yuklashda xatolik')
  } finally {
    loadingTx.value = false
  }
}

async function handleTransfer() {
  sending.value = true
  errorMsg.value = ''
  try {
    await transactionApi.transfer({
      fromCardId: form.fromCardId,
      toCardId: form.toCardId,
      amount: form.amount,
      description: form.description || null
    })
    lastAmount.value = form.amount
    successModalVisible.value = true
    // Reset form
    form.toCardId = ''
    form.amount = null
    form.description = ''
    // Refresh cards & transactions
    await Promise.all([loadCards(), loadTransactions()])
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'O\'tkazmada xatolik yuz berdi'
  } finally {
    sending.value = false
  }
}

async function handleDeposit() {
  depositing.value = true
  try {
    await transactionApi.deposit({ cardId: depositForm.cardId, amount: depositForm.amount })
    message.success(`$${depositForm.amount} muvaffaqiyatli qo'shildi!`)
    depositForm.amount = null
    await Promise.all([loadCards(), loadTransactions()])
  } catch (err) {
    message.error(err.response?.data?.message || 'To\'ldirishda xatolik')
  } finally {
    depositing.value = false
  }
}

const formatCardShort = n => n ? `**** ${n.slice(-4)}` : '****'
const formatDateTime = d => d ? new Date(d).toLocaleString('uz-UZ') : '—'
const txIcon = tx => ({ DEPOSIT: '⬇️', TRANSFER: '↔️', WITHDRAWAL: '⬆️' }[tx.type] || '💰')
const txBg = tx => ({
  background: tx.type === 'DEPOSIT' ? 'rgba(34,197,94,0.12)' :
              tx.type === 'TRANSFER' ? 'rgba(59,130,246,0.12)' : 'rgba(239,68,68,0.12)'
})
const txLabel = tx => ({
  DEPOSIT: 'Hisob to\'ldirish',
  TRANSFER: 'Pul o\'tkazma',
  WITHDRAWAL: 'Yechib olish'
}[tx.type] || tx.type)
const statusColor = s => ({ SUCCESS: 'success', FAILED: 'error', PENDING: 'processing', CANCELLED: 'default' }[s])
const statusLabel = s => ({ SUCCESS: 'Bajarildi', FAILED: 'Xato', PENDING: 'Kutilmoqda', CANCELLED: 'Bekor' }[s] || s)

onMounted(() => {
  loadCards()
  loadTransactions()
})
</script>
