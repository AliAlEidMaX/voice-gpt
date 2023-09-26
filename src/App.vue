<script setup>
// https://www.studytonight.com/post/javascript-speech-recognition-example-speech-to-text

import { ref } from 'vue'
import { useAVLine } from 'vue-audio-visual'
import axios from 'axios'
const player = ref(null)
const canvas = ref(null)
let mySource = ref(null)
let action = ref('')
let lastMessage = ref('')
let output = ref([{role:"system", content:"Your name is Fahad.The assistant is dedicated to answer only questions related to Saudi Arabia and its history. the answers will be objective and will only provide facts without any opinions. Refuse any other questions by replying with a message that says: I will only answer questions related to Saudi Arabia."},{role:"system",content:"You prgrammed by Ali AlEid an academic coach at Dhahran Ahliyya Schools."}])

useAVLine(player, canvas, { src: mySource, canvHeight: 300, canvWidth: 1000, lineColor: '#ff3600',lineWidth:4 })

const runSpeechRecognition = () => {
  var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
recognition.lang = "ar";
  recognition.onstart = () => { action.value = "listening, please ask your question..." };

  recognition.onspeechend = () => {
    action.value = "stopped listening...";
    recognition.stop();
  }

  recognition.onresult = async (event) => {
    var transcript = event.results[0][0].transcript;
    lastMessage.value = transcript;
    output.value.push({ role: "user", content: transcript })

    try {
      let res = await axios.post('http://localhost:4001/api/text-to-audio-file', {
        text: output.value
      })

      if (res.data) {
        mySource.value = '/voice/' + res.data.num + '.mp3'
        output.value = res.data.messages;
        setTimeout(() => { player.value.play() }, 500)
      }
    } catch (err) {
      console.log(err)
    }
  };
  recognition.start();
}

</script>

<template dir="rtl">
  <div class="l-section">

    <img  src="https://das.sch.sa/templates/rt_supra/custom/images/tops/logo.png"/>
    <img  src="src/assets/logoND.png"/>
  </div>
  <div class="btn-section">
    <button class="bg-[#ff3600] px-6 py-2 rounded-md text-xl text-slate-50 font-bold" type="button" @click="runSpeechRecognition()">اسألني عن المملكة العربية السعودية</button>
  </div>
  <div class="display-section">
      <div class="action" v-if="action">{{ action }}</div>
      <div dir="rtl" class="output " v-if="output"><b class="text-xl text-slate-50 font-bold" >السؤال</b> : {{ lastMessage }}</div>
  </div>

  <div class="c">
    <audio id="player" ref="player" :src="mySource" type="audio/mpeg" controls hidden></audio>
    <canvas ref="canvas" />
  </div>
</template>

<style>
body {
  background-color: #00726c;
}

canvas {
  padding: 0;
  margin: auto;
  display: block;
  width: 800px;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.c{
  padding-top: 90%;}
.btn-section {
  display: flex;
  justify-content: center;

  margin-bottom: 30px;
}
.l-section {
  display: flex;
  height: 120px;
  justify-content: space-between;
  margin-top: 30px;
  padding-left: 10%;
  padding-right: 10%;
}
.bb {
  padding: 8px 13px;
  border-radius: 5px;
  background-color: #ff3600;
  color: white;
  font-weight: 700;
  font-size: 18px;
  border: none;
  cursor: pointer;
}

.display-section {
  width: 100%;
  text-align: center;

  color: white;
}

.action {
  margin-top: 10px;
  margin-bottom: 10px;
}

.output {
  max-width: 500px;
  padding: 20px;
  border-radius: 10px;
  border: 3px dotted #ff3600;
  display: inline-block;
}
</style>
