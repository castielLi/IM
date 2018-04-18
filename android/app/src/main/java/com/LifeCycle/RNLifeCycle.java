package com.LifeCycle;

import android.widget.Toast;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Callback;

import java.util.Map;
import java.util.HashMap;

public class RNLifeCycle extends ReactContextBaseJavaModule {

  public static Callback DESTROY_CALLBACK;

  public RNLifeCycle(ReactApplicationContext reactContext) {
    super(reactContext);
    setupLifecycleEventListener(reactContext);
  }

  @Override
  public String getName() {
    return "RNLifeCycle";
  }



  private void setupLifecycleEventListener(ReactApplicationContext reactContext) {
      reactContext.addLifecycleEventListener(new LifecycleEventListener() {
          @Override
          public void onHostResume() {
              //...
          }

          @Override
          public void onHostPause() {
              //...
          }

          @Override
          public void onHostDestroy() {
             if(DESTROY_CALLBACK != null){
                DESTROY_CALLBACK.invoke();
             }
          }
      });
  }

  @ReactMethod
  public void destroyCallback(Callback callback) {
    DESTROY_CALLBACK = callback;
  }


}