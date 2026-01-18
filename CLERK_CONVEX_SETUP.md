# Clerk + Convex 集成配置指南

## 已完成的工作

1. ✅ 安装了必要的依赖包（Clerk Expo SDK, Convex SDK, expo-secure-store）
2. ✅ 配置了环境变量
3. ✅ 创建了 ClerkProvider 并配置了 token 缓存
4. ✅ 创建了登录/注册页面
5. ✅ 配置了 Convex 与 Clerk 的 JWT 集成
6. ✅ 添加了受保护的路由

## 还需要完成的配置步骤

### 1. 在 Clerk Dashboard 中创建 JWT 模板

1. 访问 [Clerk Dashboard](https://dashboard.clerk.com/)
2. 进入你的应用设置
3. 导航到 **JWT Templates** 页面
4. 点击 **New template**
5. 选择 **Convex** 模板
6. 配置模板：
   - Name: `convex`
   - Expires in: 根据需要设置（建议 1 小时）
   - Custom Claims（可选）：
     ```json
     {
       "name": "{{user.full_name}}",
       "email": "{{user.primary_email_address}}",
       "email_verified": "{{user.email_verified}}"
     }
     ```
7. 复制并保存 **Issuer URL**
8. 点击 **Save**

### 2. 在 Convex Dashboard 中配置 Clerk

1. 访问 [Convex Dashboard](https://dashboard.convex.dev/)
2. 进入你的项目设置
3. 导航到 **Settings** → **Authentication**
4. 配置 Clerk 认证：
   - Provider: **Custom JWT**
   - Issuer: 粘贴从 Clerk 复制的 Issuer URL
   - JWKS URL: `https://{{your-clerk-frontend-api-url}}/.well-known/jwks.json`
   - Algorithm: `RS256`

或者使用简化的方式（推荐用于 Expo）：

在 `.env.local` 文件中添加：
```
CLERK_FRONTEND_API_URL=https://your-clerk-app.clerk.accounts.dev
```

### 3. 运行应用

1. 启动 Convex 开发服务器：
   ```bash
   npx convex dev
   ```

2. 在另一个终端启动 Expo 应用：
   ```bash
   npx expo start
   ```

3. 按 `i` (iOS) 或 `a` (Android) 在模拟器中打开应用

### 4. 测试流程

1. 点击 **Sign In** 按钮
2. 使用以下任一方式登录：
   - 电子邮件 + 密码
   - Google OAuth
   - Apple OAuth（需要配置 Apple 开发者账号）
3. 成功登录后，你应该看到欢迎消息和你的用户名
4. 点击 **Sign Out** 按钮退出登录

## 代码结构说明

```
app/
├── _layout.tsx          # 根布局，配置 ClerkProvider 和 ConvexProvider
├── (tabs)/
│   └── index.tsx        # 主页，根据登录状态显示不同内容
├── login.tsx            # 登录/注册页面
lib/
└── token-cache.ts        # Clerk token 缓存配置
convex/
├── auth.ts             # Convex 认证配置
├── schema.ts           # 数据模型定义
└── users.ts            # 用户相关的查询和变更函数
```

## 关键功能

### Clerk 功能
- ✅ 电子邮件密码登录
- ✅ 邮箱验证码登录（Magic Link）
- ✅ Google OAuth
- ✅ Apple OAuth
- ✅ 安全的 token 存储（使用 expo-secure-store）

### Convex 功能
- ✅ 用户数据同步
- ✅ 受保护的查询和变更
- ✅ 基于 Clerk token 的身份验证

## 故障排除

### 问题：登录后看不到用户数据
**解决方案**：确保在 Clerk Dashboard 中创建了名为 "convex" 的 JWT 模板

### 问题：Convex 查询返回 401 未授权
**解决方案**：
1. 检查 Convex Dashboard 中的认证配置
2. 确保运行了 `npx convex dev`
3. 检查环境变量是否正确设置

### 问题：OAuth 登录失败
**解决方案**：
1. 确保 Clerk Dashboard 中启用了对应的 OAuth 提供商
2. 检查 OAuth 回调 URL 配置
3. 确保在 Clerk Dashboard 中启用了 Native API

## 下一步

1. 添加更多 Convex 函数来处理业务逻辑
2. 实现用户资料管理功能
3. 添加更多受保护的路由
4. 实现实时数据同步
5. 添加推送通知

## 参考文档

- [Clerk Expo SDK 文档](https://clerk.com/docs/references/expo/overview)
- [Convex 文档](https://docs.convex.dev)
- [Convex & Clerk 集成指南](https://clerk.com/docs/guides/development/integrations/databases/convex)
