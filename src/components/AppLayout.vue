<!-- eslint-disable vue/no-v-model-argument -->
<template>
  <div style="min-height:100vh; display:flex; background:#060b18;">

    <!-- ═══ SIDEBAR ═══ -->
    <aside
      :style="{
        width: collapsed ? '72px' : '260px',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #080d1e 0%, #0a1228 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 100,
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
      }"
    >
      <!-- Logo -->
      <div style="padding:20px 16px 20px; border-bottom:1px solid rgba(255,255,255,0.05); display:flex; align-items:center; gap:12px; min-height:72px;">
        <div style="width:40px; height:40px; border-radius:12px; flex-shrink:0; display:flex; align-items:center; justify-content:center;
                    background:linear-gradient(135deg,#3b82f6,#6366f1); box-shadow:0 8px 20px rgba(99,102,241,0.4);">
          <span style="color:white; font-weight:800; font-size:18px;">N</span>
        </div>
        <div v-show="!collapsed" style="overflow:hidden; white-space:nowrap;">
          <span style="font-size:20px; font-weight:800; background:linear-gradient(135deg,#60a5fa,#a78bfa);
                       -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;">
            NexaBank
          </span>
        </div>
      </div>

      <!-- Nav items -->
      <nav style="flex:1; padding:16px 10px; display:flex; flex-direction:column; gap:4px; overflow-y:auto;">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          style="text-decoration:none; display:flex; align-items:center; gap:12px; padding:11px 12px;
                 border-radius:12px; transition:all 0.2s ease; white-space:nowrap; overflow:hidden;"
          :style="[
            isActive(item.path)
              ? { background:'rgba(59,130,246,0.12)', borderLeft:'2px solid #3b82f6', paddingLeft:'10px' }
              : { borderLeft:'2px solid transparent' }
          ]"
          @mouseenter="e => { if(!isActive(item.path)) e.currentTarget.style.background='rgba(255,255,255,0.04)'; }"
          @mouseleave="e => { if(!isActive(item.path)) e.currentTarget.style.background='transparent'; }"
        >
          <span style="font-size:20px; flex-shrink:0; width:24px; text-align:center;">{{ item.icon }}</span>
          <span v-show="!collapsed" :style="{ color: isActive(item.path) ? '#60a5fa' : '#64748b', fontWeight: isActive(item.path) ? 600 : 400, fontSize:'14px' }">
            {{ item.label }}
          </span>
          <!-- Active dot -->
          <div v-if="isActive(item.path) && collapsed" style="position:absolute; right:8px; width:4px; height:4px; border-radius:50%; background:#3b82f6;"></div>
        </router-link>
      </nav>

      <!-- User info -->
      <div style="padding:12px 10px; border-top:1px solid rgba(255,255,255,0.05);">
        <div v-if="authStore.user && !collapsed"
             style="padding:10px 12px; border-radius:12px; background:rgba(255,255,255,0.03); margin-bottom:8px; display:flex; align-items:center; gap:10px;">
          <div style="width:32px; height:32px; border-radius:10px; flex-shrink:0; display:flex; align-items:center; justify-content:center;
                      font-size:12px; font-weight:700; color:white;
                      background:linear-gradient(135deg,#3b82f6,#8b5cf6);">
            {{ initials }}
          </div>
          <div style="overflow:hidden; flex:1;">
            <p style="margin:0; font-size:13px; font-weight:600; color:#e2e8f0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              {{ authStore.user.firstName }} {{ authStore.user.lastName }}
            </p>
            <p style="margin:0; font-size:11px; color:#475569; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              @{{ authStore.user.username }}
            </p>
          </div>
        </div>

        <button
          @click="handleLogout"
          style="width:100%; display:flex; align-items:center; gap:12px; padding:10px 12px; border-radius:12px;
                 background:transparent; border:none; cursor:pointer; transition:all 0.2s ease; color:#ef4444;"
          @mouseenter="e => e.currentTarget.style.background='rgba(239,68,68,0.1)'"
          @mouseleave="e => e.currentTarget.style.background='transparent'"
        >
          <span style="font-size:18px; flex-shrink:0; width:24px; text-align:center;">🚪</span>
          <span v-show="!collapsed" style="font-size:13px; font-weight:500; white-space:nowrap;">Chiqish</span>
        </button>
      </div>

      <!-- Collapse toggle -->
      <button
        @click="collapsed = !collapsed"
        style="position:absolute; top:22px; right:-12px; width:24px; height:24px; border-radius:50%;
               background:#0f172a; border:1px solid rgba(255,255,255,0.12); cursor:pointer;
               display:flex; align-items:center; justify-content:center; color:#64748b;
               font-size:12px; transition:all 0.2s ease; z-index:10;"
        @mouseenter="e => { e.currentTarget.style.borderColor='#3b82f6'; e.currentTarget.style.color='#60a5fa'; }"
        @mouseleave="e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.12)'; e.currentTarget.style.color='#64748b'; }"
      >
        {{ collapsed ? '›' : '‹' }}
      </button>
    </aside>

    <!-- ═══ MAIN CONTENT ═══ -->
    <main
      :style="{
        flex: 1,
        marginLeft: collapsed ? '72px' : '260px',
        transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }"
    >
      <!-- Top bar -->
      <header style="position:sticky; top:0; z-index:50; display:flex; align-items:center; justify-content:space-between;
                     padding:0 28px; height:68px;
                     background:rgba(6,11,24,0.8); backdrop-filter:blur(20px);
                     border-bottom:1px solid rgba(255,255,255,0.05);">
        <div>
          <h1 style="margin:0; font-size:18px; font-weight:700; color:#e2e8f0;">{{ pageTitle }}</h1>
          <p style="margin:0; font-size:12px; color:#334155; margin-top:1px;">{{ today }}</p>
        </div>

        <div style="display:flex; align-items:center; gap:12px;">
          <!-- Notification badge -->
          <div style="width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center;
                      background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07); cursor:pointer;
                      font-size:16px; position:relative;">
            🔔
            <div style="position:absolute; top:6px; right:6px; width:7px; height:7px; border-radius:50%; background:#3b82f6;
                        border:2px solid #060b18;"></div>
          </div>
          <!-- Avatar -->
          <div style="width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center;
                      font-size:13px; font-weight:700; color:white; cursor:pointer;
                      background:linear-gradient(135deg,#3b82f6,#8b5cf6);">
            {{ initials }}
          </div>
        </div>
      </header>

      <!-- Page content -->
      <div style="flex:1; padding:28px; overflow-y:auto;">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const collapsed = ref(false)

const navItems = [
  { path: '/profile',  icon: '👤', label: 'Profil'           },
  { path: '/accounts', icon: '🏦', label: 'Mening Banklarim' },
  { path: '/transfer', icon: '💸', label: "Pul O'tkazish"    }
]

const pageTitles = {
  '/profile':  'Profil',
  '/accounts': 'Mening Banklarim',
  '/transfer': "Pul O'tkazish"
}

const pageTitle = computed(() =>
  pageTitles[route.path] || (route.path.startsWith('/accounts/') ? 'Bank Tafsilotlari' : 'NexaBank')
)

const isActive = path =>
  path === '/accounts'
    ? route.path === '/accounts' || route.path.startsWith('/accounts/')
    : route.path === path

const initials = computed(() => {
  if (!authStore.user) return 'N'
  return (authStore.user.firstName?.[0] || '') + (authStore.user.lastName?.[0] || '')
})

const today = computed(() =>
  new Date().toLocaleDateString('uz-UZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
)

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>
