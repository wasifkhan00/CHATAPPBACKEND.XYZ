const InsertingData = require("../model/Registeration");
const groupsD = require("../model/groupDetails");
const groupsMessage = require("../model/message");

class Repository {
  constructor(InsertingData, groupsMessage, groupsD) {
    this.InsertingData = InsertingData;
    this.groupsMessage = groupsMessage;
    this.groupsD = groupsD;
  }
  // registeration
  async registerUser({ name, account, password }) {
    try {
      const docs = await InsertingData.find({
        accounts: account,
        passwords: password,
      })
        .select("-_id -__v")
        .exec();

      if (!docs.length > 0) {
        const dataToDB = new InsertingData({
          names: name,
          accounts: account,
          passwords: password,
        });

        await dataToDB.save();

        return `Account Successfully Registered`;
      } else {
        return "Account already exists";
      }
    } catch (error) {
      throw error;
    }
  }
  // registeration

  // login Auth
  async authorizeUser({ account, password }) {
    try {
      const docs = await InsertingData.find({
        accounts: account,
        passwords: password,
      })
        .select("-_id -__v")
        .exec();
      if (docs.length > 0) {
        return docs;
      } else {
        return "Account no or Password not found";
      }
    } catch (error) {
      throw error;
    }
  }
  // login Auth

  // user group created

  async createNewGroup({
    accountNo,
    uniqueGroupKey,
    groupName,
    isAdmin,
    members,
    AddedBy,
  }) {
    try {
      const docs = await groupsD.find({ accountNos: accountNo }).exec();
      // it means group already doesnt exist so we can create a new group
      if (!docs.length > 0) {
        const groupDataToDB = new groupsD({
          accountNos: accountNo,
          uniqueGroupKeys: uniqueGroupKey,
          groupNames: groupName,
          isAdmin: isAdmin,
          member: members,
          addedBy: AddedBy,
        });
        groupDataToDB.save();
        return "Account number not found";
      } else {
        return "Account number found";
      }
    } catch (error) {
      throw error;
    }
  }

  // user group created

  // fetching group data for login
  async fetchGroupDataFromDB({ userAccountNo }) {
    try {
      const docs = await groupsD.find({ accountNos: userAccountNo }).exec();
      if (docs.length > 0) {
        return docs;
      } else {
        return "Account number not found";
      }
    } catch (error) {
      throw error;
    }
  }

  // fetching group data for login
  async fetchExistingGroups() {
    try {
      const docs = await groupsD.find({}).exec();
      if (docs.length > 0) {
        return docs;
      } else {
        return "No groups found";
      }
    } catch (error) {
      throw error;
    }
  }
  // fetching group data for check For Existing Group Members

  async checkForExistingGroupMembers({ groupMembersInputValue }) {
    try {
      const docs = await InsertingData.find({
        accounts: { $regex: groupMembersInputValue },
      }).exec();

      if (docs.length > 0) {
        return docs;
      } else {
        return "Account doesn't exists";
      }
    } catch (error) {
      throw error;
    }
  }
  // fetching group data for check For Existing Group Members

  // updating groupmembers data

  async updateAndInsertGroupMember({ uniqueGroupKey, members, accountNo }) {
    try {
      const updatingGroupMembers = await groupsD.updateMany(
        { uniqueGroupKeys: uniqueGroupKey },
        {
          $set: {
            member: members,
          },
        }
      );

      return updatingGroupMembers;
    } catch (error) {
      throw error;
    }
  }
  // updating groupmembers data

  async updateGroupName({ uniqueGroupKey, groupNames }) {
    try {
      const result = await groupsD.updateMany(
        { uniqueGroupKeys: uniqueGroupKey },
        {
          $set: {
            groupNames: groupNames,
          },
        }
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new Repository(InsertingData, groupsMessage, groupsD);
