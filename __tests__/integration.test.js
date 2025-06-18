const SemcacheClient = require("../src");

describe("SemcacheClient (integration test)", () => {
  const client = new SemcacheClient("http://localhost:8080");

  const key = "What is the capital of France?";
  const value = "Paris";

  it("should PUT a key-value pair to the cache", async () => {
    const status = await client.put(key, value);
    expect(status).toBe(200); // Assumes success = 200
  });

  it("should GET the value back from the cache", async () => {
    const result = await client.get(key);
    expect(result).toBe(value); // Expect 'Paris'
  });

  it("should return null for a missing key", async () => {
    const missing = await client.get("nonexistent-key-xyz");
    expect(missing).toBeNull();
  });
});
