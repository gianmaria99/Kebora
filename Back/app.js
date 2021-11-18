const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv'); 
const dbService = require('./dbService');
const path = require('path');
const nJwt = require('njwt');
const secureRandom = require('secure-random');
var cookieParser = require('cookie-parser')

const app = express();

app.use(cookieParser())
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : false}));
app.use(express.static(path.join(__dirname, '../' ,'/Front')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'../','Front/views'));

// auth (CREATES JWT)
app.post('/auth', (req,res) =>{
    
    const db = dbService.getDbServiceInstance();
    const { name } = req.body;
    const { password } = req.body
    
    const granted = db.getAuth(name, password);
    
    granted
    .then(data => {
        if(data){
            console.log('autenticazione confermata a:', name, new Date())
            var signingKey = secureRandom(256, {type: 'Buffer'});
            var claims = {
                iss: "vivGroup",  // The URL of your service
                sub: `${name}/${data.ID}`,    // The UID of the user in your system
                scope: data.ruolo
                }
            var jwt = nJwt.create(claims,signingKey);
            jwt.setExpiration(new Date().getTime() + (60*60*1000)); // One hour from now 
            var token = jwt.compact();

//store signkey
            var base64SigningKey = signingKey.toString('base64');
            db.storeSecret(name, password, base64SigningKey);

//add token to cookies     
            res
            .cookie("access_token", token, {
                httpOnly: true,
                ecure: process.env.NODE_ENV === "production",
                })
            .cookie("user",`${name}/${data.ID}`)
            .redirect('/menu');     
        }else{
            console.log('autenticazione non accettata', name)
            res.render('autentication',{message:"NOT CORRECT AUTH CREDENTIALS"})
        }
    })
});

//get to the menu (VERIFIED)
app.get('/menu',(req,res) =>{ 
    const db = dbService.getDbServiceInstance();
    
    let user;
    let ID;
    let token;;
    if(req.cookies.user){
        user = req.cookies.user.split('/')[0]
        ID = req.cookies.user.split('/')[1]
        token = req.cookies.access_token;
    }
    
   
    let secret = db.getSecret(user, ID);

    secret
    .then(data => {           
        if(data){
            data = Buffer.from(data, 'base64');
        nJwt.verify(token,data,function(err,verifiedJwt){
            if(err){
              //console.log(err); // Token has expired, has been tampered with, etc 
              let msg = 'Error in authentication process... ';
              if(err.userMessage==='Jwt is expired'){
                msg = 'Session timeout, please authenticate again for security reasons';
              }
              console.log('non verificato',user)
              res.render('notAuth',{msg:msg})
            }else{
              //console.log(verifiedJwt); // Will contain the header and body
              console.log('verificato',user,'menu', new Date())
              res.render('menu',{name:user})
            }
        })
        }else{
            let msg = 'Authenticate again for security reasons'
            res.render('notAuth',{msg:msg})
        }
    })
})

// create ordini
app.post('/insertOrdini',(req, res) => {
    const insert = req.body;
    const db = dbService.getDbServiceInstance();
    
    const result = db.insertNewOrder(insert);
    
    result
    .then(function(data)
    {
        res.json(data)
    })
    .catch(err => console.log(err))

});

// create polvere
app.post('/insertPolvere',(req, res) => {
    const insert = req.body;
    const db = dbService.getDbServiceInstance();
    
    const result = db.insertNewPowder(insert);
    
    result
    .then(function(data)
    {
        res.json(data)
    })
    .catch(err => console.log(err))

});

//first page to load
app.get('/',(req,res,next) => {
    return res.render('autentication',{message:"PLEASE AUTHENTICATE"});
})
    
//tabella ordini (VERIFIED)
app.get('/ordiniTab',(req,res,next) => {
    const db = dbService.getDbServiceInstance();

    let user;
    let ID;
    let token;
    if(req.cookies.user){
        user = req.cookies.user.split('/')[0]
        ID = req.cookies.user.split('/')[1]
        token = req.cookies.access_token;
    }
    let secret = db.getSecret(user, ID);
    
    secret
    .then(data => {           
        if(data){
            data = Buffer.from(data, 'base64');
        nJwt.verify(token,data,function(err,verifiedJwt){
            if(err){
              //console.log(err); // Token has expired, has been tampered with, etc 
              let msg = 'Error in authentication process... ';
              if(err.userMessage==='Jwt is expired'){
                msg = 'Session timeout, please authenticate again for security reasons';
              }
              console.log('non verificato',user)
              res.render('notAuth',{msg:msg})
            }else{
              //console.log(verifiedJwt); // Will contain the header and body
              console.log('verificato',user,'tabellaOrdini', new Date())
              res.render('tabellaOrdini')
            }
        })
        }else{
            let msg = 'Authenticate again for security reasons'
            res.render('notAuth',{msg:msg})
        }  
    })
})

//tabella polvere (VERIFIED)
app.get('/polvereTab',(req,res,next) => {
    const db = dbService.getDbServiceInstance();

    let user;
    let ID;
    let token;
    if(req.cookies.user){
        user = req.cookies.user.split('/')[0]
        ID = req.cookies.user.split('/')[1]
        token = req.cookies.access_token;
    }
    let secret = db.getSecret(user, ID);
    
    secret
    .then(data => {           
        if(data){
            data = Buffer.from(data, 'base64');
        nJwt.verify(token,data,function(err,verifiedJwt){
            if(err){
              //console.log(err); // Token has expired, has been tampered with, etc 
              let msg = 'Error in authentication process... ';
              if(err.userMessage==='Jwt is expired'){
                msg = 'Session timeout, please authenticate again for security reasons';
              }
              console.log('non verificato',user)
              res.render('notAuth',{msg:msg})
            }else{
              //console.log(verifiedJwt); // Will contain the header and body
              console.log('verificato',user,'tabellaPolvere', new Date())
              res.render('tabellaPolvere')
            }
        })
        }else{
            let msg = 'Authenticate again for security reasons'
            res.render('notAuth',{msg:msg})
        }
    })
})

// prelevare i clienti (per autocomplete)
app.get('/clienti',(req, res) => {
    const db = dbService.getDbServiceInstance();
    const result = db.getClienti();
    
    result
    .then(data => res.json({data : data}))
    .catch(err => console.log(err))

});

// prelevare la polvere (per autocomplete)
app.get('/polvere',(req, res) => {
    const db = dbService.getDbServiceInstance();
    const result = db.getPolvere();
    
    result
    .then(data => res.json({data : data}))
    .catch(err => console.log(err))

});

// get all ordini
app.get('/getAllOrdini',(req, res) => {
    const db = dbService.getDbServiceInstance();
    const result = db.getAllDataOrdini();
    
    result
    .then(data => res.json({data : data}))
    .catch(err => console.log(err))

});

// get all polvere
app.get('/getAllPolvere',(req,res,) =>{
    const db = dbService.getDbServiceInstance();
    const result = db.getAllDataPolvere();
    
    result
    .then(data => res.json({data : data}))
    .catch(err => console.log(err))
})

//exit the application and get to the auth page
app.get('/exit',(req,res) =>{
    const db = dbService.getDbServiceInstance();
    let user = req.cookies.user.split('/')[0]
    let ID = req.cookies.user.split('/')[1]
    let exit = db.cancelSecret(user, ID);

    exit
    .then(data=>{
        if(data){
            res
            .cookie('access_token',null)
            .render('autentication',{message:'exit correcly'})
        }
   })
    

})
 
// update ordini
app.patch('/updatePolvere/:id',(req,res)=>{
    const { id } = req.params;
    const db = dbService.getDbServiceInstance();
    const result = db.updateRowByIdPolvere(id,req.body);

    result
    .then(data => res.json({success : data}))
    .catch(err => console.log(err))
})

// update ordini
app.patch('/updateOrdini/:id',(req,res)=>{
    const { id } = req.params;
    const db = dbService.getDbServiceInstance();
    const result = db.updateRowByIdOrder(id,req.body);

    result
    .then(data => res.json({success : data}))
    .catch(err => console.log(err))

})


// delete ordini
app.delete('/deleteOrdini/:id',(req,res) =>{
    const { id } = req.params;
    const db = dbService.getDbServiceInstance();
    const result = db.deleteRowByIdOrder(id);
    
    result
    .then(data => res.json({success : data}))
    .catch(err => console.log(err))
})


app.listen(process.env.PORT, ()=> console.log(`app running on port ${process.env.PORT}`))
