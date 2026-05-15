import { API_URL } from "../../config";
import type { Announcement } from "./types";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Une erreur API est survenue.");
  }

  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return response.text() as unknown as T;
}

export async function getPublishedAnnouncements(): Promise<Announcement[]> {
  const response = await fetch(`${API_URL}/api/Admin/announcements`, {
    method: "GET",
  });

  const data = await handleResponse<Announcement[]>(response);

  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .filter((announcement) => announcement.is_Published)
    .sort((a, b) => {
      const aImportant = a.announcement_Type?.is_Important ? 1 : 0;
      const bImportant = b.announcement_Type?.is_Important ? 1 : 0;

      if (aImportant !== bImportant) {
        return bImportant - aImportant;
      }

      return (
        new Date(b.publication_Date).getTime() -
        new Date(a.publication_Date).getTime()
      );
    });
}