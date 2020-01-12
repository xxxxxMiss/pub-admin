module.exports = {
  apps: [
    {
      name: 'pub-admin',
      script: 'npm',

      // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
      args: 'start',
      instances: 1,
      watch: true,
      ignore_watch: ['node_modules'],
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        PORT: 8090,
        NODE_ENV: 'production'
      },
      error_file: '/var/log/pm2/pub-admin-error.log',
      out_file: '/var/log/pm2/pub-admin-out.log',
      merge_logs: true,
      time: false
    }
  ]
}
