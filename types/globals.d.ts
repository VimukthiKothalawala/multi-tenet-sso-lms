export {};

declare global {
  interface UserPublicMetadata {
    role?: "student" | "teacher";
  }
}
