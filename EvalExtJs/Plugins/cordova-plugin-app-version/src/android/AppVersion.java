package uk.co.whiteoctober.cordova;

import android.content.pm.PackageManager;
import android.content.pm.PackageManager.NameNotFoundException;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

public class AppVersion extends CordovaPlugin {

	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
		if ("getVersionNumber".equals(action)) {
			try {
				PackageManager packageManager = this.cordova.getActivity().getPackageManager();
				callbackContext.success(packageManager.getPackageInfo(this.cordova.getActivity().getPackageName(), 0).versionName);
			} catch (NameNotFoundException e) {
				callbackContext.error("");
			}
			return true;
		}
		return false;
	}

}
