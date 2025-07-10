# Deploy to Render

This guide will help you deploy your Flask admin backend to Render.

## Prerequisites

1. **GitHub Account** - Your code needs to be on GitHub
2. **Render Account** - Sign up at [render.com](https://render.com)

## Step 1: Prepare Your Repository

### Files Structure for Render:
```
your-repo/
├── requirements.txt          # Python dependencies
├── render.yaml              # Render configuration
├── admin/
│   ├── admin_server.py      # Flask app
│   ├── config.py            # Configuration
│   └── start_server.py      # Startup script
├── index.html               # Main site
├── properties.html          # Properties page
├── contact.html             # Contact page
├── admin-login.html         # Admin login (updated)
├── css/                     # Stylesheets
├── javascript/              # JavaScript files
└── images/                  # Images
```

## Step 2: Deploy to Render

### Option A: Using render.yaml (Recommended)

1. **Push your code to GitHub** with all the files above
2. **Go to Render Dashboard** → "New" → "Web Service"
3. **Connect your GitHub repository**
4. **Render will automatically detect** the `render.yaml` configuration
5. **Click "Create Web Service"**

### Option B: Manual Configuration

1. **Push your code to GitHub**
2. **Go to Render Dashboard** → "New" → "Web Service"
3. **Connect your GitHub repository**
4. **Configure manually:**
   - **Name**: `freelancer-admin`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `cd admin && python admin_server.py`
5. **Click "Create Web Service"**

## Step 3: Configure Environment Variables

In your Render service settings, add these environment variables:

- `RENDER=true` (This tells the app it's running on Render)
- `PORT=10000` (Render will set this automatically)

## Step 4: Update Your Frontend

Once deployed, your Render service will have a URL like:
`https://your-app-name.onrender.com`

### For Static Site Deployment (GitHub Pages):

1. **Deploy your static files** to GitHub Pages:
   - `index.html`, `properties.html`, `contact.html`
   - `css/`, `javascript/`, `images/` folders
   - `admin-login.html` (already updated to work with Render)

2. **Your admin-login.html** will automatically detect if it's running locally or on Render and use the correct API URL.

## Step 5: Test Your Deployment

1. **Visit your GitHub Pages site**: `https://yourusername.github.io/your-repo`
2. **Click "Admin"** in the navigation
3. **Login with your admin credentials**
4. **The login should work** and redirect to your admin panel

## Troubleshooting

### Common Issues:

1. **Build fails**: Check that `requirements.txt` exists and has correct dependencies
2. **App crashes**: Check Render logs for Python errors
3. **Admin login doesn't work**: Verify the API URL in `admin-login.html`
4. **Static files not found**: Make sure all files are in the correct directories

### Check Logs:

1. **Go to your Render service dashboard**
2. **Click "Logs"** to see real-time logs
3. **Look for errors** in the build or runtime logs

## Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `RENDER` | Set to `true` on Render | `false` |
| `PORT` | Port number (set by Render) | `50118` |
| `DEBUG` | Debug mode | `True` |

## Security Notes

1. **Admin credentials** are hardcoded in `config.py` - consider using environment variables for production
2. **HTTPS** is automatically enabled on Render
3. **CORS** might need configuration if accessing from different domains

## Next Steps

After successful deployment:

1. **Test all functionality** on the live site
2. **Update admin credentials** if needed
3. **Consider adding a database** for dynamic content
4. **Set up monitoring** and alerts

## Support

- **Render Documentation**: [docs.render.com](https://docs.render.com)
- **Flask Documentation**: [flask.palletsprojects.com](https://flask.palletsprojects.com)
- **GitHub Pages**: [pages.github.com](https://pages.github.com) 