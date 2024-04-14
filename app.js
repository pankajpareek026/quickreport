import express from 'express';
import dotenv from 'dotenv'
dotenv.config()
const JWT_KEY = config.jwtKey
import connectDB from './config/connection.js';

connectDB()// establish database connection

// console.log("Jwt key :", JWT_KEY)

import cookieParser from 'cookie-parser';
import path from 'path';
import nodemailer from 'nodemailer';
import bodyparser from 'body-parser';
import expressSession from 'express-session';
import parseCryptoPair from './src/utils/parseCryptopair.utils.js';
import ErrorHandler from './src/middlewares/apiError.middleware.js';
import { authRouter } from './src/routes/authRoutes.route.js';
import { portfolioRouter } from './src/routes/portfolioRoutes.route.js';
import { AssetSpaceRouter } from './src/routes/assetSpaceRoutes.route.js';
import { financeRouter } from './src/routes/financeRoutes.route.js';
import { config } from './config/config.js';


var PORT = config.port || 7000


const app = express();
app.use(express.json());
app.use(bodyparser.json());
app.use(cookieParser())
app.use(
  bodyparser.urlencoded({
    extended: true,
  })
);



// routes 
app.use(authRouter)
app.use(portfolioRouter)
app.use(AssetSpaceRouter)
app.use(financeRouter);



// var name;
// app.get('/update', Authentication, (req, res) => {
//   const user = req.auth.User;
//   console.log("authy= =>", req.auth)
//   if (user) {
//     var Id = req.query.id;
//     console.log("COIN ID :", Id)
//     var updateQuery = `SELECT *FROM ${user}_portfolio WHERE ID=${Id}`
//     try {

//       cnn.query(updateQuery, (err, result) => {
//         if (err) console.log(err)
//         else {
//           console.log(result)
//           res.render(__dirname + '/views/update', { result });
//         }
//       })
//     }
//     catch (error) {
//       console.log(error)
//     }
//     // res.render(__dirname + '/update', { result });
//   }
//   else {
//     res.redirect('/login')
//   }
// })

// app.post('/update', Authentication, (req, res) => {
//   const user = req.auth.User
//   if (user) {
//     var coinname = req.body.coinName;
//     var ordertype = req.body.ordertype;
//     var id = req.body.id;
//     var price = req.body.price;
//     var sellcost;
//     if (price < 0.0001) {
//       price = parseFloat(price).toFixed(6);
//     } else {
//       price = parseFloat(price).toFixed(3);
//     }
//     var unit = req.body.units;
//     var total = req.body.totals;
//     if (total < 0.0001) {
//       total = parseFloat(total).toFixed(6);
//     } else {
//       total = parseFloat(total).toFixed(2);
//     }
//     if (ordertype == "SELL") {
//       unit = 0 - unit;
//       sellcost = total;
//       total = 0


//     } else {
//       unit = unit;
//       sellcost = 0
//     }
//     // `CREATE TABLE portfolio(ID INT AUTO_INCREMENT KEY ,Coin_Name VARCHAR(10),ORDER_TYPE VARCHAR(10), PRICE VARCHAR(50),UNITS VARCHAR(50),TOTAL_COST VARCHAR(50),SELL_COST VARCHAR(50))`;
//     var updatepost = `update ${user}_portfolio set Coin_Name='${coinname}',ORDER_TYPE='${ordertype}',PRICE='${price}',UNITS='${unit}',TOTAL_COST='${total}' ,SELL_COST='${sellcost}' where ID= ${id}`
//     // console.log(updatepost)
//     try {
//       cnn.query(updatepost, (err, result) => {
//         if (err) console.log(err)
//         res.redirect(`/Transactions?Asset='${coinname}'`)
//       })
//     } catch (error) {

//     }

//   }
//   else {
//     res.redirect('/login')
//   }
// })
// app
// //register start
// app.get('/user', Authentication, async (req, res) => {
//   const user = req.auth.User
//   // console.log(user)

//   if (user) {
//     try {

//       cnn.query(`select *from newUsers WHERE username='${user}'`, (err, result) => {
//         if (err) console.log(err)
//         else {
//           result && res.render(__dirname + "/views/already", {
//             username: result[0].username, userEmail: result[0].emailid, name: result[0].name, Current_Value, invested, b, Dj: result[0].JoiningDAte

//           })

//         }
//       })
//     } catch (error) {
//       console.log(error)
//     }
//     // console.log("A :",a)

//   }
//   else {
//     // var tables;
//     // DbOperationsForRegister(req, res)

//     res.render("register")
//   }
// })
// app.get('/register', showRegisterPage)




// var i = 0, otp, status;
// // Login Rout
// var Users_name




// app.get("/login", showLoginPage)
// var usernameorEmail;




// app.post("/login", loginUser)

// app.get("/portfolio", Authentication, showAddBuySellPage);





// app.post("/portfolio", Authentication, addBuySellTransaction)
// //Funding route start
// app.get('/funding', Authentication, showAddFundingPage)
//   /

//   app.get('/News', (req, res) => {
//     res.render("news")
//   })



// to add transaction in funding table ---start
// app.post('/funding', Authentication, addFundingTransaction)
// app.post('/funding', Authentication, (req, res) => {
//   // console.log(req.body)
//   const user = req.auth.User
//   var Amount = req.body.amount;
//   var Ttype = req.body.type;
//   var Tdiscription = req.body.Discription;
//   var Tdate = req.body.date;
//   if (Ttype == 'withdraw') {
//     Amount = 0 - Amount;
//   }
//   console.log(Amount, Ttype, Tdiscription, Tdate)

//   try {
//     cnn.query(`insert into ${user}_funding(amount,type, discription,date) values(${Amount},'${Ttype}','${Tdiscription}','${Tdate}')`, (err, result) => {
//       if (err) console.log(err)
//       res.render('Fresponse')
//     })
//   } catch (error) {
//     console.log(error)
//     res.json({ Error: error })
//   }

// })
// to add transaction in funding table ---End


//Funding route End
// OTP varification start
// var sqlqr





// Route to reset All Transaction Of the user
// app.get('/reset', Authentication, (req, res) => {
//   const user = req.auth.User
//   if (user) {
//     try {
//       cnn.query(`truncate table ${user}_portfolio`, (err, result) => {
//         if (err) console.log(err)
//         res.redirect('/dash-bord')
//       })
//     } catch (error) {
//       console.log(error)
//       res.json({ Error: "internal Server Error ", message: error })
//     }
//   }
//   else {
//     res.redirect('/login')
//   }
// })







// to reset all transactions in funding tabel
// app.get('/resetF', Authentication, (req, res) => {
//   const user = req.auth.User
//   if (user) {
//     try {
//       cnn.query(`Truncate table ${user}_funding`, (err, result) => {
//         if (err) console.log(err)
//         res.redirect('/dash-bord')
//       })
//     } catch (error) {
//       console.log(error)
//       res.json({ Error: "internal Server Error ", message: error })
//     }
//   }
//   else {
//     res.redirect('/login')
//   }
// })




// route to verify the Email Address of the User
// app.get('/v', Authentication, (req, res) => {
//   console.log("V route Hitted @")
//   const user = req.auth.User
//   function DbOperationAfterVarification() {
//     try {
//       var tbl = `CREATE TABLE ${user}_portfolio(ID INT AUTO_INCREMENT KEY,TIME VARCHAR(50) ,Coin_Name VARCHAR(10),ORDER_TYPE VARCHAR(10), PRICE VARCHAR(50),UNITS VARCHAR(50),TOTAL_COST VARCHAR(50),SELL_COST VARCHAR(50))`;
//       var tbl2 = `create table ${user}_funding(ID INT AUTO_INCREMENT KEY , amount varchar(50),type varchar(50),discription varchar (500), date varchar(50)) `
//       cnn.query(tbl, (err, result) => {
//         if (err) console.log(err)
//         cnn.query(tbl2, (err, result) => {
//           if (err) console.log(err)
//         })
//       })
//     } catch (error) {
//       console.log(error)
//       res.json({ Error: "internal Server Error ", message: error })
//     }
//   }
//   if (user) {
//     try {
//       cnn.query(`update newUsers SET sts=1 where username='${user}'`, (e, result) => {
//         if (e) {
//           console.log(e)

//           res.render("Err404")
//         } else {

//           if (result.affectedRows == 1) {
//             DbOperationAfterVarification();
//             res.render("EmailSuccess")
//           }
//         }

//       })
//     } catch (error) {
//       console.log(error)
//       res.json({ Error: "internal Server Error ", message: error })
//     }
//   }
//   else {
//     res.redirect('/login')
//   }
// })




// app.get('/emailvarification', Authentication, async (request, response) => {
//   const user = request.auth.User
//   if (user) {
//     try {
//       cnn.query(`select emailid , sts from newUsers WHERE username='${user}'`, (err, result) => {
//         if (err) console.log(err)
//         else {
//           const status = result[0].sts
//           const mail = result[0].emailid
//           setTimeout(() => {
//             if (status) {
//               response.redirect('/dash-bord')
//             }
//             else {
//               let mailTransporter = nodemailer.createTransport({
//                 service: "gmail",
//                 auth: {
//                   user: "noreplay.quickreport@gmail.com",
//                   pass: "aylxdrwizbwszpbw"
//                 }
//               })
//               otp = Math.floor(100000 + Math.random() * 900000);
//               var emailTime = new Date()
//               let details = {
//                 Form: "noreplay.quickreport@gmail.com",
//                 to: mail,
//                 subject: "Email Varification",
//                 text: `Welcome To Quick Report `,
//                 html: `<body style="font-family:'Source Serif 4', sans-serif;">
//             <b
//                 style="color:rgb(7, 7, 7) ;margin-bottom: 0px;margin-top: 25px; ;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
//                 welcome , <p
//                     style="font-family:'Source Serif 4', sans-serif; color: rgb(13, 213, 248);margin:2px;font-weight: 300;">
//                     ${name}</p>
//            </b>
//             <br>
//             <div style="text-align:left;">
//                 <P style="color:rgb(17, 17, 17) margin :0px; font-size: small; text-align: left; font-weight: 500; font-size: large;">
//                     Registration Was Successfull please verify your
//                     email address !</P>
//                 <p style="font-family:'Source Serif 4',font-weight:100px sans-serif;"> Your Email Varification Code</p>
//                 <p style="font-size: xx-large; color:#f88605; font-weight:bold;  ">
//                     ${otp}
//                 </p>
//                 <p style="text-align: left; font-weight: 900;color: rgb(6, 6, 6); font-size: large;">Regards </p>
//                 <p style="text-align: left; color: #3b3b3a; margin-top:-15px ;margin-left: 15px;">Team QuickReport </p>
//                 <p style="text-align:right">${emailTime}</p>
//                 <hr>
//                 <p style="text-align: center; font-weight:900;">Powered By OrangeDevs</p>
//             </div>
//         </body>`
//               }
//               mailTransporter.sendMail(details, (err) => {
//                 if (err) {
//                   console.log(err)
//                 }
//                 else {
//                   response.render("Emailvarify", { otp, userEmail: mail })
//                 }
//               })
//               // response.send(`OTP:${otp}`)
//             }
//           }, 2000);
//         }
//       })
//     } catch (error) {
//       console.log(error)
//       res.json({ Error: "internal Server Error ", message: error })
//     }
//   }
//   else {
//     response.redirect('/')
//   }
// })
//Varification end






// logout user from application
const sts = false;
// app.get("/logout", Authentication, (req, res) => {
//   const user = req.auth.User
//   res.clearCookie('AUTH')
//   res.render("logout");
// });
//logout END








//upload file -- 
// app.get('/upload', Authentication, (req, res) => {
//   const user = req.auth.User
//   if (!user) {
//     res.redirect('/login')
//   }
//   else {
//     res.render("uploadFile")
//   }
// })



// app.post('/upload', Authentication, fileUpload.single('transactionFile'), processUploadedFile)
// Process the uploaded file 
// app.post('/upload', Authentication, (req, res) => {
//   const user = req.auth.User
//   var CSVfinalArray = []
//   if (req.files) {
//     var file = req.files.Tfile
//     var fileName = file.name
//     console.log(fileName)
//     var fileNewName = Math.floor(Math.random() * 1000) + fileName
//     file.mv('./upload/' + fileNewName, (err) => {
//       if (err) {
//         console.log(err)
//       }
//       else {
//         var FileExtenson = path.extname(fileNewName);
//         if (FileExtenson == ".json") {
//           ReadJSONFile(fileName, res);
//         }
//         else if (FileExtenson == ".csv") {
//           console.log("FIle IS CSV")
//           ReadCSVFile(file)
//           function CSVResponse(transactions) {
//             res.render(__dirname + "/views/uploadresponse", { transactions, file })
//             console.log(file)
//           }
//         }

//         var file = req.body.Tfile
//         var FileExtenson = path.extname(fileNewName);

//         if (FileExtenson == ".csv") {
//           console.log("FIle IS CSV")
//           ReadCSVFile(file);
//           function CSVResponse(transactions) {
//             res.render(__dirname + "/views/uploadresponse", { transactions, file: fileName })
//             console.log(fileName)
//           }
//         }

//         console.log(FileExtenson)

//         function ReadCSVFile(filename, res, req) {
//           // transaction format 
//           /*

//          UID,Account Type,Order ID,Order Time(UTC+05:30),Symbol,Side,Order Type,Order Price,Order Amount,Avg. Filled Price,Filled Amount,Filled Volume,Filled Volume (USDT),Filled Time(UTC+05:30),Fee,Fee Currency,Status
// --------------------------- FOR KUCOIN ------------------------------------------------
//          orderTime :time of order execution 
//          Symbol : coin pair like BTC-USDT
//          Side : order type like buy / sell
//          Avg. Filled Price : order execution price of coin
//          Filled Amount : No. of coin buyed or selled
//          Filled Volume (USDT) : amount of base currency converted into usdt 
//          Filled Volume : amount of base currency
//          Fee :Transaction fees
//          Fee Currency :fees paid in which currency 
// ---------------------------------------------------------------------------------------


// "Date(UTC)","Pair","Side","Price","Executed","Amount","Fee"
// ----------------------------------For Binance -----------------------------------------------------
//         Date(UTC) :transactio execution time
//         Pair: BTCUSDT
//         Side :Buy /sell
//         Price : price of coin at time of order execution 
//         Executed : No. of coins buyed or selled format (90.2000000000VET)
//         Amount : amount of base currency  format (90.2000000000USDT)
//         fee :amout of fees

// ---------------------------------------------------------------------------------
//            */
//           const csvfilepath = `./upload/${fileNewName}`
//           var AssetSymbol = []
//           let RemoveUSDT, assetprice, filledunits, buycost, time;
//           var sellcost = 0, orderside;

//           csvtojson({ flatKeys: true })
//             .fromFile(csvfilepath)
//             // .then((data)=>JSON.parse(data))
//             .then((JsonDATA) => {

//               for (var object of JsonDATA) {

//                 Symbol = (object?.Symbol) ? object?.Symbol : object["Spot Pairs"] ? object["Spot Pairs"] : object.Pair;
//                 Symbol = Symbol.toUpperCase()
//                 time = (object["Time(UTC+05:30)"]) ? object["Time(UTC+05:30)"] : object["Filled Time (Local Time)"] ? object["Filled Time (Local Time)"] : object["Date(UTC)"]
//                 // coin pair / symbol
//                 // console.log("symbol :", Symbol)
//                 assetprice = (object?.Price) ? object.Price : object["Filled Price"] ? object["Filled Price"] : object['Avg. Filled Price'] // price of coin at the time of buying
//                 assetprice = parseFloat(assetprice);
//                 // console.log("buyPrice :", assetprice)

//                 filledunits = (object?.Executed) || object?.Executed || object?.["Filled Quantity"] || object?.["Filled Quantity"] || object?.['Filled Amount'] // quantity of coin you Buy or Sell
//                 filledunits = parseFloat(filledunits);
//                 // console.log("units  :", filledunits)
//                 // quantity of coin you Buy or Sell

//                 orderside = object?.Side || object?.Side || object?.["Direction"] || object?.["Direction"] || object?.Side // type of order BUY/SELL
//                 orderside = orderside.toUpperCase() // type of order BUY/SELL
//                 // console.log("side :", orderside)
//                 buycost = object?.Amount || object.Amount || object?.["Filled Value"] || object?.["Filled Value"] || object?.['Filled Volume']  // amout of base currency / amount of USDT/BTC/BUSD/USDC paid for coin

//                 buycost = parseFloat(buycost) // amout of base currency / amount of USDT/BTC/BUSD/USDC paid for coin
//                 // if (Symbol != "POLX-USDT" && Symbol != "ARNM-USDT" && Symbol != "WOOP-USDT" && Symbol != "USDT-USDC" && Symbol != "USDC-USDT" && Symbol != "OXT-USDT" && Symbol != "ARMN-USDT" && Symbol != "MLS-USDT" && Symbol != "AFK-USDT" && Symbol != "KCS-USDT" && Symbol != "VR-USDT" && Symbol != "ONSTON-USDT" && Symbol != "GMM-USDT" && Symbol != "XCN-USDT" && Symbol != "WAXP-USDT" && Symbol != "RSR-USDT" && Symbol != "MLS-USDT" && Symbol != "GALAX-USDT" && Symbol != "BLOK-USDT" && Symbol != "EWT-USDT" && Symbol != "CTSI-USDT" && Symbol != "CWEB-USDT" && Symbol != "KDA-USDT" && Symbol != "UTK-USDT" && Symbol != "WAX-USDT" && Symbol != "MOVR-USDT" && Symbol != "VIDT-USDT") {
//                 const newSymbol = parseCryptoPair(Symbol).newPair

//                 // console.log("newSymbol :::=>>", newSymbol, "oldSymbol :::=> ", Symbol)
//                 AssetSymbol.push(newSymbol)
//                 // console.log(AssetSymbol)
//                 if (orderside == "SELL" || orderside == "Sell" || orderside == "sell") {
//                   sellcost = parseFloat(buycost) // 
//                   buycost = parseInt(0) //buy cost will be 0
//                   filledunits = 0 - parseFloat(filledunits) //
//                 }
//                 else {

//                   sellcost = parseFloat(0)
//                   buycost = parseFloat(buycost)
//                   filledunits = parseFloat(filledunits)
//                 }
//                 var CSVlocalArray = [];
//                 CSVlocalArray.push(time, `${newSymbol}`, `${orderside}`, assetprice, filledunits, buycost, sellcost)
//                 // console.table(CSVlocalArray)
//                 CSVfinalArray.push(CSVlocalArray)
//                 // console.table(CSVfinalArray)
//                 // console.table(CSVlocalArray)
//                 // console.table(CSVfinalArray)

//               }
//               // console.table(CSVfinalArray)

//               setTimeout(() => {
//                 var Sqcsv = `INSERT INTO ${user}_portfolio  (TIME,Coin_Name,ORDER_TYPE,PRICE,UNITS,TOTAL_COST,SELL_COST ) VALUES ?`
//                 cnn.query(Sqcsv, [CSVfinalArray], (err, result) => {
//                   if (err) console.log(err)
//                   console.log("SQL RESPONSE FROM CSV FUNCTION :", result)
//                 })
//                 CSVResponse(CSVfinalArray.length);
//               }, 3000)
//               // console.log(JsonDATA)

//             })


//         }
//       }
//     })
//   }
// })
// app.post('/upload', Authentication, uploadController)
//upload end
//----End---

var emailid
var username
var name



// app.post("/register", (req, res) => {
//   var jdate = new Date()
//   var JoinningDAte = jdate.toString()
//   JoinningDAte = JoinningDAte.replace("GMT+0530 (India Standard Time)", "");
//   username = req.body.userName;
//   name = req.body.Name;
//   emailid = req.body.emailId;
//   var password = req.body.password;
//   try {
//     sqlqr = `insert into newUsers values('${username}','${name}' ,'${emailid}',${sts},'${password}','${JoinningDAte}')`
//     cnn.query(sqlqr, (err, result) => {
//       if (err) throw err;
//       res.render(__dirname + "/views/Rresponse", { name })
//     })
//   } catch (error) {
//     console.log(error)
//     res.json({ Error: "internal Server Error ", message: error })
//   }
// });

// app.post('/register', registerUser)

// app.get("/", (req, res) => {
//   res.render("index");
// });

// const validateCoinName = (req, res, next) => {
//   if (!req.query.Asset) {
//     res.redirect('/dash-bord')
//   }
//   else {
//     next()
//   }
// }
//--Start---Route for get detail for all transaction of a perticulor coin

// app.get('/resetAll', Authentication, (req, res) => {
//   const user = req.auth.User
//   if (user) {
//     try {
//       cnn.query(`truncate table ${user}_funding `, (err, result) => {
//         if (err)
//           console.log(err)
//         cnn.query(`truncate table ${user}_portfolio `, (err, result) => {
//           if (err) console.log(err)
//           if (result > 0) {
//             response.redirect('/dash-bord')
//           }
//         })
//       })
//     } catch (error) {
//       console.log(error)
//       res.json({ Error: "internal Server Error ", message: error })
//     }
//     res.redirect('/dash-bord')
//   }
//   else {
//     res.redirect('/login')
//   }
// })

// const deleteWare = (req, res, next) => {
//   if (!res.coinSym) {
//     res.redirect('/dash-bord')
//   }
//   else {
//     next()
//   }

// }




// app.get('/about', (req, res) => {
//   res.render("about")
// })



// app.get('/Transactions', Authentication, validateCoinName, (req, res) => {
//   // console.log(req.query)
//   const coinName = req.query.Asset
//   const user = req.auth.User
//   if (user) {
//     cnn.query(`select *from ${user}_portfolio where Coin_Name=${coinName}`, (err, result) => {
//       // console.table(result)
//       if (err) console.log(err)
//       try {
//         if (result.length > 0) {
//           // console.log(req.query.Asset)
//           var Asset_Name = (req.query.Asset)
//           // console.log("Asset_Name :", Asset_Name)
//           // var coinSymbol = Asset_Name.substring(Asset_Name.length - 5, 1)
//           var ImageSrc;
//           var CurrenPrice;
//           var ChangeIn7D;
//           var ChangeIn30D;
//           var ChangeIn60D;
//           var ChangeIn90D;
//           let Avp, ChangeIn24H
//           let CMCDATA;
//           var { coinId, base } = parseCryptoPair(Asset_Name)
//           // console.log("coinid :", coinId)
//           var CmcName;
//           var CmcSymbol;
//           var PnlArray = [];
//           var TotalPNLP;
//           var volume = 0;

//           coinGecko(coinId)
//           async function coinGecko(id) {

//             await axios(`https://api.coingecko.com/api/v3/coins/${id}?localization=false&community_data=false&developer_data=false`)
//               .then((response) => {
//                 return response.data;
//               })
//               .then((FinalData) => {
//                 console.log("final Data =>", FinalData)
//                 ImageSrc = FinalData.image.large;
//                 CurrenPrice = FinalData.market_data.current_price[base]
//                 ChangeIn24H = FinalData.market_data.price_change_percentage_24h
//                 ChangeIn24H = FinalData.market_data.price_change_percentage_24h
//                 ChangeIn7D = FinalData.market_data.price_change_percentage_7d
//                 ChangeIn30D = FinalData.market_data.price_change_percentage_30d
//                 ChangeIn60D = FinalData.market_data.price_change_percentage_60d
//                 ChangeIn90D = FinalData.market_data.price_change_percentage_1y
//                 CmcName = FinalData.name
//                 CmcSymbol = (FinalData.symbol).toUpperCase()
//                 // console.log(CurrenPrice)
//                 let AvpQuery = `select SUM(UNITS) AS UnitTotal,Sum(TOTAL_COST) AS CostTotal from ${user}_portfolio where Coin_Name=${Asset_Name} AND ORDER_TYPE="BUY"`
//                 cnn.query(AvpQuery, (err, Avpresult) => {
//                   if (err) console.log(err)
//                   console.log("avp=>>>", Avpresult)
//                   const { CostTotal, UnitTotal } = Avpresult[0]
//                   Avp = parseFloat(CostTotal / UnitTotal)
//                   console.log("units=>>>", UnitTotal)
//                   console.log("cost=>>>", CostTotal)
//                   cnn.query(`select *from ${user}_portfolio where Coin_Name=${Asset_Name}`, (err, results) => {
//                     if (err) console.log(err)
//                     var holding = 0


//                     // console.log(results)

//                     for (var u = 0; u < results.length; u++) {
//                       if (results[u].UNITS < 0) {   // Start To calculte the volume (BUY +Sell) of the asset 

//                         var unt = results[u].UNITS * -1
//                         volume = parseFloat(volume) + parseFloat(unt)

//                       }
//                       else {

//                         volume = parseFloat(volume) + parseFloat(results[u].UNITS)

//                       } //END
//                       holding = holding + parseFloat(results[u].UNITS);

//                       if (results[u].ORDER_TYPE == "BUY" || results[u].ORDER_TYPE == "buy") {

//                         var Detailspnl;
//                         Detailspnl = parseFloat(((CurrenPrice - results[u].PRICE) / results[u].PRICE) * 100)
//                         PnlArray.push(Detailspnl);

//                       }
//                     }
//                     TotalPNLP = ((CurrenPrice - Avp) / Avp) * 100
//                     TotalPNLD = parseFloat((100 + TotalPNLP * Avp) / 100)
//                     // console.log("AVERage price ::", Avp)
//                     // console.log("volume= =================", volume)
//                     res.render(__dirname + "/views/Details", {
//                       results, holding, ImageSrc, CurrenPrice, FinalData, CMCDATA, ChangeIn24H, ChangeIn30D, ChangeIn7D, ChangeIn60D, ChangeIn90D, Avp, CmcName, CmcSymbol, TotalPNLP, SumInvested: Avpresult[0].CostTotal, Asset_Name, base, volume
//                     })
//                   })
//                 })
//               });
//           }
//         }
//         else {
//           res.redirect('/dash-bord')
//         }
//       } catch (error) {
//         console.log(error)
//         res.json({ Error: "internal Server Error ", message: error })
//       }
//     })
//   }
//   else {
//     res.redirect('/login')
//   }
// })

//Dash-Bord START------------------->
// var Current_Value
// var b; // for funding balance
// var invested = 0;

// app.get("/dash-bord", Authentication, async (req, res) => {
//   // console.log("username-AUTH :", req.auth.User)
//   const user = req.auth.User;
//   console.log("username :", user)
//   try {
//     function DbOperationsForDashbord(user, req, res) { //function for database operation for dashBord route  ----START-----
//       Current_Value = 0
//       // fetch all data of funding table
//       cnn.query(`select *from ${user}_funding`, (err, fundingResult) => {
//         if (err) console.log("Err At switching database for Funding Table ==> ", err)
//         console.log(fundingResult)



//         cnn.query(`select SUM(amount) as balance from ${user}_funding`, (err, Fbalance) => {
//           if (err) console.log(err)
//           b = Fbalance?.[0]?.balance;
//           /*
//           1. findout coinid and base for all coins form database
//           2. find out coinId of all pairs and store in an array
//           3. fetch price of all coins from coingecko on the behalf of coinid  store in an array
//           4. match coinid and base from (1) and return coinprice in crosponding base currency along with base and 



//           */

//           //  fetch all data of coin group by coinpair
//           cnn.query(`select  Coin_Name, sum(UNITS) as TU ,sum(TOTAL_COST) as TC, sum(SELL_COST) as SC from ${user}_portfolio group BY Coin_Name`, (err, results) => {
//             if (err) console.log(err);

//             if (results?.length == 0) {
//               res.render(__dirname + "/views/dashbord", {
//                 results: [],
//                 invested: 0,
//                 Dpnl: 0, Ppnl: 0, Fbalance: b, fundingResult: 0, Current_Value: 0, TotalSell: 0
//               });
//             }
//             const dbResults = results;
//             // console.table(dbResults)

//             //  store all coins pair in single array for further use
//             const coinPairs = [];
//             dbResults?.map((result) => {
//               coinPairs?.push(result.Coin_Name);
//             })
//             // console.log("=>>", coinPairs)

//             // find out coinId & base using coinpairs
//             const coinIdsAndBaseAndSymbol = coinPairs?.map((coinPair) => {
//               return { coinId, base, symbol } = parseCryptoPair(coinPair)
//             })
//             // console.log("coinIDs and symbols")
//             console.table(coinIdsAndBaseAndSymbol)
//             // res.json(coinIdsAndBaseAndSymbol)




//             const coinIdString = createCoinIdString(coinIdsAndBaseAndSymbol)
//             function calculatePNL(coinData) {
//               // Map through coinData to calculate PNL for each coin
//               const allcoinsPnlData = coinData.map((coinInfo, index) => {
//                 // Initialize variables
//                 let pnlInBase = 0; // PNL in base currency (e.g., $25)
//                 let pnlValueInPercentage = 0; // PNL in percentage (e.g., 25%)
//                 let holdingValue = 0;

//                 // Destructure coinInfo object for easier access to properties
//                 const {
//                   totalBuyCost,
//                   totalSellcost,
//                   totalHoldingUnits,
//                   base,
//                   currentPrice,
//                   pair
//                 } = coinInfo;

//                 // Check if there are holding units for the coin
//                 if (totalHoldingUnits > 0) {
//                   // Calculate PNL and holding value when there are holding units
//                   pnlInBase = parseFloat(((totalHoldingUnits * currentPrice) + totalSellcost) - totalBuyCost);
//                   holdingValue = parseFloat(totalHoldingUnits * currentPrice);
//                   pnlValueInPercentage = ((((totalHoldingUnits * currentPrice) + totalSellcost) - totalBuyCost) / totalBuyCost) * 100;
//                   pnlValueInPercentage = parseFloat(pnlValueInPercentage).toFixed(2);
//                 } else {
//                   // Calculate PNL and set holding value to 0 when there are no holding units
//                   pnlInBase = parseFloat(totalSellcost - totalBuyCost);
//                   holdingValue = 0;
//                   pnlValueInPercentage = ((totalSellcost - totalBuyCost) / totalBuyCost) * 100;
//                   pnlValueInPercentage = parseFloat(pnlValueInPercentage).toFixed(2);
//                 }

//                 // Create and return an object with relevant information
//                 return {
//                   pair: pair,
//                   holding: totalHoldingUnits,
//                   buyingCost: totalBuyCost,
//                   sellingCost: totalSellcost,
//                   currentValue: holdingValue,
//                   currentPrice: currentPrice,
//                   pnlInBase: parseFloat(pnlInBase).toFixed(6),
//                   base: base,
//                   pnlInPercent: pnlValueInPercentage,
//                 };
//               });

//               return allcoinsPnlData;
//             }




//             try {
//               results?.length > 0 && axios(`https://api.coingecko.com/api/v3/simple/price?ids=${coinIdString}&vs_currencies=btc%2Ceth%2Cinr%2Cusd`)
//                 .then(res => res.data)
//                 .then((resultData) => {
//                   console.log(resultData)

//                   const coinInfoWithPrice = coinIdsAndBaseAndSymbol.map((coinIdAndBaseAndSymbol) => {


//                     // console.log("@@",)
//                     let currentPrice = resultData?.[coinIdAndBaseAndSymbol?.coinId]?.[coinIdAndBaseAndSymbol?.base]
//                     currentPrice = currentPrice > 0 ? currentPrice : 0
//                     const base = coinIdAndBaseAndSymbol.base
//                     const symbol = coinIdAndBaseAndSymbol.symbol
//                     const pair = (coinIdAndBaseAndSymbol.symbol) + `/${base}`
//                     console.log(coinIdAndBaseAndSymbol.symbol)
//                     const id = coinIdAndBaseAndSymbol.coinId ? coinIdAndBaseAndSymbol.coinId : coinIdAndBaseAndSymbol.symbol + `/${base}`
//                     // console.log("@@",coinIdAndBase.coinId,"==",resultData[coinIdAndBase.coinId][coinIdAndBase.base],coinIdAndBase.base)
//                     return { currentPrice, base, pair, symbol, coinId: id }

//                   })
//                   // console.table(coinInfoWithPrice)
//                   // console.log(coinInfoWithPrice.length)
//                   const coinsFullData = dbResults.map((coinData, index) => {
//                     // console.log(coinData.TU)
//                     if (coinInfoWithPrice[index].pair = coinData.Coin_Name) {
//                       return {
//                         ...coinInfoWithPrice[index],
//                         totalBuyCost: coinData.TC,
//                         totalSellcost: coinData.SC,
//                         totalHoldingUnits: coinData.TU
//                       }
//                     }

//                   })

//                   const calculatedPNL = calculatePNL(coinsFullData)
//                   // console.log("calculatred pnl :=>>>>>>>", calculatedPNL)
//                   console.table(calculatedPNL)
//                   let totalInvested = calculatedPNL.reduce((accum, current) => parseFloat(accum + current.buyingCost), 0)
//                   totalInvested = parseFloat(totalInvested).toFixed(3)

//                   let currentPortfolioValue = calculatedPNL.reduce((accum, current) => parseFloat(accum + current.currentValue), 0)


//                   let totalSellCost = calculatedPNL.reduce((accum, current) => parseFloat(accum + current.sellingCost), 0)
//                   let totalBuyCost = calculatedPNL.reduce((accum, current) => parseFloat(accum + current.buyingCost), 0)

//                   let totalPnlInPercentage = (((totalSellCost - totalBuyCost) + currentPortfolioValue) / totalBuyCost) * 100
//                   totalPnlInPercentage + "%"
//                   let totalPnlInUsd = totalSellCost - totalBuyCost + currentPortfolioValue
//                   console.log({ currentPortfolioValue, totalBuyCost, totalSellCost, totalInvested, totalPnlInPercentage, totalPnlInUsd })
//                   console.log("totalInvested :", totalInvested)
//                   // const dpnl

//                   setTimeout(() => {
//                     var pnl = (parseFloat(((Current_Value) / invested) * 100).toFixed(2))
//                     res.render(__dirname + "/views/dashbord", {
//                       results: calculatedPNL,
//                       invested: totalInvested,
//                       Dpnl: totalPnlInUsd, Ppnl: totalPnlInPercentage, Fbalance, fundingResult, Current_Value: currentPortfolioValue, TotalSell: totalSellCost
//                     });
//                   }, 100)

//                 })




//             } catch (error) {
//               console.log(error)
//             }


//           });
//         })
//       });
//     }
//     if (user) {
//       DbOperationsForDashbord(user, req, res)
//     }
//     else {
//       res.redirect("/login");
//     }
//   } catch (error) {
//     console.log(error)
//     res.json({ Error: "internal Server Error ", message: error })
//   }
// });
//Dash-Bord END------------------->
// app.post('/portfolio/create', Authentication, createNewPortfolio)
// app.get("/dashboard", Authentication, dashboard)
// app.get("/delete", Authentication, (req, res) => {
//   const user = req.auth.User
//   if (user) {
//     var deleteId = req.query.id
//     var ASSET = req.query.Asset
//     var deleteQuery = `delete from ${user}_portfolio where id=${deleteId}`
//     try {
//       try {

//       } catch (error) {
//         console.log(error)
//         res.json({ Error: "internal Server Error ", message: error })
//       } cnn.query(deleteQuery, (err, result) => {
//         if (err) console.log(err)
//         res.redirect(`/Transactions?Asset=${ASSET}`)
//       })
//     } catch (error) {
//       console.log(error)
//       res.json({ Error: "internal Server Error ", message: error })
//     }
//   }
//   else {
//     res.redirect('/login')
//   }
// });
app.use(ErrorHandler)
export default app;
