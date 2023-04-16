#include <ESP8266WiFi.h>
#include <WebSocketsServer.h>
#include "config.h"

//just for fix led inverted on esp 8266
#define ON LOW
#define OFF HIGH

WebSocketsServer webSocket = WebSocketsServer(SOCK_PORT); // Recebe dados do cliente

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t lenght) {

  switch (type) {
    case WStype_DISCONNECTED:
      break;
    case WStype_CONNECTED: {
      IPAddress connectedIp = webSocket.remoteIP(num);
      Serial.print("connected:");
      Serial.println(connectedIp);
    }
    break;
    case WStype_TEXT: {
      String text = String((char *) &payload[0]);
        Serial.println(text);
    }
     break;
   default:
    Serial.println("WAITING COMMANDS");
    break;
  }

}

void setup() {
  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, OFF);
  WiFi.config(ip, dns, gateway, subnet);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(". ");
    delay(100);
  }
  //set default led on to indicate that is connected to wifi
  digitalWrite(LED_BUILTIN, ON);
  printSerialInfo();
  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
}

void loop() {
  //loop every event that happens
  webSocket.loop();
}

void printSerialInfo(){
  Serial.println();
  Serial.print("MAC: ");
  Serial.println(WiFi.macAddress());
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());

}