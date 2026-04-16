import {
  FaMicrophone,
  FaVideo,
  FaDesktop,
  FaPhoneSlash,
} from "react-icons/fa";

export default function JoinMeeting({ meeting, onLeave }) {
  return (
    <div className="join-meeting">
       <div className="meeting-header"></div>
        <span className="meeting-status">Live</span>
      <h3>{meeting.title}</h3>

      <div className="meeting-video-placeholder">
        Video Stream Area
          <span>Camera Off</span>
      </div>

      <div className="meeting-controls">
        <button><FaMicrophone /></button>
        <button><FaVideo /></button>
        <button><FaDesktop /></button>
        <button className="danger" onClick={onLeave}>
          <FaPhoneSlash />
        </button>
      </div>
    </div>
  );
}
