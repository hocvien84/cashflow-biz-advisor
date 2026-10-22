FROM node:24-alpine AS base

WORKDIR /app

# Cài đặt dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy toàn bộ source code và build bản Production
COPY . .
RUN npm run build

# Tạo thư mục lưu trữ SQLite bền vững (Persistent Volume)
RUN mkdir -p /app/data

ENV NODE_ENV=production
ENV PORT=3000
ENV SQLITE_DB_DIR=/app/data

EXPOSE 3000

CMD ["npm", "run", "start"]
