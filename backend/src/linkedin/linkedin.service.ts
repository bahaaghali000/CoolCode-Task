import { Injectable } from '@nestjs/common';
import { Builder, By, Key, until, WebDriver } from 'selenium-webdriver';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class LinkedinService {
  async scrapeUserData(user: any): Promise<any> {
    let driver: WebDriver;
    try {
      driver = await new Builder().forBrowser('chrome').build();

      await driver.get('https://www.linkedin.com');

      await driver.wait(until.titleIs('LinkedIn'), 30 * 60 * 60 * 1000);

      const name = await driver
        .findElement(By.className('profile-name'))
        .getText();
      const profileUrl = await driver.getCurrentUrl();

      const photoElement = await driver.findElement(
        By.className('profile-photo'),
      );

      const photoUrl = await photoElement.getAttribute('src');

      if (photoUrl) {
        user.avatarUrl = photoUrl;
        await user.save();
      }
      return 'Updated';
    } finally {
      // Close the WebDriver session/
      if (driver) {
        await driver.quit();
      }
    }
  }
}
