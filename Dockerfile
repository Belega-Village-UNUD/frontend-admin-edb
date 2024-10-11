FROM node:20.9.0 as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM gcr.io/distroless/nodejs20 as environment

# Mark as prod, disable telemetry, set port
ENV NODE_ENV production
ENV FRONT_WEB_PORT ${PORT}
ENV NEXT_TELEMETRY_DISABLED 1

EXPOSE $FRONT_WEB_PORT

# Copy from build
COPY --from=build /app/next.config.js ./
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules

# Run app command
CMD ["./node_modules/next/dist/bin/next", "start"]