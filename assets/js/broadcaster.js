let isSharing = false;
let peerConnection;
const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener('open', () => {
    socket.send(JSON.stringify({ type: 'broadcaster' }));
});

socket.addEventListener('message', async (event) => {
    const message = JSON.parse(event.data);

    if (message.type === 'viewerConnected') {
        await startBroadcast();
    }
    else if (message.type === 'answer') {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(message));
    }
    else if (message.candidate) {
        try {
            await peerConnection.addIceCandidate(new RTCIceCandidate(message.candidate));
        } catch (e) {
            console.error('Error adding ICE candidate:', e);
        }
    }
    else if (message.type === 'viewerDisconnected') {
        resetConnection();
    }
});

async function startBroadcast() {
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: { cursor: "always" },
            audio: true
        });

        document.getElementById('localVideo').srcObject = stream;

        const configuration = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
            ]
        };

        peerConnection = new RTCPeerConnection(configuration);
        peerConnection.onicecandidate = ({ candidate }) => {
            if (candidate) {
                socket.send(JSON.stringify({
                    type: 'candidate',
                    candidate: candidate.toJSON()
                }));
            }
        };

        stream.getTracks().forEach(track => {
            peerConnection.addTrack(track, stream);
        });

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        socket.send(JSON.stringify({
            type: 'offer',
            sdp: offer.sdp
        }));

    } catch (error) {
        console.error('Screen sharing failed:', error);
        alert(`Screen sharing error: ${error.message}`);
    }
}
function stopBroadcast() {
    resetConnection();
    isSharing = false;
    document.getElementById('status').textContent = 'Not sharing';
    document.getElementById('mainBody').textContent = 'Click to Share your PC, macOS or Linux Screen';
};

function resetConnection() {
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
    const video = document.getElementById('localVideo');
    if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
        video.srcObject = null;
    }
}

document.getElementById('mainBody').addEventListener('click', () => {
    if (!isSharing) {
        startBroadcast();
    } else {
        stopBroadcast();
    }
});

window.addEventListener('beforeunload', resetConnection);