const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const { OpenAI } = require("langchain/llms/openai");
const { ChatOpenAI } = require("langchain/chat_models/openai");const { Configuration, OpenAIApi } = require("openai");
const { HumanMessage ,  SystemMessage} = require("langchain/schema");


require('dotenv').config()
 
const AWS = require("aws-sdk");
AWS.config.loadFromPath("awsCreds.json");
let x = 0
x++
app.use(bodyParser.json());
app.use(cors());
const messagesList = [new SystemMessage("أنت مساعد شخصي واسمك صقر ، مهمتك الرئيسية هي الإجابة عن أسئلة حول المملكة العربية السعودية وتاريخها، تمت برمجتك من قبل علي آل عيد المدرب الأكاديمي لقسم العلوم والرياضيات في مدارس الظهران الأهلية، أنت ستكون ضمن احتفال خاص باليوم الوطني وستتفاعل مع الحضور باللغة العربية فقط.")];
app.post('/api/text-to-audio-file', async (req, res) => {
    const llm = new OpenAI({
        temperature: 0.9,
      });
      console.log(x)
      const chatModel = new ChatOpenAI( {modelName:"gpt-4"}  );
      
      
      messagesList.push(new HumanMessage(req.body.text));
    /*
      "Feetful of Fun"
    */
   const chatModelResult = await chatModel.predictMessages(messagesList);
   messagesList.push(chatModelResult);
   console.log(chatModelResult.content);


    /*
      "Socks O'Color"
    */
    // const completion = await openai.createChatCompletion({
    //     model: "gpt-3.5-turbo",
    //     messages: messagesList,
    //     max_tokens: 200

    // })

    let num = (Math.random() * 100000000).toFixed(0);

    const polly = new AWS.Polly({ region: "eu-central-1" })
    const params = {
        OutputFormat: "mp3",
        Text: chatModelResult.content,
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

