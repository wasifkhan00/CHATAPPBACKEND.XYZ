const express = require("express");
const Controller = require("../controller/controller");
const auth = require("../auth/auth");
const router = express.Router();

router.get("/", Controller.testGetRouteController);
router.post("/register", Controller.RegisterUser);
router.post("/login", Controller.loginAuthentication);
router.post("/verifyOtp", Controller.verifyOtp);
// auth
router.post("/groupInformation", auth, Controller.userCreatedNewGroup);
router.post("/groupInformationz", auth, Controller.fetchGroupData);
router.get("/EveryGroupsData", auth, Controller.checkAlreadyExistingGroup);
router.post(
  "/checkForGroupNames",
  auth,
  Controller.fetchAlreadyExistingGroupMembers
);
router.put("/updateGroupMembersArray", auth, Controller.updateGroupMembers);
router.put("/updateGroupName", auth, Controller.updateExistingGroupName);
router.delete("/groupleaving", auth, Controller.existingMemberLeftGroup);
router.delete("/groupDeletion", auth, Controller.deleteGroupPermanently);
router.post("/fetchMessages", auth, Controller.fetchMessages);
router.post(
  "/groupInformationForGroupMemberCheck",
  auth,
  Controller.reserveUnknownRoutes
);

module.exports = router;
