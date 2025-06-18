const axios = require("axios");

class SemcacheClient {
  /**
   * @param {string} baseURL - Base URL of the Semcache REST API
   */
  constructor(baseURL = "http://localhost:8080") {
    this.api = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * Write data to the cache
   * @param {string} key
   * @param {string} data
   * @returns {Promise<number>} HTTP status code
   */
  async put(key, data) {
    const response = await this.api.put("/semcache/v1/put", {
      key,
      data,
    });
    return response.status;
  }

  /**
   * Read data from the cache
   * @param {string} key
   * @returns {Promise<string | null>} Cached data (e.g., "Paris"), or null if not found
   */
  async get(key) {
    try {
      const response = await this.api.post("/semcache/v1/get", { key });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error;
    }
  }
}

module.exports = SemcacheClient;
