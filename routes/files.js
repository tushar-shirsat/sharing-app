const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const File = require("../models/file");
const sendMail = require("../services/emailService")
const { v4: uuid4 } = require("uuid");

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniquName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniquName);
  },
});

let upload = multer({
  storage,
  limit: { fileSize: 1000000 * 100 },
}).single("myfile");

router.post("/", (req, res) => {
  

  // store file
  upload(req, res, async (err) => {
    // validate request
  if (!req.file) {
    return res.json({ error: "All fields are required." });
  }

    if (err) {
      return res.status(500).send({ error: err.message });
    }

    const file = new File({
      filename: req.file.filename,
      uuid: uuid4(),
      size: req.file.size,
      path: req.file.path
    });
    const response = await file.save();
    return res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
  });

  // store into database

  //Response -> Link
});

router.post('/send',async (req,res) =>{
    const {uuid,emailTo,emailFrom} = req.body;

    if(!uuid || !emailFrom || !emailTo){
        return res.status(422).send({error: "All fields are required."})
    }

    //get data from data base 
    const file = await File.findOne({uuid});
    if(file.sender){
        return res.status(422).send({error: "Email already sent.."})
    }

    file.sender = emailFrom;
    file.receiver = emailTo;
    const response =await file.save();

    // send email
    sendMail({
        from: emailFrom,
        to: emailTo,
        subject: "inShare file sharing",
        text: `${emailFrom} shared a file with you`,
        html: require('../services/emailTemplate')({
            emailFrom,
            downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size: parseInt(file.size/1000) + 'KB',
            expires: '24 hours'
        })
    })
    return res.send({sucess: true})
})

module.exports = router;
