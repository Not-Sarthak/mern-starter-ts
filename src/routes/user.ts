import { Router } from "express";
import { Request, Response } from "express";
import {
  checkSchema,
  matchedData,
  query,
  validationResult,
} from "express-validator";
import { mockUsers } from "../utils/constants.js";
import { createUserValidationSchema } from "../utils/validation-schemas.js";

const router = Router();

router.get(
  "/api/users",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("Must Not be Empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("Must be at least 3-10 characters"),
  (req: Request, res: Response): any => {
    console.log("Query:", req.query);
    console.log("Params:", req.params);

    console.log(req.session.id);
    req.sessionStore.get(req.session.id, (err, sessionData) => {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log(sessionData);
    });

    const result = validationResult(req);
    console.log(result);

    const {
      query: { filter, value },
    } = req;

    if (!filter || !value || (filter !== "id" && filter !== "username")) {
      return res
        .status(400)
        .send({ msg: "Invalid filter. Use 'id' or 'username'." });
    }

    const valueStr = Array.isArray(value) ? value[0] : value;

    if (typeof valueStr !== "string") {
      return res.status(400).send({ msg: "Invalid value. Expected a string." });
    }

    return res.status(200).send(
      mockUsers.filter((user) => {
        return user[filter as keyof typeof user]?.toString().includes(valueStr);
      })
    );
  }
);

router.get(
  "/api/users/:id",
  (req: Request<{ id: string }>, res: Response): any => {
    const parseId = parseInt(req.params.id, 10);

    if (isNaN(parseId)) {
      return res.status(400).send({
        msg: "Bad Request. Invalid ID.",
      });
    }

    const findUser = mockUsers.find((user) => user.id === parseId);

    if (!findUser) {
      return res.status(404).send({
        msg: "User not found",
      });
    }

    return res.status(200).send({
      msg: "User found",
      user: findUser,
    });
  }
);

router.post(
  "/api/users",
  checkSchema(createUserValidationSchema),
  (req: Request, res: Response): any => {
    console.log(req.body);

    const result = validationResult(req);
    console.log(result);

    if (!result.isEmpty()) {
      return res.status(400).send({
        errors: result.array(),
      });
    }

    const data = matchedData(req); // Returns validated data
    console.log(data);

    // const { body } = req;
    const newUser: {
      id: number;
      username: string;
    } = {
      id: mockUsers[mockUsers.length - 1].id + 1,
      ...(data as { username: string }),
    };
    mockUsers.push(newUser);
    return res.status(201).send(newUser);
  }
);

router.put("/api/users/:id", (req: Request, res: Response): any => {
  const {
    body,
    params: { id },
  } = req;

  const parseId: number = parseInt(id);
  if (isNaN(parseId)) return res.sendStatus(400);

  const findUserIndex: number = mockUsers.findIndex(
    (user) => user.id === parseId
  );

  if (findUserIndex === -1) {
    return res.sendStatus(404);
  }

  mockUsers[findUserIndex] = {
    id: parseId,
    ...body,
  };

  return res.sendStatus(200).send({
    msg: "Successfully Updated!",
  });
});

router.patch("/api/users/:id", (req: Request, res: Response): any => {
  const {
    body,
    params: { id },
  } = req;

  const parseId: number = parseInt(id);
  if (isNaN(parseId)) return res.sendStatus(400);

  const findUserIndex: number = mockUsers.findIndex(
    (user) => user.id === parseId
  );

  if (findUserIndex === -1) {
    return res.sendStatus(404);
  }

  mockUsers[findUserIndex] = {
    ...mockUsers[findUserIndex],
    ...body,
  };
  return res.sendStatus(200);
});

router.delete("/api/users/:id", (req: Request, res: Response): any => {
  const {
    params: { id },
  } = req;

  const parseId = parseInt(id);
  if (isNaN(parseId)) return res.sendStatus(400);

  const findUserIndex = mockUsers.findIndex((user) => user.id === parseId);
  if (findUserIndex === -1) {
    return res.sendStatus(404);
  }

  mockUsers.splice(findUserIndex);

  return res.sendStatus(200);
});

export default router;
