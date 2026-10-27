package com.tedlist.app;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Typeface;
import android.text.Layout;
import android.text.StaticLayout;
import android.text.TextPaint;
import androidx.core.content.res.ResourcesCompat;

public class FontBitmapHelper {

    private static Typeface sRegular;
    private static Typeface sMedium;
    private static Typeface sBold;

    public static synchronized Typeface getShabnam(Context context, int weight) {
        try {
            if (weight >= 700) {
                if (sBold == null) {
                    sBold = ResourcesCompat.getFont(context, R.font.shabnam_bold);
                }
                return sBold != null ? sBold : Typeface.DEFAULT_BOLD;
            } else if (weight >= 500) {
                if (sMedium == null) {
                    sMedium = ResourcesCompat.getFont(context, R.font.shabnam_medium);
                }
                return sMedium != null ? sMedium : Typeface.DEFAULT;
            } else {
                if (sRegular == null) {
                    sRegular = ResourcesCompat.getFont(context, R.font.shabnam);
                }
                return sRegular != null ? sRegular : Typeface.DEFAULT;
            }
        } catch (Exception e) {
            return weight >= 700 ? Typeface.DEFAULT_BOLD : Typeface.DEFAULT;
        }
    }

    public static String toPersianDigits(String text) {
        if (text == null) return "";
        char[] faDigits = {'۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'};
        StringBuilder sb = new StringBuilder();
        for (char c : text.toCharArray()) {
            if (c >= '0' && c <= '9') {
                sb.append(faDigits[c - '0']);
            } else {
                sb.append(c);
            }
        }
        return sb.toString();
    }

    public static Bitmap renderText(
            Context context,
            String text,
            float textSizeSp,
            int textColor,
            int weight,
            int maxWidthPx,
            boolean isCenter
    ) {
        if (text == null || text.trim().isEmpty()) {
            return Bitmap.createBitmap(1, 1, Bitmap.Config.ARGB_8888);
        }

        String persianText = toPersianDigits(text);
        TextPaint paint = new TextPaint(Paint.ANTI_ALIAS_FLAG | Paint.SUBPIXEL_TEXT_FLAG);
        paint.setTypeface(getShabnam(context, weight));
        paint.setColor(textColor);
        float scaledDensity = context.getResources().getDisplayMetrics().scaledDensity;
        paint.setTextSize(textSizeSp * scaledDensity);

        int maxPx = maxWidthPx > 0 ? maxWidthPx : (int) (350 * scaledDensity);
        float measuredWidth = paint.measureText(persianText);
        int targetWidth = Math.min((int) Math.ceil(measuredWidth) + 8, maxPx);
        if (targetWidth <= 0) targetWidth = 1;

        StaticLayout.Builder builder = StaticLayout.Builder.obtain(
                persianText,
                0,
                persianText.length(),
                paint,
                targetWidth
        )
        .setAlignment(isCenter ? Layout.Alignment.ALIGN_CENTER : Layout.Alignment.ALIGN_NORMAL)
        .setMaxLines(1)
        .setEllipsize(android.text.TextUtils.TruncateAt.END);

        StaticLayout layout = builder.build();
        int height = Math.max(layout.getHeight(), 1);

        Bitmap bitmap = Bitmap.createBitmap(targetWidth, height, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap);
        layout.draw(canvas);

        return bitmap;
    }
}
