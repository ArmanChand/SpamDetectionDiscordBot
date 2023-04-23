const MindsDBCloud = require("mindsdb-js-sdk").default;

const spamModel = process.env.MINDSDB_SPAM_DETECTION_MODEL_NAME;

async function connectToMindsDBCloud() {
  try {
    await MindsDBCloud.connect({
      user: process.env.MINDSDB_USER,
      password: process.env.MINDSDB_PASS,
    });
    console.log("Suceesfully connected to MindsDB Cloud");
  } catch (error) {
    console.log("Problem connecting to MindsDB Cloud:", error);
    throw error;
  }
}

  // Endpoint for spam detection

    async function analyzeSpamDetection(message) {
    let retries = 3; // Maximum number of retries
    while (retries > 0) {
      try {
        const text = `SELECT * FROM ${spamModel} WHERE text="${message}" `;
        console.log("test---->",text)
        const spamResponse = await MindsDBCloud.SQL.runQuery(text);
        console.log("response--->",spamResponse)
        if (!spamResponse.rows) {
          throw new Error("Invalid response from MindsDB");
        }
          return spamResponse;
        
      } catch (error) {
        console.log("Error detecting spam:", error);
        retries--;
        if (retries === 0) {
            throw new Error("Maximum number of retries reached");
        }
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
      }
    }
  }

  
  module.exports = { connectToMindsDBCloud,analyzeSpamDetection};
  