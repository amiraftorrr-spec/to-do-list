package com.tedlist.app;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import org.json.JSONArray;
import org.json.JSONException;

@CapacitorPlugin(name = "WidgetBridge")
public class WidgetBridgePlugin extends Plugin {

    @PluginMethod
    public void openUrl(PluginCall call) {
        String url = call.getString("url");
        if (url != null && !url.isEmpty()) {
            try {
                Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                browserIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                getContext().startActivity(browserIntent);
                call.resolve();
                return;
            } catch (Exception e) {
                call.reject("Could not open URL: " + e.getMessage());
                return;
            }
        }
        call.reject("URL is required");
    }

    @PluginMethod
    public void updateWidget(PluginCall call) {
        JSObject data = call.getData();
        int pendingCount = data.optInt("pendingCount", 0);
        int totalCount = data.optInt("totalCount", 0);
        int completedCount = data.optInt("completedCount", 0);
        int progressPercent = data.optInt("progressPercent", 0);

        Context context = getContext();
        SharedPreferences prefs = context.getSharedPreferences(TedlistWidgetSmall.PREFS_NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();

        editor.putInt("pending_count", pendingCount);
        editor.putInt("total_count", totalCount);
        editor.putInt("completed_count", completedCount);
        editor.putInt("progress_percent", progressPercent);

        JSONArray tasks = data.optJSONArray("topTasks");
        if (tasks != null) {
            try {
                editor.putString("task_1_title", tasks.length() > 0 ? tasks.getString(0) : "");
                editor.putString("task_2_title", tasks.length() > 1 ? tasks.getString(1) : "");
                editor.putString("task_3_title", tasks.length() > 2 ? tasks.getString(2) : "");
            } catch (JSONException ignored) {
                // Ignore parse errors
            }
        } else {
            editor.putString("task_1_title", "");
            editor.putString("task_2_title", "");
            editor.putString("task_3_title", "");
        }

        editor.apply();

        // Broadcast update to all active widgets
        TedlistWidgetSmall.updateAllWidgets(context);
        TedlistWidgetLarge.updateAllWidgets(context);

        call.resolve();
    }
}
