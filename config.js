const env_name = process.env.NODE_ENV||"development";
console.log("loading config for  ..... " + env_name);

if(typeof window ==="object"){
    throw "警告：服务器端config配置不应该被引入在客户端脚本中，以免泄露敏感信息，请检查相关引用";
}

if(typeof global.__config_loaded === "undefined") {
    global.__config_loaded = require("./config/" + env_name + ".config.js");
}

export default global.__config_loaded.config; 