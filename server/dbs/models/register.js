import mongoose from "mongoose";
const Schema = mongoose.Schema;
let registerSchema = new Schema({
  user: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  }
});
export default mongoose.model("register", registerSchema);
