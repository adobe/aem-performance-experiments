/*
   Copyright 2020 Adobe

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
package com.clotton.core.models;

import org.apache.commons.httpclient.Header;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;

import javax.inject.Inject;
import java.io.IOException;

@Model(adaptables = Resource.class)
public class SessionWriterComponentModel {
    @Inject
    private String user;

    @Inject
    private String pword;

    private static final String PROTOCOL = "http";
    private static final int PORT = 4502;
    private static final String HOST = "localhost";
    private static final String COOKIE_NAME = "login-token";

    public String getData() throws IOException {
        HttpClient client = new HttpClient();
        String token = null;

        /*
         * NOTE!!!
         * This method does not use property security standards - it is fine for it purpose (a quick method of
         * testing session writes) but should not necessarily ever be used in a real product, or left installed
         * on a non-testing machine after the testing is complete.
         * Please uninstall the bundle using proper methods.
         */

        PostMethod authRequest = new PostMethod(String.format("%s://%s:%s/j_security_check", PROTOCOL, HOST, PORT));
        authRequest.setParameter("j_username", user);
        authRequest.setParameter("j_password", pword);
        authRequest.setParameter("j_validate", "true");

        int status = client.executeMethod(authRequest);
        if (status == 200) {
            Header[] headers = authRequest.getResponseHeaders("Set-Cookie");
            for (Header header : headers) {
                String value = header.getValue();
                if (value.startsWith(COOKIE_NAME + "=")) {
                    int endIdx = value.indexOf(';');
                    if (endIdx > 0) {
                        token = value.substring(COOKIE_NAME.length() + 1, endIdx);
                    }
                }
            }
        } else {
            System.err
                    .println("Unexcepted response code " + status + "; msg: " + authRequest.getResponseBodyAsString());
        }
        return token;
    }
}

