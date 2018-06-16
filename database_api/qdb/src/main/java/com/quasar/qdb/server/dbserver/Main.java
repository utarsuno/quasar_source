package com.quasar.qdb.server.dbserver;

import com.quasar.qdb.server.db.MongoDb;
import com.quasar.qdb.server.log.QuasarLogger;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.logging.Level;

public class Main {

    public final static Logger log = LoggerFactory.getLogger(Main.class);

    public static void main(String[] args) {

        QuasarLogger.setConsoleLogging(true);
        java.util.logging.Logger.getGlobal().setLevel(Level.ALL);

        try {
            QuasarDatabaseServer quasar_db = new QuasarDatabaseServer();
        } catch (IOException e) {
            log.error("failed to connect mongo", e);
            System.exit(-1);
        }

    }

}