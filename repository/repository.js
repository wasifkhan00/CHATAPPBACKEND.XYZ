const userRegisteration = require("../model/Registeration");
const chatGroupInfo = require("../model/groupDetails");
const groupsMessage = require("../model/message");
const bcrypt = require("bcrypt");

class Repository {
  constructor(userRegisteration, groupsMessage, chatGroupInfo) {
    this.userRegisteration = userRegisteration;
    this.groupsMessage = groupsMessage;
    this.chatGroupInfo = chatGroupInfo;
  }
  // registeration
  async registerUser({ name, email, password }) {
    try {
      const existingUser = await userRegisteration
        .findOne({ emails: email })
        .select("_id")
        .exec();

      if (existingUser) {
        return "Account already exists";
      }

      const dataToDB = new userRegisteration({
        names: name,
        emails: email,
        passwords: password,
      });

      await dataToDB.save();

      return `Account Successfully Registered`;
    } catch (error) {
      throw error;
    }
  }
  // registeration

  // login Auth
  async authorizeUser({ emails, password }) {
    try {
      const user = await userRegisteration
        .findOne({
          emails: emails,
        })
        .select("+passwords -_id -__v")
        .exec();
      if (!user) return "Account no or Password not found";

      const isMatch = await bcrypt.compare(password, user.passwords);

      if (!isMatch) return "Account no or Password not found";

      return { UserName: user.names, emails: user.emails };
    } catch (error) {
      throw error;
    }
  }
  // login Auth

  // user group created

  async createNewGroup({
    email,
    uniqueGroupKey,
    groupName,
    isAdmin,
    members,
    AddedBy,
  }) {
    try {
      const docs = await chatGroupInfo.find({ emails: email }).exec();
      // it means group already doesnt exist so we can create a new group
      if (!docs.length > 0) {
        const groupDataToDB = new chatGroupInfo({
          emails: email,
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
  async fetchGroupDataFromDB(emailAddress) {
    try {
      const docs = await chatGroupInfo.find({ emails: emailAddress }).exec();

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
      const searchValue =
        typeof groupMembersInputValue === "string"
          ? groupMembersInputValue
          : "";
      if (!searchValue.trim()) {
        return "Invalid search value";
      }

      const docs = await userRegisteration
        .find({
          emails: {
            $regex: new RegExp(`(^|\\b)${searchValue}`, "i"),
          },
        })
        .limit(10)
        .exec();

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
  async userLeftGroup({ groupKey, email }) {
    console.log("left the group inititated");
    try {
      // Find groups matching the groupKey
      const docs = await chatGroupInfo
        .find({ uniqueGroupKeys: groupKey }, { _id: 0 })
        .exec();

      if (docs.length > 0) {
        for (const users of docs) {
          // If the user's account number matches, delete the user
          if (users.emails === email) {
            const red = await chatGroupInfo.deleteOne({
              emails: email,
            });

            return {
              email,
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
                  member: email,
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
      const docs = await chatGroupInfo
        .find({ accountNos: userAccountNo })
        .exec();

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

module.exports = new Repository(
  userRegisteration,
  groupsMessage,
  chatGroupInfo
);
