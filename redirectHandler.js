// redirectHandler.js
const express = require('express');
const router = express.Router();

// Define your Play Store and App Store URLs
// You'll need to replace these with the actual URLs for your BharatGeoshield app
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.aitrix.bharatsheld";
const APP_STORE_URL = "https://apps.apple.com/app/YOUR_IOS_APP_ID";
router.get('/', (req, res) => {
    const tag = req.query.tag;

    if (!tag) {
        return res.status(400).send("Tag parameter is missing. Usage: /redirect?tag=YOUR_TAG");
    }

    const customSchemeUrl = `bharatgeoshield://geo.asquare.org.in/tags/${tag}`;

    const htmlResponse = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Redirecting to BharatGeoshield...</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script type="text/javascript">
                function redirectToAppStore() {
                    // Detect if the user is on iOS or Android to redirect to the correct store
                    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

                    if (/android/i.test(userAgent)) {
                        window.location.href = "${PLAY_STORE_URL}";
                    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
                        window.location.href = "${APP_STORE_URL}";
                    } else {
                        // For desktop or other devices, or if we can't detect, default to Play Store or a general download page
                        window.location.href = "${PLAY_STORE_URL}"; // Or a page with both links
                    }
                }

                window.onload = function() {
                    let appOpened = false;

                    // Try to open the custom URL scheme
                    const tryOpenApp = setTimeout(() => {
                        if (!appOpened) {
                            // If the app didn't open after a delay, assume it's not installed
                            console.log("App did not open. Redirecting to app store.");
                            redirectToAppStore();
                        }
                    }, 2000); // Give it 2 seconds to try and open the app

                    // Attempt to open the custom URL.
                    // If the browser can handle it (app installed), it will navigate away.
                    // If not, the setTimeout will eventually trigger.
                    window.location.href = "${customSchemeUrl}";

                    // Optional: Try to detect if the page visibility changes (app might open in background)
                    // This is not foolproof but can help in some cases.
                    document.addEventListener('visibilitychange', function() {
                        if (document.hidden) {
                            appOpened = true; // Assume app opened if browser tab hides
                            clearTimeout(tryOpenApp); // Cancel the store redirect
                        }
                    });
                };
            </script>
            <style>
                body { font-family: sans-serif; text-align: center; margin-top: 50px; background-color: #f4f7f6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                .loader { border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 2s linear infinite; margin: 20px auto; }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                a { color: #3498db; text-decoration: none; }
                a:hover { text-decoration: underline; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="loader"></div>
                <h2>Attempting to open BharatGeoshield app...</h2>
                <p id="message">If the app doesn't open, we'll redirect you to the app store in a moment.</p>
                <p>Alternatively, <a href="${customSchemeUrl}">click here to try opening the app directly</a>.</p>
            </div>
        </body>
        </html>
    `;

    res.send(htmlResponse);
});

module.exports = router;