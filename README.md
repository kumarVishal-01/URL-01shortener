# URL Shortener

A simple Node.js app to convert long URLs into short links.

---

## Tech Stack

* Node.js
* Express

---

## Setup

```bash
git clone https://github.com/kumarVishal-01/URL-01shortener.git
cd URL-01shortener
npm install
npm start
```

---

## Usage

* Send a POST request to `/shorten` with a URL
* Open the short link in browser to redirect

## Deployment
---
### Deploy to Render

1.  **Push your code to GitHub.**
2.  **Go to [Render](https://render.com/)** and create a new Web Service.
3.  **Connect your GitHub repository.**
4.  Render will automatically detect the `render.yaml` file and configure the service.
5.  **Set Environment Variables**:
    - `MONGO_URI`: Your MongoDB connection string (from MongoDB Atlas).
    - `JWT_SECRET`: A secure random string (Render will generate one if you use the blueprint).
6.  **Deploy!**

---
## Note

`node_modules` is ignored in production.

---

## Author

Vishal Kumar
