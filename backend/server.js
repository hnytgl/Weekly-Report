
const express = require('express')
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose()
const path = require('path')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is required. Please configure it in backend/.env')
  process.exit(1)
}

// 中间件
app.use(cors())
app.use(express.json())

// 数据库连接
const db = new sqlite3.Database('teamplan.db')

// 创建表
db.serialize(() => {
  // 用户表
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`)

  // 年度计划表
  db.run(`CREATE TABLE IF NOT EXISTS annual_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    year INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    objectives TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`)

  // 月度计划表
  db.run(`CREATE TABLE IF NOT EXISTS monthly_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    objectives TEXT,
    tasks TEXT,  -- 存储任务列表的JSON字符串
    annual_plan_id INTEGER,  -- 关联的年度计划ID
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (annual_plan_id) REFERENCES annual_plans (id)
  )`)

  // 周计划表
  db.run(`CREATE TABLE IF NOT EXISTS weekly_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    week INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    objectives TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`)

  // 周报表
  db.run(`CREATE TABLE IF NOT EXISTS weekly_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    week INTEGER NOT NULL,
    achievements TEXT NOT NULL,
    challenges TEXT NOT NULL,
    next_week_plan TEXT NOT NULL,
    highlights TEXT,
    summary TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`)

  // 月报总结表
  db.run(`CREATE TABLE IF NOT EXISTS monthly_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    summary TEXT NOT NULL,
    highlights TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`)

  // 插入默认用户
  const bcrypt = require('bcryptjs')
  const saltRounds = 10
  
  const createDefaultUsers = async () => {
    try {
      const managerHash = await bcrypt.hash('manager123', saltRounds)
      const employeeHash = await bcrypt.hash('employee123', saltRounds)
      
      db.run(`INSERT OR IGNORE INTO users (username, password, role, department) 
              VALUES (?, ?, ?, ?)`, ['manager', managerHash, 'manager', '技术部'], function(err) {
        if (err) {
          console.error('创建经理账号失败:', err)
        } else if (this.changes > 0) {
          console.log('经理账号创建成功: manager / manager123')
        } else {
          console.log('经理账号已存在')
        }
      })

      db.run(`INSERT OR IGNORE INTO users (username, password, role, department) 
              VALUES (?, ?, ?, ?)`, ['employee', employeeHash, 'employee', '技术部'], function(err) {
        if (err) {
          console.error('创建员工账号失败:', err)
        } else if (this.changes > 0) {
          console.log('员工账号创建成功: employee / employee123')
        } else {
          console.log('员工账号已存在')
        }
      })
    } catch (error) {
      console.error('创建默认用户失败:', error)
    }
  }
  
  createDefaultUsers()
})

// 中间件：传递数据库连接
app.use((req, res, next) => {
  req.db = db
  next()
})

// 路由
app.use('/api/auth', require('./routes/auth'))
app.use('/api/plans', require('./routes/plans'))
app.use('/api/reports', require('./routes/reports'))
app.use('/api/users', require('./routes/users'))
app.use('/api/ai-suggestions', require('./routes/ai-suggestions'))

// 全局错误处理
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: '服务器内部错误' })
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`)
})

// 导出数据库连接供其他模块使用
module.exports = { db }
