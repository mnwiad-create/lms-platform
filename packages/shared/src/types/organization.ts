export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  createdAt: string;
}

export interface OrgUnit {
  id: string;
  nameTh: string;
  nameEn: string;
  parentId: string | null;
  orgId: string;
  level: number;
  sortOrder: number;
  children?: OrgUnit[];
}
