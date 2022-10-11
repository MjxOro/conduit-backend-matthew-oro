import { validateBody, validateEmail } from "../utils/validators";
import { userResponse, getToken } from "../utils/userControllerUtils";
import { createUser, queryOneUser } from "../models/users";
import { verifyToken, signToken } from "../utils/jwtUtils";
import { errorHandles } from "../utils/errorHandleUtils"

export async function registerUser(req, res) {
  try {
    const { user } = req.body;
    const expectedPayload = {
      username: "string",
      email: "string",
      password: "string",
    };
    if (!user) {
      throw new Error("No payload found");
    }
    if (!validateBody(user, expectedPayload)) {
      throw new Error("Invalid payload format");
    }
    if (!validateEmail(user.email)) {
      throw new Error("Invalid email format");
    }
    const { password, ...tokenPayload } = user;
    const token = signToken(tokenPayload);
    const newUser = await createUser(user);
    const responseData = userResponse(newUser, token);
    return res.status(201).json(responseData);
  } catch (e) {
    console.error(e);
    const error = errorHandles.find(({ message }) => message === e.message);
    if (error) {
      res.status(error.statusCode).send(error.message);
    } else {
      res.status(500).send("Server Error");
    }
  }
}

export async function getUser(req, res) {
  try {
    const user = queryOneUser(req.user.email);
    const responseData = userResponse(user);
    return res.status(200).json(responseData);
  } catch (e) {
    console.error(e);
    const error = errorHandles.find(({ message }) => message === e.message);
    if (error) {
      res.status(error.statusCode).send(error.message);
    } else {
      res.status(500).send("Server Error");
    }
  }
}
