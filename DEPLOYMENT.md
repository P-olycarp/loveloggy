# 🚀 LoveLoggy - Deployment Guide

## Quick Deploy Options

### Option 1: Railway (Recommended - Easiest) ⚡

1. **Install Railway CLI:**
```bash
npm install -g @railway/cli
```

2. **Login & Deploy:**
```bash
railway login
railway init
railway up
```

3. **Set Environment:**
```bash
railway variables set PORT=3000
```

4. **Get Your URL:**
```bash
railway open
```

**Done!** Your app is live at `https://your-app.railway.app`

---

### Option 2: Render 🎨

1. Go to [render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repo
4. Configure:
   - **Name:** loveloggy
   - **Root Directory:** (leave blank)
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `node server/index.js`
   - **Port:** 3000
5. Click "Create Web Service"

**Done!** App will be live at `https://loveloggy.onrender.com`

---

### Option 3: Fly.io 🪰

1. **Install Fly CLI:**
```bash
curl -L https://fly.io/install.sh | sh
```

2. **Launch:**
```bash
fly launch
fly deploy
```

3. **Open:**
```bash
fly open
```

---

### Option 4: Heroku 💜

1. **Install Heroku CLI:**
```bash
curl https://cli-assets.heroku.com/install.sh | sh
```

2. **Deploy:**
```bash
heroku login
heroku create loveloggy-app
git push heroku main
heroku open
```

---

### Option 5: Docker (Any Host) 🐳

1. **Build & Run:**
```bash
docker-compose up -d
```

2. **Access at:** `http://your-server-ip:3000`

---

## Post-Deployment

### 1. Test Your Deployment
```bash
curl https://your-domain.com/api/health
# Should return: {"ok":true,"system":"1-to-1 private couple"}
```

### 2. Setup Custom Domain (Optional)
- Railway: Settings → Domains → Add custom domain
- Render: Settings → Custom Domains
- Fly.io: `fly certs add yourdomain.com`

### 3. Enable HTTPS
Most platforms enable HTTPS automatically. If not:
- Use Cloudflare (free SSL)
- Use Let's Encrypt with nginx

### 4. Production Checklist
- [ ] Change default passwords
- [ ] Set up database backups (upgrade from JSON to PostgreSQL)
- [ ] Enable rate limiting
- [ ] Add monitoring (UptimeRobot, Better Stack)
- [ ] Test on mobile devices

---

## Environment Variables (Optional)

```bash
PORT=3000                  # Server port
NODE_ENV=production       # Environment
```

---

## Need Help?

- **Railway:** https://docs.railway.app
- **Render:** https://render.com/docs
- **Fly.io:** https://fly.io/docs
- **Docker:** https://docs.docker.com

---

## 🎉 You're Live!

Share your URL with your partner and enjoy your private couple space!

**Example URLs:**
- Railway: `https://loveloggy-production.up.railway.app`
- Render: `https://loveloggy.onrender.com`
- Fly.io: `https://loveloggy.fly.dev`
