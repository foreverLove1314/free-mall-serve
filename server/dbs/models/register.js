import mongoose from "mongoose";
const Schema = mongoose.Schema;
let registerSchema = new Schema({
  user: String,
  password: String
});
export default mongoose.model("register", registerSchema);
