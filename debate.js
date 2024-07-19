// WebRTC setup
const peerConnection = new RTCPeerConnection();
let localStream;
let remoteStream;
const userIcon = document.getElementById('user-icon');
const peerIcon = document.getElementById('peer-icon');
let isMuted = false;

// Get user media
navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(stream => {
        localStream = stream;
        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

        // Visual indicator for speaking
        setupAudioProcessing(localStream, userIcon);
    })
    .catch(error => console.error('Error accessing media devices.', error));

peerConnection.ontrack = event => {
    remoteStream = event.streams[0];
    setupAudioProcessing(remoteStream, peerIcon);
};

// Audio processing setup
function setupAudioProcessing(stream, iconElement) {
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    source.connect(analyser);

    function checkVolume() {
        analyser.getByteFrequencyData(dataArray);
        const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;
        if (volume > 50) {
            iconElement.style.borderColor = 'lightgreen';
        } else {
            iconElement.style.borderColor = 'transparent';
        }
        requestAnimationFrame(checkVolume);
    }

    checkVolume();
}

// Mute/Unmute functionality
const muteButton = document.getElementById('mute-button');
muteButton.addEventListener('click', () => {
    isMuted = !isMuted;
    localStream.getAudioTracks()[0].enabled = !isMuted;
    if (isMuted) {
        userIcon.style.backgroundColor = 'red';
        muteButton.textContent = 'Unmute';
    } else {
        userIcon.style.backgroundColor = 'hsl(195, 100%, 75%)'; // Light blue color when unmuted
        muteButton.textContent = 'Mute';
    }
});

// Signaling server setup (dummy for now, needs actual implementation)
peerConnection.onicecandidate = event => {
    if (event.candidate) {
        // Send the candidate to the remote peer
    }
};

function createOffer() {
    peerConnection.createOffer()
        .then(offer => peerConnection.setLocalDescription(offer))
        .then(() => {
            // Send the offer to the remote peer
        });
}

function createAnswer(offer) {
    peerConnection.setRemoteDescription(offer)
        .then(() => peerConnection.createAnswer())
        .then(answer => peerConnection.setLocalDescription(answer))
        .then(() => {
            // Send the answer to the remote peer
        });
}

function handleAnswer(answer) {
    peerConnection.setRemoteDescription(answer);
}

function handleCandidate(candidate) {
    peerConnection.addIceCandidate(candidate);
}

// Event listeners for buttons
document.getElementById('end-debate').addEventListener('click', () => {
    document.getElementById('confirmation-modal').style.display = 'block';
});

document.getElementById('stay-button').addEventListener('click', () => {
    document.getElementById('confirmation-modal').style.display = 'none';
});

document.getElementById('exit-button').addEventListener('click', () => {
    window.location.href = 'index.html';
});

// Sending messages (basic implementation)
document.getElementById('typing-box').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

document.getElementById('send-button').addEventListener('click', sendMessage);

function sendMessage() {
    const messageBox = document.getElementById('typing-box');
    const message = messageBox.value;
    if (message.trim() === '') return;
    // Display the message locally
    displayMessage('Me', message);
    // Send the message to the peer
    // peerConnection.send(message); // Use WebRTC DataChannel or other method
    messageBox.value = '';
}

function displayMessage(sender, message) {
    const messageContainer = document.getElementById('message-container');
    const messageElement = document.createElement('div');
    messageElement.textContent = `${sender}: ${message}`;
    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}
