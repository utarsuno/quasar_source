package com.quasar.qdb.server.dbserver;

public interface DBInterface {

    /*___      ___   ___    ___  __
     |__  |\ |  |  |  |  | |__  /__`
     |___ | \|  |  |  |  | |___ .__/ */

    // TODO :

    /*     __   __        __   __
     |  | /  \ |__) |    |  \ /__`
     |/\| \__/ |  \ |___ |__/ .__/ */

    enum WorldShareState {
        PRIVATE, GROUP, PUBLIC;
    }

    enum WorldMemberRole {
        OWNER, MODERATOR, MEMBER_RIC, MEMBER_RI, MEMBER_R
    }

    // WORLDS WILL HAVE THE FOLLOWING FUNCTIONALITY NEEDED.

    // Each player will have 2 default, non-deleted worlds, {WORLD_HOME, WORLD_SETTINGS}
    // Players can create new worlds that are private to them by default but can be open to the public OR to a group of invited players.

    // Each world will have 3 roles. All roles can be transferred/changed.
    //      - Owner       : Full control of the world.
    //      - Moderator   : Full control of the world except for deleting it or changing player's roles.
    //      - Member(RIC) : Can view world's entities and interact with them and create them (and delete their own created entities).
    //      - Member(RI)  : Can view world's entities and interact with them.
    //      - Member(R)   : Can view world's entities.

    // Worlds can be private, invite_only, and public.

    // If it matters, username + world_name should be unique. I could take care of checking that on the server message layer.
    boolean world_operation_create(String username, String world_name);

    boolean world_operation_add_user(String owner_username, String world_name, String user_to_add);

    boolean world_operation_remove_user(String owner_username, String world_name, String user_to_remove);

    boolean world_operation_set_user_role(String owner_username, String world_name, String user_to_modify, WorldMemberRole role_to_set);

    boolean world_operation_set_share_state(String owner_username, String world_name, WorldShareState world_state);

    // TODO : create some kind of User account (to create a JSON response that has name and world_role attached.
    //User world_operation_get_all_users(String owner_username, String world_name);

    WorldShareState world_operation_get_share_state(String owner_username, String world_name);

    /*     __   __   __            ___  __
      /\  /  ` /  ` /  \ |  | |\ |  |  /__`
     /~~\ \__, \__, \__/ \__/ | \|  |  .__/ */

    boolean is_username_taken(String username);

    boolean is_email_taken(String email);

    boolean is_login_valid(String username_or_email, String password);

    boolean create_account(String username, String email, String password);

    boolean delete_account(String username);

}
