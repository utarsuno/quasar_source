package com.quasar.qdb.server.dbserver;

import com.quasar.qdb.server.db.MongoDb;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

public class Main {

    public final static Logger log = LoggerFactory.getLogger(Main.class);

    static MongoDb db;

    public static void main(String[] args) {

        try {
            db = new MongoDb();
        } catch (IOException e) {
            log.error("failed to connect mongo", e);
            System.exit(-1);
        }

        QuasarDatabaseServer quasar_db = new QuasarDatabaseServer();
    }

}