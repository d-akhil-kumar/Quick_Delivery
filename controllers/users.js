const { json } = require('body-parser');
const usersModel = require('../models/users.js');
const validator = require('../utilities/validations.js');

exports.register = async (req,res) => {

    try {


        if( 
            req.body.userName.length == 0 ||
            req.body.passWord.length == 0 ||
            req.body.mailID.length == 0  ||
            req.body.phoneNumber.toString().length == 0    
        ){

            res.status(400).json({
                status: 'error',
                msg : 'All Fields Are Required'
            });        

        }        
        else if(!validator.validEmailID(req.body.mailID)){

           res.status(400).json({
                status: 'error',
                msg : 'Enter valid Mail ID'
            });
            
        }
        else if(req.body.phoneNumber.toString().length != 10){

            res.status(400).json({
                status: 'error',
                msg : 'Enter valid Phone No.'
            });

        }
        else if( (await usersModel.find({ mailID : req.body.mailID})).length == 1 ){

            res.status(400).json({
                status: 'error',
                msg : 'Email already in use'
            });


        }      
        else{

            const data = await usersModel.create(
                {
                    userName : req.body.userName,
                    passWord : req.body.passWord,
                    mailID : req.body.mailID,
                    phoneNumber : req.body.phoneNumber,
                }
            );

            

            res.status(201).json(
                {
                    status : 'Success',
                    data: data
                }
            );



        }

    } catch (error) {

        
            res.status(404).json({
                status : 'fail',
                msg : error
                
            });

    }
};


exports.login = async (req,res) => {

    try {


        if( (await usersModel.find({ mailID : req.body.mailID })).length == 0 ){


            res.status(400).json(
                {
                    status : 'error',
                    msg : 'User not registered'
                }
            );

        }
        else if((await usersModel.find({ mailID : req.body.mailID, passWord : req.body.passWord })).length == 0){

            res.status(400).json(
                {
                    status : 'error',
                    msg : 'Password Incorrect'
                }
            );

        }
        else{

            const data = await usersModel.findOne({ mailID : req.body.mailID, passWord : req.body.passWord });

            res.status(201).json(
                {
                    status : 'Success',
                    id : data._id,
                    msg: 'User Logged In Successfully'
                }
            );


            


        }
        
    } catch (error) {

        res.status(404).json({
            status : 'fail',
            msg : error
            
        });

        
    }



};