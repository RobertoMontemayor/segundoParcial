//Yo, Roberto Montemayor, con Matricula 513976, doy mi palabra que he realizado esta actividad con integridad academica.
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT||4000;
const cookieParser = require('cookie-parser');
const session = require('express-session');
const db = require('tnc_mysql_connector');
const moment = require('moment');
//TODO poner lo del tiempo, hay que hacer que lo controle el backend y ya nadamas lo mandas a finish.ejs para que lo renderee
app.use(session({
    secret: 'miSecreto',
    resave: false,
    saveUninitialized: true,
    cookie:{maxAge:100000}
}));


app.use(bodyParser.json());
app.set('view engine', 'ejs');

let horaInicio;
let respuestas = ['','',''];

app.get('/',(req,res)=>{
    console.log('Bienvenido');
    res.render('login');
});

app.post('/login',(req,res)=>{
    console.log('Login');
    respuestas[0]='';
    respuestas[1]='';
    respuestas[2]='';
    req.session.user = 1;
    console.log(req.session);
    horaInicio = moment();
    res.send(200);
});
app.post('/respuesta',(req,res)=>{
    let {answer,num} = req.body;
    console.log(req.session.user);
    console.log(num);
    respuestas[num]= answer;
    console.log(respuestas);
    res.send(200);
});
app.get('/pregunta1',(req,res)=>{
    if(!req.session.user){
        res.redirect('/');
    }else{
        console.log(horaInicio);
        res.render('pregunta1',{resp:respuestas[0]});
    }
    
});
app.get('/pregunta2',(req,res)=>{
    if(!req.session.user){
        res.redirect('/');
    }else{
        console.log(horaInicio);
        res.render('pregunta2',{resp:respuestas[1]});
    }
});
app.get('/pregunta3',(req,res)=>{
    if(!req.session.user){
        res.redirect('/');
    }else{
        console.log(horaInicio);
        res.render('pregunta3',{resp:respuestas[2]});
    }
});
app.get('/allRespuestas',(req,res)=>{
    let state = true;
    respuestas.forEach(respuesta=>{
        if(respuesta===''){
            state = false;
        }
    })
    res.send(state);
});
app.post('/finish',(req,res)=>{

    respuestas.forEach(respuesta=>{
        db.rawQuery(`INSERT INTO Respuesta (respuesta) VALUES(${respuesta})`).then((resolve, reject)=>{
            resolve();
        });
    })
    res.send(200);
});
app.get('/results',(req,res)=>{
    let horaFin = moment();
    let segundos = horaFin.diff(horaInicio,'seconds')%60;
    let minutos = horaFin.diff(horaInicio,'minutes');
    console.log(req.session);
    delete req.session.user;
    console.log(req.session);
    res.render('results',{minutos:minutos,segundos:segundos,r1:respuestas[0],r2:respuestas[1],r3:respuestas[2]});
})
app.listen(port, ()=>{
    console.log(`Dados app running in port ${port}`);
});