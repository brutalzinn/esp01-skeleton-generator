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
    case WStype_CONNECTED:
      IPAddress ip = webSocket.remoteIP(num);
      Serial.print("Connected:");
      Serial.println(ip);
      break;
    case WStype_TEXT:
      String text = String((char *) &payload[0]);
        //just for debug
        Serial.print(text);
        Serial.print(num);
        Serial.println(type);
        if (text == "LED_1_ON") {
          webSocket.sendTXT(0, "LED_1_ON");
          digitalWrite(LED_BUILTIN, HIGH);
        }
       break;
    case default:
    Serial.println("COMMAND NOT FOUND");
  }

}

void setup() {

  // Inicialização do LED
  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, OFF);
  WiFi.config(ip, dns, gateway, subnet);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.println("Connecting..");
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