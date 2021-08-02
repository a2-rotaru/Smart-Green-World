//Include libraries for humidity and room temperature
#include <DHT.h>
#include <DHT_U.h>


//Include libraries for WIFI module
#include <SoftwareSerial.h>

//Include libraries for water temperature 
#include <OneWire.h>
#include <DallasTemperature.h>

//Include libraries for LCD
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

//Defining sensors pins
#define DHTPIN 40 //DHT connected to pin 22 on Arduino
#define ONE_WIRE_BUS 30 //Water temp sensor connected to pin 50 on Arduino
#define RELAY_PIN 26 // the Arduino pin, which connects to the IN pin of relay
#define light 23 // the arduino pin where the light sensor is connected
#define FLOAT_SENSOR 22 //Arduino pin which the PP floating switch is coonected
#define LED 52
#define SensorPin A0 // the pH meter Analog output is connected with the Arduino’s Analog
#define MOTOR 7



#define TIMEOUT 5000
#define arduino_id "SGW-01";

// WiFi Data
#define WIFI_SSID "VM1323950" //Network name
#define WIFI_PASS "v7hRmCgjjmwj" //Password

// Connection Data
#define SERVER_IP "192.168.0.80"
#define SERVER_PORT 5000

#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

//Setup a oneWire instance to communicate with any OneWire device
OneWire oneWire(ONE_WIRE_BUS);

//Pass our oneWire reference to Dallas Temperature
DallasTemperature sensors(&oneWire);


SoftwareSerial mySerial(11, 10); // TX to 11 and RX to 10

float tempC = 0; //variable to store the temperature


  
void setup() {
   
   Serial.begin(9600);
   mySerial.begin(9600);
   dht.begin();
   lcd.begin();
   lcd.backlight();
   lcd.clear();
   pinMode(RELAY_PIN, OUTPUT);
   pinMode(light, INPUT);
   pinMode(FLOAT_SENSOR, INPUT_PULLUP);
   pinMode(LED, OUTPUT);
   
   //Check if the module is connected to WiF
   if(SendCommand("AT+CIFSR", "0.0.0.0")){
      Serial.println("CONN OK");
  } else {
      // Connect to WiFi
      SendCommand("AT+CWMODE=1","OK"); //Set Wifi mode to STA
      // Setup WiFi connection
      String conn = "AT+CWJAP=\""; //Storing the parameters of access point in a string
      conn += WIFI_SSID;
      conn += "\",";
      conn += WIFI_PASS;
      conn += "\"";
      SendCommand(conn,"OK"); //Connect to wifi
      // If this fails too, reset arduino from software
  }  
}

void loop() {
  
  //Getting the humidity
  int h = dht.readHumidity();

  //Getting the temperature in celsius
  float t = dht.readTemperature();

   //Command to get the temperature
   sensors.requestTemperatures();
   //Getting the water temperature in Celsius
   tempC = sensors.getTempCByIndex(0);

   //Gettin the pH value and store it in  pH
   float  pH = analogRead(SensorPin);
   //Convert the pH into millivolt
   float phValue=(float)pH*5.0/1024/6; //convert the analog into millivolt
                      
  //convert the millivolt into pH value
   phValue=3.5*phValue;  

  
  String one = "GET /values/";
  String two = String(h); //humidity
  String three = String(tempC); //water temp
  String four = String(t);//room temp
  String five = String (phValue);
  String six = arduino_id;
  String seven = "HTTP/1.1";
  
  String header = one+two+"/"+three + "/"+four + "/"+five + "/"+six +" " +seven;
  Serial.print(header);


  delay(2000);
  
  SendCommand("AT+CIPMUX=0", "OK"); //Set up single TCP connection
  delay(500);
  // Setup TCP connection string
  String TCPconn = "AT+CIPSTART=\"TCP\",\"";
  TCPconn += SERVER_IP;
  TCPconn += "\",";
  TCPconn += SERVER_PORT;
  // Send TCP command
  if(SendCommand(TCPconn, "OK")){
    delay(500);
    SendCommand("AT+CIPSEND=125", "OK"); // change CIPSEND based on req length + 8
    delay(2000);
    
    // Build request header

    String reqHeader = one+two+"/"+three + "/"+four + "/"+five + "/"+six +" " +seven;
    String reqHeader1 = "Host: 192.168.0.80:5000";
    String reqHeader2 = "Content-Type: application/x-www-form-urlencoded";

    
    // Send request
    mySerial.println(reqHeader);
    mySerial.println(reqHeader1);
    mySerial.println(reqHeader2);
   
    SendCommand("", "}");

    //Close TCP connection
    SendCommand("AT+CIPCLOSE", "OK");
delay(6000);
  }
   //CCheck water level
  if(digitalRead(FLOAT_SENSOR) == LOW) {
      digitalWrite(LED, HIGH);
      digitalWrite(MOTOR, HIGH);
      lcd.clear();
      lcd.print("Water pump on");
  } else{
    digitalWrite(LED,LOW);
    digitalWrite(MOTOR,LOW);
    lcd.clear();
    lcd.print("Water pump off");
  }

  //Control the growing lights 
  
  int lightValue = digitalRead(light);
  if (lightValue == 0){
      digitalWrite(RELAY_PIN, HIGH);
      lcd.clear();
      lcd.print("We have light");
      Serial.println("We have light");
  }
  else {
    digitalWrite(RELAY_PIN, LOW);
    Serial.println("We need light");
    lcd.clear();
    lcd.print("We need light");
  }
  delay(1000);

}


  boolean SendCommand(String cmd, String ack){
    mySerial.println(cmd); // Send "AT+" command to module
    if (!echoFind(ack)) // timed out waiting for ack string
      return true; // ack blank or ack found
  }
   
  boolean echoFind(String keyword){
   byte current_char = 0;
   byte keyword_length = keyword.length();
   long deadline = millis() + TIMEOUT;
   while(millis() < deadline){
    if (mySerial.available()){
      char ch = mySerial.read();
      Serial.write(ch);
      if (ch == keyword[current_char])
        if (++current_char == keyword_length){
         Serial.println("");
         return true;
      }
     }
    }
   return false; // Timed out
  }
