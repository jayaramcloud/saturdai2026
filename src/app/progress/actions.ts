"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { markWeekComplete, unmarkWeekComplete, checkInToday } from "@/lib/db";

async function requireEmail() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    throw new Error("Not signed in");
  }
  return email;
}

export async function toggleWeek(week: number, completed: boolean) {
  const email = await requireEmail();
  if (completed) {
    await unmarkWeekComplete(email, week);
  } else {
    await markWeekComplete(email, week);
  }
  revalidatePath("/progress");
}

export async function checkIn() {
  const email = await requireEmail();
  await checkInToday(email);
  revalidatePath("/progress");
}
