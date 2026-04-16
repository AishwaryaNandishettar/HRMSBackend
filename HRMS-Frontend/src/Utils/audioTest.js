/**
 * Simple Audio Test Utility
 * Quick tests for audio functionality
 */

export class AudioTest {
  
  /**
   * Test microphone access and playback
   */
  static async testMicrophoneEcho() {
    try {
      console.log('🎤 Starting microphone echo test...');
      
      // Get microphone stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('✅ Microphone access granted');
      
      // Create audio context for echo
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const destination = audioContext.createMediaStreamDestination();
      
      // Connect source to destination (echo)
      source.connect(destination);
      
      // Create audio element to play the echo
      const audio = document.createElement('audio');
      audio.srcObject = destination.stream;
      audio.autoplay = true;
      audio.volume = 0.5; // Reduce volume to prevent feedback
      
      console.log('🔊 Echo test started - you should hear your voice');
      
      // Stop test after 5 seconds
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop());
        audioContext.close();
        audio.remove();
        console.log('⏹ Echo test stopped');
      }, 5000);
      
      return {
        success: true,
        message: 'Echo test started - listen for your voice for 5 seconds'
      };
      
    } catch (error) {
      console.error('❌ Echo test failed:', error);
      return {
        success: false,
        error: error.name,
        message: error.message
      };
    }
  }
  
  /**
   * Test audio playback with a tone
   */
  static async testAudioPlayback() {
    try {
      console.log('🔊 Testing audio playback...');
      
      // Create audio context
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create oscillator for test tone
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // Configure tone (440Hz A note)
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
      oscillator.type = 'sine';
      
      // Set volume
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      
      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Play tone for 1 second
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 1);
      
      console.log('✅ Test tone played');
      
      return {
        success: true,
        message: 'Test tone played - you should hear a beep'
      };
      
    } catch (error) {
      console.error('❌ Audio playback test failed:', error);
      return {
        success: false,
        error: error.name,
        message: error.message
      };
    }
  }
  
  /**
   * Test WebRTC audio loopback
   */
  static async testWebRTCAudioLoopback() {
    try {
      console.log('🔄 Testing WebRTC audio loopback...');
      
      // Create two peer connections for loopback test
      const pc1 = new RTCPeerConnection();
      const pc2 = new RTCPeerConnection();
      
      let audioReceived = false;
      
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Add stream to first peer connection
      stream.getTracks().forEach(track => {
        pc1.addTrack(track, stream);
      });
      
      // Handle remote stream on second peer connection
      pc2.ontrack = (event) => {
        console.log('📺 Remote stream received in loopback test');
        audioReceived = true;
        
        // Create audio element to play received audio
        const audio = document.createElement('audio');
        audio.srcObject = event.streams[0];
        audio.autoplay = true;
        audio.volume = 0.3; // Low volume to prevent feedback
        
        // Clean up after 3 seconds
        setTimeout(() => {
          audio.remove();
          stream.getTracks().forEach(track => track.stop());
          pc1.close();
          pc2.close();
        }, 3000);
      };
      
      // Set up ICE candidate exchange
      pc1.onicecandidate = (event) => {
        if (event.candidate) {
          pc2.addIceCandidate(event.candidate);
        }
      };
      
      pc2.onicecandidate = (event) => {
        if (event.candidate) {
          pc1.addIceCandidate(event.candidate);
        }
      };
      
      // Create offer and answer
      const offer = await pc1.createOffer();
      await pc1.setLocalDescription(offer);
      await pc2.setRemoteDescription(offer);
      
      const answer = await pc2.createAnswer();
      await pc2.setLocalDescription(answer);
      await pc1.setRemoteDescription(answer);
      
      // Check if audio was received after 2 seconds
      setTimeout(() => {
        if (audioReceived) {
          console.log('✅ WebRTC audio loopback successful');
        } else {
          console.log('⚠️ WebRTC audio loopback - no audio received');
        }
      }, 2000);
      
      return {
        success: true,
        message: 'WebRTC loopback test started - check console for results'
      };
      
    } catch (error) {
      console.error('❌ WebRTC loopback test failed:', error);
      return {
        success: false,
        error: error.name,
        message: error.message
      };
    }
  }
  
  /**
   * Run all audio tests
   */
  static async runAllTests() {
    console.log('🧪 Running all audio tests...');
    
    const results = {
      timestamp: new Date().toISOString(),
      tests: {}
    };
    
    // Test 1: Audio playback
    console.log('\n--- Test 1: Audio Playback ---');
    results.tests.playback = await this.testAudioPlayback();
    
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 2: Microphone echo
    console.log('\n--- Test 2: Microphone Echo ---');
    results.tests.microphoneEcho = await this.testMicrophoneEcho();
    
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 6000));
    
    // Test 3: WebRTC loopback
    console.log('\n--- Test 3: WebRTC Loopback ---');
    results.tests.webrtcLoopback = await this.testWebRTCAudioLoopback();
    
    console.log('\n🏁 All audio tests completed:', results);
    return results;
  }
}

// Add to window for easy access in console
if (typeof window !== 'undefined') {
  window.AudioTest = AudioTest;
}

export default AudioTest;