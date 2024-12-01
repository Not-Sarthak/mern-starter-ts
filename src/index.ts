import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const mockUsers = [
  { id: 1, username: "Ok123456" },
  { id: 2, username: "Shah" },
  { id: 3, username: "Sarthak" },
  { id: 4, username: "Test69" },
];

// GET

app.get("/", (req: Request, res: Response) => {
  console.log("Hi");
  res.status(200).send({ msg: "Hello, world!" });
});

app.get("/api/users", (req: Request, res: Response): any => {
  console.log("Query:", req.query);
  console.log("Params:", req.params);

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
});

app.get(
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

// POST

app.post("/api/users", (req: Request, res: Response): any => {
  console.log(req.body);

  const { body } = req;
  const newUser = {
    id: mockUsers[mockUsers.length - 1].id + 1,
    ...body,
  };
  mockUsers.push(newUser);
  return res.status(201).send(newUser);
});

app.put("/api/users/:id", (req: Request, res: Response): any => {
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

app.patch("/api/users/:id", (req: Request, res: Response): any => {
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

app.delete("/api/users/:id", (req: Request, res: Response): any => {
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

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});