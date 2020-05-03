package com.rota.api;

import com.rota.api.dto.EngagementDto;
import com.rota.auth.AuthenticationUtils;
import com.rota.database.orm.engagement.EngagementRepository;
import com.rota.database.orm.staff.Role;
import com.rota.database.orm.staff.Staff;
import com.rota.database.orm.staff.StaffRepository;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class StaffService {
  @Autowired
  EngagementRepository engagementRepository;

  @Autowired
  StaffRepository staffRepository;

  /**
   * Returns staff member's engagements between start and end dates (inclusive).
   * Specifically engagements that start after the start date and end before the end date.
   * Both start and end dates are optional and can be left as null.
   *
   * @param staffId Staff member's ID
   * @param start   start date or null to get from the beginning
   * @param end     end date
   * @return A list of member's engagements
   */
  public List<EngagementDto> getStaffEngagementsBetween(int staffId, Instant start, Instant end) {
    Instant startTime = start == null ? Instant.MIN : start;
    Instant endTime = end == null ? Instant.MAX : end;
    return engagementRepository.findByStaffId(staffId).stream()
        .filter(engagement ->
            !engagement.getStart().isBefore(startTime)
                && !engagement.getEnd().isAfter(endTime))
        .map(EngagementDto::fromEngagement)
        .collect(Collectors.toList());
  }

  /**
   * Adds a new staff entity to the database.
   *
   * @param newStaff {@link Staff} to be added.
   * @return {@link Staff} object which has just been created.
   */
  public Staff createStaff(Staff newStaff) {
    return staffRepository.save(newStaff);
  }

  /**
   * Checks to see if the current user is a manager.
   *
   * @param authString the current threads authentication token.
   * @return true if user has manager permissions.
   */
  public boolean hasManagerPermissions(String authString) {
    final Role role = AuthenticationUtils
        .getUserRoleFromToken(authString)
        .orElseThrow(() ->
            new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Failed to authorize.")
        );
    return role == Role.MANAGER;
  }

  /**
   * Returns the list of all active staff members.
   *
   * @return A list of all active staff members.
   */
  public List<Staff> getActiveStaff() {
    return staffRepository.findAll().stream()
        .filter(staff -> !staff.isInactive())
        .collect(Collectors.toList());
  }
}