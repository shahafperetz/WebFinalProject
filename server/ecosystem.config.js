module.exports = {
  apps: [
    {
      name: "social-ai-server",
      script: "./dist/src/server.js",
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
