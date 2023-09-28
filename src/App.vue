<script setup>
// https://www.studytonight.com/post/javascript-speech-recognition-example-speech-to-text

import { onMounted, ref } from 'vue'
import { useAVLine } from 'vue-audio-visual'
import axios from 'axios'
const player = ref(null)
const canvas = ref(null)
let mySource = ref(null)
let action = ref('')
let lastMessage = ref('')

useAVLine(player, canvas, { src: mySource, canvHeight: 300, canvWidth: 1000, lineColor: '#ff3600',lineWidth:4 })
const t = () => {
  mySource.value='/voice/' + 0 + '.mp3';
  setTimeout(() => { player.value.play() }, 500)  
  console.log('t')
}
const das = () => {
  mySource.value='/voice/' + 1 + '.mp3';
  setTimeout(() => { player.value.play() }, 500)
    console.log('das')
}
const runSpeechRecognition = () => {
  player.value.pause()
  var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
  

recognition.lang = "ar";
  recognition.onstart = () => { action.value = "أنا أستمع إلى سؤالك" };

  recognition.onspeechend = () => {
    action.value = "جاري تجهيز الإجابة";
    recognition.stop();
  }

  recognition.onresult = async (event) => {
    var transcript = event.results[0][0].transcript;
    lastMessage.value = transcript;
   

    try {
      let res = await axios.post('https://nd93ai.vercel.app//api/text-to-audio-file', {
        text: lastMessage.value
      })

      if (res.data) {
        mySource.value = '/voice/' + res.data.num + '.mp3'
   
        setTimeout(() => { player.value.play() }, 500)
        action.value = ""
      }
    } catch (err) {
      console.log(err)
    }
  };
  recognition.start();
}

</script>

<template >
  <div  dir="rtl" class="h-screen w-screen bg-[#00726c] flex  flex-col max-h-screen">

    <div class="flex justify-between w-full h-56 px-12 py-10">
      
      <img @click="t" class="h-full" src="@/assets/logoND.png"/>   <img @click="das" class="h-full" src="https://das.sch.sa/templates/rt_supra/custom/images/tops/logo.png"/>
      <img @click="das" class="h-full" src="https://das.sch.sa/templates/rt_supra/custom/images/tops/logo.png"/>
    </div>
    <div class="flex justify-center">
      <button class="bg-[#ff3600] px-6 py-2 rounded-md text-xl text-slate-50 font-bold" type="button" @click="runSpeechRecognition()">اسألني عن المملكة العربية السعودية</button>
    </div>
    <div class="flex flex-col items-center justify-center mt-8 space-y-8 text-xl font-bold text-center text-slate-50">
      <div     :class="action == 'جاري تجهيز الإجابة' ? 'animate-pulse ' : 'light-theme'"
 >{{ action }}</div>
      <div   class="text-center " ><b class="" >السؤال</b> : {{ lastMessage }}</div>
    </div>
    
    <div dir="ltr" class="relative flex-1 w-full">
      <audio id="player" ref="player" :src="mySource" type="audio/mpeg" controls hidden></audio>
      <canvas class="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" ref="canvas" />
    </div>
  </div>
  </template>

<style>
/* body {
  background-color: #00726c;
} */

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
/* .c{
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
} */
</style>
