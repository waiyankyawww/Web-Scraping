declare global {
    namespace NodeJS {
      interface ProcessEnv {
        NODE_ENV: "development" | "production";
        URL: string;
        INTERVAL: string;
        PROJECT_ID: string;
        BUCKET_NAME: string;
        LOCAL_FILE_PATH: string;
        DATASET_ID: string;
        TABLE_ID: string;
        GCS_FILE_PATH: string;
        PORT: string;
      }
    }
  }
  export {};