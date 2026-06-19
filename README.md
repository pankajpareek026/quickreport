# 📊 QuickReport – Cryptocurrency Portfolio Tracker

[![GitHub last commit](https://img.shields.io/github/last-commit/pankajpareek026/quickreport)](https://github.com/pankajpareek026/quickreport/commits/main)
[![GitHub language count](https://img.shields.io/github/languages/count/pankajpareek026/quickreport)](https://github.com/pankajpareek026/quickreport)
[![GitHub top language](https://img.shields.io/github/languages/top/pankajpareek026/quickreport)](https://github.com/pankajpareek026/quickreport)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fquickreport.cyclic.app)](https://quickreport.cyclic.app)

**An intuitive and comprehensive web app for managing cryptocurrency portfolios.**  
Track the performance and profitability of your digital assets across exchanges like Binance and KuCoin – with real-time data updates, powerful analytics, and a user-friendly interface.[reference:0]

🔗 **Live Demo:** [quickreport.cyclic.app](https://quickreport.cyclic.app)[reference:1]

---

## 📌 Overview

QuickReport simplifies cryptocurrency portfolio management by allowing users to:

- **Manually insert** each transaction (Buy/Sell)
- **Upload transaction files** (CSV/JSON) – the system automatically parses transactions and displays them on your dashboard[reference:2]

Whether you're a casual investor or a active trader, QuickReport gives you clear visibility into your portfolio's performance.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **🔐 User Authentication** | Secure JWT-based authentication with bcrypt password hashing[reference:3] |
| **📝 Manual Transaction Entry** | Add Buy/Sell transactions manually with full control[reference:4] |
| **📤 Bulk File Upload** | Upload CSV/JSON files from Binance or KuCoin – automatic parsing[reference:5] |
| **📈 Real-time Portfolio Tracking** | Live updates on your portfolio performance[reference:6] |
| **💰 P&L Calculations** | Track profit and loss across all your assets[reference:7] |
| **🏦 Funding Management** | Deposit and withdraw funds with full tracking[reference:8] |
| **☁️ Cloud File Storage** | Secure file uploads via Cloudinary[reference:9] |
| **📊 Interactive Dashboard** | Visual analytics and portfolio overview[reference:10] |

---

## 🛠️ Tech Stack

### Frontend
- **Templating:** EJS (Embedded JavaScript)[reference:11]
- **Styling:** CSS[reference:12]
- **JavaScript:** Vanilla JS for client-side interactivity[reference:13]

### Backend
- **Runtime:** Node.js[reference:14]
- **Framework:** Express.js[reference:15]
- **Database:** MongoDB with Mongoose ODM[reference:16]
- **Authentication:** JWT with bcrypt password hashing[reference:17]

### Cloud Services
- **File Storage:** Cloudinary (free tier: 25GB)[reference:18][reference:19]
- **Database:** MongoDB Atlas (optional)[reference:20]

### APIs Integrated
- **[CoinMarketCap API](https://coinmarketcap.com/api/)** – Market data[reference:21]
- **[CoinGecko API](https://www.coingecko.com/en/api/documentation)** – Cryptocurrency data[reference:22]
- **[Binance API](https://github.com/binance/binance-spot-api-docs/blob/master/rest-api.md)** – Exchange integration[reference:23]

---

## 📁 Project Structure

```text
quickreport/
├── config/                     # Configuration files
│   ├── database.js             # MongoDB connection
│   └── cloudinary.js           # Cloudinary setup[reference:24]
├── models/                     # Mongoose models
│   ├── User.js                 # User schema
│   ├── Transaction.js          # Transaction schema
│   └── Funding.js              # Funding schema[reference:25]
├── controllers/                # Business logic
│   ├── authController.js       # Authentication handlers
│   ├── portfolioController.js  # Portfolio management
│   ├── fundingController.js    # Funding operations
│   ├── dashboardController.js  # Dashboard data
│   └── uploadController.js     # File upload handling[reference:26]
├── routes/                     # Route definitions
│   ├── authRoutes.js           # Auth endpoints
│   ├── portfolioRoutes.js      # Portfolio endpoints
│   ├── fundingRoutes.js        # Funding endpoints
│   ├── dashboardRoutes.js      # Dashboard endpoints
│   ├── uploadRoutes.js         # Upload endpoints
│   └── indexRoutes.js          # Main routes[reference:27]
├── middleware/                 # Custom middleware
│   ├── auth.js                 # JWT authentication
│   └── validation.js           # Input validation[reference:28]
├── views/                      # EJS templates[reference:29]
├── services/                   # External service integrations[reference:30]
├── public/                     # Static assets[reference:31]
├── Images/                     # Screenshots and assets[reference:32]
├── app.js                      # Main application entry[reference:33]
├── .env                        # Environment variables (create this)
├── package.json                # Project dependencies
└── README.md                   # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** – v14 or higher[reference:34]
- **MongoDB** – local instance or MongoDB Atlas[reference:35]
- **Cloudinary** account – free tier available[reference:36]

### Environment Variables

Create a `.env` file in the root directory with the following variables[reference:37]:

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `7000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/quickreport` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `your_secure_jwt_secret_key` |
| `SESSION_SECRET` | Secret key for sessions | `your_secure_session_secret_key` |
| `EMAIL_USER` | Email for verification | `your_email@gmail.com` |
| `EMAIL_PASS` | Email app password | `your_app_password` |
| `CMC_API_KEY` | CoinMarketCap API key (optional) | `your_coinmarketcap_api_key` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `your_api_key` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your_api_secret` |

> ⚠️ **Never commit the `.env` file.** Add it to `.gitignore` to keep your secrets safe.

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:pankajpareek026/quickreport.git
   cd quickreport[reference:38]
   ```

2. **Install dependencies**
   ```bash
   npm install[reference:39]
   ```

3. **Set up environment variables**
   - Create a `.env` file in the root directory
   - Add all required variables (see table above)[reference:40]

4. **Configure MongoDB**

   **Option 1: Local MongoDB**[reference:41]
   - Install MongoDB locally
   - Start MongoDB service
   - Use: `mongodb://localhost:27017/quickreport`

   **Option 2: MongoDB Atlas (Recommended)**[reference:42]
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a cluster
   - Get your connection string
   - Use: `mongodb+srv://username:password@cluster.mongodb.net/quickreport`

5. **Configure Cloudinary**[reference:43]
   - Sign up at [Cloudinary](https://cloudinary.com) (free tier: 25GB)
   - Get credentials from your Dashboard
   - Add to `.env` file
   - See [CLOUDINARY_SETUP.md](https://github.com/pankajpareek026/quickreport/blob/main/CLOUDINARY_SETUP.md) for detailed instructions

6. **Start the server**
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev[reference:44]
   ```

7. **Access the application**
   - Open your browser and navigate to `http://localhost:7000` (or your configured PORT)

---

## 📖 Documentation

- **[Migration Guide](https://github.com/pankajpareek026/quickreport/blob/main/MIGRATION_GUIDE.md)** – Complete migration documentation[reference:45]
- **[Cloudinary Setup](https://github.com/pankajpareek026/quickreport/blob/main/CLOUDINARY_SETUP.md)** – Cloudinary configuration guide[reference:46]
- **[Changelog](https://github.com/pankajpareek026/quickreport/blob/main/CHANGELOG.md)** – Version history and changes[reference:47]

---

## 🔒 Security Features

- **Password hashing** – bcrypt for secure password storage[reference:48]
- **JWT-based authentication** – Stateless, secure token-based auth[reference:49]
- **Environment variable configuration** – All secrets stored in `.env`[reference:50]
- **Input validation** – All user inputs validated before processing[reference:51]
- **Secure file uploads** – Validated and sanitized file handling[reference:52]

---

## 📸 Screenshots

- **Home Page** – Landing and overview[reference:53]
- **Dashboard** – Portfolio performance and analytics[reference:54]
- **Transactions Detail** – Complete transaction history[reference:55]
- **User Profile** – Account management[reference:56]

---

## 📦 Deployment

This project can be deployed to any Node.js hosting platform.

### Deploy on Render / Cyclic / Heroku

1. Push your code to a GitHub repository
2. Set the required environment variables in your hosting platform
3. Use the following commands:
   ```bash
   npm install
   npm start
   ```

### Live Demo

The application is live at: [quickreport.cyclic.app](https://quickreport.cyclic.app)[reference:57]

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve this project:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code adheres to the existing style and includes relevant documentation updates.

---

## 📄 License

This project is licensed under the **ISC License**[reference:58].

---

## 👤 Author

**Pankaj Pareek**[reference:59]

- GitHub: [pankajpareek026](https://github.com/pankajpareek026)
- Project Link: [https://github.com/pankajpareek026/quickreport](https://github.com/pankajpareek026/quickreport)

---

## 🙏 Acknowledgements

- [Node.js](https://nodejs.org/) – JavaScript runtime
- [Express.js](https://expressjs.com/) – Web framework
- [MongoDB](https://www.mongodb.com/) – Database
- [Mongoose](https://mongoosejs.com/) – MongoDB ODM
- [JWT](https://jwt.io/) – JSON Web Tokens
- [Cloudinary](https://cloudinary.com/) – Cloud file storage
- [CoinMarketCap API](https://coinmarketcap.com/api/) – Market data
- [CoinGecko API](https://www.coingecko.com/en/api/documentation) – Crypto data
- [Binance API](https://github.com/binance/binance-spot-api-docs/blob/master/rest-api.md) – Exchange integration

---

## 🏷️ Topics

`nodejs` `javascript` `express` `mongodb` `mongoose` `jwt-authentication` `cryptocurrency` `portfolio-tracker` `binance-api` `coingecko-api` `coinmarketcap-api` `cloudinary` `ejs` `css`[reference:60]
