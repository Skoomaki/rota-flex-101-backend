package com.rota.database;

import com.rota.database.orm.engagement.Engagement;
import com.rota.database.orm.engagement.EngagementRepository;
import com.rota.database.orm.engagement.EngagementType;
import com.rota.database.orm.staff.Role;
import com.rota.database.orm.staff.Staff;
import com.rota.database.orm.staff.StaffRepository;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.test.annotation.DirtiesContext;

@EnableJpaRepositories
@DataJpaTest
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
class DbHandlerTests {
  @Autowired
  StaffRepository staffRepository;
  @Autowired
  EngagementRepository engagementRepository;

  static final int STAFF_ID = 5;
  static final int ENGAGEMENT_ID = 9;
  static final Staff.StaffBuilder STAFF_BUILDER = Staff.builder()
      .id(STAFF_ID)
      .firstName("Grzegorz")
      .surname("Brzeczyszczykiewicz")
      .active(true)
      .startDate(LocalDate.of(2020, 4, 12))
      .contractedHours(10.0)
      .hourlyRate(40.0)
      .role(Role.USER)
      .jobTitle("Sprzatacz");

  static final Staff STAFF_MEMBER = STAFF_BUILDER.build();

  static final Engagement.EngagementBuilder ENGAGEMENT_BUILDER = Engagement.builder()
      .id(ENGAGEMENT_ID)
      .staff(STAFF_MEMBER)
      .type(EngagementType.SHIFT);

  static final Engagement ENGAGEMENT_1 = ENGAGEMENT_BUILDER
      .start(Instant.parse("2020-04-13T00:00:00Z"))
      .end(Instant.parse("2020-04-13T20:00:00Z"))
      .build();

  static final Engagement ENGAGEMENT_2 = ENGAGEMENT_BUILDER
      .id(ENGAGEMENT_ID + 1)
      .start(Instant.parse("2020-04-12T10:00:00Z"))
      .end(Instant.parse("2020-04-15T18:00:00Z"))
      .build();


  @Test
  void addStaff() {
    staffRepository.save(STAFF_MEMBER);
    Assertions.assertEquals(
        STAFF_MEMBER,
        staffRepository.findById(STAFF_ID)
    );
  }

  @Test
  void addMultipleEngagements() {
    staffRepository.save(STAFF_MEMBER);
    engagementRepository.save(ENGAGEMENT_1);
    engagementRepository.save(ENGAGEMENT_2);
    Assertions.assertEquals(
        List.of(ENGAGEMENT_1, ENGAGEMENT_2),
        engagementRepository.findByStaffId(STAFF_ID)
    );
  }

  @Test
  void modifyStaff() {
    final String newName = "Szczepan";
    final double newHours = 42.0;
    final Staff updatedStaff = STAFF_BUILDER
        .firstName(newName)
        .contractedHours(newHours)
        .build();
    staffRepository.save(STAFF_MEMBER);
    Staff savedStaff = staffRepository.findById(STAFF_ID);
    savedStaff.setFirstName(newName);
    savedStaff.setContractedHours(newHours);

    Assertions.assertEquals(
        updatedStaff,
        staffRepository.findById(STAFF_ID)
    );
  }

  @Test
  void updateEngagement() {
    final Instant updatedStarttime = Instant.parse("2020-04-13T01:00:01Z");
    final Instant updatedEndtime = Instant.parse("2020-04-13T21:00:00Z");
    staffRepository.save(STAFF_MEMBER);
    engagementRepository.save(ENGAGEMENT_1);
    Engagement engagement = engagementRepository.findById(ENGAGEMENT_ID);
    engagement.setStart(updatedStarttime);
    engagement.setEnd(updatedEndtime);
    Assertions.assertEquals(
        List.of(ENGAGEMENT_BUILDER
            .id(ENGAGEMENT_ID)
            .start(updatedStarttime)
            .end(updatedEndtime)
            .build()),
        engagementRepository.findByStaffId(STAFF_ID)
    );
  }

  @Test
  void removeStaff() {
    staffRepository.save(STAFF_MEMBER);
    staffRepository.delete(STAFF_MEMBER);
    Assertions.assertNull(
        staffRepository.findById(STAFF_ID)
    );
  }

  @Test
  void removeEngagement() {
    staffRepository.save(STAFF_MEMBER);
    engagementRepository.save(ENGAGEMENT_1);
    engagementRepository.delete(ENGAGEMENT_1);
    Assertions.assertEquals(
        List.of(),
        engagementRepository.findByStaffId(STAFF_ID)
    );
  }
}
