import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let inMemoryUsersRepository: IUsersRepository;
let inMemoryStatementsRepository: IStatementsRepository;

let createStatementUseCase: CreateStatementUseCase;


describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();

    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository,
    );
  });

  it("should be able to create a new statement (type: DEPOSIT)", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "User Name",
      email: "user@example.com",
      password : "1234",
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "false description",
    });

    expect(statement).toHaveProperty("id");
  });

  it("should not be able to create a new statement for a user that does not exist", async () => {
    await expect(
      createStatementUseCase.execute({
        user_id: "false_user_id",
        type: OperationType.DEPOSIT,
        amount: 1000,
        description: "false description",
      }),
    ).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able to create a new statement (type: WITHDRAW ) when do not have balance enough", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "User Name",
      email: "user@example.com",
      password : "1234",
    });

    await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 500,
      description: "false description",
    });

    expect(
      createStatementUseCase.execute({
        user_id: user.id,
        type: OperationType.WITHDRAW,
        amount: 1000,
        description: "false description",
      }),
    ).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });

  it("should be able to create a new statement (type: WITHDRAW) when there is enough balance", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "User Name",
      email: "user@example.com",
      password : "1234",
    });

    await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "false description",
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.WITHDRAW,
      amount: 100,
      description: "false description",
    });

    expect(statement).toHaveProperty("id");
  });
});
