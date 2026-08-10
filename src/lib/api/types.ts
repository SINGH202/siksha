export type UserRole = "parent" | "teacher";

export type PublicUser = {
  id: string;
  phone: string;
  role: UserRole | null;
};

export type ApiErrorBody = {
  statusCode: number;
  code: string;
  message: string;
};

export type AuthTokensResponse = {
  accessToken: string;
  refreshToken: string;
  user: PublicUser;
};

export type SetRoleResponse = {
  accessToken: string;
  user: PublicUser;
};

export type RequestOtpResponse = {
  ok: true;
  devCode?: string;
};

export type ParentProfile = {
  id: string;
  userId: string;
  name: string;
  locality: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TeacherProfile = {
  id: string;
  userId: string;
  name: string;
  bio: string;
  subjects: string[];
  classes: string[];
  localities: string[];
  coversAllLocalities: boolean;
  feeMin: number | null;
  feeMax: number | null;
  photoKey: string | null;
  verificationStatus: "unverified" | "pending" | "verified" | "rejected";
  createdAt: string;
  updatedAt: string;
};

export type ParentProfileMe = {
  user: PublicUser & { role: "parent" };
  profile: ParentProfile | null;
  isComplete: boolean;
};

export type TeacherProfileMe = {
  user: PublicUser & { role: "teacher" };
  profile: TeacherProfile | null;
  isComplete: boolean;
};

export type ProfileMeResponse =
  | ParentProfileMe
  | TeacherProfileMe
  | {
      user: PublicUser & { role: null };
      profile: null;
      isComplete: false;
    };

export function isParentProfileMe(
  data: ProfileMeResponse
): data is ParentProfileMe {
  return data.user.role === "parent";
}

export function isTeacherProfileMe(
  data: ProfileMeResponse
): data is TeacherProfileMe {
  return data.user.role === "teacher";
}

export type UpdateParentProfileInput = {
  name: string;
  locality?: string;
};

export type UpdateTeacherProfileInput = {
  name: string;
  bio?: string;
  subjects: string[];
  classes: string[];
  localities: string[];
  coversAllLocalities: boolean;
  feeMin?: number;
  feeMax?: number;
};

export type RequirementMode = "home" | "online";
export type RequirementStatus = "open" | "applicants" | "hired" | "closed";
export type ClassLabel = "8" | "9" | "10" | "11" | "12";

export type Requirement = {
  id: string;
  parentId: string;
  title: string;
  classLabel: ClassLabel;
  board: string | null;
  subjects: string[];
  locality: string;
  mode: RequirementMode;
  schedule: string;
  scheduleDetail: string | null;
  note: string | null;
  budget: string | null;
  status: RequirementStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateRequirementInput = {
  title: string;
  classLabel: ClassLabel;
  board?: string;
  subjects: string[];
  locality: string;
  mode: RequirementMode;
  schedule: string;
  scheduleDetail?: string;
  note?: string;
  budget?: string;
};

export type UpdateRequirementInput = Partial<CreateRequirementInput> & {
  status?: "closed";
};

export type ApplicationStatus =
  | "pending"
  | "shortlisted"
  | "rejected"
  | "withdrawn";

export type Application = {
  id: string;
  requirementId: string;
  teacherId: string;
  note: string;
  proposedFee: number | null;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
};

export type RequirementApplication = Application & {
  teacher: {
    id: string;
    teacherProfile: Omit<
      TeacherProfile,
      "id" | "userId" | "createdAt" | "updatedAt"
    > | null;
  };
};

export type CreateApplicationInput = {
  note: string;
  proposedFee?: number;
};
