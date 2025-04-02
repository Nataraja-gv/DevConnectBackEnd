const multer= require("multer");


const storage = multer.diskStorage({
 destination:function(req,file,cb){
    cb(null,"src/uploads")
 },
 filename:function(req,file,cb){
    const filename = file.originalname;
    cb(null,filename)
 }
});

const uploads = multer({storage:storage})


module.exports=uploads