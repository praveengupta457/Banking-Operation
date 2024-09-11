var express = require("express")
const router = express.Router();
const mongoose = require('mongoose')

const userSchema=new mongoose.Schema({
    account_No:{
        type:String,
        required:true,
    },
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
    },
    account_balance:{
        type:Number,
    },
    date: { type: Date, default: Date.now 
   },
});

const TransectionSchema = new mongoose.Schema({
   sender:{
     type:String,required:true
   },
   recipient:{type:String,required:true
   },

   amount:{
      type:Number , required:true}
})


mongoose
.connect("mongodb://127.0.0.1:27017/DataBase")
.then(()=>{ console.log("database connected")})
.catch((err)=>console.log("error occured"))

//models 

const User=mongoose.model("userData",userSchema)
const Transaction = mongoose.model("transectionHistory",TransectionSchema)


// viewing all accounts

router.get("/", async (req,res)=>{
   
 try{
     const result= await User.find();
     res.json(result);
     console.log("result",result);
   }catch(error){
      console.error("Error fetching user:", error);
      res.status(500).json({ error: " Server Error" });
   }
 })

 // creating an account

router.post("/",async(req,res)=>{
 const user= req.body;
 const result=await User.create({
   account_No:user.account_No,
   firstName:user.firstName,
   lastName:user.lastName,
   account_balance:user.account_balance,
});
  console.log("result",result);
  return res.status(201).json({msg:"New account created"})

 })

 // viewing a perticular user

 router.get("/:account_No", async (req,res)=>{
try{
     const {account_No}= req.params;
     const result = await User.findOne({account_No})
     console.log("result",result);
     res.json(result)
}catch(error){
   console.error("Error in getting user:", error);
   res.status(500).json({ error: "Internal Server Error" });
}
 })
 

 //updating account

 router.patch('/:account_No',async(req,res)=>{

   try{
    const {account_No}=req.params;
    const userdata=req.body;
    const result=await User.findOneAndUpdate({account_No},userdata,{new:true});

   res.json({msg:"account updated"})
   }catch(error){
      console.error("Error in getting user:", error);
      res.status(500).json({ error: "Internal Server Error" });

   }

 })
//sending money

router.patch('/:account_No/:Raccount_No/:money', async (req, res) => {
   const { account_No, Raccount_No } = req.params;
   const SendMoney = parseInt(req.params.money);
   const { account_balance } = req.body;
 
try {
     const sender = await User.findOneAndUpdate({ account_No: account_No }, { $set: { account_balance: account_balance } }, { new: true });
     const recipient = await User.findOneAndUpdate({ account_No: Raccount_No }, {}, { new: true });
 
     if (!sender || !recipient) {
       return res.status(404).send('Sender or recipient not found');
     }
 
     if (sender && recipient && sender.account_balance >= SendMoney) {
       sender.account_balance -= SendMoney;
       recipient.account_balance += SendMoney;
 
       await sender.save();
       await recipient.save();
 
       const transaction = new Transaction({
         sender: sender.account_No,
         recipient: recipient.account_No,
         amount: SendMoney,
       });
 
       await transaction.save();
 
       return res.send(`Deducted ${SendMoney} from account holder with account number ${account_No} and credited to another account`);
     } else {
       return res.status(400).send('Insufficient funds or sender/recipient not found');
     }
    }
 catch (error) {
     console.error(error);
     return res.status(500).send('some database error');
   }
 });

// deleting account

 router.delete("/:account_No",async(req,res)=>{

   try{
    const {account_No}= req.params;
   const result=await User.findOneAndDelete({account_No})
   res.json({msg:"account deleted"})
   }catch(error){
      console.log("error in deelting user");
      res.status(500).json({ error: "Server Error" });
   }
 })

module.exports = router; 
