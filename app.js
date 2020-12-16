const video = document.querySelector('video');
const iframe = document.querySelector('iframe');
const log = document.querySelector('.log');
const counter = document.querySelector('.counter');
let count = 0;
let previousExp;

Promise.all([
    log.innerText = "Loading models...",
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    log.innerText = "Models loaded successfully!",
]).then(startVideo);

function startVideo() {
    navigator.getUserMedia({ video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
    );
}

video.addEventListener('play', () => {

    setInterval(async () => {
        const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
        try {
            if (detections.expressions["happy"] >= 0.7) {
                if (!previousExp) {
                    count++;
                    counter.innerText = `You've smiled ${count} times`;
                }
                log.innerText = "Smiling face detected! 😍\nSuccess Probability: " + detections.expressions["happy"];   //0.7 +
                previousExp = true;
            }
            else {
                previousExp = false;
                log.innerText = "Face detected 🧐";
            }
        }
        catch {
            previousExp = false;
            log.innerText = "Can't identify your face 😕";
        }
    }, 1000);

});