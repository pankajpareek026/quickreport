function isNull() {
    return "Time String is Required";
}
function getUnixTime(originalTime = isNull()) {
    this.originalTime = String(originalTime);
    // Input date string
    // const dateString = "30/12/2021, 11:05:00 am";

    // Parse the date string into a valid Date object
    console.log("original Time getunidtimeF =>", originalTime)
    const parts = this.originalTime.match(/(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2}):(\d{2}) (am|pm)/);
    if (parts) {
        const day = parseInt(parts[1], 10);
        const month = parseInt(parts[2], 10) - 1; // Month is zero-based in JavaScript
        const year = parseInt(parts[3], 10);
        const hours = parts[4];
        const minutes = parts[5];
        const seconds = parts[6];
        const ampm = parts[7];

        // Adjust hours for AM/PM
        let adjustedHours = parseInt(hours, 10);
        if (ampm.toLowerCase() === 'pm' && adjustedHours < 12) {
            adjustedHours += 12;
        }

        // Create a Date object
        const dateObject = new Date(year, month, day, adjustedHours, minutes, seconds);
        console.log(dateObject.getTime());
        const originalLocalDate = dateObject.toString()  //'Thu Dec 30 2021 11:05:00 GMT+0530 (India Standard Time)'
        const originalUnixTime = dateObject.getTime()   //Thu, 30 Dec 2021 05:35:00 GMT
        const utcTime = new Date(originalLocalDate).toUTCString()
        const unixUtcTimeStamp = new Date(utcTime).getTime() / 1000
        const currentTimeStamp = Date.now()
        let timeDefference = currentTime - timeStamp
        console.log("timedef :", timeDefference)
        timeDefference = timeDefference / 3600 / 1000
        return {
            originalTime: originalTime,
            originalLocalDate,
            fromTimeStamp: timeStamp / 1000,
            toTimeStamp: timeStamp / 1000 + 21600,
            currentTimeStamp,
            timeDefference: parseFloat(timeDefference).toFixed(2),
            isOlderTime: timeDefference > 15

        }
    }
    //    console.log(dateObject.getTime());
    originalTime = new Date(originalTime)
    const timeStamp = originalTime.getTime()
    const originalLocalDate = originalTime.toString()  //'Thu Dec 30 2021 11:05:00 GMT+0530 (India Standard Time)'
    const currentTimeStamp = Date.now()
    let timeDefference = currentTimeStamp - timeStamp
    timeDefference = timeDefference / 3600 / 1000

    // console.log("mili ->>", mili)
    return {
        originalTime: originalTime,
        originalLocalDate,
        fromTimeStamp: timeStamp / 1000,
        toTimeStamp: timeStamp / 1000 + 21600,
        currentTimeStamp,
        timeDefference: parseFloat(timeDefference).toFixed(2),
        isOlderTime: timeDefference > 7

    }


}

// console.log(getUnixTime("2021-12-31T18:30:00.000Z"))
// module.exports = getUnixTime
export default getUnixTime
// console.log(GetUnixTime("30/12/2021, 11:05:00 am"))