import { User } from "../../typeORM/entity/user.entity";
import { ResetPassword } from "../../typeORM/entity/resetPassword.entity";
import { getRepository } from "typeorm";

export async function validateResetPasswordToken(
  token: string,
  actualTime: string
) {
  const resetPasswordRepository = getRepository(ResetPassword);
  const resetPassword = await resetPasswordRepository.findOne({
    where: { token },
  });

  if (!resetPassword) {
    throw new Error("Token no encontrado");
  }

  const actualDate = new Date(actualTime);
  const expiresAt = new Date(resetPassword.expiresAt);

  if (actualDate > expiresAt) {
    throw new Error("Token expirado");
  }

  return true;
}
