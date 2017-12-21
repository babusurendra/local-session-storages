const express = require('express');
const cookieparser = require('cookie-parser');
const bodyparser = require('body-parser');
const morgan = require('morgan');
const app = express();
const jwt = require('jsonwebtoken');
app.use(bodyparser.json());
app.use(morgan('dev'));
app.use(bodyparser.urlencoded({extended:true}));
app.use(cookieparser());
app.set('secret','secretkey');
// let user = {
//     uname: "Surendra",
//     password : "Babu"
// }

createandsettoken = (req,res)=>{
    let newtoken = jwt.sign({uname:"Surendra"},app.settings.secret,{expiresIn:'1h'});
    mycookie = {
        token : newtoken
    };
    res.cookie('usercreds',mycookie).status(200).send("token added");
    return newtoken;
}
// app.get('/cookie',(req,res)=>{
//      res.cookie('usercreds',user).send("Cookie added");
// });
// app.get('/cookie',function(req, res){
//     res.cookie(cookie_name , 'cookie_value').send('Cookie is set');
// });
// app.get('/clear',(req,res)=>{
//     res.clearCookie('usercreds');
//     res.send(`cookie cleared ${req.cookies.usercreds.uname}`)
// })
// app.get('/',(req,res)=>{
//     res.json(`your cookie values are ${req.cookies.usercreds.uname}`);
// });
// app.get('/test',(req,res)=>{
//     res.send(`in test route ${req.cookies.usercreds.uname}`);
// });
app.get('/loginsuccess',(req,res)=>{
    let token = createandsettoken(req,res);
    if(!token){
        res.send("something went wrong , please login agian");
    };
    //res.send("you have logged in");
 });
app.use((req,res,next)=>{
    if(!req.cookies.usercreds){
        res.send(`login again`);
    }
    else {
        token = req.cookies.usercreds.token;
        tokenvalid = jwt.verify(token,app.settings.secret,(error,decoded)=>{
            if(error){
                res.send("Error while validating your token , login again");
            }
            if(decoded){
                return true;
                //res.send("token valid still , enjoy browsing");
            }
        })
    }
    next();
});

app.get('/logout',(req,res)=>{
   res.clearCookie('usercreds').send("you have loggedout");
});
app.get('/sameuser',(req,res)=>{
      res.send("you are able to access with out login again");
});

app.listen(3000,(error,success)=>{
    if(error) throw Error;
    console.log(`Server started`);
});