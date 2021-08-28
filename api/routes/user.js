const mongoose = require("mongoose");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Merchant = require("../models/Merchant");

// To view user's medical history
async function viewHistory(req, res) {
    try {
        let userId = req.params.userId;
        let user = await User.findById({ _id: userId });
        if (!user) {
            return res
                .status(404)
                .send({ success: false, msg: "User Not found" });
        }
        let history = user.history;
        return res.status(200).send({ success: true, data: history });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, msg: "Server Error" });
    }
}

//User adding his own medical record --- unverified documents
async function addToHistory(req, res) {
    try {
        let userId = req.params.userId;
        let user = await User.findById({ _id: userId });

        user.history.push({
            imageLink: req.body.imageLink,
            description: req.body.description,
            isVerified: false,
            uploadedBy: userId,
        });
        await User.updateOne(
            {
                _id: userId,
            },
            {
                $set: {
                    history: user.history,
                },
            }
        );
        return res.send({ success: true, msg: "History Updated" });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, msg: "Server Error" });
    }
}

//User adding friends medical records --- verified/unverified documents
async function addToFriendHistory(req, res) {
    try {
        let friendId = req.params.friendId;
        let friend = await User.findById({ _id: friendId });
        let userId = req.user.id; //current user logged in
        let access = 0;
        for (let i = 0; i < friend.friends.length; i++) {
            if (friend.friends[i]._id.toString() === userId) {
                //if my id is in friends array then only give access
                access = 1;
                break;
            }
        }
        if (access == 1) {
            let user = await User.findOne({ userId: req.user.id });
            if (user.isDoctor) {
                friend.history.push({
                    imageLink: req.body.imageLink,
                    description: req.body.description,
                    isVerified: true,
                    uploadedBy: userId,
                });
            } else {
                friend.history.push({
                    imageLink: req.body.imageLink,
                    description: req.body.description,
                    isVerified: false,
                    uploadedBy: userId,
                });
            }
            await User.updateOne(
                {
                    _id: userId,
                },
                {
                    $set: {
                        history: user.history,
                    },
                }
            );
            return res.send({
                success: true,
                msg: "History Updated by friend",
            });
        } else {
            return res.send({
                success: true,
                msg: "You dont have access to edit history of so called friend who isnt you're friend",
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, msg: "Server Error" });
    }
}
// User applying to become doctor
async function becomeDoctor(req, res) {
    try {
        let userId = req.params.userId;
        let doctor = await Doctor.findOne({ userId: userId });
        if (doctor) {
            return res
                .status(400)
                .send({ success: false, msg: "Already applied for doctor" });
        }
        let newDoctor = new Doctor({
            userId,
            certificateLink: req.body.certificateLink,
        });
        await newDoctor.save();
        return res
            .status(200)
            .send({ success: true, msg: "Applied for Doctor" });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, msg: "Server Error" });
    }
}

//User applying to become merchant
async function becomeMerchant(req, res) {
    try {
        let userId = req.params.userId;
        let merchant = await Merchant.findOne({ userId: userId });
        if (merchant) {
            return res
                .status(400)
                .send({ success: false, msg: "Already applied for Merchant" });
        }
        let newMerchant = new Merchant({
            userId: req.params.userId,
            location: req.body.location,
            certificateLink: req.body.certificateLink,
        });
        await newMerchant.save();
        return res
            .status(200)
            .send({ success: true, msg: "Applied for Merchant" });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, msg: "Server Error" });
    }
}

//Update Profile
async function updateProfile(req, res) {
    try {
        let userId = req.params.userId;
        let updateData = req.body;
        let user = await User.findById({ _id: userId });
        if (!user) {
            return res
                .status(404)
                .send({ success: false, msg: "User doesnt exists" });
        }
        console.log("ID is" + userId);
        console.log(updateData);
        let newUser = await User.updateOne(
            {
                _id: userId,
            },
            {
                $set: {
                    ...updateData,
                },
            }
        );
        console.log(newUser);
        return res.status(200).send({ success: true, msg: "Profile Updated" });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, msg: "Server Error" });
    }
}

// get user profile
async function getUserProfile(req, res) {
    try {
        let userId = req.params.userId;
        let user = await User.findById({ _id: userId }).populate(
            "isDoctor isMerchant"
        );
        if (!user) {
            return res
                .status(404)
                .send({ success: false, msg: "User Not found" });
        }
        console.log(user);
        return res.status(200).send({ success: true, data: user });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, msg: "Server Error" });
    }
}

async function addFriend(req, res) {
    try {
        console.log("inside add friend");
        let friendId = req.body.friendId;
        let friend = await User.findOne({ _id: friendId });
        let myId = req.user.id;
        console.log(friend);
        console.log("myid:" + myId);
        //if friends request already sent by me send msg already sent request
        for (let i = 0; i < friend.requests.length; i++) {
            if (friend.requests[i].userId == myId) {
                return res.status(200).send({
                    success: false,
                    data: "Friend Request Already sent",
                });
            }
        }
        friend.requests.push({ userId: myId });
        await friend.save();
        return res
            .status(200)
            .send({ success: true, data: "Friend Request sent" });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, msg: "Server Error" });
    }
}

async function removeFriend(req, res) {
    try {
        let friendId = req.body.friendId;
        console.log(friendId);
        let user = await User.findById({ _id: req.user.id });
        console.log(user);
        user.friends.filter((friend) => friend.userId != friendId);
        await user.save();
        return res.status(200).send({ success: true, data: "Friend Removed" });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, msg: "Server Error" });
    }
}

async function acceptFriendRequest(req, res) {
    try {
        let requestId = req.body.requestId;
        //inside the requests array remove the requestId and put in friends array
        let userId = req.user.id;
        console.log("meeeeeeeeee");
        const user = await User.findOne({ _id: userId });
        console.log(user);
        //remove the object from requests
        for (let i = 0; i < user.requests.length; i++) {
            console.log(user.requests[i]);
        }
        user.requests.filter((requser) => requser.userId != requestId);
        await user.save();
        for (let i = 0; i < user.friends.length; i++) {
            if (user.friends[i].userId == requestId) {
                return res
                    .status(200)
                    .send({ success: true, data: "Already a friend" });
            }
        }
        //add object in friends if not friend already
        user.friends.push({ userId: requestId });
        await user.save();
        return res.status(200).send({ success: true, data: "Friend Added" });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, msg: "Server Error" });
    }
}
async function rejectFriendRequest(req, res) {
    try {
        let requestId = req.body.requestId;
        //inside the requests array remove the requestId and put in friends array
        let userId = req.user.id;
        console.log("meeeeeeeeee");
        const user = await User.findOne({ _id: userId });
        console.log(user);
        //remove the object from requests
        for (let i = 0; i < user.requests.length; i++) {
            console.log(user.requests[i]);
        }
        user.requests.filter((requser) => requser.userId != requestId);
        await user.save();
        return res
            .status(200)
            .send({ success: true, data: "Friend Request Rejected" });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, msg: "Server Error" });
    }
}
async function getFriendRequests(req, res) {
    try {
        let user = await User.findOne({ _id: req.user.id });
        let friendrequests = user.requests;
        return res.status(200).send({ success: true, data: friendrequests });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, msg: "Server Error" });
    }
}
module.exports = {
    viewHistory,
    addToHistory,
    addToFriendHistory,
    becomeDoctor,
    becomeMerchant,
    updateProfile,
    getUserProfile,
    addFriend,
    removeFriend,
    acceptFriendRequest,
    rejectFriendRequest,
    getFriendRequests,
};
