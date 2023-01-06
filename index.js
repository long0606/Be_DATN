
// import mongoose from 'mongoose' 
const schedule = require('node-schedule');
const mongoose = require('mongoose');
const FCM = require('fcm-node');
const express = require('express');    
const cors = require('cors')
const app = express();
const fs = require('fs');
// setup for firebase cloud messagge
var serverKey = 'AAAAl7gMyoE:APA91bHzzmOAPh3ljX8BoDShqwP704ngrjxPZIESRHCcO5ugWn5idvwjjpPSS4xTLVNY0Vha5yw7mfq37Pp7ucJPd5ebZc99AopX8WfD5t7n3JMttXQVb-ixsDahkqG7S41OWhzv3jX6';
var fcm = new FCM(serverKey,);
var path = require('path');

mongoose.connect("mongodb+srv://DATN:long1234@cluster0.oi7m08w.mongodb.net/DATN", (err)=>{
    if(!err) console.log('db connected');
    else console.log('error');
})

// import { readFileSync } from 'fs';
// import path from 'path';

function getStaticProps() {
  const file = path.join(process.cwd(), 'public', 'Data2022.json');
  const data = readFileSync(file, 'utf8');

  return {
    props: {
      data,
    },
  };
}

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
const Posts = mongoose.model('2022Post', Postman);

// var data = Post.find({Day: "27", Hour: { $in: [ "15", "16","17"]} },function(err,result){
//     console.log(result[1]["RainDay"]);
//     }).sort({id:-1});
// app.get("/find", async function(req, res){
//     var data = await Post.find(
//         {Day: date, Hour: { $in: [ (hours-1).toString(), (hours-2).toString(),(hours-3).toString()]} }
//         ).sort({Hour:1, Min:1});
//     res.json(data)
// });
const fileName = '/public';
app.use(cors())
// app.use(express.static('public'))
// app.get('/allData2022', function(req, res){
//     var options = {
//         root: path.join(__dirname,'public')
//     };
     
//     var fileName = '/Data2022.json';
//     res.sendFile(fileName, options, function (err) {
//         if (err) {
//             throw err;
//         } else {
//             console.log('Sent:', fileName);
//         }
//     });
// });
 
app.get("/find", async function(req, res){
    var data = await Post.aggregate([{$match : {Day:date.toString(),$or: [ { Hour: (hours).toString() }, { Hour: (hours-1).toString()},{ Hour: (hours-2).toString()},{ Hour: (hours-3).toString()}] } },{ $group : {_id:"$Hour", RainEachHour: { $max : "$RainHour" },}},{"$sort": {"Hour":1}}]);
    res.json(data)
});
app.get("/allData", async function(req, res){
    var data = await Post.find().sort({id:-1});
    res.json(data)
});

app.get("/allData2022", async function(req, res){
    const file = path.join(process.cwd(), 'public', 'Data2022.json');
  const data = fs.readFileSync(file, 'utf8');
  let data2022 = JSON.parse(data);
    // var data = await Post.find({Year: "2022"}).sort({id:-1});
    //  fs.readFile(fileName, (err, data) => {
    //     if (err) throw err;
    //     //parse nghĩa là parse dữ liệu text của chúng ta từ dạng string quay về dạng object
    //     let data2022 = JSON.parse(data);
    //     console.log(data2022);
    //     // res.json(data2022);
    // })
   res.json(data2022);
});
app.get("/allData2023", async function(req, res){
    var data = await Post.find({Year: "2023"}).sort({id:-1});
    res.json(data)
});
app.get("/Max", async function(req, res){
        var data = await Post.aggregate([{ $group : {_id:{"hour": "$Hour", "day": "$Day" ,"month": "$Month","year":"$Year"}, RainEachHour: { $max : "$RainHour" },}},{"$sort": {"_id.year":-1,"_id.month":-1,"_id.day":-1,"_id.hour":-1}}]);
        res.json(data)
    });
app.get("/Max2022", async function(req, res){
    var data = await Post.aggregate([{$match : {Year:"2022"}},{ $group : {_id:{"hour": "$Hour", "day": "$Day" ,"month": "$Month"}, RainEachHour: { $max : "$RainHour" },}},{"$sort": {"_id.month":-1,"_id.day":-1,"_id.hour":-1}}]);
    res.json(data)
});
app.get("/Max2023", async function(req, res){
    var data = await Post.aggregate([{$match : {Year:"2023"}},{ $group : {_id:{"hour": "$Hour", "day": "$Day" ,"month": "$Month"}, RainEachHour: { $max : "$RainHour" },}},{"$sort": {"_id.month":-1,"_id.day":-1,"_id.hour":-1}}]);
    res.json(data)
});

app.listen(3000);

// schedule.scheduleJob(' */1 * * * *',function(){
// })

var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE4MjU4OTc5MTYsImlkIjoiNjE4MGVmZGJjOTVhMDAwMDNmMDAzNzE2IiwibmFtZSI6ImFkbWluIiwib3JpZ19pYXQiOjE2NjgyMTc5MTYsInVzZXJuYW1lIjoiYWRtaW4ifQ.qcohKNm2QpvEN0c2wUMmb5wA_1ChLPYje8PaKai6J0A';
    const https = require('https');
const { parse } = require('querystring');
    var options = {
        host: 'quantrac.xathongminh.vn',
        path: '/api/admin/water-monitorings?page=1&length=20',
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
                    var intYear = parseInt(splitCreated_at[0].split('-')[0]);
                    var intMonth = parseInt(splitCreated_at[0].split('-')[1]);
                    var intHour = parseInt(splitObjectJSON[1]?.split(':')[1]);
                    var intDay = parseInt(splitCreated_at[0].split('-')[2]);
                    var year = splitCreated_at[0].split('-')[0];
                    var month = (intYear==2022||intYear==2023)&&(intMonth==12||intMonth==1)&&(intHour==0||intHour==1||intHour==2||intHour==3||intHour==4||intHour==5||intHour==6)?intDay==31?(1).toString():intMonth.toString():intMonth.toString();
                    var day = (intYear==2022||intYear==2023)&&(intMonth==12||intMonth==1)&&(intHour==0||intHour==1||intHour==2||intHour==3||intHour==4||intHour==5||intHour==6)?intDay<31?(intDay +1).toString():1:intDay.toString();
                    var hour = splitObjectJSON[1]?.split(':')[1];
                    var min = splitObjectJSON[2]?.split(':')[1];
                    var rainDay =splitObjectJSON[3]?.split(':')[1];
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
               });
               
            }
            
            schedule.scheduleJob(' */1 * * * *',function(){
                let date_ob = new Date();
            let date = date_ob.getDate();
            let hours = date_ob.getHours();
            var T =[0,0];
            console.log(date);
            console.log(hours);
                Post.aggregate([{$match : {Day:date.toString(),$or: [ { Hour: (hours).toString() }, { Hour: (hours-1).toString()}] } },{ $group : {_id:"$Hour", RainEachHour: { $max : "$RainHour" },}},{"$sort": {"Hour":1}}],function(err,tex){
                    for(var i = 0; i<tex.length;i++){
                         T[i] = parseInt(tex[i].RainEachHour);
                    }
                    var sum = T.reduce((partialSum, a) => partialSum + a, 0);
                    console.log(sum)
                    if(120<=sum){
                            var message = {
                                to:'dkS3T74ISmGOi2IyXDoyWz:APA91bFKc2XTdNwaiDooNGaDlXVEvDeOhHFaV4SH6WLArYeTjRqJN3ntvQFtFaj3_K-HdCsvI0mCcpcHyYxUnL_6hqjwz9yMQKb51to_JE4r_FYnqR5yeucIVDMEtR-6BfR6OTpDHqAW',
                                    notification: {
                                        title: 'Warning level 1, There is a risk of flooding in low-lying areas',
                                        body: `Warning! Amount of rain is: ${sum}mm in last 2 hours`,
                                    },
                            
                                    // data: { //you can send only notification or only data(or include both)
                                    //     title: 'ok cdfsdsdfsd',
                                    //     body: '{"name" : "okg ooggle ogrlrl","product_id" : "123","final_price" : "0.00035"}'
                                    // }
                            
                            };
                            fcm.send(message, function(err, response) {
                                if (err) {
                                        console.log("Something has gone wrong!"+err);
                                        console.log("Respponse:! "+response);
                                } else {
                                        // showToast("Successfully sent with response");
                                        console.log("Successfully sent with response: ", response);
                                }
                            
                            });
                    
                        
                    }else if(200>sum>=170){
    
                        // var conf = new GcmConfiguration("optionalSenderID", "senderAuthToken", null);
                        // conf.OverrideUrl("https://fcm.googleapis.com/fcm/send");
                            var message = {
                                to:'dkS3T74ISmGOi2IyXDoyWz:APA91bFKc2XTdNwaiDooNGaDlXVEvDeOhHFaV4SH6WLArYeTjRqJN3ntvQFtFaj3_K-HdCsvI0mCcpcHyYxUnL_6hqjwz9yMQKb51to_JE4r_FYnqR5yeucIVDMEtR-6BfR6OTpDHqAW',
                                    notification: {
                                        title: 'Warning level 2, There is a risk of flooding in areas',
                                        body: `Warning! Amount of rain is: ${sum}mm in last 2 hours`,
                                    },
                            
                                    // data: { //you can send only notification or only data(or include both)
                                    //     title: 'ok cdfsdsdfsd',
                                    //     body: '{"name" : "okg ooggle ogrlrl","product_id" : "123","final_price" : "0.00035"}'
                                    // }
                            
                            };
                            
                            fcm.send(message, function(err, response) {
                                if (err) {
                                        console.log("Something has gone wrong!"+err);
                                        console.log("Respponse:! "+response);
                                } else {
                                        // showToast("Successfully sent with response");
                                        console.log("Successfully sent with response: ", response);
                                }
                            
                            });
                        }else if(sum>=200){
    
                        // var conf = new GcmConfiguration("optionalSenderID", "senderAuthToken", null);
                        // conf.OverrideUrl("https://fcm.googleapis.com/fcm/send");
                            var message = {
                                to:'dkS3T74ISmGOi2IyXDoyWz:APA91bFKc2XTdNwaiDooNGaDlXVEvDeOhHFaV4SH6WLArYeTjRqJN3ntvQFtFaj3_K-HdCsvI0mCcpcHyYxUnL_6hqjwz9yMQKb51to_JE4r_FYnqR5yeucIVDMEtR-6BfR6OTpDHqAW',
                                    notification: {
                                        title: 'Warning level 3, People need to evacuate immediately',
                                        body: `Warning! Amount of rain is: ${sum}mm in last 2 hours`,
                                    },
                            
                                    // data: { //you can send only notification or only data(or include both)
                                    //     title: 'ok cdfsdsdfsd',
                                    //     body: '{"name" : "okg ooggle ogrlrl","product_id" : "123","final_price" : "0.00035"}'
                                    // }
                            
                            };
                            
                            fcm.send(message, function(err, response) {
                                if (err) {
                                        console.log("Something has gone wrong!"+err);
                                        console.log("Respponse:! "+response);
                                } else {
                                        // showToast("Successfully sent with response");
                                        console.log("Successfully sent with response: ", response);
                                }
                            
                            });
                        }else return null;
                    console.log(tex);
                }); 
                })
            
            // console.log(jsonData["data"]["pagination"]["total"]);
            // console.log(jsonData["data"]["entries"].length);
        });
    });
    request.on('error', function (e) {
        console.log(e.message);
    });
    request.end();
    console.log('success')
