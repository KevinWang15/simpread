cross-env NODE_ENV=production  webpack -p --progress --colors

cat ./publish/bundle/common.js ./publish/bundle/vendors.js ./publish/bundle/api.js > api.js
