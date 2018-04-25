package com.im;

import android.app.Application;

import com.RNSoundControl.RNSoundControlPackage;

import cn.jpush.reactnativejpush.JPushPackage;
import com.facebook.react.ReactApplication;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.github.yamill.orientation.OrientationPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactlibrary.RNUUIDGeneratorPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.babisoft.ReactNativeLocalization.ReactNativeLocalizationPackage;
import com.imagepicker.ImagePickerPackage;
import com.rnfs.RNFSPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.rnim.rn.audio.ReactNativeAudioPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import org.pgsqlite.SQLitePluginPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private boolean SHUTDOWN_TOAST = false;
  private boolean SHUTDOWN_LOG = false;

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new ReactNativeContacts(),
            new SplashScreenReactPackage(),
            new RNDeviceInfo(),
            new OrientationPackage(),
            new ReactVideoPackage(),
            new VectorIconsPackage(),
            new RNUUIDGeneratorPackage(),
            new RNSoundPackage(),
            new ReactNativeLocalizationPackage(),
            new ImagePickerPackage(),
            new RNFSPackage(),
            new RCTCameraPackage(),
            new SQLitePluginPackage(),
            new ReactNativeAudioPackage(),
            new JPushPackage(SHUTDOWN_TOAST, SHUTDOWN_LOG),
            new RNSoundControlPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
