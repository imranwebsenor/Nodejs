To Upload file
npm i express-fileupload
app.use(upload()); in server.js file
in controller get files with req.files

istall const path = require('path');
const {v4 : uuidv4} = require('uuid');
npm i uuid

// const file = req.files.profile_picture;
//       let extName = path.extname(file.name)
//       file.name = uuidv4()+extName;
//       const uploadPath = "./public/uploads/" + file.name;
      
//       console.log('req------------', uploadPath);
//       file.mv(uploadPath, async (err) => {
//           if (err) {
//               return res.status(500).send(err);
//           }
//       });


loggin in nodejs
1. npm install winston

/*----------------------------------*/
1. npm install --save cookie-parser