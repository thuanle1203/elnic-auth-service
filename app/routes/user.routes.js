const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const { verifySignUp } = require("../middlewares");

module.exports = function (app) {

  app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/test/admin",  
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
  
  app.get("/api/user", controller.getUser);

  app.post("/api/user/createUser", controller.createUser);

  app.get("/api/user/getByIdOrUsername", controller.getByIdOrUsername);
  
  app.put("/api/user/:id", controller.updateUser);

  app.delete("/api/user/:id", controller.deleteUsers);
};
