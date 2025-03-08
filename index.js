const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const ALPHA_VANTAGE_API_KEY = "6399BGOERJ1AQIPV"; // Get this from Alpha Vantage

app.post("/webhook", async (req, res) => {
  const intent = req.body.queryResult.intent.displayName;

  if (intent === "Get Stock Price") {
    const parameters = req.body.queryResult.parameters;
    const stockSymbol = parameters["stock_symbol"].toUpperCase(); // Get stock symbol

    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
      );

      const stockData = response.data["Global Quote"];
      const price = stockData["05. price"];

      return res.json({
        fulfillmentMessages: [
          {
            text: {
              text: [`The current price of ${stockSymbol} is $${price}. 📈`],
            },
          },
        ],
      });
    } catch (error) {
      return res.json({
        fulfillmentMessages: [
          {
            text: {
              text: [
                "Sorry, I couldn't fetch stock data at the moment. Try again later!",
              ],
            },
          },
        ],
      });
    }
  }
});

// Start the server (for local testing)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
