const express = require("express");
require('dotenv').config()
const JWT_KEY = "67@#65ygfghyfhYOUDFGH54-d45fhgg9854656";
// console.log("Jwt key :", JWT_KEY)
const axios = require("axios");
const upload = require('express-fileupload')
const csvtojson = require('csvtojson');
const fs = require('fs')
const cookiesParser = require('cookie-parser')
var PORT = process.env.PORT || 7000
const path = require('path')
const console = require('console');
var nodemailer = require('nodemailer');
const bodyparser = require("body-parser");
const app = express();
app.use(express.json())
app.use(upload())
const jwt = require('jsonwebtoken')
const session = require("express-session");
const { request, response } = require("express");
const { dirname } = require("path");
const cnn = require("./config/connection");
cnn.getConnection((err, connection) => {
  if (err) console.log(err)
  console.log("DB connected SuccessFully !,", connection)
})
const { stringify } = require("querystring");
const { SlowBuffer } = require("buffer");
app.use(bodyparser.json());
app.set("views", path.join(__dirname, "views"))
app.use(cookiesParser())
app.use(
  bodyparser.urlencoded({
    extended: true,
  })
);

app.set("view engine", "ejs");
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// middle ware to verify JWT token
const Authentication = async (req, res, next) => {
  if (req.cookies.AUTH) {
    try {
      const autherised = jwt.verify(req.cookies.AUTH, JWT_KEY, (err, result) => {
        if (err) {
          res.json({ Error: err.message })
        }
        else {
          req.auth = result
          next()
        }
      })
    }
    catch (err) {
      console.log(err)
      res.json({ Error: err })
    }
  }
  else {
    res.render('error', { message: "Invalid Credentials" })
  }
}
var userEmail;
var tablename;
var name;
app.get('/update', Authentication, (req, res) => {
  const user = req.auth.User;
  if (user) {
    var Id = req.query.id;
    console.log("COIN ID :", Id)
    var updateQuery = `SELECT *FROM ${user}_portfolio WHERE ID=${Id}`
    cnn.query(updateQuery, (err, result) => {
      if (err) console.log(err)
      else {
        console.log(result)
        res.render(__dirname + '/views/update', { result });
      }
    })
    // res.render(__dirname + '/update', { result });
  }
  else {
    res.redirect('/login')
  }
})

app.post('/update', Authentication, (req, res) => {
  const user = req.auth.User
  if (user) {
    var coinname = req.body.coinName;
    var ordertype = req.body.ordertype;
    var id = req.body.id;
    var price = req.body.price;
    var sellcost;
    if (price < 0.0001) {
      price = parseFloat(price).toFixed(6);
    } else {
      price = parseFloat(price).toFixed(3);
    }
    var unit = req.body.units;
    var total = req.body.totals;
    if (total < 0.0001) {
      total = parseFloat(total).toFixed(6);
    } else {
      total = parseFloat(total).toFixed(2);
    }
    if (ordertype == "SELL") {
      unit = 0 - unit;
      sellcost = total;
      total = 0


    } else {
      unit = unit;
      sellcost = 0
    }
    // `CREATE TABLE portfolio(ID INT AUTO_INCREMENT KEY ,Coin_Name VARCHAR(10),ORDER_TYPE VARCHAR(10), PRICE VARCHAR(50),UNITS VARCHAR(50),TOTAL_COST VARCHAR(50),SELL_COST VARCHAR(50))`;
    var updatepost = `update ${user}_portfolio set Coin_Name='${coinname}',ORDER_TYPE='${ordertype}',PRICE='${price}',UNITS='${unit}',TOTAL_COST='${total}' ,SELL_COST='${sellcost}' where ID= ${id}`
    // console.log(updatepost)
    cnn.query(updatepost, (err, result) => {
      if (err) console.log(err)
      res.redirect(`/Transactions?Asset='${coinname}'`)
    })

  }
  else {
    res.redirect('/login')
  }
})
app
//register start
app.get('/user', Authentication, async (req, res) => {
  const user = req.auth.User
  // console.log(user)

  if (user) {
    cnn.query(`select *from newUsers WHERE username='${user}'`, (err, result) => {
      if (err) console.log(err)
      else {
        result && res.render(__dirname + "/views/already", {
          username: result[0].username, userEmail: result[0].emailid, name: result[0].name, Current_Value, invested, b, Dj: result[0].JoiningDAte

        })

      }
    })
    // console.log("A :",a)

  }
  else {
    // var tables;
    // DbOperationsForRegister(req, res)

    // res.render(__dirname + "/views/signin", { alltables: tables })
  }
})
app.get('/register', (req, res) => {
  if (req.cookies.AUTH) {
    res.redirect('/user')
  }
  else {
    res.render('signin')
  }
})
//register END
//login Start
var i = 0, otp, status;
// Login Rout
var Users_name
app.get("/login", (req, res) => {
  if (!req.cookies.AUTH) {
    res.render(__dirname + "/views/login");
  }
  else {
    res.redirect('/user')
  }
});
var usernameorEmail;
app.post("/login", async (req, res) => {
  function DbOperationsForLogin() {
    var sqllogin = `select *from newUsers WHERE username='${usernameorEmail}' AND password='${passwordlog}'`;
    cnn.query(sqllogin, async (err, resultl) => {
      if (err) throw err;
      if (resultl.length > 0) {
        tablename = usernameorEmail;
        Users_name = resultl.name;
        found = true;
        status = resultl[0].sts;
        userEmail = resultl[0].emailid;
        name = resultl[0].name;
        //get the date of joining 
        Dj = resultl[0].jdate;
        const token = await jwt.sign({ User: tablename, Email: userEmail }, JWT_KEY);
        req.session.loggedin = true;
        res.cookie("AUTH", token, {
          expiresIn: '2d',
          secure: true,
          httpOnly: true,
          sameSite: 'lax'
        })
        res.render("loginsuccess", { name: tablename, Ustatus: status });
      } else {
        res.render("notregistered");
      }
    })
  }
  
  usernameorEmail = req.body.usrName;
  passwordlog = req.body.Passlog;
  DbOperationsForLogin(req, res) //call if handshake already done
});
//Login End
//portfollio Start
app.get("/portfolio", Authentication, (req, res) => {
  const user = req.auth.User
  if (user) {
    res.render("portfolio");

  } else {
    res.redirect('/login')
  }
});
var t = true;

//submit New Transaction 
app.post("/portfolio", Authentication, (req, res) => {
  const user = req.auth.User
  var coinname = req.body.coinName;
  var base = req.body.base;
  var ordertype = req.body.ordertype;
  var price = req.body.price;
  var sellcost;
  if (price < 0.0001) {
    price = parseFloat(price).toFixed(6);
  } else {
    price = parseFloat(price).toFixed(3);
  }
  var unit = req.body.units;
  var total = req.body.totals;
  if (total < 0.0001) {
    total = parseFloat(total).toFixed(6);
  } else {
    total = parseFloat(total).toFixed(2);
  }
  if (ordertype == "SELL") {
    unit = 0 - unit;
    sellcost = total;
    total = 0
  } else {
    unit = unit;
    sellcost = 0
  }
  
  var sql = `INSERT INTO ${user}_portfolio (Coin_Name,ORDER_TYPE,PRICE,UNITS,TOTAL_COST,SELL_COST ) VALUES('${coinname}','${ordertype}',${price},${unit},${total},${sellcost})`;
  cnn.query(sql, (err, results) => {
    if (err) throw err;
    res.render("response");
  });
  
});
//Funding route start
app.get('/funding', Authentication, (req, res) => {
  const user = req.auth.User
  if (user) {
    res.render("MainFunding")
  } else {
    res.redirect('/login')
  }
})

app.get('/News', (req, res) => {
  res.render("news")
})
app.post('/funding', Authentication, (req, res) => {
  // console.log(req.body)
  const user = req.auth.User
  var Amount = req.body.amount;
  var Ttype = req.body.type;
  var Tdiscription = req.body.Discription;
  var Tdate = req.body.date;
  if (Ttype == 'withdraw') {
    Amount = 0 - Amount;
  }
  console.log(Amount, Ttype, Tdiscription, Tdate)

  cnn.query(`insert into ${user}_funding(amount,type, discription,date) values(${Amount},'${Ttype}','${Tdiscription}','${Tdate}')`, (err, result) => {
    if (err) console.log(err)
    res.render('Fresponse')
  })

})
//Funding route End
// OTP varification start
var sqlqr
app.post('/emailvarification', Authentication, (request, response) => {
  const user = request.auth.user
  var Iotp = request.body.userotp;
  console.log(userEmail);
  if (otp == Iotp) {
    cnn.query(`update newuser SET varified=${t} where username='${resultl[0].username}'`, (e, result) => {
      if (e) console.log(e);
      // console.log(result)
      response.send(" Email Varification SuccessFull !");
      response.redirect('/dash-bord');
    })
  }
  else {
    response.send("Invalid OTP")
  }
})
// Route to reset All Transaction Of the user
app.get('/reset', Authentication, (req, res) => {
  const user = req.auth.User
  if (user) {
    cnn.query(`truncate table ${user}_portfolio`, (err, result) => {
      if (err) console.log(err)
      res.redirect('/dash-bord')
    })
  }
  else {
    res.redirect('/login')
  }
})
app.get('/resetF', Authentication, (req, res) => {
  const user = req.auth.User
  if (user) {
    cnn.query(`Truncate table ${user}_funding`, (err, result) => {
      if (err) console.log(err)
      res.redirect('/dash-bord')
    })
  }
  else {
    res.redirect('/login')
  }
})
// route to verify the Email Address of the User
app.get('/v', Authentication, (req, res) => {
  console.log("V route Hitted @")
  const user = req.auth.User
  function DbOperationAfterVarification() {
    var tbl = `CREATE TABLE ${user}_portfolio(ID INT AUTO_INCREMENT KEY ,Coin_Name VARCHAR(10),ORDER_TYPE VARCHAR(10), PRICE VARCHAR(50),UNITS VARCHAR(50),TOTAL_COST VARCHAR(50),SELL_COST VARCHAR(50))`;
    var tbl2 = `create table ${user}_funding(ID INT AUTO_INCREMENT KEY , amount varchar(50),type varchar(50),discription varchar (500), date varchar(50)) `
    cnn.query(tbl, (err, result) => {
      if (err) console.log(err)
      cnn.query(tbl2, (err, result) => {
        if (err) console.log(err)

      })
    })
  }
  if (user) {
    cnn.query(`update newUsers SET sts=1 where username='${user}'`, (e, result) => {
      if (e) {
        console.log(e)

        res.render("Err404")
      } else {

        if (result.affectedRows == 1) {
          DbOperationAfterVarification();
          res.render("EmailSuccess")
        }
      }
     
    })
  }
  else {
    res.redirect('/login')
  }
})
app.get('/emailvarification', Authentication, async (request, response) => {
  const user = request.auth.User

  if (user) {
    cnn.query(`select emailid , sts from newUsers WHERE username='${user}'`, (err, result) => {
      if (err) console.log(err)
      else {
        const status = result[0].sts
        const mail = result[0].emailid
        setTimeout(() => {
          if (status) {
            response.redirect('/dash-bord')
          }
          else {
            let mailTransporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: "noreplay.quickreport@gmail.com",
                pass: "aylxdrwizbwszpbw"
              }
            })
            otp = Math.floor(100000 + Math.random() * 900000);
            var emailTime = new Date()
            let details = {
              Form: "noreplay.quickreport@gmail.com",
              to: mail,
              subject: "Email Varification",
              text: `Welcome To Quick Report `,
              html: `<body style="font-family:'Source Serif 4', sans-serif;">
            <b
                style="color:rgb(7, 7, 7) ;margin-bottom: 0px;margin-top: 25px; ;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                welcome , <p
                    style="font-family:'Source Serif 4', sans-serif; color: rgb(13, 213, 248);margin:2px;font-weight: 300;">
                    ${name}</p>
           </b>
            <br>
            <div style="text-align:left;">
                <P style="color:rgb(17, 17, 17) margin :0px; font-size: small; text-align: left; font-weight: 500; font-size: large;">
                    Registration Was Successfull please verify your
                    email address !</P>
                <p style="font-family:'Source Serif 4',font-weight:100px sans-serif;"> Your Email Varification Code</p>
                <p style="font-size: xx-large; color:#f88605; font-weight:bold;  ">
                    ${otp}
                </p>
                <p style="text-align: left; font-weight: 900;color: rgb(6, 6, 6); font-size: large;">Regards </p>
                <p style="text-align: left; color: #3b3b3a; margin-top:-15px ;margin-left: 15px;">Team QuickReport </p>
                <p style="text-align:right">${emailTime}</p>
                <hr>
                <p style="text-align: center; font-weight:900;">Powered By OrangeDevs</p>
            </div>
        </body>`
            }
            mailTransporter.sendMail(details, (err) => {
              if (err) {
                console.log(err)
              }
              else {
                response.render("Emailvarify", { otp, userEmail: mail })
              }
            })
            // response.send(`OTP:${otp}`)
          }
        }, 2000);
      }
    })
  }
  else {
    response.redirect('/')
  }
})
//Varification end
//Logout Start
const sts = false;
app.get("/logout", Authentication, (req, res) => {
  const user = req.auth.User
  req.session.loggedin = false;
  res.clearCookie('AUTH')
  res.render("logout");
});
//logout END
//upload Start
app.get('/upload', Authentication, (req, res) => {
  const user = req.auth.User
  if (!user) {
    res.redirect('/login')
  }
  else {
    res.render("uploadFile")
  }
})

// Process the uploaded file 
app.post('/upload', Authentication, (req, res) => {
  const user = req.auth.User
  if (req.files) {
    var file = req.files.Tfile
    var fileName = file.name
    console.log(fileName)
    var fileNewName = Math.floor(Math.random() * 1000) + fileName
    file.mv('./upload/' + fileNewName, (err) => {
      if (err) {
        console.log(err)
      }
      else {
        var FileExtenson = path.extname(fileNewName);
        if (FileExtenson == ".json") {
          ReadJSONFile(fileName, res);
        }
        else if (FileExtenson == ".csv") {
          console.log("FIle IS CSV")
          ReadCSVFile(file)
          function CSVResponse(transactions) {
            res.render(__dirname + "/views/uploadresponse", { transactions, file })
            console.log(file)
          }
        }
        var file = req.body.Tfile
        var FileExtenson = path.extname(fileNewName);
        if (FileExtenson == ".json") {
          ReadJSONFile(fileName, res);
          console.log("FIle IS JSON")
        }
        else if (FileExtenson == ".csv") {
          console.log("FIle IS CSV")
          ReadCSVFile(file);
          function CSVResponse(transactions) {
            res.render(__dirname + "/views/uploadresponse", { transactions, file: fileName })
            console.log(fileName)
          }
        }
        console.log(FileExtenson)
        function ReadJSONFile(fileName, res) {
          var DataArray = []
          var mainArray = []
          var Doc_coinname, Doc_orderType, Doc_price, Doc_totalCost, Doc_SellCost, Doc_units, TradeCost;
          fs.readFile(`./upload/${fileNewName}`, "utf-8", (err, filedata) => {
            if (err) console.log(err)
            DataArray = JSON.parse(filedata)
            // console.log("File Type=", typeof filedata)
            var fileForDelete = `./upload/${fileNewName}`
            for (var i = 0; i < DataArray.length; i++) {
              Doc_coinname = DataArray[i].Market // To extract the coin pair like BTCUSDT
              Doc_orderType = DataArray[i].Type  // Order type exp. BUY/SELL
              Doc_price = parseFloat(DataArray[i].Price).toFixed(5)  // price which may be sell price or buy price 
              Doc_units = parseFloat(DataArray[i].Amount).toFixed(5)
              TradeCost = parseFloat(DataArray[i].Total).toFixed(5)  // fund which used in trade OR Total cost 
              if (Doc_orderType === "SELL") {
                Doc_SellCost = TradeCost;
                console.log("Doc_SellCost :==", Doc_SellCost);
                Doc_totalCost = 0
                Doc_units = 0 - Doc_units;
              }
              else {
                Doc_SellCost = 0
                Doc_totalCost = TradeCost;
                Doc_units = parseFloat(Doc_units).toFixed(5);
              }
              Doc_price
              var array1 = [];
              array1.push(`${Doc_coinname}`, `${Doc_orderType}`, Doc_price, Doc_units, Doc_totalCost, Doc_SellCost)
              mainArray.push(array1)
            }
          })
          var Sq = `INSERT INTO ${user}_portfolio (Coin_Name,ORDER_TYPE,PRICE,UNITS,TOTAL_COST,SELL_COST ) VALUES ?`
          setTimeout(() => {
            console.log(mainArray)


            cnn.query(Sq, [mainArray], (err, result) => {
              if (err) console.warn(err)
              console.log(result)
              console.log("File Name==", fileName)
              res.render(__dirname + '/views/uploadresponse', { transactions: result.affectedRows, file: fileName })
              try {
                fs.unlinkSync(fileForDelete);
                console.log("File removed:", fileForDelete);
              } catch (err) {
                console.error(err);
              }
            })

          }, 1000)

        }
        function ReadCSVFile(filename, res, req) {
          const csvfilepath = `./upload/${fileNewName}`
          var AssetSymbol = []
          var RemoveUSDT, assetprice, filledunits, buycost;
          var sellcost = 0, orderside;
          var CSVfinalArray = []
          csvtojson()
            .fromFile(csvfilepath)
            .then((JsonDATA) => {
              // console.log(JsonDATA)
              for (var object of JsonDATA) {
                Symbol = object.symbol;
                assetprice = parseFloat(object.price)
                assetprice = parseFloat(assetprice)
                filledunits = parseFloat(object.size);
                orderside = object.side
                buycost = parseFloat(object.dealFunds)
                if (Symbol != "POLX-USDT" && Symbol != "ARNM-USDT" && Symbol != "WOOP-USDT" && Symbol != "USDT-USDC" && Symbol != "USDC-USDT" && Symbol != "OXT-USDT" && Symbol != "ARMN-USDT" && Symbol != "MLS-USDT" && Symbol != "AFK-USDT" && Symbol != "KCS-USDT" && Symbol != "VR-USDT" && Symbol != "ONSTON-USDT" && Symbol != "GMM-USDT" && Symbol != "XCN-USDT" && Symbol != "WAXP-USDT" && Symbol != "RSR-USDT" && Symbol != "MLS-USDT" && Symbol != "GALAX-USDT" && Symbol != "BLOK-USDT" && Symbol != "EWT-USDT" && Symbol != "CTSI-USDT" && Symbol != "CWEB-USDT" && Symbol != "KDA-USDT" && Symbol != "UTK-USDT" && Symbol != "WAX-USDT" && Symbol != "MOVR-USDT" && Symbol != "VIDT-USDT") {
                  if (Symbol.match(/-USDT|-USDC/g)) {
                    // console.log('TRUE !!!!!!!!!!!!!!!!!11')
                    Symbol = String(Symbol)
                    // console.log("SYMBOL BEFORE  REMOVING USDT :", RemoveUSDT)
                    RemoveUSDT = Symbol.replace("-", "")
                    if (Symbol.match(/-USDC/g)) {
                      RemoveUSDT = Symbol.replace("-USDC", "USDT")
                    }
                    AssetSymbol.push(RemoveUSDT)
                  }
                  if (orderside == "sell") {
                    sellcost = parseFloat(buycost) // 
                    buycost = parseInt(0) //buy cost will be 0
                    filledunits = 0 - parseFloat(filledunits)
                  }
                  else {

                    sellcost = parseFloat(0)
                    buycost = parseFloat(buycost)
                    filledunits = parseFloat(filledunits)
                  }
                  var CSVlocalArray = [];
                  CSVlocalArray.push(`${RemoveUSDT}`, `${orderside}`, assetprice, filledunits, buycost, sellcost)
                  console.log(CSVlocalArray)
                  CSVfinalArray.push(CSVlocalArray)
                  // console.log(CSVfinalArray)
                }
              }

              setTimeout(() => {
                var Sqcsv = `INSERT INTO ${user}_portfolio  (Coin_Name,ORDER_TYPE,PRICE,UNITS,TOTAL_COST,SELL_COST ) VALUES ?`
                cnn.query(Sqcsv, [CSVfinalArray], (err, result) => {
                  if (err) console.log(err)
                  console.log("SQL RESPONSE FROM CSV FUNCTION :", result)
                })
                CSVResponse(CSVfinalArray.length);
              }, 1000)

            })
        }
      }
    })
  }
})
//upload end
//----End---

var emailid
var username
var name
app.post("/register", (req, res) => {
  var jdate = new Date()
  var JoinningDAte = jdate.toString()
  JoinningDAte = JoinningDAte.replace("GMT+0530 (India Standard Time)", "");
  username = req.body.userName;
  name = req.body.Name;
  emailid = req.body.emailId;
  var password = req.body.password;
  sqlqr = `insert into newUsers values('${username}','${name}' ,'${emailid}',${sts},'${password}','${JoinningDAte}')`
  cnn.query(sqlqr, (err, result) => {
    if (err) throw err;
    res.render(__dirname + "/views/Rresponse", { name })
  })
});
app.get("/", (req, res) => {
  res.render("index");
});
const validateCoinName = (req, res, next) => {
  if (!req.query.Asset) {
    res.redirect('/dash-bord')
  }
  else {
    next()
  }
}
//--Start---Route for get detail for all transaction of a perticulor coin

app.get('/resetAll', Authentication, (req, res) => {
  const user = req.auth.User
  if (user) {
    cnn.query(`truncate table ${user}_funding `, (err, result) => {
      if (err)
        console.log(err)
      cnn.query(`truncate table ${user}_portfolio `, (err, result) => {
        if (err) console.log(err)
        if (result > 0) {
          response.redirect('/dash-bord')
        }
      })
    })
    res.redirect('/dash-bord')
  }
  else {
    res.redirect('/login')
  }
})

const deleteWare = (req, res, next) => {
  if (!res.coinSym) {
    res.redirect('/dash-bord')
  }
  else {
    next()
  }

}
app.get('/about', (req, res) => {
  res.render("about")
})
app.get('/Transactions', Authentication, validateCoinName, (req, res) => {
  const user = req.auth.User
  if (user) {
    cnn.query(`select *from ${user}_portfolio where Coin_Name=${req.query.Asset}`, (err, result) => {
      if (err) console.log(err)
      if (result.length > 0) {
        // console.log(req.query.Asset)
        var Asset_Name = req.query.Asset
        var coinSymbol = Asset_Name.substring(Asset_Name.length - 5, 1)
        var ImageSrc;
        var CurrenPrice;
        var ChangeIn7D;
        var ChangeIn30D;
        var ChangeIn60D;
        var ChangeIn90D;
        let Avp;
        let CMCDATA;
        var CoinId
        var CmcName;
        var CmcSymbol;
        var PnlArray = [];
        var TotalPNLP;
        var volume = 0;
        const CmC = async () => {
          // console.log(coinSymbol)
          await axios(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${coinSymbol}`, {
            headers: {
              "X-CMC_PRO_API_KEY": "8f4e31a4-7094-45aa-aa06-b9f748555a98",
              "Accept": "application/json",
            },
          })
            .then((response) => {
              return response.data;
            })
            .then((FinalData) => {
              console.log(FinalData.data)
              CMCDATA = FinalData.data
              CmcName = FinalData.data[`${coinSymbol}`][0].name
              CmcSymbol = FinalData.data[`${coinSymbol}`][0].symbol
              CurrenPrice = FinalData.data[`${coinSymbol}`][0]['quote']['USD'].price
              ChangeIn24H = FinalData.data[`${coinSymbol}`][0]['quote']['USD'].percent_change_24h
              ChangeIn7D = FinalData.data[`${coinSymbol}`][0]['quote']['USD'].percent_change_7d
              ChangeIn30D = FinalData.data[`${coinSymbol}`][0]['quote']['USD'].percent_change_30d
              ChangeIn60D = FinalData.data[`${coinSymbol}`][0]['quote']['USD'].percent_change_60d
              ChangeIn90D = FinalData.data[`${coinSymbol}`][0]['quote']['USD'].percent_change_90d

              setTimeout(() => {
                CoinId = FinalData.data[`${coinSymbol}`][0].slug;
                if (CoinId == 'polkadot-new') {
                  CoinId = CoinId.substring(CoinId.length - 4, 0)
                }
                else if (CoinId == "sxp") {
                  console.log("TRUE")
                  CoinId = "swipe";
                }
                else if (CoinId == "bnb") {
                  CoinId = "binancecoin"
                }
                else if (CoinId == "terra-luna-v2") {
                  CoinId = "terra-luna"
                }
                else if (CoinId == "near-protocol") {
                  CoinId = "near"
                }
                else if (CoinId == "polygon") {
                  CoinId = "matic-network"
                }
                else if (CoinId == "travala") {
                  CoinId = "concierge-io"
                }
                else if (CoinId == "pancakeswap") {
                  CoinId = "pancakeswap-token"
                }
                else if (CoinId == "apecoin-ape") {
                  CoinId = "apecoin"
                }
                else if (CoinId == "avalanche") {
                  CoinId = "avalanche-2"
                }
                setTimeout(() => {
                  Coingecko(CoinId)
                }, 100)
              }, 100)
            });

        }
        CmC()
        const Coingecko = async (id) => {

          await axios(`https://api.coingecko.com/api/v3/coins/${id}?localization=false&community_data=false&developer_data=false`)
            .then((response) => {
              return response.data;
            })
            .then((FinalData) => {
              ImageSrc = FinalData.image.large;
              let AvpQuery = `select SUM(UNITS) AS UnitTotal,Sum(TOTAL_COST) AS CostTotal from ${user}_portfolio where Coin_Name=${Asset_Name} `
              cnn.query(AvpQuery, (err, Avpresult) => {
                if (err) console.log(err)
                console.log(Avpresult)
                Avp = parseFloat(Avpresult[0].CostTotal / Avpresult[0].UnitTotal)
                cnn.query(`select *from ${user}_portfolio where Coin_Name=${Asset_Name}`, (err, results) => {
                  if (err) console.log(err)
                  var holding = 0
                  console.log(results)
                  for (var u = 0; u < results.length; u++) {
                    if (results[u].UNITS < 0) {   // Start To calculte the volume (BUY +Sell) of the asset 
                      var unt = results[u].UNITS * -1
                      volume = parseFloat(volume) + parseFloat(unt)
                    }
                    else {
                      volume = parseFloat(volume) + parseFloat(results[u].UNITS)
                    } //END
                    holding = holding + parseFloat(results[u].UNITS);
                    if (results[u].ORDER_TYPE == "BUY" || results[u].ORDER_TYPE == "buy") {
                      var Detailspnl;
                      Detailspnl = parseFloat(((CurrenPrice - results[u].PRICE) / results[u].PRICE) * 100)
                      PnlArray.push(Detailspnl);
                    }
                  }
                  TotalPNLP = ((CurrenPrice - Avp) / Avp) * 100
                  TotalPNLD = parseFloat((100 + TotalPNLP * Avp) / 100)
                  console.log("AVERage price ::", Avp)
                  // console.log("volume= =================", volume)
                  res.render(__dirname + "/views/Details", {
                    results, holding, ImageSrc, CurrenPrice, FinalData, CMCDATA, ChangeIn24H, ChangeIn30D, ChangeIn7D, ChangeIn60D, ChangeIn90D, Avp, CmcName, CmcSymbol, TotalPNLP, SumInvested: Avpresult[0].CostTotal, Asset_Name, volume
                  })
                })
              })
            });
        }
      }
      else {
        res.redirect('/dash-bord')
      }
    })
  }
  else {
    res.redirect('/login')
  }
})

//Dash-Bord START------------------->
var Current_Value
var b;
var invested = 0;
app.get("/dash-bord", Authentication, async (req, res) => {
  // console.log("username-AUTH :", req.auth.User)
  const user = req.auth.User;
  console.log("username :", user)
  function DbOperationsForDashbord(user, req, res) { //function for database operation for dashBord route  ----START-----
    Current_Value = 0
    invested = 0
    var coinname = [];
    var TotalCost = [];
    var SellCost = [];
    var TotalUnit = [];
    var Dpnl = [];
    var Ppnl = [];
    var dpnlvalue;
    var ppnlvalue;
    var price;
    var cv;
    var TotalSell;
    var chartContent = [];
    cnn.query(`select *from ${user}_funding`, (err, fundingResult) => {
      if (err) console.log("Err At switching database for Funding Table ==> ", err)
      console.log(fundingResult)
      cnn.query(`select SUM(amount) as balance from ${user}_funding`, (err, Fbalance) => {
        if (err) console.log(err)
        b = Fbalance[0].balance;
        cnn.query(`select  Coin_Name, sum(UNITS) as TU ,sum(TOTAL_COST) as TC, sum(SELL_COST) as SC from ${user}_portfolio group BY Coin_Name`, (err, results) => {
          if (err) console.log(err);
          var len = results.length;
          var pnl = [];
          for (var i = 0; i < len; i++) {
            coinname.push(results[i].Coin_Name.toUpperCase());
            TotalCost.push(results[i].TC);
            invested = parseFloat(invested + (results[i].TC - results[i].SC));
            invested = parseFloat(invested)
            SellCost.push(results[i].SC);
            TotalUnit.push(results[i].TU);
            TotalSell = TotalSell + parseFloat(results[i].SC)
            var CC = [];
            CC.push(`${results[i].Coin_Name}` + ',' + results[i].TC)
            chartContent.push(CC)
          }
          var url = "https://api.binance.com/api/v3/ticker/24hr?symbol=";
          currentprice = [];
          price;
          i = 0;
          const loop = async () => {
            for (var CoinName of coinname) {
              await axios(url + CoinName)
                .then((response) => {
                  return response.data;
                })
                .then((FinalData) => {
                  price = FinalData.askPrice;
                  setTimeout(() => {
                    if (TotalUnit[i] > 0) {
                      dpnlvalue = ((TotalUnit[i] * price) + SellCost[i]) - TotalCost[i]
                      dpnlvalue = parseFloat(dpnlvalue)
                      Current_Value += dpnlvalue
                      Dpnl.push(dpnlvalue)
                      ppnlvalue = ((((TotalUnit[i] * price) + SellCost[i]) - TotalCost[i]) / TotalCost[i]) * 100;
                      ppnlvalue = parseFloat(ppnlvalue).toFixed(2)
                      Ppnl.push(ppnlvalue)
                    }
                    else {
                      dpnlvalue = SellCost[i] - TotalCost[i];
                      dpnlvalue = parseFloat(dpnlvalue)
                      Current_Value += dpnlvalue
                      Dpnl.push(dpnlvalue);
                      ppnlvalue = ((SellCost[i] - TotalCost[i]) / TotalCost[i]) * 100;
                      ppnlvalue = parseFloat(ppnlvalue).toFixed(2)
                      Ppnl.push(ppnlvalue);
                    }
                    i++;
                  }, 100)
                });
            }
            setTimeout(() => {
              var pnl = (parseFloat(((Current_Value) / invested) * 100).toFixed(2))
              res.render(__dirname + "/views/dashbord", {
                results,
                Coins: allAsset,
                invested,
                Dpnl, Ppnl, Fbalance, fundingResult, Current_Value, chartContent, coinname, cv, TotalSell
              });
            }, 100)
          }
          loop();
          var allAsset = [... new Set(coinname)];
          invested = parseFloat(invested).toFixed(3)
        });
      })
    });
  }
  if (user) {
    DbOperationsForDashbord(user, req, res)
  }
  else {
    res.redirect("/login");
  }
});
//Dash-Bord END------------------->
app.get("/delete", Authentication, (req, res) => {
  const user = req.auth.User
  if (user) {
    var deleteId = req.query.id
    var ASSET = req.query.Asset
    var deleteQuery = `delete from ${user}_portfolio where id=${deleteId}`
    cnn.query(deleteQuery, (err, result) => {
      if (err) console.log(err)
      res.redirect(`/Transactions?Asset=${ASSET}`)
    })
  }
  else {
    res.redirect('/login')
  }
});
app.listen(PORT, (err) => {
  if (err) console.log(err)
  console.log("listining on ", PORT)
});
