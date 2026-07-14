import {
  avatarGradientByIndex,
  AVATAR_GRADIENT_KEYS,
} from "@/components/ui/Avatar/avatar-gradients";

/** Gradient avatar ổn định theo seed — dùng ở feature layer. */
export function resolveAvatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return avatarGradientByIndex(hash);
}

export { AVATAR_GRADIENT_KEYS };
