import { EthUtils } from "../eth-utils";

describe("Eth Utils", () => {
  describe("createAccount", () => {
    test("Success", async (done) => {
      const account = EthUtils.createAccount();
      expect(account.address).toBeDefined();
      expect(account.privateKey).toBeDefined();
      done();
    });
  });
});
