var message = {
                            to:'dkS3T74ISmGOi2IyXDoyWz:APA91bFKc2XTdNwaiDooNGaDlXVEvDeOhHFaV4SH6WLArYeTjRqJN3ntvQFtFaj3_K-HdCsvI0mCcpcHyYxUnL_6hqjwz9yMQKb51to_JE4r_FYnqR5yeucIVDMEtR-6BfR6OTpDHqAW',
                                notification: {
                                    title: 'NodeJS-NotifcatioTestAPP',
                                    body: `Warning! Amount of rain is: ${sum}mm in last 4 hours`,
                                },
                        
                                data: { //you can send only notification or only data(or include both)
                                    title: 'ok cdfsdsdfsd',
                                    body: '{"name" : "okg ooggle ogrlrl","product_id" : "123","final_price" : "0.00035"}'
                                }
                        
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