const express = require("express");
const Controller = require("../controller/controller");
const router = express.Router();

router.get("/", Controller.testGetRouteController);
router.post("/register", Controller.userRegisteration);
router.post("/login", Controller.loginAuthentication);
router.post("/groupInformation", Controller.userCreatedNewGroup);
router.post("/groupInformationz", Controller.fetchGroupData);
router.get("/EveryGroupsData", Controller.checkAlreadyExistingGroup);
router.post("/checkForGroupNames", Controller.fetchAlreadyExistingGroupMembers);
router.put("/updateGroupMembersArray", Controller.updateGroupMembers);
router.put("/updateGroupName", Controller.updateExistingGroupName);
router.delete("/groupleaving", Controller.existingMemberLeftGroup);
router.delete("/groupDeletion", Controller.deleteGroupPermanently);
router.post("/fetchMessages", Controller.fetchMessages);
router.post(
  "/groupInformationForGroupMemberCheck",
  Controller.reserveUnknownRoutes
);

module.exports = router;
