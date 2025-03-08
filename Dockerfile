# base stage to have pnpm installed
# FROM node:20.11.1-alpine AS base
FROM node:20.11.1-buster-slim AS base
RUN npm install -g npm@10.5.2

# development stage
FROM base AS development 
ARG APP 
ARG NODE_ENV=development 
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app 
COPY package.json package-lock.json ./ 
RUN npm ci
COPY . . 
RUN npm run build ${APP} 

# production stage
FROM base AS production 
ARG APP 
ARG NODE_ENV=production 
ENV NODE_ENV=${NODE_ENV} 
WORKDIR /usr/src/app 
COPY package.json package-lock.json ./ 
RUN npm ci --prod
COPY --from=development /usr/src/app/dist ./dist 
COPY dtmomejia.pem /usr/src/app
ENV APP_MAIN_FILE=dist/main 
CMD node ${APP_MAIN_FILE}