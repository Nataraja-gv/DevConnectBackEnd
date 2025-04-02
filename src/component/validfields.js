const ValidFieldRequest = (req) => {
  const ALLOWEDFIELDSET = ["name", "age", "gendor", "skills", "photoURL"];

  const allowed_field = Object.keys(req.body).every((field) =>
    ALLOWEDFIELDSET.includes(field)
  );
  return allowed_field;
};

module.exports = ValidFieldRequest;
