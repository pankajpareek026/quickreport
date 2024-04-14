// const csvtojson = require("csvtojson");
import csvtojson from "csvtojson";
const convertCsvToJson = async (csvData) => {
    try {
        let jsonData = await csvtojson({ flatKeys: true }).fromString(csvData);

        return jsonData
    } catch (error) {
        return {
            error: true,
            message: error.message
        }
    }
}

export default convertCsvToJson;