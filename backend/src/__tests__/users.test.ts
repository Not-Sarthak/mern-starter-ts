import * as validator from "express-validator";
import * as helpers from "../utils/helpers.js";
import { createUserHandler, getUserByIdHandler } from "../handlers/users";
import { User } from "../schemas/user";
import { mockUsers } from "../utils/constants";

jest.mock("express-validator", () => ({
  validationResult: jest.fn(() => ({
    isEmpty: jest.fn(() => false),
    array: jest.fn(() => [{ msg: "Invalid Field" }]),
  })),
  matchedData: jest.fn(() => ({
    username: "test",
    password: "password",
    displayName: "test_name",
  })),
}));

jest.mock("../utils/helpers.js", () => ({
  hashPassword: jest.fn((password) => `hashed_${password}`),
}));

jest.mock("../schemas/user.js");

const mockRequest = {
  findUserIndex: 1,
};

const mockResponse: any = {
  sendStatus: jest.fn(),
  send: jest.fn(),
  status: jest.fn(() => mockResponse),
};

describe("Get Users", () => {
  console.log("Test for Get User By ID Endpoint");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // it() or test(), both do the same thing
  it("Should get User by ID", () => {
    console.log("Test for Get User By ID Endpoint");
    getUserByIdHandler(mockRequest, mockResponse);

    // expect() is an assertion function
    // expect().toBe() is a matcher function
    expect(mockResponse.send).toHaveBeenCalled();
    // expect(mockResponse.send).not.toHaveBeenCalled();
    expect(mockResponse.send).toHaveBeenCalledWith(mockUsers[1]);
    expect(mockResponse.send).toHaveBeenCalledTimes(1);
  });

  it("Should Return 404 if User is Not Found", () => {
    console.log("Test for Get User By ID Endpoint");
    mockRequest.findUserIndex = -1;
    getUserByIdHandler(mockRequest, mockResponse);

    expect(mockResponse.sendStatus).toHaveBeenCalled();
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(404);
    expect(mockResponse.sendStatus).toHaveBeenCalledTimes(1);
    expect(mockResponse.send).not.toHaveBeenCalled();
  });
});

describe("Create Users", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockRequest = {};
  it("Should Return Status of 400 when there are Errors", async () => {
    await createUserHandler(mockRequest, mockResponse);
    expect(validator.validationResult).toHaveBeenCalled();
    expect(validator.validationResult).toHaveBeenCalledWith(mockRequest);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith([{ msg: "Invalid Field" }]);
  });

  it("Should Return Status of 201 and the User Created", async () => {
    //@ts-ignore
    jest.spyOn(validator, "validationResult").mockImplementationOnce(() => ({
      isEmpty: jest.fn(() => true),
    }));

    const saveMethod = jest
      .spyOn(User.prototype, "save")
      .mockResolvedValueOnce({
        id: 1,
        username: "test",
        password: "hashed_password",
        displayName: "test_name",
      });
    await createUserHandler(mockRequest, mockResponse);
    expect(validator.matchedData).toHaveBeenCalledWith(mockRequest);
    expect(helpers.hashPassword).toHaveBeenCalledWith("password");
    expect(helpers.hashPassword).toHaveReturnedWith("hashed_password");
    expect(User).toHaveBeenCalledWith({
      username: "test",
      password: "hashed_password",
      displayName: "test_name",
    });

    expect(saveMethod).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.send).toHaveBeenCalledWith({
      id: 1,
      username: "test",
      password: "hashed_password",
      displayName: "test_name",
    });
  });

  it("Send Status of 400 when Database fails to save User", async () => {
    //@ts-ignore
    jest.spyOn(validator, "validationResult").mockImplementationOnce(() => ({
      isEmpty: jest.fn(() => true),
    }));
    const saveMethod = jest
      .spyOn(User.prototype, "save")
      .mockImplementationOnce(() => Promise.reject("Failed to save user"));
    await createUserHandler(mockRequest, mockResponse);
    expect(saveMethod).toHaveBeenCalled();
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(400);
  });
});
