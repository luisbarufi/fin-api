import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create a User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "User Name",
      email: "user@example.com",
      password : "1234",
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a user with already existing email", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "User Name",
        email: "user@example.com",
        password : "1234",
      });

      await createUserUseCase.execute({
        name: "User Name2",
        email: "user@example.com",
        password : "1234",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
