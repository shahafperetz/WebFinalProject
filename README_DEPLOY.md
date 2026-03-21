# Deployment Guide

## Server details

- DNS: `node16.cs.colman.ac.il`
- Internal IP: `10.10.246.16`
- External IP: `193.106.55.176`
- SSH user: `node16`

## Prerequisites

- Connect to the college VPN
- SSH access to the server
- Repo cloned on the server
- MongoDB already installed on the server
- Node.js already installed on the server
- nginx already installed on the server
- PM2 installed globally

---

## 1. Connect to the server

```bash
ssh node16@10.10.246.16
```

---

## 2. Clone the repository

```bash
git clone <YOUR_REPO_URL>
cd WebFinalProject
```

---

## 3. Create environment files

### Server

Create `server/.envprod` from `server/.envprod.example`

Example:

```env
PORT=4000
NODE_ENV=production

MONGO_URI=mongodb://<APP_DB_USER>:<APP_DB_PASSWORD>@127.0.0.1:21771/WEBFINALPROJECT?authSource=admin

JWT_SECRET=CHANGE_ME
JWT_REFRESH_SECRET=CHANGE_ME
GOOGLE_CLIENT_ID=CHANGE_ME

FRONTEND_URL=https://node16.cs.colman.ac.il
```

### Client

Create `client/.env.production` from `client/.env.example`

Example:

```env
VITE_API_BASE_URL=https://node16.cs.colman.ac.il/api
VITE_GOOGLE_CLIENT_ID=CHANGE_ME
```

---

## 4. Install dependencies

### Server

```bash
cd server
npm install
```

### Client

```bash
cd ../client
npm install
```

---

## 5. Build the frontend

```bash
cd client
npm run build
```

This creates the production files in:

```bash
client/dist
```

---

## 6. Build the backend

```bash
cd ../server
npm run build:prod
```

---

## 7. Run backend with PM2

If PM2 is not installed:

```bash
sudo npm install -g pm2
```

Start the app:

```bash
pm2 start ecosystem.config.js --env production
```

If it already exists:

```bash
pm2 restart ecosystem.config.js --env production
```

Save PM2 state:

```bash
pm2 save
```

Optional:

```bash
pm2 startup
```

---

## 8. Configure nginx

Edit nginx config:

```bash
sudo nano /etc/nginx/sites-available/default
```

Use this config:

```nginx
server {
    listen 80;
    server_name node16.cs.colman.ac.il;

    root /home/node16/WebFinalProject/client/dist;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:4000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /uploads/ {
        proxy_pass http://127.0.0.1:4000/uploads/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Check nginx config:

```bash
sudo nginx -t
```

Restart nginx:

```bash
sudo systemctl restart nginx
```

---

## 9. Enable HTTPS

Install certbot if needed:

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

Generate certificate:

```bash
sudo certbot --nginx -d node16.cs.colman.ac.il
```

After that, the app should be available at:

```text
https://node16.cs.colman.ac.il
```

---

## 10. Check that everything works

### Backend

```bash
pm2 logs
pm2 status
```

### nginx

```bash
sudo systemctl status nginx
```

### App

Check:

- Register
- Login
- Logout
- Create post
- Edit post
- Delete post
- Comments
- Likes
- Profile image
- Swagger
- Google login

---

## 11. Useful commands

### Restart backend

```bash
cd ~/WebFinalProject/server
pm2 restart ecosystem.config.js --env production
```

### Rebuild backend

```bash
cd ~/WebFinalProject/server
npm run build:prod
pm2 restart ecosystem.config.js --env production
```

### Rebuild frontend

```bash
cd ~/WebFinalProject/client
npm run build
```

### View PM2 logs

```bash
pm2 logs
```

### View Mongo connection issues

```bash
pm2 logs social-ai-server
```

---

## 12. Important notes

- Do **not** commit real `.env` files
- Do **not** commit certificates or private keys
- Use only the server MongoDB
- Run the backend only in production mode
- The app must work through the domain without writing a port in the browser
- PM2 must keep the backend alive after terminal disconnect

---

## 13. Recommended repo files

Keep these files in the repo:

- `server/.env.example`
- `server/.envprod.example`
- `server/tsconfig_prod.json`
- `server/ecosystem.config.js`
- `client/.env.example`
- `.gitignore`
- `README_DEPLOY.md`

Do not keep these files in the repo:

- `server/.env`
- `server/.envprod`
- `client/.env`
- `client/.env.production`
- SSL certificate files
