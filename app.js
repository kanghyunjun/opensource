var express  = require('express');
var app      = express();
var path     = require('path');
var mongoose = require('mongoose');
var session  = require('express-session');
var flash    = require('connect-flash');
var bodyParser     = require('body-parser');
var cookieParser   = require('cookie-parser');
var methodOverride = require('method-override');

mongoose.connect("mongodb://test:test@ds023912.mlab.com:23912/opensourceproject");
var db = mongoose.connection;
db.once("open",function () {
  console.log("데이터 베이스가 연결되었습니다.");
});
db.on("error",function (err) {
  console.log("DB ERROR :", err);
});

app.set("view engine", 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(flash());
app.use(session({secret:'MySecret', resave: false, saveUninitialized:true}));

var passport = require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

app.use('/', require('./routes/home'));
app.use('/users', require('./routes/users'));
app.use('/posts', checkQuery, require('./routes/posts'));

var port = process.env.PORT || 1000;
app.listen(port, function(){
  console.log('서버가 실행되었습니다.');
});


function checkQuery(req, res, next){
  if(req.originalMethod != "GET") return next();

  var path = req._parsedUrl.pathname;
  var queryString = req._parsedUrl.query?req._parsedUrl.query:"";

  if(queryString == req._parsedUrl.query){
    return next();
  } else {
    return res.redirect(path+"?"+queryString);
  }
}
