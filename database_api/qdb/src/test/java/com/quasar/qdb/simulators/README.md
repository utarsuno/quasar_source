Last time setting up the environment appeared very brittle.

- Start a few services at a time.

docker-compose up -d --build mongodb kafka

- Start sample listeners to verify topics exist.

kafkacat -C -b localhost:9092 -t dfsactions
kafkacat -C -b localhost:9092 -t loginUpdates

- Send sample message with kafkacat. Verify it is published.

kafkacat -P -b 0.0.0.0:9092 -t dfsactions src/test/resources/auth/rme-login-basic.json

- Now do start this service.

docker-compose up -d --build mongodb kafka action-handler-sfs

- Run simulators.