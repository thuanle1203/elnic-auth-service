const db = require("../models");
const User = db.user;
const Role = db.role;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.createUser = async(req, res) => {
 
  User.findOne({
    email: req.body.email
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      res.status(200).send({ data: user });
      return;
    } else {
      
      const user = new User({
        fullName: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
      });

      user.save((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        if (req.body.roles) {
          Role.find(
            {
              name: { $in: req.body.roles },
            },
            (err, roles) => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }

              user.roles = roles.map((role) => role._id);
              user.save((err) => {
                if (err) {
                  res.status(500).send({ message: err });
                  return;
                }

                res.send({ data: user });
              });
            }
          );
        } else {
          Role.findOne({ name: "user" }, (err, role) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            user.roles = [role._id];
            user.save((err) => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }

              res.send({ data: user });
            });
          });
        }
      });
    }
  });
};

exports.updateUser = (req, res) => {
  User.findOneAndUpdate({ username: req.params.id }, req.body, {
    useFindAndModify: false,
  })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update User with infor. Maybe User was not found!`,
        });
      } else
        res.status(200).send({ message: "User was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating User infor",
      });
    });
};

exports.getUser = (req, res) => {
  const MAX_USER = 10;

  const condition = [
    {
      $lookup: {
        from: 'roles',
        localField: 'roles',
        foreignField: '_id',
        as: 'roles'
      }
    }
  ];

  User.aggregate(condition).then((data) => {
    if (!data) {
      res.status(404).send({
        message: `Not have any user here`,
      });
    } else
      res.status(200).send(data);
  })
  .catch((err) => {
    res.status(500).send({
      message: "Error get User",
    });
  });
};

exports.deleteUsers = (req, res) => {
  if (!req.params.id) {
    return res.status(204).send({
      message: "Id to delete can not be empty!",
    });
  }

  try {
    User.deleteOne( { _id : req.params.id } ).then(() => {
      res.status(200).send({
        message: "Delete successfuly.",
      });
    });
 } catch (e) {
  res.status(500).send({
    message: e.message || "Some error occurred while retrieving id.",
  });
 }
};

exports.getByIdOrUsername = (req, res) => {

  const id = req.query?.id;

  const username = req.query?.username;

  User.findOne({
    $or: [ { _id: id }, { username: username } ],
  }).then((data) => {
    if (!data || !data.roles.includes('61841bea95875e379c155f64')) {
      res.status(200).send({
        message: `Not have any user here`,
      });
    } else
      res.status(200).send(data);
  })
  .catch((err) => {
    res.status(500).send({
      message: "Error get User",
    });
  });
};

exports.deleteUsers = (req, res) => {
  if (!req.params.id) {
    return res.status(204).send({
      message: "Id to delete can not be empty!",
    });
  }

  try {
    User.deleteOne( { _id : req.params.id } ).then(() => {
      res.status(200).send({
        message: "Delete successfuly.",
      });
    });
 } catch (e) {
  res.status(500).send({
    message: e.message || "Some error occurred while retrieving id.",
  });
 }
};
