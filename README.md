# Sindhi Translator Web Application

This is a standalone web application for translating text to Sindhi language using AI, featuring a clean interface with RTL (Right-to-Left) text support.

## Features

- **AI-Powered Translation**: Uses OpenAI API for high-quality translations to Sindhi (requires API key)
- **RTL Text Support**: Proper display of Sindhi text with right-to-left reading direction
- **Modern UI**: Clean, minimal design with smooth animations and responsive layout
- **Copy Functionality**: One-click copy of translated text to clipboard
- **Speech Synthesis**: Listen to the pronunciation of translated Sindhi text
- **Quick Phrases**: Pre-defined phrases for quick translation
- **Demo Mode**: Works without API key using built-in translations for common phrases

## Deployment Instructions

This web application is a static site, meaning it consists of HTML, CSS, and JavaScript files that can be hosted on any web server or static site hosting service.

### Method 1: Using a Static Site Hosting Service (Recommended)

Services like Netlify, Vercel, GitHub Pages, or Firebase Hosting are excellent choices for deploying static sites. They offer easy setup, custom domains, and often free tiers.

1.  **Prepare your files**: Ensure all your web application files (`index.html`, `styles.css`, `script.js`, `favicon.png`, etc.) are in a single directory.
2.  **Choose a hosting service**: Sign up for an account with your preferred static site hosting provider (e.g., Netlify).
3.  **Connect your repository (optional but recommended)**: If you host your code on GitHub, GitLab, or Bitbucket, you can connect your repository to the hosting service for automatic deployments on every push.
4.  **Deploy**: Follow the service's instructions to deploy your site. Typically, you'll point the service to your project directory, and it will handle the rest.
5.  **Access your site**: Once deployed, the service will provide you with a public URL where your Sindhi Translator web application is live.

### Method 2: Manual Deployment to a Web Server

If you have access to a traditional web server (e.g., Apache, Nginx) via FTP or SSH:

1.  **Prepare your files**: Gather all files from the `sindhi-translator-webapp` directory.
2.  **Upload files**: Connect to your web server using an FTP client or SSH.
3.  **Place files**: Upload all the files to your web server's public HTML directory (e.g., `public_html`, `www`, `htdocs`). Ensure `index.html` is in the root of this directory.
4.  **Access your site**: Your web application will be accessible via your domain name (e.g., `http://yourdomain.com`).

## API Configuration

For the best translation quality, you can configure an OpenAI API key. This is done directly within the web application:

1.  Open the deployed web application in your browser.
2.  Press `Ctrl + Shift + K` (or `Cmd + Shift + K` on Mac) to open a prompt.
3.  Enter your OpenAI API key (e.g., `sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`).
4.  The API key will be saved locally in your browser's local storage.

**Note**: Without an API key, the application will use a built-in demo mode that provides translations for common phrases and words.

## Files Included

-   `index.html`: The main HTML structure of the web application.
-   `styles.css`: All CSS styles for the application's design and layout.
-   `script.js`: JavaScript logic for translation, UI interactions, and API calls.
-   `favicon.png`: The favicon for the website.

## Usage

1.  **Enter Text**: Type or paste the text you want to translate into the input box.
2.  **Translate**: Click the "Translate" button.
3.  **View Translation**: The Sindhi translation will appear in the output box with proper RTL formatting.
4.  **Copy**: Click the copy button to copy the translation to your clipboard.
5.  **Listen**: Click the speaker icon to hear the pronunciation of the Sindhi translation (uses browser's built-in speech synthesis).
6.  **Quick Phrases**: Use the quick phrase buttons to instantly translate common phrases.

## Technical Details

-   **Frontend**: Pure HTML, CSS, and JavaScript for maximum compatibility and performance.
-   **Translation API**: OpenAI API (configurable).
-   **RTL Support**: Implemented using CSS `direction: rtl;` and appropriate fonts.
-   **Local Storage**: Used to store the OpenAI API key and translation history (not implemented in this web app version).

## Support

For any issues or questions, please refer to the documentation or contact support.

---

**Disclaimer**: This web application is provided as-is. For production use, consider implementing robust error handling, server-side API key management, and more advanced features.

