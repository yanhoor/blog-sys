module.exports = {
  apps: [
    {
      name: 'blog-node',
      exec_mode: 'cluster',
      instances: 'max',
      // 默认环境及变量，可以被下面的 env_development 等覆盖
      env: {
        "NODE_ENV": "production",
      },
      // env_production: {
      //   DATABASE_URL: "mysql://yanhoor:1q2w3e4R%@110.41.142.213:3306/blogKoa2"
      // },
      // 需要使用 pm2 start ecosystem.config.js --env development 启动
      // env_development: {
      //   "NODE_ENV": "development", // 覆盖上面的 NODE_ENV
      //   DATABASE_URL: "mysql://root:145261yan@localhost:3306/blogKoa2"
      // },
      script: './src/index.js'
    }
  ]
}
