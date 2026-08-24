import { MarketHttpRepository } from "../market-http.repository";
import { api } from "@/data/api/api.client";

jest.mock("@/data/api/api.client");

describe("MarketHttpRepository", () => {
  let repository: MarketHttpRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new MarketHttpRepository();
  });

  it("should fetch BTC price from API successfully", async () => {
    const mockData = {
      priceBrl: 255000.0,
      change24hPercentage: 3.5,
      timestamp: "2026-08-24T12:00:00.000Z",
    };

    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

    const result = await repository.getBtcPrice();

    expect(api.get).toHaveBeenCalledWith("/api/market/btc");
    expect(result).toEqual(mockData);
  });

  it("should return dynamic simulated market price when API fails", async () => {
    (api.get as jest.Mock).mockRejectedValueOnce(new Error("Offline"));

    const result = await repository.getBtcPrice();

    expect(result.priceBrl).toBeGreaterThanOrEqual(200000);
    expect(result.priceBrl).toBeLessThanOrEqual(300000);
    expect(result.timestamp).toBeDefined();
  });
});
