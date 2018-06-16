package com.quasar.qdb.server.dbserver;

public interface DBInterface {

    boolean is_username_taken(String username);

    boolean is_email_taken(String email);

    boolean is_login_valid(String username_or_email, String password);

    boolean create_account(String username, String email, String password);

    boolean delete_account(String username);

}
