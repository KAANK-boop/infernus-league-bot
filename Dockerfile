FROM node:20-slim

RUN apt-get update && apt-get install -y ffmpeg python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY config/ ./config/
COPY utils/ ./utils/
COPY commands/ ./commands/
COPY database/ ./database/
COPY engine/ ./engine/
COPY panel/ ./panel/
COPY dashboard/ ./dashboard/
COPY scripts/ ./scripts/
COPY website/ ./website/
COPY index.js config.json server.js squads.js start.js vision.js ./

RUN ls -la /app/config/

EXPOSE 3000

CMD ["node", "index.js"]
