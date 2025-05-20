FROM node:18-alpine AS builder
WORKDIR /builder

RUN npm install -g npm@10.8.2 && corepack enable
RUN yarn set version 4.1.0

COPY /apps/auth ./apps/auth/
COPY /libs ./libs
COPY tsconfig.base.json nest-cli.json .yarnrc.yml yarn.lock package.json ./
COPY .yarn .yarn

RUN yarn install || (cat /tmp/*/build.log; exit 1)

RUN yarn build:all
RUN yarn build:auth

FROM node:18-alpine AS runner
WORKDIR /runner

COPY --from=builder /builder/.yarn ./.yarn
COPY --from=builder /builder/yarn.lock .
COPY --from=builder /builder/package.json .
COPY --from=builder /builder/.yarnrc.yml .
COPY --from=builder /builder/nest-cli.json .
COPY --from=builder /builder/apps/auth/dist ./apps/auth/dist
COPY --from=builder /builder/apps/auth/package.json ./apps/auth/
COPY --from=builder /builder/apps/auth/tsconfig.build.json ./apps/auth/ 
COPY --from=builder /builder/apps/auth/tsconfig.json ./apps/auth/ 

COPY --from=builder /builder/libs/database/dist ./libs/database/dist
COPY --from=builder /builder/libs/database/package.json ./libs/database/

COPY --from=builder /builder/libs/common/dist ./libs/common/dist
COPY --from=builder /builder/libs/common/package.json ./libs/common/

COPY --from=builder /builder/libs/config/dist ./libs/config/dist
COPY --from=builder /builder/libs/config/package.json ./libs/config/

RUN yarn install
CMD yarn dev:auth