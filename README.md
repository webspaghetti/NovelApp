<div align="center">
  <a href="public/logo.png">
    <img src="public/logo.png" alt="Logo" width="120" height="120">
  </a>

  <h1 align="center">NovelApp</h1>

  <p align="center">
    A self-hosted, customizable Progressive Web App (PWA) for scraping, managing, and reading web novels.
    <br />
    <a href="#key-features"><strong>Explore the features »</strong></a>
    <br />
    <br />
    <a href="#quick-start-docker">Self-Hosting Guide</a>
    ·
    <a href="#maintenance">Maintenance</a>
    ·
    <a href="#license">License</a>
  </p>
</div>

<div align="center">

![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![MariaDB](https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)

</div>

## About The Project

**NovelApp** is a personal project designed to improve the reading experience for web novel enthusiasts. It functions as a self-hosted library that scrapes content from various sources, standardizes the formatting, and provides a distraction-free, offline-capable reading environment.

It is built as a **Progressive Web App (PWA)**, meaning it can be installed on iOS and Android devices to look and feel like a native application.

### Key Features

* **Progressive Web App (PWA):** Installable on mobile devices with offline support.
* **Offline Reading:** Download chapters to your device (IndexedDB) to read without an internet connection. (with limited capabilities)
* **Advanced Customization:**
    * Full control over fonts, sizes, and line heights.
    * Custom themes (backgrounds, text colors).
    * Device-specific profiles (different settings for mobile vs. desktop).
* **Aggregation:** Scrapes and unifies content from variety of different sources.
* **Synchronization:** Tracks your reading progress automatically.
* **Library Management:** Organize novels by status (Ongoing, Completed, Hiatus) and sort by various metrics.
* **Dockerized:** Easy deployment with Docker Compose.

---

## Self-Hosting Guide

### Prerequisites

* **Docker** and **Docker Compose** installed.
* At least **2GB of RAM** (required for the browser-based scraper).
* Port `3000` available (or configure a different port).

### Quick Start (Docker)

1.  **Clone the repository**
    ```bash
    git clone https://github.com/webspaghetti/NovelApp
    cd novelapp
    ```

2.  **Configure environment variables**
    ```bash
    cp .env.example .env
    ```

    Edit `.env` and set your secure values:
    * Change `DB_ROOT_PASSWORD`, `DB_PASSWORD`, etc.
    * Generate a secure secret: `openssl rand -base64 32` and paste it into `NEXTAUTH_SECRET`.
    * Update `NEXTAUTH_URL` to your domain (e.g., `https://reader.yourdomain.com`) or local IP.

3.  **Start the application**
    ```bash
    docker-compose up -d
    ```

4.  **Access the application**
    * **App:** Open `http://localhost:3000` (or your configured domain).
    * **Database Admin:** Open `http://localhost:8080` (phpMyAdmin).

### Configuration Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_ROOT_PASSWORD` | MariaDB root password | `changeme_root` |
| `DB_DATABASE` | Database name | `nextjs_db` |
| `DB_USER` | Database user | `nextjs_user` |
| `DB_PASSWORD` | Database password | `changeme_password` |
| `DB_PORT` | External database port | `3306` |
| `APP_PORT` | Application port | `3000` |
| `PHPMYADMIN_PORT` | phpMyAdmin port | `8080` |
| `NEXTAUTH_URL` | Full URL of your app | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js | **Required** |

### Reverse Proxy Setup (Nginx/Traefik)

If using a reverse proxy, update `NEXTAUTH_URL` to your full domain:
```env
NEXTAUTH_URL=https://yourdomain.com
```

## Maintenance

### Accessing phpMyAdmin
1. Open `http://localhost:8080` (or your configured `PHPMYADMIN_PORT`)
2. Login credentials:
   - Username: value from `DB_USER`
   - Password: value from `DB_PASSWORD`

### Backup Database
```bash
docker-compose exec db mysqldump -u root -p${DB_ROOT_PASSWORD} ${DB_DATABASE} > backup.sql
```

### Restore Database
```bash
docker-compose exec -T db mysql -u root -p${DB_ROOT_PASSWORD} ${DB_DATABASE} < backup.sql
```

### Update Application
```bash
docker-compose down
git pull
docker-compose up -d --build
```

### Reset User Password
```bash
docker exec -it novelapp-app npm run reset-password <username>
```

### View Logs
```bash
docker-compose logs -f app
docker-compose logs -f db
```

### Stop Application
```bash
docker-compose down
```

### Stop and Remove All Data
```bash
docker-compose down -v
```

## Troubleshooting

### Database Connection Issues
- Check if database is healthy: `docker-compose ps`
- Check database logs: `docker-compose logs db`
- Verify environment variables in `.env` are set correctly
- Ensure `DB_HOST=db` in your app configuration

### Application Won't Start
- Check app logs: `docker-compose logs app`
- Ensure `NEXTAUTH_SECRET` is set in `.env`
- Ensure all required environment variables are present
- Check if port in `APP_PORT` is available

### Port Already in Use
Change the external port in `.env`:
```env
APP_PORT=3001
```

### Scraping Not Working
- Playwright requires at least 2GB RAM
- Check logs: `docker-compose logs app | grep -i "scraping"`
- Some sites may have more advanced anti-scraping measures

### PWA Not Installing
- Ensure you're accessing via HTTPS (required for PWA installation)
- Clear browser cache and try again
- Check that service worker is registered in browser DevTools

---

## License

This project is open source and available under the [MIT License](LICENSE).