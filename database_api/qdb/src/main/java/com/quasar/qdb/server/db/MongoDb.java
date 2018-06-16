package com.quasar.qdb.server.db;

import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.*;
import org.apache.log4j.LogManager;
import org.bson.Document;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;

public final
class MongoDb
{
  public static final UpdateOptions upsertAndByPass =
    new UpdateOptions().upsert(true).bypassDocumentValidation(true);

  public final static Logger log = LoggerFactory.getLogger(MongoDb.class);
  private static final IndexOptions uniqueIndex = new IndexOptions().unique(true);

  private final MongoClient $mongoClient =
    new MongoClient(new MongoClientURI("mongodb://localhost:27017"));
  private final MongoDatabase $db = $mongoClient.getDatabase("sfs");
  private final MongoCollection<Document> $beacons = $db.getCollection("beacons");
  private final MongoCollection<Document> $customers = $db.getCollection("customers");
  private final MongoCollection<Document> $devices = $db.getCollection("devices");
  private final MongoCollection<Document> $sfsProfile = $db.getCollection("sfs_profile");
  private final MongoCollection<Document> $roles = $db.getCollection("roles");
  private final MongoCollection<Document> $users = $db.getCollection("users");
  private final MongoCollection<Document> $profiles = $db.getCollection("profiles");

  MongoDb() throws IOException
  {
    $beacons.createIndex(Indexes.ascending("customer_id", "uuid", "major", "minor"), uniqueIndex);
    $devices.createIndex(Indexes.ascending("customer_id", "_id"), uniqueIndex);
    $users.createIndex(Indexes.ascending("customer_id", "login_name"), uniqueIndex);
    $profiles.createIndex(Indexes.ascending("customer_id", "name"), uniqueIndex);
    $roles.createIndex(Indexes.ascending("customer_id", "name"), uniqueIndex);
    if ($sfsProfile.count() == 0)
    {
      log.warn(()->"SFS profile does not exist. A default one will be created.");
      try (final InputStream defaultConfig = Main.class.getResourceAsStream("/config.json");
           final Scanner scanner = new Scanner(defaultConfig, "UTF-8").useDelimiter("\\A"))
      {
        $sfsProfile.insertOne(Document.parse(scanner.next()));
      }
    }
  }

  public Collection<User> getAllUsers(final Customer customer)
  {
    final Collection<User> result = new HashSet<>(1024);
    for (final Document document : $users.find())
    {
      result.add(new User(customer, document));
    }
    return result;
  }

  MongoCollection<Document> getCustomers()
  {
    return $customers;
  }

  MongoCollection<Document> getDevices()
  {
    return $devices;
  }

  public Optional<Profile> getProfile(final Customer customer,
                                      final String profileName)
  {
    final Document document = $profiles.find(Filters.and(Filters.eq("customer_id", customer.getId())
      , Filters.eq("name", profileName))).first();
    return (document == null) ? Optional.empty() : Optional.of(new Profile(document));
  }

  MongoCollection<Document> getRoles()
  {
    return $roles;
  }

  public String getServerProfile()
  {
    return $sfsProfile.find().first().toJson();
  }

  MongoCollection<Document> getUsers()
  {
    return $users;
  }

  public
  int populate(final JSONObject data)
  {
    final JSONArray users = (JSONArray)data.opt("users");
    final ArrayList<Document> rows = new ArrayList<>(users.length());
    for (final Object customer : (Iterable)data.opt("customers"))
    {
      final int customerId = ((JSONObject)customer).getInt("_id");
      $devices.deleteMany(Filters.eq("customer_id", customerId));
      rows.clear();
      ((Iterable<JSONObject>)data.opt("beacons")).forEach(beacon->
      {
        if (beacon.getInt("customer_id") == customerId)
        {
          rows.add(Document.parse(beacon.toString()));
        }
      });
      $beacons.deleteMany(Filters.eq("customer_id", customerId));
      if (!rows.isEmpty())
      {
        $beacons.insertMany(rows);
      }
      rows.clear();
      users.forEach(user->
      {
        if (((JSONObject)user).getInt("customer_id") == customerId)
        {
          rows.add(Document.parse(user.toString()));
        }
      });
      $users.deleteMany(Filters.eq("customer_id", customerId));
      if (!rows.isEmpty())
      {
        $users.insertMany(rows);
      }
      rows.clear();
      ((Iterable<JSONObject>)data.opt("profiles")).forEach(profile->
      {
        if (profile.getInt("customer_id") == customerId)
        {
          rows.add(Document.parse(profile.toString()));
        }
      });
      $profiles.deleteMany(Filters.eq("customer_id", customerId));
      if (!rows.isEmpty())
      {
        $profiles.insertMany(rows);
      }
      rows.clear();
      ((Iterable<JSONObject>)data.opt("roles")).forEach(role->
      {
        if (role.getInt("customer_id") == customerId)
        {
          rows.add(Document.parse(role.toString()));
        }
      });
      $roles.deleteMany(Filters.eq("customer_id", customerId));
      if (!rows.isEmpty())
      {
        $roles.insertMany(rows);
      }
      $customers.deleteOne(Filters.eq("_id", customerId));
      $customers.insertOne(Document.parse(customer.toString()));
      log.debug(()->"Loaded " + rows.size() + " users.");
    }
    return users.length();
  }

  @Override
  public String toString()
  {
    return $mongoClient.getMongoClientOptions().toString();
  }

  public
  void updateDeviceGpsLocation(final Customer customer,
                               final String deviceId,
                               final JSONObject gpsLocation)
  {
    $devices.updateOne(Filters.eq("_id", deviceId), Updates.set("gps_location", new Document
      (gpsLocation.toMap())));
  }

  public
  void updateDeviceLocation(final Customer customer,
                            final String deviceId,
                            final JSONObject closestBeacon)
  {
    final Document beacon =
      $beacons.find(Filters.and(Filters.eq("customer_id", customer.getId()),
        Filters.eq("uuid", closestBeacon.getString("uuid")),
        Filters.eq("major", closestBeacon.getInt("major")),
        Filters.eq("minor", closestBeacon.getInt("minor")))).first();
    if (beacon == null)
    {
      log.error(()->"Beacon not found for object " + closestBeacon.toString(2));
    }
    else
    {
      $devices.updateOne(Filters.eq("_id", deviceId),
        Updates.set("ble_location", new Document(closestBeacon.put("location", new JSONObject
          (beacon.get("location", Document.class).toJson())).toMap())));
    }
  }
}
