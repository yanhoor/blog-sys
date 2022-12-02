module.exports = {
  apps: [
    {
      name: 'blog-nuxt3',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs'
    }
  ]
}
