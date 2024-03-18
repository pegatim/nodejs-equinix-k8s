FROM node:21.7.1
WORKDIR /nodejs/template-nodejs-v1
COPY nodejs /nodejs
RUN chown -R node:node /nodejs
USER node
RUN cd /nodejs/template-nodejs-v1 && yarn
EXPOSE 3000
CMD ["/usr/local/bin/node", "index.js"]
