import mongoose from "mongoose";

mongoose.set("strictQuery", false);

const ticketSchema = mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  purchase_datetime: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  purcharser: {
    type: String,
    required: true,
  },
  status: String,
  products: [
    {
      pid: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
      quantity: Number,
    },
  ],
});

const ticketCollection = "tickets";

const ticketModel = mongoose.model(ticketCollection, ticketSchema);

export default ticketModel;
