const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const { OpenAI } = require("langchain/llms/openai");
const { ChatOpenAI } = require("langchain/chat_models/openai");const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({ apiKey: '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' });
const openai = new OpenAIApi(configuration);

const llm = new OpenAI({
    openAIApiKey: "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",
    temperature: 0.9,
  });
  
//   const chatModel = new ChatOpenAI( configuration, {    apiKey: "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",    temperature: 0.9,  }  );
  
  const text = "What would be a good company name for a company that makes colorful socks?";
  
 
const AWS = require("aws-sdk");
AWS.config.loadFromPath("awsCreds.json");

app.use(bodyParser.json());
app.use(cors());

app.post('/api/text-to-audio-file', async (req, res) => {
    const llmResult = await llm.predict(text);
    /*
      "Feetful of Fun"
    */
    console.log(llmResult);
    // const chatModelResult = await chatModel.predict(text);
    //   console.log(chatModelResult);
    /*
      "Socks O'Color"
    */
    let messagesList = req.body.text;
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messagesList,
        max_tokens: 200

    })

    let num = (Math.random() * 100000000).toFixed(0);
    messagesList.push(completion.data.choices[0].message)
    const polly = new AWS.Polly({ region: "eu-central-1" })
    const params = {
        OutputFormat: "mp3",
        Text: completion.data.choices[0].message.content,
        VoiceId: "Zayd",
        Engine: "neural"
    }

    polly.synthesizeSpeech(params, (err, data) => {
        if (err) {
            console.error(err);
            return;
        }

        let filePath = "../public/voice/";
        let fileName = num + ".mp3";

        if (num) fs.writeFileSync(filePath + fileName, data.AudioStream)
    })
    let r = { num: num, messages: messagesList }
    setTimeout(() => { res.status(200).json(r) }, 4500)
})

app.listen(4001, () => {
    console.log(`Server is ready at http://localhost:4001`);

});