function generateConfigMQTT(form){
var generic_config = `
#define WIFI_SSID "${form.network_name}"
#define WIFI_PASS "${form.network_password}"
const char* mqttserver = "${form.mqtt_server}";
const int mqttserverport = ${form.mqtt_port};
const char* mqttuser = "${form.mqtt_user}";
const char* mqttpass = "${form.mqtt_password}";
const char* MQTTQUEUEINPUT = "${form.mqtt_input}";
const char* MQTTQUEUEOUTPUT = "${form.mqtt_output}";
long interval = ${form.queue_interval};
IPAddress ip(${convertIP(form.esp_ip)});
IPAddress gateway(${convertIP(form.esp_gateway)});
IPAddress subnet(${convertIP(form.esp_subnet)});
IPAddress dns(${convertIP(form.esp_dns)});
`
return generic_config
}

function generateConfigWebSocket(form){
var generic_config = `
#define WIFI_SSID "${form.network_name}"
#define WIFI_PASS "${form.network_password}"
#define SOCK_PORT ${form.socket_port}
IPAddress ip(${convertIP(form.esp_ip)});
IPAddress gateway(${convertIP(form.esp_gateway)});
IPAddress subnet(${convertIP(form.esp_subnet)});
IPAddress dns(${convertIP(form.esp_dns)});
`
return generic_config
}

function convertIP(ip){
    return ip.replace(/\./g,",")
}

module.exports = {
    generateConfigMQTT,
    generateConfigWebSocket
}