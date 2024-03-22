FROM node:20 AS build-env
COPY nodejs /nodejs
WORKDIR /nodejs/template-nodejs-v1

#RUN npm ci --omit=dev
RUN yarn

FROM gcr.io/distroless/nodejs20-debian11
COPY --from=build-env /nodejs /nodejs
WORKDIR /nodejs/template-nodejs-v1
EXPOSE 3000
CMD ["index.js"]
