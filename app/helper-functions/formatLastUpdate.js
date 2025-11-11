import wordsToNumbers from "words-to-numbers";


function formatLastUpdate(lastUpdateText) {
    // Remove 'Updated' and surrounding brackets
    let formattedText = lastUpdateText.replace(/Updated |\[|]/g, '').trim();

    // Split the text to isolate the time-related part
    let timePart = formattedText.split(' ')[0];

    // Check if the time part is a written number, and convert it if needed
    const numericTimePart = isNaN(timePart) ? wordsToNumbers(timePart) : timePart;

    // Rebuild the final string with the converted time part
    return formattedText.replace(timePart, numericTimePart);
}


export default formatLastUpdate;