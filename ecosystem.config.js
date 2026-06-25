module.exports = {
  apps: [{
    name: 'drive-connect',
    script: '/opt/drive-connect/.next/standalone/server.js',
    cwd: '/opt/drive-connect/.next/standalone',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3003,
      HOSTNAME: '0.0.0.0',
      DATABASE_URL: 'mysql://drive_connect_user:DriveConnect2024!@localhost:3306/drive_connect',
      NEXT_PUBLIC_SITE_URL: 'http://5.161.189.93'
    }
  }]
};
