package com.quasar.qdb.server.dbserver;

public class FakeDB {

    public FakeDB() {}

    // TODO :
    public boolean is_username_taken(String username) {
        return false;
    }

    // TODO :
    public boolean is_email_taken(String email) {
        return false;
    }

    // TODO :
    public boolean is_login_valid(String username_or_email, String password) {
        return false;
    }

    // TODO :
    public void create_account(String username, String email, String password) {
    }

    // TODO :
    public void delete_account(String username) {
    }

}
