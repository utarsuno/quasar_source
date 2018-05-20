package com.quasar.qdb.util;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class DateUtil {

    /**
     * Generates a ISO-8601 string representing the current time.
     * @return
     */
    public static String currentDateStr() {
        ZonedDateTime now = ZonedDateTime.now(ZoneId.of("UTC"));
        String pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
        return DateTimeFormatter.ofPattern(pattern).format(now);
    }
}
