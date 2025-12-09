
# Quick Report                                                                                   

This is a cryptocurrency portfolio tracker through which users can track the performance (P&L) of their digital assets by inserting each transaction manually or users can upload the transactions file (CSV/JSON File). The system will automatically parse transactions from the file and appear on the user's dashboard.

[Live](https://quickreport.cyclic.app)

## 🚀 Features

- ✅ User authentication with JWT
- ✅ Manual transaction entry (Buy/Sell)
- ✅ Bulk file upload (CSV/JSON from Binance/KuCoin)
- ✅ Real-time portfolio tracking
- ✅ P&L calculations
- ✅ Funding management (Deposit/Withdraw)
- ✅ Cloud file storage with Cloudinary
- ✅ MongoDB database

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (free tier available)

## 🛠️ Installation

### 1. Clone the project

```bash
git clone git@github.com:pankajpareek026/quickreport.git
cd quickreport
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Server
PORT=7000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/quickreport
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quickreport

# JWT & Session
JWT_SECRET=your_secure_jwt_secret_key
SESSION_SECRET=your_secure_session_secret_key

# Email (for verification)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# APIs (optional)
CMC_API_KEY=your_coinmarketcap_api_key

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Start the server

```bash
npm start
# or for development with auto-reload
npm run dev
```

## 📁 Project Structure

```
quickreport/
├── config/              # Configuration files
│   ├── database.js      # MongoDB connection
│   └── cloudinary.js    # Cloudinary setup
├── models/              # Mongoose models
│   ├── User.js
│   ├── Transaction.js
│   └── Funding.js
├── controllers/         # Business logic
│   ├── authController.js
│   ├── portfolioController.js
│   ├── fundingController.js
│   ├── dashboardController.js
│   └── uploadController.js
├── routes/              # Route definitions
│   ├── authRoutes.js
│   ├── portfolioRoutes.js
│   ├── fundingRoutes.js
│   ├── dashboardRoutes.js
│   ├── uploadRoutes.js
│   └── indexRoutes.js
├── middleware/          # Custom middleware
│   ├── auth.js
│   └── validation.js
├── views/               # EJS templates
└── app.js               # Main application
```

## 🔧 Configuration

### MongoDB Setup

**Option 1: Local MongoDB**
- Install MongoDB locally
- Start MongoDB service
- Use: `mongodb://localhost:27017/quickreport`

**Option 2: MongoDB Atlas (Recommended)**
- Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster
- Get connection string
- Use: `mongodb+srv://username:password@cluster.mongodb.net/quickreport`

### Cloudinary Setup

1. Sign up at [Cloudinary](https://cloudinary.com) (free tier: 25GB)
2. Get credentials from Dashboard
3. Add to `.env` file

See [CLOUDINARY_SETUP.md](CLOUDINARY_SETUP.md) for detailed instructions.

## 📚 Documentation

- [Migration Guide](MIGRATION_GUIDE.md) - Complete migration documentation
- [Cloudinary Setup](CLOUDINARY_SETUP.md) - Cloudinary configuration guide
- [Changelog](CHANGELOG.md) - Version history and changes


# Screenshots
**Home page**

![App Screenshot](https://i.ibb.co/B3fVnR8/Home.png)


**DashBoard**

![DashBoard](https://i.ibb.co/8X3MJdr/dashboard.png)

**Transactions Detail**

![Transaction Detail](https://i.ibb.co/5BMf37Z/transaction.png)

**User**

![User](https://i.ibb.co/GkYT2ts/user.png)


## 🛠️ Tech Stack

**Frontend:**
- HTML, CSS, JavaScript
- EJS templating engine

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing

**Cloud Services:**
- Cloudinary (file storage)
- MongoDB Atlas (optional)

**APIs:**
- [CoinMarketCap API](https://coinmarketcap.com/api/)
- [CoinGecko API](https://www.coingecko.com/en/api/documentation)
- [Binance API](https://github.com/binance/binance-spot-api-docs/blob/master/rest-api.md)

## 🔐 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Environment variable configuration
- Input validation
- Secure file uploads

## 📝 License

ISC

## 👤 Author

Pankaj Pareek


