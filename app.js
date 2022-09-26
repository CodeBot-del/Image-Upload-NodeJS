const express = require('express');
const app = express();
const multer = require("multer");
const path = require("path");

// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb)=>{
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});

// define the multer 
const upload = multer({
    storage: storage,
    limits: {fileSize: 5000000}
});

// expose the folder so images can be accessed to the browser on the client side
app.use('/profile', express.static('upload/images'));

// create the route 
app.post("/upload", upload.single('profile'), (req, res)=>{  // profile is the name of the input field, .single for a single file, for many files use .multiple
    console.log(req.file);

    res.json({
        success: 1, 
        profile_url: `http://localhost:4000/profile/${req.file.filename}`
    })
});

function errHandler(err, req, res, next){
    if(err instanceof multer.MulterError){
        res.json({
            success: 0,
            message: err.message
        })
    }
}

app.use(errHandler);

// start the server
app.listen(4000, ()=>{
    console.log("server up and running");
})
