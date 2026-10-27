package com.tedlist.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.view.View;
import android.widget.RemoteViews;

public class TedlistWidgetLarge extends AppWidgetProvider {

    public static final String PREFS_NAME = "tedlist_widget_prefs";

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        int pendingCount = prefs.getInt("pending_count", 0);
        int totalCount = prefs.getInt("total_count", 0);
        int completedCount = prefs.getInt("completed_count", 0);
        int progressPercent = prefs.getInt("progress_percent", 100);

        String task1 = prefs.getString("task_1_title", "");
        String task2 = prefs.getString("task_2_title", "");
        String task3 = prefs.getString("task_3_title", "");

        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_large);

        // Intent to launch app on root click
        Intent intent = new Intent(context, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(
                context,
                101,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        views.setOnClickPendingIntent(R.id.widget_large_root, pendingIntent);

        // Intent for add task button
        Intent addIntent = new Intent(context, MainActivity.class);
        addIntent.putExtra("action", "create");
        PendingIntent addPendingIntent = PendingIntent.getActivity(
                context,
                102,
                addIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        views.setOnClickPendingIntent(R.id.widget_large_add_btn, addPendingIntent);

        int[] segIds = {
            R.id.widget_seg_1, R.id.widget_seg_2, R.id.widget_seg_3, R.id.widget_seg_4, R.id.widget_seg_5,
            R.id.widget_seg_6, R.id.widget_seg_7, R.id.widget_seg_8, R.id.widget_seg_9, R.id.widget_seg_10
        };

        if (totalCount == 0) {
            views.setTextViewText(R.id.widget_large_headline, "کاری اضافه نکردی");
            views.setTextViewText(R.id.widget_large_sub, "امروز برنامه‌ای ثبت نشده");

            // All segments inactive
            for (int segId : segIds) {
                views.setImageViewResource(segId, R.drawable.widget_segment_inactive);
            }

            views.setViewVisibility(R.id.widget_large_tasks_container, View.GONE);
            views.setViewVisibility(R.id.widget_large_empty, View.VISIBLE);
            views.setTextViewText(R.id.widget_large_empty, "امروز کاری اضافه نکردی! با دکمه + شروع کن ✨");
        } else if (pendingCount == 0) {
            views.setTextViewText(R.id.widget_large_headline, "همه کارها تموم شد!");
            views.setTextViewText(R.id.widget_large_sub, "همه تیک خوردن ✨");

            // All segments active
            for (int segId : segIds) {
                views.setImageViewResource(segId, R.drawable.widget_segment_active);
            }

            views.setViewVisibility(R.id.widget_large_tasks_container, View.GONE);
            views.setViewVisibility(R.id.widget_large_empty, View.VISIBLE);
            views.setTextViewText(R.id.widget_large_empty, "همه کارهای امروز تمام شد! خسته نباشی ✨");
        } else {
            views.setTextViewText(R.id.widget_large_headline, "روزت رو مرتب کن");
            views.setTextViewText(R.id.widget_large_sub, pendingCount + " کار باقی‌مانده");

            // Segments active based on progress (fills RTL from right to left)
            int activeSegments = Math.round((progressPercent / 100f) * 10f);
            for (int i = 0; i < 10; i++) {
                boolean isFilled = (9 - i) < activeSegments;
                views.setImageViewResource(
                    segIds[i],
                    isFilled ? R.drawable.widget_segment_active : R.drawable.widget_segment_inactive
                );
            }

            views.setViewVisibility(R.id.widget_large_empty, View.GONE);
            views.setViewVisibility(R.id.widget_large_tasks_container, View.VISIBLE);

            // Task 1
            if (!task1.isEmpty()) {
                views.setViewVisibility(R.id.widget_task_1, View.VISIBLE);
                views.setTextViewText(R.id.widget_task_1_title, task1);
            } else {
                views.setViewVisibility(R.id.widget_task_1, View.GONE);
            }

            // Task 2
            if (!task2.isEmpty()) {
                views.setViewVisibility(R.id.widget_task_2, View.VISIBLE);
                views.setTextViewText(R.id.widget_task_2_title, task2);
            } else {
                views.setViewVisibility(R.id.widget_task_2, View.GONE);
            }

            // Task 3
            if (!task3.isEmpty()) {
                views.setViewVisibility(R.id.widget_task_3, View.VISIBLE);
                views.setTextViewText(R.id.widget_task_3_title, task3);
            } else {
                views.setViewVisibility(R.id.widget_task_3, View.GONE);
            }
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
        ComponentName thisWidget = new ComponentName(context, TedlistWidgetLarge.class);
        int[] appWidgetIds = appWidgetManager.getAppWidgetIds(thisWidget);
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }
}
