package com.AdjustType;

import android.app.Activity;
import android.os.Build;
import android.view.View;
import android.view.WindowManager;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.bridge.GuardedRunnable;

import java.util.Map;
import java.util.HashMap;

public class AdjustType extends ReactContextBaseJavaModule {

  public AdjustType(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "AdjustType";
  }

  @ReactMethod
  public void adjustResize(final Callback callback) {
    final Activity activity = getCurrentActivity();

    UiThreadUtil.runOnUiThread(
      new Runnable() {
        @Override
        public void run() {
          activity.getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
          if(callback != null){
            callback.invoke();
          }
        }
      }
    );
  }

  @ReactMethod
  public void adjustNothing(final Callback callback) {
    final Activity activity = getCurrentActivity();

    UiThreadUtil.runOnUiThread(
      new Runnable() {
        @Override
        public void run() {
          activity.getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_NOTHING);
          if(callback != null){
            callback.invoke();
          }
        }
      }
    );
  }

}