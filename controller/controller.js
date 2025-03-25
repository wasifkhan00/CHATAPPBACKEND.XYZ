const InsertingData = require("../model/Registeration");
const groupsD = require("../model/groupDetails");
const groupsMessage = require("../model/message");
const repository = require("../repository/repository");
const HttpStatusCodes = require("../helpers/statusCodes");

class Controller {
  constructor(InsertingData, groupsMessage, groupsD) {
    this.InsertingData = InsertingData;
    this.groupsMessage = groupsMessage;
    this.groupsD = groupsD;
  }

  async testGetRouteController(req, res, next) {
    res.send("okay");
  }
  // User Registeration
  async userRegisteration(req, res, next) {
    try {
      const registering = await repository.registerUser(req.body);

      res.status(HttpStatusCodes.OK).send(registering);

      // if (registering === "Account already exists") { //implementing it once the front end is fixed accordingly
      //   res.status(HttpStatusCodes.OK).send(registering);
      // } else {
      //   res.status(HttpStatusCodes.CREATED).send(registering);
      // }
    } catch (error) {
      next(error);
    }
  }
  //   User Registeration

  //   login Auth
  async loginAuthentication(req, res, next) {
    try {
      const authenticating = await repository.authorizeUser(req.body);
      if (authenticating === "Account no or Password not found") {
        res.status(HttpStatusCodes.OK).send("Account no or Password not found");
      } else {
        res.status(HttpStatusCodes.OK).send(authenticating);
      }
    } catch (error) {
      next(error);
    }
  }
  //   login Auth

  // userCreatedNewGroup

  async userCreatedNewGroup(req, res, next) {
    try {
      const creatingNewGroup = await repository.createNewGroup(req.body);
      if (creatingNewGroup === "Account number found") {
        return res.status(HttpStatusCodes.OK).send("Account number found");
      } else {
        return res.status(HttpStatusCodes.OK).send("Account number not found");
      }
    } catch (error) {
      next(error);
    }
  }
  // userCreatedNewGroup

  // fetch group
  async fetchGroupData(req, res, next) {
    try {
      const fetchingGroupDetails = await repository.fetchGroupDataFromDB(
        req.body
      );

      if (fetchingGroupDetails === "Account number not found") {
        return res.status(HttpStatusCodes.OK).send("Account number not found");
      } else {
        return res.status(HttpStatusCodes.OK).send(fetchingGroupDetails);
      }
    } catch (error) {
      next(error);
    }
  }
  // fetch group

  //   checkAlreadyExistingGroup
  async checkAlreadyExistingGroup(req, res, next) {
    try {
      const fetchingGroups = await repository.fetchExistingGroups();

      if (fetchingGroups === "No groups found") {
        return res
          .status(HttpStatusCodes.OK)
          .send("There are no groups Created yet");
      } else {
        return res.status(HttpStatusCodes.OK).send(fetchingGroups);
      }
    } catch (error) {
      next(error);
    }
  }
  // checkAlreadyExistingGroup/

  // checkAlreadyExistingGroupmembers/

  async fetchAlreadyExistingGroupMembers(req, res, next) {
    const { groupMembersInputValue } = req.body;

    if (groupMembersInputValue !== "") {
      try {
        const checkGroupMembers = await repository.checkForExistingGroupMembers(
          req.body
        );
        return res.status(HttpStatusCodes.OK).send(checkGroupMembers);
      } catch (error) {
        next(error);
      }
    } else {
      res.sendStatus(HttpStatusCodes.NOT_FOUND);
    }
  }

  // checkAlreadyExistingGroupmembers/

  async updateGroupMembers(req, res, next) {
    const { uniqueGroupKey } = req.body;

    if (uniqueGroupKey !== "") {
      try {
        const updateMembers = await repository.updateAndInsertGroupMember(
          req.body
        );
        return res.status(HttpStatusCodes.OK).send(`Updated`);
      } catch (error) {
        next(error);
      }
    }
  }
  // checkAlreadyExistingGroupmembers/

  // updateExistingGroupName/

  async updateExistingGroupName(req, res, next) {
    const { uniqueGroupKey } = req.body;

    if (uniqueGroupKey !== "") {
      try {
        const updateMyGroupName = await repository.updateGroupName(req.body);

        res.status(HttpStatusCodes.OK).send(`Updated`);
      } catch (error) {
        next(error);
      }
    }
  }

  // updateExistingGroupName/
  
  // starting from here pluys deploying it and connecting frotnend with it apart from this reducing redundant or same data deposit in the db
  //   leave group
  async existingMemberLeftGroup(req, res,next) {
    try {
    const leavingGroup = await repository.userLeftGroup(req.body);
    res.send(leavingGroup);
    } catch (error) {
      next(error);
    }
  }

  //   leave group

  //groupDeletion

  async deleteGroupPermanently(req, res) {
    const { groupKey, isAdmin } = req.body;
    try {
      groupsD.deleteMany({ uniqueGroupKeys: groupKey }, (err, docs) => {
        if (err) {
          throw Error(err.message);
        } else {
          if (docs) {
            res.send("group Deleted");

            groupsMessage.deleteMany({ groupKey: groupKey }, (err, docs) => {
              if (err) {
                throw Error(err.message);
              } else {
                if (docs) {
                  console.log("User Successfully Deleted the Group");
                }
              }
            });
          }
        }
      });
    } catch (error) {
      throw Error(error.message);
    }
  }

  //groupDeletion

  // Fetch Messages

  async fetchMessages(req, res) {
    const { uniqueGroupKey } = req.body;
    console.log("fetch Messages hit");

    try {
      // Use await without passing a callback, which ensures that it returns a promise
      const docs = await groupsMessage
        .find({ groupKey: uniqueGroupKey })
        .exec();

      if (docs.length > 0) {
        console.log("fetch Messages fetched");
        res.send(docs);
      } else {
        console.log("fetch Messages not found");
        res.sendStatus(404);
      }
    } catch (error) {
      console.error("Error fetching messages:", error.message);
      res.sendStatus(500);
    }
  }

  // Fetch Messages

  // Reserve Unknown Routes

  async reserveUnknownRoutes(req, res) {
    const { userAccountNo } = req.body;
    try {
      groupsD.find({ accountNos: userAccountNo }, { _id: 0 }, (err, docs) => {
        if (err) {
          throw Error(err.message);
        } else {
          if (docs.length > 0) {
            res.send(docs);
          } else {
            res.send("Couldnt FInd the group info");
          }
        }
      });
    } catch (error) {
      throw Error(error.message);
    }
  }

  // Reserve Unknown Routes
}
module.exports = new Controller(InsertingData, groupsMessage, groupsD);
