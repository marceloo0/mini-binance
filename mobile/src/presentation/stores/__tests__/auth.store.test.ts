import { useAuthStore } from "../auth.store";
import { authHttpRepository } from "@/data/auth/auth-http.repository";
import { storage } from "@/data/storage/storage.service";

jest.mock("@/data/auth/auth-http.repository");
jest.mock("@/data/storage/storage.service");

describe("AuthStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      session: null,
      user: null,
      hydrated: false,
    });
  });

  it("should initialize with default empty state", () => {
    const state = useAuthStore.getState();
    expect(state.session).toBeNull();
    expect(state.user).toBeNull();
    expect(state.hydrated).toBe(false);
  });

  it("should sign in successfully and update state and storage", async () => {
    const mockSession = { accessToken: "tok-123", refreshToken: "ref-123", userId: 1 };
    const mockUser = { id: "1", name: "Trader", email: "trader@example.com" };

    (authHttpRepository.login as jest.Mock).mockResolvedValueOnce(mockSession);
    (authHttpRepository.me as jest.Mock).mockResolvedValueOnce(mockUser);

    await useAuthStore.getState().signIn({ email: "trader@example.com", password: "password123" });

    expect(authHttpRepository.login).toHaveBeenCalledWith({ email: "trader@example.com", password: "password123" });
    expect(storage.setSession).toHaveBeenCalledWith(mockSession);
    expect(authHttpRepository.me).toHaveBeenCalledWith("tok-123");

    const state = useAuthStore.getState();
    expect(state.session).toEqual(mockSession);
    expect(state.user).toEqual(mockUser);
  });

  it("should sign up successfully and set session & user", async () => {
    const mockSession = { accessToken: "tok-456", refreshToken: "ref-456", userId: 2 };

    (authHttpRepository.register as jest.Mock).mockResolvedValueOnce(mockSession);

    await useAuthStore.getState().signUp("new@example.com", "password123");

    expect(authHttpRepository.register).toHaveBeenCalledWith({ email: "new@example.com", password: "password123" });
    expect(storage.setSession).toHaveBeenCalledWith(mockSession);

    const state = useAuthStore.getState();
    expect(state.session).toEqual(mockSession);
    expect(state.user).toEqual({ id: 2, email: "new@example.com" });
  });

  it("should sign out and clear session and state", async () => {
    useAuthStore.setState({
      session: { accessToken: "tok-123", refreshToken: "ref-123", userId: 1 },
      user: { id: "1", email: "trader@example.com" },
      hydrated: true,
    });

    await useAuthStore.getState().signOut();

    expect(storage.clearSession).toHaveBeenCalled();

    const state = useAuthStore.getState();
    expect(state.session).toBeNull();
    expect(state.user).toBeNull();
  });

  it("should hydrate session from storage when available", async () => {
    const mockSession = { accessToken: "tok-789", refreshToken: "ref-789", userId: 3 };
    const mockUser = { id: "3", email: "hydrated@example.com" };

    (storage.getSession as jest.Mock).mockResolvedValueOnce(mockSession);
    (authHttpRepository.me as jest.Mock).mockResolvedValueOnce(mockUser);

    await useAuthStore.getState().hydrate();

    const state = useAuthStore.getState();
    expect(state.hydrated).toBe(true);
    expect(state.session).toEqual(mockSession);
    expect(state.user).toEqual(mockUser);
  });

  it("should clear session during hydrate if profile fetch fails", async () => {
    const mockSession = { accessToken: "invalid-token", refreshToken: "ref", userId: 4 };

    (storage.getSession as jest.Mock).mockResolvedValueOnce(mockSession);
    (authHttpRepository.me as jest.Mock).mockRejectedValueOnce(new Error("Unauthorized"));

    await useAuthStore.getState().hydrate();

    expect(storage.clearSession).toHaveBeenCalled();

    const state = useAuthStore.getState();
    expect(state.hydrated).toBe(true);
    expect(state.session).toBeNull();
    expect(state.user).toBeNull();
  });
});
