import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

function MeetingCalendar({ meetings, onSelect, onEdit }) {
  const now = new Date();

  const events = meetings.map((m) => {
    const meetingEndTime = new Date(m.endTime);
    const isPastMeeting = meetingEndTime < now;

    console.log(`📅 Meeting "${m.title}" - Status: "${m.status}", isPast: ${isPastMeeting}, ID: ${m.id}`);

    const event = {
      id: m.id,
      title: m.title,
      start: m.startTime,
      end: m.endTime,
      color: isPastMeeting
        ? "#9ca3af"  // Gray for past meetings
        : "#4f46e5", // Blue for all active meetings (cancelled will be styled with strikethrough)
      classNames: m.status === "Cancelled" ? ["cancelled-meeting"] : [],
      extendedProps: {
        status: m.status // Store status for custom rendering
      }
    };

    console.log(`📅 Event created:`, event);
    return event;
  });

  console.log('📅 Calendar events:', events);

  // Enhanced CSS styles for cancelled meetings
  const cancelledMeetingStyles = `
    /* Target all possible FullCalendar event elements */
    .cancelled-meeting,
    .cancelled-meeting .fc-event,
    .cancelled-meeting .fc-event-main,
    .cancelled-meeting .fc-daygrid-event,
    .cancelled-meeting .fc-timegrid-event {
      opacity: 0.6 !important;
      position: relative !important;
    }
    
    /* Strikethrough for all text elements */
    .cancelled-meeting .fc-event-title,
    .cancelled-meeting .fc-event-time,
    .cancelled-meeting .fc-daygrid-event-dot + *,
    .cancelled-meeting .fc-event-main,
    .cancelled-meeting .fc-list-event-title,
    .cancelled-meeting .fc-list-event-time,
    .cancelled-meeting * {
      text-decoration: line-through !important;
      text-decoration-color: #ef4444 !important;
      text-decoration-thickness: 2px !important;
    }
    
    /* Red overlay for cancelled meetings */
    .cancelled-meeting::before {
      content: "CANCELLED";
      position: absolute !important;
      top: 2px !important;
      right: 2px !important;
      background: #ef4444 !important;
      color: white !important;
      padding: 1px 4px !important;
      border-radius: 2px !important;
      font-size: 8px !important;
      font-weight: bold !important;
      z-index: 1000 !important;
      pointer-events: none !important;
      line-height: 1 !important;
    }
    
    /* Different background for cancelled meetings */
    .cancelled-meeting .fc-event {
      background-color: #fca5a5 !important;
      border-color: #ef4444 !important;
    }
    
    /* Force styles on hover */
    .cancelled-meeting:hover .fc-event-title,
    .cancelled-meeting:hover .fc-event-time,
    .cancelled-meeting:hover .fc-event-main {
      text-decoration: line-through !important;
      text-decoration-color: #ef4444 !important;
      text-decoration-thickness: 2px !important;
    }
  `;

  return (
    <div style={{ height: "calc(100vh - 80px)" }}>
      <style dangerouslySetInnerHTML={{ __html: cancelledMeetingStyles }} />
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="100%"
        events={events}

        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay"
        }}

        /* CLICK DATE */
        dateClick={(info) => {
          onSelect && onSelect(new Date(info.date));
        }}

        /* CLICK EVENT */
        eventClick={(info) => {
          const meeting = meetings.find(m => m.id === info.event.id);
          if (meeting) {
            const now = new Date();
            const meetingEndTime = new Date(meeting.endTime);

            if (meetingEndTime < now) {
              alert('This meeting has already ended and cannot be edited.');
              return;
            }

            onEdit && onEdit(meeting);
          }
        }}

        /* CUSTOM EVENT RENDERING */
        eventDidMount={(info) => {
          info.el.title = info.event.title;

          // Force re-apply cancelled styling if needed
          if (info.event.extendedProps.status === "Cancelled") {
            info.el.classList.add("cancelled-meeting");

            // Additional manual styling for better compatibility
            const titleEl = info.el.querySelector('.fc-event-title');
            const timeEl = info.el.querySelector('.fc-event-time');
            const mainEl = info.el.querySelector('.fc-event-main');

            if (titleEl) {
              titleEl.style.textDecoration = 'line-through';
              titleEl.style.textDecorationColor = '#ef4444';
              titleEl.style.textDecorationThickness = '2px';
            }

            if (timeEl) {
              timeEl.style.textDecoration = 'line-through';
              timeEl.style.textDecorationColor = '#ef4444';
              timeEl.style.textDecorationThickness = '2px';
            }

            if (mainEl) {
              mainEl.style.textDecoration = 'line-through';
              mainEl.style.textDecorationColor = '#ef4444';
              mainEl.style.textDecorationThickness = '2px';
            }
          }
        }}
      />
    </div>
  );
}
export default MeetingCalendar;