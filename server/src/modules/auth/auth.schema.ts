import { object, string, TypeOf } from "zod";

export const loginSchema = {
  body: object({
    email: string({
      required_error: "Email is erquired",
    }).email("Not a valid email address"),
    password: string({
      required_error: "Password is required",
    })
      .min(6, "password must be atleast 6 characters")
      .max(63, "password must not be longer than 64 characters long"),
  }),
};

export type LoginBody = TypeOf<typeof loginSchema.body>;
