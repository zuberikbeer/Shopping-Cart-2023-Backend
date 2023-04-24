import { ObjectId } from "mongodb";

export default interface Account {
  _id?: ObjectId;
  profilePic: string;
  userName: string;
  uid: string;
  initalSetup: boolean;
}
