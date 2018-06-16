package com.quasar.qdb.server.log;

import java.io.IOException;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Locale;
import java.util.logging.*;

public class QuasarLogger {

    static {

        Arrays.stream(Logger.getLogger("").getHandlers()).forEach(h -> Logger.getLogger("").removeHandler(h));
        Logger.getLogger("").setUseParentHandlers(true);

    }

    public static Formatter myf = new Formatter() {
        final Calendar _calendar = Calendar.getInstance();
        @Override
        public String format(LogRecord logRecord) {
            _calendar.setTimeInMillis(logRecord.getMillis());
            return String.format(Locale.ENGLISH, "%04d-%02d-%02d %02d:%02d:%02d.%03d %3d %-7s %-7s | %s\n",
                    _calendar.get(Calendar.YEAR), _calendar.get(Calendar.MONTH) + 1, _calendar.get(Calendar.DAY_OF_MONTH),
                    _calendar.get(Calendar.HOUR_OF_DAY), _calendar.get(Calendar.MINUTE), _calendar.get(Calendar.SECOND), _calendar.get(Calendar.MILLISECOND),
                    logRecord.getThreadID(),
                    logRecord.getLevel().getName(),
                    logRecord.getLoggerName(), logRecord.getMessage());
        }
    };

    static Handler consoleHandler = new Handler() {
        @Override
        public void publish(LogRecord record) {

            if( record.getLevel() == Level.SEVERE || record.getLevel() == Level.WARNING ) {
                System.err.print( getFormatter().format(record) );
                if( record.getThrown() != null )
                    record.getThrown().printStackTrace();
            } else {
                System.out.print( getFormatter().format(record) );
            }
        }

        @Override
        public boolean equals(Object obj) {
            return super.equals(obj);
        }

        @Override
        public void flush() {

        }

        @Override
        public void close() throws SecurityException {

        }
    };


    public static void setConsoleLogging(boolean enabled) {

        if( enabled ) {
            consoleHandler.setFormatter(myf);
            Logger.getLogger("").addHandler(consoleHandler);
        } else {
            Logger.getLogger("").removeHandler(consoleHandler);
        }
    }

    static FileHandler fh;

    public static void setFileLogging(String logsHome, boolean enabled) {

        if( fh == null ) {
            try {
                fh = new FileHandler(logsHome + "/iwg%g.log", 20240000, 10);
                fh.setFormatter(myf);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        if( fh != null ) {
            if (enabled) {
                Logger.getLogger("").addHandler(fh);
            } else
                Logger.getLogger("").removeHandler(fh);
        }
    }

}
