import { API_URL } from "../../../config";
import type {
  Announcement,
  AnnouncementType,
  CreateAnnouncementPayload,
  UpdateAnnouncementPayload,
} from "./types";

function getAccessToken(): string | null {
  return localStorage.getItem("accessToken");
}

function buildAuthHeaders(): HeadersInit {
  const token = getAccessToken();

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();

    if (response.status === 401) {
      throw new Error("Session expirée ou accès non autorisé.");
    }

    throw new Error(text || `Erreur API (${response.status})`);
  }

  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return response.text() as unknown as T;
}

function buildAnnouncementFormData(
  payload: CreateAnnouncementPayload | UpdateAnnouncementPayload
): FormData {
  const formData = new FormData();

  formData.append("title", payload.title);
  formData.append("short_Description", payload.short_Description);
  formData.append("content", payload.content);
  formData.append("publication_Date", payload.publication_Date);
  formData.append("id_Announcement_Type", String(payload.id_Announcement_Type));
  formData.append("is_Published", String(payload.is_Published));
  formData.append("slug", payload.slug);

  if (payload.cover_Image) {
    formData.append("cover_Image", payload.cover_Image);
  }

  return formData;
}

export async function getAnnouncements(): Promise<Announcement[]> {
  const response = await fetch(`${API_URL}/api/admin/announcements`, {
    method: "GET",
    headers: buildAuthHeaders(),
  });

  return handleResponse<Announcement[]>(response);
}

export async function getAnnouncementById(id: number): Promise<Announcement> {
  const response = await fetch(`${API_URL}/api/admin/announcements/${id}`, {
    method: "GET",
    headers: buildAuthHeaders(),
  });

  return handleResponse<Announcement>(response);
}

export async function getAnnouncementTypes(): Promise<AnnouncementType[]> {
  const response = await fetch(`${API_URL}/api/admin/announcement-types`, {
    method: "GET",
    headers: buildAuthHeaders(),
  });

  return handleResponse<AnnouncementType[]>(response);
}

export async function createAnnouncement(
  payload: CreateAnnouncementPayload
): Promise<Announcement> {
  const formData = buildAnnouncementFormData(payload);

  const response = await fetch(`${API_URL}/api/admin/announcements`, {
    method: "POST",
    headers: buildAuthHeaders(),
    body: formData,
  });

  console.log("CREATE ANNOUNCEMENT CALL");
  return handleResponse<Announcement>(response);
}

export async function updateAnnouncement(
  payload: UpdateAnnouncementPayload
): Promise<Announcement> {
  const formData = buildAnnouncementFormData(payload);

  const response = await fetch(
    `${API_URL}/api/admin/announcements/${payload.id_Announcement}`,
    {
      method: "PUT",
      headers: buildAuthHeaders(),
      body: formData,
    }
  );

  return handleResponse<Announcement>(response);
}

export async function deleteAnnouncement(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/admin/announcements/${id}`, {
    method: "DELETE",
    headers: buildAuthHeaders(),
  });

  if (!response.ok) {
    const text = await response.text();

    if (response.status === 401) {
      throw new Error("Session expirée ou accès non autorisé.");
    }

    throw new Error(text || "Impossible de supprimer l'annonce.");
  }
}