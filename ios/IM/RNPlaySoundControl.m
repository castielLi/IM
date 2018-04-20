//
//  RNPlaySoundControl.m
//  IM
//
//  Created by castiel on 2018/4/20.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "RNPlaySoundControl.h"
#import <UIKit/UIKit.h>
#import <AVFoundation/AVFoundation.h>

@implementation RNPlaySoundControl

RCT_EXPORT_MODULE()

//初始化播放声音设置
RCT_EXPORT_METHOD(setPlaySoundSetting){
  [[NSNotificationCenter defaultCenter] addObserver:self
   
                                           selector:@selector(sensorStateChange:)
   
                                               name:@"UIDeviceProximityStateDidChangeNotification"
   
                                             object:nil];
}

//开始播放
RCT_EXPORT_METHOD(beginPlaySound){
  [[UIDevice currentDevice] setProximityMonitoringEnabled:YES];
}

//结束播放
RCT_EXPORT_METHOD(stopPlaySound){
  [[UIDevice currentDevice] setProximityMonitoringEnabled:NO];
  
}

-(void)sensorStateChange:(NSNotificationCenter *)notification{
  
  //如果此时手机靠近面部放在耳朵旁，那么声音将通过听筒输出，并将屏幕变暗（省电啊）
  
  if ([[UIDevice currentDevice] proximityState] == YES){
    [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryPlayAndRecord error:nil];
  }
  else{
    [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryPlayback error:nil];
  }
  
}

@end
