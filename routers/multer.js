const multer = require("multer");
const fs = require('fs');
const path = require('path');

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './images');
//     },
//     filename: (req, file, cb) => {
//         const originalname = file.originalname;
//         const destination = './images';
//
//         const getUniqueFilename = (filename, suffix) => {
//             const ext = path.extname(filename);
//             const name = path.basename(filename, ext);
//
//             return `${name}${suffix}${ext}`;
//         };
//
//         const checkFileExists = (filePath, callback) => {
//             fs.access(filePath, fs.constants.F_OK, (err) => {
//                 if (err) {
//                     callback(false);
//                 } else {
//                     callback(true);
//                 }
//             });
//         };
//
//         let suffix = '';
//         let count = 1;
//
//         const generateFilename = () => {
//             const newFilename = suffix ? getUniqueFilename(originalname, `(${suffix})`) : originalname;
//             const filePath = path.join(destination, newFilename);
//
//             checkFileExists(filePath, (fileExists) => {
//                 if (fileExists) {
//                     suffix = count++;
//                     generateFilename();
//                 } else {
//                     cb(null, newFilename);
//                 }
//             });
//         };
//
//         generateFilename();
//     }
// });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images');
    },
    filename: (req, file, cb) => {
        const account_id = req.headers['account_id'];

        if (account_id) {
            const newFilename = `user_avatar_${account_id}${path.extname(file.originalname)}`;
            cb(null, newFilename);
        } else {
            cb(new Error('account_id not provided in headers'));
        }
    }
});


const upload = multer({ storage });

module.exports = upload;