
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);

    // Format time in 12-hour format with minutes and AM/PM indication
    const time = date.toLocaleString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });

    // Format date
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-IN', options);

    return `${time}, ${formattedDate}`;
}

export default formatTimestamp;