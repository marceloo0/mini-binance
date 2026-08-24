import { api, setUnauthorizedHandler } from "../api.client";
import { storage } from "@/data/storage/storage.service";

jest.mock("@/data/storage/storage.service");

describe("ApiClient", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should have correct baseURL and timeout configuration", () => {
    expect(api.defaults.timeout).toBe(15000);
    expect(api.defaults.baseURL).toBeDefined();
  });

  it("should attach Authorization header when session token exists", async () => {
    const mockStorageGetSession = storage.getSession as jest.Mock;
    mockStorageGetSession.mockResolvedValueOnce({
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
      userId: 1,
    });

    const requestInterceptor = api.interceptors.request as any;
    const config = { headers: {} } as any;
    
    // Ejecuta o interceptor de requisição
    const updatedConfig = await requestInterceptor.handlers[0].fulfilled(config);

    expect(updatedConfig.headers.Authorization).toBe("Bearer mock-access-token");
  });

  it("should not attach Authorization header when no session exists", async () => {
    const mockStorageGetSession = storage.getSession as jest.Mock;
    mockStorageGetSession.mockResolvedValueOnce(null);

    const requestInterceptor = api.interceptors.request as any;
    const config = { headers: {} } as any;

    const updatedConfig = await requestInterceptor.handlers[0].fulfilled(config);

    expect(updatedConfig.headers.Authorization).toBeUndefined();
  });

  it("should support registering an unauthorized handler callback", () => {
    const mockHandler = jest.fn();
    setUnauthorizedHandler(mockHandler);
    // Verificação de registro sem lançar exceções
    expect(mockHandler).not.toHaveBeenCalled();
  });
});
