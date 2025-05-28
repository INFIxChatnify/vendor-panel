# Quickstart

## Installation

Clone the repository

```js
git clone https://github.com/mercurjs/vendor-panel.git
```

&nbsp;

Go to directory

```js
cd vendor-panel
```

&nbsp;

Install dependencies

```js
npm install
```

&nbsp;

Make a .env.local file and copy the code below

```js
VITE_MEDUSA_BASE='/'
VITE_MEDUSA_STOREFRONT_URL=http://localhost:3000
VITE_MEDUSA_BACKEND_URL=http://localhost:9000
VITE_TALK_JS_APP_ID=<talkjs public key here>
VITE_DISABLE_SELLERS_REGISTRATION=false
```

&nbsp;

Start storefront

```js
npm run dev
```

&nbsp;

## Railway Deployment

### One-Click Deploy
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/your-template-id)

### Manual Deployment

1. **Fork/Clone this repository**

2. **Connect to Railway**
   - Go to [Railway](https://railway.app)
   - Create a new project
   - Connect your GitHub repository

3. **Set Environment Variables**
   Set the following variables in Railway's environment settings:
   ```
   VITE_MEDUSA_BACKEND_URL=https://your-backend-url.railway.app
   VITE_MEDUSA_STOREFRONT_URL=https://your-storefront-url.railway.app
   VITE_PUBLISHABLE_API_KEY=your_publishable_api_key
   VITE_TALK_JS_APP_ID=your_talk_js_app_id
   VITE_DISABLE_SELLERS_REGISTRATION=false
   NODE_ENV=production
   ```

4. **Deploy**
   Railway will automatically build and deploy your application.

5. **Custom Domain (Optional)**
   - In Railway dashboard, go to your service
   - Navigate to Settings > Networking
   - Add your custom domain

### Build Configuration

The project includes the following Railway-specific files:
- `railway.json` - Railway service configuration
- `nixpacks.toml` - Build configuration
- `Procfile` - Process configuration
- `.env.example` - Environment variables template

&nbsp;

## Guides

<a href="https://talkjs.com/docs/Reference/Concepts/Sessions/" target="_blank">How
to get TalkJs App ID</a>
