package org.camunda.optimize.upgrade;

import org.camunda.optimize.upgrade.plan.UpgradePlan;
import org.camunda.optimize.upgrade.plan.UpgradePlanBuilder;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import static junit.framework.TestCase.fail;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;

public class OverwriteConfigurationsTest extends AbstractUpgradeTest {

  private static final String TEST_INDEX = "test-index";

  @Before
  public void setUp() throws Exception {
    deleteEnvFolderWithConfig();
  }

  @After
  public void cleanUp() throws Exception {
    deleteEnvFolderWithConfig();
  }

  @Test
  public void verifyDateFormatEnhancedFromConfig() throws Exception {
    // given
    createEnvConfig(
      "es:\n" +
      "  host: foo"
    );

    UpgradePlan upgradePlan = UpgradePlanBuilder.createUpgradePlan()
      .fromVersion("2.0.0")
      .toVersion("2.1.0")
      .build();

    try {
      // when
      upgradePlan.execute();
      fail("Should throw an error, since the Elasticsearch host 'foo' does not exist!");
    } catch (Exception e) {
      // then this should throw an error
    }

  }

}
