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
  async fetchGroupData(req, res) {
    const { userAccountNo } = req.body;

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
  }
  catch(error) {
    throw Error(error.message);
  }
  // fetch group

  //   checkAlreadyExistingGroup
  async checkAlreadyExistingGroup(req, res) {
    try {
      groupsD.find({}, (err, docs) => {
        if (err) {
          throw Error(err.message);
        } else {
          if (docs.length > 0) {
            res.send(docs);
          } else {
            res.send("There are no groups Created yet");
          }
        }
      });
    } catch (error) {
      throw Error(error.message);
    }
  }
  // checkAlreadyExistingGroup/

  // checkAlreadyExistingGroupmembers/

  async fetchAlreadyExistingGroupMembers(req, res) {
    const { groupMembersInputValue } = req.body;
    try {
      if (groupMembersInputValue !== "") {
        InsertingData.find(
          { accounts: { $regex: groupMembersInputValue } },
          (err, docs) => {
            if (err) {
              throw Error(err.message);
            } else {
              if (docs.length > 0) {
                res.send(docs);
              } else {
                res.send("Account doesn't exists");
              }
            }
          }
        );
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      throw Error(error.message);
    }
  }

  // checkAlreadyExistingGroupmembers/

  async updateGroupMembers(req, res) {
    const { uniqueGroupKey, members, accountNo } = req.body;
    try {
      if (uniqueGroupKey !== "") {
        const result = await groupsD.updateMany(
          { uniqueGroupKeys: uniqueGroupKey },
          {
            $set: {
              member: members,
            },
          }
        );
      }
    } catch (error) {
      throw Error(error.message);
    }
  }
  // checkAlreadyExistingGroupmembers/

  // updateExistingGroupName/

  async updateExistingGroupName(req, res) {
    const { uniqueGroupKey, groupNames } = req.body;
    try {
      if (uniqueGroupKey !== "") {
        const result = await groupsD.updateMany(
          { uniqueGroupKeys: uniqueGroupKey },
          {
            $set: {
              groupNames: groupNames,
            },
          }
        );
      }
    } catch (error) {
      throw Error(error.message);
    }
  }

  // updateExistingGroupName/

  //   leave group
  async existingMemberLeftGroup(req, res) {
    const { groupKey, userAccountNo } = req.body;
    try {
      groupsD.find({ uniqueGroupKeys: groupKey }, { _id: 0 }, (err, docs) => {
        if (err) {
          throw Error(err.message);
        } else {
          if (docs.length > 0) {
            docs.map(async (users) => {
              if (users.accountNos === userAccountNo) {
                groupsD
                  .deleteOne({ accountNos: userAccountNo })
                  .then(() => {
                    res.send({
                      userAccountNo: userAccountNo,
                      message: `User left`,
                      groupKey: groupKey,
                    });
                  })
                  .catch((error) => {
                    throw Error(error.message);
                  });
              }

              if (users.uniqueGroupKeys === groupKey) {
                const result = await groupsD.updateMany(
                  { uniqueGroupKeys: groupKey },
                  {
                    $pull: {
                      member: userAccountNo,
                    },
                  }
                );
              }
            });
          } else {
            res.send("Couldnt FInd the group info");
          }
        }
      });
    } catch (error) {
      throw Error(error.message);
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
    try {
      groupsMessage.find({ groupKey: uniqueGroupKey }, (err, docs) => {
        if (err) {
          throw Error(err.message);
        } else {
          if (docs.length > 0) {
            res.send(docs);
          } else {
            res.sendStatus(404);
          }
        }
      });
    } catch (error) {
      throw Error(error.message);
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
