const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion} = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config()



// Middleware Connections
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.izqajim.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try{
            const database = client.db('cruds');
            const userCollections = database.collection('users');

            //all get api
            //get all user
            app.get('/users', async (req, res)=>{
                const cursor = userCollections.find({});
                const result = await cursor.toArray();
                if(result.length > 0){
                    res.send({result, success: true});
                }
                else{
                    res.send({success: false, message: 'Something went wrong'});
                }


               
            })

            //get one user
            app.get('/users/:id', async(req, res)=>{
                const id = req.params.id;
                const query = {_id:new ObjectId(id)};
                console.log(query);
                const result = await userCollections.findOne(query);
                if(result){
                    res.send({result, success: true});
                }
                else{
                    res.send({success: false, message: 'Something went wrong'});
                }

                
            })

            //all post api
            app.post('/users', async(req, res) => {
                const user = req.body;
                console.log(user);
                const result = await userCollections.insertOne(user);
                if(result.insertedId){
                    res.send({result, success: true});
                }
                else{
                    res.send({success: false, message: 'Something went wrong'});
                }
               
            })

            //all delete api
            app.delete('/users/:id', async(req, res)=>{
                const id = req.params.id;
                const query = {_id:new ObjectId(id)};
                console.log(query);
                const result = await userCollections.deleteOne(query);
                if(result.acknowledged){
                    res.send({result, success: true});
                }
                else{
                    res.send({success: false, message: 'Something went wrong'});
                }

                
            })

            //update api
            app.put('/users/:id', async(req, res)=>{
                const id = req.params.id;
                const data = req.body;
                const updateDoc = {$set: data};
                const filter = {_id:new ObjectId(id)};
                const result = await userCollections.updateOne(filter, updateDoc);
                if(result.acknowledged){
                    res.send({result, success: true});
                }
                else{
                    res.send({success: false, message: 'Something went wrong'});
                }
                // console.log(filter);
            })



    }
    finally{

    }
}
run().catch(error => console.error(error));


// Connection
app.get('/', (req, res)=>{
    res.send('hello world');
})


const PORT = process.env.PORT || 6000
app.listen(PORT, ()=>{
    console.log('App running in port: '+PORT)
})