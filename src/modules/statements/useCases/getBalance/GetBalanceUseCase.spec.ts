import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryUsersRepository: IUsersRepository;
let inMemoryStatementsRepository: IStatementsRepository;

let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();

    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository,
    );

    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository,
    );
  });

  it("should be able to get the user balance", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "User Name",
      email: "user@example.com",
      password : "1234",
    });

    const accountStatementsPromise = [
      createStatementUseCase.execute({
        user_id: user.id,
        type: OperationType.DEPOSIT,
        amount: 1000,
        description: "false description 1",
      }),
      createStatementUseCase.execute({
        user_id: user.id,
        type: OperationType.WITHDRAW,
        amount: 100,
        description: "false description 2",
      }),
      createStatementUseCase.execute({
        user_id: user.id,
        type: OperationType.DEPOSIT,
        amount: 500,
        description: "false description 3",
      }),
    ];

    await Promise.all(accountStatementsPromise);
    
    const reuslt = await getBalanceUseCase.execute({ user_id: user.id });
    
    expect(reuslt).toHaveProperty("balance");
    expect(reuslt.balance).toBe(1400);

    expect(reuslt).toHaveProperty("statement");
    expect(reuslt.statement).toBeInstanceOf(Array);
    expect(reuslt.statement).toHaveLength(3);
  });

  it("should not be able to get the user balance if the user does not exists", async () => {
    await expect(
      getBalanceUseCase.execute({ user_id: "false_id" }),
    ).rejects.toBeInstanceOf(GetBalanceError);
  });
});
