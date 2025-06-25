const userRegisteration = require("../model/Registeration");
const chatGroupInfo = require("../model/groupDetails");
const groupsMessage = require("../model/message");
const repository = require("../repository/repository");
const HttpStatusCodes = require("../helpers/statusCodes");
const generateToken = require("../helpers/generateToken");
const { sendOTPEmail } = require("../helpers/emailHelper");
const generateOTP = require("../helpers/generateEmailOTP");
const saveOtpToDB = require("../helpers/saveOtpToDb");
const otpModel = require("../model/otpModel");
const bcrypt = require("bcrypt");

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
  async RegisterUser(req, res, next) {
    const { email } = req.body;

    try {
      const registering = await repository.registerUser(req.body);

      if (registering === "Account already exists") {
        res.status(HttpStatusCodes.OK).send({
          message: "Account already exists",
          success: false,
          email: email,
        });
      } else {
        const otp = generateOTP();

        const otpEmailSent = await sendOTPEmail(email, otp);

        if (otpEmailSent.success) await saveOtpToDB(email, otp);

        return res.status(HttpStatusCodes.OK).send({
          message:
            "An email with the 6 digit OTP has been sent to your email address.",
          success: true,
          email: email,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async verifyOtp(req, res, next) {
    try {
      const { email, otp } = req.body;

      const otpRecords = await otpModel
        .findOne({ email })
        .sort({ createdAt: -1 });

      if (!otpRecords) {
        return res
          .status(400)
          .send({ message: "OTP expired or not found Try Getting a new OTP." });
      }

      const isMatch = await bcrypt.compare(otp, otpRecords.otp);

      if (!isMatch) return res.status(400).send({ message: "Invalid OTP." });

      await userRegisteration.updateOne(
        { emails: email },
        { $set: { verifiedEmail: true } }
      );

      await otpModel.deleteMany({ email });

      const user = await userRegisteration.findOne({ emails: email });

      const token = generateToken({
        email: user.emails,
        userName: user.names,
      });
      return res.status(200).json({
        message: "OTP verified successfully",
        token: token,
        success: true,
        names: user.names,
        emails: user.emails,
      });
    } catch (err) {
      next(err);
    }
  }

  //   login Auth
  async loginAuthentication(req, res, next) {
    try {
      const authenticating = await repository.authorizeUser(req.body);
      if (authenticating === "Account no or Password not found") {
        res.status(HttpStatusCodes.OK).send("Account no or Password not found");
      } else {
        const token = generateToken({
          emails: authenticating.emails,
          userName: authenticating.UserName,
        });

        const responsePayload = {
          emails: authenticating.emails,
          names: authenticating.UserName,
          success: true,
          token: token,
        };

        res.status(HttpStatusCodes.OK).send(responsePayload);
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
        return res.status(HttpStatusCodes.OK).send({
          message: "Account number found",
          success: true,
        });
      } else {
        return res
          .status(HttpStatusCodes.OK)
          .send({ message: "Account number not found", success: false });
      }
    } catch (error) {
      next(error);
    }
  }
  // userCreatedNewGroup

  // fetchgroup
  async fetchGroupData(req, res, next) {
    const { emailAddress } = req.body;

    if (!emailAddress || emailAddress === "") {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .send("Email address is required");
    }

    try {
      const fetchingGroupDetails = await repository.fetchGroupDataFromDB(
        emailAddress
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
      const groups = await repository.fetchExistingGroups();

      if (!groups || groups.length === 0) {
        return res.status(HttpStatusCodes.OK).send({
          success: false,
          message: "There are no groups created yet",
        });
      }

      // Extract all account numbers from groups
      const groupAccountNumbers = groups.map((group) => group.accountNos);

      return res.status(HttpStatusCodes.OK).send({
        success: true,
        groupsCreatorUsers: groupAccountNumbers,
      });
    } catch (error) {
      next(error);
    }
  }
  // checkAlreadyExistingGroup/

  // checkAlreadyExistingGroupmembers/

  async fetchAlreadyExistingGroupMembers(req, res, next) {
    const { groupMembersInputValue } = req.body;

    if (groupMembersInputValue !== "" && groupMembersInputValue) {
      try {
        const checkGroupMembers = await repository.checkForExistingGroupMembers(
          req.body
        );

        if (checkGroupMembers === "Account doesn't exists") {
          return res.status(HttpStatusCodes.OK).send({
            success: false,
            message: "Account doesn't exists",
          });
        }

        const responsePayload = {
          success: true,
          groupCreators: checkGroupMembers,
        };

        return res.status(HttpStatusCodes.OK).send(responsePayload);
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
    console.log("existingMemberLeftGroup");
    console.log(req.body);
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
      const deleteGroup = await repository.adminDeleteGroup(req.body);

      if (deleteGroup === "Group Deleted Permanently") {
        return res
          .status(HttpStatusCodes.OK)
          .send({ message: "Group Deleted Permanently", success: true });
      } else {
        return res.status(HttpStatusCodes.NOT_FOUND).send({
          message: "Group not found",
          success: false,
        });
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
}
module.exports = new Controller(
  userRegisteration,
  groupsMessage,
  chatGroupInfo
);
