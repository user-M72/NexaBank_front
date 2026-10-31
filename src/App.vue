<template>
  <a-config-provider
    :theme="{
      algorithm: darkAlgorithm,
      token: {
        colorPrimary: '#3b82f6',
        colorBgContainer: '#0f172a',
        colorBgElevated: '#1e293b',
        colorBgLayout: '#0a0f1e',
        colorBorder: '#334155',
        colorBorderSecondary: '#1e293b',
        borderRadius: 10,
        colorText: '#e2e8f0',
        colorTextSecondary: '#94a3b8',
        colorTextTertiary: '#64748b',
        fontFamily: 'Inter, system-ui, sans-serif',
      }
    }"
  >
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </a-config-provider>
</template>

<script setup>
import { theme } from 'ant-design-vue'
const { darkAlgorithm } = theme
</script>
