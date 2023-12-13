import multer from "multer";
import fs from "fs";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { uid } = req.params;
    let uploadPath = "";

    if (file.fieldname === "profileImage") {
      uploadPath = `uploads/${uid}/profiles`;
    } else if (file.fieldname === "productImage") {
      uploadPath = `uploads/${uid}/products`;
    } else if (file.fieldname === "documentDNI") {
      uploadPath = `uploads/${uid}/documentsDNI`;
    } else if (file.fieldname === "comprobanteDomicilio") {
      uploadPath = `uploads/${uid}/comprobanteDomicilio`;
    } else if (file.fieldname === "comprobanteEstadoCuenta") {
      uploadPath = `uploads/${uid}/comprobanteEstadoCuenta`;
    }

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage, createParentPath: true });

export default upload;
