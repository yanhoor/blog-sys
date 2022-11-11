module.exports = {
  apps: [
    {
      name: 'blog-node',
      exec_mode: 'cluster',
      instances: 'max',
      env_production: {
        DATABASE_URL: "mysql://yanhoor:1q2w3e4R%@110.41.142.213:3306/blogKoa2"
      },
      env_development: {
        DATABASE_URL: "mysql://root:145261yan@localhost:3306/blogKoa2"
      },
      script: './src/index.js'
    }
  ]
}
