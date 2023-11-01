
const User = require("../../models/userModel.js");
const Address = require("../../models/addressModel.js");

const mongoQueries = async (req, res) => {
    try {
      let x = 6;
      let user;
  
      // user = await User.find({
      //   $and : [
      //     {name:{$ne : "imran1"}},{email:"basharat@gmail.com"}
      //   ]
      // });
  
      // user = await User.find({  //expr used to evaluate expression true result will return whole result
      //   $expr : {
      //     $eq : [ {$divide : [6 , 2] } , 3]
      //   }
      // });
  
      // user = await User.find({  // or condition
      //     $or : [ {fee:"234"} , {name:'Basharat'}]
      // });
  
      // user = await User.find({ //nested and or
      //   $and:[
      //     {$or : [ {fee:"643"} , {name:'imran1'}]},
      //     {$or : [ {fee:"234"} , {name:'Basharat'}]},
  
      //   ]
      // });
  
      // user = await User.find({
      //   $and: [
      //     { $or: [{ email: { $ne: "basharat@gmail.com" } }, { name: "parvaiz" }] },
      //     { $or: [{ fee: "234" }, { name: "Basharat" }] },
      //   ],
      // });
  
      // user = await User.find({ //lt , gt
      //   $and: [
      //     { $or: [{ fee: { $gt: "600" } }, { name: "parvaiz" }] },
      //     { $or: [{ fee: "234" }, { name: "Basharat" }] },
      //   ]
      // });
  
      // user = await User.find({  // checks if field exists
      //   'profile_picture': { $exists: true }
  
      // });
  
      // user = await User.find().sort({ name: -1 });/sort by name desc
  
      // aggregate syntax that is fairly similar to the find() method used to query data in a collection,
      // but aggregate() accepts one or more stage names as arguments
      // user = await User.aggregate([
      //   {
      //     $match : {
      //       $or: [{ fee: { $gt: "600" } }, { name: "parvaiz" }]
      //     },
      // }
      // ])
  
      // user = await User.aggregate([
      // {
      //   $match: {
      //     $or: [{ fee: { $gt: "600" } }, { name: "parvaiz" }],
      //   },
      // },
      // {
      //   $sort: { name: -1 },
      // },
      // {
      //   $group: { _id: "$role" },
      // },
      //   {
      //     role: { $in: ["Basic","1"] },
      //   },
      // ]);
  
      // await Address.find( // using $in
      //   {
      //     pincode:{$in : ['736424']}
      //   }
  
      // )
  
      // await Address.find(  //checks if array size is 2 or not
      //   {
      //     nearest_area:{$size : 2}
      //   }
  
      // )
  
      // let address = await Address.find(  //$all checks in if the nearest_area array contains the values provided in the array
      //   {
      //     nearest_area : {$all : ['zindagi3']}
      //   }
      // )
  
      // let address = await Address.find( //working wit dates
      //   {
      //     createdAt : {$gt : ISODate('2023-10-31')}
      //   }
      // )
  
      // let address = await Address.aggregate([ //working with groups and date formatting
      //   {
      //      $group:{_id : { $dateToString: { format: "%Y/%m/%d %H:%M:%S", date: "$createdAt" } } }
      //   }
      //  ])
  
  
      // let userfee = await User.aggregate([ //get totalfee
      //   {
      //   $group:{
      //     _id:null,
      //     totalFee: { $sum: {$toInt : "$fee"} },
      //   }
      // }]);
  
  
      // let address = await User.find({}).populate({ //filtering on relation model
      //   path:'userAddress',
      //   select:['address1','address2','pincode'],
      //   match : {pincode:'736424'}
      // });
  
      // other methods 
      /*  
        $unwind , $project , 
  
      */
      // user = await User.find({ role: { $in: ["Basic", "1"] } });
  
      user = await User.updateOne(
        { _id: 100 },
        {
          $set: {
            "tags.1": "rain gear",
            "ratings.0.rating": 2,
          },
        }
      );
  
      res.status(200).json({ success: true, user: user });
    } catch (e) {
      res.status(422).json(e);
    }
  };

  module.exports={mongoQueries}