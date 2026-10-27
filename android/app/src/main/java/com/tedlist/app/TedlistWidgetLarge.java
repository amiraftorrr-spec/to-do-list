package com.tedlist.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
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
        String dateLabel = prefs.getString("date_label", "");

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

        // Intent for add task action
        Intent addIntent = new Intent(context, MainActivity.class);
        addIntent.putExtra("action", "create");
        PendingIntent addPendingIntent = PendingIntent.getActivity(
                context,
                102,
                addIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        views.setOnClickPendingIntent(R.id.widget_large_add_btn, addPendingIntent);
        views.setOnClickPendingIntent(R.id.widget_task_add_next, addPendingIntent);
        views.setOnClickPendingIntent(R.id.widget_large_empty_container, addPendingIntent);

        // Header Title in Shabnam-Bold
        views.setImageViewBitmap(
                R.id.widget_large_headline_img,
                FontBitmapHelper.renderText(context, "تدلیست • کارهای امروز", 11.5f, Color.parseColor("#F4EFE6"), 700, 320, false)
        );

        int[] segIds = {
            R.id.widget_seg_1, R.id.widget_seg_2, R.id.widget_seg_3, R.id.widget_seg_4, R.id.widget_seg_5,
            R.id.widget_seg_6, R.id.widget_seg_7, R.id.widget_seg_8, R.id.widget_seg_9, R.id.widget_seg_10
        };

        if (totalCount == 0) {
            // Case 1: No tasks registered for today
            views.setImageViewBitmap(
                    R.id.widget_large_sub_img,
                    FontBitmapHelper.renderText(context, "امروز برنامه‌ای ثبت نشده", 9.5f, Color.parseColor("#C0B8AA"), 500, 300, false)
            );

            views.setImageViewBitmap(
                    R.id.widget_large_percent_img,
                    FontBitmapHelper.renderText(context, "۰٪", 10.5f, Color.parseColor("#D5B783"), 700, 150, true)
            );

            for (int segId : segIds) {
                views.setImageViewResource(segId, R.drawable.widget_segment_inactive);
            }

            views.setViewVisibility(R.id.widget_large_tasks_container, View.GONE);
            views.setViewVisibility(R.id.widget_large_empty_container, View.VISIBLE);
            views.setImageViewResource(R.id.widget_large_empty_icon, R.drawable.ic_widget_sparkle);

            views.setImageViewBitmap(
                    R.id.widget_large_empty_title_img,
                    FontBitmapHelper.renderText(context, "امروز کاری اضافه نکردی", 12f, Color.parseColor("#F4EFE6"), 700, 350, true)
            );
            views.setImageViewBitmap(
                    R.id.widget_large_empty_sub_img,
                    FontBitmapHelper.renderText(context, "برای برنامه‌ریزی امروز دکمه + رو لمس کن ✨", 10f, Color.parseColor("#C0B8AA"), 500, 350, true)
            );

        } else if (pendingCount == 0) {
            // Case 2: All tasks completed
            views.setImageViewBitmap(
                    R.id.widget_large_sub_img,
                    FontBitmapHelper.renderText(context, "همه کارهای امروز انجام شد ✨", 9.5f, Color.parseColor("#C0B8AA"), 500, 300, false)
            );

            views.setImageViewBitmap(
                    R.id.widget_large_percent_img,
                    FontBitmapHelper.renderText(context, "۱۰۰٪", 10.5f, Color.parseColor("#D5B783"), 700, 150, true)
            );

            for (int segId : segIds) {
                views.setImageViewResource(segId, R.drawable.widget_segment_active);
            }

            views.setViewVisibility(R.id.widget_large_tasks_container, View.GONE);
            views.setViewVisibility(R.id.widget_large_empty_container, View.VISIBLE);
            views.setImageViewResource(R.id.widget_large_empty_icon, R.drawable.ic_widget_check_circle);

            views.setImageViewBitmap(
                    R.id.widget_large_empty_title_img,
                    FontBitmapHelper.renderText(context, "همه کارهای امروز تمام شد! 🎉", 12f, Color.parseColor("#F4EFE6"), 700, 350, true)
            );
            views.setImageViewBitmap(
                    R.id.widget_large_empty_sub_img,
                    FontBitmapHelper.renderText(context, "آفرین! همه اهداف امروز تیک خوردن ✨", 10f, Color.parseColor("#C0B8AA"), 500, 350, true)
            );

        } else {
            // Case 3: Tasks pending
            String subText;
            if (!dateLabel.isEmpty()) {
                subText = completedCount + " از " + totalCount + " انجام شده • " + pendingCount + " مانده";
            } else {
                subText = completedCount + " از " + totalCount + " انجام شده (" + pendingCount + " باقی‌مانده)";
            }

            views.setImageViewBitmap(
                    R.id.widget_large_sub_img,
                    FontBitmapHelper.renderText(context, subText, 9.5f, Color.parseColor("#C0B8AA"), 500, 320, false)
            );

            views.setImageViewBitmap(
                    R.id.widget_large_percent_img,
                    FontBitmapHelper.renderText(context, progressPercent + "٪", 10.5f, Color.parseColor("#D5B783"), 700, 150, true)
            );

            // Segments active based on progress (fills RTL from right to left)
            int activeSegments = Math.round((progressPercent / 100f) * 10f);
            for (int i = 0; i < 10; i++) {
                boolean isFilled = (9 - i) < activeSegments;
                views.setImageViewResource(
                    segIds[i],
                    isFilled ? R.drawable.widget_segment_active : R.drawable.widget_segment_inactive
                );
            }

            views.setViewVisibility(R.id.widget_large_empty_container, View.GONE);
            views.setViewVisibility(R.id.widget_large_tasks_container, View.VISIBLE);

            int visibleTaskCount = 0;

            // Task 1
            if (!task1.isEmpty()) {
                visibleTaskCount++;
                views.setViewVisibility(R.id.widget_task_1, View.VISIBLE);
                views.setImageViewBitmap(
                        R.id.widget_task_1_title_img,
                        FontBitmapHelper.renderText(context, task1, 11.5f, Color.parseColor("#F4EFE6"), 500, 400, false)
                );
            } else {
                views.setViewVisibility(R.id.widget_task_1, View.GONE);
            }

            // Task 2
            if (!task2.isEmpty()) {
                visibleTaskCount++;
                views.setViewVisibility(R.id.widget_task_2, View.VISIBLE);
                views.setImageViewBitmap(
                        R.id.widget_task_2_title_img,
                        FontBitmapHelper.renderText(context, task2, 11.5f, Color.parseColor("#F4EFE6"), 500, 400, false)
                );
            } else {
                views.setViewVisibility(R.id.widget_task_2, View.GONE);
            }

            // Task 3
            if (!task3.isEmpty()) {
                visibleTaskCount++;
                views.setViewVisibility(R.id.widget_task_3, View.VISIBLE);
                views.setImageViewBitmap(
                        R.id.widget_task_3_title_img,
                        FontBitmapHelper.renderText(context, task3, 11.5f, Color.parseColor("#F4EFE6"), 500, 400, false)
                );
            } else {
                views.setViewVisibility(R.id.widget_task_3, View.GONE);
            }

            // If fewer than 3 tasks exist, show the interactive "Add next task..." slot
            if (visibleTaskCount < 3) {
                views.setViewVisibility(R.id.widget_task_add_next, View.VISIBLE);
                views.setImageViewBitmap(
                        R.id.widget_task_add_next_title_img,
                        FontBitmapHelper.renderText(context, "افزودن کار بعدی...", 10.5f, Color.parseColor("#8E877B"), 500, 250, false)
                );
            } else {
                views.setViewVisibility(R.id.widget_task_add_next, View.GONE);
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
