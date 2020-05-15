package com.rota.auth;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rota.api.StaffService;
import com.rota.database.orm.staff.Role;
import com.rota.database.orm.staff.Staff;
import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

/**
 * Utils for handling authorisation tokens and general authentication related methods.
 */
@Service
public class Authentication {

  @Autowired
  StaffService staffService;

  /**
   * Gets the user email included with Auth0 access token via a custom claim.
   * TODO we may want to check if the email is verified in the future
   *
   * @return the users email address.
   */
  public String getEmailFromToken() {
    return ((JwtAuthenticationToken) SecurityContextHolder.getContext().getAuthentication())
        .getTokenAttributes().get("https://rota-flex-101.com/claims/email").toString();
  }

  /**
   * Finds the user in the database using the email provided by access token.
   *
   * @return {@link Staff} optional with that email.
   */
  public Optional<Staff> getUserFromJson() {
    return staffService.findStaffByEmail(getEmailFromToken());
  }
}
