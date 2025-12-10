// Utility function to format dates in a readable way

export const formatDate = (dateString) => {
    const date = new Date(dateString);

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    return date.toLocaleDateString('en-US', options);
};

export const formatDateTime = (dateString) => {
    const date = new Date(dateString);

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };

    return date.toLocaleDateString('en-US', options);
};

export const formatTime = (timeString) => {
    // If time is already formatted (e.g., "10:00 AM"), return as is
    if (timeString && timeString.includes('AM') || timeString.includes('PM')) {
        return timeString;
    }

    // Otherwise, parse and format
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;

    return `${displayHour}:${minutes} ${ampm}`;
};
