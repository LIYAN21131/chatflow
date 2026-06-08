export function formatDeadline(deadline: string) {
  return deadline.replace(" ", "  ");
}

export function getNowIso() {
  return new Date().toISOString();
}
