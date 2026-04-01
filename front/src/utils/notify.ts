import { notifications } from "@mantine/notifications";

type NotifyOptions = {
  title: string;
  message: string;
};

export function notifySuccess({ title, message }: NotifyOptions) {
  notifications.show({
    title,
    message,
    color: "green",
    radius: "md",
    autoClose: 3000,
  });
}

export function notifyError({ title, message }: NotifyOptions) {
  notifications.show({
    title,
    message,
    color: "red",
    radius: "md",
    autoClose: 4500,
  });
}

export function notifyInfo({ title, message }: NotifyOptions) {
  notifications.show({
    title,
    message,
    color: "blue",
    radius: "md",
    autoClose: 3000,
  });
}