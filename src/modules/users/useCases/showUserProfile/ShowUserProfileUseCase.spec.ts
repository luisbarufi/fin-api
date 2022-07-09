import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: IUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it("should be able to show user proifle by user_id", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "User Name",
      email: "user@example.com",
      password : "1234"}
    );
    
    const result = await showUserProfileUseCase.execute(user.id)

    expect(result).toEqual(user);
  });

  it("should not be able to show user profile by user_id if user does not exist", async () => {
    await expect(
      showUserProfileUseCase.execute('non-existent-id'),
    ).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
