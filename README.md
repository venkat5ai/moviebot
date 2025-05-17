
# My Movie Studio 

To get started, take a look at src/app/page.tsx.

## What the App Does

My Movie Studio is a web application that allows you to search for movies and retrieve detailed information about them. The app leverages external APIs to fetch movie data, including ratings from popular sources like IMDB and Rotten Tomatoes, as well as lead cast information.

Key Features:

- **Movie Search:** Easily search for movies using a search bar.
- **Automatic Suggestions:** As you type a movie title (at least 2 characters), relevant movie suggestions appear in a dropdown to help you find what you're looking for quickly.
- **Detailed Information Display:** View movie details, including title, release date, ratings from IMDB and Rotten Tomatoes, and lead cast members. This information is presented in a clean, card-based layout for easy readability.

## Usage

The application provides a simple and intuitive interface for finding movie information:

1.  **Main Page Layout:**
    *   **Header:** At the top of the page, you'll see the application title "My Movie Finder" 🎬 accompanied by fun emojis and a subtitle "💃 Let's find a great movie 🕺".
    *   **Search Bar:** Prominently displayed below the header, this is where you'll enter the movie title you're interested in.
    *   **Results Area:** Once you search for a movie, the details (ratings and cast) will appear in a card format in this section.
    *   **Footer:** At the bottom of the page, a simple copyright notice is displayed.

2.  **Searching for a Movie:**
    *   Type the title of the movie you want to find into the search bar (e.g., "Inception", "Iron Man").
    *   As you type (minimum 2 characters), a dropdown list of movie suggestions will appear below the search bar. You can click on any suggestion to populate the search bar with that title.
    *   Once you've typed your desired movie title or selected a suggestion, click the "Find" button.

3.  **Viewing Movie Details:**
    *   After clicking "Find", if the movie details are found, a "Movie Rating Card" will appear.
    *   This card displays:
        *   The **Movie Title** at the top.
        *   The **IMDb Rating** with a star icon.
        *   The **Rotten Tomatoes Rating** with an award icon.
        *   A **Lead Cast** section showing the lead actor and actress (if available), separated by a comma.
    *   If a rating or cast member is not available from the backend, it will typically show "N/A".

4.  **Loading and Error States:**
    *   While the application is fetching movie details after you click "Find", a loading indicator (skeleton UI) will be shown.
    *   If an error occurs during the search (e.g., movie not found, network issue), an error message will be displayed in an alert box.

## Local Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/venkat5ai/studio.git # Or your actual repo
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
    Nginx can act as a reverse proxy to your Next.js application, handle SSL termination (for HTTPS), serve static assets, and manage port 80/443 traffic.
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
4. **(Optional but Recommended for HTTPS) Certbot:**
    Certbot is a tool to automatically obtain and renew SSL/TLS certificates from Let's Encrypt.
    Installation instructions vary by OS. For CentOS:
    ```bash
    sudo yum install certbot python3-certbot-nginx -y
    ```
    For Debian/Ubuntu:
    ```bash
    sudo apt install certbot python3-certbot-nginx -y
    ```

### Build and Run Steps

1.  **Clone your repository on the server:**
    ```bash
    git clone https://github.com/venkat5ai/studio.git # Or your actual repo URL
    cd your-repo-name # e.g., cd studio
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

### (Optional) Configuring Nginx as a Reverse Proxy (with HTTPS/SSL)

If your Next.js app is running (e.g., on port 3000 via PM2), Nginx can proxy requests to it and handle SSL termination.

1.  **Obtain SSL Certificates:**
    If you don't have SSL certificates, you can get free ones from Let's Encrypt using Certbot.
    Run Certbot for your domain (replace `your_domain_or_server_ip`):
    ```bash
    sudo certbot --nginx -d your_domain_or_server_ip
    ```
    Certbot will attempt to modify your Nginx configuration automatically or guide you through the process. It will also set up automatic renewal. If you prefer to configure Nginx manually or Certbot doesn't fully set it up, proceed to the next step.

2.  Create or Modify an Nginx server block configuration file.
    For CentOS, in `/etc/nginx/conf.d/`:
    ```bash
    sudo nano /etc/nginx/conf.d/my-movie-studio.conf
    ```
    For Debian/Ubuntu, in `/etc/nginx/sites-available/`:
    ```bash
    sudo nano /etc/nginx/sites-available/my-movie-studio
    ```

3.  Add the following configuration (adjust `server_name`, certificate paths, and `proxy_pass` port if needed):
    ```nginx
    server {
        listen 80;
        listen [::]:80;
        server_name your_domain_or_server_ip; # Replace with your domain or server IP

        # Redirect HTTP to HTTPS
        location / {
            return 301 https://$host$request_uri;
        }

        # For Certbot ACME challenge (if you're using it)
        location ~ /.well-known/acme-challenge/ {
            allow all;
            root /var/www/html; # Or your Certbot webroot path
        }
    }

    server {
        listen 443 ssl http2;
        listen [::]:443 ssl http2;
        server_name your_domain_or_server_ip; # Replace with your domain or server IP

        # SSL Certificate paths (replace with your actual paths if not using Certbot defaults)
        # Certbot usually places them in /etc/letsencrypt/live/your_domain_or_server_ip/
        ssl_certificate /etc/letsencrypt/live/your_domain_or_server_ip/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/your_domain_or_server_ip/privkey.pem;

        # SSL configuration (these are common strong settings)
        include /etc/letsencrypt/options-ssl-nginx.conf; # Common Let's Encrypt options (if available)
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # Common Let's Encrypt DH params (if available)
        # If the above Let's Encrypt includes are not available, you might need to set parameters like:
        # ssl_protocols TLSv1.2 TLSv1.3;
        # ssl_prefer_server_ciphers off;
        # ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';

        location / {
            proxy_pass http://localhost:3000; # Assumes Next.js runs on port 3000
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme; # Important for HTTPS
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

4.  For Debian/Ubuntu, create a symbolic link to `sites-enabled` (if you used `sites-available`):
    ```bash
    sudo ln -s /etc/nginx/sites-available/my-movie-studio /etc/nginx/sites-enabled/
    ```

5.  Test Nginx configuration and reload:
    ```bash
    sudo nginx -t
    sudo systemctl reload nginx
    ```
    Your application should now be accessible via `https://your_domain_or_server_ip`.

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

## Docker Deployment

This application can also be deployed as a Docker container. A `Dockerfile` using a Node.js Alpine base image (`node:20-alpine`) is provided for smaller image sizes.

### Prerequisites

*   Docker installed on your deployment machine/server.
*   A Docker Hub account (or other container registry) if you want to push your image.

### Building and Pushing the Docker Image

1.  Ensure you have a `.dockerignore` file in your project root (one is provided) to exclude unnecessary files from the Docker build context.
2.  From the root directory of the project (where the `Dockerfile` is located), build the Docker image. It's good practice to tag your image with a version and also with `latest`:
    ```bash
    # Build and tag with version 1.0
    docker build -t venkat5ai/moviebot:1.0 .
    # Also build and tag as latest (optional, but common)
    docker build -t venkat5ai/moviebot:latest .
    ```
    *   `docker build`: The command to build an image from a Dockerfile.
    *   `-t venkat5ai/moviebot:1.0`: Tags the image. Replace `venkat5ai/moviebot` with `<your-dockerhub-username>/<your-repo-name>` and `1.0` with your desired version tag.
    *   `.`: Specifies that the build context (including the Dockerfile) is the current directory.

3.  Log in to Docker Hub (you'll be prompted for your username and password/access token):
    ```bash
    docker login
    ```

4.  Push your tagged images to Docker Hub:
    ```bash
    # Push the versioned tag
    docker push venkat5ai/moviebot:1.0
    # Push the latest tag (optional)
    docker push venkat5ai/moviebot:latest
    ```

### Running the Docker Container

1.  Once the image is built and pushed (or if you're running an image you built locally), you can run it as a container:
    ```bash
    docker run -d -p 3000:3000 -e GOOGLE_API_KEY="YOUR_ACTUAL_GEMINI_API_KEY" --name moviebot-container venkat5ai/moviebot:1.0
    ```
    *   `docker run`: The command to create and start a new container from an image.
    *   `-d`: Runs the container in detached mode (in the background). Omit this if you want to see logs directly in your terminal.
    *   `-p 3000:3000`: Maps port 3000 on your host machine to port 3000 inside the container (where Next.js is running).
    *   `-e GOOGLE_API_KEY="YOUR_ACTUAL_GEMINI_API_KEY"`: Sets the `GOOGLE_API_KEY` environment variable inside the container. **Replace `"YOUR_ACTUAL_GEMINI_API_KEY"` with your actual API key.**
    *   `--name moviebot-container`: (Optional) Assigns a name to your running container for easier management.
    *   `venkat5ai/moviebot:1.0`: The name and tag of the Docker image to run (e.g., from Docker Hub or your local images).

2.  The application should now be accessible at `http://localhost:3000` on your host machine (or the server's IP if running on a remote server). To serve it over HTTPS, you would typically place a reverse proxy (like Nginx, configured as described in the Linux deployment section) in front of this Docker container. The reverse proxy would handle SSL termination and forward traffic to port 3000 on the host, which is mapped to the container.

### Docker Notes

*   **Secrets Management:** The `GOOGLE_API_KEY` is passed as an environment variable at runtime. For more robust secret management in production, consider using Docker secrets, HashiCorp Vault, or your cloud provider's secret management service.
*   **Image Size:** Using `node:20-alpine` as the base image significantly reduces the Docker image size compared to larger OS distributions. The Dockerfile also uses a multi-stage build and Next.js's standalone output feature to further optimize the final image.
*   **Standalone Output:** The `Dockerfile` leverages Next.js's `output: 'standalone'` feature (explicitly set in `next.config.ts`). This copies only necessary files for production, resulting in much smaller final images.
*   **Genkit in Docker:** The Genkit flows are part of the Next.js build. The `GOOGLE_API_KEY` environment variable is essential for them to function. No separate Genkit process needs to be run in the Docker container for production.
*   **SSL/HTTPS with Docker:** As mentioned, the Next.js app inside the container runs on HTTP (port 3000). For HTTPS, you'd typically:
    *   Run a reverse proxy (like Nginx) on the host machine or as another Docker container.
    *   Configure the reverse proxy to listen on port 443, handle SSL with your certificates, and proxy requests to the port your Next.js container is exposed on (e.g., port 3000 on the host).
    *   Alternatively, use a Docker-aware reverse proxy like Traefik which can automate SSL certificate acquisition (e.g., from Let's Encrypt) and routing.

    

