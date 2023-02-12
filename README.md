
# Quick Report

This is a cryptocurrency portfolio tracker through which users can track the performance (P&L) of their digital assets by inserting each transaction manually or users can upload the transactions file (CSV File). the system will automatically parse transactions from the file and appear on the user's dashboard.


## Run Locally

Clone the project

```bash
  git clone git@github.com:pankajpareek026/quickreport.git
```

Go to the project directory

```bash
  cd quickreport
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

# Change Database configration 

```javascript
var mysql = require('mysql2');
var conn = mysql.createPool({
    host: <your host location>,
    user: <Your Database username>,
    password: <Your Database password>,
    database: <Your Database Name>,
    connectTimeout:28800
})

module.exports = conn;  
```


# Screenshots
**Home page**

![App Screenshot](https://i.ibb.co/B3fVnR8/Home.png)


**DashBoard**

![DashBoard](https://i.ibb.co/8X3MJdr/dashboard.png)

**Transactions Detail**

![Transaction Detail](https://i.ibb.co/5BMf37Z/transaction.png)

**User**

![User](https://i.ibb.co/GkYT2ts/user.png)


