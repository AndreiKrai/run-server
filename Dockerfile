FROM node:18-alpine

WORKDIR /app

# Копіюємо файли залежностей
COPY package*.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо решту файлів проєкту
COPY . .

# Компілюємо TypeScript
RUN npm run build

# Відкриваємо порт
EXPOSE 3000

# Запускаємо додаток
CMD ["npm", "start"]