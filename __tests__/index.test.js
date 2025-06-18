const axios = require("axios");
const SemcacheClient = require("../src");

const mockPost = jest.fn();
const mockPut = jest.fn();

// Mock axios.create() to return a mock client
axios.create = jest.fn(() => ({
  post: mockPost,
  put: mockPut,
}));

describe("SemcacheClient", () => {
  const client = new SemcacheClient("http://localhost:8080");

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("put()", () => {
    it("should send correct JSON payload to /semcache/v1/put and return status", async () => {
      mockPut.mockResolvedValueOnce({ status: 200 });

      const status = await client.put(
        "What is the capital of France?",
        "Paris",
      );

      expect(mockPut).toHaveBeenCalledWith("/semcache/v1/put", {
        key: "What is the capital of France?",
        data: "Paris",
      });

      expect(status).toBe(200);
    });
  });

  describe("get()", () => {
    it("should send correct key to /semcache/v1/get and return cached value", async () => {
      mockPost.mockResolvedValueOnce({ status: 200, data: "Paris" });

      const result = await client.get("What is the capital of France?");

      expect(mockPost).toHaveBeenCalledWith("/semcache/v1/get", {
        key: "What is the capital of France?",
      });

      expect(result).toBe("Paris");
    });

    it("should return null if key is not found (404)", async () => {
      mockPost.mockRejectedValueOnce({
        response: { status: 404 },
      });

      const result = await client.get("nonexistent-key");

      expect(result).toBeNull();
    });

    it("should throw error for unexpected server issues (500)", async () => {
      const error = {
        response: { status: 500, data: "Internal Server Error" },
      };
      mockPost.mockRejectedValueOnce(error);

      await expect(client.get("cause-error")).rejects.toEqual(error);
    });
  });

  describe("constructor", () => {
    it("should override the baseURL with the provided value", () => {
      const customBaseURL = "http://example.com/api";

      // Spy on axios.create
      const createSpy = jest.fn(() => ({ put: mockPut, post: mockPost }));
      axios.create = createSpy;

      const client = new SemcacheClient(customBaseURL);

      expect(createSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: customBaseURL,
        }),
      );
    });
  });
});
