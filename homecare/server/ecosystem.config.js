// PM2 Ecosystem Configuration
// Cluster mode across all CPU cores for maximum throughput
// Redis adapter on Socket.io ensures real-time events work across all instances

module.exports = {
  apps: [
    {
      name: 'homecare-api',
      script: './dist/index.js',
      instances: 'max',           // Spawn one instance per CPU core
      exec_mode: 'cluster',       // Cluster mode for load balancing
      max_memory_restart: '500M', // Restart if memory exceeds 500MB
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 5000,
      },
      // Logging
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: './logs/error.log',
      out_file: './logs/output.log',
      merge_logs: true,
      // Restart policies
      watch: false,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 4000,
      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 8000,
      // Health monitoring
      exp_backoff_restart_delay: 100,
    },
  ],
};
