# My Movie Studio

To get started, take a look at src/app/page.tsx.

## What the App Does

My Movie Studio is a web application that allows you to search for movies and retrieve detailed information about them. The app leverages external APIs to fetch movie data, including ratings from popular sources like IMDB and Rotten Tomatoes.

Key Features:

- **Movie Search:** Easily search for movies using a search bar.
- **Detailed Information Display:** View movie details, including title, release date, and ratings from IMDB and Rotten Tomatoes. This information is presented in a clean, card-based layout for easy readability, as outlined in the `docs/blueprint.md` file.

## Local Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/venkat5ai/studio.git
    cd studio
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the root of your project and add your Google AI API key:
    ```env
    GOOGLE_API_KEY=YOUR_GEMINI_API_KEY_HERE
    ```
    You can obtain a Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

4.  **Run the development server for Next.js:**
    This will start the Next.js frontend.
    ```bash
    npm run dev
    # or
    # yarn dev
    ```
    The application will typically be available at `http://localhost:9002`.

5.  **Run the Genkit development server (in a separate terminal):**
    This allows you to inspect and test your Genkit flows.
    ```bash
    npm run genkit:dev
    # or
    # yarn genkit:watch
    ```
    The Genkit developer UI will typically be available at `http://localhost:4000`.
    *Note: For the main application functionality (searching movies), only the Next.js dev server (`npm run dev`) is strictly necessary as the flows are invoked via server actions. The `genkit:dev` server is for flow development and inspection.*

## Deployment to a Linux Server (e.g., CentOS)

These instructions provide a general guide for deploying your Next.js application to a Linux server. Commands might vary slightly based on your specific Linux distribution.

### Prerequisites on the Server

1.  **Node.js and npm:**
    It's recommended to use Node Version Manager (nvm) to install and manage Node.js versions.
    ```bash
    # Install nvm (get the latest script from https://github.com/nvm-sh/nvm)
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

    # Source nvm (or close and reopen your terminal)
    # This might need to be added to your .bashrc or .zshrc
    export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

    # Install a recent LTS version of Node.js (e.g., Node 20.x)
    nvm install --lts
    nvm use --lts # Ensures the LTS version is used in the current session
    nvm alias default lts # Sets the LTS version as default for new sessions
    ```
    Verify installation:
    ```bash
    node -v
    npm -v
    ```

2.  **PM2 (Process Manager):**
    PM2 is a production process manager for Node.js applications that will keep your app running and can restart it on crashes.
    ```bash
    npm install pm2 -g
    ```

3.  **(Optional but Recommended) Nginx:**
    Nginx can act as a reverse proxy to your Next.js application, handle SSL termination, serve static assets, and manage port 80/443 traffic.
    For CentOS:
    ```bash
    sudo yum install epel-release -y
    sudo yum install nginx -y
    sudo systemctl start nginx
    sudo systemctl enable nginx
    ```
    For Debian/Ubuntu:
    ```bash
    sudo apt update
    sudo apt install nginx -y
    sudo systemctl start nginx
    sudo systemctl enable nginx
    ```

### Build and Run Steps

1.  **Clone your repository on the server:**
    ```bash
    git clone https://github.com/venkat5ai/studio.git
    cd studio
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    # or if you used yarn locally:
    # yarn install
    ```

3.  **Set up Environment Variables for Production:**
    Create a `.env.production` file in the root of your project on the server. Next.js automatically loads this file for production builds.
    ```bash
    nano .env.production
    ```
    Add your Google AI API key:
    ```env
    GOOGLE_API_KEY=YOUR_PRODUCTION_GEMINI_API_KEY
    ```
    Save the file (Ctrl+O, Enter, then Ctrl+X in nano). Ensure this file is not publicly accessible and has appropriate permissions.

4.  **Build the Application:**
    ```bash
    npm run build
    # or
    # yarn build
    ```
    This will create an optimized production build in the `.next` directory.

5.  **Run the Application:**

    **Method 1: Using PM2 (Recommended for Production)**
    Start your application with PM2. The `start` script in your `package.json` runs `next start`, which by default uses port 3000.
    ```bash
    pm2 start npm --name "my-movie-studio" -- run start
    ```
    *   `--name "my-movie-studio"`: Assigns a name to your process.
    *   `-- run start`: Tells PM2 to use the `start` script from your `package.json`.

    Useful PM2 commands:
    *   Save current PM2 process list to resurrect on server reboot:
        ```bash
        pm2 save
        pm2 startup
        ```
        (Follow the instructions output by `pm2 startup` to complete this. You might need to run the output command with `sudo`.)
    *   List all running processes: `pm2 list`
    *   Monitor logs: `pm2 logs my-movie-studio`
    *   Stop the application: `pm2 stop my-movie-studio`
    *   Restart the application: `pm2 restart my-movie-studio`
    *   Delete the application from PM2: `pm2 delete my-movie-studio`

    **Method 2: Using `npm start` (Simpler, but not for robust production)**
    You can run the app directly using the start script. It will typically start on port 3000.
    ```bash
    npm run start
    ```
    This method is less ideal for production as the app won't automatically restart.

### (Optional) Configuring Nginx as a Reverse Proxy

If your Next.js app is running (e.g., on port 3000 via PM2), Nginx can proxy requests to it.

1.  Create an Nginx server block configuration file.
    For CentOS, in `/etc/nginx/conf.d/`:
    ```bash
    sudo nano /etc/nginx/conf.d/my-movie-studio.conf
    ```
    For Debian/Ubuntu, in `/etc/nginx/sites-available/`:
    ```bash
    sudo nano /etc/nginx/sites-available/my-movie-studio
    ```

2.  Add the following configuration (adjust `server_name` and `proxy_pass` port if your Next.js app runs on a different port):
    ```nginx
    server {
        listen 80;
        listen [::]:80;

        server_name your_domain_or_server_ip; # Replace with your domain or server IP

        location / {
            proxy_pass http://localhost:3000; # Assumes Next.js runs on port 3000
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # For SSL (HTTPS) - Recommended for production:
        # Ensure you have SSL certificates (e.g., from Let's Encrypt)
        # listen 443 ssl http2;
        # listen [::]:443 ssl http2;
        # server_name your_domain_or_server_ip;
        # ssl_certificate /etc/letsencrypt/live/your_domain_or_server_ip/fullchain.pem;
        # ssl_certificate_key /etc/letsencrypt/live/your_domain_or_server_ip/privkey.pem;
        # include /etc/letsencrypt/options-ssl-nginx.conf; # Common Let's Encrypt options
        # ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # Common Let's Encrypt DH params

        # To allow Certbot to renew certificates:
        # location ~ /.well-known/acme-challenge/ {
        #     allow all;
        #     root /var/www/html; # Or your Certbot webroot path
        # }
    }
    ```

3.  For Debian/Ubuntu, create a symbolic link to `sites-enabled` (if you used `sites-available`):
    ```bash
    sudo ln -s /etc/nginx/sites-available/my-movie-studio /etc/nginx/sites-enabled/
    ```

4.  Test Nginx configuration and reload:
    ```bash
    sudo nginx -t
    sudo systemctl reload nginx
    ```
    Your application should now be accessible via your server's IP address or domain name on port 80 (or 443 if SSL is configured).

### Firewall Configuration

Ensure your server's firewall allows traffic on the necessary ports (e.g., 80 for HTTP, 443 for HTTPS).
For CentOS using `firewalld`:
```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
# If you need to access Node.js directly on port 3000 (e.g., for testing before Nginx is set up)
# sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```
For Debian/Ubuntu using `ufw`:
```bash
sudo ufw allow 'Nginx Full' # Allows HTTP and HTTPS
# Or specifically:
# sudo ufw allow http
# sudo ufw allow https
# If direct access needed:
# sudo ufw allow 3000/tcp
sudo ufw enable # If not already enabled
```

### Genkit Notes for Production

*   The Genkit AI flows are bundled as part of your Next.js application during the `npm run build` process. They are invoked as server-side functions (Next.js Server Actions).
*   The `GOOGLE_API_KEY` (or any other API keys for Genkit plugins) **must** be set as an environment variable on your production server (e.g., in the `.env.production` file or configured directly in PM2's environment or system-wide).
*   You do not need to run `genkit start` or `npm run genkit:dev` in production. Those commands are for local development and inspection of flows.
```