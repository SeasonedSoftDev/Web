import { Logger } from '@nestjs/common';
import { formatTime } from '../formatters';

export abstract class JobService {
  protected logger = new Logger(JobService.name);
  protected jobsRunning: { [jobName: string]: boolean } = {};

  constructor(logger?: Logger) {
    if (logger) this.logger = logger;
  }

  async jobWrapper(
    jobName: string,
    jobFunction: (context?: any) => Promise<void>,
  ) {
    if (!this.jobsRunning[jobName]) {
      const start = Date.now();
      this.jobsRunning[jobName] = true;
      this.logger.log(`Job ${jobName} is running`);

      try {
        await jobFunction(this);
      } catch (err) {
        this.logger.error(`Job ${jobName} failed: ${err.message}`);
      }
      this.jobsRunning[jobName] = false;
      this.logger.log(`Job ${jobName} is stopped`);
      const end = Date.now();
      const executionTime = end - start;
      this.logger.warn(
        `Job ${jobName} executed in ${formatTime(executionTime)}`,
      );
    } else {
      this.logger.warn(`Job ${jobName} is already running: skipped`);
    }
  }
}
