import mongoose from "mongoose";
const Schema = mongoose.Schema;
let registerSchema = new Schema({
  username: {
    type: String,
    require: true
  },
  phone: {
    type: Number,
    require: true
  },
  password: {
    type: String,
    require: true
  }
});
export default mongoose.model("registerPhone", registerSchema);
