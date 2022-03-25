// set Up
import express from "express";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import mongoose from "mongoose";
const app = express();
const router = express.Router()
import cors from "cors";

// set up local
import config from "./app/config.js"
import User from "./app/modules/user.js"
import user from "./app/modules/user.js";
const port = 3000;

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Connect ke mongoDb
mongoose.connect(config.database, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.set('secretKey', config.secret);
app.use(cors());

// router
router.post('/login', async (req, res) => {
    const namaUser = await user.findOne({nama: req.body.nama});
    if(!namaUser){
        res.json({succes: false, message: 'User tidak ada di database'});
    }else{
        if(namaUser.pass != req.body.pass){
            res.json({succes: false, message: 'Password user salah!'})
        } else {
            // membuat token
            // res.json(namaUser);
            const token = jwt.sign({namaUser}, app.get('secretKey'), { expiresIn: "1h" });
            // ngirim balik
            res.json({
                succes: true,
                message: 'Token berhasil didapatkan',
                token
            });
        };
    };
});

// Proteksi route dengan token
router.use((req, res, next) => {
    // mengambil token
    const token = req.headers['authorization'];

    // decode token
    if(token){
        jwt.verify(token, app.get('secretKey'), (err, decoded) => {
            if(err){
                return res.json({sucess: false, message: 'Token salah!'});
            }else{
                req.decoded = decoded;
                if(decoded.exp <= Date.now()/1000){ 
                    res.status(400).json({
                        succes: false,
                        message: 'Token kadaluarsa',
                        date: Date.now()/100,
                        exp: decoded.exp
                    })
                }
                next();
            };
        });
    }else{
        return res.status(403).json({
            sucess: false,
            message:'token tidak tersedia'
        });
    };
});

router.get('/', (req, res) => {
   res.send('Home');
})

router.get('/users', async (req, res) => {
    const data = await User.find({});
    res.json(data);
})

router.get('/profile', (req, res) => {
    res.json(req.decoded.namaUser);
});


// Prefix router
app.use('/api', router);

app.listen(port, () => {
    console.log('Listen at http://localhost:3000');
});