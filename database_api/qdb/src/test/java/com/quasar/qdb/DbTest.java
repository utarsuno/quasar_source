package com.quasar.qdb;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.quasar.qdb.server.db.MongoDb;
import com.quasar.qdb.server.dbserver.DBInterface;
import com.quasar.qdb.server.log.QuasarLogger;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.net.ssl.HttpsURLConnection;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.stream.IntStream;

public class DbTest {

    public final static Logger log = LoggerFactory.getLogger(DbTest.class);

    //ProSharedService userService = new ProSharedService(log, "/User.php");

    DBInterface db;

    @Before
    public void setupDb() throws IOException {

        QuasarLogger.setConsoleLogging(true);
        java.util.logging.Logger.getGlobal().setLevel(Level.ALL);


        db = new MongoDb();
    }

    @Test
    public void testAddUser() {
        assert( db.create_account("user1s123qw23", "emai1212s3w23l@sample.com", "pwd") );
    }

    @Test
    public void testCRUDUser() {
        String username = "user123521";
        String email = "email123521@sample.com";

        assert( db.create_account(username, email, "pwd") );

        assert( db.is_email_taken(email) );

        assert( db.is_login_valid(email, "pwd") );

        assert( db.is_login_valid(username, "pwd") );

        assert( db.is_username_taken(username) );

        assert( db.delete_account(username) );
    }


}
