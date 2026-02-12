# QR-Snap 📸

A Node.js web application that allows users to create personalized mini-webpages instantly and automatically generates a QR code to share them.

## 🚀 Features

1.  **Instant Creation:** Simple form to input title, message, author, and select a visual theme.
2.  **Image Upload:** Support for uploading custom images.
3.  **QR Generation:** Automatically generates a unique QR code pointing to the created page.
4.  **Visual Themes:** Users can choose from various color schemes (Dark, Blue, Red, Nature, etc.).
5.  **View Counter:** tracks how many times a page has been visited.
6.  **Responsive Design:** Looks great on mobile and desktop using Bootstrap 5.

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.
* **Frontend:** EJS (Templating), Bootstrap 5 (CDN).
* **Utilities:**
    * `multer`: For handling image uploads.
    * `qrcode`: For generating QR codes.
    * `uuid`: For generating unique page IDs.
* **Storage:** Local JSON file (`pages.json`).

## 💻 Local Installation

1.  Clone the repository or download the files.
2.  Open a terminal in the project folder.
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Start the server:
    ```bash
    npm start
    ```
5.  Open your browser at: `http://localhost:3000`

## ☁️ Deployment on Render (Free Tier)

This project is optimized for [Render.com](https://render.com/).

1.  Push your code to **GitHub**.
2.  In Render, create a **"Web Service"**.
3.  Connect your repository.
4.  **Runtime:** Node
5.  **Build Command:** `npm install`
6.  **Start Command:** `node server.js`
7.  Render will automatically detect the port.

> **⚠️ Important Note for Render Free Tier:**
> The free plan on Render uses an **ephemeral filesystem**. This means that if the server restarts or "spins down" due to inactivity, **uploaded images and data saved in `pages.json` will be reset**.
>
> For a production environment, you should use AWS S3 for images and a database like MongoDB Atlas for data. However, this JSON implementation perfectly meets the requirements for academic or demonstration purposes.

## 📂 Project Structure

```text
qr-snap/
│
├── server.js            # Main application entry point
├── package.json         # Project dependencies
├── pages.json           # JSON Data Store
│
├── public/              # Static files
│   ├── css/
│   │   └── style.css
│   ├── uploads/         # User uploaded images
│
└── views/               # EJS Templates
    ├── index.ejs        # Landing page
    ├── create.ejs       # Creation form
    ├── page.ejs         # The generated mini-page
    └── result.ejs       # Success page with QR
