
// import mongoose from 'mongoose' 
const schedule = require('node-schedule');
const mongoose = require('mongoose');
const FCM = require('fcm').FCM;
const express = require('express');    

const app = express();

// setup for firebase cloud messagge
var serverKey = 'AAAAl7gMyoE:APA91bHzzmOAPh3ljX8BoDShqwP704ngrjxPZIESRHCcO5ugWn5idvwjjpPSS4xTLVNY0Vha5yw7mfq37Pp7ucJPd5ebZc99AopX8WfD5t7n3JMttXQVb-ixsDahkqG7S41OWhzv3jX6';
var fcm = new FCM(serverKey);



mongoose.connect("mongodb+srv://DATN:long1234@cluster0.oi7m08w.mongodb.net/DATN", (err)=>{
    if(!err) console.log('db connected');
    else console.log('error');
})

const Postman = new mongoose.Schema({
    id:{
        type:String,
        require:true,
    },
    lastUpdate:{
        type:String,
        require:true,
    },
    objectJSON:{
        type:String, 
        require:true,
    },
    Battery:{
        type: String,
        require: true,
    },
    RainDay:{
        type: String,
        require: true,
    },
    RainHour:{
        type: String,
        require: true,
    },
    Year:{
        type: String,
        require: true,
    },
    Month:{
        type: String,
        require: true,
    },
    Day:{
        type: String,
        require: true,
    },
    Hour:{
        type: String,
        require: true,
    },
    Min:{
        type: String,
        require: true,
    },
    Rssi:{
        type: String,
        require: true,
    }

})
// mongo se tu chuyen ten Post thanh so nhieu va lowercase "posts"
const Post = mongoose.model('Post', Postman);

// var data = Post.find({Day: "27", Hour: { $in: [ "15", "16","17"]} },function(err,result){
//     console.log(result[1]["RainDay"]);
//     }).sort({id:-1});
// app.get("/RainDay/find", async function(req, res){
//     var data = await Post.find(
//         {Day: "27", Hour: { $in: [ "15", "16","17"]} }
//         ).sort({id:-1});
//     res.json(data)
// });
app.get("/allData", module.exports = async (req, res) => {
    await within(getUsers, res, 7000)
});
app.get("/RainDay", async function(req, res){
        var data = await Post.find(
            {Month: '11' }
            ).sort({id:-1});
        res.json(data)
    });

app.listen(process.env.PORT || 8080);



async function within(fn, res, duration) {
    const id = setTimeout(() => res.json({
        message: "There was an error with the upstream service!"
    }, duration))
    try {
        let data = await fn()
        clearTimeout(id)
        res.json(data)
    } catch(e) {
      res.status(500).json({message: e.message})
    }
}

async function getUsers() {
    return (await Post.find({Month: '11' } ).sort({id:-1}))
}

async function getMax(findMonth, findDay) {
    return (await Post.find({Day:findDay,Month: findMonth} ).sort({RainDay:-1}))
}
// schedule.scheduleJob(' */1 * * * *',function(){
// })

var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE4MjU4OTc5MTYsImlkIjoiNjE4MGVmZGJjOTVhMDAwMDNmMDAzNzE2IiwibmFtZSI6ImFkbWluIiwib3JpZ19pYXQiOjE2NjgyMTc5MTYsInVzZXJuYW1lIjoiYWRtaW4ifQ.qcohKNm2QpvEN0c2wUMmb5wA_1ChLPYje8PaKai6J0A';
    const https = require('https');
    // var request =  https.get('https://be-datn.vercel.app/allData', function (res){
    //             var data = ''; 
    //             res.on('data', function (chunk) {
    //                 data += chunk;
                   
    //             });
    //             res.on('end', function () {
    //                 let jsonData = JSON.parse(data);
    //                 console.log(data)
    //             }
    //             )
    //         }
            
    //         )
    var options = {
        host: 'quantrac.xathongminh.vn',
        path: '/api/admin/water-monitorings?page=1&length=10',
        // length max = 150, min auto = 4
        headers: {
            Authorization: 'Bearer '+token,
        }
    }
    var request =  https.get(options, function (res){
        var data = ''; 
        res.on('data', function (chunk) {
            data += chunk;
           
        });
        res.on('end', function () {
            let jsonData = JSON.parse(data);
            for(let i=0; i<jsonData["data"]["entries"].length;i++){
               Post.find({id:jsonData["data"]["entries"][i]["id"]},(err, id)=>{
                if(id.length==0){
                    var splitObjectJSON = jsonData["data"]["entries"][i]["objectJSON"].split(',');
                    var splitCreated_at = jsonData["data"]["entries"][i]["created_at"].split('T');
                    var rxInfo = jsonData["data"]["entries"][i]["rxInfo"];
                    var rssi =  rxInfo==null?'':rxInfo[0]["rssi"];
                    var year = splitCreated_at[0].split('-')[0];
                    var month = splitCreated_at[0].split('-')[1];
                    var day = splitCreated_at[0].split('-')[2];
                    var hour = splitObjectJSON[1]?.split(':')[1];
                    var min = splitObjectJSON[2]?.split(':')[1];
                    var rainDay = splitObjectJSON[3]?.split(':')[1];
                    var rainHour = splitObjectJSON[4]?.split(':')[1];
                    var battery = splitObjectJSON[0]?.split(':')[1];
                    const post = new Post({
                        id:jsonData["data"]["entries"][i]["id"],
                        lastUpdate:jsonData["data"]["entries"][i]["created_at"],
                        objectJSON:jsonData["data"]["entries"][i]["objectJSON"],
                        Year: year,
                        Month: month,
                        Day: day,
                        Hour: hour,
                        Min: min,
                        RainDay: rainDay,
                        RainHour: rainHour,
                        Battery: battery,
                        Rssi: rssi,
                    })
                    post.save();      
                }
                else {
                    // var message = {
                    //     to:'dkS3T74ISmGOi2IyXDoyWz:APA91bFKc2XTdNwaiDooNGaDlXVEvDeOhHFaV4SH6WLArYeTjRqJN3ntvQFtFaj3_K-HdCsvI0mCcpcHyYxUnL_6hqjwz9yMQKb51to_JE4r_FYnqR5yeucIVDMEtR-6BfR6OTpDHqAW',
                    //         notification: {
                    //             title: 'NodeJS-NotifcatioTestAPP',
                    //             body: `Duplicated ID: ${jsonData["data"]["entries"][i]["id"]}`,
                    //         },
                    
                    //         data: { //you can send only notification or only data(or include both)
                    //             title: 'ok cdfsdsdfsd',
                    //             body: '{"name" : "okg ooggle ogrlrl","product_id" : "123","final_price" : "0.00035"}'
                    //         }
                    
                    // };
                    
                    // fcm.send(message, function(err, response) {
                    //     if (err) {
                    //             console.log("Something has gone wrong!"+err);
                    //             console.log("Respponse:! "+response);
                    //     } else {
                    //             // showToast("Successfully sent with response");
                    //             console.log("Successfully sent with response: ", response);
                    //     }
                    
                    // });
                    console.log('error')
                }
               });
                   
            }
            // console.log(jsonData["data"]["pagination"]["total"]);
            // console.log(jsonData["data"]["entries"].length);
        });
    });
    request.on('error', function (e) {
        console.log(e.message);
    });
    request.end();
    console.log('success')




