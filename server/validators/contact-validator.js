const { z } = require("zod");

const contactSchema = z.object({
  username: z.string({ required_error: "Username is required" }).trim(),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email({ message: "Invalid email address" }),
  message: z.string({ required_error: "Message is required" }).trim(),
});

module.exports = contactSchema;
