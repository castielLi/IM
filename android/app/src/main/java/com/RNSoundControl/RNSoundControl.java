package com.RNSoundControl;

import android.media.MediaPlayer;
import android.media.AudioManager;
import android.hardware.Sensor;
import android.hardware.SensorManager;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.content.Context;
import android.os.PowerManager;
import android.os.Bundle;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Callback;

import java.util.Map;
import java.util.HashMap;

public class RNSoundControl extends ReactContextBaseJavaModule {

    private AudioManager audioManager;
    private SensorManager sensorManager;
    private PowerManager powerManager;
    private PowerManager.WakeLock wakeLock;

    @Override
    public String getName() {
        return "RNSoundControl";
    }

    public RNSoundControl(ReactApplicationContext reactContext) {
        super(reactContext);
        audioManager = (AudioManager) reactContext.getSystemService(Context.AUDIO_SERVICE);//声音管理
        sensorManager = (SensorManager) reactContext.getSystemService(Context.SENSOR_SERVICE);//传感器
        powerManager = (PowerManager) reactContext.getSystemService(Context.POWER_SERVICE);//屏幕&键盘管理
    }

    private SensorEventListener listener = new SensorEventListener() {
        @Override
        public void onSensorChanged(SensorEvent event) {
            //当传感器监测到的数值发生变化时就会调用onSensorChanged方法
            //SensorEvent参数中又包含了一个values数组,所有传感器输出的信息都存放在数组中
            float distance = event.values[0];
            Sensor sensor = sensorManager.getDefaultSensor(Sensor.TYPE_PROXIMITY);
            if (distance >= sensor.getMaximumRange()) {
                SoundPlayControl(true);
                setScreenOn();
            } else {
                SoundPlayControl(false);
                setScreenOff();
            }
        }
        @Override
        public void onAccuracyChanged(Sensor sensor, int accuracy) {
            //传感器的精度发生变化时就会调用onAccuracyChanged方法
        }
    };

    private void setScreenOff(){
        if (wakeLock == null){
            wakeLock = powerManager.newWakeLock(PowerManager.PROXIMITY_SCREEN_OFF_WAKE_LOCK, this.getClass().getName());
        }
        wakeLock.acquire();
    }

    private void setScreenOn(){
        if (wakeLock != null){
            wakeLock.setReferenceCounted(false);
            wakeLock.release();
            wakeLock = null;
        }
    }

    private void SoundPlayControl(boolean setting) {
        //audioManager.setMode(AudioManager.MODE_IN_COMMUNICATION);//设置音频模式
        //MediaPlayer mediaPlayer = new MediaPlayer();
        //mediaPlayer.setAudioStreamType(AudioManager.STREAM_VOICE_CALL);//
        if (setting) {
            audioManager.setMode(AudioManager.MODE_NORMAL);
            audioManager.setSpeakerphoneOn(true);//打开扬声器
        } else {
            audioManager.setMode(AudioManager.MODE_IN_COMMUNICATION);
            audioManager.setSpeakerphoneOn(false);//关闭扬声器
        }
    }

    @ReactMethod
    public void sensorListener() {
        //第一步：获取 SensorManager 的实例
        //sensorManager = (SensorManager) context.getSystemService(Context.SENSOR_SERVICE);
        //第二步：获取 Sensor 传感器类型
        Sensor sensor = sensorManager.getDefaultSensor(Sensor.TYPE_PROXIMITY);
        //第三步：注册 SensorEventListener
        sensorManager.registerListener(listener, sensor, SensorManager.SENSOR_DELAY_NORMAL);
    }

    @ReactMethod
    public void onUninstallListener() {
        if (sensorManager != null) {
            sensorManager.unregisterListener(listener);
        }
    }

}
