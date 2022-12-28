const express = require('express')
const app = express();
const upload = require('express-fileupload')
const port = process.env.PORT || 3000

app.use(upload())
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/uploadFile.html")
})
app.post('/', (req, res) => {
    if (req.files) {
        console.log(req.files)
        var file = req.files.Tfile;
        var fileName = file.name
        console.log("file name:", fileName)
        console.log("FILE :::::::=>>>", file.mimetype)
        file.mv('./upload/' + Math.floor(Math.random() * 1000) + fileName, function (err) {
            if (err) {
                res.send(err)
            }
            else {
                res.send("File Uploaded sucessfully")
            }
        })
    }
})
app.listen(port, (err) => {
    if (err) console.log(err)
    console.log("listining on ", port)
})

