<script setup>
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowDown, Bell, Check, Close, CollectionTag, DataAnalysis, Delete,
  Document, Expand, Fold, Goods, More, Plus, Promotion, Refresh, Search,
  Setting, Tickets, User, Wallet, Warning, Download, SwitchButton, UploadFilled
} from '@element-plus/icons-vue'
import { categories as categoryData, products as productData } from '../../data/products'
import { getCurrentUser, updateCurrentUser, logout as clearSession } from '../../utils/auth'

const route = useRoute()
const router = useRouter()
const collapsed = ref(false)
const keyword = ref('')
const statusFilter = ref('全部状态')
const dateRange = ref([])
const selectedRows = ref([])
const profileDialog = ref(false)
const profileForm = reactive({ name: '', email: '', bio: '', avatarColor: '#ee4d8b' })
const profileFormRef = ref()
const profileRules = {
  name: [{ required: true, whitespace: true, message: '请输入显示名称', trigger: 'blur' }],
  email: [{ type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }],
}
function openProfile() {
  Object.assign(profileForm, { name: '', email: '', bio: '', avatarColor: '#ee4d8b' }, currentUser)
  profileDialog.value = true
}
async function saveProfile() {
  if (!await profileFormRef.value.validate().catch(() => false)) return
  Object.assign(currentUser, updateCurrentUser(profileForm))
  profileDialog.value = false
  ElMessage.success('个人资料已保存')
}
const editingProduct = ref(null)
const productDialog = ref(false)
const activityDialog = ref(false)
const orderDrawer = ref(false)
const selectedOrder = ref(null)
const productForm = reactive({ title: '', category: '数码', price: 0, condition: '95新', seller: '', location: '', description: '', images: [] })
const currentUser = reactive(getCurrentUser())
const activityForm = reactive({ name: '', type: '满减活动', time: '', status: '未开始' })

const products = ref(productData.map((item, index) => ({ ...item, status: index % 4 === 0 ? '待审核' : '在售', views: 320 + index * 87, sold: index % 3 === 0 ? 1 : 0 })))
const orders = ref([
  { id: 'XO202611050018', product: '富士 X-T30 II 微单相机', buyer: '林小满', amount: 5299, status: '待发货', time: '2026-11-05 14:26', image: productData[0].images[0] },
  { id: 'XO202611050012', product: 'Marshall Acton III 蓝牙音箱', buyer: '周北北', amount: 1680, status: '已完成', time: '2026-11-05 12:08', image: productData[1].images[0] },
  { id: 'XO202611040091', product: '中古奶油色单人沙发', buyer: 'Mia', amount: 899, status: '配送中', time: '2026-11-04 18:42', image: productData[2].images[0] },
  { id: 'XO202611040076', product: 'Acne Studios 羊毛围巾', buyer: '顾言', amount: 760, status: '待付款', time: '2026-11-04 16:10', image: productData[4].images[0] },
])
const users = ref([
  { id: 'U10086', name: '阿梨的影像铺', role: '优质卖家', orders: 28, spend: 32600, status: '正常', joined: '2026-08-12' },
  { id: 'U10092', name: 'Blue Monday', role: '个人用户', orders: 16, spend: 10890, status: '正常', joined: '2026-08-18' },
  { id: 'U10108', name: '住在云边', role: '个人用户', orders: 9, spend: 6700, status: '已禁用', joined: '2026-09-01' },
  { id: 'U10126', name: 'Momo衣橱', role: '优质卖家', orders: 42, spend: 48120, status: '正常', joined: '2026-09-16' },
])
const reviews = ref(products.value.slice(0, 4).map((item, index) => ({ id: `RV${1000 + index}`, product: item, reason: index % 2 ? '图片与描述待确认' : '新商品发布审核', submitter: item.seller, time: '2026-11-05 10:2' + index })))
const activities = ref([
  { name: '双11闲置焕新季', type: '满减活动', time: '11月01日 - 11月11日', status: '进行中', count: 126, image: productData[0].images[0] },
  { name: '冬日穿搭专题', type: '专题运营', time: '11月08日 - 11月20日', status: '未开始', count: 0, image: productData[4].images[0] },
  { name: '新用户首单礼', type: '优惠券', time: '长期有效', status: '进行中', count: 87, image: productData[2].images[0] },
])
const messages = ref([
  { id: 1, title: '商品审核提醒', body: '有 4 件商品等待你的审核处理', type: '审核', time: '10分钟前', read: false },
  { id: 2, title: '交易异常预警', body: '订单 XO202611040076 长时间未付款', type: '交易', time: '42分钟前', read: false },
  { id: 3, title: '运营活动数据更新', body: '双11闲置焕新季今日新增参与商品 26 件', type: '运营', time: '2小时前', read: true },
])
const settings = reactive({ siteName: '心选集市', auditMode: true, autoMessage: true, notice: '欢迎来到心选集市管理后台' })

const navItems = [
  { path: '/admin/dashboard', label: '数据总览', icon: DataAnalysis },
  { path: '/admin/products', label: '商品管理', icon: Goods },
  { path: '/admin/orders', label: '订单管理', icon: Tickets },
  { path: '/admin/users', label: '用户管理', icon: User },
  { path: '/admin/categories', label: '分类管理', icon: CollectionTag },
  { path: '/admin/reviews', label: '审核中心', icon: Document },
  { path: '/admin/transactions', label: '交易记录', icon: Wallet },
  { path: '/admin/operations', label: '运营活动', icon: Promotion },
  { path: '/admin/messages', label: '消息中心', icon: Bell },
  { path: '/admin/settings', label: '系统设置', icon: Setting },
]
const isProductDetail = computed(() => route.name === 'admin-product-detail')
const detailProduct = computed(() => products.value.find(item => String(item.id) === route.params.id))
const activeNav = computed(() => isProductDetail.value ? '/admin/products' : route.path)
const pageTitle = computed(() => isProductDetail.value ? '商品详情' : navItems.find((item) => item.path === route.path)?.label || '数据总览')
const isDashboard = computed(() => route.path === '/admin/dashboard')
const filteredProducts = computed(() => products.value.filter((item) => {
  const matchKeyword = !keyword.value || `${item.title}${item.seller}${item.category}`.toLowerCase().includes(keyword.value.toLowerCase())
  const matchStatus = statusFilter.value === '全部状态' || item.status === statusFilter.value
  return matchKeyword && matchStatus
}))
const unreadCount = computed(() => messages.value.filter((item) => !item.read).length)
const pendingReviews = computed(() => reviews.value.length)
const chartBars = [46, 58, 42, 72, 64, 83, 92]

function go(path) { router.push(path) }
function resetFilters() { keyword.value = ''; statusFilter.value = '全部状态'; dateRange.value = [] }
function statusType(status) {
  return ({ 在售: 'success', 待审核: 'warning', 已下架: 'info', 待发货: 'warning', 已完成: 'success', 配送中: 'primary', 待付款: 'info', 正常: 'success', 已禁用: 'danger', 进行中: 'success', 未开始: 'warning' })[status] || 'info'
}
function openProduct(item) { router.push({ name: 'admin-product-detail', params: { id: item.id } }) }
function openProductForm(item) {
  editingProduct.value = item || null
  Object.assign(productForm, item ? { ...item, images: [...(item.images || [])] } : { title: '', category: '数码', price: 0, condition: '95新', seller: '', location: '', description: '', images: [] })
  productDialog.value = true
}
function handleProductUpload(file) {
  if (!file.raw?.type.startsWith('image/')) return ElMessage.warning('请选择图片文件')
  const reader = new FileReader()
  reader.onload = () => productForm.images.push(reader.result)
  reader.readAsDataURL(file.raw)
}
function removeProductImage(index) { productForm.images.splice(index, 1) }
function imageErrorSource() { return '/images/products/placeholder.jpg' }
async function logout() {
  try {
    await ElMessageBox.confirm('退出后需要重新登录才能进入管理后台。', '确认退出', { confirmButtonText: '退出登录', cancelButtonText: '取消', type: 'warning' })
    clearSession()
    router.replace('/login')
    ElMessage.success('已退出登录')
  } catch {
    // 用户取消退出时保持当前会话
  }
}
function saveProduct() {
  if (!productForm.title || !productForm.seller) return ElMessage.warning('请填写商品名称和卖家')
  if (!productForm.images.length) return ElMessage.warning('请至少添加一张商品图片')
  if (editingProduct.value) Object.assign(editingProduct.value, productForm)
  else products.value.unshift({ ...productForm, id: Date.now(), status: '待审核', views: 0, sold: 0 })
  productDialog.value = false
  ElMessage.success(editingProduct.value ? '商品信息已更新' : '商品已创建，等待审核')
}
async function removeSelected() {
  if (!selectedRows.value.length) return ElMessage.info('请先选择需要处理的商品')
  await ElMessageBox.confirm(`确定删除选中的 ${selectedRows.value.length} 件商品吗？`, '批量删除', { type: 'warning' })
  const ids = new Set(selectedRows.value.map((item) => item.id)); products.value = products.value.filter((item) => !ids.has(item.id)); selectedRows.value = []; ElMessage.success('已删除选中商品')
}
function approveReview(item, approved) { reviews.value = reviews.value.filter((review) => review.id !== item.id); const target = products.value.find((product) => product.id === item.product.id); if (target) target.status = approved ? '在售' : '已下架'; ElMessage.success(approved ? '审核通过，商品已上架' : '已驳回商品审核') }
function updateOrder(order) { const flow = { 待付款: '待发货', 待发货: '配送中', 配送中: '已完成' }; order.status = flow[order.status] || '已完成'; ElMessage.success(`订单状态已更新为${order.status}`) }
function toggleUser(user) { user.status = user.status === '正常' ? '已禁用' : '正常'; ElMessage.success(`用户已${user.status === '正常' ? '启用' : '禁用'}`) }
function markRead(message) { message.read = true; ElMessage.success('消息已标记为已读') }
function saveSettings() { ElMessage.success('系统设置已保存到本地') }
function createActivity() { if (!activityForm.name) return ElMessage.warning('请填写活动名称'); activities.value.unshift({ ...activityForm, count: 0, image: productData[0].images[0] }); activityDialog.value = false; activityForm.name = ''; ElMessage.success('活动已创建') }

const statCards = [
  { label: '今日成交额', value: '¥28,460', change: '+18.6%', icon: Wallet, tone: 'pink' },
  { label: '今日订单数', value: '126', change: '+12.4%', icon: Tickets, tone: 'blue' },
  { label: '在售商品', value: '2,486', change: '+86', icon: Goods, tone: 'orange' },
  { label: '活跃用户', value: '8,942', change: '+6.8%', icon: User, tone: 'green' },
]
</script>

<template>
  <div class="admin-app" :class="{ 'is-collapsed': collapsed }">
    <aside class="admin-sidebar">
      <div class="admin-brand"><span class="brand-mark">心</span><strong v-if="!collapsed">心选集市</strong></div>
      <div class="workspace-label" v-if="!collapsed">运营工作台</div>
      <el-menu class="admin-nav" :default-active="activeNav" :collapse="collapsed" router><el-menu-item v-for="item in navItems" :key="item.path" :index="item.path"><el-icon><component :is="item.icon" /></el-icon><template #title>{{ item.label }}</template><b v-if="item.path === '/admin/messages' && unreadCount">{{ unreadCount }}</b></el-menu-item></el-menu>
      <div class="sidebar-bottom"><el-button text class="sidebar-setting" title="退出系统" @click="logout"><el-icon><SwitchButton /></el-icon><span v-if="!collapsed">退出系统</span></el-button><div class="admin-profile"><span class="profile-avatar" :style="{ background: currentUser.avatarColor || '#ee4d8b' }">{{ currentUser.name.slice(0, 1) }}</span><span v-if="!collapsed"><strong>{{ currentUser.name }}</strong><small>{{ currentUser.role }}</small></span><el-dropdown v-if="!collapsed" trigger="click"><el-button text circle :icon="More" /><template #dropdown><el-dropdown-menu><el-dropdown-item :icon="User" @click="openProfile">个人资料</el-dropdown-item><el-dropdown-item divided :icon="SwitchButton" @click="logout">退出系统</el-dropdown-item></el-dropdown-menu></template></el-dropdown></div></div>
    </aside>
    <section class="admin-main">
      <header class="admin-topbar"><div class="topbar-left"><el-button text class="collapse-btn" :icon="collapsed ? Expand : Fold" @click="collapsed = !collapsed" /><el-breadcrumb separator="/"><el-breadcrumb-item>管理后台</el-breadcrumb-item><el-breadcrumb-item>{{ pageTitle }}</el-breadcrumb-item></el-breadcrumb></div><div class="topbar-actions"><el-input v-model="keyword" class="top-search" :prefix-icon="Search" placeholder="搜索商品、订单或用户" clearable /><el-button text :icon="Bell" class="notice-btn" @click="go('/admin/messages')"><el-badge v-if="unreadCount" :value="unreadCount" is-dot /></el-button><el-dropdown trigger="click"><button class="admin-menu"><span class="profile-avatar" :style="{ background: currentUser.avatarColor || '#ee4d8b' }">{{ currentUser.name.slice(0, 1) }}</span><span class="admin-menu-name">{{ currentUser.name }}</span><el-icon><ArrowDown /></el-icon></button><template #dropdown><el-dropdown-menu><el-dropdown-item :icon="User" @click="openProfile">个人资料</el-dropdown-item><el-dropdown-item :icon="Setting" @click="go('/admin/settings')">系统设置</el-dropdown-item><el-dropdown-item divided :icon="SwitchButton" @click="logout">退出系统</el-dropdown-item></el-dropdown-menu></template></el-dropdown></div></header>
      <main class="admin-content">
        <div class="page-heading"><div><h1>{{ pageTitle }}</h1><p>{{ isDashboard ? '实时掌握平台经营状态与关键业务指标' : '管理平台数据、状态与日常运营工作' }}</p></div><el-button v-if="route.path === '/admin/products'" type="primary" :icon="Plus" @click="openProductForm()">新增商品</el-button><el-button v-if="route.path === '/admin/operations'" type="primary" :icon="Plus" @click="activityDialog = true">新建活动</el-button></div>

        <template v-if="isProductDetail">
          <div class="detail-actions"><el-button @click="go('/admin/products')">返回商品列表</el-button><el-button v-if="detailProduct" type="primary" @click="openProductForm(detailProduct)">编辑商品</el-button></div>
          <div v-if="detailProduct" class="product-detail-layout">
            <section class="panel product-gallery"><el-image v-for="(image, index) in detailProduct.images" :key="`${image}-${index}`" :src="image" :alt="detailProduct.title" :preview-src-list="detailProduct.images" :initial-index="index" fit="contain" preview-teleported><template #error><div class="detail-image-error">商品图片暂不可用</div></template></el-image><p>点击图片查看大图 · 共 {{ detailProduct.images.length }} 张</p></section>
            <section class="panel product-summary"><div class="summary-topline"><span>商品编号 #{{ detailProduct.id }}</span><el-tag :type="statusType(detailProduct.status)">{{ detailProduct.status }}</el-tag></div><h2>{{ detailProduct.title }}</h2><div class="detail-price">¥{{ detailProduct.price.toLocaleString() }}<del v-if="detailProduct.originalPrice">¥{{ detailProduct.originalPrice.toLocaleString() }}</del></div>
              <el-descriptions :column="1" border><el-descriptions-item label="商品分类">{{ detailProduct.category }}</el-descriptions-item><el-descriptions-item label="商品成色">{{ detailProduct.condition }}</el-descriptions-item><el-descriptions-item label="卖家名称">{{ detailProduct.seller }}</el-descriptions-item><el-descriptions-item label="所在地">{{ detailProduct.location }}</el-descriptions-item><el-descriptions-item label="发布时间">{{ detailProduct.listedAt || '尚未发布' }}</el-descriptions-item><el-descriptions-item label="浏览次数">{{ detailProduct.views }}</el-descriptions-item></el-descriptions>
              <div class="product-description"><h3>商品描述</h3><p>{{ detailProduct.description || '卖家暂未填写描述' }}</p></div>
            </section>
          </div>
          <section v-else class="panel"><el-empty description="商品不存在或已被删除"><el-button type="primary" @click="go('/admin/products')">返回商品列表</el-button></el-empty></section>
        </template>
        <template v-else-if="isDashboard">
          <div class="stat-grid"><div v-for="card in statCards" :key="card.label" class="stat-card"><div class="stat-icon" :class="card.tone"><el-icon><component :is="card.icon" /></el-icon></div><div><span>{{ card.label }}</span><strong>{{ card.value }}</strong><small><i>↑</i> {{ card.change }} 较昨日</small></div></div></div>
          <div class="dashboard-grid"><section class="panel trend-panel"><div class="panel-title"><div><h2>交易趋势</h2><p>近 7 日成交额与订单变化</p></div><el-select model-value="近7天" size="small" style="width: 100px"><el-option label="近7天" value="近7天" /><el-option label="近30天" value="近30天" /></el-select></div><div class="chart"><div class="chart-y"><span>40k</span><span>30k</span><span>20k</span><span>10k</span><span>0</span></div><div class="chart-area"><div class="chart-grid"><i v-for="n in 5" :key="n"></i></div><div class="bars"><div v-for="(bar, index) in chartBars" :key="bar" class="bar-column"><div class="bar" :style="{ height: `${bar}%` }"><b>{{ [18, 24, 16, 31, 27, 35, 42][index] }}k</b></div><span>{{ ['周一', '周二', '周三', '周四', '周五', '周六', '今日'][index] }}</span></div></div></div></div></section><section class="panel task-panel"><div class="panel-title"><div><h2>待处理事项</h2><p>需要你及时关注的工作</p></div><el-icon><More /></el-icon></div><button class="task-row" @click="go('/admin/reviews')"><span class="task-dot warning"></span><span><strong>商品审核</strong><small>{{ pendingReviews }} 件商品等待审核</small></span><el-icon><ArrowDown /></el-icon></button><button class="task-row" @click="go('/admin/orders')"><span class="task-dot danger"></span><span><strong>订单发货</strong><small>12 笔订单等待卖家发货</small></span><el-icon><ArrowDown /></el-icon></button><button class="task-row" @click="go('/admin/messages')"><span class="task-dot info"></span><span><strong>用户反馈</strong><small>3 条新的用户反馈</small></span><el-icon><ArrowDown /></el-icon></button></section></div>
          <div class="dashboard-grid lower-grid"><section class="panel"><div class="panel-title"><div><h2>热销商品排行</h2><p>按近 30 日成交量排序</p></div><el-button text type="primary" @click="go('/admin/products')">查看全部</el-button></div><div class="ranking-list"><div v-for="(product, index) in products.slice(0, 5)" :key="product.id" class="ranking-row"><b class="rank" :class="{ top: index < 3 }">{{ index + 1 }}</b><img :src="product.images[0]" :alt="product.title" /><span><strong>{{ product.title }}</strong><small>{{ product.category }} · {{ product.location }}</small></span><em>¥{{ product.price.toLocaleString() }}</em></div></div></section><section class="panel"><div class="panel-title"><div><h2>运营提醒</h2><p>平台公告与活动动态</p></div><el-icon><Warning /></el-icon></div><div class="notice-list"><div><span class="notice-tag pink">活动</span><span>双11闲置焕新季正在进行中</span><small>2小时前</small></div><div><span class="notice-tag blue">系统</span><span>本周完成商品审核 486 件</span><small>昨天</small></div><div><span class="notice-tag orange">提醒</span><span>有 3 个分类需要补充运营内容</span><small>昨天</small></div></div></section></div>
          <section class="panel recent-panel"><div class="panel-title"><div><h2>最近订单</h2><p>实时更新的订单动态</p></div><el-button text type="primary" @click="go('/admin/orders')">订单管理</el-button></div><el-table :data="orders.slice(0, 3)" size="small"><el-table-column prop="id" label="订单号" width="170" /><el-table-column label="商品" min-width="250"><template #default="{ row }"><div class="product-cell"><img :src="row.image" :alt="row.product" /><span><strong>{{ row.product }}</strong></span></div></template></el-table-column><el-table-column prop="buyer" label="买家" width="100" /><el-table-column label="金额" width="110"><template #default="{ row }"><strong class="table-price">¥{{ row.amount.toLocaleString() }}</strong></template></el-table-column><el-table-column label="状态" width="100"><template #default="{ row }"><el-tag :type="statusType(row.status)" effect="light">{{ row.status }}</el-tag></template></el-table-column></el-table></section>
        </template>

        <template v-else-if="route.path === '/admin/products'"><section class="panel list-panel"><div class="filter-toolbar"><el-input v-model="keyword" :prefix-icon="Search" placeholder="搜索商品名称、卖家" clearable /><el-select v-model="statusFilter" placeholder="商品状态"><el-option v-for="s in ['全部状态', '在售', '待审核', '已下架']" :key="s" :label="s" :value="s" /></el-select><el-select placeholder="全部分类"><el-option label="全部分类" value="all" /><el-option v-for="item in categoryData" :key="item.name" :label="item.name" :value="item.name" /></el-select><el-button :icon="Refresh" @click="resetFilters">重置</el-button><el-button type="danger" plain :icon="Delete" @click="removeSelected">批量删除</el-button></div><el-table :data="filteredProducts" @selection-change="selectedRows = $event"><el-table-column type="selection" width="45" /><el-table-column label="商品信息" min-width="310"><template #default="{ row }"><div class="product-cell"><img :src="row.images[0]" :alt="row.title" /><span><strong>{{ row.title }}</strong><small>{{ row.seller }} · {{ row.location }}</small></span></div></template></el-table-column><el-table-column prop="category" label="分类" width="90" /><el-table-column label="价格" width="110"><template #default="{ row }"><strong class="table-price">¥{{ row.price.toLocaleString() }}</strong></template></el-table-column><el-table-column prop="views" label="浏览量" width="90" /><el-table-column label="状态" width="100"><template #default="{ row }"><el-tag :type="statusType(row.status)">{{ row.status }}</el-tag></template></el-table-column><el-table-column label="操作" fixed="right" width="150"><template #default="{ row }"><el-button link type="primary" @click="openProduct(row)">详情</el-button><el-button link @click="openProductForm(row)">编辑</el-button></template></el-table-column></el-table><div class="pagination-row"><span>共 {{ filteredProducts.length }} 条商品</span><el-pagination background layout="prev, pager, next" :total="filteredProducts.length" :page-size="10" /></div></section></template>

        <template v-else-if="route.path === '/admin/orders'"><section class="panel list-panel"><div class="filter-toolbar"><el-input v-model="keyword" :prefix-icon="Search" placeholder="搜索订单号、商品或买家" clearable /><el-select v-model="statusFilter"><el-option v-for="s in ['全部状态', '待付款', '待发货', '配送中', '已完成']" :key="s" :label="s" :value="s" /></el-select><el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" /><el-button :icon="Refresh" @click="resetFilters">重置</el-button></div><el-table :data="orders.filter(o => (!keyword || `${o.id}${o.product}${o.buyer}`.includes(keyword)) && (statusFilter === '全部状态' || o.status === statusFilter))"><el-table-column prop="id" label="订单号" width="180" /><el-table-column label="商品" min-width="300"><template #default="{ row }"><div class="product-cell"><img :src="row.image" :alt="row.product" /><span><strong>{{ row.product }}</strong><small>{{ row.time }}</small></span></div></template></el-table-column><el-table-column prop="buyer" label="买家" width="100" /><el-table-column label="实付金额" width="120"><template #default="{ row }"><strong class="table-price">¥{{ row.amount.toLocaleString() }}</strong></template></el-table-column><el-table-column label="状态" width="100"><template #default="{ row }"><el-tag :type="statusType(row.status)">{{ row.status }}</el-tag></template></el-table-column><el-table-column label="操作" width="150"><template #default="{ row }"><el-button link type="primary" @click="selectedOrder = row; orderDrawer = true">查看详情</el-button><el-button link v-if="row.status !== '已完成'" @click="updateOrder(row)">更新状态</el-button></template></el-table-column></el-table></section></template>

        <template v-else-if="route.path === '/admin/users'"><section class="panel list-panel"><div class="filter-toolbar"><el-input v-model="keyword" :prefix-icon="Search" placeholder="搜索用户名或用户 ID" clearable /><el-select v-model="statusFilter"><el-option v-for="s in ['全部状态', '正常', '已禁用']" :key="s" :label="s" :value="s" /></el-select><el-button :icon="Refresh" @click="resetFilters">重置</el-button></div><el-table :data="users.filter(u => (!keyword || `${u.id}${u.name}`.includes(keyword)) && (statusFilter === '全部状态' || u.status === statusFilter))"><el-table-column prop="id" label="用户 ID" width="120" /><el-table-column label="用户信息" min-width="240"><template #default="{ row }"><div class="user-cell"><span class="user-avatar">{{ row.name.slice(0, 1) }}</span><span><strong>{{ row.name }}</strong><small>{{ row.role }} · 注册于 {{ row.joined }}</small></span></div></template></el-table-column><el-table-column prop="orders" label="订单数" width="100" /><el-table-column label="累计消费" width="130"><template #default="{ row }"><strong class="table-price">¥{{ row.spend.toLocaleString() }}</strong></template></el-table-column><el-table-column label="状态" width="100"><template #default="{ row }"><el-tag :type="statusType(row.status)">{{ row.status }}</el-tag></template></el-table-column><el-table-column label="操作" width="120"><template #default="{ row }"><el-button link :type="row.status === '正常' ? 'danger' : 'primary'" @click="toggleUser(row)">{{ row.status === '正常' ? '禁用' : '启用' }}</el-button></template></el-table-column></el-table></section></template>

        <template v-else-if="route.path === '/admin/categories'"><section class="panel list-panel"><div class="filter-toolbar"><el-input v-model="keyword" :prefix-icon="Search" placeholder="搜索分类名称" clearable /><el-button type="primary" :icon="Plus" @click="ElMessage.success('分类创建表单已打开')">新增分类</el-button></div><el-table :data="categoryData.filter(c => !keyword || c.name.includes(keyword))"><el-table-column label="分类" min-width="260"><template #default="{ row }"><div class="category-cell"><span class="category-icon"><el-icon><CollectionTag /></el-icon></span><span><strong>{{ row.name }}</strong><small>{{ row.description }}</small></span></div></template></el-table-column><el-table-column label="商品数量" width="140"><template #default="{ row }">{{ products.filter(p => p.category === row.name).length + 120 }}</template></el-table-column><el-table-column prop="description" label="分类说明" /><el-table-column label="状态" width="100"><el-tag type="success">启用</el-tag></el-table-column><el-table-column label="操作" width="120"><el-button link type="primary" @click="ElMessage.success('分类编辑已保存')">编辑</el-button></el-table-column></el-table></section></template>

        <template v-else-if="route.path === '/admin/reviews'"><section class="panel list-panel"><div class="filter-toolbar"><el-select v-model="statusFilter"><el-option label="待审核" value="待审核" /><el-option label="已处理" value="已处理" /></el-select><el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="提交开始" end-placeholder="提交结束" /><span class="toolbar-note"><el-icon><Warning /></el-icon> 当前有 {{ reviews.length }} 件商品等待处理</span></div><el-table :data="reviews"><el-table-column label="商品" min-width="310"><template #default="{ row }"><div class="product-cell"><img :src="row.product.images[0]" :alt="row.product.title" /><span><strong>{{ row.product.title }}</strong><small>{{ row.submitter }} · {{ row.time }}</small></span></div></template></el-table-column><el-table-column prop="reason" label="审核原因" min-width="180" /><el-table-column label="商品状态" width="110"><el-tag type="warning">待审核</el-tag></el-table-column><el-table-column label="操作" width="180"><template #default="{ row }"><el-button type="primary" size="small" @click="approveReview(row, true)" :icon="Check">通过</el-button><el-button type="danger" plain size="small" @click="approveReview(row, false)" :icon="Close">驳回</el-button></template></el-table-column></el-table></section></template>

        <template v-else-if="route.path === '/admin/transactions'"><section class="panel list-panel"><div class="filter-toolbar"><el-input v-model="keyword" :prefix-icon="Search" placeholder="搜索交易单号或订单号" clearable /><el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" /><el-button :icon="Download" @click="ElMessage.success('交易记录已导出')">导出记录</el-button></div><el-table :data="orders"><el-table-column label="交易单号" width="180"><template #default="{ row }">TX{{ row.id.slice(2) }}</template></el-table-column><el-table-column prop="id" label="关联订单" width="180" /><el-table-column label="商品" min-width="250"><template #default="{ row }"><div class="product-cell"><img :src="row.image" :alt="row.product" /><span><strong>{{ row.product }}</strong></span></div></template></el-table-column><el-table-column prop="buyer" label="付款方" width="120" /><el-table-column label="交易金额" width="130"><template #default="{ row }"><strong class="table-price">¥{{ row.amount.toLocaleString() }}</strong></template></el-table-column><el-table-column label="支付方式" width="120">微信支付</el-table-column><el-table-column label="状态" width="100"><template #default="{ row }"><el-tag type="success">已结算</el-tag></template></el-table-column><el-table-column prop="time" label="交易时间" /></el-table></section></template>

        <template v-else-if="route.path === '/admin/operations'"><section class="panel list-panel"><el-table :data="activities"><el-table-column label="活动名称" min-width="320"><template #default="{ row }"><div class="product-cell activity-cell"><img :src="row.image" :alt="row.name" /><span><strong>{{ row.name }}</strong><small class="cell-subtitle">{{ row.type }}</small></span></div></template></el-table-column><el-table-column prop="time" label="活动时间" width="220" /><el-table-column label="参与商品" width="120"><template #default="{ row }">{{ row.count }} 件</template></el-table-column><el-table-column label="状态" width="110"><template #default="{ row }"><el-switch v-model="row.status" active-value="进行中" inactive-value="已结束" @change="ElMessage.success(`活动已${row.status === '进行中' ? '开启' : '关闭'}`)" /></template></el-table-column><el-table-column label="操作" width="120"><el-button link type="primary" @click="ElMessage.success('活动编辑已保存')">编辑</el-button></el-table-column></el-table></section></template>

        <template v-else-if="route.path === '/admin/messages'"><section class="panel message-panel"><div v-for="message in messages" :key="message.id" class="message-row" :class="{ unread: !message.read }"><span class="message-icon"><el-icon><Bell /></el-icon></span><div><strong>{{ message.title }} <el-tag size="small" effect="plain">{{ message.type }}</el-tag></strong><p>{{ message.body }}</p><small>{{ message.time }}</small></div><el-button v-if="!message.read" link type="primary" @click="markRead(message)">标记已读</el-button><span v-else class="read-label">已读</span></div></section></template>

        <template v-else-if="route.path === '/admin/settings'"><section class="panel settings-panel"><el-form label-position="top" class="settings-form"><el-form-item label="站点名称"><el-input v-model="settings.siteName" /></el-form-item><el-form-item label="后台公告"><el-input v-model="settings.notice" type="textarea" :rows="3" /></el-form-item><el-form-item label="新商品审核"><el-switch v-model="settings.auditMode" /><span class="form-help">开启后，新发布商品需审核通过才能展示</span></el-form-item><el-form-item label="自动通知"><el-switch v-model="settings.autoMessage" /><span class="form-help">订单状态变化时向用户发送站内消息</span></el-form-item><el-button type="primary" @click="saveSettings">保存设置</el-button></el-form></section></template>
      </main>
    </section>

    <el-dialog v-model="profileDialog" title="自定义个人资料" width="min(520px, 92vw)" destroy-on-close>
      <div class="profile-preview"><span class="profile-avatar large" :style="{ background: profileForm.avatarColor }">{{ profileForm.name.trim().slice(0, 1) || '我' }}</span><div><strong>{{ profileForm.name || '你的显示名称' }}</strong><p>{{ currentUser.role }}</p></div></div>
      <el-form ref="profileFormRef" :model="profileForm" :rules="profileRules" label-position="top">
        <el-form-item label="显示名称" prop="name"><el-input v-model="profileForm.name" maxlength="20" show-word-limit /></el-form-item>
        <el-form-item label="联系邮箱" prop="email"><el-input v-model="profileForm.email" placeholder="请输入联系邮箱（选填）" maxlength="100" /></el-form-item>
        <el-form-item label="个人简介"><el-input v-model="profileForm.bio" type="textarea" :rows="3" maxlength="120" show-word-limit /></el-form-item>
        <el-form-item label="头像配色"><div class="avatar-colors"><button v-for="color in ['#ee4d8b', '#b56487', '#8b78bc', '#568d88', '#ca945a']" :key="color" type="button" :aria-label="`选择头像颜色 ${color}`" :aria-pressed="profileForm.avatarColor === color" :style="{ background: color }" @click="profileForm.avatarColor = color"><el-icon v-if="profileForm.avatarColor === color"><Check /></el-icon></button></div></el-form-item>
      </el-form>
      <p class="form-help">资料保存在当前浏览器会话中，退出系统后清除。</p>
      <template #footer><el-button @click="profileDialog = false">取消</el-button><el-button type="primary" @click="saveProfile">保存资料</el-button></template>
    </el-dialog>
    <el-drawer v-model="orderDrawer" title="订单详情" size="420px"><template v-if="selectedOrder"><div class="order-detail-head"><img :src="selectedOrder.image" :alt="selectedOrder.product" /><div><h3>{{ selectedOrder.product }}</h3><el-tag :type="statusType(selectedOrder.status)">{{ selectedOrder.status }}</el-tag></div></div><div class="order-detail-list"><p><span>订单号</span>{{ selectedOrder.id }}</p><p><span>买家</span>{{ selectedOrder.buyer }}</p><p><span>实付金额</span><strong>¥{{ selectedOrder.amount.toLocaleString() }}</strong></p><p><span>下单时间</span>{{ selectedOrder.time }}</p></div><el-button v-if="selectedOrder.status !== '已完成'" type="primary" @click="updateOrder(selectedOrder)">更新为下一状态</el-button></template></el-drawer>
    <el-dialog v-model="productDialog" :title="editingProduct ? '编辑商品' : '新增商品'" width="560px"><el-form label-position="top"><el-form-item label="商品名称"><el-input v-model="productForm.title" placeholder="例如：富士 X-T30 II 微单相机" /></el-form-item><div class="form-grid"><el-form-item label="分类"><el-select v-model="productForm.category"><el-option v-for="item in categoryData" :key="item.name" :label="item.name" :value="item.name" /></el-select></el-form-item><el-form-item label="价格"><el-input-number v-model="productForm.price" :min="0" /></el-form-item></div><div class="form-grid"><el-form-item label="卖家"><el-input v-model="productForm.seller" /></el-form-item><el-form-item label="所在地"><el-input v-model="productForm.location" /></el-form-item></div><el-form-item label="商品描述"><el-input v-model="productForm.description" type="textarea" :rows="4" /></el-form-item><el-form-item label="商品图片"><div class="image-form-field"><div class="image-preview-grid"><div v-for="(image, index) in productForm.images" :key="`${image}-${index}`" class="image-preview"><img :src="image" alt="商品预览" @error="(event) => { event.target.src = imageErrorSource() }" /><el-button circle size="small" type="danger" :icon="Close" @click="removeProductImage(index)" /></div><div v-if="!productForm.images.length" class="image-empty">暂无图片</div></div><el-upload class="product-uploader" action="#" accept="image/*" :auto-upload="false" :show-file-list="false" :on-change="handleProductUpload"><el-button type="primary" plain :icon="UploadFilled">选择图片</el-button></el-upload><small class="form-help">支持本地图片预览，后续接入服务端上传接口。</small></div></el-form-item></el-form><template #footer><el-button @click="productDialog = false">取消</el-button><el-button type="primary" @click="saveProduct">保存商品</el-button></template></el-dialog>
    <el-dialog v-model="activityDialog" title="新建运营活动" width="480px"><el-form label-position="top"><el-form-item label="活动名称"><el-input v-model="activityForm.name" /></el-form-item><el-form-item label="活动类型"><el-select v-model="activityForm.type"><el-option label="满减活动" value="满减活动" /><el-option label="专题运营" value="专题运营" /><el-option label="优惠券" value="优惠券" /></el-select></el-form-item><el-form-item label="活动时间"><el-input v-model="activityForm.time" placeholder="例如：11月12日 - 11月20日" /></el-form-item></el-form><template #footer><el-button @click="activityDialog = false">取消</el-button><el-button type="primary" @click="createActivity">创建活动</el-button></template></el-dialog>
  </div>
</template>
