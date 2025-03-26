const userRegisteration = require("../model/Registeration");
const chatGroupInfo = require("../model/groupDetails");
const groupsMessage = require("../model/message");
const repository = require("../repository/repository");
const HttpStatusCodes = require("../helpers/statusCodes");

class Controller {
  constructor(userRegisteration, groupsMessage, chatGroupInfo) {
    this.userRegisteration = userRegisteration;
    this.groupsMessage = groupsMessage;
    this.chatGroupInfo = chatGroupInfo;
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

  //   leave group
  async existingMemberLeftGroup(req, res, next) {
    try {
      const leavingGroup = await repository.userLeftGroup(req.body);
      res.status(HttpStatusCodes.OK).send(leavingGroup);
    } catch (error) {
      next(error);
    }
  }
  //   leave group

  //groupDeletion

  async deleteGroupPermanently(req, res, next) {
    try {
      const deleteGroup = await repository.deleteGroupPermanently(req.body);

      if (deleteGroup === "Group Deleted Permanently") {
        return res.status(HttpStatusCodes.OK).send("Group Deleted Permanently");
      } else {
        return res.status(HttpStatusCodes.NOT_FOUND).send("Group not found");
      }
    } catch (error) {
      next(error);
    }
  }

  //groupDeletion

  // Fetch Messages

  async fetchMessages(req, res, next) {
    try {
      const fetchedMessages = await repository.fetchExistingMessages(req.body);

      if (fetchedMessages.length > 0) {
        res.status(HttpStatusCodes.OK).send(fetchedMessages);
      } else {
        res.status(HttpStatusCodes.NOT_FOUND).send("No messages found");
      }
    } catch (error) {
      next(error);
    }
  }

  // Fetch Messages

  // Reserve Unknown Routes

  async reserveUnknownRoutes(req, res, next) {
    try {
      const unknownReq = await repository.unknowReserve(req.body);

      if (unknownReq > 0) {
        res.status(HttpStatusCodes.OK).send(unknownReq);
      } else {
        res.status(HttpStatusCodes.NOT_FOUND).send("Account number not found");
      }
    } catch (error) {
      next(error);
    }
  }

  // Reserve Unknown Routes

  
  // starting from here pluys deploying it and connecting frotnend with it apart from this reducing redundant or same data deposit in the db
  // Okay so there is a problem when you add someone to the group again the person who is added his member array are updated meaning both of the 2 members are there present
  // but the person who added it i mean the admin his member array doesnt get updated
  // Apart from this changing variable names and making the code more readable and understandable
}
module.exports = new Controller(userRegisteration, groupsMessage, chatGroupInfo);
