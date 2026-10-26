package com.tedlist.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;

public class TedlistWidgetSmall extends AppWidgetProvider {

    public static final String PREFS_NAME = "tedlist_widget_prefs";

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        int pendingCount = prefs.getInt("pending_count", 0);
        int totalCount = prefs.getInt("total_count", 0);
        int progressPercent = prefs.getInt("progress_percent", 100);

        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_small);

        // Intent to launch app
        Intent intent = new Intent(context, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(
                context,
                0,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        views.setOnClickPendingIntent(R.id.widget_small_root, pendingIntent);

        // Duolingo-style text & dynamic status
        if (totalCount == 0 || pendingCount == 0) {
            views.setTextViewText(R.id.widget_small_emoji, "🎉");
            views.setTextViewText(R.id.widget_small_headline, "فعلاً کاری نداری!");
            views.setTextViewText(R.id.widget_small_sub, "همه تیک خوردن ✨");
            views.setProgressBar(R.id.widget_small_progress, 100, 100, false);
            views.setTextViewText(R.id.widget_small_percent, "100%");
        } else {
            views.setTextViewText(R.id.widget_small_emoji, "👀");
            views.setTextViewText(R.id.widget_small_headline, "اینا چی شدن پس؟");
            views.setTextViewText(R.id.widget_small_sub, pendingCount + " کار منتظرته!");
            views.setProgressBar(R.id.widget_small_progress, 100, progressPercent, false);
            views.setTextViewText(R.id.widget_small_percent, progressPercent + "%");
        }

        appWidgetManager.updateAppWidget(appWidgetId, views);
    }

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    public static void updateAllWidgets(Context context) {
        AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
        ComponentName thisWidget = new ComponentName(context, TedlistWidgetSmall.class);
        int[] appWidgetIds = appWidgetManager.getAppWidgetIds(thisWidget);
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }
}
