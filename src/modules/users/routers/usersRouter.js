const { Router } = require("express");
const {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/usersController");
const { protect, restrictTo } = require("../../../middlewares/authMiddleware");


const usersRouter = Router();

usersRouter.route("/").post(createUser);
usersRouter.use(protect);
usersRouter.route("/").get(restrictTo("Administrador"), getUsers);
usersRouter.route("/:id").get(getUserById).patch(updateUser).delete(deleteUser);

module.exports = usersRouter;