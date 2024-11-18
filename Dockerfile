FROM node:18-alpine AS base

# 安装依赖
FROM base AS deps
WORKDIR /app

# 复制package文件
COPY package.json package-lock.json ./

# 安装依赖
RUN npm ci

# 构建应用
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 创建public目录（如果不存在）
RUN mkdir -p public

# 设置环境变量
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV=production
ENV SILICONFLOW_API_KEY=${SILICONFLOW_API_KEY}

# 构建应用
RUN npm run build

# 生产环境
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

# 创建非root用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 创建必要的目录
RUN mkdir -p public .next/static
RUN chown -R nextjs:nodejs public .next

# 复制必要文件
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"] 