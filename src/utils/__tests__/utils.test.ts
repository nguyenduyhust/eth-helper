import { EthUtils } from "../utils";

describe("Eth Utils", () => {
  describe("createAccount", () => {
    test("Success", async (done) => {
      const account = EthUtils.createAccount();
      expect(account.address).toBeDefined();
      expect(account.privateKey).toBeDefined();
      done();
    });
  });

  describe("isAddress", () => {
    test("Success", async (done) => {
      let bool = EthUtils.isAddress("");
      expect(bool).not.toBeTruthy();
      bool = EthUtils.isAddress("0x5ECDfC735415b01BD4EfC19d2Fbb4b7FcbAEf64B");
      expect(bool).toBeTruthy();
      done();
    });
  });
});
