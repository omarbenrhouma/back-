const mongoose = require('mongoose')
const express = require('express')
const app = express();
mongoose.connect("mongodb://127.0.0.1:27017/last")
app.use(express.json())
app.use(express.urlencoded({extended: false}))
const Post =  mongoose.model("Post",
    {
        id:{
            type:String,
            required:false
        },
        imageUrl:{
            type:String,
            required:false
        },
        firstName:{
            type:String,
            required:true
        },
        lastName:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        contactNumber:{
            type:   Number,
            required:true
        },
        age:{
            type:Number,
            required:true
        },
        dob:{
            type:String,
            required:true
        },
        salary:{
            type:Number,
            required:true
        },
        address:{
            type:String,
            required:true
        },
    }
 );

 app.get('/index', async(req, res) =>{
    try {
        const post = await Post.find({});
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
app.get('/get/:id', async(req, res) =>{
    try {
        const {id} = req.params ;
        const post = await Post.find({id:id});
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
app.get('/get',async (req,res)=>{
    const myPosts = await  fetch("https://hub.dummyapis.com/employee?noofRecords=100&idStarts=1");
    const reponse = await myPosts.json();
    for(let i = 0;i<reponse.length;i++){
     const data = new Post ({
         id:reponse[i]['id'],
         imageUrl:reponse[i]['imageUrl'],
         firstName:reponse[i]['firstName'],
         lastName:reponse[i]['lastName'],
         email:reponse[i]['email'],
         contactNumber:reponse[i]['contactNumber'],
         age:reponse[i]['age'],
         dob:reponse[i]['dob'],
         salary:reponse[i]['salary'],
         address:reponse[i]['address'],
     })
     data.save();
    }
    try {
        const post = await Post.find({});
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({message: error.message});
    }    
 })
 app.delete('/deleteall', async(req, res)=>{
    try {
        const post = await Post.deleteMany();
    res.status(200).json(post);
    
} catch (error) {
    res.status(500).json({message: error.message})
}
})
 app.delete('/delete'+'/:id', async(req, res)=>{
        try {
            const {id} = req.params ;
            const post = await Post.deleteOne({id:id});
            if(post.deletedCount===0){
                return res.status(404).json({message: `cannot find any post with ID ${id}`})
            }
        res.status(200).json(post);
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.post('/create', async(req, res) => {
    try {
        const text= req.body.firstName[0]
        const tet=req.body.lastName[0]
        const id = {id: await Post.find().count()+1}
        const img = {imageUrl:'https://hub.dummyapis.com/Image?text='+text+tet+'&height=120&width=120'}
        var obj = Object.assign(id,img,req.body)
        const post = await Post.create(obj)
        res.status(200).json(obj);
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
})
app.put('/edit/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const post = await Post.updateOne({id:id}, req.body);
        const updpost = await Post.find({id:id});
        const length = Object.keys(updpost).length
        if(length === 0){
            return res.status(404).json({message: `cannot find any post with ID ${id} or maybe you change the ID`})
        }else{
            return  res.status(200).json(updpost);
        }
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

 app.listen(5000,()=>{console.log('server run')})
