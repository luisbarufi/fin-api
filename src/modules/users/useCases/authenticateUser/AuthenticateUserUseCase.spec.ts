import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to authenticate a user with email and password", async () => {
    const user = {name: "User Name", email: "user@example.com", password : "1234"};
    
    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(result).toHaveProperty('token');
    expect(result).toHaveProperty('user');
    expect(result.user).toEqual(
      expect.objectContaining({
        name: user.name,
        email: user.email,
      }),
    );
  });
  it("should not be able to authenticate a user with email or password incorrect", async () => {
    const user = {name: "User Name", email: "user@example.com", password : "1234"};

    await createUserUseCase.execute(user);

    await expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: "4321",
      }),
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate a user that does not exist", async () => {
    const user = {name: "User Name", email: "user@example.com", password : "1234"};

    await expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: "4321",
      }),
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
