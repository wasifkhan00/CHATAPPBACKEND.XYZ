const userRegisteration = require("../model/Registeration");
const chatGroupInfo = require("../model/groupDetails");
const groupsMessage = require("../model/message");

class Repository {
  constructor(userRegisteration, groupsMessage, chatGroupInfo) {
    this.userRegisteration = userRegisteration;
    this.groupsMessage = groupsMessage;
    this.chatGroupInfo = chatGroupInfo;
  }
  // registeration
  async registerUser({ name, account, password }) {
    try {
      const docs = await userRegisteration.find({
        accounts: account,
        passwords: password,
      })
        .select("-_id -__v")
        .exec();

      if (!docs.length > 0) {
        const dataToDB = new userRegisteration({
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
      const docs = await userRegisteration.find({
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
      const docs = await chatGroupInfo.find({ accountNos: accountNo }).exec();
      // it means group already doesnt exist so we can create a new group
      if (!docs.length > 0) {
        const groupDataToDB = new chatGroupInfo({
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
      const docs = await chatGroupInfo.find({ accountNos: userAccountNo }).exec();
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
      const docs = await chatGroupInfo.find({}).exec();
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
      const docs = await userRegisteration.find({
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
      const updatingGroupMembers = await chatGroupInfo.updateMany(
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

  // update group name
  async updateGroupName({ uniqueGroupKey, groupNames }) {
    try {
      const result = await chatGroupInfo.updateMany(
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

  // User Left group
  async userLeftGroup({ groupKey, userAccountNo }) {
    try {
      // Find groups matching the groupKey
      const docs = await chatGroupInfo
        .find({ uniqueGroupKeys: groupKey }, { _id: 0 })
        .exec();

      if (docs.length > 0) {
        for (const users of docs) {
          // If the user's account number matches, delete the user
          if (users.accountNos === userAccountNo) {
            const red = await chatGroupInfo.deleteOne({ accountNos: userAccountNo });

            return {
              userAccountNo,
              message: `User left`,
              groupKey,
            };
          }

          // Remove the user from the member array if groupKey matches
          if (users.uniqueGroupKeys === groupKey) {
            const updateGroupMembersArray = await chatGroupInfo.updateMany(
              { uniqueGroupKeys: groupKey },
              {
                $pull: {
                  member: userAccountNo,
                },
              }
            );
          }
        }
      } else {
        return "Account number not found";
      }
    } catch (error) {
      throw error;
    }
  }
  // User Left group

  // deleteGroupPermanently

  async adminDeleteGroup({ groupKey }) {
    const docs = await chatGroupInfo.deleteMany({ uniqueGroupKeys: groupKey });

    try {
      if (docs) {
        const deleteGroupMessages = await groupsMessage.deleteMany({
          groupKey: groupKey,
        });

        if (docs && deleteGroupMessages) {
          return "Group Deleted Permanently";
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async fetchExistingMessages({ uniqueGroupKey }) {
    try {
      const docs = await groupsMessage
        .find({ groupKey: uniqueGroupKey })
        .exec();

      return docs;
    } catch (error) {
      throw error;
    }
  }

  async unknowReserve({ userAccountNo }) {
    try {
      const docs = await chatGroupInfo.find({ accountNos: userAccountNo }).exec();

      if (docs.length > 0) {
        return docs;
      } else {
        return "Account number not found";
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new Repository(userRegisteration, groupsMessage, chatGroupInfo);
