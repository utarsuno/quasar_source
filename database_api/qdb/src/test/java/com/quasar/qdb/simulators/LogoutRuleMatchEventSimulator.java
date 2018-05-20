package com.quasar.qdb.simulators;

import java.io.IOException;

/**
 * Simulates a logout RuleMatchEvent
 * Verify results in `logoutUpdates` topic
 */
public class LogoutRuleMatchEventSimulator extends BaseSimulator {

    public final static String DFSACTIONS = "dfsactions";

    public static void main(String[] args) throws Exception {
        new LogoutRuleMatchEventSimulator().start();
    }

    public void start() throws IOException {
        sendMessage(DFSACTIONS, getContents("src/test/resources/auth/rme-logout.json"));
    }


}
