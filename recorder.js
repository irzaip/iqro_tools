let halaman;
let seq;
let score;
let mulai = false;
let mendengar = false;
let page_counter = 2;
let pic_counter = 0;
let directory = './iqro1_data/'
let page = [];
let on_air = true;
let audioCtx;
let count = 0;
let chunk = [];
let avg_ceil = Array(20).fill(0); //average ceiling
let mavg_ceil = 0;
let min_avg_ceil = 0;
const canvas = document.querySelector('.media');
const canvasCtx = canvas.getContext("2d");
const canvas2 = document.querySelector('.rms');
const canvas2Ctx = canvas2.getContext("2d");
const averageEl = document.getElementById('average');


function zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
  }

let CalculateRMS = (arr) => Math.sqrt(
    arr
        .map( val => (val * val))
        .reduce((acum, val) => acum + val)
    /arr.length
);

// for legacy browsers
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        window.stream = stream;
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
        visualize(stream);
        chuck = []

        mediaRecorder.addEventListener("dataavailable", e => {
            chuck.push(e.data);
            //console.log(".");
        })

        mediaRecorder.addEventListener("stop", e => {
            blob = new Blob(chunk)
            audio_url = URL.createObjectURL(blob)
            audio = new Audio(audio_url)
            audio.setAttribute("controls", 1)
            ok.appendChild(audio)
        })
    });


function startRead() {
    loadPage();
    mulai = true;
}

function togglerec() {
    if(on_air == true) {
        on_air = false;
    } else { 
        on_air = true;
        visualize(window.stream)
    }
}

function playrec() {
    audio.play();
}

function visualize(stream) {
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }

    const source = audioCtx.createMediaStreamSource(stream);

    const analyser = audioCtx.createAnalyser();
    const recbuffer = audioCtx.createMediaStreamDestination(stream);
    
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
   
    source.connect(analyser);
    //analyser.connect(audioCtx.destination);

    draw()

function draw() {

        const WIDTH = canvas.width
        const HEIGHT = canvas.height;

        if(on_air == true) {
            requestAnimationFrame(draw);
            analyser.getByteTimeDomainData(dataArray);
            //console.log(CalculateRMS(dataArray));
        }

        canvasCtx.fillStyle = 'rgb(200, 200, 200)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

        canvasCtx.beginPath();

        let sliceWidth = WIDTH * 1.0 / bufferLength;
        let x = 0;


        for (let i = 0; i < bufferLength; i++) {
            let v = dataArray[i] / 128.0;
            let y = v * HEIGHT / 2;

            if (i === 0) {
                canvasCtx.moveTo(x, y);
            } else {
                canvasCtx.lineTo(x, y);
            }
            x += sliceWidth;
        }
        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();

        let x2 = parseInt(CalculateRMS(dataArray) * 100);
        const average = list => list.reduce((prev, curr) => prev + curr) / list.length;
        avg_ceil.shift();
        avg_ceil.push(parseInt(x2));
        mavg_ceil = parseInt(average(avg_ceil));
        averageEl.innerHTML= "slow moving average : " + mavg_ceil;

        if (mulai === false) {
            min_avg_ceil = mavg_ceil + 3;
            console.log("min_avg:" + min_avg_ceil);
        }

        if (mulai === true) { 
            if ( mavg_ceil > min_avg_ceil) { 
                console.log("Mulai mendengar");
                mendengar = true; }
        }


        if (mendengar === true) {
            if (mavg_ceil < min_avg_ceil) {
                console.log("selesai mendengar");
                next();
                mendengar = false;
            }
        }
        canvas2Ctx.beginPath();
        canvas2Ctx.fillStyle = 'rgb(20, 20, 20)';
        canvas2Ctx.clearRect(0, 0, canvas2.width, canvas2.height);
        canvas2Ctx.fillRect(0, 0, x2/2, 20);
        canvas2Ctx.font = "20px Georgia";

        canvas2Ctx.fillText(x2,(x2+10)/2,40);
        canvas2Ctx.stroke();
    }
}

async function loadPage() {
    await fetch(directory + zeroPad(page_counter,4) + '_json.txt')
            .then(response => response.json())
            .then(json => page = json);
    console.log(" Loaded " + page.length + " records");
    pic_counter=0;
}

function next() {
    if (pic_counter < page.length) {
        const filename = directory + page[pic_counter]['file']; 
        console.log(filename);
        instruction(filename);
        loadPic(filename);
        pic_counter++;
    }
    else {
        pic_counter = 0;
        page_counter++;
        loadPage();
        next();
    }
}

function loadPic(filename) {
    const place = document.getElementById('baca')
    place.setAttribute('src',filename)
}

function instruction(instruct) {
    const inst = document.getElementById('instruksi');
    inst.innerHTML = instruct;
}

