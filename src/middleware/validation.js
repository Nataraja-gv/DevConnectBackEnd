const validater= require("validator");


const ValidationForm = (req)=>{
    const {name, email, password, age, gender, skills } = req.body;
    const allowedGender =["male","female","others"];
    
    if (!name || !email || !password || !age || !gender || !skills) {
        throw new Error("All fields are required");
      }
      

    if(!validater.isEmail(email)){
        throw new Error("email inValid")
    }

    if(!validater.isStrongPassword(password)){
        throw new Error("password should strong")
    }

    if(!allowedGender.includes(gender)){
     throw new Error(` invalid gender ${gender} type`)
    }
    if(age<18){
        throw new Error("age must be greater than 18")
    }
    
}


module.exports=ValidationForm