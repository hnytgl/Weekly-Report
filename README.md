# Weekly Report Master - 团队工作计划与报告系统

Weekly Report Master 是一个基于 AI 的团队工作管理应用，帮助团队成员制定计划、提交报告，并通过 DeepSeek AI 自动生成工作亮点和建议。

## 功能特性

### 员工功能
- **计划制定**: 创建年度、月度、周工作计划
- **进度跟踪**: 实时更新计划完成状态
- **周报提交**: 一键提交周报，AI 自动生成工作亮点
- **AI 建议**: 获取基于工作内容的智能建议

### 经理功能
- **团队概览**: 查看团队整体工作进度
- **员工管理**: 管理团队成员账号
- **进度监控**: 识别进度滞后的员工并发送提醒
- **年度总结**: 一键生成部门年度工作总结

## 技术栈

### 前端
- Vue 3.4 + Vite 6
- Element Plus 2.5 (UI 组件库)
- Pinia (状态管理)
- Vue Router 4.3
- Axios (HTTP 客户端)
- Day.js (日期处理)

### 后端
- Node.js + Express 4.19
- SQLite3 (数据库)
- JWT (身份验证)
- bcryptjs (密码加密)
- DeepSeek API (AI 功能)
- Multer (文件上传)

## 项目结构

```
weekly-report-master/
├── backend/                    # 后端 API 服务
│   ├── routes/                # API 路由
│   │   ├── auth.js           # 认证路由
│   │   ├── users.js          # 用户管理路由
│   │   ├── reports.js        # 报告管理路由
│   │   ├── plans.js          # 计划管理路由
│   │   └── ai-suggestions.js # AI 建议路由
│   ├── .env.example          # 环境变量示例
│   ├── package.json          # 后端依赖
│   └── server.js             # 服务器入口
├── frontend/                  # 前端 Vue 应用
│   ├── src/
│   │   ├── components/       # Vue 组件
│   │   │   ├── AISuggestions.vue      # AI 建议组件
│   │   │   ├── AnnualPlans.vue        # 年度计划组件
│   │   │   ├── AnnualSummary.vue      # 年度总结组件
│   │   │   ├── EmployeeManagement.vue # 员工管理组件
│   │   │   ├── MonthlyPlans.vue       # 月度计划组件
│   │   │   ├── ProgressMonitoring.vue # 进度监控组件
│   │   │   ├── TeamOverview.vue       # 团队概览组件
│   │   │   ├── WeeklyPlans.vue        # 周计划组件
│   │   │   └── WeeklyReports.vue      # 周报组件
│   │   ├── views/            # 页面视图
│   │   │   ├── Login.vue              # 登录页面
│   │   │   ├── EmployeeDashboard.vue  # 员工工作台
│   │   │   ├── ManagerDashboard.vue   # 经理工作台
│   │   │   ├── Employee.vue           # 员工页面
│   │   │   └── Manager.vue            # 经理页面
│   │   ├── stores/           # Pinia 状态管理
│   │   │   └── auth.js       # 认证状态
│   │   ├── router/           # 路由配置
│   │   │   └── index.js      # 路由定义
│   │   ├── main.js           # 应用入口
│   │   └── App.vue           # 根组件
│   ├── index.html            # HTML 模板
│   ├── package.json          # 前端依赖
│   └── vite.config.js        # Vite 配置
├── package.json              # 根目录配置
└── README.md                 # 项目说明
```

## 快速开始

### 1. 安装依赖

```bash
# 安装根目录依赖
npm install

# 安装后端依赖
cd backend && npm install

# 安装前端依赖
cd frontend && npm install
```

### 2. 配置环境变量

复制 `backend/.env.example` 为 `backend/.env`，并修改其中的密钥配置：

```env
JWT_SECRET=replace-with-a-long-random-secret
DEEPSEEK_API_KEY=your-deepseek-api-key
PORT=3000
```

### 3. 启动应用

```bash
# 同时启动前后端
npm run dev

# 或分别启动
npm run dev:backend  # 启动后端服务 (端口 3000)
npm run dev:frontend # 启动前端开发服务器 (端口 5173)
```

## 默认账号

系统初始化时自动创建以下演示账号：

- **部门经理**: 
  - 用户名: `manager`
  - 密码: `manager123`
  
- **普通员工**: 
  - 用户名: `employee`
  - 密码: `employee123`

## 使用指南

### 员工使用流程
1. 登录系统
2. 创建年度计划 → 月度计划 → 周计划
3. 每周提交工作周报
4. 查看 AI 生成的工作亮点
5. 获取 AI 提供的下一步工作建议

### 经理使用流程
1. 登录系统
2. 查看团队整体工作进度
3. 识别进度滞后的员工
4. 发送提醒通知
5. 一键生成部门年度总结

## API 接口

### 认证相关
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出

### 用户管理
- `GET /api/users` - 获取用户列表
- `POST /api/users` - 创建新用户
- `PUT /api/users/:id` - 更新用户信息
- `DELETE /api/users/:id` - 删除用户

### 计划管理
- `GET /api/plans` - 获取计划列表
- `POST /api/plans` - 创建计划
- `PUT /api/plans/:id` - 更新计划
- `DELETE /api/plans/:id` - 删除计划

### 报告管理
- `GET /api/reports` - 获取报告列表
- `POST /api/reports` - 提交报告
- `GET /api/reports/:id` - 获取报告详情

### AI 建议
- `POST /api/ai-suggestions` - 获取 AI 建议

## 注意事项

- 确保 DeepSeek API Key 有效以使用 AI 功能
- 首次运行会自动创建数据库和演示账号
- 生产环境请修改默认密码，并使用高强度随机 JWT Secret
- 注册员工账号需要使用经理账号登录后调用注册接口
- 后端服务默认运行在端口 3000
- 前端开发服务器默认运行在端口 5173

## 开发计划

- [ ] 添加数据可视化图表
- [ ] 支持文件附件上传
- [ ] 添加邮件通知功能
- [ ] 支持多部门管理
- [ ] 添加移动端适配
- [ ] 集成更多 AI 模型支持
- [ ] 添加数据导出功能
- [ ] 优化响应式设计

## 许可证

MIT License
