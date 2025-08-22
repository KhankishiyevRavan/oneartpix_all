const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  showName: { type: String, required: false },
  // description: { type: String, required: true },
  fields: [
    {
      name: { type: String, required: true },
      type: { type: String, required: true },
      key: { type: String, required: true, unique: true },
      required: { type: Boolean, default: true },
    },
  ],
  permissions: {
    roles: [
      {
        role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
        permissions: {
          create: { type: Boolean, default: false },
          read: { type: Boolean, default: false },
          edit: { type: Boolean, default: false },
          delete: { type: Boolean, default: false },
        },
      },
    ],
    contracts: {
      change_status: { type: Boolean, default: false },
      delete_documents: { type: Boolean, default: false },
      upload_documents: { type: Boolean, default: false },
      view_documents: { type: Boolean, default: false },
      view_status: { type: Boolean, default: false },
    },
    users: {
      add_user: { type: Boolean, default: false },
    },
    finance: {
      addBalance: { type: Boolean, default: false },
      makePayment: { type: Boolean, default: false },
      viewPayments: { type: Boolean, default: false },
    },
  },
});

roleSchema.pre("remove", function (next) {
  if (this.name === "admin") {
    throw new Error("Admin role cannot be deleted");
  }
  next();
});

const Role = mongoose.model("Role", roleSchema, "roles");
module.exports = Role;
