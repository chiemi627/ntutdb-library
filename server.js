// server.js
// where your node app starts

// init project
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.set("view engine","ejs");
const fs = require("fs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// init sqlite db
const bookdbFile = "library.db";
const exists = fs.existsSync(bookdbFile);
const sqlite3 = require("sqlite3").verbose();
const bookdb = new sqlite3.Database(bookdbFile)

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(`${__dirname}/views/login.html`);
});


app.get("/books", (request, response) => {
  response.sendFile(`${__dirname}/views/books.html`);
});

app.get("/getBooks", (request, response) => {
  const query = "SELECT b.bookid,b.title,l.userid,l.lend_date "
              + "FROM book b LEFT OUTER JOIN lending l on b.bookid=l.bookid"
  bookdb.all(query, (err, rows) => {
    response.send(JSON.stringify(rows));
  });
});

app.get("/borrowing", (request, response) =>{
  response.sendFile(`${__dirname}/views/borrowing.html`);  
});

app.post("/getBorrowingBooks", (request,response) =>{
  //課題：queryに適切なSQL文を入れましょう
  const query = "?";
  bookdb.all(query, request.body.userid, (error,rows) =>{
    if(error){
      console.log(error);
      response.send({status: "ERROR",message: "問い合わせが間違っているようです。"+error})
    }
    else{
      response.send(JSON.stringify(rows));      
    }
  })
});

app.get("/lend", (request, response) => {
  console.log("lend");
  var query = `SELECT * FROM book WHERE bookid = ?`
  bookdb.all(query, [request.query.bookid], (err, rows) => {
    response.render("lend.ejs",rows[0]);
  });
});

app.post("/lendBook", (request, response) =>{
  const userid = request.body.userid
  const bookid = request.body.bookid
  const now = new Date();
  const today = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}` 
  const query = "?,?,?";
  bookdb.run(query,[userid,bookid,today],error=>{
    if (error) {          
      console.log("ERROR"+error);
      response.send({ status: "ERROR", message: "借りられませんでした。エラーメッセージをご確認ください。 " });
    } else {
      console.log("SUCCESS");
      response.send({ status: "SUCCESS", message: "貸し出し完了しました。1週間以内にお返しください。" });
    }
  });
});

app.post("/returnBook", (request, response) =>{
  console.log(request.body);
  const userid = request.body.userid
  const bookid = request.body.bookid
  const query = "DELETE FROM lending WHERE userid=? and bookid=?";
  bookdb.run(query,[userid,bookid],error=>{
    if(error){
      console.log("ERROR"+error);
      response.send({status:"ERROR",message:"なんらかのエラーが起きました"});
    }
    else{
      console.log("SUCCESS");
      response.send({status:"SUCCESS",message:"ご返却ありがとうございました"});
    }
  });
});

app.post("/login", (request, response) =>{
  const userid = request.body.userid;
  const query = `SELECT count(*) as exist FROM user WHERE userid=?`
  
  bookdb.all(query,userid,(err,rows) => {
    if(rows[0].exist==0){
      response.send({status: "ERROR", message: "ユーザ番号が違います。"});
    }
    else{
      response.send({status: "SUCCESS", userid:userid, message: "ようこそ！"});
    }
  })
});

// listen for requests :)
var listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});