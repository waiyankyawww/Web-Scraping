import { BigQueryDatetime } from "@google-cloud/bigquery";

export interface JobImgsRecord {
  src: string;
}

export interface AppealTagsRecord {
  tag: string;
}

export interface NearestStationsRecord {
  stationName: string;
}

export interface WorkingAtmosphereRecord {
  firstOption: string;
  secondOption: string;
  active: string;
}

export interface Job {
  redirectLink: string;
  jobId: string;
  companyIdStr: string;
  companyId: number;
  companyName: string;
  jobTitle: string;
  hiringStatus: string;
  jobCaptionTitle: string;
  jobCaptionTxt: string;
  jobImgs: JobImgsRecord[];
  salary: string;
  workingHours: string;
  appealTags: AppealTagsRecord[];
  occupation: string;
  qualification: string;
  workLocation: string;
  workingPeriod: string;
  holidays: string;
  shiftDetails: string;
  numberOfApplicants: string;
  transportationCosts: string;
  benefits: string;
  jobRemarks: string;
  nearestStations: NearestStationsRecord[];
  employeeComposition: string;
  workingAtmosphere: WorkingAtmosphereRecord[];
  workingStyles: string;
  applicationMethod: string;
  processAfterApplication: string;
  selectionProcess: string;
  jobAge: string;
  businessContent: string;
  companyAddress: string;
  contactInformation: string;
  homePage: string;
  remainingDays: string;
  crawledDateStr: string;
  crawledDate: BigQueryDatetime;
}

export interface Status{
  jobId : string;
  companyId : string;
  pageNo : number;
  url : string;
  crawlStatus : string;
  createdAt : BigQueryDatetime
}