const fs = require('fs');
const dataUriParser = require('datauri');
const getDataUri = (file) => {
    const parser = new dataUriParser();
    const extName = fs.extname(file.originalName).toString()
    return parser.format(extName, file.content)

}
export default getDataUri ;