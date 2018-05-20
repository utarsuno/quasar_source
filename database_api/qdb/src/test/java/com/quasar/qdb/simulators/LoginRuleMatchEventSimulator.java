package com.quasar.qdb.simulators;

import java.io.IOException;

/**
 * Simulates a login RuleMatchEvent
 * Verify results in `loginUpdates` topic
 */
public class LoginRuleMatchEventSimulator extends BaseSimulator {

    public final static String DFSACTIONS = "dfsactions";

    public static void main(String[] args) throws Exception {
        new LoginRuleMatchEventSimulator().start();
    }

    public void start() throws IOException {
        // WARNING: THIS ASSUMES A FLAT TRIGGERING FACT STRUCTURE, UNLIKE WHAT IS SENT BY DFS
        // This relies on debug code in UseLoginTask that should be commented out in production.
        sendMessage(DFSACTIONS, getContents("src/test/resources/auth/rme-login-basic.json"));
    }


}
