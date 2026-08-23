# 饭香香

面向移动端的 H5 点餐应用，使用 React、TypeScript 与 Vite 构建。工程分层参考 `LingCore-Web`，并保留可组合的插件注册机制。

## 技术栈

- Tailwind CSS v4
- Shadcn UI
- Shadcn Radix UI + Rhea 组件配置
- Zustand
- Motion
- Iconify (`@iconify/json` + `@iconify/tailwind4`)
- React Router
- Axios

## 开发

```bash
pnpm install
pnpm dev
```

常用检查：

```bash
pnpm lint
pnpm build
```

## 目录

```text
src/
├── api/          # API 客户端与接口定义
├── components/   # 业务组件与 Shadcn UI 组件
├── constants/    # 应用常量
├── hooks/        # 通用 Hooks
├── layout/       # H5 页面布局
├── pages/        # 路由页面
├── plugin/       # Provider 与全局样式插件注册
├── providers/    # 全局 Provider
├── router/       # 路由配置
├── store/        # Zustand 状态
├── styles/       # Tailwind 与全局样式
├── types/        # 公共类型和类型增强
└── utils/        # 通用工具
```

环境变量分为 `.env`、`.env.development` 和 `.env.production`。本地 `/api` 请求默认代理到 `http://localhost:8080`，可按后端地址调整 `VITE_API_PROXY_TARGET`。
