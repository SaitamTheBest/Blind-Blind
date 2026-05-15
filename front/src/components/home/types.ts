export interface AnnouncementType {
  id_Announcement_Type: number;
  label: string;
  is_Important: boolean;
}

export interface Announcement {
  id_Announcement: number;
  title: string;
  short_Description: string;
  cover_Image: string;
  content: string;
  publication_Date: string;
  created_At: string;
  updated_At: string;
  id_Announcement_Type: number;
  id_Author: string;
  is_Published: boolean;
  slug: string;
  announcement_Type?: AnnouncementType;
  author_Name?: string;
}