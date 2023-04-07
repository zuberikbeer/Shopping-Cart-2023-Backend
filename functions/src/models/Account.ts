import { ObjectId } from "mongodb";

export default interface Account {
  _id?: ObjectId;
  profilePic: string;
  userName: string;
  email: string;
  password: string;
  uid: string;
  initalSetup: boolean;
}
