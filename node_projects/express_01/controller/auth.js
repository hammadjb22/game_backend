const jwt=require('jsonwebtoken')
const User=require('../model/user').User
const fs=require('fs')
const path=require('path')
const privateKey=fs.readFileSync(path.resolve(__dirname,'../private.key'),'utf-8')
const bcrypt=require('bcrypt')
exports.createUser = (req, res) => {
  // console.log("body:",req.body);
  const user= new User(req.body)
  const hash=bcrypt.hashSync(req.body.password,5)
  user.password=hash
  user.confirmPassword=hash
  user.token = jwt.sign({email:req.body.email},privateKey,{algorithm:'RS256'})
   
  // products.push(req.body);
  user.save().then((result) => {
    res.status(201).json({success:true,description:"user created successfully"})  
  })
  .catch((err) => {
    res.status(400).json(err)  
    console.error('Error saving user:', err);
  })
};

exports.login = async(req, res) => {
  // console.log("body:",req.body);
  try{
    const doc= await User.findOne({email:req.body.email})
    const isAuthenticated=bcrypt.compareSync(req.body.password,doc.password)
    if(isAuthenticated){
    const token = jwt.sign({email:req.body.email},privateKey,{algorithm:'RS256'})
    res.status(200).json({token,result:'success'})
  }else{
    res.status(401).json({result:'fail'})
  }
  }
  catch(err){
    res.status(401).json(err)
  }
};
