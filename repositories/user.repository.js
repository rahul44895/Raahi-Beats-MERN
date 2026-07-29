const User = require("../models/UserSchema");

// The only module in the user domain that talks to Mongoose.
//
// Why: it lets user.service.js be unit-tested by substituting this object,
// with no database and no Express involved, and it keeps Mongoose's API from
// leaking upward — the service receives plain objects, so nothing above this
// layer can accidentally depend on document methods like .save().
// (Dependency inversion; see #30 and §6 of docs/backend-optimization-backlog.md.)

// `.lean()` throughout, rather than the JSON.parse(JSON.stringify(doc)) pattern
// used across the rest of the codebase: lean skips Mongoose document hydration
// entirely instead of building full documents only to discard them.
const findByEmail = (email) => User.findOne({ email }).lean();

const findById = (id) => User.findById(id).lean();

const create = async (userData) => {
  const user = await User.create(userData);
  // create() returns a hydrated document; convert so callers get the same
  // plain-object shape the find* methods return.
  return user.toObject();
};

module.exports = { findByEmail, findById, create };
