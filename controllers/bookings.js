const bookingsModel = require('../models/bookings.js');
const usersModel = require('../models/users.js');
const validators = require('../utilities/validations');


exports.create = async (req,res) => {

    try {

        if( new Date(req.body.time).getTime() < new Date().getTime()){

            
            res.status(400).json(
                {
                    status: 'fail',
                    msg :'Booking Time should not be less than today\'s Date'
                }
            );

        }
        else if( (await usersModel.find( {mailID : req.body.mailID} )).length != 1){

            res.status(400).json(
                {
                    status: 'fail',
                    msg :'User Doesn\'t exists, Please register to the application'
                }
            );

        }
        else{

            const bookingsData = await bookingsModel.create(

                {

                    
                    "senderName": req.body.senderName,
                    "receiverName": req.body.receiverName,
                    "senderPhoneNumber": req.body.senderPhoneNumber,
                    "receiverPhoneNumber": req.body.receiverPhoneNumber,
                    "time": req.body.time,

                    "senderAddress": {

                        "country": req.body.senderAddress.country,
                        "city": req.body.senderAddress.city,
                        "address": req.body.senderAddress.address,
                        "zipCode": req.body.senderAddress.zipCode

                    },

                    "receiverAddress": {

                        "country": req.body.receiverAddress.country,
                        "city": req.body.receiverAddress.city,
                        "address": req.body.receiverAddress.address,
                        "zipCode": req.body.receiverAddress.zipCode

                    }                

                }
            );


            const userDate = await usersModel.findOneAndUpdate(
                {mailID : req.body.mailID},
                {
                    $push : {
                        bookingID : bookingsData.bookingId
                    }
                },
                {
                    new: true, //to return new doc back
                    runValidators: true, //to run the validators which specified in the model
                }

            );


            console.log(bookingsData);
            console.log(userDate);



            res.status(201).json(
                {
                    "status": "success",
                    "data" : bookingsData
                }
                
            );



        }

        
    } catch (error) {

        res.status(404).json(
            {
                status: 'fail',
                msg : error.message
            }
        );
        
    }
};


exports.update = async (req,res) => {

    try {

        if((await bookingsModel.find({ bookingId : req.body.bookingId})).length != 1){

            res.status(400).json(
                {

                    "status": "error",                
                    "message": "Booking ID is not valid"
                
                }
            );


        }
        else if(new Date(req.body.time).getTime() < new Date().getTime()){

            res.status(400).json(
                {
                    status: 'fail',
                    msg :'Booking Time should not be less than today\'s Date'
                }
            );
        }
        else{

            const bookingsData = await bookingsModel.findOneAndUpdate(
                {
                    bookingId : req.body.bookingId
                },
                { $set: 
                    {
                        
                        "senderName": req.body.senderName,
                        "receiverName": req.body.receiverName,
                        "senderPhoneNumber": req.body.senderPhoneNumber,
                        "receiverPhoneNumber": req.body.receiverPhoneNumber,
                        "time": req.body.time,

                        "senderAddress": {

                            "country": req.body.senderAddress.country,
                            "city": req.body.senderAddress.city,
                            "address": req.body.senderAddress.address,
                            "zipCode": req.body.senderAddress.zipCode

                        },

                        "receiverAddress": {

                            "country": req.body.receiverAddress.country,
                            "city": req.body.receiverAddress.city,
                            "address": req.body.receiverAddress.address,
                            "zipCode": req.body.receiverAddress.zipCode

                        } ,
                        
                        "updatedAt" : Date()

                    }
                },
                {
                    new : true,
                    runValidators : true
                }
            );

            console.log(bookingsData);


            res.status(200).json(
                {

                    "status": "success",                
                    "message": "Booking Data updated successfully"
                
                }
            );


        }
        
    } catch (error) {

        res.status(404).json(
            {
                status: 'fail',
                msg : error.message
            }
        );

    }

};

exports.delete = async (req,res) => {

    try {

        
        const data = await bookingsModel.deleteOne({ bookingId : req.params.bookingId});

        if(data.deletedCount == 1){


            const usersdata = await usersModel.updateMany(
                {bookingID : req.params.bookingId},
                {
                    $pull : {

                        bookingID : req.params.bookingId

                    }
                },
                {
                    new: true,
                    runValidators: true
                }
            );

            console.log(usersdata);


            res.status(200).json(
                {

                    "status": "error",                
                    "message": "Booking successfully deleted"
                
                }
            );


        }else{

            res.status(400).json(
                {

                    "status": "error",                
                    "message": "Booking ID is not valid"
                
                }
            );

        }

            
        
        
    } catch (error) {


        res.status(404).json(
            {
                status: 'fail',
                msg : error.message
            }
        );
        
    }

};