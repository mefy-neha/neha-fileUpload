var express = require('express');
var router = express.Router();
var doctor = require('../model/doctor.model')



/*Api for create DOCTOR SPECIALTY */

router.post('/create', (request, response) => {
    console.log("specialty create ");
    console.log(request.body);

    let createResponse = {};

    let data = new doctor({
        speciality: request.body.speciality,
        description: request.body.description,
    });
    console.log(data);
    data.save((error, result) => {
        console.log(error);
        console.log(result);
        if (error) {
            createResponse.error = true;
            createResponse.message = `Error :` + error.message;
            response.status(500).json(createResponse);
        } else {
            createResponse.error = false;
            createResponse.specialitylist = result;
            createResponse.message = ` Doctor specialty created successfully .`;
            response.status(200).json(createResponse)
        }
    });
});

/***********GET DOCTOR SPECIALTY LIST***************** */

// router.get('/list', (request, response) => {
//     console.log("Doctor specialty details");

//     let getResponse = {};

//     doctor.find({}, (error, result) => {
//         if (error) {
//             getResponse.error = true;
//             getResponse.message = `Error :` + error.message;
//             response.status(500).json(getResponse);
//         } else {
//             getResponse.error = false;
//             getResponse.result = result;
//             getResponse.message = `Doctor specialty getting  successfully .`;
//             response.status(200).json(getResponse);
//         }
//     });
// });
/************** ENDING OF GET DOCTOR SPECIALIST LIST *********************** */


/********************GET DOCTOR SPECIALTY LIST By SEARCH & FILTER  */
router.get('/bySpecialty', (request, response) => {
    let searchResponse = {};
    console.log('filterdata', request.query.speciality)
    if (request.query.length !== 0) {
        doctor.find({
            speciality: { '$regex': request.query.speciality, '$options': 'i' }  //$regx IS USED FOR ,Provides regular expression capabilities for pattern matching strings in queries
        }).exec(function (error, result) {
            if (error) {
                searchResponse.error = true;
                searchResponse.message = `Error :` + error.message;
                response.status(500).json(searchResponse);
            } else if (result) {
                searchResponse.error = false;
                searchResponse.specialitylist = result;
                searchResponse.message = ` getting doctor speciality successfully.`;
                response.status(200).json(searchResponse);

            }
        });
    }
    else {
        doctor.find({}, (error, result) => {
            if (error) {
                searchResponse.error = true;
                searchResponse.message = `Error :` + error.message;
                response.status(500).json(searchResponse);
            } else if (result) {
                searchResponse.error = false;
                searchResponse.result = result;
                searchResponse.message = ` getting doctor speciality successfully.`;
                response.status(200).json(searchResponse);

            }

        })
    }
});
/****************************END OF THIS API************************ */
//Api to Delete Speciality
router.delete('/delete', (request, response) => {
    console.log("Speciality details");

    let deleteResponse = {};
    let specialityId = request.query.specialityId;
    doctor.remove({ _id: specialityId }, (error, result) => {
        if (error) {
            deleteResponse.error = true;
            deleteResponse.message = `Error :` + error.message;
            response.status(500).json(getResponse);
        } else {
            deleteResponse.error = false;
            deleteResponse.result = result;
            deleteResponse.message = ` deleted  successfully .`;
            response.status(200).json(deleteResponse);
        }
    });
});

module.exports = router;