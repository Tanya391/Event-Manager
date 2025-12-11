export const formatDate = (dateString) => {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatTime = (timeString) => {
    // Assuming timeString is HH:mm or similar
    return timeString;
};
