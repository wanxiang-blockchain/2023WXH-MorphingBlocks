#!/usr/bin/env python
# -*- coding:utf-8 -*-

import serial
import time
import threading
import json

import common.czUtils as czUtils 
from common.czConsoleUtils import Color,Mode,LogPrint,LogGreen,LogWarning,LogError
from common.czLogUtils import czLogUtils

MSG_LOG = 0x00;
MSG_HEART_BEAT = 0x01;
MSG_INSERT_COIN = 0x02;

# 打开串口
ser = serial.Serial('COM3', 9600)  # 'COM5'是串口名称，9600是波特率

def ReadCom():
    try:
        while True:
            # 读取串口数据
            data = ser.readline().decode('utf-8')  # 以UTF-8编码解码数据
            print(data, end='')  # 打印数据

            # 使用json.loads方法解析JSON字符串
            data = json.loads(data) 

            # 现在，你可以通过键来访问JSON中的值
            msg_type = data["type"]
            message = data["msg"]
            if msg_type == MSG_INSERT_COIN:
                WriteCom()

    except KeyboardInterrupt:
        # 如果用户按下Ctrl+C，则停止循环并关闭串口
        ser.close()


def WriteCom():
    # 请求投币
    #  http://172.18.9.65:18099/req_insertCoin?macAddr=mac:10086&inAmount=1
    url = 'http://127.0.0.1:18099/req_insertCoin'
    param = {}
    param['macAddr'] = 'mac:10086'
    param['inAmount'] = 1
    ret = czUtils.getRequestData(url,param)
    print(ret)
    print('WriteCom begin')
    # 点亮LED
    ser.write(b'1')
    time.sleep(5)  # 等待2秒钟

    # 关闭LED
    ser.write(b'0')

    # 关闭串口连接
    #ser.close()
    print('WriteCom end')


my_thread = threading.Thread(target=ReadCom)
# 启动线程
my_thread.start()

for idx in range(0,0):
    WriteCom()
    time.sleep(1)  # 等待5秒钟



# 請求功德測試例子
# 172.18.9.65:18099/req_reward?macAddr=mac:10086&walletAddr=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266&inAmount=1&tokenType=1&txID=1
# url = 'http://172.18.9.65:18099/req_reward'
# param = {}
# param['macAddr'] = 'mac:10086'
# param['walletAddr'] = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
# param['inAmount'] = 1
# param['tokenType'] = 1
# param['txID'] = 2
# ret = czUtils.getRequestData(url,param)
# print(ret)

