FROM node:20.9.0-alpine as dependencies
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV development
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM node:20.9.0-alpine as build
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build


FROM gcr.io/distroless/nodejs20 as environment
ENV NODE_ENV production
ENV FRONT_WEB_PORT ${PORT}
ENV NEXT_TELEMETRY_DISABLED 1
EXPOSE $FRONT_WEB_PORT
COPY --from=build /app/next.config.js ./
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
CMD ["./node_modules/next/dist/bin/next", "start"]
