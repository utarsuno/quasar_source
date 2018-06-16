package com.quasar.qdb.server.db;

import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.*;
import com.quasar.qdb.server.dbserver.DBInterface;
import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.or;

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
