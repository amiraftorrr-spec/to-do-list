package com.tedlist.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.widget.RemoteViews;

public class TedlistWidgetSmall extends AppWidgetProvider {

    public static final String PREFS_NAME = "tedlist_widget_prefs";

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        int pendingCount = prefs.getInt("pending_count", 0);
        int totalCount = prefs.getInt("total_count", 0);
        int completedCount = prefs.getInt("completed_count", 0);
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

        // Brand title in Shabnam-Bold
        views.setImageViewBitmap(
                R.id.widget_small_title_img,
                FontBitmapHelper.renderText(context, "تدلیست", 11.5f, Color.parseColor("#F4EFE6"), 700, 200, false)
        );

        String headline;
        String sub;
        String percentStr;
        int progressVal;

        if (totalCount == 0) {
            headline = "امروز کاری نداری";
            sub = "برای شروع لمس کن ✍️";
            progressVal = 0;
            percentStr = "۰٪";
        } else if (pendingCount == 0) {
            headline = "همه کارها انجام شد! ✨";
            sub = "خسته نباشی، عالی بود";
            progressVal = 100;
            percentStr = "۱۰۰٪";
        } else {
            headline = pendingCount + " کار باقی‌مانده";
            sub = "از " + totalCount + " کار امروز (" + completedCount + " انجام شده)";
            progressVal = progressPercent;
            percentStr = progressPercent + "٪";
        }

        views.setImageViewBitmap(
                R.id.widget_small_headline_img,
                FontBitmapHelper.renderText(context, headline, 12f, Color.parseColor("#F4EFE6"), 700, 500, false)
        );

        views.setImageViewBitmap(
                R.id.widget_small_sub_img,
                FontBitmapHelper.renderText(context, sub, 9.5f, Color.parseColor("#C0B8AA"), 500, 500, false)
        );

        views.setImageViewBitmap(
                R.id.widget_small_percent_img,
                FontBitmapHelper.renderText(context, percentStr, 10.5f, Color.parseColor("#D5B783"), 700, 150, true)
        );

        views.setProgressBar(R.id.widget_small_progress, 100, progressVal, false);

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
