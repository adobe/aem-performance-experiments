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
package com.clotton.core.servlets;

import com.day.cq.commons.jcr.JcrConstants;
import java.io.IOException;
import java.util.Calendar;
import java.util.Map;
import java.util.Objects;
import javax.jcr.RepositoryException;
import javax.jcr.Node;
import javax.jcr.Session;
import javax.servlet.Servlet;

import com.google.common.collect.ImmutableMap;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.NonExistingResource;
import org.apache.sling.api.resource.PersistenceException;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ModifiableValueMap;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;

import org.osgi.service.component.propertytypes.ServiceDescription;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component(service = Servlet.class, property = {
        Constants.SERVICE_DESCRIPTION + "= Servlet to save many sessions changes",
        "sling.servlet.methods=" + HttpConstants.METHOD_POST, "sling.servlet.paths=" + "/bin/experiments/sessionsaver.json" })
@ServiceDescription("Session Experiment Servlet")
public class SessionSaverServlet extends SlingAllMethodsServlet {

    /**
     * Generated serialVersionUID
     */
    private static final long serialVersionUID = -3343167579746578905L;

    /**
     * Logger
     */
    private static final Logger log = LoggerFactory.getLogger(SessionSaverServlet.class);

    private static String EVERY = "every";
    private static String WRITES = "writes";
    private static String CREATENODE = "createNode";
    private static String BUCKETNAME = "bucketnode";
    private static String NODENAME = "testnode";
    private static String DELETENAME = "deleteThis";
    private static String ROOTPATH = "/content/dam/aem-session-experiments";
    private static String COPIESPATH = ROOTPATH + "/pngs/copies";

    private Resource getOrCreateResource(ResourceResolver rr, String targetPath, int id, String basename) {
        Resource target = null;
        Resource parent = rr.resolve(targetPath);
        if (parent instanceof NonExistingResource) {
            log.error("Could not create {} because parent did not exist.", targetPath);
        } else {
            target = rr.getResource(parent, basename + id);
            if (Objects.isNull(target)) {
                try {
                    Map<String, Object> props = ImmutableMap.<String, Object>builder()
                            .put(JcrConstants.JCR_PRIMARYTYPE, "sling:OrderedFolder")
                            .build();
                    target = rr.create(parent, basename + id, props);
                } catch (PersistenceException perEx) {
                    log.error("Could not create {}.  Error: {}", targetPath + "/" + basename + id, perEx.getLocalizedMessage());
                    target = null;
                }
            }
        }
        return target;
    }

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        ResourceResolver rr = request.getResourceResolver();
        StringBuilder responseBuilder = new StringBuilder();
        Session serviceSession = rr.adaptTo(Session.class);

        try {
            long start = System.nanoTime();
            // Process parameters
            int saveEvery = 1;
            String parameter = request.getParameter(EVERY);
            if (!StringUtils.isEmpty(parameter)) {
                saveEvery = Integer.parseInt(parameter);
            }
            int writes = 1000;
            parameter = request.getParameter(WRITES);
            if (!StringUtils.isEmpty(parameter)) {
                writes = Integer.parseInt(parameter);
                if (writes > 50000) {
                    writes = 50000;
                }
            }
            boolean createNode = false;
            parameter = request.getParameter(CREATENODE);
            if (!StringUtils.isEmpty(parameter)) {
                createNode = parameter.equalsIgnoreCase("true");
            }
            log.info("Running Session experiment with {} writes and a save every {} save and copy node {}.", writes,
                    saveEvery, createNode);

            // Begin response with input parameters.
            responseBuilder.append("{\"writes\":");
            responseBuilder.append(writes);
            responseBuilder.append(",\"every\":");
            responseBuilder.append(saveEvery);
            responseBuilder.append(",\"createNode\":");
            responseBuilder.append(createNode);

            Resource asset = rr.resolve(ROOTPATH + "/pngs/ase1.png");
            if (asset instanceof NonExistingResource) {
                responseBuilder.append(",\"error\": \"No assets found under ");
                responseBuilder.append(ROOTPATH);
                responseBuilder.append(". Was the content package installed?\"");
                response.setStatus(401);
            } else {
                int i;
                for (i = 0; i < writes; i++) {
                    try {
                        Resource metaData = asset.getChild(JcrConstants.JCR_CONTENT + "/metadata");
                        ModifiableValueMap modifiableValueMap = Objects.nonNull(metaData) ? metaData.adaptTo(ModifiableValueMap.class) : null;
                        if (Objects.nonNull(modifiableValueMap)) {
                            Resource metaDataParent = metaData.getParent();
                            Node nodeMain = Objects.nonNull(metaDataParent) ? metaDataParent.adaptTo(Node.class) : null;
                            if (Objects.nonNull(nodeMain)) {
                                if (i == 0) {
                                    nodeMain.setProperty("experiment_ran", Calendar.getInstance());
                                }
                                if (createNode) {
                                    // Create or get the folder to later delete.
                                    Resource deleteParent = getOrCreateResource(rr, COPIESPATH, 0, DELETENAME);
                                    if (Objects.nonNull(deleteParent)) {
                                        // Create or get the bucket.
                                        Resource bucketParent = getOrCreateResource(rr, deleteParent.getPath(), i % 10, BUCKETNAME);
                                        if (Objects.nonNull(bucketParent)) {
                                            getOrCreateResource(rr, bucketParent.getPath(), i, NODENAME);
                                        }
                                    }
                                } else {
                                    nodeMain.setProperty("experiment_count", i);
                                }
                            }
                        }
                    } catch (RepositoryException ex) {
                        log.error("Big exception during write: {}  Loop: {}", asset.getPath(), i);
                    }

                    if (saveEvery > 0 && i % saveEvery == 0) {
                        try {
                            serviceSession.save();
                        } catch (RepositoryException ex) {
                            log.error("Could not save to resource {}.", asset.getPath());
                        }
                    }
                }

                // Do a final save if it is the first one, or if there are writes not yet saved.
                if (saveEvery == 0 || i % saveEvery != 0) {
                    try {
                        serviceSession.save();
                    } catch (RepositoryException ex) {
                        log.error("Could not save the resource under {}.", ROOTPATH);
                    }
                }

                long duration = System.nanoTime() - start;

                responseBuilder.append(",\"duration\":");
                responseBuilder.append(duration / 1000000L);
                response.setStatus(200);
            }
            responseBuilder.append("}");

        } catch (Exception ex) {
            responseBuilder.append(",\"error\": \"");
            responseBuilder.append(ex.getLocalizedMessage());
            responseBuilder.append("\"");
            log.error("Big exception during write: {}", ex.getLocalizedMessage());
            response.setStatus(500);
        } finally {
            Resource deleteParent = rr.getResource(COPIESPATH + "/" + DELETENAME + "0");
            if (Objects.nonNull(deleteParent)) {
                try {
                    rr.delete(deleteParent);
                    serviceSession.save();
                } catch (Exception ex) {
                    log.error("Could not clean up after Session Write Test.  {} still exists. Error: {}",
                            deleteParent.getPath(), ex.getLocalizedMessage());
                }
            }
        }

        String responseString = responseBuilder.toString();
        response.setContentLength(responseString.length());
        response.setContentType("application/json");
        response.getWriter().println(responseString);
    }
}