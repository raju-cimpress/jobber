import { applyDecorators, Injectable, SetMetadata } from '@nestjs/common';
import { JobMetadata } from '../interfaces/job-metadata.interface';

export const JOB_METADATA_KEY = 'job_metadata';

export const Job = (metadata: JobMetadata) =>
  applyDecorators(SetMetadata(JOB_METADATA_KEY, metadata), Injectable());
