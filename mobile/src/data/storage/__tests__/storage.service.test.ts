import { storage } from "../storage.service";

describe("StorageService Facade", () => {
  const mockSession = {
    accessToken: "access-token-123",
    refreshToken: "refresh-token-123",
    userId: 1,
  };

  beforeEach(async () => {
    await storage.clearSession();
  });

  it("should return null session initially when empty", async () => {
    const session = await storage.getSession();
    expect(session).toBeNull();
  });

  it("should set and retrieve session from storage", async () => {
    await storage.setSession(mockSession);
    const session = await storage.getSession();
    expect(session).toEqual(mockSession);
  });

  it("should clear session from storage", async () => {
    await storage.setSession(mockSession);
    await storage.clearSession();
    const session = await storage.getSession();
    expect(session).toBeNull();
  });
});
