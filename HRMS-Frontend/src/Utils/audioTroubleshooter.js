/**
 * Audio Troubleshooting Utility
 * Helps diagnose and fix audio issues in WebRTC calls
 */

export class AudioTroubleshooter {
  
  /**
   * Comprehensive audio system check
   */
  static async runFullAudioCheck() {
    const results = {
      timestamp: new Date().toISOString(),
      browser: this.getBrowserInfo(),
      permissions: null,
      devices: null,
      mediaAccess: null,
      webrtcSupport: null,
      autoplayPolicy: null
    };

    try {
      // Check permissions
      results.permissions = await this.checkAudioPermissions();
      
      // Check available devices
      results.devices = await this.checkAudioDevices();
      
      // Test media access
      results.mediaAccess = await this.testMediaAccess();
      
      // Check WebRTC support
      results.webrtcSupport = this.checkWebRTCSupport();
      
      // Check autoplay policy
      results.autoplayPolicy = await this.checkAutoplayPolicy();
      
    } catch (error) {
      console.error('Error during audio check:', error);
      results.error = error.message;
    }

    return results;
  }

  /**
   * Check audio permissions
   */
  static async checkAudioPermissions() {
    if (!navigator.permissions) {
      return { supported: false, message: 'Permissions API not supported' };
    }

    try {
      const permission = await navigator.permissions.query({ name: 'microphone' });
      return {
        supported: true,
        state: permission.state,
        message: `Microphone permission: ${permission.state}`
      };
    } catch (error) {
      return {
        supported: false,
        error: error.message
      };
    }
  }

  /**
   * Check available audio devices
   */
  static async checkAudioDevices() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      return { supported: false, message: 'Device enumeration not supported' };
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices.filter(device => device.kind === 'audioinput');
      const audioOutputs = devices.filter(device => device.kind === 'audiooutput');

      return {
        supported: true,
        inputs: audioInputs.length,
        outputs: audioOutputs.length,
        inputDevices: audioInputs.map(device => ({
          deviceId: device.deviceId,
          label: device.label || 'Unknown device',
          groupId: device.groupId
        })),
        outputDevices: audioOutputs.map(device => ({
          deviceId: device.deviceId,
          label: device.label || 'Unknown device',
          groupId: device.groupId
        }))
      };
    } catch (error) {
      return {
        supported: false,
        error: error.message
      };
    }
  }

  /**
   * Test media access
   */
  static async testMediaAccess() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return { supported: false, message: 'getUserMedia not supported' };
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioTracks = stream.getAudioTracks();
      
      const result = {
        supported: true,
        success: true,
        tracksCount: audioTracks.length,
        tracks: audioTracks.map(track => ({
          id: track.id,
          kind: track.kind,
          label: track.label,
          enabled: track.enabled,
          readyState: track.readyState,
          muted: track.muted
        }))
      };

      // Clean up
      stream.getTracks().forEach(track => track.stop());
      
      return result;
    } catch (error) {
      return {
        supported: true,
        success: false,
        error: error.name,
        message: error.message
      };
    }
  }

  /**
   * Check WebRTC support
   */
  static checkWebRTCSupport() {
    const support = {
      RTCPeerConnection: !!window.RTCPeerConnection,
      getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      RTCSessionDescription: !!window.RTCSessionDescription,
      RTCIceCandidate: !!window.RTCIceCandidate
    };

    return {
      supported: Object.values(support).every(Boolean),
      details: support
    };
  }

  /**
   * Check autoplay policy
   */
  static async checkAutoplayPolicy() {
    try {
      // Create a test audio element
      const audio = document.createElement('audio');
      audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eeyw';
      
      try {
        await audio.play();
        return {
          supported: true,
          autoplayAllowed: true,
          message: 'Autoplay is allowed'
        };
      } catch (error) {
        return {
          supported: true,
          autoplayAllowed: false,
          message: 'Autoplay is blocked',
          error: error.name
        };
      }
    } catch (error) {
      return {
        supported: false,
        error: error.message
      };
    }
  }

  /**
   * Get browser information
   */
  static getBrowserInfo() {
    const userAgent = navigator.userAgent;
    let browser = 'Unknown';
    let version = 'Unknown';

    if (userAgent.includes('Chrome')) {
      browser = 'Chrome';
      const match = userAgent.match(/Chrome\/(\d+)/);
      version = match ? match[1] : 'Unknown';
    } else if (userAgent.includes('Firefox')) {
      browser = 'Firefox';
      const match = userAgent.match(/Firefox\/(\d+)/);
      version = match ? match[1] : 'Unknown';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      browser = 'Safari';
      const match = userAgent.match(/Version\/(\d+)/);
      version = match ? match[1] : 'Unknown';
    } else if (userAgent.includes('Edge')) {
      browser = 'Edge';
      const match = userAgent.match(/Edge\/(\d+)/);
      version = match ? match[1] : 'Unknown';
    }

    return {
      browser,
      version,
      userAgent,
      platform: navigator.platform
    };
  }

  /**
   * Generate troubleshooting report
   */
  static generateReport(checkResults) {
    let report = '🔍 AUDIO TROUBLESHOOTING REPORT\n';
    report += '=' .repeat(50) + '\n\n';
    
    report += `📅 Timestamp: ${checkResults.timestamp}\n`;
    report += `🌐 Browser: ${checkResults.browser.browser} ${checkResults.browser.version}\n`;
    report += `💻 Platform: ${checkResults.browser.platform}\n\n`;

    // Permissions
    if (checkResults.permissions) {
      report += '🔐 PERMISSIONS:\n';
      if (checkResults.permissions.supported) {
        report += `   Status: ${checkResults.permissions.state}\n`;
      } else {
        report += `   Not supported: ${checkResults.permissions.message}\n`;
      }
      report += '\n';
    }

    // Devices
    if (checkResults.devices) {
      report += '🎤 AUDIO DEVICES:\n';
      if (checkResults.devices.supported) {
        report += `   Input devices: ${checkResults.devices.inputs}\n`;
        report += `   Output devices: ${checkResults.devices.outputs}\n`;
        if (checkResults.devices.inputDevices.length > 0) {
          report += '   Input devices:\n';
          checkResults.devices.inputDevices.forEach((device, index) => {
            report += `     ${index + 1}. ${device.label}\n`;
          });
        }
      } else {
        report += `   Not supported: ${checkResults.devices.message}\n`;
      }
      report += '\n';
    }

    // Media Access
    if (checkResults.mediaAccess) {
      report += '🎵 MEDIA ACCESS:\n';
      if (checkResults.mediaAccess.supported) {
        if (checkResults.mediaAccess.success) {
          report += `   ✅ Success - ${checkResults.mediaAccess.tracksCount} audio track(s)\n`;
        } else {
          report += `   ❌ Failed: ${checkResults.mediaAccess.error} - ${checkResults.mediaAccess.message}\n`;
        }
      } else {
        report += `   Not supported: ${checkResults.mediaAccess.message}\n`;
      }
      report += '\n';
    }

    // WebRTC Support
    if (checkResults.webrtcSupport) {
      report += '🔗 WEBRTC SUPPORT:\n';
      if (checkResults.webrtcSupport.supported) {
        report += '   ✅ Fully supported\n';
      } else {
        report += '   ❌ Missing features:\n';
        Object.entries(checkResults.webrtcSupport.details).forEach(([feature, supported]) => {
          if (!supported) {
            report += `     - ${feature}\n`;
          }
        });
      }
      report += '\n';
    }

    // Autoplay Policy
    if (checkResults.autoplayPolicy) {
      report += '▶️ AUTOPLAY POLICY:\n';
      if (checkResults.autoplayPolicy.supported) {
        if (checkResults.autoplayPolicy.autoplayAllowed) {
          report += '   ✅ Autoplay allowed\n';
        } else {
          report += '   ⚠️ Autoplay blocked - user interaction required\n';
        }
      } else {
        report += `   Cannot determine: ${checkResults.autoplayPolicy.error}\n`;
      }
      report += '\n';
    }

    // Recommendations
    report += '💡 RECOMMENDATIONS:\n';
    
    if (checkResults.permissions && checkResults.permissions.state === 'denied') {
      report += '   • Grant microphone permissions in browser settings\n';
    }
    
    if (checkResults.devices && checkResults.devices.inputs === 0) {
      report += '   • Connect a microphone or audio input device\n';
    }
    
    if (checkResults.mediaAccess && !checkResults.mediaAccess.success) {
      report += '   • Check if another application is using the microphone\n';
      report += '   • Try restarting the browser\n';
    }
    
    if (checkResults.autoplayPolicy && !checkResults.autoplayPolicy.autoplayAllowed) {
      report += '   • Click on the page before starting calls to enable autoplay\n';
    }
    
    if (!checkResults.webrtcSupport || !checkResults.webrtcSupport.supported) {
      report += '   • Update your browser to a newer version\n';
      report += '   • Use Chrome, Firefox, Safari, or Edge\n';
    }

    return report;
  }

  /**
   * Quick audio fix attempts
   */
  static async attemptAudioFixes(remoteVideoElement, remoteAudioElement) {
    const fixes = [];

    // Fix 1: Ensure elements are not muted
    if (remoteVideoElement) {
      if (remoteVideoElement.muted) {
        remoteVideoElement.muted = false;
        fixes.push('Unmuted remote video element');
      }
      if (remoteVideoElement.volume < 1) {
        remoteVideoElement.volume = 1.0;
        fixes.push('Set remote video volume to 100%');
      }
    }

    if (remoteAudioElement) {
      if (remoteAudioElement.muted) {
        remoteAudioElement.muted = false;
        fixes.push('Unmuted remote audio element');
      }
      if (remoteAudioElement.volume < 1) {
        remoteAudioElement.volume = 1.0;
        fixes.push('Set remote audio volume to 100%');
      }
    }

    // Fix 2: Try to play elements
    if (remoteVideoElement && remoteVideoElement.paused) {
      try {
        await remoteVideoElement.play();
        fixes.push('Started playing remote video element');
      } catch (error) {
        fixes.push(`Failed to play remote video: ${error.message}`);
      }
    }

    if (remoteAudioElement && remoteAudioElement.paused) {
      try {
        await remoteAudioElement.play();
        fixes.push('Started playing remote audio element');
      } catch (error) {
        fixes.push(`Failed to play remote audio: ${error.message}`);
      }
    }

    return fixes;
  }
}

export default AudioTroubleshooter;