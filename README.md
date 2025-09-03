# Al Fahd Seafood - Modern Website

This project is a complete front-end and back-end enhancement of the Al Fahd Seafood website. It features a modern, responsive design with advanced UI/UX features, including a live chat assistant powered by the Gemini API.

## Live Demo

[A live demo of the deployed site will be available here.]

## Features Implemented

### Theme & UI
- **Smart Dark/Light Mode:** Automatically switches theme based on system preference or time of day.
- **Modern UI Effects:** Glassmorphism and Neumorphism applied to key components like product cards and the footer.
- **Micro-interactions:** Magnetic buttons, hover underlines, and icon nudges for a more interactive experience.
- **Advanced Animations:** Site-wide scroll-reveal animations, parallax effects on headers, animated gradient backgrounds, and a 3D tilt effect on product cards.

### Products Page
- **Dynamic Product Cards:** Cards are now generated from `data/products.json`.
- **Skeleton Loading:** A shimmer animation is shown while product images load.
- **Lazy-Loaded WebP Images:** Optimized image loading using the `<picture>` element for WebP with JPG fallbacks.
- **Interactive Overlay:** A hover/focus overlay reveals "Quick View" and "Order Now" buttons.
- **Quick View Modal:** Displays larger product image and details.
- **WhatsApp Integration:** "Order Now" button opens WhatsApp with a pre-filled message.

### Live Chat Widget
- **Floating Action Button (FAB):** A site-wide widget to access the chat.
- **Gemini API Integration:** The chat is powered by a serverless function that calls the Gemini API.
- **Grounded Responses:** The AI's answers are grounded in the product and FAQ data from the site's JSON files.
- **Conversation Memory:** The last 10 messages are saved to `localStorage`.
- **Email Transcript:** Users can have the chat transcript emailed to them via a second serverless function.

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge).
- A local web server to run the project and avoid CORS issues with `fetch`. The `live-server` VS Code extension or `python -m http.server` are good options.
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) if you plan to run or deploy the serverless functions.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [repository-url]
    cd [repository-folder]
    ```

2.  **Set up environment variables:**
    -   Create a `.env` file in the root of the project by copying the example file:
        ```bash
        cp .env.example .env
        ```
    -   Open the `.env` file and add your secret keys:
        ```
        GEMINI_API_KEY=your_google_gemini_api_key
        EMAIL_PROVIDER_KEY=your_email_provider_api_key
        ```

3.  **Run the site:**
    -   Start a local web server from the project's root directory. For example:
        ```bash
        python -m http.server
        ```
    -   Open your browser and navigate to `http://localhost:8000`.

## Backend / Serverless Functions

The project includes two serverless functions located in the `/functions` directory. These are designed for platforms like Netlify, Vercel, or AWS Lambda.

-   `gemini-chat.js`: Handles the chat interaction with the Gemini API.
-   `send-email.js`: Handles sending the chat transcript via an email provider.

### Deployment Notes
- When deploying to a platform like Netlify, it will automatically detect the `/functions` directory.
- You will need to configure the environment variables (`GEMINI_API_KEY`, `EMAIL_PROVIDER_KEY`) in your Netlify site settings.
- The frontend code calls these functions at the path `/.netlify/functions/[function-name]`. This path is automatically handled by Netlify's proxy during development and in production. To test this locally, you can use the [Netlify CLI](https://docs.netlify.com/cli/get-started/).

```bash
# Install Netlify CLI
npm install netlify-cli -g

# Run a local development server with serverless functions
netlify dev
```
This will start a server, typically on `http://localhost:8888`, that mirrors the Netlify production environment.
