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

        // Dynamic status & sleek craft typography
        if (totalCount == 0) {
            views.setTextViewText(R.id.widget_small_headline, "کاری اضافه نکردی");
            views.setTextViewText(R.id.widget_small_sub, "امروز برنامه‌ای ثبت نشده");
            views.setProgressBar(R.id.widget_small_progress, 100, 0, false);
            views.setTextViewText(R.id.widget_small_percent, "۰٪");
        } else if (pendingCount == 0) {
            views.setTextViewText(R.id.widget_small_headline, "همه کارها تموم شد!");
            views.setTextViewText(R.id.widget_small_sub, "همه تیک خوردن ✨");
            views.setProgressBar(R.id.widget_small_progress, 100, 100, false);
            views.setTextViewText(R.id.widget_small_percent, "۱۰۰٪");
        } else {
            views.setTextViewText(R.id.widget_small_headline, "روزت رو مرتب کن");
            views.setTextViewText(R.id.widget_small_sub, pendingCount + " کار باقی‌مانده");
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

    @Override
    public void onEnabled(Context context) {
        super.onEnabled(context);
        updateAllWidgets(context);
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
