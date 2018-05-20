package quasar_database_server;

public class FakeDB {

    public FakeDB() {}

    // TODO :
    public boolean is_username_taken(String username) {
        System.out.println("Database performed is_username_taken.");
        return false;
    }

    // TODO :
    public boolean is_email_taken(String email) {
        System.out.println("Database performed is_email_taken.");
        return false;
    }

    // TODO :
    public boolean is_login_valid(String username_or_email, String password) {
        System.out.println("Database performed is_login_valid.");
        return false;
    }


}
