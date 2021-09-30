let CalculateRMS = (arr) => Math.sqrt(
    arr
        .map( val => (val * val))
        .reduce((acum, val) => acum + val)
    /arr.length
);

const canvas = document.querySelector('.visualizer');

let on_air = true;
let audioCtx;
let count = 0;
let chunk = [];
let avg_ceil = Array(20).fill(0); //average ceiling
const canvasCtx = canvas.getContext("2d");
const canvas2 = document.querySelector('.rms');
const canvas2Ctx = canvas2.getContext("2d");
const averageEl = document.getElementById('average');

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



function togglerec() {
    if(on_air == true) {
        on_air = false;
    } else { 
        alert("tog");
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
        averageEl.innerHTML= "slow moving average : " + parseInt(average(avg_ceil));
        
        canvas2Ctx.beginPath();
        canvas2Ctx.fillStyle = 'rgb(20, 20, 20)';
        canvas2Ctx.clearRect(0, 0, canvas2.width, canvas2.height);
        canvas2Ctx.fillRect(0, 0, x2/2, 20);
        canvas2Ctx.font = "20px Georgia";

        canvas2Ctx.fillText(x2,(x2+10)/2,40);
        canvas2Ctx.stroke();
        
    }

}

