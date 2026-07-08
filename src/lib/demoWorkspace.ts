import type { SecondaryUser } from "../context/SecondaryUsersContext";

export const DEMO_WORKSPACE_EMAIL = "parent.threadline@example.com";
export const DEMO_PARENT_NICKNAME = "Primary parent";

export const DEMO_SECONDARY_USERS: SecondaryUser[] = [
  {
    id: "su-partner",
    name: "Alex Morgan",
    role: "Partner",
    email: "alex.morgan@example.com",
    access: "full",
  },
  {
    id: "su-teacher",
    name: "Ms. Carter",
    role: "Teacher",
    email: "carter@oakwood.edu",
    access: "partial",
  },
];
