# Fair Car Insurance Price Calculator

This project implements a complete web application that computes the “fair” price of a motor vehicle insurance policy in the Kingdom of Saudi Arabia and compares that price against five illustrative insurance companies: **Najm**, **TameenX**, **Aman**, **Wathiq** and **Sanad**.  The application is fully bilingual (Arabic/English) and modern in design, leveraging Bootstrap 5 for styling and responsive layout.

## Features

* **Input Form** – Collects vehicle model, year of manufacture, city, accident history and driver’s age.  The form is presented in Arabic by default with the option to switch to English.
* **Fair Price Calculation** – A simple formula derives a base “fair” price from the user’s input.  The price is bounded between **600** and **3000** SAR as required.
* **Five Sample Offers** – Once the fair price is calculated, the backend generates five offers by applying random modifiers (between −12 % and +18 %) to the fair price for the companies **Najm**, **TameenX**, **Aman**, **Wathiq** and **Sanad**.
* **Result Table** – Displays all offers in a table.  The cheapest offer is highlighted automatically.  Users can sort the table by company or price and filter the rows by company name.
* **Modern UI** – Built with Bootstrap 5, the interface adapts seamlessly to desktop and mobile devices and supports right‑to‑left layouts for Arabic.
* **REST API** – A simple Express.js backend provides a `/api/quote` endpoint that accepts JSON payloads and returns the fair price along with the five offers.

## Project Structure

```
fair-insurance-app/
├── server/           # Backend implementation (Node.js + Express)
│   ├── index.js      # API endpoints and price logic
│   └── package.json  # Node.js dependencies and start script
├── client/           # Frontend implementation (HTML/CSS/JS)
│   ├── index.html    # Main page with form and results table
│   └── app.js        # Language handling, form submission and table rendering
├── README.md         # Project overview and instructions
└── LOG.md            # Step‑by‑step build and deployment log (generated during development)
```

## Running Locally

You can run the project locally to test it before deployment.  Ensure you have Node.js installed.

1. **Install server dependencies**

   ```bash
   cd server
   npm install
   ```

2. **Start the backend**

   ```bash
   npm start
   ```

   The server listens on port `3000` by default.  You should see `Backend listening on port 3000` in your terminal.

3. **Open the frontend**

   Simply open the `client/index.html` file in your browser.  During local development, update the `BACKEND_URL` constant at the top of `client/app.js` to `http://localhost:3000`.

4. **Calculate prices**

   Fill in the form and click the **Calculate Price** button.  The table will display the fair price and offers from the five companies.  Use the header cells to sort the table or the search box to filter by company name.

## Deployment

To make the application publicly available, follow these steps:

1. **Publish the code to a public repository** (e.g. on GitHub or GitLab).
2. **Deploy the backend** to a free hosting provider such as Render, Railway or Fly.io.  These services can read your repository directly and build the Node.js server.  Ensure that the deployed API exposes a URL like `https://your-backend-service.onrender.com`.
3. **Update the `BACKEND_URL` constant** in `client/app.js` to point to your deployed backend URL.
4. **Deploy the frontend** using GitHub Pages or Vercel.  For GitHub Pages, enable the `Pages` feature on your repository and set the source to the `client` folder.  For Vercel, create a new project pointing to the `client` directory and choose a static site deployment.
5. **Test the live application** by navigating to the frontend URL and ensuring it communicates correctly with the backend.

## License

This project is released under the MIT license.
