# Google OAuth Setup Guide for PitchChat Builder

## Your Redirect URI
Based on your error message, you need to add this exact URI to Google Cloud Console:
```
https://b3322958-1baa-426f-9bd2-4044a13cecc9-00-3px0cmc9fjp1m.spock.replit.dev/api/auth/google/callback
```

## Step-by-Step Instructions

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Select Your Project**
   - Make sure you're in the correct project (should match your Client ID)

3. **Navigate to OAuth Settings**
   - Click on the hamburger menu (☰)
   - Go to **APIs & Services** → **Credentials**

4. **Edit Your OAuth 2.0 Client**
   - Find the OAuth 2.0 Client ID that matches: `833231401442-qb69kriiaihogl1d79i1t47un4a2s583.apps.googleusercontent.com`
   - Click on it to edit

5. **Add the Redirect URI**
   - Scroll to **Authorized redirect URIs**
   - Click **ADD URI**
   - Paste exactly: `https://b3322958-1baa-426f-9bd2-4044a13cecc9-00-3px0cmc9fjp1m.spock.replit.dev/api/auth/google/callback`
   - Click **SAVE** at the bottom

6. **Wait for Changes to Propagate**
   - Changes might take a few minutes to take effect
   - Try again after 2-3 minutes

## Important Notes
- The URI must match EXACTLY (including https://, no trailing slash)
- Make sure you're editing the correct OAuth client (check the Client ID)
- If you have multiple redirect URIs, that's fine - just add this one to the list

## If Still Not Working
- Clear your browser cache and cookies
- Try in an incognito/private window
- Double-check that the URI was saved correctly in Google Console