const express = require("express");
const router = express.Router();

const isLoggedIn = require("../middleware/isLoggedIn");

const {
    Register,
    Login,
    ResetPassword,
    ForgotPassword,
    VerifyEmail,
    ReVerify,
} = require("./auth");

const {
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
    getFriends,
} = require("./user");

const { viewPatientHistory, viewPatients } = require("./doctor");

const { verifyDoctor, verifyMerchant } = require("./admin");

//Auth Routes ->Rhea
router.post("/auth/register", Register);
router.post("/auth/login", Login);
router.post("/auth/forgotpassword", ForgotPassword);
router.post("/auth/resetpassword/:token", ResetPassword);
router.get("/auth/verifyemail/:token", VerifyEmail);
router.post("/auth/reverify", ReVerify);

//User Routes ->Abhijeet
router.get("/user/viewhistory/:userId", isLoggedIn, viewHistory);
router.post("/user/updatehistory/:userId", isLoggedIn, addToHistory);
router.post("/user/applydoctor/:userId", isLoggedIn, becomeDoctor);
router.post("/user/applymerchant/:userId", isLoggedIn, becomeMerchant);
router.post("/user/updateprofile/:userId", isLoggedIn, updateProfile);
router.get("/user/viewprofile/:userId", isLoggedIn, getUserProfile);

//Doctor Routes ->Abhijeet
// (:userId is userID of Doctor, pass patient userId in body)
router.post("/user/doctor/viewhistory/:userId", isLoggedIn, viewPatientHistory);
router.get("/user/doctor/viewpatients/:userId", isLoggedIn, viewPatients);

//Admin Routes ->Abhijeet
router.get("/user/admin/verifydoctor/:doctorId", isLoggedIn, verifyDoctor);
router.get("/user/admin/verifydoctor/:merchantId", isLoggedIn, verifyMerchant);

//User Routes ->Rhea
router.post("/user/addfriend", isLoggedIn, addFriend);
router.post("/user/removefriend", isLoggedIn, removeFriend);
router.post(
    "/user/updatefriendhistory/:friendId",
    isLoggedIn,
    addToFriendHistory
);
router.post("/user/acceptfriendrequest", isLoggedIn, acceptFriendRequest);
router.post("/user/rejectfriendrequest", isLoggedIn, rejectFriendRequest);
router.get("/user/getfriendrequests", isLoggedIn, getFriendRequests);
router.get("/user/getfriends", isLoggedIn, getFriends);

module.exports = router;
