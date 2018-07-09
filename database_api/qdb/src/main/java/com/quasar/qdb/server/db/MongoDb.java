package com.quasar.qdb.server.db;

import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.*;
import com.quasar.qdb.server.dbserver.DBInterface;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.or;
import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Updates.combine;
import static com.mongodb.client.model.Updates.set;

public final
class MongoDb implements DBInterface
{
  public static final UpdateOptions upsertAndByPass =
    new UpdateOptions().upsert(true).bypassDocumentValidation(true);

  public final static Logger log = LoggerFactory.getLogger(MongoDb.class);
  private static final IndexOptions uniqueIndex = new IndexOptions().unique(true);

  private final MongoClient $mongoClient =
    new MongoClient(new MongoClientURI("mongodb://localhost:27017"));
  private final MongoDatabase db = $mongoClient.getDatabase("quasar");

  private final MongoCollection<Document> users = db.getCollection("users");
  private final MongoCollection<Document> entities = db.getCollection("entities");

  private final MongoCollection<Document> groups = db.getCollection("groups");

  public MongoDb() throws IOException
  {
      users.createIndex(Indexes.ascending("username"), uniqueIndex);
      users.createIndex(Indexes.ascending("email"), uniqueIndex);
  }

  MongoCollection<Document> getGroups()
  {
    return groups;
  }

  MongoCollection<Document> getEntities()
  {
    return entities;
  }

  MongoCollection<Document> getUsers()
  {
    return users;
  }

  @Override
  public String toString()
  {
    return $mongoClient.getMongoClientOptions().toString();
  }

    @Override
    public boolean world_operation_create(String username, String world_name) {
        Document doc = new Document("owner", username)
                .append("world_name", world_name);

        log.info("world_operation_create: " + doc.toJson());

        try {
            entities.insertOne(doc);
            return true;
        } catch (Exception e) {
            log.error("world_operation_create " + username, e);
            return false;
        }
    }

    @Override
    public boolean world_operation_add_user(String owner_username, String world_name, String user_to_add) {

        try {

            final Document user = users.find( eq("username", user_to_add)).first();
            if( user == null ) {
                return false;
            }

            final Document entity = entities.find( and(
                    eq("owner", owner_username),
                    eq("world_name", world_name))).first();

            if( entity == null ) {
                return false;
            }


            List<String> worlds = (List<String>) user.get("entities");
            if( worlds == null ) {
                worlds = new ArrayList<>(worlds);
            }

            worlds.add(entity.getObjectId(entity).toString());

            user.put("entities", worlds);


            FindOneAndUpdateOptions findOptions = new FindOneAndUpdateOptions();
            findOptions.upsert(true);
            findOptions.returnDocument(ReturnDocument.AFTER);

            Bson update = combine( set("entities", worlds) );

            users.findOneAndUpdate(eq("username", user_to_add), update, findOptions);

            return true;

        } catch (Exception e) {
            log.error("world_operation_add_user " + owner_username, e);
            return false;
        }

    }

    @Override
    public boolean world_operation_remove_user(String owner_username, String world_name, String user_to_remove) {
        return false;
    }

    @Override
    public boolean world_operation_set_user_role(String owner_username, String world_name, String user_to_modify, WorldMemberRole role_to_set) {
        return false;
    }

    @Override
    public boolean world_operation_set_share_state(String owner_username, String world_name, WorldShareState world_state) {
        return false;
    }

    @Override
    public WorldShareState world_operation_get_share_state(String owner_username, String world_name) {
        return null;
    }

    @Override
    public boolean is_username_taken(String username) {
        try {
            return users.find( eq("username", username)).first() != null;
        } catch (Exception e) {
            log.error("is_username_taken " + username, e);
            return false;
        }
    }

    @Override
    public boolean is_email_taken(String email) {
        try {
            return users.find( eq("email", email)).first() != null;
        } catch (Exception e) {
            log.error("is_email_taken " + email, e);
            return false;
        }
    }

    @Override
    public boolean is_login_valid(String username_or_email, String password) {
        final Document user = users.find( or(
                eq("username", username_or_email),
                eq("email", username_or_email))).first();

        try {
            return user != null && user.getString("password").equals(password);
        } catch (Exception e) {
            log.error("is_login_valid " + username_or_email, e);
            return false;
        }
    }

    @Override
    public boolean create_account(String username, String email, String password) {

        Document doc = new Document("username", username)
                .append("email", email)
                .append("password", password);

        log.info("create_account: " + doc.toJson());

        try {
            users.insertOne(doc);
            return true;
        } catch (Exception e) {
            log.error("create_account " + username, e);
            return false;
        }
    }

    @Override
    public boolean delete_account(String username) {
        try {
            return users.deleteOne(eq("username", username))
                    .getDeletedCount() > 0;
        } catch (Exception e) {
            log.error("delete_account " + username, e);
            return false;
        }

    }

}
