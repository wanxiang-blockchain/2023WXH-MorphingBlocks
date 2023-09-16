 
#include <Servo.h>   
#include <ArduinoJson.h>
Servo myservo;  // 创建舵机对象
int pos = 0;    // 舵机当前位置

const int MSG_LOG = 0x00;
const int MSG_HEART_BEAT = 0x01;
const int MSG_INSERT_COIN = 0x02;
const int ldrPin = A5;
const int ledPin = 8; // 设置LED连接的引脚为9
int counter = 0;
int heartTicker = 0;
 // 创建一个JSON对象
StaticJsonDocument<128> jsonDocument;
 
void setup() {
  // 初始化串口通信
  Serial.begin(9600);
  myservo.attach(9);  // 将舵机连接到数字引脚9
  logMsg(MSG_LOG,"setup init done!");
}
void logMsg(int type,String msg){
  jsonDocument["type"] = type;
  jsonDocument["msg"] = msg;  
  // 序列化JSON到字符串
  String jsonString;
  serializeJson(jsonDocument, jsonString);
  Serial.println(jsonString);
}
void CheckInputloop() {

  if (Serial.available() > 0) {
    char command = Serial.read(); // 读取串口中的命令 
    logMsg(MSG_LOG,"read command");
    if (command == '1') {
      logMsg(MSG_LOG,"start command"); 
//        for (pos = 0; pos <= 180; pos += 1) { 
//          myservo.write(pos);             
//          delay(15);                      
//        }
//        for (pos = 180; pos >= 0; pos -= 1) {
//          myservo.write(pos);              
//          delay(15);                       
//        }
          kickBall();
    } else if (command == '0') {
        logMsg(MSG_LOG,"end command");
    }
  }
  else{
    //logMsg(MSG_LOG,"serial not avalible");
    //Serial.println("************serial not avalible************"); 
  }
 
}

void kickBall() {

  for (int idx = 0; idx < 3; idx++) { 
        
    for (pos = 90; pos >= 0; pos -= 3) {
      myservo.write(pos);              
      delay(5);                       
    }     
       
    for (pos = 0; pos <= 90; pos += 3) { 
      myservo.write(pos);             
      delay(5);                      
    }    
    delay(800);                
  }
  delay(5000); 
}

void loop() {
  // 读取光敏电阻的值
  int ldrValue = analogRead(ldrPin);

  if (ldrValue <300){ 
    // 打印光线强度值到串口
      // 创建一个字符串来合并数据  
    counter++;
    String output = "{L:"+ String(ldrValue)+ "}"; //+ ",Coin:" + String(counter)+
    
    logMsg(MSG_INSERT_COIN, output);
    //Serial.println(output);  
    delay(2000); 

  }else
  {
        // 打印光线强度值到串口
    //Serial.print("光线强度值: ");
    //Serial.println(ldrValue);
//    kickBall();
    CheckInputloop();
    // 延时一段时间以防止频繁读取 
    delay(10);
    
    // 延时一段时间每隔5秒左右发一次心跳包
    heartTicker++;
    if(heartTicker % 300 == 0){
      logMsg(MSG_HEART_BEAT,"heart beat!");
    } 
    delay(10);
  }
}
