import { ObjectId } from "mongodb";
import shoppingCartItem from "./shoppingCartItem";

export default interface Account {
  _id?: ObjectId;
  profilePic: string;
  userName: string;
  email: string;
  password: string;
  shoppingCart: shoppingCartItem[];
  orderTotal: number;
  shippingAddress: string;
  uid: string;
  initalSetup: boolean;
}
