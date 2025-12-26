<template>
  <!-- 吐司弹窗 -->
  <div v-if="toast.show" class="toast-container">
    <div :class="['toast', `toast-${toast.type}`, { 'toast-leaving': toast.leaving }]">
      <div class="toast-icon">
        <i :class="getToastIcon(toast.type)"></i>
      </div>
      <div class="toast-content">
        <div class="toast-title">{{ toast.title }}</div>
        <div class="toast-message">{{ toast.message }}</div>
      </div>
      <div class="toast-close" @click="hideToast">
        <i class="fas fa-times"></i>
      </div>
    </div>
  </div>

  <!-- 模态框 -->
  <div v-if="modal.show" class="modal-overlay" @click.self="hideModal">
    <div :class="['modal', `modal-${modal.type}`, { 'modal-leaving': modal.leaving }]">
      <div class="modal-header">
        <div class="modal-icon">
          <i :class="getModalIcon(modal.type)"></i>
        </div>
        <div class="modal-title">{{ modal.title }}</div>
        <div class="modal-close" @click="hideModal">
          <i class="fas fa-times"></i>
        </div>
      </div>

      <div class="modal-body">
        <div class="modal-message">{{ modal.message }}</div>

        <!-- 确认框内容 -->
        <div v-if="modal.type === 'confirm'" class="modal-confirm">
          <div class="confirm-buttons">
            <div class="btn-cancel" @click="handleCancel">{{ modal.cancelText || t('modal.button.cancel') }}</div>
            <div class="btn-confirm" @click="handleConfirm">{{ modal.confirmText || t('modal.button.confirm')
            }}</div>
          </div>
        </div>

        <!-- 选择框内容 -->
        <div v-if="modal.type === 'select'" class="modal-select">
          <div class="select-options">
            <div v-for="(option, index) in modal.options" :key="index"
              :class="['select-option', { 'selected': modal.selected === option.value }]"
              @click="handleSelect(option.value)">
              <i v-if="option.icon" :class="option.icon"></i>
              <span>{{ option.label }}</span>
            </div>
          </div>
        </div>

        <!-- 输入框内容 -->
        <div v-if="modal.type === 'input'" class="modal-input">
          <input v-model="inputValue" :type="modal.inputType || 'text'" :placeholder="modal.placeholder"
            class="input-field" />
          <div class="input-buttons">
            <div class="btn-cancel" @click="handleCancel">{{ modal.cancelText || t('modal.button.cancel') }}</div>
            <div class="btn-confirm" @click="handleInputConfirm">{{ modal.confirmText || t('modal.button.confirm')
            }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 吐司弹窗状态 - 改回单个对象
const toast = reactive({
  show: false,
  type: 'info', // info, success, warning, error
  title: '',
  message: '',
  duration: 3000,
  leaving: false,
  timeoutId: null as number | null,
  pendingToast: null as any // 等待显示的toast
})

// 模态框状态 - 添加动画状态
const modal = reactive({
  show: false,
  type: 'info', // info, confirm, select, input
  title: '',
  message: '',
  options: [] as Array<{ label: string; value: any; icon?: string }>,
  selected: null as any,
  inputType: 'text',
  placeholder: '',
  cancelText: '',
  confirmText: '',
  onConfirm: null as Function | null,
  onCancel: null as Function | null,
  onSelect: null as Function | null,
  leaving: false
})

// 输入框值
const inputValue = ref('')

// 吐司弹窗图标
const getToastIcon = (type: string) => {
  const icons = {
    info: 'fas fa-info-circle',
    success: 'fas fa-check-circle',
    warning: 'fas fa-exclamation-triangle',
    error: 'fas fa-times-circle'
  }
  return icons[type as keyof typeof icons] || icons.info
}

// 模态框图标
const getModalIcon = (type: string) => {
  const icons = {
    info: 'fas fa-info-circle',
    confirm: 'fas fa-question-circle',
    select: 'fas fa-list',
    input: 'fas fa-edit'
  }
  return icons[type as keyof typeof icons] || icons.info
}

// 显示吐司弹窗 - 单个吐司显示
const showToast = (options: {
  type?: string
  title?: string
  message: string
  duration?: number
}) => {
  // 如果当前toast正在离开动画中，等待动画完成后再显示新toast
  if (toast.leaving) {
    toast.pendingToast = options
    return
  }

  // 清除之前的定时器
  if (toast.timeoutId) {
    clearTimeout(toast.timeoutId)
    toast.timeoutId = null
  }

  Object.assign(toast, {
    show: true,
    type: options.type || 'info',
    title: options.title || t("modal." + options.type),
    message: options.message,
    duration: options.duration || 3000,
    leaving: false,
    pendingToast: null
  })

  // 设置自动隐藏定时器
  if (toast.duration > 0) {
    toast.timeoutId = setTimeout(() => {
      hideToast()
    }, toast.duration) as unknown as number
  }
}

// 隐藏吐司弹窗 - 支持动画
const hideToast = () => {
  // 设置离开状态
  toast.leaving = true

  // 清除定时器
  if (toast.timeoutId) {
    clearTimeout(toast.timeoutId)
    toast.timeoutId = null
  }

  // 延迟隐藏以完成动画
  setTimeout(() => {
    toast.show = false
    toast.leaving = false

    // 如果有等待显示的toast，在动画完成后显示
    if (toast.pendingToast) {
      setTimeout(() => {
        showToast(toast.pendingToast)
      }, 50)
    }
  }, 300)
}

// 显示模态框
const showModal = (options: {
  type: string
  title: string
  message: string
  options?: Array<{ label: string; value: any; icon?: string }>
  inputType?: string
  placeholder?: string
  cancelText?: string
  confirmText?: string
  onConfirm?: Function
  onCancel?: Function
  onSelect?: Function
}) => {
  Object.assign(modal, {
    show: true,
    type: options.type,
    title: options.title,
    message: options.message,
    options: options.options || [],
    inputType: options.inputType || 'text',
    placeholder: options.placeholder || '',
    cancelText: options.cancelText,
    confirmText: options.confirmText,
    onConfirm: options.onConfirm,
    onCancel: options.onCancel,
    onSelect: options.onSelect,
    selected: null,
    leaving: false
  })
  inputValue.value = ''
}

// 隐藏模态框 - 支持动画
const hideModal = () => {
  modal.leaving = true

  // 延迟隐藏以完成动画
  setTimeout(() => {
    modal.show = false
    modal.leaving = false
    if (modal.onCancel) {
      modal.onCancel()
    }
  }, 300)
}

// 处理确认
const handleConfirm = () => {
  if (modal.onConfirm) {
    modal.onConfirm()
  }
  hideModal()
}

// 处理取消
const handleCancel = () => {
  hideModal()
}

// 处理选择
const handleSelect = (value: any) => {
  modal.selected = value
  if (modal.onSelect) {
    modal.onSelect(value)
  }
  hideModal()
}

// 处理输入确认
const handleInputConfirm = () => {
  if (modal.onConfirm) {
    modal.onConfirm(inputValue.value)
  }
  hideModal()
}

// 暴露方法给父组件
defineExpose({
  showToast,
  hideToast,
  showModal,
  hideModal
})
</script>

<style scoped>
* {
  --gradient-card: var(--main-bg);
  --border-light: 1px solid #e5e5e5;
  --shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 40px rgba(0, 0, 0, 0.2);
  --text-primary: #3b82f6;
  --text-secondary: #6b7280;
  --bg-tertiary: #f9fafb;
  font-family: "仓耳渔阳体";
}

/* 吐司弹窗样式 */
.toast-container {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 1000;
}

.toast {
  display: flex;
  align-items: center;
  background: var(--gradient-card);
  border: var(--border-light);
  border-radius: 2rem;
  padding: 1rem;
  margin-bottom: 0.5rem;
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(20px);
  min-width: 300px;
  animation: slideIn 0.3s ease;
  transition: all 0.3s ease;
}

.toast-leaving {
  animation: slideOut 0.3s ease forwards;
}

.toast-info {
  border-left: 4px solid #3b82f6;
}

.toast-success {
  border-left: 4px solid #10b981;
}

.toast-warning {
  border-left: 4px solid #f59e0b;
}

.toast-error {
  border-left: 4px solid #ef4444;
}

.toast-icon {
  margin-right: 0.75rem;
  font-size: 1.25rem;
}

.toast-info .toast-icon {
  color: #3b82f6;
}

.toast-success .toast-icon {
  color: #10b981;
}

.toast-warning .toast-icon {
  color: #f59e0b;
}

.toast-error .toast-icon {
  color: #ef4444;
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.toast-message {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.toast-close {
  background: none;
  border: none;
  color: var(--text-secondary);
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
}

.modal {
  background: var(--gradient-card);
  border: var(--border-light);
  border-radius: 2rem;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: var(--shadow-xl);
  animation: scaleIn 0.3s ease;
  transition: all 0.3s ease;
}

.modal-leaving {
  animation: scaleOut 0.3s ease forwards;
}

.modal-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-icon {
  margin-right: 0.75rem;
  font-size: 1.5rem;
}

.modal-info .modal-icon {
  color: #3b82f6;
}

.modal-confirm .modal-icon {
  color: #d3821e;
}

.modal-select .modal-icon {
  color: #8b5cf6;
}

.modal-input .modal-icon {
  color: #10b981;
}

.modal-title {
  flex: 1;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.modal-close {
  background: none;
  border: none;
  color: var(--text-secondary);
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.modal-message {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

/* 确认框样式 */
.confirm-buttons {
  text-align: center;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-cancel,
.btn-confirm {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-cancel {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.btn-confirm {
  background: var(--theme-color);
  color: white;
}

/* 选择框样式 */
.select-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.select-option {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.select-option.selected {
  background: rgba(59, 130, 246, 0.1);
  border-color: var(--theme-color);
}

.select-option i {
  margin-right: 0.5rem;
  color: var(--theme-color);
}

/* 输入框样式 */
.input-field {
  width: 100%;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background: var(--bg-tertiary);
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  transition: all 0.2s ease;
}

.input-field:focus {
  outline: none;
  border-color: var(--theme-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.input-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

/* 动画 */
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }

  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes scaleOut {
  from {
    transform: scale(1);
    opacity: 1;
  }

  to {
    transform: scale(0.8);
    opacity: 0;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .toast-container {
    top: 60px;
    /* 移动端也调整位置 */
    right: 10px;
    left: 10px;
  }

  .toast {
    min-width: auto;
    width: 100%;
  }

  .modal {
    margin: 1rem;
    padding: 1.5rem;
  }

  .confirm-buttons,
  .input-buttons {
    flex-direction: column;
  }
}
</style>
