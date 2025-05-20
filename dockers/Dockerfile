FROM node:18-alpine as builder
WORKDIR /builder

COPY apps/auth ./apps/auth/
COPY apps/event ./apps/event/
COPY apps/gateway ./apps/gateway/
COPY libs/ ./libs

COPY tsconfig.base.json nest-cli.json .yarnrc.yml yarn.lock package.json ./
COPY .yarn .yarn

RUN corepack enable && yarn install || (cat /tmp/*/build.log; exit 1)
RUN yarn build:all

FROM node:18-alpine as runner
WORKDIR /runner

COPY --from=builder /builder/.yarn ./.yarn
COPY --from=builder /builder/yarn.lock .
COPY --from=builder /builder/package.json .
COPY --from=builder /builder/.yarnrc.yml .
COPY --from=builder /builder/nest-cli.json .

COPY --from=builder /builder/apps/auth/dist ./apps/auth/dist
COPY --from=builder /builder/apps/auth/package.json ./apps/auth/

COPY --from=builder /builder/apps/event/dist ./apps/event/dist
COPY --from=builder /builder/apps/event/package.json ./apps/event/

COPY --from=builder /builder/apps/gateway/dist ./apps/gateway/dist
COPY --from=builder /builder/apps/gateway/package.json ./apps/gateway/

COPY --from=builder /builder/libs/database/dist ./libs/database/dist
COPY --from=builder /builder/libs/database/package.json ./libs/database/

COPY --from=builder /builder/libs/common/dist ./libs/common/dist
COPY --from=builder /builder/libs/common/package.json ./libs/common/

COPY --from=builder /builder/libs/config/dist ./libs/config/dist
COPY --from=builder /builder/libs/config/package.json ./libs/config/

RUN yarn install
