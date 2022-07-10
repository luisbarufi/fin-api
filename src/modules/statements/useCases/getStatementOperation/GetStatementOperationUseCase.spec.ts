import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUsersRepository: IUsersRepository;
let inMemoryStatementsRepository: IStatementsRepository;

let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operation", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();

    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository,
    );

    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository,
    );
  });

  it("should be able to get the user statement operation using user_id and statement_id", async () => {
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

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: statement.id,
    });

    expect(statementOperation).toHaveProperty("id");
    expect(statementOperation.id).toEqual(statement.id);
    expect(statementOperation).toEqual(statement);
  });

  it("should not be able to get the user statement operation if the user does not exist", async () => {
    await expect(
      getStatementOperationUseCase.execute({
        user_id: "false_user_id",
        statement_id: "false_statement_id",
      }),
    ).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able to get the user statement operation if the statement does not exist", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "User Name",
      email: "user@example.com",
      password : "1234",
    });

    await expect(
      getStatementOperationUseCase.execute({
        user_id: user.id,
        statement_id: "false_statement_id",
      }),
    ).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
