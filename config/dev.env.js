'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_URL: '"https://apishenshou.71360.com/"'
  BASE_URL: '"https://shenshoutest.nbseo.cn/"'
  // BASE_URL: '"http://shenshouxcx.com/"'
})
