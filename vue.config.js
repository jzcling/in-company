const fs = require('fs')

module.exports = {
    "transpileDependencies": [
      "vuetify"
    ],
    devServer: {
        host: 'hubbedin.company',
        port: 3002,
        https: {
            key: fs.readFileSync("./certs/hubbedin.company.key"),
            cert: fs.readFileSync("./certs/hubbedin.company.crt")
        }
    }
}