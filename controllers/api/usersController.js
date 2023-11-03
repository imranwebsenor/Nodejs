const {validationResult} = require("express-validator");
const {body} = require("express-validator");
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET || "yourSecretKey";
const path = require("path");
const {v4: uuidv4} = require("uuid");
const User = require("../../models/userModel.js");
const Address = require("../../models/addressModel.js");
const EventEmitter = require("events");
const myEmitter = new EventEmitter();
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
var fs = require("fs");
var pdf = require("html-pdf-node");
const ejs = require("ejs");
const puppeteer = require("puppeteer");
const ISODate = require("isodate");
const sendMail = require("../../mails/registrationmail");
const errorRsponse = require("../../utils/errorResponse");
const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/asyncMiddleware");
const paginationHelper = require("../../utils/pagination");



const pagination =asyncHandler(async(req,res,next)=>{
    let filter = {createdAt:{$gte:ISODate('2023-10-28')}};
    let response = await paginationHelper(req,User,filter);
    res.status(200).json({response:response})
    

})
const handleSession = async (req, res) => {
    req.session.count = 99;
    res.send("session set " + req.session.count + " times");
};

const handleCookies = async (req, res) => {
    res.cookie("name", "imran", {
        maxAge: 900000,
        httpOnly: true
    }); // set Cookie
    res.send(req.cookies["name"]); // get cookies
    res.clearCookie("name"); // clear cookies
};
const downloadHtmlasPdf = async (req, res,next) => {
    try { // downloading html content as pdf using puppeteer

        const data = {
            title: "John Doe",
            heading: "heading",
            content: "helllo world"
        };
        const template = fs.readFileSync("./templates/participants.ejs", "utf-8");
        const html = ejs.render(template, data);

        // Launch a headless Chromium browser
        const browser = await puppeteer.launch({headless: "new"});
        const page = await browser.newPage();

        // Set the HTML content of the page
        await page.setContent(html);

        // Generate a PDF from the page
        fileName = `${
            uuidv4()
        }.pdf`;
        let pdfbuffer = await page.pdf({path: "output.pdf", format: "A4"});
        fs.writeFileSync(`./public/pdf/${fileName}`, pdfbuffer);
        // Close the browser
        await browser.close();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=output.pdf");

        // Send the PDF as binary data
        res.download(`./public/pdf/${fileName}`, "exported-data.pdf", (err) => {
            if (err) {
                res.status(500).json("Error In downloading file");
            }
            fs.unlink(`./public/csv/${fileName}`, function (err) {});
        });
    } catch (error) {
        next(new ErrorResponse('An Error Occured',500));
    }
};

const downloadAndDeleteCsv = asyncHandler(async (req, res, next) => { // downloading csv file using csv-writer
    const data = [
        {
            name: "John",
            age: 30,
            city: "New York"
        }, {
            name: "Alice",
            age: 25,
            city: "Los Angeles"
        }, {
            name: "Bob",
            age: 35,
            city: "Chicago"
        },
    ];

    // Create a CSV writer with the desired options
    fileName = `${uuidv4()}.csv`;
    
    const csvWriter = createCsvWriter({
        path: `./public/csv/${fileName}`, // The path to the CSV file
        header: [
            {
                id: "name",
                title: "Name"
            }, {
                id: "age",
                title: "Age"
            }, {
                id: "city",
                title: "City"
            },
        ]
    });

    // Write the data to the CSV file
    csvWriter.writeRecords(data).then(() => {
        res.download(`./public/csv/${fileName}`, "exported-data.csv", (err) => {
            if (err) {
              next(new ErrorResponse('Error In downloading file"',500));
            }
            fs.unlink(`./public/csv/${fileName}`, function (err) {});
        });
    }).catch((error) => {
        res.status(500).json("Error In downloading file");
        next(new ErrorResponse('Error In downloading file"',500));

    });
});


const register = asyncHandler(async (req, res, next) => {
    const {
        name,
        username,
        password,
        email,
        phone
    } = req.body;

    await User.create({
        phone,
        name,
        email,
        username,
        password
    }).then((user) => res.status(200).json({message: "User successfully created", user}));
});


const login = asyncHandler(async (req, res, next) => {
    const {email, password} = req.body;
    const user = await User.find({email, password});
    if (user.length > 0) {
        const token = jwt.sign({
            user
        }, secretKey, {expiresIn: "24h"});
        res.status(200).json({user: user, token});
    } else {
        next(new ErrorResponse(`Invalid Email or Password`, 404));
    }
});


const getAllUsers = asyncHandler(async (req, res) => {
    let resp = await User.find().populate('addresses');
    // let resp =await Address.find().populate('user')
    // let response = await paginationHelper(req,User);
    res.status(200).json(resp);
});


const getUser = asyncHandler(async (req, res) => {
    const user = await User.find({_id: req.params.id});
    res.status(200).json({success: true, message: "data retrieved successfully", data: user});
});


const updateUser = asyncHandler(async (req, res) => {
    const updatedData = req.body;
    const options = {
        new: true
    };
    const user = await User.findByIdAndUpdate(req.params.id, updatedData, options); // options defines wether to return updated data in body or not
    res.status(200).json({success: true, message: "data updated successfully", data: user});
});


const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndRemove(req.params.id);
    if (user) {
        // await user.remove().exec();
    } 
    res.status(200).json({success: true, message: "user deleted successfully"});
});


const addUserPhoto = asyncHandler(async (req, res, next) => {

    if (req ?. files ?. profile_picture) {
        const file = req.files.profile_picture;
        let extName = path.extname(file.name);
        file.name = uuidv4() + extName;
        var uploadPath = "./public/uploads/" + file.name;

        file.mv(uploadPath, async (err) => {
            if (err) {
                return res.status(500).send(err);
            }
        });
        var uploadPath = "/public/uploads/" + file.name;
        let user = await User.findByIdAndUpdate(req.params.id, {
            profile_picture: uploadPath
        }, {new: true});

        res.status(200).json({success: true, user: user, message: "Profile photo Updated successfully"});
    } else {
        next(new ErrorResponse("please select profile picture", 422));
    }
});


const userAddress = asyncHandler(async (req, res) => {
    const {
        address1,
        address2,
        city,
        state,
        country,
        pincode,
        user,
        nearest_area,
        working_slots
    } = req.body;
    
    let slots = [];
    
    working_slots.map((ele, key) => {
        slots.push({from: ele[0], to: ele[1]});
    });
    let address = await Address.create({
        address1,
        address2,
        city,
        state,
        country,
        pincode,
        user,
        nearest_area,
        working_slots: slots
    });
    res.status(200).json({success: address});
});


const sendEmail = asyncHandler(async (req, res) => {
   
    const data = {
        title: "John Doe",
        heading: "heading",
        content: "helllo world"
    };
    await sendMail(data);
    res.status(200).json({success: "true"});
});


const updateAddress = async (req, res) => {
    try {
        let setData = {};

        if (req.body ?. second_address) {
            setData["nearest_area.1"] = req.body ?. second_address;
        }

        if (req.body ?. second_address) {
            setData["nearest_area.2"] = req.body ?. third_address;
        }

        if (req.body ?. working_slots) {
            req.body ?. working_slots.map((ele, key) => {
                setData[`working_slots.${key}.from`] = ele[0];
                setData[`working_slots.${key}.to`] = ele[1];
            });
        }
        let res = await Address.updateOne({
            _id: req.params.id
        }, {$set: setData});
    } catch (e) {
        res.status(403).json(e);
    }
};


const validate = (method) => {
    switch (method) {
        case "createUser":
            {
                return [
                    body("name", "name doesn't exists").exists(),
                    body("username", "userName doesn't exists").exists(),
                    body("email", "Invalid email").exists().isEmail(),
                    body("password", "password doesn't exists").exists(),
                    body("password", "phone  must be of 6 characers").isLength(
                        {min: 10}
                    ),
                    body("phone", "phone doesn't exists").exists(),
                    body("phone", "phone digits must be 10").isLength(
                        {min: 10}
                    ),
                ];
            }
    }
};

module.exports = {
    getAllUsers,
    register,
    validate,
    login,
    getUser,
    updateUser,
    deleteUser,
    addUserPhoto,
    userAddress,
    downloadAndDeleteCsv,
    downloadHtmlasPdf,
    updateAddress,
    sendEmail,
    handleCookies,
    handleSession,
    pagination,
};
