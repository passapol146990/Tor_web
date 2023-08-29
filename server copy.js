const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const dotenv = require('dotenv')
dotenv.config({ path: './.env'})
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getUsers,
    switchRoom
  } = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Controllers
const weatherController = require('./controllers/weatherController')
const parkingController = require('./controllers/parkingController')
const adminController = require('./controllers/adminController')
const login_pageController = require('./controllers/login_pageController')
const report_serviceController = require('./controllers/report_serviceController')
const report_weatherController = require('./controllers/report_weatherController')
const report_parkingController = require('./controllers/report_parkingController')
const report_naviController = require('./controllers/report_naviController')
const report_statusController = require('./controllers/report_statusController')
const report_chatController = require('./controllers/report_chatController')
const report_logController = require('./controllers/report_logController')

// Routes
//const playerRoutes = require('./routes/player.routes');
//const homeRoutes = require('./routes/index.routes');
const {getHomePage} = require('./routes/index');
const {getUser} = require('./routes/user');
const {getTicket} = require('./routes/ticket');

const {addUserPage, addUser, deleteUser, editUser, editUserPage } = require('./routes/user');
const {addTicketPage, addTicket, editTicket, editTicketPage } = require('./routes/ticket');
const port = 2000;


// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
const db = mysql.createConnection ({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});



let connection = db;

// connection.connect((err) => {
//   if (err) {
//     console.error('Error connecting to database:', err);
//   } else {
//     console.log('Connected to database');

//     // ดึงข้อมูลตารางทั้งหมด
//     connection.query('SHOW TABLES', (err, results) => {
//       if (err) {
//         console.error('Error fetching tables:', err);
//       } else {
//         console.log('Tables in the database:');
//         results.forEach(table => {
//           console.log(table[`Tables_in_${connection.config.database}`]);
//         });

//         // ปิดการเชื่อมต่อกับฐานข้อมูล
//         connection.end();
//       }
//     });
//   }
// });
















// connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;


// configure middleware
app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload
//app.use('/auth', require('./routes/auth'));


// ///////////////////////////////////////////////////////////////////////////////////////////////
// npm i crypto-js
const crypto = require('crypto-js');
const cookieSession = require('cookie-session');
const user = require('./routes/user');

function sha3_256(input) {
    const hash = crypto.SHA3(input, { outputLength: 256 });
    return hash.toString(crypto.enc.Hex);
}


app.post('/register', (req, res, next)=> {
bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    connection.execute(
        'INSERT INTO users (email, password,fname, lname) VALUES (?, ?, ?, ?)',
        [req.body.email, hash, req.body.fname, req.body.lname ],
        function(err, results, fields) {
        if(err) {
            res.json({staus: 'error', meassge: err})
            return
        }
        res.json({staus: 'OK'})
        
        }
    );
    })
})

app.get('/login',(req, res, next)=> {
  res.redirect('/login_page')
})

app.get('/api-token/:token', (req, res) => {
  const token = req.params.token;
  const sql = `SELECT * FROM token WHERE token = ?`;
  db.query(sql, [token], (err, results) => {
    if (err) {
      res.status(500).json(false)
    }
    if (results.length > 0) {
      res.status(200).json(true)
    } else {
      res.status(500).json(false)
    }
  });
});

app.post('/auth/login',async (req,res)=>{
  const email = req.body.email;
  const password = req.body.password;
  const token = sha3_256(email+password);
  console.log(token);
  const session = await fetch('http://localhost:3000/api-token/'+token)
  .then(response => response.json())
  .then(data => {
    return data
  })
  .catch(error => {
    console.error('Error fetching API data:', error);
    return false;
  });

  // if(session){
  //   res.redirect('/')
  // }else{
  //   res.redirect('/login')
  // }
})


app.post('/auth/login2',async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const token = sha3_256(email+password);
  console.log(token);
  const ss = await fetch('http://localhost:3000/users/users_base').then( (users) => {
    return users;
  }).catch(err => {return err;})

  console.log("ss =>",ss)
  const sql = `SELECT * FROM user_base WHERE token = ?`;

  db.query(sql, [token], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).send('Error querying database');
      return;
    }

    if (results.length > 0) {
      console.log('Success'); // Email found in database
      res.status(200).redirect('/') // Respond with a success message
    } else {
      console.log('Email not found'); // Email not found in database
      res.status(401).send('Email not found'); // Respond with an unauthorized message
    }
  });
});
// ///////////////////////////////////////////////////////////////////////////////////////////////
var userInChat = []
// Apage_Chat
app.post('/chatlogin',(req,res)=>{
  console.log(req.params.username)
  userInChat.push(req.params.username)
  res.redirect('/apageChat')
})

app.get('/login_chat',(req,res)=>{
  res.render('index.ejs') // Respond with a success message
})



// ///////////////////////////////////////////////////////////////////////////////////////////////

app.get('/weather', weatherController)
app.get('/parking', parkingController)
app.get('/admin', adminController)
app.get('/login_page', login_pageController)
app.get('/report_service', report_serviceController)
app.get('/report_weather', report_weatherController)
app.get('/report_parking', report_parkingController)
app.get('/report_navi', report_naviController)
app.get('/report_status', report_statusController)
app.get('/report_chat', report_chatController)
app.get('/report_log', report_logController)


app.get('/',getHomePage);

app.get('/user',getUser);
app.get('/ticket',getTicket);
app.get('/open',addTicketPage);
app.post('/open',addTicket);
app.post('/open_edit/:id',editTicket);
app.get('/open_edit/:id',editTicketPage);
app.get('/add',addUserPage);
app.post('/add',addUser);
app.post('/edit/:id',editUser);
app.get('/edit/:id',editUserPage);
app.get('/delete/:id',deleteUser);

// === Set static folder === 
//app.use(express.static(path.join(__dirname, "views")));

const botName = "ChatBot";

// === Run when client connects === 
io.on("connection", (socket) => {
  //console.log(io.of("/").adapter);
  socket.on("joinRoom", ({ username, room, type}) => {
    console.log('joinRoom <- username:', username, ", room:", room, ", type:", type)
    const user = userJoin(socket.id, username, room, type);

    socket.join(user.room);

    // === Welcome current user === 
    socket.emit("message", formatMessage(botName, "Welcome to Live Chat"));

    // === Send FAQ === 
    if(user.type!='admin'){
      socket.emit("messageFAQ", formatMessage(botName, "FAQ"));
    }

    // === Broadcast when a user connects ===
    socket.broadcast
      .to('admin')
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
    );

    // === Send users and room info === 
    io.to('admin').emit("Users", {
      users: getUsers(),
    });
  });

  socket.on("faq", (faq) => {
    console.log('faq from:', faq)
    //if( faq.username!='admin'){
    const qid = faq.qid;
    socket.emit('messageAns', formatMessage(botName, qid.toString()));
    //}
  });

  // === Admin Join a User ===
  socket.on("joinUser", ({ username, userroom}) => {
    console.log(username +' join '+ userroom);
    socket.join(userroom);

    switchRoom(username, userroom);

    socket.emit("message", formatMessage(botName, username + " have joined " + userroom));

    socket.broadcast
      .to(userroom)
      .emit(
        "message",
        formatMessage(botName, `${username} has joined the chat`)
    );

  });

  // === Listen for chatMessage === 
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // === Runs when client disconnects === 
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to('admin').emit("Users", {
        users: getUsers(),
      });
    }
  });
});

// routes for the app
/*app.use('/', homeRoutes);
app.use('/player', playerRoutes);
app.get('*', function(req, res, next){
    res.status(404);

    res.render('404.ejs', {
        title: "Page Not Found",
    });

});*/

// set the app to listen on the port

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
