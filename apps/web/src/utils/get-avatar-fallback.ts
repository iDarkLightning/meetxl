export const getAvatarFallback = (name: string | null) =>
  name
    ? name
        .split(" ")
        .reduce((prev, cur) => (prev += cur.substring(0, 1).toUpperCase()), "")
    : "";
