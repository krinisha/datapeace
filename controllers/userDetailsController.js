const User = require('../models/user_details');

exports.listUsers = (req, res) => {
    let sortOrder = 1; // 1 for ascending, -1 for descending
    let sortField = 'id',
        pageNumber = 1,
        recordLimit = 5,
        searchName;
    if (req.query.page != null || req.query.page != undefined) {
        pageNumber = req.query.page;
        console.log("Page : ", pageNumber);
    }
    if (req.query.limit != null || req.query.limit != undefined) {
        recordLimit = req.query.limit;
        console.log("Limit : ", recordLimit);
    }
    if (req.query.name != null || req.query.name != undefined) {
        searchName = req.query.name;
        console.log("Search Name : ", searchName);
    }
    if (req.query.sort != null || req.query.sort != undefined) {
        if (req.query.sort[0] == '-') {
            console.log("Sorting in descending order.");
            sortOrder = -1;
            sortField = req.query.sort.substring(1, req.query.sort.length);
            console.log("Sort Field :" + sortField);
        } else {
            console.log("Sorting in ascending order.");
            sortField = req.query.sort;
            console.log("Sort Field :" + sortField);
        }
    }

    let query1 = {
        $or: [{
                first_name: {
                    $regex: searchName,
                    $options: 'i'
                }
            },
            {
                last_name: {
                    $regex: searchName,
                    $options: 'i'
                }
            }
        ]
    };

    let query2 = {};

    let query = (searchName != undefined && searchName != null) ? query1 : query2;

    let sortParam = {};
    sortParam[sortField] = Number(sortOrder);
    console.log("Sort Param\n", sortParam);
    let options = {
        sort: sortParam,
        lean: true,
        limit: Number(recordLimit),
        page: Number(pageNumber)
    };

    User.paginate(query, options, function (err, result) {
        if (err)
            res.end("Failed to execute query!");
        else {
            for (let i = 0; i < result.docs.length; i++) {
                delete result.docs[i]['id'];
                delete result.docs[i]['_id'];
            }
            res.json(result.docs);
        }
    });
}

exports.addNewUser = (req, res) => {

    res.writeHead(201, {
        'Content-Type': 'application/json'
    });

    let user = new User({
        uid: req.body.uid,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        company_name: req.body.company_name,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        email: req.body.email,
        web: req.body.web,
        age: req.body.age
    });

    user.save(function (err) {
        if (err)
            console.log("Error in saving user due to : ", err);
        else
            console.log("Saved Details : ", user);
    });

    res.end();
};

exports.updateUserById = (req, res) => {

    let params = {
        uid: req.body.uid,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        company_name: req.body.company_name,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        email: req.body.email,
        web: req.body.web,
        age: req.body.age
    };

    for (let prop in params)
        if (!params[prop]) delete params[prop];




    User.findOneAndUpdate({
        "uid": req.params.uid
    }, params, {
        upsert: true,
        new: true
    }, (err, data) => {
        if (err) {
            console.log("Cannot update because of error : \n" + err);
            res.status(404).end();
        } else if (data == null) {
            console.log("Record not updated.");
            res.end();
        } else {
            console.log("Updation sucessfull.\n" + data);
            res.status(200).end({});
        }
    });

    res.end();
}

exports.deleteUserById = (req, res) => {
    User.findOneAndDelete({
        "uid": req.params.uid
    }, (err, data) => {
        if (err) {
            console.log("Cannot delete because of error : \n" + err);
            res.status(404).end();
        } else if (data == null) {
            console.log("Record not deleted.");
            res.end();
        } else {
            console.log("Deletion sucessfull.\n" + data);
            res.status(200).end({});
        }
    });


}

exports.getUserById = (req, res) => {
    User.find({
        "uid": req.params.uid
    }, function (err, docs) {
        if (!err && docs.length > 0) {
            res.json(docs);
        } else if (!err && docs.length == 0) {
            res.status(404).end();
        } else {
            console.log("Cannot get user because of error : \n" + err);
            res.status(404).end();
        }
    });
}