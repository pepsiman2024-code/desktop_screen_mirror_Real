let peerConnection;
const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener('open', () => {
    socket.send(JSON.stringify({ type: 'viewer' }));
});

socket.addEventListener('message', async (event) => {
    const message = JSON.parse(event.data);

    if (message.type === 'offer') {
        await setupPeerConnection(message);
    }
    else if (message.type === 'candidate') {
        if (peerConnection) {
            try {
                await peerConnection.addIceCandidate(new RTCIceCandidate(message.candidate));
            } catch (e) {
                console.error('Error adding ICE candidate:', e);
            }
        }
    }
    else if (message.type === 'broadcasterDisconnected') {
        resetConnection();
    }
});

async function setupPeerConnection(offer) {
    try {
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

        peerConnection.ontrack = (event) => {
            document.getElementById('remoteVideo').srcObject = event.streams[0];
        };

        await peerConnection.setRemoteDescription(new RTCSessionDescription({
            type: 'offer',
            sdp: offer.sdp
        }));

        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        socket.send(JSON.stringify({
            type: 'answer',
            sdp: answer.sdp
        }));

    } catch (error) {
        console.error('Connection setup failed:', error);
        alert(`Connection error: ${error.message}`);
    }
}

function resetConnection() {
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
    const video = document.getElementById('remoteVideo');
    if (video.srcObject) {
        video.srcObject = null;
    }
    alert('Broadcaster disconnected');
}

window.addEventListener('beforeunload', resetConnection);