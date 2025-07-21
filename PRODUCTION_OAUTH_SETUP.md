# Production OAuth Setup for pitchchat.ai

## Google OAuth Redirect URIs

For production deployment on pitchchat.ai, you need to add these redirect URIs to your Google Cloud Console:

### Production URIs
```
https://pitchchat.ai/api/auth/google/callback
https://www.pitchchat.ai/api/auth/google/callback
```

### Development URI (for local testing only)
```
http://localhost:5000/api/auth/google/callback
```

## Environment Variables for Production

When deploying to production, make sure to set:

```bash
# Your production domain
PRODUCTION_URL=https://pitchchat.ai

# Google OAuth credentials (same as development)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# Other required variables
SESSION_SECRET=strong-random-secret-for-production
DATABASE_URL=your-production-database-url
BREVO_API_KEY=your-brevo-api-key
```

## Steps to Configure Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID
5. In **Authorized redirect URIs**, add ALL the URIs listed above
6. In **Authorized JavaScript origins**, add:
   - `https://pitchchat.ai`
   - `https://www.pitchchat.ai`
7. Click **SAVE**

## Important Notes

- Always keep both development and production URIs configured
- The trailing slash matters - don't add one if it's not shown
- Google OAuth changes can take 5-30 minutes to propagate
- For production, ensure SSL/HTTPS is properly configured on your domain

## Testing Production OAuth

1. Deploy your application to pitchchat.ai
2. Set all required environment variables
3. Test Google Sign In from an incognito window
4. Check server logs if issues occur

Remember: The OAuth callback URL must match exactly what's configured in Google Cloud Console!