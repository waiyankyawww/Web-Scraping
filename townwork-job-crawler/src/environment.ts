declare global {
    namespace NodeJS {
      interface ProcessEnv {
        NODE_ENV: "development" | "production";
        DATASET_ID: string;
        TABLE_ID: string;
        PORT: string;
      }
    }
  }
  export {};
