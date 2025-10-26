# 📦 Next.js 静态部署指南

## 一、部署前准备

### 1. 配置已完成 ✅
- ✅ `next.config.mjs` 已修改为静态导出模式
- ✅ `nginx.conf.static` 已创建（新的 Nginx 配置）

### 2. 需要手动执行的操作

---

## 二、部署步骤

### 第 1 步：构建静态文件

在项目目录执行以下命令：

```bash
cd /www/frontend/zhulong_newset

# 安装依赖（如果还没安装）
npm install

# 构建生产环境静态文件
npm run build
```

**说明：**
- 构建完成后会生成 `out` 目录，里面包含所有静态文件
- 构建时间大约 1-3 分钟（取决于项目大小）
- 构建完成后可以看到类似输出：`Export successful. Files written to /www/frontend/zhulong_newset/out`

### 第 2 步：验证构建结果

检查 `out` 目录是否生成成功：

```bash
ls -la /www/frontend/zhulong_newset/out
```

应该能看到：
- `index.html` - 首页
- `_next/` - Next.js 静态资源目录
- 其他 HTML 文件和资源

### 第 3 步：停止 Node.js 进程（重要！）

**在宝塔面板操作：**

1. 进入 **网站** → 找到 `dragonai.tech` 项目
2. 点击 **设置** → **Node项目** 标签
3. **停止** Node.js 项目（因为不再需要 8081 端口的服务）
4. 或者直接删除 Node 项目配置（静态部署不需要）

**或命令行操作：**
```bash
# 查找占用 8081 端口的进程
lsof -i:8081

# 如果有进程，停止它
# kill -9 <进程PID>
```

### 第 4 步：修改 Nginx 配置

**在宝塔面板操作：**

1. 进入 **网站** → 找到 `dragonai.tech` 项目
2. 点击 **设置** → **配置文件** 标签
3. **完整替换** 配置文件内容为 `nginx.conf.static` 的内容
   - 复制 `/www/frontend/zhulong_newset/nginx.conf.static` 文件的所有内容
   - 粘贴到宝塔配置文件编辑器
   - 点击 **保存**

**关键改动说明：**
- ✅ `root` 指向 `/www/frontend/zhulong_newset/out`（静态文件目录）
- ✅ 删除了反向代理配置（不再代理到 8081）
- ✅ 添加了 `try_files` 支持客户端路由
- ✅ 添加了静态资源缓存配置

### 第 5 步：重载 Nginx

**在宝塔面板操作：**
1. 左侧菜单 → **软件商店** → **Nginx**
2. 点击 **设置** → **服务** 标签
3. 点击 **重载配置**（不是重启！reload 即可）

**或命令行操作：**
```bash
# 先测试配置是否正确
nginx -t

# 如果显示 syntax is ok，则重载
nginx -s reload
```

### 第 6 步：测试访问

打开浏览器访问：
- https://dragonai.tech

应该能看到网站正常显示，且响应速度非常快！

---

## 三、后续更新部署流程

以后每次更新代码后，只需要执行：

```bash
cd /www/frontend/zhulong_newset

# 拉取最新代码（如果用 Git）
git pull

# 重新构建
npm run build

# 不需要重启 Nginx，刷新浏览器即可看到更新
```

**注意：** HTML 文件已配置为不缓存，静态资源（JS/CSS）有缓存。如果看不到更新，按 `Ctrl+F5` 强制刷新。

---

## 四、性能优势对比

### 之前（开发模式）
- ❌ `npm run dev` 运行在 8081 端口
- ❌ 每次请求都需要编译
- ❌ 响应速度慢（500ms - 2s）
- ❌ 占用内存大（~200MB）
- ❌ CPU 占用高

### 现在（静态部署）
- ✅ 纯静态文件，Nginx 直接服务
- ✅ 响应速度极快（<10ms）
- ✅ 不占用额外内存
- ✅ CPU 占用几乎为 0
- ✅ 支持浏览器缓存，加载更快

---

## 五、故障排查

### 问题 1：访问提示 404
**解决：**
- 检查 `out` 目录是否存在
- 检查 Nginx 配置中的 `root` 路径是否正确
- 查看错误日志：`tail -f /www/wwwlogs/zhulong_newset.error.log`

### 问题 2：页面空白
**解决：**
- 按 F12 打开浏览器控制台，查看错误信息
- 检查是否有 JS 文件加载失败
- 清除浏览器缓存后重试

### 问题 3：路由跳转 404
**解决：**
- 检查 Nginx 配置中的 `try_files` 是否正确
- 确保配置了 `try_files $uri $uri.html $uri/ /index.html;`

### 问题 4：构建失败
**解决：**
- 查看构建错误信息
- 检查 `next.config.mjs` 配置是否正确
- 尝试删除 `.next` 目录后重新构建：
  ```bash
  rm -rf .next
  npm run build
  ```

---

## 六、回滚方案

如果静态部署有问题，想回到之前的方式：

1. 恢复原来的 Nginx 配置（反向代理到 8081）
2. 启动 Node.js 项目：`npm run dev` 或 `npm start`
3. 重载 Nginx

---

## 七、监控和维护

### 查看访问日志
```bash
tail -f /www/wwwlogs/zhulong_newset.log
```

### 查看错误日志
```bash
tail -f /www/wwwlogs/zhulong_newset.error.log
```

### 查看磁盘空间
```bash
du -sh /www/frontend/zhulong_newset/out
```

---

## 八、备注

- ✅ 证书配置已保留（SSL/QUIC/HTTP2）
- ✅ 静态资源缓存已优化（1年缓存）
- ✅ Gzip 压缩已启用
- ✅ 支持 Next.js 客户端路由
- ✅ 禁止访问敏感文件配置已保留

有问题随时联系！🚀

